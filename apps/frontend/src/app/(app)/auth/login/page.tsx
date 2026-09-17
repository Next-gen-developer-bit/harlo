import { Login } from '@gitroom/frontend/components/auth/login';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Log In | Harlo Social',
  description: 'Log in to your Harlo account.',
};

export default function AuthLogin() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
