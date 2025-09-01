import { BrainCircuit, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="mr-4 flex items-center">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <h1 className="ml-2 font-bold font-headline">ThumbGenius</h1>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/create">
            <Button>
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
