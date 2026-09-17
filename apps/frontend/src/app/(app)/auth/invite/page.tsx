import { InviteAccept } from '@gitroom/frontend/components/auth/invite';
import {
  AuthCard,
  AuthMarketingPanel,
} from '@gitroom/frontend/components/auth/harlo-auth-shell';
import { Metadata } from 'next';
import { Suspense } from 'react';
import ReturnUrlComponent from '@gitroom/frontend/app/(app)/auth/return.url.component';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Accept Invitation | Harlo Social',
  description: 'Accept your Harlo workspace invitation.',
};

export default function AuthInvite() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F8F9FA] text-[#111] lg:flex-row">
      <Suspense fallback={null}>
        <ReturnUrlComponent />
      </Suspense>
      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:py-16">
        <AuthCard>
          <Suspense>
            <InviteAccept />
          </Suspense>
        </AuthCard>
      </div>
      <div className="hidden flex-1 items-center justify-center px-6 pb-14 sm:px-10 lg:flex lg:px-14 lg:py-16">
        <AuthMarketingPanel />
      </div>
    </div>
  );
}
