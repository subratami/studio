'use client';

import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import type { useToast } from '@/hooks/use-toast';

export async function handleGoogleSignIn(toast: ReturnType<typeof useToast>['toast']) {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        toast({
            title: 'Signed in successfully!',
            description: `Welcome, ${user.displayName}!`,
        });

        // Close the dialog on success
        // This is a bit of a hack, but it works for this example
        const closeButton = document.querySelector('[data-radix-dialog-close]') as HTMLElement;
        if (closeButton) {
            closeButton.click();
        }

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Google Sign-In Failed',
            description: error.message,
        });
    }
}
