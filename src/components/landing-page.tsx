
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ImageIcon, Sparkles, Wand2 } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  const calculateTransform = (factor: number) => {
    if (!isClient) return {};
    const x = (mousePosition.x - window.innerWidth / 2) * factor;
    const y = (mousePosition.y - window.innerHeight / 2) * factor;
    return {
      transform: `translate(${x}px, ${y}px)`,
    };
  };


  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
         {/* Floating Background Images */}
        <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10">
            <div style={calculateTransform(0.02)} className="transition-transform duration-500 ease-out">
                <Image src="https://picsum.photos/seed/1/400/225" alt="sample 1" width={200} height={112} className="absolute top-[10%] left-[5%] rounded-xl shadow-2xl" data-ai-hint="gaming thumbnail" />
            </div>
            <div style={calculateTransform(-0.03)} className="transition-transform duration-500 ease-out">
                <Image src="https://picsum.photos/seed/2/400/225" alt="sample 2" width={200} height={112} className="absolute top-[20%] right-[10%] rounded-xl shadow-2xl" data-ai-hint="vlog thumbnail" />
            </div>
            <div style={calculateTransform(0.015)} className="transition-transform duration-500 ease-out">
                <Image src="https://picsum.photos/seed/3/400/225" alt="sample 3" width={200} height={112} className="absolute bottom-[25%] left-[15%] rounded-xl shadow-2xl" data-ai-hint="tech review" />
            </div>
             <div style={calculateTransform(-0.025)} className="transition-transform duration-500 ease-out">
                <Image src="https://picsum.photos/seed/4/400/225" alt="sample 4" width={200} height={112} className="absolute bottom-[10%] right-[20%] rounded-xl shadow-2xl" data-ai-hint="finance chart" />
            </div>
             <div style={calculateTransform(0.035)} className="transition-transform duration-500 ease-out">
                <Image src="https://picsum.photos/seed/5/400/225" alt="sample 5" width={200} height={112} className="absolute top-[55%] left-[45%] rounded-xl shadow-2xl" data-ai-hint="tutorial thumbnail" />
            </div>
            <div style={calculateTransform(-0.01)} className="transition-transform duration-500 ease-out">
                <Image src="https://picsum.photos/seed/6/400/225" alt="sample 6" width={200} height={112} className="absolute top-[75%] left-[5%] rounded-xl shadow-2xl" data-ai-hint="cooking show" />
            </div>
            <div style={calculateTransform(0.022)} className="transition-transform duration-500 ease-out">
                <Image src="https://picsum.photos/seed/7/400/225" alt="sample 7" width={200} height={112} className="absolute top-[60%] right-[35%] rounded-xl shadow-2xl" data-ai-hint="fitness workout" />
            </div>
            <div style={calculateTransform(-0.018)} className="transition-transform duration-500 ease-out">
                <Image src="https://picsum.photos/seed/8/400/225" alt="sample 8" width={200} height={112} className="absolute bottom-[5%] left-[60%] rounded-xl shadow-2xl" data-ai-hint="travel vlog" />
            </div>
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl font-headline">
            Create Stunning Thumbnails in Seconds
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            Leverage the power of AI to design eye-catching thumbnails that boost your clicks and grow your audience.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/create">
              <Button size="lg" className="font-bold">
                Start Creating for Free <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Features</h2>
            <p className="mt-2 text-muted-foreground">Everything you need to create viral thumbnails.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <ImageIcon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>AI Image Generation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p>Generate completely new thumbnail images from a text description. Perfect for when you need fresh ideas.</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader>
                 <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Wand2 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Image-to-Image Editing</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p>Upload your own image and use AI to edit it. Add objects, change the background, and much more.</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader>
                 <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>AI Prompt Assistance</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p>Our AI Assistant helps you write better prompts for amazing results and can suggest catchy overlay text.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">From Idea to Thumbnail in a Flash</h2>
            <p className="mt-4 text-muted-foreground">Our intuitive editor makes it easy to bring your vision to life. Upload an image, use our AI tools to refine it, add your text, and download your production-ready thumbnail in seconds.</p>
            <Link href="/create" className="mt-6 inline-block">
               <Button variant="outline">
                  Try the Editor <ArrowRight className="ml-2" />
               </Button>
            </Link>
          </div>
           <div className="relative aspect-video rounded-xl shadow-2xl overflow-hidden border-4 border-primary/20">
                <Image 
                    src="https://picsum.photos/1280/720"
                    alt="Thumbnail editor showcase"
                    fill
                    className="object-cover"
                    data-ai-hint="gaming thumbnail"
                />
                 <div className="absolute inset-0 flex items-center justify-center bg-black/20 p-4">
                    <h2 
                        className="text-center font-bold text-white text-4xl"
                        style={{textShadow: '2px 2px 8px rgba(0,0,0,0.8)'}}
                    >
                        AI-GENERATED EPIC WIN
                    </h2>
                 </div>
            </div>
        </div>
      </section>

    </div>
  );
}
