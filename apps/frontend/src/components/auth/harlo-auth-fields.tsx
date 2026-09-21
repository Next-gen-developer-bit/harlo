'use client';

import { FormEvent, ReactNode, useCallback, useState } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useVariables } from '@gitroom/react/helpers/variable.context';
import {
  GoogleAuthIntent,
  startSupabaseGoogleLogin,
} from '@gitroom/frontend/components/auth/supabase.google';

export function inviteAuthHref(path: string, org?: string | null) {
  if (!org) {
    return path;
  }
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}org=${encodeURIComponent(org)}`;
}

export function readInviteEmail(org?: string | null) {
  if (!org) {
    return '';
  }
  try {
    const payload = org.split('.')[1];
    if (!payload) {
      return '';
    }
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      '='
    );
    const parsed = JSON.parse(atob(padded)) as { email?: string };
    return String(parsed.email || '').trim();
  } catch {
    return '';
  }
}

export function HarloInviteHint({ email }: { email?: string }) {
  return (
    <div className="mb-4 rounded-[12px] border border-[#D6E0FF] bg-[#F4F7FF] px-3 py-3 text-[13px] leading-5 text-[#3A4660]">
      {email
        ? `You were invited to a workspace. Continue with ${email} to join.`
        : 'You were invited to a workspace. Sign in or create an account with the invited email to join.'}
    </div>
  );
}

export const fieldClassName =
  'w-full rounded-2xl border border-[#DDE3E8] bg-white px-4 py-3.5 text-[14.5px] text-[#111] outline-none placeholder:text-[#9AA3AE] focus:border-[#3D5AFE]';

export const primaryButtonClassName =
  'flex h-[52px] w-full items-center justify-center rounded-[13px] bg-[#3D5AFE] text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:hover:translate-y-0';

export function HarloPasswordField({
  id,
  name,
  placeholder,
  autoComplete,
  minLength,
}: {
  id: string;
  name: string;
  placeholder: string;
  autoComplete: string;
  minLength?: number;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <input
        id={id}
        name={name}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
        minLength={minLength}
        className={`${fieldClassName} pe-12`}
      />
      <button
        type="button"
        className="absolute inset-y-0 end-0 flex w-12 items-center justify-center text-[#9AA3AE]"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 3l18 18"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <path
              d="M10.6 10.7a2.5 2.5 0 0 0 3.5 3.5M9.9 5.5A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a18.7 18.7 0 0 1-4.2 4.8M6.1 6.4C3.6 8.2 2 12 2 12s3.6 7 10 7c1.5 0 2.9-.3 4.1-.8"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path
              d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <circle
              cx="12"
              cy="12"
              r="3"
              stroke="currentColor"
              strokeWidth="1.7"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

export function HarloGoogleButton({
  intent = 'login',
}: {
  intent?: GoogleAuthIntent;
}) {
  const fetchData = useFetch();
  const startGoogle = useCallback(async () => {
    try {
      await startSupabaseGoogleLogin(intent);
      return;
    } catch {
      // Fall back to the Nest Google OAuth client if Supabase Auth is not set.
    }
    const redirectUri = `${window.location.origin}/login`;
    const link = await (
      await fetchData(
        `/auth/oauth/GOOGLE?redirect_uri=${encodeURIComponent(
          redirectUri
        )}&auth_intent=${intent}`
      )
    ).text();
    window.location.href = link;
  }, [fetchData, intent]);

  return (
    <button
      type="button"
      onClick={startGoogle}
      className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded-[13px] border border-[#DDE3E8] bg-white text-[14.5px] font-medium text-[#111] transition-all hover:border-[#C7D1D8]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="18"
        height="18"
      >
        <path
          fill="#FFC107"
          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        />
        <path
          fill="#FF3D00"
          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        />
        <path
          fill="#4CAF50"
          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
        />
        <path
          fill="#1976D2"
          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        />
      </svg>
      Continue with Google
    </button>
  );
}

export function HarloOrDivider() {
  return (
    <div className="relative my-5 h-5">
      <div className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-[#E6ECF1]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="bg-white px-3 text-[11px] font-medium tracking-[0.14em] text-[#9AA3AE]">
          OR
        </span>
      </div>
    </div>
  );
}

export function useHarloAuthRedirect() {
  const { frontEndUrl, isGeneral } = useVariables();
  return useCallback(
    (response: Response) => {
      const app =
        (frontEndUrl || '').replace(/\/+$/, '') || window.location.origin;
      const inviteToken = new URL(window.location.href).searchParams.get('org');
      if (response.headers.get('activate') === 'true') {
        window.location.href = `${app}/auth/activate`;
        return true;
      }
      if (inviteToken && response.headers.get('reload')) {
        window.location.href = `${app}/auth/invite?org=${encodeURIComponent(
          inviteToken
        )}`;
        return true;
      }
      if (response.headers.get('onboarding')) {
        window.location.href = `${app}${
          isGeneral ? '/overview?onboarding=true' : '/analytics?onboarding=true'
        }`;
        return true;
      }
      if (response.headers.get('reload') || response.ok) {
        window.location.href = `${app}/overview`;
        return true;
      }
      return false;
    },
    [frontEndUrl, isGeneral]
  );
}

export function readFormValue(event: FormEvent<HTMLFormElement>, name: string) {
  const data = new FormData(event.currentTarget);
  return String(data.get(name) || '').trim();
}

export function HarloAuthError({ children }: { children: ReactNode }) {
  if (!children) {
    return null;
  }
  return (
    <div className="rounded-[12px] border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-600">
      {children}
    </div>
  );
}
