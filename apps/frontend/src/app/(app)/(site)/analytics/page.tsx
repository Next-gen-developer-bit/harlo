export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { AnalyticsDashboard } from '@gitroom/frontend/components/platform-analytics/analytics.dashboard';

export const metadata: Metadata = {
  title: 'Analytics - Harlo Social',
  description: 'View post performance and engagement insights.',
};

export default async function Index() {
  return <AnalyticsDashboard />;
}
