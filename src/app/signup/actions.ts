
'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { redirect } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

export async function signup(values: z.infer<typeof formSchema>) {
  const validatedFields = formSchema.safeParse(values);

  if (!validatedFields.success) {
    // This should not happen if the form validation on the client-side works.
    // However, it's good practice to have server-side validation.
    // For simplicity, we'll just log the error.
    // In a real app, you might want to return the error to the user.
    console.error(validatedFields.error);
    return;
  }

  const { name, email, password } = validatedFields.data;

  try {
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
        // In a real app, you would return an error message to the user.
        console.error('User already exists');
        // For now, let's redirect to login
        redirect('/login?error=UserAlreadyExists');
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

  } catch (error) {
    console.error('Database error:', error);
    // In a real app, you might want to redirect to an error page or show a toast.
    redirect('/signup?error=DatabaseError');
    return;
  }

  // Redirect to the login page after successful signup
  redirect('/login?signup=success');
}
