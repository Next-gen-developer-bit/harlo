import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Agent - Harlo Social',
  description: 'AI agent assistant for Harlo Social.',
};

export default async function Page() {
  return redirect('/overview');
}
