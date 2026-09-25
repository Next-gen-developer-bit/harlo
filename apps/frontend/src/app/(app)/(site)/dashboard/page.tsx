export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { WorkspaceHomeComponent } from '@gitroom/frontend/components/workspace-home/workspace.home.component';

export const metadata: Metadata = {
  title: 'Dashboard - Harlo Social',
  description: 'Workspace at a glance.',
};

export default function Page() {
  return <WorkspaceHomeComponent />;
}
