export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { ComposePage } from '@gitroom/frontend/components/harlo-pages/designed.pages';

export const metadata: Metadata = {
  title: 'Compose - Harlo Social',
  description: 'Create and schedule a social post.',
};

export default function Page() {
  return <ComposePage />;
}
