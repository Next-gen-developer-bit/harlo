import { ReactNode } from 'react';
import { AuthSplitLayout } from '@gitroom/frontend/components/auth/harlo-auth-shell';

export const dynamic = 'force-dynamic';

// Login and signup pages build their own two-column shell. Remaining
// /auth routes (forgot, activate, OAuth) only render form content, so
// this layout supplies the same marketing panel for those pages.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthSplitLayout>{children}</AuthSplitLayout>;
}
