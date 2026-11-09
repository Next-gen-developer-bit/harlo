'use client';

import { FC, useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import useSWR from 'swr';
import { useShallow } from 'zustand/react/shallow';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { parseUtmUrl, trackingUrl } from '@gitroom/helpers/utils/utm.link';
import { useLaunchStore } from '@gitroom/frontend/components/new-launch/store';
import {
  PLATFORM_LABELS,
  platformFamily,
} from '@gitroom/frontend/components/launches/helpers/mvp.platforms';

const useSavedTags = () => {
  const fetch = useFetch();
  const load = useCallback(async () => {
    const response = await fetch('/posts/tags');
    return response.json();
  }, [fetch]);
  return useSWR<{ tags?: { id: string; name: string }[] }>('load-tags', load);
};

const Field = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => (
  <label className="block">
    <span className="mb-1 block text-[12px] font-medium text-slate-500">
      {label}
    </span>
    <input
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="h-9 w-full rounded-lg border border-[#e6e8ee] bg-white px-3 text-[13px] text-[#0f172a] outline-none focus:border-[#612BD3]"
    />
  </label>
);

export const LinkTrackingSection: FC = () => {
  const t = useT();
  const { data } = useSavedTags();
  const [open, setOpen] = useState(false);
  const [customCampaign, setCustomCampaign] = useState(false);
  const [customise, setCustomise] = useState(false);
  const { selectedIntegrations, tags, global, linkTracking, setLinkTracking } =
    useLaunchStore(
      useShallow((state) => ({
        selectedIntegrations: state.selectedIntegrations,
        tags: state.tags,
        global: state.global,
        linkTracking: state.linkTracking,
        setLinkTracking: state.setLinkTracking,
      }))
    );
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current || linkTracking.url) {
      return;
    }
    const blob = (global || []).map((item) => item.content || '').join('\n');
    const urls = blob.match(/https?:\/\/[^\s"'<>]+/g) || [];
    const parsed = urls
      .map((url) =>
        parseUtmUrl(url.replace(/[),.;]+$/g, '').replace(/&amp;/g, '&'))
      )
      .find(
        (item) =>
          item &&
          (item.params.source ||
            item.params.medium ||
            item.params.campaign ||
            item.params.term ||
            item.params.content)
      );
    if (!parsed) {
      return;
    }
    hydrated.current = true;
    setLinkTracking({
      url: parsed.base,
      campaign: parsed.params.campaign || '',
      medium: parsed.params.medium || 'social',
      term: parsed.params.term || '',
      content: parsed.params.content || '',
    });
    setOpen(true);
  }, [global, linkTracking.url, setLinkTracking]);

  const campaigns = Array.from(
    new Set(
      [
        ...(data?.tags || []).map((tag) => tag.name),
        ...tags.map((tag) => tag.value || tag.label),
      ].filter((name) => !!name?.trim())
    )
  );
  const knownCampaign = campaigns.includes(linkTracking.campaign);
  const showCustom =
    customCampaign || (!!linkTracking.campaign && !knownCampaign);

  const rows = selectedIntegrations.map((item) => {
    const family = platformFamily(item.integration.identifier) || 'social';
    const source = linkTracking.sourceOverride.trim() || family;
    const href = trackingUrl(linkTracking.url, {
      source,
      medium: linkTracking.medium || 'social',
      campaign: linkTracking.campaign,
      term: linkTracking.term,
      content: linkTracking.content,
    });
    return {
      id: item.integration.id,
      name:
        PLATFORM_LABELS[family] ||
        item.integration.name ||
        family,
      href,
    };
  });

  return (
    <div className="rounded-xl border border-[#e6e8ee] bg-white">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
      >
        <span className="text-[12px] text-[#612BD3]">{open ? '▾' : '▸'}</span>
        <span className="flex-1 text-[13px] font-semibold text-[#0f172a]">
          {t('link_tracking', 'Link tracking')}
        </span>
        <span className="text-[12px] text-slate-500">
          {linkTracking.url
            ? t('tracking_on', 'On')
            : t('add_tracked_link', 'Add a tracked link')}
        </span>
      </button>
      {open && (
        <div className="flex flex-col gap-3 border-t border-[#e6e8ee] px-3 py-3">
          <Field
            label={t('website_url', 'Website URL')}
            value={linkTracking.url}
            placeholder="https://example.com/page"
            onChange={(url) => setLinkTracking({ url })}
          />
          <label className="block">
            <span className="mb-1 block text-[12px] font-medium text-slate-500">
              {t('utm_campaign', 'Campaign')}
            </span>
            {campaigns.length > 0 && (
              <select
                value={
                  showCustom
                    ? '__custom'
                    : knownCampaign
                    ? linkTracking.campaign
                    : ''
                }
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === '__custom') {
                    setCustomCampaign(true);
                    if (knownCampaign) {
                      setLinkTracking({ campaign: '' });
                    }
                    return;
                  }
                  setCustomCampaign(false);
                  setLinkTracking({ campaign: value });
                }}
                className="h-9 w-full rounded-lg border border-[#e6e8ee] bg-white px-3 text-[13px] text-[#0f172a] outline-none focus:border-[#612BD3]"
              >
                <option value="">
                  {t('select_campaign', 'Select a campaign')}
                </option>
                {campaigns.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
                <option value="__custom">
                  {t('custom_campaign', 'Custom campaign')}
                </option>
              </select>
            )}
            {(campaigns.length === 0 || showCustom) && (
              <input
                value={linkTracking.campaign}
                placeholder={t('utm_campaign_placeholder', 'spring-launch')}
                onChange={(event) =>
                  setLinkTracking({ campaign: event.target.value })
                }
                className={clsx(
                  'h-9 w-full rounded-lg border border-[#e6e8ee] bg-white px-3 text-[13px] text-[#0f172a] outline-none focus:border-[#612BD3]',
                  campaigns.length > 0 && 'mt-2'
                )}
              />
            )}
          </label>
          <p className="text-[12px] leading-5 text-slate-500">
            {t(
              'utm_source_automatic',
              'Source is filled from each selected platform. The link is added when you save or schedule.'
            )}
          </p>
          {!!linkTracking.url && rows.length > 0 && (
            <div className="flex flex-col gap-2">
              {rows.map((row) => (
                <div key={row.id} className="min-w-0">
                  <div className="text-[12px] font-medium text-[#0f172a]">
                    {row.name}
                  </div>
                  <div className="break-all text-[12px] leading-5 text-slate-500">
                    {row.href ||
                      t('utm_preview_empty', 'Enter a valid website link.')}
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => setCustomise((value) => !value)}
            className="self-start text-[12px] font-medium text-[#612BD3]"
          >
            {customise
              ? t('utm_hide_custom', 'Hide custom fields')
              : t('utm_customise', 'Customise tracking')}
          </button>
          {customise && (
            <div className="flex flex-col gap-2.5">
              <Field
                label={t('utm_source_override', 'Source override')}
                value={linkTracking.sourceOverride}
                placeholder={t(
                  'utm_source_blank',
                  'Leave blank to use each platform'
                )}
                onChange={(sourceOverride) => setLinkTracking({ sourceOverride })}
              />
              <Field
                label={t('utm_medium', 'Medium')}
                value={linkTracking.medium}
                placeholder="social"
                onChange={(medium) => setLinkTracking({ medium })}
              />
              <Field
                label={t('utm_term', 'Term')}
                value={linkTracking.term}
                onChange={(term) => setLinkTracking({ term })}
              />
              <Field
                label={t('utm_content', 'Content')}
                value={linkTracking.content}
                onChange={(content) => setLinkTracking({ content })}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
