'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useIntegrationList } from '@gitroom/frontend/components/launches/helpers/use.integration.list';
import { platformFamily } from '@gitroom/frontend/components/launches/helpers/mvp.platforms';
import { AddEditModal } from '@gitroom/frontend/components/new-launch/add.edit.modal';
import { Integrations } from '@gitroom/frontend/components/launches/calendar.context';
import { PlatformMark } from '@gitroom/frontend/components/compose/platform.marks';

dayjs.extend(utc);

type ComposeKind = 'text' | 'image' | 'video' | 'story';

const integrationKey = (integration: Integrations) =>
  platformFamily(integration.identifier);

const TEXT_PLATFORMS = [
  'facebook',
  'linkedin',
  'threads',
  'x',
  'instagram',
];
const IMAGE_PLATFORMS = [...TEXT_PLATFORMS, 'pinterest', 'tiktok'];
const VIDEO_PLATFORMS = [...IMAGE_PLATFORMS, 'youtube'];
const STORY_PLATFORMS = ['facebook', 'instagram'];

const textIcons = ['facebook', 'linkedin', 'threads', 'x', 'instagram'];
const imageIcons = [...textIcons, 'pinterest', 'tiktok'];
const videoIcons = [...imageIcons, 'youtube'];

const cards: Array<{
  kind: ComposeKind;
  label: string;
  platforms: string[];
}> = [
  { kind: 'text', label: 'Text Post', platforms: textIcons },
  { kind: 'image', label: 'Image Post', platforms: imageIcons },
  { kind: 'video', label: 'Video Post', platforms: videoIcons },
  { kind: 'story', label: 'Story Post', platforms: ['facebook', 'instagram'] },
];

export const ComposePicker = () => {
  const fetch = useFetch();
  const router = useRouter();
  const { data: listedIntegrations = [], mutate: reloadIntegrations } =
    useIntegrationList();
  const [composer, setComposer] = useState<{
    kind: ComposeKind;
    date: dayjs.Dayjs;
    integrations: Integrations[];
    selectedChannels: string[];
  } | null>(null);

  const openKind = useCallback(
    async (kind: ComposeKind) => {
      const loaded = listedIntegrations.length
        ? listedIntegrations
        : (await reloadIntegrations()) || [];
      const integrations = (loaded as Integrations[]).filter(
        (integration) => !integration.disabled
      );
      if (!integrations.length) {
        router.push('/third-party');
        return;
      }

      const allowed =
        kind === 'story'
          ? STORY_PLATFORMS
          : kind === 'text'
          ? TEXT_PLATFORMS
          : kind === 'video'
          ? VIDEO_PLATFORMS
          : IMAGE_PLATFORMS;
      const matched = integrations.filter((integration) =>
        allowed.includes(integrationKey(integration))
      );
      const selected = matched.length ? matched : integrations;

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

      setComposer({
        kind,
        date,
        integrations,
        selectedChannels: selected.map((integration) => integration.id),
      });
    },
    [fetch, listedIntegrations, reloadIntegrations, router]
  );

  if (composer) {
    return (
      <div className="flex h-[calc(100vh-4.5rem)] min-h-[640px] flex-col bg-[#f4f6f8]">
        <AddEditModal
          key={composer.kind}
          date={composer.date}
          integrations={composer.integrations}
          allIntegrations={composer.integrations}
          selectedChannels={composer.selectedChannels}
          reopenModal={() => {}}
          mutate={() => undefined}
          customClose={() => setComposer(null)}
        />
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-8 md:px-10 md:py-10">
      <h1 className="text-[30px] font-semibold tracking-[-0.4px] text-[#1c2430]">
        Create a new post
      </h1>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <button
            key={card.kind}
            type="button"
            onClick={() => openKind(card.kind)}
            className="flex min-h-[300px] flex-col items-center rounded-[18px] border border-dashed border-[#d5dce6] bg-[#f7f9fb] px-4 pb-6 pt-10 text-center transition-colors hover:border-[#b7c3d1] hover:bg-white"
          >
            <ComposeMark kind={card.kind} />
            <span className="mt-5 text-[16px] font-medium text-[#8b95a3]">
              {card.label}
            </span>
            <span className="mt-5 flex flex-wrap items-center justify-center gap-[5px]">
              {card.platforms.map((platform) => (
                <PlatformMark key={platform} platform={platform} />
              ))}
            </span>
          </button>
        ))}
      </div>
      <p className="mt-5 flex items-center gap-2 text-[13.5px] text-[#8b95a3]">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#22c55e] text-[11px] font-bold text-white">
          i
        </span>
        You can connect more accounts{' '}
        <Link href="/third-party" className="font-medium text-[#6b7280] underline">
          here
        </Link>
      </p>
    </div>
  );
};

const ComposeMark = ({ kind }: { kind: ComposeKind }) => (
  <span className="text-[#c5ced8]">
    {kind === 'text' ? (
      <svg width="78" height="64" viewBox="0 0 78 64" fill="none" aria-hidden="true">
        <path d="M18 18h8.5L34 46h-7.2l-1.5-4.6H16.6L15 46H8L18 18Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M17.4 36.2h6.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M42 22h24M42 32h24M42 42h16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    ) : kind === 'image' ? (
      <svg width="78" height="64" viewBox="0 0 78 64" fill="none" aria-hidden="true">
        <rect x="8" y="10" width="62" height="44" rx="6" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="26" cy="26" r="5" stroke="currentColor" strokeWidth="2.2" />
        <path d="M14 46l14-12 10 8 8-7 18 14" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      </svg>
    ) : kind === 'video' ? (
      <svg width="78" height="56" viewBox="0 0 78 56" fill="none" aria-hidden="true">
        <rect x="6" y="14" width="46" height="30" rx="8" stroke="currentColor" strokeWidth="2.2" />
        <path d="M52 24l18-8v26l-18-8V24Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      </svg>
    ) : (
      <svg width="72" height="64" viewBox="0 0 72 64" fill="none" aria-hidden="true">
        <rect x="10" y="16" width="52" height="36" rx="8" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="36" cy="34" r="9" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="36" cy="34" r="3.5" stroke="currentColor" strokeWidth="2.2" />
        <path d="M26 16l3-6h14l3 6" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      </svg>
    )}
  </span>
);
