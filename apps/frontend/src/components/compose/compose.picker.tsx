'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import useSWR from 'swr';
import { useClickAway } from '@uidotdev/usehooks';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { expandPostsList } from '@gitroom/helpers/utils/posts.list.minify';
import { resolveMediaUrl } from '@gitroom/helpers/utils/has.extension';
import { useIntegrationList } from '@gitroom/frontend/components/launches/helpers/use.integration.list';
import { Integrations } from '@gitroom/frontend/components/launches/calendar.context';
import { AddEditModal } from '@gitroom/frontend/components/new-launch/add.edit.modal';
import { ExistingDataContextProvider } from '@gitroom/frontend/components/launches/helpers/use.existing.data';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { newDayjs } from '@gitroom/frontend/components/layout/set.timezone';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { deleteDialog } from '@gitroom/react/helpers/delete.dialog';

dayjs.extend(utc);

type BoardTab = 'scheduled' | 'approval' | 'draft' | 'published';

type Channel = {
  id: string;
  providerIdentifier?: string;
  name?: string;
  picture?: string | null;
};

type ListPost = {
  id: string;
  content?: string;
  publishDate: string;
  state: string;
  group?: string;
  image?: string | null;
  error?: string | null;
  integration?: Channel;
};

const TABS: Array<{
  id: BoardTab;
  label: string;
  state: 'scheduled' | 'draft' | 'published' | null;
}> = [
  { id: 'scheduled', label: 'Scheduled', state: 'scheduled' },
  { id: 'approval', label: 'Awaiting Approval', state: null },
  { id: 'draft', label: 'Draft', state: 'draft' },
  { id: 'published', label: 'Published', state: 'published' },
];

const EMPTY: Record<BoardTab, { title: string; body: string }> = {
  scheduled: {
    title: 'No scheduled posts yet',
    body: 'Posts you schedule for later will appear here until they’re published at the set time.',
  },
  approval: {
    title: 'No posts awaiting approval',
    body: 'Posts sent for review will appear here until a teammate approves them.',
  },
  draft: {
    title: 'No drafts yet',
    body: 'Posts you save as drafts will appear here until you schedule them.',
  },
  published: {
    title: 'No published posts yet',
    body: 'Posts that have already gone live will appear here.',
  },
};

const captionOf = (content?: string) => {
  const text = (content || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text || 'Untitled post';
};

const dateLabel = (value: string) => {
  const date = newDayjs(value).local();
  const today = newDayjs();
  if (date.isSame(today, 'day')) return 'Today';
  if (date.isSame(today.add(1, 'day'), 'day')) return 'Tomorrow';
  if (date.isSame(today.subtract(1, 'day'), 'day')) return 'Yesterday';
  return date.format('dddd, MMM D');
};

const statusLabel = (state: string) => {
  if (state === 'PUBLISHED') return 'Published';
  if (state === 'DRAFT') return 'Draft';
  if (state === 'ERROR') return 'Failed';
  return 'Scheduled';
};

const groupPosts = (posts: ListPost[]) => {
  const groups: ListPost[][] = [];
  const index = new Map<string, ListPost[]>();
  posts.forEach((post) => {
    const key = post.group || post.id;
    const existing = index.get(key);
    if (existing) {
      existing.push(post);
      return;
    }
    const next = [post];
    index.set(key, next);
    groups.push(next);
  });
  return groups;
};

export const ComposePosts = () => {
  const fetch = useFetch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const modal = useModals();
  const toaster = useToaster();
  const { data: listedIntegrations = [], mutate: reloadIntegrations } =
    useIntegrationList();
  const [tab, setTab] = useState<BoardTab>('scheduled');
  const [search, setSearch] = useState('');
  const [channelId, setChannelId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [extra, setExtra] = useState<ListPost[]>([]);
  const [page, setPage] = useState(0);
  const [more, setMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const openedCreate = useRef(false);
  const filterRef = useClickAway<HTMLDivElement>(() => setFiltersOpen(false));

  const apiState = TABS.find((item) => item.id === tab)?.state || null;

  const load = useCallback(async () => {
    const response = await fetch(
      `/posts/list?page=0&limit=100&customer=&state=${apiState}`
    );
    return expandPostsList(await response.json());
  }, [apiState, fetch]);

  const { data, error, isLoading, mutate } = useSWR(
    apiState ? `compose-posts-${apiState}` : null,
    load,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    setExtra([]);
    setPage(0);
    setMore(false);
  }, [apiState]);

  const channels = useMemo(
    () =>
      ((listedIntegrations || []) as Integrations[]).filter(
        (integration) => !integration.disabled
      ),
    [listedIntegrations]
  );

  const refresh = useCallback(async () => {
    setExtra([]);
    setPage(0);
    setMore(false);
    await mutate();
  }, [mutate]);

  const openComposer = useCallback(async () => {
    const loaded = channels.length
      ? channels
      : ((await reloadIntegrations()) || []).filter(
          (integration: Integrations) => !integration.disabled
        );
    if (!loaded.length) {
      router.push('/third-party');
      return;
    }

    let date = dayjs();
    try {
      const response = await fetch('/posts/find-slot');
      const slot = await response.json();
      if (slot?.date) {
        date = dayjs.utc(slot.date).local();
      }
    } catch {
      // Current time remains a safe composer fallback.
    }

    modal.openModal({
      id: 'add-edit-modal',
      closeOnClickOutside: false,
      removeLayout: true,
      closeOnEscape: false,
      withCloseButton: false,
      askClose: true,
      fullScreen: true,
      classNames: {
        modal: 'w-[100%] max-w-[1400px] text-textColor',
      },
      children: (
        <AddEditModal
          date={date}
          integrations={loaded}
          allIntegrations={loaded}
          mutate={refresh}
          reopenModal={() => undefined}
        />
      ),
      size: '80%',
      title: '',
    });
  }, [channels, fetch, modal, refresh, reloadIntegrations, router]);

  useEffect(() => {
    if (searchParams.get('create') !== '1') {
      openedCreate.current = false;
      return;
    }
    if (openedCreate.current) {
      return;
    }
    openedCreate.current = true;
    router.replace('/compose');
    void openComposer();
  }, [openComposer, router, searchParams]);

  const openPost = useCallback(
    (post: ListPost) => async () => {
      const response = await fetch(`/posts/group/${post.group || post.id}`);
      const existing = await response.json().catch(() => ({}));
      if (!response.ok || !existing?.posts?.length) {
        await refresh();
        toaster.show(
          'This post no longer exists. The list has been refreshed.',
          'warning'
        );
        return;
      }

      const available = channels.length
        ? channels
        : ((await reloadIntegrations()) || []).filter(
            (integration: Integrations) => !integration.disabled
          );

      modal.openModal({
        id: 'add-edit-modal',
        closeOnClickOutside: false,
        removeLayout: true,
        closeOnEscape: false,
        withCloseButton: false,
        askClose: true,
        fullScreen: true,
        classNames: {
          modal: 'w-[100%] max-w-[1400px] text-textColor',
        },
        children: (
          <ExistingDataContextProvider value={existing}>
            <AddEditModal
              allIntegrations={available.map((item) => ({ ...item }))}
              reopenModal={openPost(post)}
              mutate={refresh}
              integrations={available
                .filter((item) => item.id === existing.integration)
                .map((item) => ({
                  ...item,
                  picture: existing.integrationPicture || item.picture,
                }))}
              date={dayjs.utc(existing.posts[0].publishDate).local()}
            />
          </ExistingDataContextProvider>
        ),
        size: '80%',
        title: '',
      });
    },
    [channels, fetch, modal, refresh, reloadIntegrations, toaster]
  );

  const removePost = useCallback(
    (post: ListPost) => async () => {
      if (
        !(await deleteDialog('Are you sure you want to delete this post?'))
      ) {
        return;
      }
      const response = await fetch(`/posts/${post.group || post.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        toaster.show('Failed to delete post', 'warning');
        return;
      }
      await refresh();
      toaster.show('Post deleted', 'success');
    },
    [fetch, refresh, toaster]
  );

  const loadMore = useCallback(async () => {
    if (!apiState || loadingMore) return;
    setLoadingMore(true);
    try {
      const next = page + 1;
      const response = await fetch(
        `/posts/list?page=${next}&limit=100&customer=&state=${apiState}`
      );
      const expanded = expandPostsList(await response.json());
      setExtra((current) => [...current, ...((expanded.posts || []) as ListPost[])]);
      setPage(next);
      setMore(!!expanded.hasMore);
    } finally {
      setLoadingMore(false);
    }
  }, [apiState, fetch, loadingMore, page]);

  const posts = useMemo(
    () => [...((data?.posts || []) as ListPost[]), ...extra],
    [data?.posts, extra]
  );

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return groupPosts(posts).filter((group) => {
      if (
        channelId &&
        !group.some((post) => post.integration?.id === channelId)
      ) {
        return false;
      }
      if (!query) return true;
      return group.some((post) => {
        const caption = captionOf(post.content).toLowerCase();
        const name = (post.integration?.name || '').toLowerCase();
        return caption.includes(query) || name.includes(query);
      });
    });
  }, [channelId, posts, search]);

  const dated = useMemo(() => {
    const buckets: Array<{ key: string; label: string; posts: ListPost[][] }> =
      [];
    visible.forEach((group) => {
      const key = newDayjs(group[0].publishDate).local().format('YYYY-MM-DD');
      const last = buckets[buckets.length - 1];
      if (!last || last.key !== key) {
        buckets.push({
          key,
          label: dateLabel(group[0].publishDate),
          posts: [group],
        });
        return;
      }
      last.posts.push(group);
    });
    return buckets;
  }, [visible]);

  const hasMore = extra.length ? more : !!data?.hasMore;
  const filtering = search.trim().length > 0 || !!channelId;
  const showEmpty = !isLoading && !error && visible.length === 0;
  const empty = EMPTY[tab];

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white text-[#111827]">
      <div className="flex flex-col gap-4 px-6 pb-2 pt-5 md:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <Link
              href="/compose"
              className="border-b-2 border-[#2563eb] pb-1 text-[15px] font-semibold text-[#2563eb]"
            >
              Posts
            </Link>
            <span className="h-5 w-px bg-[#e5e7eb]" aria-hidden="true" />
            <Link
              href="/launches"
              className="pb-1 text-[15px] font-semibold text-[#1f2937] hover:text-[#111827]"
            >
              Calendar
            </Link>
            <Link
              href="/queue"
              className="pb-1 text-[15px] font-semibold text-[#1f2937] hover:text-[#111827]"
            >
              Queues
            </Link>
          </div>
          <Link
            href="/media"
            className="inline-flex h-9 items-center gap-2 self-start rounded-lg border border-[#e5e7eb] bg-white px-3 text-[13.5px] font-medium text-[#374151] hover:bg-[#f9fafb]"
          >
            <UploadIcon />
            Bulk Import
          </Link>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {TABS.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={clsx(
                    'inline-flex h-9 items-center gap-1.5 rounded-full border bg-white px-3.5 text-[13.5px] font-medium',
                    active
                      ? 'border-[#3b82f6] text-[#2563eb]'
                      : 'border-[#e5e7eb] text-[#6b7280] hover:bg-[#f9fafb]'
                  )}
                >
                  <TabIcon id={item.id} />
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <label className="relative block w-full lg:w-[220px]">
              <span className="sr-only">Search posts</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search posts"
                className="h-9 w-full rounded-lg border border-[#e5e7eb] bg-white px-3 text-[13.5px] text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#93c5fd]"
              />
            </label>
            <div className="relative" ref={filterRef}>
              <button
                type="button"
                aria-label="Filter posts"
                aria-expanded={filtersOpen}
                onClick={() => setFiltersOpen((open) => !open)}
                className={clsx(
                  'flex h-9 w-9 items-center justify-center rounded-lg border bg-white text-[#6b7280] hover:bg-[#f9fafb]',
                  channelId ? 'border-[#3b82f6] text-[#2563eb]' : 'border-[#e5e7eb]'
                )}
              >
                <FilterIcon />
              </button>
              {filtersOpen ? (
                <div className="absolute right-0 z-30 mt-2 w-64 rounded-xl border border-[#e5e7eb] bg-white p-1.5 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
                  <FilterChoice
                    active={!channelId}
                    label="All channels"
                    onClick={() => {
                      setChannelId(null);
                      setFiltersOpen(false);
                    }}
                  />
                  {channels.map((channel) => (
                    <FilterChoice
                      key={channel.id}
                      active={channelId === channel.id}
                      label={channel.name || channel.identifier}
                      onClick={() => {
                        setChannelId(channel.id);
                        setFiltersOpen(false);
                      }}
                    />
                  ))}
                  {!channels.length ? (
                    <p className="px-2.5 py-2 text-[13px] text-[#6b7280]">
                      No channels connected.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center text-[14px] text-[#6b7280]">
            Loading posts…
          </div>
        ) : error ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <h2 className="text-[18px] font-bold tracking-[-0.02em]">
              Couldn’t load posts
            </h2>
            <button
              type="button"
              onClick={() => mutate()}
              className="mt-4 inline-flex h-10 items-center rounded-lg bg-[#2563eb] px-4 text-[14px] font-semibold text-white hover:bg-[#1d4ed8]"
            >
              Try again
            </button>
          </div>
        ) : showEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
            <h2 className="text-[18px] font-bold tracking-[-0.02em] text-[#111827]">
              {filtering ? 'No posts found' : empty.title}
            </h2>
            <p className="mt-2 max-w-[420px] text-[14px] leading-6 text-[#6b7280]">
              {filtering
                ? 'Nothing matches that search. Try a different word or clear the filters.'
                : empty.body}
            </p>
            {filtering ? (
              <div className="mt-5 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setChannelId(null);
                  }}
                  className="text-[14px] font-medium text-[#2563eb] hover:underline"
                >
                  Clear filters
                </button>
                {hasMore ? (
                  <button
                    type="button"
                    onClick={() => void loadMore()}
                    disabled={loadingMore}
                    className="inline-flex h-9 items-center rounded-lg border border-[#e5e7eb] px-3 text-[13.5px] font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-60"
                  >
                    {loadingMore ? 'Loading…' : 'Load more'}
                  </button>
                ) : null}
              </div>
            ) : (
              <>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => void openComposer()}
                    className="inline-flex h-10 items-center rounded-lg bg-[#2563eb] px-4 text-[14px] font-semibold text-white hover:bg-[#1d4ed8]"
                  >
                    Schedule a Post
                  </button>
                  <Link
                    href="/launches"
                    className="inline-flex h-10 items-center rounded-lg bg-[#f3f4f6] px-4 text-[14px] font-semibold text-[#374151] hover:bg-[#e5e7eb]"
                  >
                    Open Calendar
                  </Link>
                </div>
                {tab === 'scheduled' ? (
                  <Link
                    href="/docs"
                    className="mt-3 text-[14px] font-medium text-[#2563eb] hover:underline"
                  >
                    Learn to schedule
                  </Link>
                ) : null}
              </>
            )}
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-[880px] flex-1 flex-col px-6 py-6 md:px-8">
            {dated.map((bucket) => (
              <section key={bucket.key} className="mb-6">
                <h3 className="mb-2 text-[13px] font-semibold text-[#111827]">
                  {bucket.label}
                </h3>
                <div className="overflow-hidden rounded-xl border border-[#eef0f3]">
                  {bucket.posts.map((group) => {
                    const post = group[0];
                    const thumb = resolveMediaUrl(post.image);
                    return (
                      <div
                        key={post.group || post.id}
                        className="group flex items-start gap-3 border-b border-[#f3f4f6] bg-white px-4 py-3.5 last:border-b-0 hover:bg-[#fafbfc]"
                      >
                        <button
                          type="button"
                          onClick={openPost(post)}
                          className="flex min-w-0 flex-1 items-start gap-3 text-left"
                        >
                          <ChannelMarks posts={group} />
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-3">
                              <span className="truncate text-[13.5px] font-semibold text-[#111827]">
                                {group
                                  .map((item) => item.integration?.name)
                                  .filter(Boolean)
                                  .join(', ') || 'Channel'}
                              </span>
                              <span className="shrink-0 text-[12.5px] font-medium text-[#9ca3af]">
                                {newDayjs(post.publishDate).local().format('h:mm A')}
                              </span>
                            </span>
                            <span className="mt-1 line-clamp-2 block text-[14px] leading-5 text-[#374151]">
                              {captionOf(post.content)}
                            </span>
                            <span
                              className={clsx(
                                'mt-1.5 block text-[12.5px] font-medium',
                                post.state === 'PUBLISHED'
                                  ? 'text-[#059669]'
                                  : post.state === 'DRAFT'
                                  ? 'text-[#6b7280]'
                                  : post.state === 'ERROR'
                                  ? 'text-[#e11d48]'
                                  : 'text-[#2563eb]'
                              )}
                            >
                              {statusLabel(post.state)}
                            </span>
                            {post.state === 'ERROR' && post.error ? (
                              <span className="mt-1 block text-[12px] text-[#e11d48]">
                                {post.error}
                              </span>
                            ) : null}
                          </span>
                          {thumb ? (
                            <img
                              src={thumb}
                              alt=""
                              className="h-12 w-12 shrink-0 rounded-lg object-cover"
                            />
                          ) : null}
                        </button>
                        <button
                          type="button"
                          onClick={removePost(post)}
                          className="mt-0.5 shrink-0 rounded-md px-2 py-1 text-[12px] font-medium text-[#9ca3af] opacity-0 hover:text-[#e11d48] group-hover:opacity-100"
                        >
                          Delete
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
            {hasMore ? (
              <button
                type="button"
                onClick={() => void loadMore()}
                disabled={loadingMore}
                className="mx-auto mt-2 inline-flex h-9 items-center rounded-lg border border-[#e5e7eb] px-3 text-[13.5px] font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-60"
              >
                {loadingMore ? 'Loading…' : 'Load more'}
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

const FilterChoice = ({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx(
      'flex w-full items-center rounded-lg px-2.5 py-2 text-left text-[13.5px]',
      active
        ? 'bg-[#eff6ff] font-medium text-[#2563eb]'
        : 'text-[#374151] hover:bg-[#f9fafb]'
    )}
  >
    <span className="truncate">{label}</span>
  </button>
);

const ChannelMarks = ({ posts }: { posts: ListPost[] }) => (
  <span className="mt-0.5 flex shrink-0 items-center">
    {posts.slice(0, 3).map((post, index) => {
      const picture = resolveMediaUrl(post.integration?.picture);
      const identifier = post.integration?.providerIdentifier;
      return (
        <span
          key={post.id}
          className="relative h-8 w-8 overflow-hidden rounded-full border border-white bg-[#f3f4f6]"
          style={{ marginLeft: index === 0 ? 0 : -8 }}
        >
          {picture ? (
            <img src={picture} alt="" className="h-full w-full object-cover" />
          ) : identifier ? (
            <img
              src={
                identifier === 'youtube'
                  ? '/icons/platforms/youtube.svg'
                  : `/icons/platforms/${identifier}.png`
              }
              alt=""
              className="h-full w-full object-cover"
            />
          ) : null}
        </span>
      );
    })}
  </span>
);

const TabIcon = ({ id }: { id: BoardTab }) => {
  const className = 'h-4 w-4';
  if (id === 'scheduled') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
        <path d="M12 8v4.2l2.6 1.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === 'approval') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 4h8M8 20h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M8 4c0 4 2.2 5.2 4 8-1.8 2.8-4 4-4 8M16 4c0 4-2.2 5.2-4 8 1.8 2.8 4 4 4 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === 'draft') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 19h3.2L18 9.2 14.8 6 5 15.8V19Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M13.2 7.6 16.4 10.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.5 12.2 11 14.6 15.6 9.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const UploadIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 16V6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M8.2 9.2 12 5.5l3.8 3.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 16.5V18a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 18 18v-1.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const FilterIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <circle cx="9" cy="7" r="1.7" fill="white" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="15" cy="12" r="1.7" fill="white" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="11" cy="17" r="1.7" fill="white" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
