import { ThirdPartyComponent } from '@gitroom/frontend/components/third-parties/third-party.component';

export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Social Accounts - Harlo Social',
  description: 'Connect and manage social media accounts for your workspace.',
};
export default async function Index() {
  return <ThirdPartyComponent />;
}
