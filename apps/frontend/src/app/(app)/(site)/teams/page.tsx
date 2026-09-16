export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { TeamsComponent } from '@gitroom/frontend/components/settings/teams.component';

export const metadata: Metadata = {
  title: 'Teams - Harlo Social',
  description: 'Invite members, assign roles and workspaces, and control who can publish.',
};

export default function TeamsPage() {
  return <TeamsComponent />;
}
