'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Wand2, CaseUpper } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aiImageQuestioning } from '@/ai/flows/ai-image-questioning';
import type { Prompt } from '@/lib/types';

interface AiQuestionerProps {
  uploadedImage: string | null;
  isLoading: { [key: string]: boolean };
  setIsLoading: (loading: { [key: string]: boolean }) => void;
  addPrompt: (newPromptData: Omit<Prompt, 'id' | 'timestamp'>) => void;
  setOverlayText: (text: string) => void;
}

export function AiQuestioner({ uploadedImage, isLoading, setIsLoading, addPrompt, setOverlayText }: AiQuestionerProps) {
  const { toast } = useToast();
  
  async function getSuggestion() {
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
        photoDataUri: uploadedImage
      });

      addPrompt({
        type: 'question',
        original: 'Suggest a title for the image',
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

  async function handleSuggestText() {
    setIsLoading({ ...isLoading, suggestText: true });
    
    const result = await getSuggestion();
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
          Let the AI suggest a catchy title for your thumbnail.
        </CardDescription>
      </CardHeader>
      <CardContent>
         <Button onClick={handleSuggestText} className="w-full" disabled={isLoading.suggestText || !uploadedImage}>
            {isLoading.suggestText ? (
                <Loader2 className="animate-spin" />
            ) : (
                <>
                    <CaseUpper className="mr-2" /> Suggest Title
                </>
            )}
        </Button>
      </CardContent>
    </Card>
  );
}
