'use server';
/**
 * @fileOverview This file defines a Genkit flow for handling AI chat conversations.
 *
 * - aiChatConversation - A function that handles intelligent, context-aware responses from an AI assistant.
 * - AiChatConversationInput - The input type for the aiChatConversation function.
 * - AiChatConversationOutput - The return type for the aiChatConversation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

// Exported wrapper function to call the Genkit flow.
export async function aiChatConversation(input: AiChatConversationInput): Promise<AiChatConversationOutput> {
  return aiChatConversationFlow(input);
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
