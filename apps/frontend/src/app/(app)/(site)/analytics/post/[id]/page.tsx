export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { PostInsightsPage } from '@gitroom/frontend/components/platform-analytics/post.insights.page';

export const metadata: Metadata = {
  title: 'Post Insights - Harlo Social',
  description: 'Performance for one published post on each channel.',
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PostInsightsPage postId={id} />;
}
