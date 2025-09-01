'use client';

import { useState, useEffect } from 'react';
import { ControlPanel } from './control-panel';
import { PreviewPanel } from './preview-panel';
import type { Prompt } from '@/lib/types';

export function ThumbnailEditor() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [overlayText, setOverlayText] = useState<string>('Your Catchy Title Here');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({
    questioner: false,
    enhancer: false,
    generator: false,
    suggestText: false,
  });

  const handleSetUploadedImage = (image: string | null) => {
    setUploadedImage(image);
    // When a new image is uploaded, clear any previously generated image
    setGeneratedImage(null);
  }

  useEffect(() => {
    try {
      const storedPrompts = sessionStorage.getItem('thumbgenius_prompts');
      if (storedPrompts) {
        const parsedPrompts = JSON.parse(storedPrompts).map((p: any) => ({
          ...p,
          timestamp: new Date(p.timestamp),
        }));
        setPrompts(parsedPrompts);
      }
    } catch (error) {
      console.error('Failed to load prompts from session storage:', error);
      sessionStorage.removeItem('thumbgenius_prompts');
    }
  }, []);

  const addPrompt = (newPromptData: Omit<Prompt, 'id' | 'timestamp'>) => {
    setPrompts(currentPrompts => {
      const newPrompt: Prompt = {
        ...newPromptData,
        id: crypto.randomUUID(),
        timestamp: new Date(),
      };
      const updatedPrompts = [newPrompt, ...currentPrompts].slice(0, 50);

      try {
        sessionStorage.setItem('thumbgenius_prompts', JSON.stringify(updatedPrompts));
      } catch (error) {
        console.error('Failed to save prompts to session storage:', error);
      }
      
      return updatedPrompts;
    });
  };
  
  const clearPrompts = () => {
    setPrompts([]);
    sessionStorage.removeItem('thumbgenius_prompts');
  };

  return (
    <div className="container mx-auto grid flex-1 gap-8 px-4 py-8 md:grid-cols-2 lg:grid-cols-5 xl:gap-12">
      <div className="flex flex-col gap-8 lg:col-span-2">
        <ControlPanel
          setUploadedImage={handleSetUploadedImage}
          setGeneratedImage={setGeneratedImage}
          setOverlayText={setOverlayText}
          prompts={prompts}
          addPrompt={addPrompt}
          clearPrompts={clearPrompts}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          uploadedImage={uploadedImage}
        />
      </div>
      <div className="lg:col-span-3">
        <PreviewPanel
          displayImage={generatedImage || uploadedImage}
          overlayText={overlayText}
          setOverlayText={setOverlayText}
        />
      </div>
    </div>
  );
}
