'use client';

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import dayjs from 'dayjs';
import { useUser } from '@gitroom/frontend/components/layout/user.context';
import { Onboarding } from '@gitroom/frontend/components/onboarding/onboarding';
import {
  formatMetric,
  usePublishedPostsAnalytics,
} from '@gitroom/frontend/components/platform-analytics/use.published.posts.analytics';
import { useWorkspaceOverview } from '@gitroom/frontend/components/workspace-home/use.workspace.overview';
import { useIntegrationList } from '@gitroom/frontend/components/launches/helpers/use.integration.list';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { expandPostsList } from '@gitroom/helpers/utils/posts.list.minify';
const stripCaption = (content?: string) =>
  (content || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim() || 'Untitled post';

const postThumb = (image?: string | null) => {
  if (!image) {
    return null;
  }
  try {
    const parsed = JSON.parse(image);
    const first = Array.isArray(parsed) ? parsed[0] : parsed;
    return first?.thumbnail || first?.path || first?.url || null;
  } catch {
    return image.startsWith('http') || image.startsWith('/') ? image : null;
  }
};

const platformSrc = (identifier?: string) =>
  identifier === 'youtube'
    ? '/icons/platforms/youtube.svg'
    : `/icons/platforms/${identifier || 'x'}.png`;

const StatusPill = ({ state }: { state?: string }) => {
  const map: Record<string, { label: string; className: string }> = {
    PUBLISHED: { label: 'Published', className: 'bg-emerald-50 text-emerald-600' },
    ERROR: { label: 'Failed', className: 'bg-rose-50 text-rose-600' },
    DRAFT: { label: 'Draft', className: 'bg-slate-100 text-slate-500' },
  };
  const item = map[state || ''] || {
    label: 'Scheduled',
    className: 'bg-blue-50 text-blue-600',
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${item.className}`}>
      {item.label}
    </span>
  );
};

export const WorkspaceHomeComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fetch = useFetch();
  const user = useUser();
  const { data: overview } = useWorkspaceOverview();
  const { data: integrations } = useIntegrationList();
  const { data: analytics } = usePublishedPostsAnalytics(30);
  const openedCreate = useRef(false);

  const loadRecent = useCallback(async () => {
    const response = await fetch('/posts/list?page=0&limit=8&customer=&state=all');
    return expandPostsList(await response.json());
  }, [fetch]);
  const { data: recentData } = useSWR('home-recent-posts', loadRecent, {
    revalidateOnFocus: false,
  });

  const openCreatePost = useCallback(() => {
    router.push('/compose');
  }, [router]);

  useEffect(() => {
    if (openedCreate.current || searchParams.get('create') !== '1') {
      return;
    }
    openedCreate.current = true;
    router.replace('/compose');
  }, [router, searchParams]);

  const accounts = integrations || [];
  const platforms = useMemo(
    () =>
      new Set(
        accounts
          .map((item: { identifier?: string; providerIdentifier?: string }) =>
            (item.providerIdentifier || item.identifier || '').split('-')[0]
          )
          .filter(Boolean)
      ).size,
    [accounts]
  );

  const impressions = analytics?.totals?.impressions;
  const engagements = analytics?.totals?.engagements;
  const engagementRate =
    impressions && engagements != null ? `${((engagements / impressions) * 100).toFixed(1)}%` : '—';

  const recent = (recentData?.posts || []).slice(0, 5);
  const upcoming = (overview?.upcoming || []).slice(0, 5);
  const reachById = useMemo(() => {
    const map = new Map<string, string>();
    (analytics?.posts || []).forEach((post) => {
      if (post.impressions != null) {
        map.set(post.id, `${formatMetric(post.impressions)} Reach`);
      }
    });
    return map;
  }, [analytics?.posts]);

  const actions = [
    {
      label: 'Create a post',
      className: 'bg-[#eef4ff] text-blue-600',
      icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
      onClick: openCreatePost,
    },
    {
      label: 'View calendar',
      className: 'bg-[#f3e8ff] text-violet-600',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      onClick: () => router.push('/launches'),
    },
    {
      label: 'Check analytics',
      className: 'bg-[#fff1e8] text-orange-500',
      icon: 'M4 19V5M4 19h16M8 16v-5M12 16V8M16 16v-3',
      onClick: () => router.push('/analytics'),
    },
    {
      label: 'Manage campaigns',
      className: 'bg-[#e8f8ef] text-emerald-600',
      icon: 'M3 11l18-5v12L3 14v-3zM11.6 16.8a3 3 0 11-5.8-1.6',
      onClick: () => router.push('/campaigns'),
    },
  ];

  return (
    <div className="min-h-full px-6 py-5 md:px-8 font-sans text-slate-800">
      <Onboarding />
      <p className="text-sm text-slate-500">{dayjs().format('dddd, D MMMM')}</p>
      <h1 className="mt-1 text-[32px] font-extrabold tracking-tight text-slate-900">
        Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Here&apos;s what&apos;s happening with your social media today.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          tint="bg-[#eef4ff]"
          iconClass="text-blue-600"
          icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          label="Scheduled Posts"
          value={String(overview?.scheduled || 0)}
          note="Waiting to publish"
        />
        <MetricCard
          tint="bg-[#f4efff]"
          iconClass="text-violet-600"
          icon="M4 19V5M4 19h16M8 16v-5M12 16V8M16 16v-3"
          label="Total Reach"
          value={formatMetric(impressions)}
          note="Last 30 days"
        />
        <MetricCard
          tint="bg-[#fff4ec]"
          iconClass="text-orange-500"
          icon="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          label="Engagement Rate"
          value={engagementRate}
          note="Likes, comments and shares"
        />
        <MetricCard
          tint="bg-[#e9f8ef]"
          iconClass="text-emerald-600"
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          label="Connected Accounts"
          value={String(accounts.length)}
          note={`Across ${platforms} platform${platforms === 1 ? '' : 's'}`}
        />
      </div>

      <h2 className="mb-3 mt-8 text-base font-bold text-slate-900">Quick Actions</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className={`flex h-14 items-center justify-between rounded-2xl px-4 text-sm font-semibold ${action.className}`}
          >
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={action.icon} />
              </svg>
              {action.label}
            </span>
            <span>›</span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-base font-bold text-slate-900">Recent Posts</h2>
            <button type="button" onClick={() => router.push('/launches?state=all')} className="text-xs font-semibold text-blue-600">
              View all →
            </button>
          </div>
          <table className="w-full text-left">
            <thead className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-5 py-2 font-semibold">Post</th>
                <th className="px-3 py-2 font-semibold">Platforms</th>
                <th className="px-3 py-2 font-semibold">Date & time</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-5 py-2 font-semibold">Performance</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-sm text-slate-400">
                    No posts yet. Create one to see it here.
                  </td>
                </tr>
              ) : (
                recent.map((post: { id: string; content?: string; publishDate: string; state?: string; image?: string; integration?: { providerIdentifier?: string; name?: string } }) => (
                  <tr key={post.id} className="border-t border-slate-100">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          {postThumb(post.image) ? (
                            <img src={postThumb(post.image) || ''} alt="" className="h-full w-full object-cover" />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <div className="max-w-[220px] truncate text-sm font-semibold text-slate-900">
                            {stripCaption(post.content)}
                          </div>
                          <div className="truncate text-[11px] text-slate-400">
                            {post.integration?.name || 'Workspace'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      {post.integration?.providerIdentifier ? (
                        <img src={platformSrc(post.integration.providerIdentifier)} alt="" className="h-4 w-4 rounded-full" />
                      ) : null}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-slate-500">
                      {dayjs(post.publishDate).format('D MMM YYYY')}
                      <div>{dayjs(post.publishDate).format('h:mm A')}</div>
                    </td>
                    <td className="px-3 py-3">
                      <StatusPill state={post.state} />
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500">
                      {reachById.get(post.id) || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-base font-bold text-slate-900">Upcoming Posts</h2>
            <button type="button" onClick={() => router.push('/launches?state=scheduled')} className="text-xs font-semibold text-blue-600">
              View all →
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {upcoming.length === 0 ? (
              <p className="px-5 py-8 text-sm text-slate-400">Nothing is scheduled yet.</p>
            ) : (
              upcoming.map((post) => (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => router.push('/launches?state=scheduled')}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-slate-50"
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {postThumb(post.image) ? (
                      <img src={postThumb(post.image) || ''} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-slate-900">{stripCaption(post.content)}</div>
                    <div className="mt-0.5 flex items-center gap-1">
                      {post.integration?.providerIdentifier ? (
                        <img src={platformSrc(post.integration.providerIdentifier)} alt="" className="h-3.5 w-3.5 rounded-full" />
                      ) : null}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">{dayjs(post.publishDate).format('D MMM YYYY')}</div>
                    <div className="text-xs text-slate-400">{dayjs(post.publishDate).format('h:mm A')}</div>
                    <div className="mt-1">
                      <StatusPill state={post.state} />
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const MetricCard = ({
  tint,
  iconClass,
  icon,
  label,
  value,
  note,
}: {
  tint: string;
  iconClass: string;
  icon: string;
  label: string;
  value: string;
  note: string;
}) => (
  <div className={`rounded-2xl p-5 ${tint}`}>
    <div className={`mb-3 ${iconClass}`}>
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
      </svg>
    </div>
    <div className="text-xs font-medium text-slate-500">{label}</div>
    <div className="mt-1 text-[28px] font-extrabold leading-none text-slate-900">{value}</div>
    <div className="mt-2 text-[11px] font-medium text-slate-500">{note}</div>
  </div>
);
