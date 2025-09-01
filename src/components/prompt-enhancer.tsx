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
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  prompt: z.string().min(5, 'Please enter a more detailed prompt.').max(1000),
});

interface PromptEnhancerProps {
  isLoading: { [key:string]: boolean };
  setIsLoading: (loading: { [key:string]: boolean }) => void;
  addPrompt: (newPromptData: Omit<Prompt, 'id' | 'timestamp'>) => void;
}

const categories = ['Tech', 'Gaming', 'Vlog', 'Finance', 'Tutorial'];
const styles = ['Minimal', 'Cinematic', 'Fun'];

export function PromptEnhancer({ isLoading, setIsLoading, addPrompt }: PromptEnhancerProps) {
  const { toast } = useToast();
  const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tech');
  const [selectedStyle, setSelectedStyle] = useState<string>('Minimal');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: '' },
  });

  const { setValue, watch } = form;
  const promptValue = watch('prompt');

  useEffect(() => {
    const newPrompt = `A professional thumbnail for a ${selectedCategory.toLowerCase()} review channel, featuring a person with a laptop and bold text, in a ${selectedStyle.toLowerCase()} style.`;
    if (promptValue !== newPrompt) {
      setValue('prompt', newPrompt);
    }
  }, [selectedCategory, selectedStyle, setValue, promptValue]);

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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    type="button"
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="e.g., 'A cat wearing a wizard hat'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Styles</FormLabel>
              <div className="flex flex-wrap gap-2 mt-2">
                {styles.map((style) => (
                  <Button
                    key={style}
                    type="button"
                    variant={selectedStyle === style ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedStyle(style)}
                  >
                    {style}
                  </Button>
                ))}
              </div>
            </div>
            
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
