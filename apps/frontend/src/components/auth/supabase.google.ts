import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function getSupabaseAuthClient() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/+$/, '');
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';
  if (!url || !key) {
    return null;
  }
  if (!client) {
    client = createClient(url, key, {
      auth: {
        // persistSession MUST be true so the SDK uses localStorage
        // for the PKCE code_verifier.  When false, Supabase ignores
        // the storage option and uses an in-memory store that is
        // destroyed during the full-page redirect to Google.
        // The persisted Supabase session in localStorage is harmless;
        // the app manages its own JWT via the backend.
        persistSession: true,
        flowType: 'pkce',
        detectSessionInUrl: false,
      },
    });
  }
  return client;
}

export function supabaseGoogleRedirectTo() {
  if (typeof window === 'undefined') {
    return '';
  }
  return `${window.location.origin}/login`;
}

export async function startSupabaseGoogleLogin() {
  const supabase = getSupabaseAuthClient();
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: supabaseGoogleRedirectTo(),
      queryParams: {
        prompt: 'select_account',
      },
    },
  });
  if (error) {
    throw error;
  }
}

export async function exchangeSupabaseAuthCode(code: string) {
  const supabase = getSupabaseAuthClient();
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.session?.access_token) {
    throw error || new Error('No session');
  }
  return data.session.access_token;
}
