import { ReactNode } from 'react';
import { AuthSplitLayout } from '@gitroom/frontend/components/auth/harlo-auth-shell';

export const dynamic = 'force-dynamic';

// All /auth routes render form content only. This layout supplies the
// two-column Harlo shell and marketing panel once.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthSplitLayout>{children}</AuthSplitLayout>;
}
