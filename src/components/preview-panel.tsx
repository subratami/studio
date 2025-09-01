'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface PreviewPanelProps {
  uploadedImage: string | null;
  overlayText: string;
  setOverlayText: (text: string) => void;
}

export function PreviewPanel({ uploadedImage, overlayText, setOverlayText }: PreviewPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 });

  const updatePreviewSize = useCallback(() => {
    if (previewRef.current) {
      setPreviewSize({
        width: previewRef.current.offsetWidth,
        height: previewRef.current.offsetHeight,
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updatePreviewSize);
    updatePreviewSize();
    return () => window.removeEventListener('resize', updatePreviewSize);
  }, [updatePreviewSize]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !uploadedImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new window.Image();
    img.src = uploadedImage;
    img.onload = () => {
      const canvasWidth = 1280;
      const canvasHeight = 720;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Draw image to fill canvas
      const imgAspectRatio = img.width / img.height;
      const canvasAspectRatio = canvasWidth / canvasHeight;
      let sx, sy, sWidth, sHeight;

      if (imgAspectRatio > canvasAspectRatio) {
        sHeight = img.height;
        sWidth = sHeight * canvasAspectRatio;
        sx = (img.width - sWidth) / 2;
        sy = 0;
      } else {
        sWidth = img.width;
        sHeight = sWidth / canvasAspectRatio;
        sx = 0;
        sy = (img.height - sHeight) / 2;
      }
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvasWidth, canvasHeight);

      // Draw text
      const fontSize = Math.floor(canvasWidth / 20);
      ctx.font = `700 ${fontSize}px "Space Grotesk", sans-serif`;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;

      const lines = overlayText.split('\n');
      const lineHeight = fontSize * 1.2;
      const totalHeight = lines.length * lineHeight;
      const startY = (canvasHeight - totalHeight) / 2 + lineHeight / 2;

      lines.forEach((line, index) => {
        ctx.fillText(line, canvasWidth / 2, startY + index * lineHeight);
      });
    };
  }, [uploadedImage, overlayText]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);


  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !uploadedImage) return;

    drawCanvas(); // Ensure canvas is up-to-date
    
    setTimeout(() => {
        const link = document.createElement('a');
        link.download = 'thumbnail.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }, 100); // Small delay to ensure canvas has been drawn
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Thumbnail Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div
          ref={previewRef}
          onLoad={updatePreviewSize}
          className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted/50 border shadow-inner"
        >
          {uploadedImage ? (
            <Image
              src={uploadedImage}
              alt="Thumbnail preview"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              data-ai-hint="abstract background"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground">
              <ImageIcon className="h-16 w-16" />
              <p className="mt-2">Upload an image to see a preview</p>
            </div>
          )}
          {uploadedImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 p-4">
              <h2
                className="text-center font-bold text-white transition-all"
                style={{ 
                    fontSize: `${Math.max(previewSize.width / 25, 16)}px`, 
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)' 
                }}
              >
                {overlayText}
              </h2>
            </div>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <div className="w-full">
          <Label htmlFor="overlay-text" className="font-semibold">
            Overlay Text
          </Label>
          <Input
            id="overlay-text"
            value={overlayText}
            onChange={e => setOverlayText(e.target.value)}
            disabled={!uploadedImage}
            className="mt-2"
          />
        </div>
        <Button
          onClick={handleDownload}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
          disabled={!uploadedImage}
        >
          <Download className="mr-2" />
          Download Thumbnail
        </Button>
      </CardFooter>
    </Card>
  );
}
