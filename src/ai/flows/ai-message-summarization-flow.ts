'use server';
/**
 * @fileOverview A Genkit flow for summarizing a list of messages.
 *
 * - aiMessageSummarization - A function that handles the message summarization process.
 * - AIMessageSummarizationInput - The input type for the aiMessageSummarization function.
 * - AIMessageSummarizationOutput - The return type for the aiMessageSummarization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIMessageSummarizationInputSchema = z.object({
  messages: z.array(z.string()).describe('An array of messages to be summarized.'),
});
export type AIMessageSummarizationInput = z.infer<typeof AIMessageSummarizationInputSchema>;

const AIMessageSummarizationOutputSchema = z.object({
  summary: z.string().describe('The summarized content of the provided messages.'),
});
export type AIMessageSummarizationOutput = z.infer<typeof AIMessageSummarizationOutputSchema>;

export async function aiMessageSummarization(
  input: AIMessageSummarizationInput
): Promise<AIMessageSummarizationOutput> {
  return aiMessageSummarizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiMessageSummarizationPrompt',
  input: {schema: AIMessageSummarizationInputSchema},
  output: {schema: AIMessageSummarizationOutputSchema},
  prompt: `You are an AI assistant specialized in summarizing conversations.
Please summarize the following messages concisely, capturing the main points and key discussions.

Messages:
{{#each messages}}
- {{{this}}}
{{/each}}`,
});

const aiMessageSummarizationFlow = ai.defineFlow(
  {
    name: 'aiMessageSummarizationFlow',
    inputSchema: AIMessageSummarizationInputSchema,
    outputSchema: AIMessageSummarizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
