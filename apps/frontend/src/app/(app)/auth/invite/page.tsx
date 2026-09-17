import { InviteAccept } from '@gitroom/frontend/components/auth/invite';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Accept Invitation | Harlo Social',
  description: 'Accept your Harlo workspace invitation.',
};

export default function AuthInvite() {
  return (
    <Suspense>
      <InviteAccept />
    </Suspense>
  );
}
