'use server';

/**
 * @fileOverview AI-powered tool that enhances text prompts for generating better thumbnail images.
 *
 * - enhanceThumbnailPrompt - A function that enhances the thumbnail prompt.
 * - EnhanceThumbnailPromptInput - The input type for the enhanceThumbnailPrompt function.
 * - EnhanceThumbnailPromptOutput - The return type for the enhanceThumbnailPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceThumbnailPromptInputSchema = z.object({
  prompt: z.string().describe('The text prompt to enhance for thumbnail generation.'),
});
export type EnhanceThumbnailPromptInput = z.infer<typeof EnhanceThumbnailPromptInputSchema>;

const EnhanceThumbnailPromptOutputSchema = z.object({
  enhancedPrompt: z.string().describe('The enhanced text prompt for better thumbnail generation.'),
});
export type EnhanceThumbnailPromptOutput = z.infer<typeof EnhanceThumbnailPromptOutputSchema>;

export async function enhanceThumbnailPrompt(input: EnhanceThumbnailPromptInput): Promise<EnhanceThumbnailPromptOutput> {
  return enhanceThumbnailPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceThumbnailPromptPrompt',
  input: {schema: EnhanceThumbnailPromptInputSchema},
  output: {schema: EnhanceThumbnailPromptOutputSchema},
  prompt: `You are an AI prompt enhancer, skilled at improving text prompts for AI thumbnail generation.

  Your goal is to take the user's prompt and rewrite it to be more effective at generating high-quality thumbnails.
  Consider the following aspects when enhancing the prompt:

  - Clarity: Ensure the prompt is clear, specific, and easy to understand.
  - Detail: Add relevant details that can help the AI better understand the desired thumbnail.
  - Creativity: Inject creative elements that can make the thumbnail more visually appealing.
  - Keywords: Incorporate relevant keywords that are known to produce better results.

  Original Prompt: {{{prompt}}}

  Enhanced Prompt:`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const enhanceThumbnailPromptFlow = ai.defineFlow(
  {
    name: 'enhanceThumbnailPromptFlow',
    inputSchema: EnhanceThumbnailPromptInputSchema,
    outputSchema: EnhanceThumbnailPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
