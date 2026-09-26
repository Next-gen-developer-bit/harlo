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

dayjs.extend(utc);

type ComposeKind = 'text' | 'image' | 'video' | 'story';

const integrationKey = (integration: Integrations) =>
  platformFamily(integration.identifier);

const TEXT_PLATFORMS = [
  'facebook',
  'bluesky',
  'linkedin',
  'threads',
  'x',
  'instagram',
];
const MEDIA_PLATFORMS = [
  ...TEXT_PLATFORMS,
  'pinterest',
  'tiktok',
  'youtube',
];
const STORY_PLATFORMS = ['facebook', 'instagram'];

const cards: Array<{
  kind: ComposeKind;
  label: string;
  platforms: string[];
}> = [
  { kind: 'text', label: 'Text Post', platforms: TEXT_PLATFORMS },
  { kind: 'image', label: 'Image Post', platforms: MEDIA_PLATFORMS },
  { kind: 'video', label: 'Video Post', platforms: MEDIA_PLATFORMS },
  { kind: 'story', label: 'Story Post', platforms: STORY_PLATFORMS },
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
          : MEDIA_PLATFORMS;
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
            <span className="mt-5 flex flex-wrap items-center justify-center gap-1.5">
              {card.platforms.map((platform) => (
                <PlatformMark
                  key={platform}
                  platform={platform}
                  markId={`${card.kind}-${platform}`}
                />
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
      <svg width="86" height="64" viewBox="0 0 86 64" fill="none" aria-hidden="true">
        <rect x="8" y="18" width="46" height="30" rx="6" stroke="currentColor" strokeWidth="2.2" />
        <path d="M54 28l20-10v30L54 38V28Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M22 48v6M40 48v6M16 54h30" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
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

const PlatformMark = ({
  platform,
  markId,
}: {
  platform: string;
  markId: string;
}) => {
  const common = 'h-4 w-4 shrink-0';
  if (platform === 'facebook') {
    return (
      <svg className={common} viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="8" fill="#1877F2" />
        <path d="M9.1 13V8.7h1.4l.2-1.6H9.1V6.1c0-.5.1-.8.8-.8H10.8V3.9c-.2 0-.8-.1-1.5-.1-1.5 0-2.5.9-2.5 2.6v1.1H5.4v1.6h1.4V13h2.3Z" fill="white" />
      </svg>
    );
  }
  if (platform === 'bluesky') {
    return (
      <svg className={common} viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="8" fill="#1185FE" />
        <path d="M4.2 5.2c1.1 1.6 2.3 3.1 3.8 4.2-1.5.2-2.8.8-3.8 1.8.4-2 .8-3.8 0-6Zm7.6 0c-1.1 1.6-2.3 3.1-3.8 4.2 1.5.2 2.8.8 3.8 1.8-.4-2-.8-3.8 0-6Z" fill="white" />
      </svg>
    );
  }
  if (platform === 'linkedin') {
    return (
      <svg className={common} viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="8" fill="#0A66C2" />
        <path d="M4.4 6.4h1.6V11.6H4.4V6.4Zm.8-2.4a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8ZM7.2 6.4h1.5v.7h.1c.2-.4.8-.8 1.6-.8 1.7 0 2 1.1 2 2.6v2.7H11v-2.4c0-.6 0-1.3-.8-1.3s-.9.6-.9 1.3v2.4H7.2V6.4Z" fill="white" />
      </svg>
    );
  }
  if (platform === 'threads') {
    return (
      <svg className={common} viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="8" fill="#111" />
        <path d="M10.6 7.4c-.1-1.6-1.2-2.6-2.8-2.6-1.8 0-3 1.2-3 3.1 0 1.8 1.1 2.9 2.9 2.9.9 0 1.6-.2 2.2-.7l-.6-.7c-.5.4-1 .6-1.6.6-1.1 0-1.8-.7-1.8-1.8h4.4v-.8Zm-4.3-.2c.1-.9.7-1.5 1.6-1.5.9 0 1.4.6 1.5 1.5H6.3Z" fill="white" />
      </svg>
    );
  }
  if (platform === 'x') {
    return (
      <svg className={common} viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="8" fill="#111" />
        <path d="M4.4 4.6h1.7l1.6 2.2 1.8-2.2h1.5L8.8 8l2.6 3.4H9.7L8 9.1 6.2 11.4H4.6L7.2 8 4.4 4.6Z" fill="white" />
      </svg>
    );
  }
  if (platform === 'instagram') {
    return (
      <svg className={common} viewBox="0 0 16 16" aria-hidden="true">
        <defs>
          <linearGradient id={markId} x1="2" y1="14" x2="14" y2="2">
            <stop stopColor="#FEDA75" />
            <stop offset=".5" stopColor="#D62976" />
            <stop offset="1" stopColor="#4F5BD5" />
          </linearGradient>
        </defs>
        <circle cx="8" cy="8" r="8" fill={`url(#${markId})`} />
        <rect x="4.4" y="4.4" width="7.2" height="7.2" rx="2" stroke="white" strokeWidth="1.1" />
        <circle cx="8" cy="8" r="1.7" stroke="white" strokeWidth="1.1" />
        <circle cx="10.5" cy="5.6" r="0.5" fill="white" />
      </svg>
    );
  }
  if (platform === 'pinterest') {
    return (
      <svg className={common} viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="8" fill="#E60023" />
        <path d="M8 3.4c-2.4 0-3.8 1.7-3.8 3.6 0 1 .4 1.9 1.2 2.2.1.1.2 0 .2-.1l.2-.7c0-.1 0-.2-.1-.3-.3-.3-.4-.8-.4-1.2 0-1.6 1.2-3 3.1-3 1.7 0 2.6 1 2.6 2.4 0 1.8-.8 3.3-2 3.3-.6 0-1.1-.5-1-1.2.1-.5.3-1.1.3-1.4 0-.3-.2-.6-.6-.6-.5 0-.9.5-.9 1.2 0 .4.1.7.1.7l-.6 2.4c-.2.7 0 1.6 0 1.7 0 .1.1.1.1 0 .2-.3.8-1.2 1-1.7.3.5 1.1.9 1.9.9 2.5 0 4.2-2.3 4.2-5.3C13.4 5.1 11.2 3.4 8 3.4Z" fill="white" />
      </svg>
    );
  }
  if (platform === 'tiktok') {
    return (
      <svg className={common} viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="8" fill="#111" />
        <path d="M9.2 4.2c.4.8 1 1.4 1.8 1.7v1.4c-.7 0-1.3-.2-1.8-.6v3.1c0 1.8-1.3 3.1-3 3.1S3.2 11.6 3.2 9.8c0-1.7 1.3-3 3-3 .2 0 .4 0 .6.1v1.5c-.2-.1-.4-.1-.6-.1-.9 0-1.6.7-1.6 1.6s.7 1.6 1.6 1.6 1.5-.7 1.5-1.6V4.2h1.5Z" fill="white" />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="8" fill="#FF0033" />
      <path d="M6.6 4.6h2.1v4.5l2.4-1.3.7 1.2-3.7 2.1V4.6Z" fill="white" />
    </svg>
  );
};
