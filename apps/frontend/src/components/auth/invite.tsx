'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import {
  HarloAuthError,
  inviteAuthHref,
  primaryButtonClassName,
  readInviteEmail,
} from '@gitroom/frontend/components/auth/harlo-auth-fields';
import { LoadingComponent } from '@gitroom/frontend/components/layout/loading';

const useInviteUser = () => {
  const fetchData = useFetch();
  return useSWR('invite-user', async () => {
    const response = await fetchData('/user/self');
    if (!response.ok) {
      return null;
    }
    return response.json();
  });
};

export function InviteAccept() {
  const fetchData = useFetch();
  const org = useSearchParams()?.get('org') || '';
  const inviteEmail = readInviteEmail(org);
  const { data: user, isLoading } = useInviteUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const acceptInvite = useCallback(async () => {
    if (!org) {
      setError('This invitation link is missing.');
      return;
    }
    setLoading(true);
    setError('');
    const response = await fetchData('/user/join-org', {
      method: 'POST',
      body: JSON.stringify({ org }),
    });
    const payload = await response.json().catch(() => ({}));
    if (response.status === 401) {
      window.location.href = inviteAuthHref('/auth', org);
      return;
    }
    if (payload?.reason === 'email_mismatch') {
      setError(
        `This invitation is for ${
          payload.email || inviteEmail || 'another email'
        }. Sign in with that account to join.`
      );
      setLoading(false);
      return;
    }
    if (!response.ok || !payload?.id) {
      setError(
        payload?.reason === 'invite_used'
          ? 'This invitation has already been used.'
          : 'This invitation is invalid or has expired.'
      );
      setLoading(false);
      return;
    }
    window.location.href = '/overview?added=true';
  }, [fetchData, inviteEmail, org]);

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (!org) {
    return (
      <div className="mt-7 text-center">
        <h1 className="text-[28px] font-semibold tracking-[-0.4px]">
          Invitation not found
        </h1>
        <p className="mt-2 text-[14.5px] leading-6 text-[#60656C]">
          Open the Accept the invitation link from your email to join the
          workspace.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mt-7 text-center">
        <h1 className="text-[28px] font-semibold tracking-[-0.4px]">
          Join this workspace
        </h1>
        <p className="mt-2 text-[14.5px] leading-6 text-[#60656C]">
          {inviteEmail
            ? `Accept this invitation with ${inviteEmail} to join the team.`
            : 'Accept this invitation to join the team.'}
        </p>
      </div>
      <div className="mt-7 space-y-3">
        {error && <HarloAuthError>{error}</HarloAuthError>}
        {user?.email ? (
          <>
            <button
              type="button"
              disabled={loading}
              onClick={acceptInvite}
              className={primaryButtonClassName}
            >
              {loading ? 'Joining…' : 'Accept invitation'}
            </button>
            <p className="text-center text-[13.5px] text-[#60656C]">
              Signed in as {user.email}.{' '}
              <Link
                href={inviteAuthHref('/auth/logout', org)}
                className="font-medium text-[#3D5AFE]"
              >
                Use a different account
              </Link>
            </p>
          </>
        ) : (
          <>
            <Link
              href={inviteAuthHref('/signup', org)}
              className={primaryButtonClassName}
            >
              Create account to join
            </Link>
            <p className="text-center text-[13.5px] text-[#60656C]">
              Already have an account?{' '}
              <Link
                href={inviteAuthHref('/login', org)}
                className="font-medium text-[#3D5AFE]"
              >
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
