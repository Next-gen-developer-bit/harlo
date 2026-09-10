import { DocsComponent } from '@gitroom/frontend/components/docs/docs.component';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Docs - Harlo Social',
  description: 'Learn how to schedule posts, connect accounts, and manage workspaces with Harlo Social.',
};

export default function DocsPage() {
  return <DocsComponent />;
}
