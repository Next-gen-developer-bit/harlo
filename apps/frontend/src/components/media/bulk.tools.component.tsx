'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MediaBox } from '@gitroom/frontend/components/media/media.component';
import { useIntegrationList } from '@gitroom/frontend/components/launches/helpers/use.integration.list';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useToaster } from '@gitroom/react/toaster/toaster';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSWRConfig } from 'swr';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { useCalendar } from '@gitroom/frontend/components/launches/calendar.context';
import { AddEditModal } from '@gitroom/frontend/components/new-launch/add.edit.modal';
import dayjs from 'dayjs';

type UploadType = 'image' | 'video';

interface UploadedMedia {
  id: string;
  path: string;
  name?: string;
  originalName?: string;
  type: UploadType;
}

export const BulkToolsComponent = () => {
  const [activeTab, setActiveTab] = useState<'tools' | 'library'>('tools');
  const [uploading, setUploading] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const modals = useModals();
  const { reloadCalendarView } = useCalendar();
  const { data: integrations = [], mutate: reloadIntegrations } =
    useIntegrationList();
  const { mutate: mutateMedia } = useSWRConfig();
  const fetch = useFetch();
  const toaster = useToaster();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchParams.get('tab') === 'library') {
      setActiveTab('library');
    }
  }, [searchParams]);

  const activeIntegrations = integrations.filter(
    (integration: { disabled?: boolean }) => !integration.disabled
  );

  const openComposer = useCallback(
    async (media: UploadedMedia[]) => {
      const availableIntegrations = activeIntegrations.length
        ? activeIntegrations
        : ((await reloadIntegrations()) || []).filter(
            (integration: { disabled?: boolean }) => !integration.disabled
          );

      if (!availableIntegrations.length) {
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
            allIntegrations={availableIntegrations.map((integration: any) => ({
              ...integration,
            }))}
            reopenModal={() => {}}
            mutate={reloadCalendarView}
            integrations={availableIntegrations}
            selectedChannels={availableIntegrations.map(
              (integration: { id: string }) => integration.id
            )}
            date={date}
            onlyValues={[
              {
                content: '',
                image: media.map(({ id, path }) => ({ id, path })),
              },
            ]}
          />
        ),
        size: '80%',
        title: '',
      });
    },
    [
      activeIntegrations,
      fetch,
      modals,
      reloadCalendarView,
      reloadIntegrations,
      router,
    ]
  );

  const uploadFiles = useCallback(
    async (files: FileList | null, type: UploadType) => {
      if (!files?.length) {
        return;
      }

      setUploading(true);
      let successCount = 0;
      const uploaded: UploadedMedia[] = [];

      try {
        for (const file of Array.from(files)) {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/media/upload-server', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const savedMedia = await response.json();
            if (savedMedia?.id && savedMedia?.path) {
              uploaded.push({
                id: savedMedia.id,
                path: savedMedia.path,
                name: savedMedia.name,
                originalName: savedMedia.originalName || file.name,
                type,
              });
            }
            successCount += 1;
            continue;
          }

          const message = await response.text();
          toaster.show(message || `Failed to upload ${file.name}`, 'warning');
        }

        if (!successCount) {
          toaster.show('No files were uploaded.', 'warning');
          return;
        }

        toaster.show(
          `Uploaded ${successCount} ${type}${
            successCount === 1 ? '' : 's'
          }. Choose an item below to create and schedule a post.`,
          'success'
        );
        setUploadedMedia((current) => [...uploaded, ...current]);
        await mutateMedia(
          (key) => typeof key === 'string' && key.startsWith('get-media-'),
          undefined,
          { revalidate: true }
        );
        setActiveTab('tools');
      } catch (error) {
        toaster.show(
          error instanceof Error ? error.message : 'Error uploading files.',
          'warning'
        );
      } finally {
        setUploading(false);
      }
    },
    [fetch, mutateMedia, toaster]
  );

  const uploadedImages = uploadedMedia.filter(
    (media) => media.type === 'image'
  );

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl p-8 pt-10 font-sans">
      <input
        ref={imageInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        className="hidden"
        onChange={(event) => {
          uploadFiles(event.target.files, 'image');
          event.target.value = '';
        }}
      />
      <input
        ref={videoInputRef}
        type="file"
        multiple
        accept="video/mp4"
        className="hidden"
        onChange={(event) => {
          uploadFiles(event.target.files, 'video');
          event.target.value = '';
        }}
      />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Media
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload images and videos, connect channels, then schedule content.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => imageInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
          >
            <span className="text-base leading-none">+</span>
            {uploading ? 'Uploading…' : 'Upload images'}
          </button>
          <button
            type="button"
            disabled={uploading}
            onClick={() => videoInputRef.current?.click()}
            className="rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-50 disabled:cursor-wait disabled:opacity-60"
          >
            Upload videos
          </button>
          <button
            type="button"
            onClick={() => router.push('/third-party')}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Connect account
          </button>
        </div>
      </div>

      {!activeIntegrations.length && (
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-blue-100 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-blue-950">
              Connect a social account before scheduling
            </h2>
            <p className="mt-1 text-xs text-blue-700">
              You can upload media now. Connect Instagram, Facebook, LinkedIn,
              TikTok, YouTube, Threads, or Pinterest to publish it later.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/third-party')}
            className="shrink-0 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
          >
            Connect social account
          </button>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center rounded-xl bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('tools')}
            className={clsx(
              'rounded-lg px-4 py-2 text-xs font-semibold transition-colors',
              activeTab === 'tools'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            )}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={clsx(
              'rounded-lg px-4 py-2 text-xs font-semibold transition-colors',
              activeTab === 'library'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            )}
          >
            Media Library
          </button>
        </div>

        {!!activeIntegrations.length && (
          <button
            type="button"
            onClick={() => router.push('/launches')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Open calendar to schedule →
          </button>
        )}
      </div>

      {!!uploadedMedia.length && (
        <section className="mb-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Ready to schedule
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                Open an uploaded item in the composer, choose channels, then
                publish now, schedule it, or add it to your queue.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {uploadedImages.length > 1 && (
                <button
                  type="button"
                  onClick={() => openComposer(uploadedImages)}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Create image carousel
                </button>
              )}
              <button
                type="button"
                onClick={() => setUploadedMedia([])}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {uploadedMedia.map((media) => (
              <div
                key={media.id}
                className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {media.type === 'video' ? (
                    <video
                      src={`${media.path}#t=0.1`}
                      preload="metadata"
                      muted
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={media.path}
                      alt={media.originalName || media.name || 'Uploaded media'}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    title={media.originalName || media.name}
                    className="truncate text-xs font-semibold text-slate-800"
                  >
                    {media.originalName || media.name || 'Uploaded media'}
                  </div>
                  <div className="mt-1 text-[11px] capitalize text-slate-500">
                    {media.type}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openComposer([media])}
                  className="shrink-0 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                >
                  Create post
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'tools' ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => imageInputRef.current?.click()}
            className="group flex min-h-56 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-white p-8 text-center shadow-sm transition-all hover:border-blue-500 hover:bg-blue-50/40 disabled:cursor-wait disabled:opacity-60"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <svg
                className="h-6 w-6"
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
            <h3 className="text-base font-bold text-gray-900">Upload images</h3>
            <p className="mt-2 text-xs text-gray-500">
              Select PNG, JPG, WEBP, or GIF files from your computer.
            </p>
            <span className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white">
              Choose image files
            </span>
          </button>

          <button
            type="button"
            disabled={uploading}
            onClick={() => videoInputRef.current?.click()}
            className="group flex min-h-56 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-purple-200 bg-white p-8 text-center shadow-sm transition-all hover:border-purple-500 hover:bg-purple-50/40 disabled:cursor-wait disabled:opacity-60"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-purple-600">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-900">Upload videos</h3>
            <p className="mt-2 text-xs text-gray-500">
              Select MP4 files that are ready for social publishing.
            </p>
            <span className="mt-5 rounded-lg bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white">
              Choose video files
            </span>
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <MediaBox
            setMedia={() => {}}
            closeModal={() => {}}
            standalone
            onCreatePost={(media, type) =>
              openComposer([
                {
                  ...media,
                  type,
                },
              ])
            }
          />
        </div>
      )}
    </div>
  );
};
