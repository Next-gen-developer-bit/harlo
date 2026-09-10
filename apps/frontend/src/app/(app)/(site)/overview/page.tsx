export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { WorkspaceHomeComponent } from '@gitroom/frontend/components/workspace-home/workspace.home.component';

export const metadata: Metadata = {
  title: 'Overview - Harlo Social',
  description: 'Harlo Social workspace overview',
};

export default function WorkspaceOverviewPage() {
  return <WorkspaceHomeComponent />;
}
