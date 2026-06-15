'use server';
/**
 * @fileOverview A Genkit flow for AI-powered content moderation.
 *
 * - aiContentModeration - A function that handles the AI content moderation process.
 * - AIContentModerationInput - The input type for the aiContentModeration function.
 * - AIContentModerationOutput - The return type for the aiContentModeration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIContentModerationInputSchema = z.object({
  message: z.string().describe('The message content to moderate.'),
});
export type AIContentModerationInput = z.infer<typeof AIContentModerationInputSchema>;

const AIContentModerationOutputSchema = z.object({
  isAppropriate: z.boolean().describe('True if the message is appropriate, false otherwise.'),
  reason: z.string().describe('A concise reason if the message is inappropriate, otherwise an empty string.'),
});
export type AIContentModerationOutput = z.infer<typeof AIContentModerationOutputSchema>;

export async function aiContentModeration(input: AIContentModerationInput): Promise<AIContentModerationOutput> {
  return aiContentModerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentModerationPrompt',
  input: {schema: AIContentModerationInputSchema},
  output: {schema: AIContentModerationOutputSchema},
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
  prompt: `You are a content moderation AI. Your task is to analyze user messages for inappropriate content such as hate speech, harassment, sexually explicit content, or dangerous content.

Determine if the message is appropriate or inappropriate based on general community guidelines. If it is inappropriate, provide a concise reason explaining which category it falls into and why.

Message: {{{message}}}`,
});

const aiContentModerationFlow = ai.defineFlow(
  {
    name: 'aiContentModerationFlow',
    inputSchema: AIContentModerationInputSchema,
    outputSchema: AIContentModerationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      // Fallback if the model somehow doesn't return structured output
      // This should ideally not happen with a strong output schema.
      return { isAppropriate: true, reason: 'Unable to determine appropriateness due to empty model output.' };
    }
    return output;
  }
);
