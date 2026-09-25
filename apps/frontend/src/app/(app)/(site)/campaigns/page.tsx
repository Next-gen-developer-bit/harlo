export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { CampaignsPage } from '@gitroom/frontend/components/harlo-pages/designed.pages';

export const metadata: Metadata = {
  title: 'Campaigns - Harlo Social',
  description: 'Plan and track social media campaigns.',
};

export default function Page() {
  return <CampaignsPage />;
}
