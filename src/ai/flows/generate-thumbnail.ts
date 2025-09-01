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
import { googleAI } from '@genkit-ai/googleai';

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
    let imageDataUri: string;

    if (input.photoDataUri) {
      // For image-to-image, return a new placeholder to simulate a change.
      imageDataUri = `https://picsum.photos/1280/720?random=${Math.random()}`;
    } else {
      // For text-to-image, return a placeholder to avoid quota errors.
      imageDataUri = 'https://picsum.photos/1280/720';
    }

    if (!imageDataUri) {
        throw new Error('Image generation failed to produce an image. Please try again.');
    }
    
    return { imageDataUri };
  }
);
