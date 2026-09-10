import { LifetimeDeal } from '@gitroom/frontend/components/billing/lifetime.deal';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';
export const metadata: Metadata = {
  title: 'Lifetime Deal - Harlo Social',
  description: 'Get a lifetime deal on Harlo Social.',
};
export default async function Page() {
  return <LifetimeDeal />;
}
