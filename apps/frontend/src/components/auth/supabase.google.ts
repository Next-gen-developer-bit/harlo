import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export type GoogleAuthIntent = 'login' | 'signup';

const AUTH_INTENT_KEY = 'harlo_google_auth_intent';

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
  // Keep this exact allowlisted path. Extra query params cause Supabase
  // to reject redirectTo and send the user to the Site URL instead.
  return new URL('/login', window.location.origin).toString();
}

export function rememberGoogleAuthIntent(intent: GoogleAuthIntent) {
  if (typeof window === 'undefined') {
    return;
  }
  sessionStorage.setItem(AUTH_INTENT_KEY, intent);
}

export function readGoogleAuthIntent(
  searchIntent?: string | null
): GoogleAuthIntent {
  if (searchIntent === 'signup' || searchIntent === 'login') {
    return searchIntent;
  }
  try {
    const stored = sessionStorage.getItem(AUTH_INTENT_KEY);
    if (stored === 'signup' || stored === 'login') {
      return stored;
    }
  } catch {
    // Ignore storage access errors and default to login.
  }
  return 'login';
}

export function clearGoogleAuthIntent() {
  try {
    sessionStorage.removeItem(AUTH_INTENT_KEY);
  } catch {
    // Ignore storage access errors.
  }
}

export async function startSupabaseGoogleLogin(intent: GoogleAuthIntent) {
  const supabase = getSupabaseAuthClient();
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }
  rememberGoogleAuthIntent(intent);
  await supabase.auth.signOut({ scope: 'local' });
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
