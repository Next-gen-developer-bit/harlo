'use client';

import React, { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useIntegrationList } from '@gitroom/frontend/components/launches/helpers/use.integration.list';
import {
  PLATFORM_LABELS,
  platformFamily,
} from '@gitroom/frontend/components/launches/helpers/mvp.platforms';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { ImportStatsModal } from '@gitroom/frontend/components/platform-analytics/import.stats.modal';
import {
  AnalyticsPeriod,
  formatMetric,
  PublishedPostAnalytics,
  PublishedPostsChannelAnalytics,
  usePublishedPostsAnalytics,
} from '@gitroom/frontend/components/platform-analytics/use.published.posts.analytics';

const PLATFORM_COLORS: Record<string, string> = {
  instagram: '#ec4899',
  linkedin: '#0a66c2',
  tiktok: '#111827',
  facebook: '#2563eb',
  x: '#475569',
  youtube: '#ef4444',
  pinterest: '#dc2626',
  threads: '#64748b',
};

const platformIcon = (identifier?: string) => {
  const family = platformFamily(identifier);
  return family === 'youtube'
    ? '/icons/platforms/youtube.svg'
    : `/icons/platforms/${identifier || family}.png`;
};

const stripCaption = (content?: string) =>
  (content || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim() || 'Published post';

const sumAvailable = (values: Array<number | null>) => {
  const available = values.filter((value): value is number => value !== null);
  return available.length
    ? available.reduce((total, value) => total + value, 0)
    : null;
};

const MetricIcon = ({
  tone,
  children,
}: {
  tone: string;
  children: React.ReactNode;
}) => (
  <div
    className={clsx(
      'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
      tone
    )}
  >
    {children}
  </div>
);

const MetricCard = ({
  title,
  value,
  caption,
  tone,
  children,
}: {
  title: string;
  value: string;
  caption: string;
  tone: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
    <div className="flex items-start gap-3">
      <MetricIcon tone={tone}>{children}</MetricIcon>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold text-slate-500">{title}</div>
        <div className="mt-0.5 truncate text-[22px] font-bold tracking-[-0.02em] text-slate-900">
          {value}
        </div>
        <div className="mt-0.5 text-[10px] text-slate-400">{caption}</div>
      </div>
    </div>
  </div>
);

const EmptyChart = ({ message }: { message: string }) => (
  <div className="flex h-[190px] items-center justify-center text-center text-xs text-slate-400">
    {message}
  </div>
);

const PerformanceTrend = ({
  posts,
  period,
}: {
  posts: PublishedPostAnalytics[];
  period: AnalyticsPeriod;
}) => {
  const chart = useMemo(() => {
    const count = period === 7 ? 7 : 10;
    const start = dayjs()
      .subtract(period - 1, 'day')
      .startOf('day');
    const values = Array.from({ length: count }, (_, index) => {
      const dayOffset = Math.round(((period - 1) * index) / (count - 1));
      const date = start.add(dayOffset, 'day').endOf('day');
      return {
        label: date.format(period === 7 ? 'ddd' : 'D MMM'),
        value: posts.filter((post) => dayjs(post.publishDate).isBefore(date))
          .length,
      };
    });

    const max = Math.max(...values.map((point) => point.value), 0);
    const plot = { left: 42, top: 18, width: 638, height: 150 };
    const points = values.map((point, index) => {
      const x =
        plot.left + (plot.width * index) / Math.max(values.length - 1, 1);
      const y =
        plot.top + plot.height - (max ? (point.value / max) * plot.height : 0);
      return { ...point, x, y };
    });
    const line = points
      .map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`)
      .join(' ');
    const area = points.length
      ? `${line} L ${points[points.length - 1].x} ${plot.top + plot.height} L ${
          points[0].x
        } ${plot.top + plot.height} Z`
      : '';

    return { values, max, plot, points, line, area };
  }, [period, posts]);

  if (!chart.max) {
    return (
      <EmptyChart message="Publishing activity appears here after a post goes live." />
    );
  }

  return (
    <div className="h-[210px] w-full">
      <svg
        viewBox="0 0 720 210"
        className="h-full w-full overflow-visible"
        role="img"
        aria-label="Cumulative publishing activity"
      >
        <defs>
          <linearGradient id="analytics-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        {[0, 0.33, 0.66, 1].map((ratio) => {
          const y = chart.plot.top + chart.plot.height * ratio;
          return (
            <g key={ratio}>
              <line
                x1={chart.plot.left}
                x2={chart.plot.left + chart.plot.width}
                y1={y}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="3 4"
              />
              <text
                x={chart.plot.left - 8}
                y={y + 3}
                textAnchor="end"
                fill="#94a3b8"
                fontSize="9"
              >
                {formatMetric(Math.round(chart.max * (1 - ratio)))}
              </text>
            </g>
          );
        })}
        <path d={chart.area} fill="url(#analytics-area)" />
        <path
          d={chart.line}
          fill="none"
          stroke="#2563eb"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {chart.points.map((point, index) => (
          <g key={`${point.label}-${index}`}>
            <circle
              cx={point.x}
              cy={point.y}
              r="3"
              fill="#fff"
              stroke="#2563eb"
              strokeWidth="2"
            />
            {(index === 0 ||
              index === chart.points.length - 1 ||
              index % 2 === 0) && (
              <text
                x={point.x}
                y={chart.plot.top + chart.plot.height + 22}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="9"
              >
                {point.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};

const EngagementBars = ({
  channels,
}: {
  channels: PublishedPostsChannelAnalytics[];
}) => {
  const rows = useMemo(
    () =>
      [...channels]
        .filter((channel) => channel.engagements !== null)
        .sort((a, b) => (b.engagements || 0) - (a.engagements || 0))
        .slice(0, 7),
    [channels]
  );
  const max = Math.max(...rows.map((row) => row.engagements || 0), 0);

  if (!rows.length) {
    return <EmptyChart message="No channel engagement for this period yet." />;
  }

  return (
    <div className="flex h-[210px] items-end gap-3 px-2 pb-1 pt-4">
      {rows.map((channel) => {
        const family = platformFamily(channel.providerIdentifier);
        const value = channel.engagements as number;
        const height = max ? Math.max(12, (value / max) * 145) : 12;
        return (
          <div
            key={channel.id}
            className="flex min-w-0 flex-1 flex-col items-center justify-end"
          >
            <span className="mb-2 text-[10px] font-semibold text-slate-600">
              {formatMetric(value)}
            </span>
            <div
              className="w-full max-w-[38px] rounded-t-md"
              style={{
                height,
                backgroundColor: PLATFORM_COLORS[family] || '#2563eb',
              }}
            />
            <img
              src={platformIcon(channel.providerIdentifier)}
              alt={PLATFORM_LABELS[family] || family}
              className="mt-2 h-4 w-4 object-contain"
            />
          </div>
        );
      })}
    </div>
  );
};

const PlatformMix = ({
  channels,
}: {
  channels: PublishedPostsChannelAnalytics[];
}) => {
  const total = channels.reduce((sum, channel) => sum + channel.posts, 0);
  let cursor = 0;
  const stops = channels.map((channel) => {
    const family = platformFamily(channel.providerIdentifier);
    const start = cursor;
    cursor += total ? (channel.posts / total) * 100 : 0;
    return `${PLATFORM_COLORS[family] || '#2563eb'} ${start}% ${cursor}%`;
  });

  return (
    <div className="mt-4 flex items-center gap-5">
      <div
        className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full"
        style={{
          background: total
            ? `conic-gradient(${stops.join(', ')})`
            : 'conic-gradient(#e2e8f0 0 100%)',
        }}
      >
        <div className="flex h-[72px] w-[72px] flex-col items-center justify-center rounded-full bg-white">
          <strong className="text-lg text-slate-900">{total}</strong>
          <span className="text-[9px] text-slate-400">Published</span>
        </div>
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        {channels.slice(0, 7).map((channel) => {
          const family = platformFamily(channel.providerIdentifier);
          return (
            <div
              key={channel.id}
              className="flex items-center justify-between gap-3 text-[10px]"
            >
              <span className="flex min-w-0 items-center gap-2 text-slate-600">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor: PLATFORM_COLORS[family] || '#2563eb',
                  }}
                />
                <span className="truncate">
                  {PLATFORM_LABELS[family] || family}
                </span>
              </span>
              <span className="font-semibold text-slate-800">
                {channel.posts}
              </span>
            </div>
          );
        })}
        {!channels.length && (
          <span className="text-[10px] text-slate-400">
            No published posts in this period.
          </span>
        )}
      </div>
    </div>
  );
};

const PostsPanel = ({
  posts,
  onImport,
}: {
  posts: PublishedPostAnalytics[];
  onImport: (post: PublishedPostAnalytics) => void;
}) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
    <div className="border-b border-slate-100 px-5 py-4">
      <h2 className="text-sm font-bold text-slate-900">
        Published post metrics
      </h2>
      <p className="mt-0.5 text-[10px] text-slate-400">
        Destination-level metrics depend on each platform API.
      </p>
    </div>
    {!posts.length ? (
      <div className="py-12 text-center text-xs text-slate-400">
        No published posts in this period.
      </div>
    ) : (
      <div className="divide-y divide-slate-100">
        {posts.map((post) => (
          <div
            key={post.id}
            className="grid gap-4 px-5 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
          >
            <div className="min-w-0">
              <div className="truncate text-xs font-semibold text-slate-800">
                {stripCaption(post.content)}
              </div>
              <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                {post.integration && (
                  <img
                    src={platformIcon(post.integration.providerIdentifier)}
                    alt=""
                    className="h-3.5 w-3.5 object-contain"
                  />
                )}
                <span>{post.integration?.name || 'Unknown account'}</span>
                <span>·</span>
                <span>{dayjs(post.publishDate).format('D MMM YYYY')}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px]">
              <PostMetric
                label={post.reachLabel || 'Impressions'}
                value={post.impressions}
              />
              <PostMetric label="Likes" value={post.likes} />
              <PostMetric label="Comments" value={post.comments} />
              <PostMetric label="Shares" value={post.shares} />
              {post.canImportStats && (
                <button
                  type="button"
                  onClick={() => onImport(post)}
                  className="rounded-lg border border-blue-200 px-2.5 py-1.5 font-semibold text-blue-600 hover:bg-blue-50"
                >
                  {post.available ? 'Update stats' : 'Add stats'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const PostMetric = ({
  label,
  value,
}: {
  label: string;
  value: number | null;
}) => (
  <div>
    <div className="text-slate-400">{label}</div>
    <div className="mt-0.5 font-semibold text-slate-800">
      {formatMetric(value)}
    </div>
  </div>
);

export const AnalyticsDashboard = () => {
  const [period, setPeriod] = useState<AnalyticsPeriod>(30);
  const [channelId, setChannelId] = useState('all');
  const [showPosts, setShowPosts] = useState(false);
  const { data: integrations } = useIntegrationList();
  const { data, isLoading, error, mutate } = usePublishedPostsAnalytics(period);
  const modals = useModals();

  const posts = useMemo(() => data?.posts || [], [data?.posts]);
  const channels = useMemo(() => data?.channels || [], [data?.channels]);
  const visiblePosts = useMemo(
    () =>
      channelId === 'all'
        ? posts
        : posts.filter((post) => post.integration?.id === channelId),
    [channelId, posts]
  );
  const visibleChannels = useMemo(
    () =>
      channelId === 'all'
        ? channels
        : channels.filter((channel) => channel.id === channelId),
    [channelId, channels]
  );
  const totals = useMemo(
    () => ({
      impressions: sumAvailable(visiblePosts.map((post) => post.impressions)),
      engagements: sumAvailable(visiblePosts.map((post) => post.engagements)),
      likes: sumAvailable(visiblePosts.map((post) => post.likes)),
      comments: sumAvailable(visiblePosts.map((post) => post.comments)),
      shares: sumAvailable(visiblePosts.map((post) => post.shares)),
      published: visiblePosts.length,
    }),
    [visiblePosts]
  );
  const topPosts = useMemo(
    () =>
      [...visiblePosts]
        .filter((post) => post.engagements !== null)
        .sort((a, b) => (b.engagements || 0) - (a.engagements || 0))
        .slice(0, 5),
    [visiblePosts]
  );
  const sortedPosts = useMemo(
    () =>
      [...visiblePosts].sort((a, b) =>
        dayjs(b.publishDate).diff(dayjs(a.publishDate))
      ),
    [visiblePosts]
  );
  const availableMetrics = [
    totals.impressions,
    totals.likes,
    totals.comments,
    totals.shares,
  ].filter((value) => value !== null).length;
  const resultLimitReached = posts.length === 50;

  const openImportStats = useCallback(
    (post: PublishedPostAnalytics) => {
      modals.openModal({
        title: 'Add post stats',
        withCloseButton: true,
        children: <ImportStatsModal post={post} onSaved={() => mutate()} />,
      });
    },
    [modals, mutate]
  );

  return (
    <div className="min-h-full w-full px-5 py-7 font-sans md:px-7 xl:px-9">
      <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="mb-1 text-[11px] font-semibold text-slate-400">
            Analytics
          </p>
          <h1 className="text-[28px] font-bold leading-tight tracking-[-0.03em] text-slate-900">
            See what&apos;s working.
          </h1>
          <p className="mt-1.5 text-xs text-slate-500">
            Track performance across your social media channels and turn
            insights into growth.
          </p>
          {resultLimitReached && (
            <p className="mt-1 text-[10px] text-amber-600">
              Metrics currently cover the 50 most recent published posts in this
              period.
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={period}
            onChange={(event) =>
              setPeriod(Number(event.target.value) as AnalyticsPeriod)
            }
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700"
            aria-label="Analytics period"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <select
            value={channelId}
            onChange={(event) => setChannelId(event.target.value)}
            className="h-9 max-w-[220px] rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700"
            aria-label="Social channel"
          >
            <option value="all">All channels</option>
            {(integrations || []).map(
              (integration: {
                id: string;
                name: string;
                identifier: string;
              }) => (
                <option key={integration.id} value={integration.id}>
                  {integration.name} ·{' '}
                  {PLATFORM_LABELS[platformFamily(integration.identifier)] ||
                    platformFamily(integration.identifier)}
                </option>
              )
            )}
          </select>
          <button
            type="button"
            onClick={() => mutate()}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            aria-label="Refresh analytics"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v6h6M20 20v-6h-6M5.5 15a7 7 0 0012 2M18.5 9a7 7 0 00-12-2"
              />
            </svg>
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-12 text-center text-sm text-red-600">
          Could not load live analytics. Check your connected accounts and try
          again.
        </div>
      ) : isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-20 text-center text-sm text-slate-400">
          Loading analytics from connected accounts…
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Measured reach"
              value={formatMetric(totals.impressions)}
              caption="Impressions and views returned for loaded posts"
              tone="bg-blue-50 text-blue-600"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5-3M9 20H2v-2a3 3 0 015-3m10-4a3 3 0 110-6 3 3 0 010 6zM9 11a4 4 0 110-8 4 4 0 010 8z"
                />
              </svg>
            </MetricCard>
            <MetricCard
              title="Measured engagement"
              value={formatMetric(totals.engagements)}
              caption="Interactions returned for loaded posts"
              tone="bg-emerald-50 text-emerald-600"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 11l3 3 7-7M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </MetricCard>
            <MetricCard
              title="Connected accounts"
              value={String(
                channelId === 'all' ? integrations?.length || 0 : 1
              )}
              caption={`${visibleChannels.length} with published content`}
              tone="bg-violet-50 text-violet-600"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.8 10.2a4 4 0 00-5.6 0l-4 4a4 4 0 105.6 5.6l1.1-1.1m-.7-4.9a4 4 0 005.6 0l4-4a4 4 0 00-5.6-5.6l-1.1 1.1"
                />
              </svg>
            </MetricCard>
            <MetricCard
              title="Posts analysed"
              value={formatMetric(totals.published)}
              caption={`Recent posts from the last ${period} days`}
              tone="bg-orange-50 text-orange-600"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </MetricCard>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Publishing activity
                  </h2>
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    Cumulative published posts by date
                  </p>
                </div>
                <span className="text-[10px] text-slate-400">
                  Last {period} days
                </span>
              </div>
              <PerformanceTrend posts={visiblePosts} period={period} />
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-bold text-slate-900">
                Engagement by platform
              </h2>
              <p className="mt-0.5 text-[10px] text-slate-400">
                Total interactions in this period
              </p>
              <EngagementBars channels={visibleChannels} />
            </section>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(300px,0.9fr)_minmax(0,1.35fr)]">
            <div className="space-y-4">
              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Metrics overview
                    </h2>
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {availableMetrics} of 4 metrics available from platform
                      APIs
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  {[
                    ['Impressions', totals.impressions, 'text-blue-600'],
                    ['Likes', totals.likes, 'text-violet-600'],
                    ['Comments', totals.comments, 'text-emerald-600'],
                    ['Shares', totals.shares, 'text-orange-600'],
                  ].map(([label, value, color]) => (
                    <div
                      key={String(label)}
                      className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
                    >
                      <div className="text-[9px] text-slate-400">{label}</div>
                      <div className={clsx('mt-1 text-sm font-bold', color)}>
                        {formatMetric(value as number | null)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-sm font-bold text-slate-900">
                  Publishing by platform
                </h2>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  Share of published posts in this period
                </p>
                <PlatformMix channels={visibleChannels} />
              </section>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Top performing content
                  </h2>
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    Ranked by engagement in this period
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPosts((value) => !value)}
                  className="text-[10px] font-semibold text-blue-600 hover:text-blue-700"
                >
                  {showPosts ? 'Hide all posts' : 'View all posts →'}
                </button>
              </div>
              {!topPosts.length ? (
                <div className="flex min-h-[260px] items-center justify-center text-xs text-slate-400">
                  No published content in this period.
                </div>
              ) : (
                <div className="mt-3 divide-y divide-slate-100">
                  {topPosts.map((post) => (
                    <div key={post.id} className="flex items-center gap-3 py-3">
                      {post.image ? (
                        <img
                          src={post.image}
                          alt=""
                          className="h-11 w-11 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-violet-100 text-blue-600">
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4-4a2 2 0 013 0l2 2 2-2a2 2 0 013 0l2 2M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[11px] font-semibold text-slate-800">
                          {stripCaption(post.content)}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-[9px] text-slate-400">
                          {post.integration && (
                            <img
                              src={platformIcon(
                                post.integration.providerIdentifier
                              )}
                              alt=""
                              className="h-3 w-3 object-contain"
                            />
                          )}
                          <span>
                            {dayjs(post.publishDate).format('D MMM YYYY')}
                          </span>
                          <span>·</span>
                          <span>
                            {post.integration?.name || 'Social account'}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-xs font-bold text-slate-800">
                          {formatMetric(post.engagements)}
                        </div>
                        <div className="text-[9px] text-slate-400">
                          engagements
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {showPosts && (
            <PostsPanel posts={sortedPosts} onImport={openImportStats} />
          )}
        </div>
      )}
    </div>
  );
};
