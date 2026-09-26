'use client';

import { ReactNode, useCallback } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import dayjs from 'dayjs';
import { useUser } from '@gitroom/frontend/components/layout/user.context';
import { ComposePicker } from '@gitroom/frontend/components/compose/compose.picker';
import { useWorkspaceOverview } from '@gitroom/frontend/components/workspace-home/use.workspace.overview';
import { useIntegrationList } from '@gitroom/frontend/components/launches/helpers/use.integration.list';
import { useOrganizations } from '@gitroom/frontend/components/layout/use.organizations';
import {
  formatMetric,
  usePublishedPostsAnalytics,
} from '@gitroom/frontend/components/platform-analytics/use.published.posts.analytics';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { expandPostsList } from '@gitroom/helpers/utils/posts.list.minify';

const shell =
  'w-full max-w-[1440px] mx-auto px-6 py-6 md:px-8 font-sans text-slate-800';

const PageHeader = ({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  action?: ReactNode;
}) => (
  <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
    <div>
      {eyebrow ? (
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-[28px] font-extrabold tracking-tight text-slate-900">
        {title}
      </h1>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
    </div>
    {action}
  </div>
);

const PrimaryLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link
    href={href}
    className="inline-flex h-10 items-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
  >
    {children}
  </Link>
);

const Stat = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5">
    <div className="text-xs font-medium text-slate-500">{label}</div>
    <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
    {hint ? <div className="mt-1 text-xs text-slate-400">{hint}</div> : null}
  </div>
);

export const DashboardPage = () => {
  const user = useUser();
  const { data: overview } = useWorkspaceOverview();
  const { data: integrations } = useIntegrationList();
  const connected = (integrations || []).filter(
    (item: { disabled?: boolean; refreshNeeded?: boolean }) =>
      !item.disabled && !item.refreshNeeded
  ).length;

  return (
    <div className={shell}>
      <PageHeader
        eyebrow="Dashboard"
        title={user?.orgName || 'Workspace'}
        subtitle="Your connected channels, team, campaigns and upcoming content."
        action={<PrimaryLink href="/compose">Create post</PrimaryLink>}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat label="Connected accounts" value={connected} hint="Ready to publish" />
        <Stat label="Scheduled" value={overview?.scheduled || 0} hint="Waiting to go live" />
        <Stat label="Drafts" value={overview?.drafts || 0} hint="Still being written" />
        <Stat label="Failed" value={overview?.failed || 0} hint="Need a retry" />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Upcoming posts</h2>
            <Link href="/launches?state=scheduled" className="text-xs font-medium text-blue-600">
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {(overview?.upcoming || []).slice(0, 5).map((post) => (
              <div key={post.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate text-slate-700">
                  {(post.content || 'Untitled post').replace(/<[^>]*>/g, ' ').trim()}
                </span>
                <span className="shrink-0 text-xs text-slate-400">
                  {dayjs(post.publishDate).format('D MMM, h:mm A')}
                </span>
              </div>
            ))}
            {!overview?.upcoming?.length ? (
              <p className="text-sm text-slate-400">Nothing scheduled yet.</p>
            ) : null}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Jump back in</h2>
          <div className="grid gap-2">
            <PrimaryLink href="/launches">Open calendar</PrimaryLink>
            <Link href="/media" className="text-sm font-medium text-blue-600">
              Content library
            </Link>
            <Link href="/analytics" className="text-sm font-medium text-blue-600">
              Analytics
            </Link>
            <Link href="/teams" className="text-sm font-medium text-blue-600">
              Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ComposePage = () => {
  return <ComposePicker />;
};

export const QueuePage = () => {
  const fetch = useFetch();
  const load = useCallback(async () => {
    const response = await fetch('/posts/list?page=0&limit=20&customer=&state=scheduled');
    return expandPostsList(await response.json());
  }, [fetch]);
  const { data, isLoading } = useSWR('content-queue', load, {
    revalidateOnFocus: false,
  });
  const posts = data?.posts || [];

  return (
    <div className={shell}>
      <PageHeader
        eyebrow="Queue"
        title="Your content queue"
        subtitle="Keep a consistent presence by sharing the posts already scheduled to publish."
        action={<PrimaryLink href="/compose">Add to queue</PrimaryLink>}
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Stat label="Posts in your queue" value={isLoading ? '…' : posts.length} />
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {posts.length === 0 && !isLoading ? (
          <div className="p-8 text-sm text-slate-500">
            The queue is empty. Schedule a post and it will wait here until its publish time.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {posts.map((post: { id: string; content?: string; publishDate: string; integration?: { name?: string } }) => (
              <div key={post.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-slate-900">
                    {(post.content || 'Untitled post').replace(/<[^>]*>/g, ' ').trim()}
                  </div>
                  <div className="text-xs text-slate-400">{post.integration?.name || 'Account'}</div>
                </div>
                <div className="shrink-0 text-xs text-slate-500">
                  {dayjs(post.publishDate).format('D MMM YYYY, h:mm A')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const CampaignsPage = () => (
  <div className={shell}>
    <PageHeader
      eyebrow="Campaigns"
      title="Your campaigns"
      subtitle="Plan, organise and track your social media campaigns."
        action={<PrimaryLink href="/compose">Create post</PrimaryLink>}
    />
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
      <h2 className="text-lg font-semibold text-slate-900">No campaigns yet</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        Campaigns group the posts you already schedule. Start from the composer,
        then follow them on the calendar and in analytics.
      </p>
      <div className="mt-5 flex justify-center gap-3">
        <PrimaryLink href="/compose">Create post</PrimaryLink>
        <Link href="/launches" className="inline-flex h-10 items-center text-sm font-semibold text-blue-600">
          Open calendar
        </Link>
      </div>
    </div>
  </div>
);

export const WorkspacesPage = () => {
  const user = useUser();
  const { data: organizations } = useOrganizations();

  return (
    <div className={shell}>
      <PageHeader
        eyebrow="Workspaces"
        title={user?.orgName || 'Workspace'}
        subtitle="Manage your brand, content, campaigns and team from one place."
        action={<PrimaryLink href="/compose">Create post</PrimaryLink>}
      />
      <div className="grid gap-3">
        {(organizations || []).map((org) => (
          <div
            key={org.id}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4"
          >
            <div>
              <div className="font-semibold text-slate-900">{org.name}</div>
              <div className="text-xs text-slate-400">
                {org.id === user?.orgId ? 'Current workspace' : 'Switch from the sidebar'}
              </div>
            </div>
            {org.id === user?.orgId ? (
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                Active
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ReportsPage = () => {
  const { data, isLoading } = usePublishedPostsAnalytics(30);

  return (
    <div className={shell}>
      <PageHeader
        eyebrow="Reports"
        title="Performance report"
        subtitle="A snapshot of the last 30 days across your connected channels."
        action={<PrimaryLink href="/analytics">View insights</PrimaryLink>}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Stat
          label="Impressions"
          value={isLoading ? '…' : formatMetric(data?.totals.impressions)}
        />
        <Stat
          label="Engagements"
          value={isLoading ? '…' : formatMetric(data?.totals.engagements)}
        />
        <Stat label="Published posts" value={isLoading ? '…' : data?.totals.published || 0} />
      </div>
    </div>
  );
};
