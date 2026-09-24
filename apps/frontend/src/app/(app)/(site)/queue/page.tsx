export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { QueuePage } from '@gitroom/frontend/components/harlo-pages/designed.pages';

export const metadata: Metadata = {
  title: 'Queue - Harlo Social',
  description: 'Posts waiting to publish.',
};

export default function Page() {
  return <QueuePage />;
}
