export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { WorkspacesPage } from '@gitroom/frontend/components/harlo-pages/designed.pages';

export const metadata: Metadata = {
  title: 'Workspaces - Harlo Social',
  description: 'Manage your workspaces.',
};

export default function Page() {
  return <WorkspacesPage />;
}
