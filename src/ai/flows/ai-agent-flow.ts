'use server';
/**
 * @fileOverview AstraX Autonomous AI Agent Flow.
 * 
 * - Handles reasoning, memory, and autonomous tool calling for bot commands.
 * - Prioritizes Groq (Llama-3-70b) for high-performance agentic behavior.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import axios from 'axios';

const AiAgentInputSchema = z.object({
  message: z.string().describe('The user\'s inbound message.'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).describe('Conversation history for the current chat.'),
  commands: z.array(z.object({
    name: z.string(),
    description: z.string(),
    usage: z.string()
  })).describe('Manifest of available bot commands.'),
  context: z.object({
    sender: z.string(),
    pushName: z.string(),
    isGroup: z.boolean(),
    quotedText: z.string().optional()
  })
});
export type AiAgentInput = z.infer<typeof AiAgentInputSchema>;

const AiAgentOutputSchema = z.object({
  response: z.string().describe('The textual response to the user.'),
  executeCommand: z.object({
    name: z.string(),
    args: z.array(z.string())
  }).optional().describe('Details of a command to trigger autonomously.')
});
export type AiAgentOutput = z.infer<typeof AiAgentOutputSchema>;

/**
 * Primary Reasoning Engine using Groq for Task-Oriented logic.
 */
async function groqAgentReasoning(input: AiAgentInput): Promise<AiAgentOutput | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const systemPrompt = `You are the AstraX Enterprise AI Agent. 
You manage a professional WhatsApp bot. 
User Identity: ${input.context.pushName} (@${input.context.sender.split('@')[0]})
Environment: ${input.context.isGroup ? 'Group Chat' : 'Private DM'}

AVAILABLE COMMANDS:
${JSON.stringify(input.commands, null, 2)}

INSTRUCTIONS:
1. Analyze the user's message.
2. If the user wants to perform a task that matches an available command (e.g., play music, search wiki, ban user, flip coin), you MUST return a structured command call.
3. If no command is relevant, engage in a helpful, context-aware conversation.
4. Use the provided history for continuity.
5. If the user refers to a previous message or a "replied" message, use input.context.quotedText.

OUTPUT FORMAT (JSON ONLY):
{
  "response": "Brief acknowledgment of the action or helpful reply",
  "executeCommand": { "name": "command_name", "args": ["arg1", "arg2"] } // Optional
}`;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...input.history.map(h => ({ role: h.role, content: h.content })),
          { role: 'user', content: input.message + (input.context.quotedText ? ` [Replied to: ${input.context.quotedText}]` : '') }
        ],
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = JSON.parse(response.data.choices[0]?.message?.content || '{}');
    return {
      response: result.response || "Task processed.",
      executeCommand: result.executeCommand
    };
  } catch (error) {
    console.error('Groq Agent Error:', error);
    return null;
  }
}

/**
 * Universal Zero-Key Fallback (Basic Chat).
 */
async function fallbackChat(message: string): Promise<AiAgentOutput> {
  const urls = [
    `https://api.agatz.xyz/api/smart_ai?message=${encodeURIComponent(message)}`,
    `https://api.vytmp3.com/ai?query=${encodeURIComponent(message)}`
  ];

  for (const url of urls) {
    try {
      const res = await axios.get(url);
      const ans = res.data.data || res.data.result || res.data.ans;
      if (ans) return { response: ans };
    } catch (e) { continue; }
  }
  return { response: "I'm experiencing high latency in my cognitive nodes. Please try again." };
}

export async function aiAgentProcess(input: AiAgentInput): Promise<AiAgentOutput> {
  // 1. Attempt High-Performance Groq Agent
  const groqResult = await groqAgentReasoning(input);
  if (groqResult) return groqResult;

  // 2. Attempt Genkit Standard Flow
  try {
    const {output} = await aiAgentFlow(input);
    if (output) return output;
  } catch (e) {}

  // 3. Absolute Fallback (Text-Only)
  return await fallbackChat(input.message);
}

const aiAgentFlow = ai.defineFlow(
  {
    name: 'aiAgentFlow',
    inputSchema: AiAgentInputSchema,
    outputSchema: AiAgentOutputSchema,
  },
  async (input) => {
    const prompt = ai.definePrompt({
      name: 'aiAgentPrompt',
      input: {schema: AiAgentInputSchema},
      output: {schema: AiAgentOutputSchema},
      prompt: `You are the AstraX AI Assistant. 
      Commands: {{#each commands}} - {{name}}: {{description}} {{/each}}
      User said: {{{message}}}
      History: {{#each history}} [{{role}}]: {{{content}}} {{/each}}
      Reply helpfully.`
    });

    const {output} = await prompt(input);
    return output!;
  }
);
