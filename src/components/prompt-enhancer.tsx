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
import { Loader2, Copy, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { enhanceThumbnailPrompt } from '@/ai/flows/enhance-thumbnail-prompt';
import type { Prompt } from '@/lib/types';
import { useState } from 'react';

const formSchema = z.object({
  prompt: z.string().min(5, 'Please enter a more detailed prompt.').max(500),
});

interface PromptEnhancerProps {
  isLoading: { [key:string]: boolean };
  setIsLoading: (loading: { [key:string]: boolean }) => void;
  addPrompt: (newPromptData: Omit<Prompt, 'id' | 'timestamp'>) => void;
}

export function PromptEnhancer({ isLoading, setIsLoading, addPrompt }: PromptEnhancerProps) {
  const { toast } = useToast();
  const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading({ ...isLoading, enhancer: true });
    setEnhancedPrompt(null);

    try {
      const result = await enhanceThumbnailPrompt({
        prompt: values.prompt,
      });

      setEnhancedPrompt(result.enhancedPrompt);
      addPrompt({
        type: 'enhancement',
        original: values.prompt,
        result: result.enhancedPrompt,
      });
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Failed to enhance the prompt. Please try again.',
      });
    } finally {
      setIsLoading({ ...isLoading, enhancer: false });
    }
  }

  const handleCopy = () => {
    if (enhancedPrompt) {
      navigator.clipboard.writeText(enhancedPrompt);
      toast({ title: 'Copied to clipboard!' });
    }
  };
  

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wand2 className="mr-2 text-primary" /> Prompt Enhancer
        </CardTitle>
        <CardDescription>
          Refine your text-to-image prompts for better results.
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
                    <Textarea placeholder="e.g., 'A cat wearing a wizard hat'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading.enhancer}>
              {isLoading.enhancer ? (
                <Loader2 className="animate-spin" />
              ) : (
                'Enhance Prompt'
              )}
            </Button>
          </form>
        </Form>
        {(isLoading.enhancer || enhancedPrompt) && (
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-2">Enhanced Prompt</h3>
             {isLoading.enhancer && !enhancedPrompt && (
               <div className="space-y-2">
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-3/4" />
               </div>
            )}
            {enhancedPrompt && (
              <Card className="bg-muted">
                <CardContent className="p-4 relative">
                   <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={handleCopy}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <p className="text-sm font-code pr-8">{enhancedPrompt}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-muted-foreground/20 rounded-md ${className}`} />;
}
