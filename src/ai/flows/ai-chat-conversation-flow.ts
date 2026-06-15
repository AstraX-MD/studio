'use server';
/**
 * @fileOverview This file defines a Genkit flow for handling AI chat conversations.
 * It includes a high-performance fallback to Groq to ensure reliability across deployments.
 *
 * - aiChatConversation - A function that handles intelligent, context-aware responses from an AI assistant.
 * - AiChatConversationInput - The input type for the aiChatConversation function.
 * - AiChatConversationOutput - The return type for the aiChatConversation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import axios from 'axios';

// Define the input schema for the AI chat conversation.
const AiChatConversationInputSchema = z.object({
  message: z.string().describe('The user\'s message to the AI assistant, either a direct message or a mention in a group chat.'),
});
export type AiChatConversationInput = z.infer<typeof AiChatConversationInputSchema>;

// Define the output schema for the AI chat conversation.
const AiChatConversationOutputSchema = z.object({
  response: z.string().describe('The AI assistant\'s context-aware response to the user\'s message.'),
});
export type AiChatConversationOutput = z.infer<typeof AiChatConversationOutputSchema>;

/**
 * Fallback mechanism using Groq API for maximum reliability.
 */
async function groqFallback(message: string): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'system', content: 'You are AstraX, an intelligent AI assistant. Provide concise and relevant responses.' },
          { role: 'user', content: message }
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('Groq Fallback Error:', error);
    return null;
  }
}

/**
 * Universal AI Scraper Fallback (Zero-Key).
 */
async function publicProxyFallback(message: string): Promise<string | null> {
  const urls = [
    `https://api.agatz.xyz/api/smart_ai?message=${encodeURIComponent(message)}`,
    `https://api.vytmp3.com/ai?query=${encodeURIComponent(message)}`,
    `https://api.dlow.xyz/api/gpt4?q=${encodeURIComponent(message)}`
  ];

  for (const url of urls) {
    try {
      const res = await axios.get(url);
      const ans = res.data.data || res.data.result || res.data.ans;
      if (ans) return ans;
    } catch (e) {
      continue;
    }
  }
  return null;
}

// Exported wrapper function to call the Genkit flow with deep fallbacks.
export async function aiChatConversation(input: AiChatConversationInput): Promise<AiChatConversationOutput> {
  try {
    return await aiChatConversationFlow(input);
  } catch (error) {
    // If primary flow fails, attempt Groq
    const groqResponse = await groqFallback(input.message);
    if (groqResponse) return { response: groqResponse };

    // If Groq fails or no key, attempt Public Proxies
    const publicResponse = await publicProxyFallback(input.message);
    if (publicResponse) return { response: publicResponse };

    throw new Error('AI Subsystem is currently unreachable across all routes.');
  }
}

// Define the Genkit prompt for the AI chat conversation.
const aiChatConversationPrompt = ai.definePrompt({
  name: 'aiChatConversationPrompt',
  input: {schema: AiChatConversationInputSchema},
  output: {schema: AiChatConversationOutputSchema},
  prompt: `You are AstraX, an intelligent AI assistant designed to provide helpful and context-aware responses.
The user has sent the following message:

User message: {{{message}}}

Please provide a concise and relevant response.`,
});

// Define the Genkit flow for the AI chat conversation.
const aiChatConversationFlow = ai.defineFlow(
  {
    name: 'aiChatConversationFlow',
    inputSchema: AiChatConversationInputSchema,
    outputSchema: AiChatConversationOutputSchema,
  },
  async (input) => {
    const {output} = await aiChatConversationPrompt(input);
    if (!output) {
      throw new Error('AI failed to generate a response.');
    }
    return output;
  }
);
