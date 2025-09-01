'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateThumbnail } from '@/ai/flows/generate-thumbnail';
import type { Prompt } from '@/lib/types';
import { enhanceThumbnailPrompt } from '@/ai/flows/enhance-thumbnail-prompt';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useState, useEffect } from 'react';
import { Label } from './ui/label';

const formSchema = z.object({
  prompt: z.string().min(5, 'Please enter a more detailed prompt.').max(500),
});

interface ImageGeneratorProps {
  isLoading: { [key:string]: boolean };
  setIsLoading: (loading: { [key:string]: boolean }) => void;
  addPrompt: (newPromptData: Omit<Prompt, 'id' | 'timestamp'>) => void;
  setUploadedImage: (image: string | null) => void;
  setGeneratedImage: (image: string | null) => void;
  uploadedImage: string | null;
}

export function ImageGenerator({ isLoading, setIsLoading, addPrompt, setUploadedImage, setGeneratedImage, uploadedImage }: ImageGeneratorProps) {
  const { toast } = useToast();
  const [generationMode, setGenerationMode] = useState<'text-to-image' | 'image-to-image'>('text-to-image');

  useEffect(() => {
    if (uploadedImage) {
      setGenerationMode('image-to-image');
    } else {
      setGenerationMode('text-to-image');
    }
  }, [uploadedImage]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading({ ...isLoading, generator: true });

    try {
      const enhancementResult = await enhanceThumbnailPrompt({
        prompt: values.prompt,
      });

      const enhancedPrompt = enhancementResult.enhancedPrompt;

      const result = await generateThumbnail({
        prompt: enhancedPrompt,
        photoDataUri: generationMode === 'image-to-image' ? uploadedImage! : undefined,
      });
      
      if (generationMode === 'text-to-image') {
        setUploadedImage(result.imageDataUri);
      } else {
        setGeneratedImage(result.imageDataUri);
      }

      addPrompt({
        type: 'generation',
        original: values.prompt,
        result: enhancedPrompt,
        imageDataUri: result.imageDataUri,
      });
      form.reset();
      toast({ title: 'Thumbnail generated successfully!' });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Failed to generate the thumbnail. Please try again.',
      });
    } finally {
      setIsLoading({ ...isLoading, generator: false });
    }
  }

  const title = 'Image Generator';
  const description = 'Create a new thumbnail from a text prompt or modify an uploaded image.';
  const placeholder = generationMode === 'image-to-image'
    ? "e.g., 'Make the background a vibrant galaxy'"
    : "e.g., 'A vibrant abstract background with geometric shapes'";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ImageIcon className="mr-2 text-primary" /> {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <RadioGroup
              value={generationMode}
              onValueChange={(value) => setGenerationMode(value as any)}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem value="text-to-image" id="text-to-image" className="peer sr-only" />
                <Label
                  htmlFor="text-to-image"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Text-to-Image
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="image-to-image"
                  id="image-to-image"
                  className="peer sr-only"
                  disabled={!uploadedImage}
                />
                <Label
                  htmlFor="image-to-image"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                >
                  Image-to-Image
                </Label>
              </div>
            </RadioGroup>

            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Prompt</FormLabel>
                  <FormControl>
                    <Textarea placeholder={placeholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading.generator}>
              {isLoading.generator ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                'Generate Thumbnail'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
