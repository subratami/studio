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

const formSchema = z.object({
  prompt: z.string().min(5, 'Please enter a more detailed prompt.').max(500),
});

interface ImageGeneratorProps {
  isLoading: { [key:string]: boolean };
  setIsLoading: (loading: { [key:string]: boolean }) => void;
  addPrompt: (newPromptData: Omit<Prompt, 'id' | 'timestamp'>) => void;
  setUploadedImage: (image: string | null) => void;
  uploadedImage: string | null;
}

export function ImageGenerator({ isLoading, setIsLoading, addPrompt, setUploadedImage, uploadedImage }: ImageGeneratorProps) {
  const { toast } = useToast();

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
        photoDataUri: uploadedImage || undefined,
      });

      setUploadedImage(result.imageDataUri);

      addPrompt({
        type: 'generation',
        original: values.prompt,
        result: enhancedPrompt,
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

  const title = uploadedImage ? 'Image-to-Image Generator' : 'Image Generator';
  const description = uploadedImage
    ? 'Use the uploaded image as a base and describe the changes you want to make.'
    : 'Create a new thumbnail from a text prompt. The prompt will be automatically enhanced.';
  const placeholder = uploadedImage
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
