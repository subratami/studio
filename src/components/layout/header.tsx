import { BrainCircuit, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LoginForm } from '@/components/login-form';
import { SignupForm } from '@/components/signup-form';

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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost">Login</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Login</DialogTitle>
                <DialogDescription>Enter your credentials to access your account.</DialogDescription>
              </DialogHeader>
              <LoginForm />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                Sign Up <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
               <DialogHeader>
                <DialogTitle>Sign Up</DialogTitle>
                <DialogDescription>Create an account to get started.</DialogDescription>
              </DialogHeader>
              <SignupForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
