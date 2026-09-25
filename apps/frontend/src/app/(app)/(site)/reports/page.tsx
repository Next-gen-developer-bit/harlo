export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { ReportsPage } from '@gitroom/frontend/components/harlo-pages/designed.pages';

export const metadata: Metadata = {
  title: 'Reports - Harlo Social',
  description: 'Performance report across your channels.',
};

export default function Page() {
  return <ReportsPage />;
}
