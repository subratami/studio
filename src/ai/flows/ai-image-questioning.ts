'use server';

/**
 * @fileOverview This file contains the Genkit flow for AI-driven suggestions for thumbnail design based on user questions about an uploaded image.
 *
 * - aiImageQuestioning - A function that processes user questions and generates thumbnail design suggestions.
 * - AIImageQuestioningInput - The input type for the aiImageQuestioning function.
 * - AIImageQuestioningOutput - The return type for the aiImageQuestioning function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIImageQuestioningInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to use as a thumbnail base, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  userQuestion: z.string().describe('The user question about the image.'),
});
export type AIImageQuestioningInput = z.infer<typeof AIImageQuestioningInputSchema>;

const AIImageQuestioningOutputSchema = z.object({
  thumbnailSuggestion: z.string().describe('AI-driven suggestions for thumbnail design.'),
});
export type AIImageQuestioningOutput = z.infer<typeof AIImageQuestioningOutputSchema>;

export async function aiImageQuestioning(input: AIImageQuestioningInput): Promise<AIImageQuestioningOutput> {
  return aiImageQuestioningFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiImageQuestioningPrompt',
  input: {schema: AIImageQuestioningInputSchema},
  output: {schema: AIImageQuestioningOutputSchema},
  prompt: `You are an AI thumbnail design assistant. A user has uploaded an image and asked a question about it. Use the image and question to suggest a relevant thumbnail design.

Image: {{media url=photoDataUri}}
Question: {{{userQuestion}}}

Suggestion: `,
});

const aiImageQuestioningFlow = ai.defineFlow(
  {
    name: 'aiImageQuestioningFlow',
    inputSchema: AIImageQuestioningInputSchema,
    outputSchema: AIImageQuestioningOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
