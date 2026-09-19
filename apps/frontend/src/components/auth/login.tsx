'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import {
  HarloAuthError,
  HarloGoogleButton,
  HarloInviteHint,
  HarloOrDivider,
  HarloPasswordField,
  fieldClassName,
  inviteAuthHref,
  primaryButtonClassName,
  readFormValue,
  readInviteEmail,
  useHarloAuthRedirect,
} from '@gitroom/frontend/components/auth/harlo-auth-fields';
import { useVariables } from '@gitroom/react/helpers/variable.context';
import { exchangeSupabaseAuthCode } from '@gitroom/frontend/components/auth/supabase.google';

export function Login() {
  const fetchData = useFetch();
  const redirectAfterAuth = useHarloAuthRedirect();
  const { genericOauth, isGeneral } = useVariables();
  const searchParams = useSearchParams();
  const inviteToken = searchParams?.get('org');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notActivated, setNotActivated] = useState(false);

  useEffect(() => {
    const code = searchParams?.get('code');
    const state = searchParams?.get('state');
    if (!code) {
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const redirectUri = `${window.location.origin}/login`;
        const isDirectGoogleCode =
          state === 'login' ||
          code.startsWith('4/') ||
          searchParams?.get('iss')?.includes('google');

        if (isDirectGoogleCode) {
          const login = await fetchData('/auth/oauth/google', {
            method: 'POST',
            body: JSON.stringify({
              code,
              redirect_uri: redirectUri,
              ...(inviteToken ? { org: inviteToken } : {}),
            }),
          });
          if (cancelled) {
            return;
          }
          if (login.status === 400) {
            setError((await login.text()) || 'Could not sign in with Google');
            setLoading(false);
            return;
          }
          if (login.ok && redirectAfterAuth(login)) {
            return;
          }
        }

        // Try Supabase Auth exchange
        try {
          const accessToken = await exchangeSupabaseAuthCode(code);
          const login = await fetchData('/auth/oauth/supabase', {
            method: 'POST',
            body: JSON.stringify({ accessToken }),
          });
          if (cancelled) {
            return;
          }
          if (login.status === 400) {
            setError((await login.text()) || 'Could not sign in with Google');
            setLoading(false);
            return;
          }
          if (login.ok && redirectAfterAuth(login)) {
            return;
          }
        } catch (supabaseErr) {
          // If not direct Google code, try backend Google exchange as fallback
          if (!isDirectGoogleCode) {
            const login = await fetchData('/auth/oauth/google', {
              method: 'POST',
              body: JSON.stringify({
                code,
                redirect_uri: redirectUri,
                ...(inviteToken ? { org: inviteToken } : {}),
              }),
            });
            if (cancelled) {
              return;
            }
            if (login.ok && redirectAfterAuth(login)) {
              return;
            }
          }
          throw supabaseErr;
        }

        setError('Could not sign in with Google');
      } catch {
        if (!cancelled) {
          setError('Could not sign in with Google');
        }
      }
      if (!cancelled) {
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchData, redirectAfterAuth, searchParams, inviteToken]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setNotActivated(false);
    const email = readFormValue(event, 'email');
    const password = readFormValue(event, 'password');
    const login = await fetchData('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        provider: 'LOCAL',
        providerToken: '',
        ...(inviteToken ? { org: inviteToken } : {}),
      }),
    });
    if (login.status === 400) {
      const errorMessage = await login.text();
      if (errorMessage === 'User is not activated') {
        setNotActivated(true);
      } else {
        setError(errorMessage || 'Could not sign in');
      }
      setLoading(false);
      return;
    }
    if (login.ok && redirectAfterAuth(login)) {
      return;
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="mt-7 text-center">
        <h1 className="text-[28px] font-semibold tracking-[-0.4px]">Welcome back</h1>
        <p className="mt-2 text-[14.5px] leading-6 text-[#60656C]">
          Sign in to continue managing your social media with Harlo.
        </p>
      </div>
      <div className="mt-7">
        {inviteToken && <HarloInviteHint email={readInviteEmail(inviteToken)} />}
        {isGeneral && !genericOauth && <HarloGoogleButton />}
        {isGeneral && !genericOauth && <HarloOrDivider />}
        <form className="space-y-3" onSubmit={onSubmit}>
          {error && <HarloAuthError>{error}</HarloAuthError>}
          {notActivated && (
            <div className="rounded-[12px] border border-amber-200 bg-amber-50 px-3 py-3 text-[13px] text-amber-800">
              Your account is not activated yet. Please check your email for the
              activation link.{' '}
              <Link href="/auth/activate" className="font-medium underline">
                Resend activation email
              </Link>
            </div>
          )}
          <div>
            <label htmlFor="login-email" className="sr-only">
              Email address
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Email address"
              className={fieldClassName}
            />
          </div>
          <HarloPasswordField
            id="login-password"
            name="password"
            autoComplete="current-password"
            placeholder="Password"
          />
          <div className="text-right">
            <Link
              href="/auth/forgot"
              className="text-[12.5px] font-medium text-[#3D5AFE]"
            >
              Forgot password?
            </Link>
          </div>
          <button type="submit" disabled={loading} className={primaryButtonClassName}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-5 text-center text-[13.5px] text-[#60656C]">
          Don&apos;t have an account?{' '}
          <Link
            href={inviteAuthHref('/signup', inviteToken)}
            className="font-medium text-[#3D5AFE]"
          >
            Start free
          </Link>
        </p>
      </div>
    </div>
  );
}
