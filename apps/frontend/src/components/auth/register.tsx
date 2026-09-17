'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useFireEvents } from '@gitroom/helpers/utils/use.fire.events';
import { useTrack } from '@gitroom/react/helpers/use.track';
import { TrackEnum } from '@gitroom/nestjs-libraries/user/track.enum';
import { useVariables } from '@gitroom/react/helpers/variable.context';
import { LoadingComponent } from '@gitroom/frontend/components/layout/loading';
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
  useHarloAuthRedirect,
} from '@gitroom/frontend/components/auth/harlo-auth-fields';
import useCookie from 'react-use-cookie';

export function Register() {
  const getQuery = useSearchParams();
  const fetchData = useFetch();
  const [provider] = useState(getQuery?.get('provider')?.toUpperCase());
  const [code, setCode] = useState(getQuery?.get('code') || '');
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (provider && code) {
      load();
    }
  }, []);
  const load = useCallback(async () => {
    const { token } = await (
      await fetchData(`/auth/oauth/${provider?.toUpperCase() || 'LOCAL'}/exists`, {
        method: 'POST',
        body: JSON.stringify({
          code,
        }),
      })
    ).json();
    if (token) {
      setCode(token);
      setShow(true);
    }
  }, [provider, code, fetchData]);
  if (!code && !provider) {
    return <RegisterAfter token="" provider="LOCAL" />;
  }
  if (!show) {
    return <LoadingComponent />;
  }
  return (
    <RegisterAfter token={code} provider={provider?.toUpperCase() || 'LOCAL'} />
  );
}

export function RegisterAfter({
  token,
  provider,
}: {
  token: string;
  provider: string;
}) {
  const fetchData = useFetch();
  const fireEvents = useFireEvents();
  const track = useTrack();
  const redirectAfterAuth = useHarloAuthRedirect();
  const { isGeneral, genericOauth, mainUrl } = useVariables();
  const inviteToken = useSearchParams()?.get('org');
  const [datafast_visitor_id] = useCookie('datafast_visitor_id');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isAfterProvider = useMemo(() => {
    return !!token && !!provider && provider !== 'LOCAL';
  }, [token, provider]);
  const site = (mainUrl || 'https://www.harlosocial.com').replace(/\/+$/, '');

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const email = readFormValue(event, 'email');
    const password = readFormValue(event, 'password');
    const response = await fetchData('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        provider: provider || 'LOCAL',
        providerToken: token || '',
        datafast_visitor_id,
        ...(inviteToken ? { org: inviteToken } : {}),
      }),
    }).catch((err) => {
      setError(
        'General error: ' +
          err.toString() +
          '. Please check your browser console.'
      );
      setLoading(false);
      return null;
    });
    if (!response) {
      return;
    }
    if (response.status !== 200) {
      setError((await response.text()) || 'Could not create account');
      setLoading(false);
      return;
    }
    fireEvents('register');
    await track(TrackEnum.CompleteRegistration);
    if (redirectAfterAuth(response)) {
      return;
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="mt-7 text-center">
        <h1 className="text-[28px] font-semibold tracking-[-0.4px]">
          Create your account
        </h1>
        <p className="mt-2 text-[14.5px] leading-6 text-[#60656C]">
          Get started with Harlo and take control of your social media.
        </p>
      </div>
      <div className="mt-7">
        {inviteToken && <HarloInviteHint />}
        {!isAfterProvider && isGeneral && !genericOauth && <HarloGoogleButton />}
        {!isAfterProvider && isGeneral && !genericOauth && <HarloOrDivider />}
        <form className="space-y-3" onSubmit={onSubmit}>
          {error && <HarloAuthError>{error}</HarloAuthError>}
          {!isAfterProvider && (
            <>
              <div>
                <label htmlFor="signup-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Email address"
                  className={fieldClassName}
                />
              </div>
              <HarloPasswordField
                id="signup-password"
                name="password"
                autoComplete="new-password"
                placeholder="Password"
                minLength={8}
              />
            </>
          )}
          <button
            type="submit"
            disabled={loading}
            data-track="signup_completed"
            className={primaryButtonClassName}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="mt-4 text-center text-[12.5px] leading-5 text-[#60656C]">
          By creating an account you agree to our{' '}
          <a href={`${site}/terms`} className="font-medium text-[#3D5AFE]">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href={`${site}/privacy`} className="font-medium text-[#3D5AFE]">
            Privacy Policy
          </a>
          .
        </p>
        <p className="mt-5 text-center text-[13.5px] text-[#60656C]">
          Already have an account?{' '}
          <Link
            href={inviteAuthHref('/login', inviteToken)}
            className="font-medium text-[#3D5AFE]"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
