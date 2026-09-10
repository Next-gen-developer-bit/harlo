'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useIntegrationList } from '@gitroom/frontend/components/launches/helpers/use.integration.list';
import { usePublishedPostsAnalytics, formatMetric, PublishedPostAnalytics, AnalyticsPeriod } from '@gitroom/frontend/components/platform-analytics/use.published.posts.analytics';
import { ImportStatsModal } from '@gitroom/frontend/components/platform-analytics/import.stats.modal';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import dayjs from 'dayjs';
import clsx from 'clsx';

const stripCaption = (content?: string) =>
  (content || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim() || 'Published post';

export const PlatformAnalytics = () => {
  const { data: integrations } = useIntegrationList();

  const [activeTab, setActiveTab] = useState<'overview' | 'posts'>('overview');
  const [period, setPeriod] = useState<AnalyticsPeriod>(30);
  const [sortBy, setSortBy] = useState<'date' | 'impressions' | 'engagements'>(
    'date'
  );

  const { data, isLoading, error, mutate } = usePublishedPostsAnalytics(period);
  const posts = data?.posts || [];
  const totals = data?.totals;
  const channelStats = data?.channels || [];
  const connectedChannels = integrations?.length || 0;
  const modals = useModals();

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      if (sortBy === 'impressions') {
        return (b.impressions || 0) - (a.impressions || 0);
      }
      if (sortBy === 'engagements') {
        return (b.engagements || 0) - (a.engagements || 0);
      }
      return dayjs(b.publishDate).diff(dayjs(a.publishDate));
    });
  }, [posts, sortBy]);

  const topPost = useMemo(() => {
    return [...posts].sort(
      (a, b) => (b.engagements || 0) - (a.engagements || 0)
    )[0];
  }, [posts]);

  const overviewReachLabel = useMemo(() => {
    const labels = [
      ...new Set(posts.map((post) => post.reachLabel || 'Impressions')),
    ];
    return labels.length === 1 ? labels[0] : 'Views & impressions';
  }, [posts]);

  const unavailableHints = useMemo(
    () => [
      ...new Set(
        posts
          .map((post) => post.unavailableHint)
          .filter((hint): hint is string => Boolean(hint))
      ),
    ],
    [posts]
  );

  const importHints = useMemo(
    () => [
      ...new Set(
        posts
          .filter((post) => post.canImportStats)
          .map((post) => post.importHint)
          .filter((hint): hint is string => Boolean(hint))
      ),
    ],
    [posts]
  );

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
    <div className="w-full max-w-6xl mx-auto p-8 pt-10 font-sans min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track engagement, channel growth, and top-performing content
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-gray-100 p-1 rounded-xl flex items-center">
            <button
              onClick={() => setActiveTab('overview')}
              className={clsx(
                'px-4 py-2 text-xs font-semibold rounded-lg transition-colors',
                activeTab === 'overview'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              )}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={clsx(
                'px-4 py-2 text-xs font-semibold rounded-lg transition-colors',
                activeTab === 'posts'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              )}
            >
              Posts ({posts.length})
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-1 flex items-center shadow-sm">
            {([7, 30, 90] as AnalyticsPeriod[]).map((days) => (
              <button
                key={days}
                onClick={() => setPeriod(days)}
                className={clsx(
                  'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                  period === days
                    ? 'bg-gray-100 text-gray-900 font-semibold'
                    : 'text-gray-500'
                )}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-400 mb-6 flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        <span>
          Last updated: {dayjs().format('h:mm A')} • Metrics are pulled live
          from each connected account.
        </span>
        <button
          type="button"
          onClick={() => mutate()}
          className="text-xs font-semibold text-sky-600 hover:text-sky-700"
        >
          Refresh
        </button>
      </div>

      {error ? (
        <div className="text-sm text-red-500 py-16 text-center">
          Could not load live analytics. Check that accounts are connected, then
          refresh.
        </div>
      ) : isLoading ? (
        <div className="text-sm text-gray-400 py-16 text-center">
          Loading analytics from connected accounts…
        </div>
      ) : activeTab === 'overview' ? (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total {overviewReachLabel}
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-2">
                {formatMetric(totals?.impressions)}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                {totals?.impressions === null
                  ? 'This metric is not returned by some platform APIs'
                  : 'Across all connected channels'}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Engagements
              </div>
              <div className="text-2xl font-bold text-sky-600 mt-2">
                {formatMetric(totals?.engagements)}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Likes, comments & shares
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Published
              </div>
              <div className="text-2xl font-bold text-green-600 mt-2">
                {totals?.published || 0}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Posts sent</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Connected Accounts
              </div>
              <div className="text-2xl font-bold text-purple-600 mt-2">
                {connectedChannels} Channels
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                {channelStats.length} with published posts
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white text-sky-600 rounded-xl shadow-sm border border-sky-100 shrink-0">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Plain-Language Insight
                </h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {topPost && (topPost.engagements || 0) > 0
                    ? `Your top post this period earned ${formatMetric(
                        topPost.engagements
                      )} engagements on ${
                        topPost.integration?.name || 'a connected account'
                      }.`
                    : 'Published posts will show impressions and engagement once each platform returns stats.'}
                </p>
                {unavailableHints.length ? (
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    {unavailableHints.join(' ')}
                  </p>
                ) : null}
                {importHints.length ? (
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    {importHints.join(' ')} Use Add stats on a post to save the
                    numbers from the platform.
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              Channel Performance
            </h2>
            {channelStats.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs">
                No published posts in the last {period} days. Switch to 30 or 90
                days to see older posts.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {channelStats.map((channel) => (
                  <div
                    key={channel.id}
                    className="bg-gray-50 p-4 rounded-xl border border-gray-100"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {channel.picture ? (
                        <img
                          src={channel.picture}
                          alt=""
                          className="w-6 h-6 rounded-full"
                        />
                      ) : null}
                      <div className="text-xs font-semibold text-gray-700 truncate">
                        {channel.name}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {channel.engagements === null
                        ? 'Not available'
                        : `${formatMetric(channel.engagements)} engagements`}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {channel.impressions === null
                        ? `${channel.reachLabel || 'Impressions'} not available`
                        : `${formatMetric(channel.impressions)} ${(
                            channel.reachLabel || 'impressions'
                          ).toLowerCase()}`}{' '}
                      · {channel.posts} posts
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">
              Published Posts Metrics
            </h2>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as 'date' | 'impressions' | 'engagements'
                  )
                }
                className="border border-gray-200 rounded-lg text-xs p-1.5 bg-gray-50 text-gray-700 font-medium"
              >
                <option value="date">Publish Date</option>
                <option value="impressions">{overviewReachLabel}</option>
                <option value="engagements">Engagements</option>
              </select>
            </div>
          </div>

          {sortedPosts.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">
              No published posts in the last {period} days. Switch to 30 or 90
              days to see older posts.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {sortedPosts.map((post) => (
                <div
                  key={post.id}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {stripCaption(post.content)}
                    </p>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                      {post.integration?.picture ? (
                        <img
                          src={post.integration.picture}
                          alt=""
                          className="w-4 h-4 rounded-full"
                        />
                      ) : null}
                      <span>{post.integration?.name || 'Unknown account'}</span>
                      <span>·</span>
                      <span>
                        Published{' '}
                        {dayjs(post.publishDate).format(
                          'MMM D, YYYY [at] h:mm A'
                        )}
                      </span>
                      {post.releaseURL ? (
                        <>
                          <span>·</span>
                          <a
                            href={post.releaseURL}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-600 hover:text-sky-700"
                          >
                            Open
                          </a>
                        </>
                      ) : null}
                      {post.canImportStats ? (
                        <>
                          <span>·</span>
                          <button
                            type="button"
                            onClick={() => openImportStats(post)}
                            className="text-sky-600 hover:text-sky-700"
                          >
                            {post.available ? 'Update stats' : 'Add stats'}
                          </button>
                        </>
                      ) : null}
                      {!post.available && !post.canImportStats ? (
                        <>
                          <span>·</span>
                          <span>
                            {post.unavailableHint ||
                              'Metrics unavailable for this platform'}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs text-gray-600">
                    <div>
                      <div className="text-[11px] text-gray-400">
                        {post.reachLabel || 'Impressions'}
                      </div>
                      <div className="font-semibold text-gray-900">
                        {formatMetric(post.impressions)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-gray-400">Likes</div>
                      <div className="font-semibold text-gray-900">
                        {formatMetric(post.likes)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-gray-400">Comments</div>
                      <div className="font-semibold text-gray-900">
                        {formatMetric(post.comments)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-gray-400">Shares</div>
                      <div className="font-semibold text-gray-900">
                        {formatMetric(post.shares)}
                      </div>
                    </div>
                    {post.canImportStats ? (
                      <button
                        type="button"
                        onClick={() => openImportStats(post)}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sky-600 font-semibold hover:bg-sky-50"
                      >
                        {post.impressions === null ? 'Add stats' : 'Update stats'}
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100 text-[11px] text-gray-400 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-400 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Destination-level metrics depend on platform API support. Some
            metrics may require 24-48 hours to populate after initial publish.
            {unavailableHints.length
              ? ` ${unavailableHints.join(' ')}`
              : ''}
          </div>
        </div>
      )}
    </div>
  );
};
