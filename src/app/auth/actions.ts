'use client';

import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export async function handleGoogleSignIn() {
    const { toast } = useToast();
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // You can now access user details like:
        // user.displayName, user.email, user.photoURL
        
        toast({
            title: 'Signed in successfully!',
            description: `Welcome, ${user.displayName}!`,
        });

        // Close the dialog on success
        document.querySelector('[data-radix-dialog-close]')?.dispatchEvent(new Event('click'));
        
        // Here you would typically redirect the user or update the UI
        // For example: window.location.href = '/dashboard';

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Google Sign-In Failed',
            description: error.message,
        });
    }
}
