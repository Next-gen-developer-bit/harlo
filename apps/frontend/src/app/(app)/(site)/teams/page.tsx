export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';
import { TeamsComponent } from '@gitroom/frontend/components/settings/teams.component';

export const metadata: Metadata = {
  title: 'Teams - Harlo Social',
  description: 'Manage team members and workspace permissions.',
};

export default function TeamsPage() {
  return <TeamsComponent />;
}
