'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { ChartSocial } from '@gitroom/frontend/components/analytics/chart-social';
import {
  PLATFORM_LABELS,
  platformFamily,
} from '@gitroom/frontend/components/launches/helpers/mvp.platforms';
import {
  formatMetric,
  PublishedPostAnalytics,
  useGroupPostInsights,
  usePublishedPostsAnalytics,
} from '@gitroom/frontend/components/platform-analytics/use.published.posts.analytics';
import {
  PostAnalyticsSeries,
  usePostSeries,
  useShortLinkStats,
} from '@gitroom/frontend/components/platform-analytics/use.post.analytics';
import { resolveMediaUrl } from '@gitroom/helpers/utils/has.extension';

const PERIODS = [
  { value: 7, label: 'Last 7 days' },
  { value: 30, label: 'Last 30 days' },
  { value: 90, label: 'Last 90 days' },
];

const stripCaption = (content?: string) =>
  (content || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const platformSrc = (identifier?: string) =>
  identifier === 'youtube'
    ? '/icons/platforms/youtube.svg'
    : `/icons/platforms/${identifier || 'x'}.png`;

const findSeries = (
  series: PostAnalyticsSeries[] | undefined,
  labels: string[]
) => {
  if (!Array.isArray(series)) {
    return null;
  }
  for (const label of labels) {
    const match = series.find(
      (item) => item.label.toLowerCase() === label.toLowerCase()
    );
    if (match) {
      return match;
    }
  }
  return null;
};

const seriesTotal = (row: PostAnalyticsSeries | null) => {
  if (!row?.data?.length) {
    return null;
  }
  return row.data.reduce((acc, point) => acc + Number(point.total || 0), 0);
};

const rateFor = (views: number | null, engagements: number | null) => {
  if (views == null || views <= 0 || engagements == null) {
    return null;
  }
  return (engagements / views) * 100;
};

const MetricCard = ({
  label,
  value,
}: {
  label: string;
  value: number | null;
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
    <div className="text-[13px] font-medium text-slate-500">{label}</div>
    <div className="mt-2 text-[28px] font-semibold tracking-tight text-slate-900">
      {value == null ? 'Not available' : formatMetric(value)}
    </div>
  </div>
);

const BreakdownItem = ({
  label,
  value,
}: {
  label: string;
  value: number | null;
}) => (
  <div>
    <div className="text-[12px] text-slate-400">{label}</div>
    <div className="mt-1 text-[22px] font-semibold text-slate-900">
      {value == null ? 'Not available' : formatMetric(value)}
    </div>
  </div>
);

export const PostInsightsPage = ({ postId }: { postId: string }) => {
  const [period, setPeriod] = useState<7 | 30 | 90>(7);
  const [selectedId, setSelectedId] = useState(postId);
  const [graphLabel, setGraphLabel] = useState('');
  const { data: group, isLoading: groupLoading, error: groupError } =
    useGroupPostInsights(postId, period);
  const channels = group?.posts || [];
  const selected =
    channels.find((item) => item.id === selectedId) || channels[0] || null;
  const activeId = selected?.id || postId;
  const { data: seriesData, isLoading: seriesLoading } = usePostSeries(
    activeId,
    period
  );
  const { data: linkStats } = useShortLinkStats(activeId);
  const { data: published } = usePublishedPostsAnalytics(period);

  const series = Array.isArray(seriesData) ? seriesData : [];
  const viewsSeries =
    findSeries(series, ['Views']) ||
    findSeries(series, ['Impressions', 'Unique Impressions']) ||
    findSeries(series, ['Reach']);
  const likes = seriesTotal(findSeries(series, ['Likes', 'Reactions'])) ??
    selected?.likes ??
    null;
  const comments =
    seriesTotal(findSeries(series, ['Comments', 'Replies'])) ??
    selected?.comments ??
    null;
  const shares =
    seriesTotal(findSeries(series, ['Shares', 'Reposts', 'Retweets', 'Quotes'])) ??
    selected?.shares ??
    null;
  const saves = seriesTotal(findSeries(series, ['Saves', 'Saved']));
  const views =
    seriesTotal(viewsSeries) ??
    (selected?.impressions != null ? selected.impressions : null);
  const viewsLabel = viewsSeries?.label || selected?.reachLabel || 'Views';
  const engagementParts = [likes, comments, shares, saves].filter(
    (value): value is number => value != null
  );
  const engagements =
    engagementParts.length > 0
      ? engagementParts.reduce((acc, value) => acc + value, 0)
      : null;
  const platformClicks = seriesTotal(
    findSeries(series, [
      'Outbound Clicks',
      'Link Clicks',
      'Website Clicks',
      'Pin Clicks',
      'Clicks',
    ])
  );
  const shortLinkClicks = (linkStats?.clicks || []).reduce(
    (acc, item) => acc + Number(item.clicks || 0),
    0
  );
  const linkClicks =
    platformClicks != null
      ? platformClicks
      : linkStats?.clicks?.length
      ? shortLinkClicks
      : null;
  const engagementRate = rateFor(views, engagements);
  const averageRate = useMemo(() => {
    const others = (published?.posts || []).filter(
      (item) =>
        item.id !== activeId &&
        item.impressions != null &&
        item.impressions > 0 &&
        item.engagements != null
    );
    if (others.length < 2) {
      return null;
    }
    return (
      others.reduce(
        (acc, item) => acc + (item.engagements! / item.impressions!) * 100,
        0
      ) / others.length
    );
  }, [activeId, published?.posts]);
  const graphSeries = useMemo(
    () =>
      series.filter((item) => (item.data || []).filter((point) => point.date).length > 1),
    [series]
  );
  const activeGraph =
    graphSeries.find((item) => item.label === graphLabel) || graphSeries[0] || null;
  const graphPoints =
    activeGraph?.data.map((point) => ({
      date: dayjs(point.date).isValid()
        ? dayjs(point.date).format('MMM D')
        : point.date,
      total: Number(point.total || 0),
    })) || [];
  const caption = stripCaption(selected?.content);
  const thumb = resolveMediaUrl(selected?.image);
  const publishedAt = selected?.publishDate
    ? dayjs(selected.publishDate).format('MMM D, YYYY, h:mm A')
    : '';
  const comparison =
    engagementRate != null && averageRate != null
      ? engagementRate - averageRate
      : null;

  const exportReport = () => {
    const rows = [
      ['Channel', selected?.integration?.name || ''],
      ['Platform', platformName(selected)],
      ['Published', publishedAt],
      [viewsLabel, views == null ? 'Not available' : String(views)],
      [
        'Engagement rate',
        engagementRate == null ? 'Not available' : `${engagementRate.toFixed(1)}%`,
      ],
      ['Total engagements', engagements == null ? 'Not available' : String(engagements)],
      ['Link clicks', linkClicks == null ? 'Not available' : String(linkClicks)],
      ['Likes', likes == null ? 'Not available' : String(likes)],
      ['Comments', comments == null ? 'Not available' : String(comments)],
      ['Shares', shares == null ? 'Not available' : String(shares)],
      ['Saves', saves == null ? 'Not available' : String(saves)],
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'post-insights.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full bg-[#f7f8fa] px-5 py-6 font-sans text-slate-800 md:px-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/analytics"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500"
            aria-label="Back to analytics"
          >
            ‹
          </Link>
          <div>
            <div className="text-[12px] text-slate-400">Analytics › Post Insights</div>
            <h1 className="text-[28px] font-semibold tracking-tight text-slate-900">
              Post Insights
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(event) =>
              setPeriod(Number(event.target.value) as 7 | 30 | 90)
            }
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700"
            aria-label="Date range"
          >
            {PERIODS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={exportReport}
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700"
          >
            Export Report
          </button>
        </div>
      </div>

      {groupLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center text-sm text-slate-400">
          Loading this post…
        </div>
      ) : groupError || !selected ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center text-sm text-slate-500">
          This post could not be loaded.
        </div>
      ) : (
        <div className="space-y-4">
          <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.9fr)]">
            <div className="flex gap-4">
              <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                {thumb ? (
                  <img src={thumb} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="min-w-0">
                <p className="line-clamp-3 text-sm font-medium text-slate-800">
                  {caption || 'Untitled post'}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  {selected.integration?.providerIdentifier ? (
                    <img
                      src={platformSrc(selected.integration.providerIdentifier)}
                      alt=""
                      className="h-4 w-4 rounded-[3px] object-cover"
                    />
                  ) : null}
                  <span>{selected.integration?.name || 'Account'}</span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-600">
                    {selected.state === 'PUBLISHED' ? 'Published' : selected.state}
                  </span>
                </div>
                {publishedAt ? (
                  <div className="mt-1 text-xs text-slate-400">
                    Published: {publishedAt}
                  </div>
                ) : null}
                {selected.releaseURL ? (
                  <a
                    href={selected.releaseURL}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex h-8 items-center rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600"
                  >
                    View Original Post
                  </a>
                ) : null}
              </div>
            </div>
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-800">
                View insights by platform
              </div>
              <div className="flex flex-wrap gap-2">
                {channels.map((channel) => (
                  <PlatformButton
                    key={channel.id}
                    channel={channel}
                    active={channel.id === activeId}
                    onClick={() => {
                      setSelectedId(channel.id);
                      setGraphLabel('');
                    }}
                  />
                ))}
              </div>
              {selected.unavailableHint ? (
                <p className="mt-3 text-xs text-slate-500">{selected.unavailableHint}</p>
              ) : null}
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label={viewsLabel} value={views} />
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
              <div className="text-[13px] font-medium text-slate-500">
                Engagement Rate
              </div>
              <div className="mt-2 text-[28px] font-semibold tracking-tight text-slate-900">
                {engagementRate == null ? 'Not available' : `${engagementRate.toFixed(1)}%`}
              </div>
            </div>
            <MetricCard label="Total Engagements" value={engagements} />
            <MetricCard label="Link Clicks" value={linkClicks} />
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-slate-900">
                  Compared to your usual posts
                </h2>
                {comparison != null && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      comparison >= 0
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {comparison >= 0 ? 'Above average' : 'Below average'}
                  </span>
                )}
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <div>
                  Your average engagement rate:{' '}
                  <span className="font-semibold text-slate-900">
                    {averageRate == null ? 'Not available' : `${averageRate.toFixed(1)}%`}
                  </span>
                </div>
                <div>
                  This post:{' '}
                  <span className="font-semibold text-slate-900">
                    {engagementRate == null
                      ? 'Not available'
                      : `${engagementRate.toFixed(1)}%${
                          comparison != null && averageRate
                            ? ` (${comparison >= 0 ? '+' : ''}${Math.round(
                                (comparison / averageRate) * 100
                              )}%)`
                            : ''
                        }`}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {comparison == null
                    ? 'A comparison needs this post’s views and engagements, plus at least two other posts with both numbers.'
                    : comparison >= 0
                    ? 'This post earned a higher engagement rate than your recent average.'
                    : 'This post earned a lower engagement rate than your recent average.'}
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="mb-4 text-sm font-semibold text-slate-900">
                Engagement Breakdown
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <BreakdownItem label="Likes" value={likes} />
                <BreakdownItem label="Comments" value={comments} />
                <BreakdownItem label="Shares" value={shares} />
                <BreakdownItem label="Saves" value={saves} />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Performance Over Time
                </h2>
                <p className="text-xs text-slate-400">
                  {activeGraph
                    ? `${activeGraph.label} over the last ${period} days`
                    : 'Daily series from the platform'}
                </p>
              </div>
              {graphSeries.length > 0 && (
                <select
                  value={activeGraph?.label || ''}
                  onChange={(event) => setGraphLabel(event.target.value)}
                  className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700"
                  aria-label="Chart metric"
                >
                  {graphSeries.map((item) => (
                    <option key={item.label} value={item.label}>
                      {item.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {seriesLoading ? (
              <div className="py-16 text-center text-sm text-slate-400">
                Loading the chart…
              </div>
            ) : graphPoints.length > 1 ? (
              <div className="h-[260px]">
                <ChartSocial data={graphPoints} color="blue" />
              </div>
            ) : (
              <div className="py-16 text-center text-sm text-slate-400">
                Not available. This platform returned a total, not a daily series.
              </div>
            )}
          </section>

          <p className="text-xs text-slate-400">
            Metrics shown depend on platform API support. Some metrics may be
            unavailable for certain platforms or post types.
          </p>
        </div>
      )}
    </div>
  );
};

const platformName = (channel: PublishedPostAnalytics | null) => {
  const family = platformFamily(channel?.integration?.providerIdentifier);
  return PLATFORM_LABELS[family] || family || 'Channel';
};

const PlatformButton = ({
  channel,
  active,
  onClick,
}: {
  channel: PublishedPostAnalytics;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex h-9 items-center gap-2 rounded-full px-3 text-xs font-semibold ${
      active
        ? 'bg-[#2563eb] text-white'
        : 'border border-slate-200 bg-white text-slate-600'
    }`}
  >
    {channel.integration?.providerIdentifier ? (
      <img
        src={platformSrc(channel.integration.providerIdentifier)}
        alt=""
        className="h-4 w-4 rounded-[3px] object-cover"
      />
    ) : null}
    {platformName(channel)}
  </button>
);
