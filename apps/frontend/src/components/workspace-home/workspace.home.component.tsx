'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@gitroom/frontend/components/layout/user.context';
import { Onboarding } from '@gitroom/frontend/components/onboarding/onboarding';
import {
  formatMetric,
  usePublishedPostsAnalytics,
} from '@gitroom/frontend/components/platform-analytics/use.published.posts.analytics';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { CreatePostModal } from '@gitroom/frontend/components/new-launch/create.post.modal';
import { useWorkspaceOverview } from '@gitroom/frontend/components/workspace-home/use.workspace.overview';
import { useWeekPosts } from '@gitroom/frontend/components/workspace-home/use.week.posts';
import { useIntegrationList } from '@gitroom/frontend/components/launches/helpers/use.integration.list';
import {
  MVP_PLATFORM_FAMILIES,
  isMvpPlatform,
} from '@gitroom/frontend/components/launches/helpers/mvp.platforms';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import clsx from 'clsx';
import { readablePostError } from '@gitroom/helpers/utils/publish.error';

dayjs.extend(isoWeek);

const TIME_SLOTS = [9, 12, 15, 18, 21];
const PLATFORM_FAMILIES = Object.keys(MVP_PLATFORM_FAMILIES);

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
    return first?.path || first?.url || null;
  } catch {
    return image.startsWith('http') || image.startsWith('/') ? image : null;
  }
};

const platformFamily = (identifier?: string) => {
  if (!identifier) {
    return '';
  }
  return (
    PLATFORM_FAMILIES.find((family) =>
      MVP_PLATFORM_FAMILIES[family].includes(identifier)
    ) || identifier.split('-')[0]
  );
};

const slotForHour = (hour: number) =>
  TIME_SLOTS.reduce((best, slot) =>
    Math.abs(slot - hour) < Math.abs(best - hour) ? slot : best
  );

const Sparkline = ({ values }: { values: number[] }) => {
  const width = 88;
  const height = 28;
  const max = Math.max(...values, 1);
  const points = values
    .map((value, index) => {
      const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width;
      const y = height - (value / max) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <polyline
        fill="none"
        stroke="#2563eb"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
};

const StatusBadge = ({ state }: { state?: string }) => {
  if (state === 'ERROR') {
    return (
      <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
        Failed
      </span>
    );
  }
  if (state === 'PUBLISHED') {
    return (
      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
        Posted
      </span>
    );
  }
  return (
    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
      Scheduled
    </span>
  );
};

export const WorkspaceHomeComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modals = useModals();
  const { data: overview, isLoading } = useWorkspaceOverview();
  const { data: integrations } = useIntegrationList();
  const user = useUser();
  const { data: analytics } = usePublishedPostsAnalytics(30);
  const openedCreate = useRef(false);
  const [weekStart, setWeekStart] = useState(() =>
    dayjs().startOf('isoWeek').format('YYYY-MM-DD')
  );
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('all');

  const weekEnd = dayjs(weekStart).endOf('isoWeek').format('YYYY-MM-DD');
  const { data: weekData } = useWeekPosts(weekStart, weekEnd);
  const weekPosts = weekData?.posts || overview?.weekPosts || [];

  const openCreatePost = useCallback(() => {
    modals.openModal({
      id: 'create-post-modal',
      closeOnClickOutside: true,
      withCloseButton: false,
      classNames: {
        modal:
          'w-[95%] max-w-[1000px] text-textColor p-0 bg-transparent shadow-none',
      },
      children: <CreatePostModal />,
    });
  }, [modals]);

  useEffect(() => {
    if (openedCreate.current || searchParams.get('create') !== '1') {
      return;
    }
    openedCreate.current = true;
    openCreatePost();
    router.replace('/overview');
  }, [openCreatePost, router, searchParams]);

  const mvpAccounts = useMemo(
    () =>
      (integrations || []).filter((item: { identifier?: string }) =>
        isMvpPlatform(item.identifier)
      ),
    [integrations]
  );

  const disconnected = useMemo(
    () =>
      mvpAccounts.filter(
        (item: { refreshNeeded?: boolean; disabled?: boolean }) =>
          item.refreshNeeded || item.disabled
      ),
    [mvpAccounts]
  );

  const matchesPlatform = useCallback(
    (identifier?: string) =>
      platform === 'all' || platformFamily(identifier) === platform,
    [platform]
  );

  const filteredWeekPosts = useMemo(
    () =>
      weekPosts.filter((post: { integration?: { providerIdentifier?: string } }) =>
        matchesPlatform(post.integration?.providerIdentifier)
      ),
    [weekPosts, matchesPlatform]
  );

  const upcoming = useMemo(
    () =>
      (overview?.upcoming || []).filter((post) => {
        const caption = stripCaption(post.content).toLowerCase();
        const matchesSearch = !search || caption.includes(search.toLowerCase());
        return matchesSearch && matchesPlatform(post.integration?.providerIdentifier);
      }),
    [overview?.upcoming, search, matchesPlatform]
  );

  const drafts = overview?.drafts || 0;
  const scheduled = overview?.scheduled || 0;
  const posted = overview?.posted || 0;
  const failed = overview?.failed || 0;
  const totalPosts = drafts + scheduled + posted;
  const publishRate =
    posted + failed > 0 ? Math.round((posted / (posted + failed)) * 1000) / 10 : null;
  const dailyPosted = overview?.dailyPosted || [];
  const sparkValues = dailyPosted.map((day) => day.count);

  const days = [...Array(7)].map((_, index) => dayjs(weekStart).add(index, 'day'));

  const postsForCell = (day: dayjs.Dayjs, slot: number) =>
    filteredWeekPosts.filter((post: { publishDate: string }) => {
      const date = dayjs(post.publishDate);
      return date.isSame(day, 'day') && slotForHour(date.hour()) === slot;
    });

  const attentionItems = [
    ...(overview?.failedPosts || []).map((post) => ({
      id: post.id,
      title: 'Failed post',
      detail: `${post.integration?.name || 'Account'}: ${readablePostError(
        post.error
      )}`,
      href: '/launches?state=failed',
    })),
    ...disconnected.map((account: { id: string; name: string }) => ({
      id: account.id,
      title: 'Reconnect required',
      detail: `${account.name} needs to be reconnected`,
      href: '/third-party',
    })),
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 py-6 md:px-8 md:py-7 font-sans text-slate-800">
      <Onboarding />
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight">
          Overview
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 xl:w-[360px]">
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
              />
            </svg>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search posts, drafts, or accounts"
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300"
            />
          </div>
          <select
            value={platform}
            onChange={(event) => setPlatform(event.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700"
          >
            <option value="all">All Platforms</option>
            {PLATFORM_FAMILIES.map((family) => (
              <option key={family} value={family}>
                {family[0].toUpperCase() + family.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={openCreatePost}
            className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"
            aria-label="Create post"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {attentionItems.length > 0 && (
        <div className="bg-white rounded-2xl border border-red-100 p-4 shadow-sm mb-6">
          <h2 className="text-sm font-bold text-slate-900 mb-2">Attention Required</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {attentionItems.slice(0, 4).map((item) => (
              <button
                key={item.id}
                onClick={() => router.push(item.href)}
                className="flex items-start justify-between gap-3 p-3 rounded-xl bg-red-50/70 hover:bg-red-50 text-left min-w-0 overflow-hidden"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900">{item.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 break-words">
                    {item.detail}
                  </div>
                </div>
                <span className="text-slate-400 text-xs">›</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'Total Posts',
            value: isLoading ? '—' : String(totalPosts),
            note: `${drafts} drafts`,
            href: '/launches?state=all',
            values: sparkValues,
          },
          {
            label: 'Scheduled',
            value: isLoading ? '—' : String(scheduled),
            note: 'Waiting to publish',
            href: '/launches?state=scheduled',
            values: sparkValues,
          },
          {
            label: 'Publish Rate',
            value: isLoading || publishRate === null ? '—' : `${publishRate}%`,
            note: publishRate === null ? 'No published posts yet' : `${posted} posted`,
            href: '/launches?state=published',
            values: sparkValues,
          },
          {
            label: 'Connected Accounts',
            value: String(mvpAccounts.length),
            note: `${disconnected.length} need attention`,
            href: '/third-party',
            values: sparkValues,
          },
        ].map((card) => (
          <button
            key={card.label}
            onClick={() => router.push(card.href)}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm text-left hover:border-blue-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-slate-400">{card.label}</div>
                <div className="text-[28px] leading-none font-black text-slate-900 mt-2">
                  {card.value}
                </div>
                <div className="text-[11px] text-slate-400 mt-2">{card.note}</div>
              </div>
              <Sparkline values={card.values.length ? card.values : [0, 0, 0, 0, 0, 0, 0]} />
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => router.push('/analytics')}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm text-left hover:border-blue-200"
          >
            <div className="text-xs font-semibold text-slate-400">
              Views & impressions (7 days)
            </div>
            <div className="text-[28px] leading-none font-black text-slate-900 mt-2">
              {formatMetric(analytics?.totals?.impressions)}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              {analytics?.totals?.impressions === null
                ? 'Not returned by every platform API'
                : `${analytics?.totals?.published || 0} published posts`}
            </div>
          </button>
          <button
            onClick={() => router.push('/analytics')}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm text-left hover:border-blue-200"
          >
            <div className="text-xs font-semibold text-slate-400">
              Engagement (7 days)
            </div>
            <div className="text-[28px] leading-none font-black text-slate-900 mt-2">
              {formatMetric(analytics?.totals?.engagements)}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              Likes, comments and shares where available
            </div>
          </button>
          <button
            onClick={() => router.push('/analytics')}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm text-left hover:border-blue-200"
          >
            <div className="text-xs font-semibold text-slate-400">Top post</div>
            <div className="text-sm font-bold text-slate-900 mt-2 line-clamp-2">
              {analytics?.posts?.length
                ? stripCaption(
                    [...analytics.posts].sort(
                      (a, b) => (b.engagements || 0) - (a.engagements || 0)
                    )[0]?.content
                  )
                : 'Publish to see performance'}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              {analytics?.posts?.length
                ? formatMetric(
                    [...analytics.posts].sort(
                      (a, b) => (b.engagements || 0) - (a.engagements || 0)
                    )[0]?.engagements
                  ) + ' engagements'
                : 'No published posts yet'}
            </div>
          </button>
        </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_360px] gap-5 mb-5">
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Publishing Calendar</h2>
              <div className="text-xs text-slate-400 mt-0.5">
                {dayjs(weekStart).format('MMM D')} – {dayjs(weekEnd).format('MMM D, YYYY')}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWeekStart(dayjs().startOf('isoWeek').format('YYYY-MM-DD'))}
                className="h-8 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Today
              </button>
              <button
                onClick={() =>
                  setWeekStart(dayjs(weekStart).subtract(1, 'week').format('YYYY-MM-DD'))
                }
                className="h-8 w-8 rounded-lg border border-slate-200 text-slate-500"
              >
                ‹
              </button>
              <button
                onClick={() =>
                  setWeekStart(dayjs(weekStart).add(1, 'week').format('YYYY-MM-DD'))
                }
                className="h-8 w-8 rounded-lg border border-slate-200 text-slate-500"
              >
                ›
              </button>
              <button
                onClick={() => router.push('/launches?display=month')}
                className="h-8 px-3 rounded-lg bg-slate-50 text-xs font-semibold text-slate-600"
              >
                Week
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-[56px_repeat(7,minmax(0,1fr))] gap-2 mb-2">
                <div />
                {days.map((day) => (
                  <div key={day.format('YYYY-MM-DD')} className="text-center">
                    <div className="text-[11px] font-semibold text-slate-400">
                      {day.format('ddd')}
                    </div>
                    <div
                      className={clsx(
                        'text-sm font-bold mt-0.5',
                        day.isSame(dayjs(), 'day') ? 'text-blue-600' : 'text-slate-900'
                      )}
                    >
                      {day.format('D')}
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {TIME_SLOTS.map((slot) => (
                  <div
                    key={slot}
                    className="grid grid-cols-[56px_repeat(7,minmax(0,1fr))] gap-2"
                  >
                    <div className="text-[11px] text-slate-400 pt-2">
                      {dayjs().hour(slot).minute(0).format('h A')}
                    </div>
                    {days.map((day) => {
                      const posts = postsForCell(day, slot);
                      return (
                        <button
                          key={`${day.format('YYYY-MM-DD')}-${slot}`}
                          onClick={() =>
                            posts[0]
                              ? router.push('/launches?display=month')
                              : openCreatePost()
                          }
                          className="min-h-[72px] rounded-xl border border-slate-100 bg-slate-50/60 p-1.5 text-left hover:border-blue-200"
                        >
                          {posts.slice(0, 2).map((post: any) => (
                            <div
                              key={post.id}
                              className="flex items-center gap-1.5 bg-white border border-slate-100 rounded-lg p-1 mb-1 last:mb-0"
                            >
                              <img
                                src={`/icons/platforms/${post.integration?.providerIdentifier || post.integration?.identifier}.png`}
                                alt=""
                                className="w-4 h-4 rounded"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="text-[10px] font-bold text-slate-800 truncate">
                                  {stripCaption(post.content)}
                                </div>
                                <div className="text-[9px] text-slate-400">
                                  {dayjs(post.publishDate).format('h:mm A')}
                                </div>
                              </div>
                            </div>
                          ))}
                          {posts.length > 2 && (
                            <div className="text-[10px] text-slate-400 px-1">
                              +{posts.length - 2} more
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Upcoming Posts</h2>
            <button
              onClick={() => router.push('/launches?state=scheduled')}
              className="text-xs font-semibold text-blue-600"
            >
              View all
            </button>
          </div>
          {upcoming.length ? (
            <div className="space-y-3">
              {upcoming.map((post) => (
                <button
                  key={post.id}
                  onClick={() => router.push('/launches?state=scheduled')}
                  className="w-full flex items-center gap-3 text-left"
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    {postThumb(post.image) ? (
                      <img
                        src={postThumb(post.image) || ''}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 text-lg">
                        ▭
                      </div>
                    )}
                    {post.integration?.providerIdentifier && (
                      <img
                        src={`/icons/platforms/${post.integration.providerIdentifier}.png`}
                        alt=""
                        className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded border border-white"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-slate-900 truncate">
                      {stripCaption(post.content)}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {dayjs(post.publishDate).format('ddd, MMM D • h:mm A')}
                    </div>
                  </div>
                  <StatusBadge state={post.state} />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-400 py-10 text-center">
              Nothing is scheduled yet.
            </div>
          )}
        </section>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_280px] gap-5">
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Publishing Overview</h2>
            <span className="text-xs text-slate-400">Last 7 days</span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <div className="text-[11px] text-slate-400">Published</div>
              <div className="text-xl font-black text-slate-900">{posted}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Scheduled</div>
              <div className="text-xl font-black text-slate-900">{scheduled}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Failed</div>
              <div className="text-xl font-black text-slate-900">{failed}</div>
            </div>
          </div>
          <div className="h-[140px] flex items-end gap-2">
            {(dailyPosted.length
              ? dailyPosted
              : [...Array(7)].map((_, index) => ({
                  date: dayjs().subtract(6 - index, 'day').format('YYYY-MM-DD'),
                  count: 0,
                }))
            ).map((day) => {
              const max = Math.max(...dailyPosted.map((item) => item.count), 1);
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full h-[110px] flex items-end">
                    <div
                      className="w-full rounded-t-md bg-blue-500/80"
                      style={{ height: `${Math.max(8, (day.count / max) * 100)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400">{dayjs(day.date).format('dd')}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Connected Accounts</h2>
            <button
              onClick={() => router.push('/third-party')}
              className="text-xs font-semibold text-blue-600"
            >
              Manage
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {PLATFORM_FAMILIES.map((family) => {
              const connected = mvpAccounts.some((account: { identifier?: string }) =>
                MVP_PLATFORM_FAMILIES[family].includes(account.identifier || '')
              );
              return (
                <button
                  key={family}
                  onClick={() => router.push('/third-party')}
                  className={clsx(
                    'h-14 rounded-xl border flex items-center justify-center',
                    connected
                      ? 'bg-white border-slate-200'
                      : 'bg-slate-50 border-slate-100 opacity-50'
                  )}
                  title={family}
                >
                  <img
                    src={`/icons/platforms/${family === 'instagram' ? 'instagram' : family}.png`}
                    alt={family}
                    className="w-7 h-7"
                  />
                </button>
              );
            })}
          </div>
          <div className="text-xs text-slate-500 mb-2">
            {mvpAccounts.length} account{mvpAccounts.length === 1 ? '' : 's'} connected
          </div>
          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{
                width: `${Math.min(
                  100,
                  (mvpAccounts.length / PLATFORM_FAMILIES.length) * 100
                )}%`,
              }}
            />
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: 'Create a new post', action: openCreatePost },
              { label: 'Bulk upload content', action: () => router.push('/media') },
              { label: 'View content calendar', action: () => router.push('/launches?display=month') },
              { label: 'Manage connections', action: () => router.push('/third-party') },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 text-left"
              >
                <span className="text-xs font-bold text-slate-900">{item.label}</span>
                <span className="text-slate-400 text-xs">›</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
