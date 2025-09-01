'use server';

/**
 * @fileOverview This file contains the Genkit flow for generating a thumbnail image from a text prompt, with an optional base image for image-to-image generation.
 *
 * - generateThumbnail - A function that takes a prompt and optionally an image and generates a new image.
 * - GenerateThumbnailInput - The input type for the generateThumbnail function.
 * - GenerateThumbnailOutput - The return type for the generateThumbnail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const GenerateThumbnailInputSchema = z.object({
  prompt: z.string().describe('The text prompt for generating the thumbnail image.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional base photo for image-to-image generation, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type GenerateThumbnailInput = z.infer<typeof GenerateThumbnailInputSchema>;

const GenerateThumbnailOutputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The generated image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type GenerateThumbnailOutput = z.infer<typeof GenerateThumbnailOutputSchema>;

export async function generateThumbnail(input: GenerateThumbnailInput): Promise<GenerateThumbnailOutput> {
  return generateThumbnailFlow(input);
}

const generateThumbnailFlow = ai.defineFlow(
  {
    name: 'generateThumbnailFlow',
    inputSchema: GenerateThumbnailInputSchema,
    outputSchema: GenerateThumbnailOutputSchema,
  },
  async (input) => {
    let media;
    
    if (input.photoDataUri) {
      // Image-to-image generation
      const result = await ai.generate({
        model: googleAI.model('gemini-2.0-flash-preview-image-generation'),
        prompt: [
          {text: `You are an AI image editor. Your task is to modify the provided image based on my instructions. Do not replace the image, but instead, use it as a background or a layer and add the new elements on top of it. Preserve the original image as much as possible, only making the requested additions or changes.

My request is: ${input.prompt}`},
          {media: {url: input.photoDataUri!}},
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });
      media = result.media;
    } else {
      // Text-to-image generation
      const result = await ai.generate({
        model: googleAI.model('imagen-4.0-fast-generate-001'),
        prompt: input.prompt
      });
      media = result.media;
    }

    if (!media || !media.url) {
        throw new Error('Image generation failed to return any media. Please try a different prompt.');
    }
    
    const imageDataUri = media.url;
    if (!imageDataUri) {
        throw new Error('Image generation failed to return a data URI.');
    }

    return { imageDataUri };
  }
);
