'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import {
  HarloAuthError,
  HarloGoogleButton,
  HarloOrDivider,
  HarloPasswordField,
  fieldClassName,
  primaryButtonClassName,
  readFormValue,
  useHarloAuthRedirect,
} from '@gitroom/frontend/components/auth/harlo-auth-fields';
import { useVariables } from '@gitroom/react/helpers/variable.context';

export function Login() {
  const fetchData = useFetch();
  const redirectAfterAuth = useHarloAuthRedirect();
  const { genericOauth, isGeneral } = useVariables();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notActivated, setNotActivated] = useState(false);

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
          <Link href="/signup" className="font-medium text-[#3D5AFE]">
            Start free
          </Link>
        </p>
      </div>
    </div>
  );
}
