
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Copy, Trash2, Wand2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Prompt } from '@/lib/types';
import { cva } from 'class-variance-authority';
import Image from 'next/image';

interface PromptHistoryProps {
  prompts: Prompt[];
  setOverlayText: (text: string) => void;
  clearPrompts: () => void;
  setUploadedImage: (image: string | null) => void; // Changed from setGeneratedImage
  setGeneratedImage: (image: string | null) => void;
}

const badgeVariants = cva('', {
  variants: {
    variant: {
      question: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      enhancement: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      generation: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    },
  },
});

export function PromptHistory({ prompts, setOverlayText, clearPrompts, setUploadedImage, setGeneratedImage }: PromptHistoryProps) {
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
  };
  
  const handleUseImage = (imageDataUri: string) => {
    setUploadedImage(imageDataUri); // Use the history image as a new base
    setGeneratedImage(null); // Clear any derived image
    toast({ title: 'Image loaded into uploader.' });
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="mr-2 text-primary" /> Session History
        </CardTitle>
        <CardDescription>
          Your recent AI interactions. This list will be cleared when you close the tab.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full pr-4">
          {prompts.length > 0 ? (
            <div className="space-y-4">
              {prompts.map(prompt => (
                <div key={prompt.id} className="p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className={badgeVariants({variant: prompt.type as any})}>
                        {prompt.type}
                      </Badge>
                      <p className="text-sm font-semibold mt-2">Original: {prompt.original}</p>
                      <p className="text-sm text-muted-foreground mt-1 font-code">Result: {prompt.result}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap pl-2">{formatTimeAgo(prompt.timestamp)}</span>
                  </div>
                  {prompt.imageDataUri && (
                    <div className="mt-3 relative w-full aspect-video rounded-md overflow-hidden">
                       <Image src={prompt.imageDataUri} alt="Generated thumbnail from history" fill objectFit="cover" />
                    </div>
                  )}
                  <div className="flex gap-2 mt-3">
                     <Button size="sm" variant="outline" onClick={() => handleCopy(prompt.result)}>
                        <Copy className="mr-2 h-3 w-3" /> Copy Result
                     </Button>
                      {(prompt.type === 'question' || prompt.type === 'enhancement') && (
                        <Button size="sm" variant="outline" onClick={() => setOverlayText(prompt.result.substring(0, 50))}>
                           <Wand2 className="mr-2 h-3 w-3" /> Use Text
                        </Button>
                      )}
                      {prompt.imageDataUri && (
                         <Button size="sm" variant="outline" onClick={() => handleUseImage(prompt.imageDataUri!)}>
                           <RefreshCw className="mr-2 h-3 w-3" /> Use Image
                         </Button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-40">
              <History className="h-10 w-10 mb-2" />
              <p>No history yet.</p>
              <p className="text-xs">Your prompts will appear here.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      {prompts.length > 0 && (
         <CardFooter>
            <Button variant="destructive" className="w-full" onClick={clearPrompts}>
                <Trash2 className="mr-2 h-4 w-4" /> Clear History
            </Button>
         </CardFooter>
      )}
    </Card>
  );
}
