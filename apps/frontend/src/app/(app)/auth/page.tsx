import { Register } from '@gitroom/frontend/components/auth/register';
import { internalFetch } from '@gitroom/helpers/utils/internal.fetch';
import Link from 'next/link';
import { getT } from '@gitroom/react/translation/get.translation.service.backend';
import { LoginWithOidc } from '@gitroom/frontend/components/auth/login.with.oidc';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sign Up | Harlo Social',
  description: 'Create your Harlo account.',
};

export default async function Auth(params: {
  searchParams: Promise<{ provider?: string }>;
}) {
  const t = await getT();
  const searchParams = await params?.searchParams;
  if (process.env.DISABLE_REGISTRATION === 'true') {
    const canRegister = (
      await (await internalFetch('/auth/can-register')).json()
    ).register;
    if (!canRegister && !searchParams?.provider) {
      return (
        <>
          <LoginWithOidc />
          <div className="text-center text-[14.5px] text-[#60656C]">
            {t('registration_is_disabled', 'Registration is disabled')}
            <br />
            <Link className="font-medium text-[#3D5AFE]" href="/auth/login">
              {t('login_instead', 'Login instead')}
            </Link>
          </div>
        </>
      );
    }
  }
  return (
    <Suspense>
      <Register />
    </Suspense>
  );
}
