'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { History, Sparkles, Wand2, Image as ImageIcon } from 'lucide-react';
import { ImageUploader } from './image-uploader';
import { AiQuestioner } from './ai-questioner';
import { PromptEnhancer } from './prompt-enhancer';
import { ImageGenerator } from './image-generator';
import { PromptHistory } from './prompt-history';
import type { Prompt } from '@/lib/types';

interface ControlPanelProps {
  setUploadedImage: (image: string | null) => void;
  setOverlayText: (text: string) => void;
  prompts: Prompt[];
  addPrompt: (newPromptData: Omit<Prompt, 'id' | 'timestamp'>) => void;
  clearPrompts: () => void;
  isLoading: { [key: string]: boolean };
  setIsLoading: (loading: { [key: string]: boolean }) => void;
  uploadedImage: string | null;
}

export function ControlPanel(props: ControlPanelProps) {
  return (
    <div className="flex h-full flex-col gap-6">
      <ImageUploader setUploadedImage={props.setUploadedImage} uploadedImage={props.uploadedImage} />
      <Tabs defaultValue="assistant" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assistant">
            <Sparkles className="mr-2" />
            Assistant
          </TabsTrigger>
          <TabsTrigger value="enhancer">
            <Wand2 className="mr-2" />
            Enhancer
          </TabsTrigger>
          <TabsTrigger value="generator">
            <ImageIcon className="mr-2" />
            Generator
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2" />
            History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="assistant" className="mt-4">
          <AiQuestioner {...props} />
        </TabsContent>
        <TabsContent value="enhancer" className="mt-4">
          <PromptEnhancer {...props} />
        </TabsContent>
        <TabsContent value="generator" className="mt-4">
          <ImageGenerator {...props} />
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <PromptHistory {...props} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
