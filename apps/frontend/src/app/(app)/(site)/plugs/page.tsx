export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Plugs - Harlo Social',
  description: 'Manage Harlo Social integrations and automation plugs.',
};

export default async function Index() {
  redirect('/overview');
}
