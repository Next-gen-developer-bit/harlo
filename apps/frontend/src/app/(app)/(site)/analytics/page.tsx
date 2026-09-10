export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { PlatformAnalytics } from '@gitroom/frontend/components/platform-analytics/platform.analytics';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';
export const metadata: Metadata = {
  title: 'Analytics - Harlo Social',
  description: 'View post performance and engagement insights.',
};
export default async function Index() {
  return <PlatformAnalytics />;
}
