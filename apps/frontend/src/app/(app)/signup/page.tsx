import { Register } from '@gitroom/frontend/components/auth/register';
import {
  AuthCard,
  AuthMarketingPanel,
} from '@gitroom/frontend/components/auth/harlo-auth-shell';
import { internalFetch } from '@gitroom/helpers/utils/internal.fetch';
import Link from 'next/link';
import { getT } from '@gitroom/react/translation/get.translation.service.backend';
import { LoginWithOidc } from '@gitroom/frontend/components/auth/login.with.oidc';
import { Metadata } from 'next';
import { Suspense } from 'react';
import ReturnUrlComponent from '@gitroom/frontend/app/(app)/auth/return.url.component';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sign Up | Harlo Social',
  description: 'Create your Harlo account.',
};

function SignupShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F8F9FA] text-[#111] lg:flex-row">
      <Suspense fallback={null}>
        <ReturnUrlComponent />
      </Suspense>
      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:py-16">
        <AuthCard>{children}</AuthCard>
      </div>
      <div className="hidden flex-1 items-center justify-center px-6 pb-14 sm:px-10 lg:flex lg:px-14 lg:py-16">
        <AuthMarketingPanel />
      </div>
    </div>
  );
}

export default async function SignupPage(params: {
  searchParams: Promise<{ provider: string }>;
}) {
  const t = await getT();
  if (process.env.DISABLE_REGISTRATION === 'true') {
    const canRegister = (
      await (await internalFetch('/auth/can-register')).json()
    ).register;
    if (!canRegister && !(await params?.searchParams)?.provider) {
      return (
        <SignupShell>
          <LoginWithOidc />
          <div className="text-center text-[14.5px] text-[#60656C]">
            {t('registration_is_disabled', 'Registration is disabled')}
            <br />
            <Link className="font-medium text-[#3D5AFE]" href="/login">
              {t('login_instead', 'Login instead')}
            </Link>
          </div>
        </SignupShell>
      );
    }
  }
  return (
    <SignupShell>
      <Suspense>
        <Register />
      </Suspense>
    </SignupShell>
  );
}
