'use client';

import React, { useCallback } from 'react';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { useCalendar } from '@gitroom/frontend/components/launches/calendar.context';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { AddEditModal } from '@gitroom/frontend/components/new-launch/add.edit.modal';
import { useIntegrationList } from '@gitroom/frontend/components/launches/helpers/use.integration.list';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

export const CreatePostModal = () => {
  const fetch = useFetch();
  const modals = useModals();
  const router = useRouter();
  const calendarContext = useCalendar();
  const { data: listedIntegrations = [], mutate: reloadIntegrations } =
    useIntegrationList();
  const activeIntegrations = listedIntegrations.filter(
    (integration: { disabled?: boolean }) => !integration.disabled
  );
  const hasConnectedAccounts = activeIntegrations.length > 0;

  const navigate = useCallback(
    (path: string) => {
      modals.closeAll();
      router.push(path);
    },
    [modals, router]
  );

  const openComposer = useCallback(async () => {
    const loaded = listedIntegrations.length
      ? listedIntegrations
      : (await reloadIntegrations()) || [];
    const integrations = loaded.filter(
      (integration: { disabled?: boolean }) => !integration.disabled
    );

    if (!integrations.length) {
      navigate('/third-party');
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

    modals.closeAll();
    modals.openModal({
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
          allIntegrations={integrations.map((integration: { id: string }) => ({
            ...integration,
          }))}
          reopenModal={() => {}}
          mutate={calendarContext?.reloadCalendarView}
          integrations={integrations}
          selectedChannels={integrations.map(
            (integration: { id: string }) => integration.id
          )}
          date={date}
        />
      ),
      size: '80%',
      title: '',
    });
  }, [
    listedIntegrations,
    reloadIntegrations,
    navigate,
    fetch,
    modals,
    calendarContext,
  ]);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
      <div className="mb-6 flex items-start justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Create and schedule content
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Upload media, connect channels, then compose one post for your
            selected destinations.
          </p>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={() => modals.closeAll()}
          className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {!hasConnectedAccounts && (
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-blue-100 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-blue-950">
              Connect a social account to publish or schedule
            </h3>
            <p className="mt-1 text-xs text-blue-700">
              You can upload files to the media library first, but the composer
              needs at least one connected destination.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/third-party')}
            className="shrink-0 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
          >
            Connect social account
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <button
          type="button"
          onClick={() => navigate('/media')}
          className="group rounded-xl border border-blue-200 bg-blue-50/40 p-5 text-left transition-all hover:border-blue-500 hover:shadow-md"
        >
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900">
            Upload media
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-gray-500">
            Save images and videos to your Supabase-backed media library.
          </p>
          <span className="mt-5 block text-xs font-semibold text-blue-600">
            Open uploader →
          </span>
        </button>

        <button
          type="button"
          disabled={!hasConnectedAccounts}
          onClick={openComposer}
          className="group rounded-xl border border-gray-200 bg-white p-5 text-left transition-all hover:border-blue-500 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:shadow-none"
        >
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900">
            Create and schedule post
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-gray-500">
            Compose text, attach media, choose channels, and select a publish
            time.
          </p>
          <span className="mt-5 block text-xs font-semibold text-purple-600">
            {hasConnectedAccounts
              ? 'Open composer →'
              : 'Connect an account first'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/third-party')}
          className="group rounded-xl border border-gray-200 bg-white p-5 text-left transition-all hover:border-blue-500 hover:shadow-md"
        >
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
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
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900">
            {hasConnectedAccounts ? 'Manage connections' : 'Connect accounts'}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-gray-500">
            Add Instagram, Facebook, LinkedIn, TikTok, YouTube, Threads, or
            Pinterest.
          </p>
          <span className="mt-5 block text-xs font-semibold text-blue-600">
            {hasConnectedAccounts
              ? `${activeIntegrations.length} connected →`
              : 'Choose a platform →'}
          </span>
        </button>
      </div>
    </div>
  );
};
