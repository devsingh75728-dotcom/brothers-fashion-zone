import { supabase } from './supabase';
import { Provider } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    phone?: string;
  };
}

export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function customerSignIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { user: null, error: mapAuthError(error.message) };
    }
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { user: null, error: 'An unexpected error occurred' };
  }
}

export async function customerSignUp(
  email: string,
  password: string,
  fullName: string,
  phone?: string
) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || '',
        },
      },
    });
    if (error) {
      return { user: null, error: mapAuthError(error.message) };
    }
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { user: null, error: 'An unexpected error occurred' };
  }
}

export async function googleAuth() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google' as Provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
      },
    });
    if (error) {
      return { url: null, error: mapAuthError(error.message) };
    }
    return { url: data.url, error: null };
  } catch (error) {
    console.error('Google auth error:', error);
    return { url: null, error: 'An unexpected error occurred' };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export function mapAuthError(message: string): string {
  if (message.includes('Invalid login credentials')) {
    return 'Invalid email or password';
  }
  if (message.includes('User already registered')) {
    return 'An account with this email already exists';
  }
  if (message.includes('Email not confirmed')) {
    return 'Please confirm your email address';
  }
  if (message.includes('weak password')) {
    return 'Password should be at least 6 characters';
  }
  if (message.includes('rate limit')) {
    return 'Too many attempts. Please try again later';
  }
  if (message.includes('Invalid email')) {
    return 'Please enter a valid email address';
  }
  if (message.includes('User not found')) {
    return 'No account found with this email';
  }
  return message;
}
