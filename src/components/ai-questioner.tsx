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
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Wand2, CaseUpper } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aiImageQuestioning } from '@/ai/flows/ai-image-questioning';
import type { Prompt } from '@/lib/types';
import { useState } from 'react';

const formSchema = z.object({
  question: z.string().min(10, 'Please ask a more detailed question.').max(200),
});

interface AiQuestionerProps {
  uploadedImage: string | null;
  isLoading: { [key: string]: boolean };
  setIsLoading: (loading: { [key: string]: boolean }) => void;
  addPrompt: (newPromptData: Omit<Prompt, 'id' | 'timestamp'>) => void;
  setOverlayText: (text: string) => void;
}

export function AiQuestioner({ uploadedImage, isLoading, setIsLoading, addPrompt, setOverlayText }: AiQuestionerProps) {
  const { toast } = useToast();
  const [suggestion, setSuggestion] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { question: '' },
  });

  async function getSuggestion(question: string) {
     if (!uploadedImage) {
      toast({
        variant: 'destructive',
        title: 'No Image Uploaded',
        description: 'Please upload an image before asking a question.',
      });
      return null;
    }
    
    try {
      const result = await aiImageQuestioning({
        photoDataUri: uploadedImage,
        userQuestion: question,
      });

      addPrompt({
        type: 'question',
        original: question,
        result: result.thumbnailSuggestion,
      });

      return result.thumbnailSuggestion;
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Failed to get suggestions from the AI. Please try again.',
      });
      return null;
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading({ ...isLoading, questioner: true });
    setSuggestion(null);

    const result = await getSuggestion(values.question);
    if(result) {
      setSuggestion(result);
      form.reset();
    }
    
    setIsLoading({ ...isLoading, questioner: false });
  }

  async function handleSuggestText() {
    setIsLoading({ ...isLoading, suggestText: true });
    
    const result = await getSuggestion('Suggest a catchy title for this image.');
    if (result) {
        setOverlayText(result);
        toast({ title: "Suggested text has been applied to the thumbnail." });
    }

    setIsLoading({ ...isLoading, suggestText: false });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="mr-2 text-primary" /> AI Assistant
        </CardTitle>
        <CardDescription>
          Ask a question for thumbnail ideas or let the AI suggest a title.
        </CardDescription>
      </CardHeader>
      <CardContent>
         <Button onClick={handleSuggestText} className="w-full mb-6" disabled={isLoading.suggestText || !uploadedImage}>
            {isLoading.suggestText ? (
                <Loader2 className="animate-spin" />
            ) : (
                <>
                    <CaseUpper className="mr-2" /> Suggest Overlay Text
                </>
            )}
        </Button>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ask a Question</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 'What's a good theme for a video about this?'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading.questioner}>
              {isLoading.questioner ? (
                <Loader2 className="animate-spin" />
              ) : (
                'Get Suggestions'
              )}
            </Button>
          </form>
        </Form>
        {(isLoading.questioner || suggestion) && (
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-2">Suggestion</h3>
            {isLoading.questioner && !suggestion && (
               <div className="space-y-2">
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-3/4" />
               </div>
            )}
            {suggestion && (
              <Card className="bg-muted">
                <CardContent className="p-4 space-y-4">
                  <p className="text-sm">{suggestion}</p>
                  <Button variant="outline" size="sm" onClick={() => setOverlayText(suggestion.substring(0, 50))}>
                    <Wand2 className="mr-2 h-4 w-4" /> Use as Overlay Text
                  </Button>
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
