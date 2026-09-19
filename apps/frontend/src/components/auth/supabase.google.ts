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
        persistSession: false,
        flowType: 'pkce',
        detectSessionInUrl: false,
        // Use localStorage so the PKCE code_verifier survives the
        // full-page redirect to Google and back.  Without this,
        // persistSession:false falls back to in-memory storage which
        // is lost on navigation, causing exchangeCodeForSession to
        // throw AuthPKCECodeVerifierMissingError.
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
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
