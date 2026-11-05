'use client';

import {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { useShallow } from 'zustand/react/shallow';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { useToaster } from '@gitroom/react/toaster/toaster';
import {
  buildUtmUrl,
  defaultUtmParams,
  parseUtmUrl,
  UtmParams,
} from '@gitroom/helpers/utils/utm.link';
import { useLaunchStore } from '@gitroom/frontend/components/new-launch/store';
import { platformFamily } from '@gitroom/frontend/components/launches/helpers/mvp.platforms';

const readCurrentUrl = (editor: any) => {
  const link = editor?.getAttributes?.('link')?.href;
  if (typeof link === 'string' && link.trim()) {
    return link.trim();
  }
  const selection = editor?.state?.selection;
  if (!selection || !editor?.state?.doc) {
    return '';
  }
  const selected = editor.state.doc
    .textBetween(selection.from, selection.to, ' ')
    .trim();
  if (/^https?:\/\//i.test(selected)) {
    return selected;
  }
  return '';
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
    <span className="mb-1 block text-[12px] font-medium text-[#64748b]">
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

export const UtmBuilder: FC<{
  getEditor: () => any;
  editorType: 'none' | 'normal' | 'markdown' | 'html';
}> = ({ getEditor, editorType }) => {
  const t = useT();
  const toaster = useToaster();
  const { current, selectedIntegrations, tags } = useLaunchStore(
    useShallow((state) => ({
      current: state.current,
      selectedIntegrations: state.selectedIntegrations,
      tags: state.tags,
    }))
  );
  const [open, setOpen] = useState(false);
  const [showOptional, setShowOptional] = useState(false);
  const [base, setBase] = useState('');
  const [params, setParams] = useState<UtmParams>(defaultUtmParams('social'));
  const [error, setError] = useState('');
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const active = selectedIntegrations.find(
    (item) => item.integration.id === current
  );
  const severalChannels = !active && selectedIntegrations.length > 1;
  const family = platformFamily(active?.integration.identifier);
  const sourceDefault =
    severalChannels || !family || family === 'global' ? 'social' : family;
  const campaignDefault = tags[0]?.value || tags[0]?.label || '';

  const close = useCallback(() => setOpen(false), []);

  const openPanel = useCallback(() => {
    const existing = parseUtmUrl(readCurrentUrl(getEditor()));
    if (existing) {
      setBase(existing.base);
      setParams({
        ...defaultUtmParams(sourceDefault, campaignDefault),
        ...existing.params,
      });
      setShowOptional(!!(existing.params.term || existing.params.content));
    } else {
      setBase('');
      setParams(defaultUtmParams(sourceDefault, campaignDefault));
      setShowOptional(false);
    }
    setError('');
    setOpen(true);
  }, [campaignDefault, getEditor, sourceDefault]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) {
        return;
      }
      if (
        buttonRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }
      close();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [close, open]);

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) {
      setPosition(null);
      return;
    }
    const trigger = buttonRef.current.getBoundingClientRect();
    const width = 320;
    const height = panelRef.current?.offsetHeight || 420;
    const padding = 12;
    let left = trigger.left;
    left = Math.min(left, window.innerWidth - width - padding);
    left = Math.max(padding, left);
    let top = trigger.top - height - 8;
    if (top < padding) {
      top = Math.min(
        trigger.bottom + 8,
        window.innerHeight - height - padding
      );
    }
    setPosition({ top: Math.max(padding, top), left });
  }, [open, showOptional, base, params]);

  const preview = buildUtmUrl(base, params);

  const update = (field: keyof UtmParams) => (value: string) => {
    setParams((currentParams) => ({ ...currentParams, [field]: value }));
    setError('');
  };

  const insert = () => {
    const href = buildUtmUrl(base, params);
    const editor = getEditor();
    if (!href || !editor) {
      setError(
        t('utm_invalid_url', 'Enter a full website link, starting with https://')
      );
      return;
    }

    const existingLink = editor.getAttributes?.('link')?.href;
    const selection = editor.state?.selection;
    const selected = selection
      ? editor.state.doc.textBetween(selection.from, selection.to, ' ').trim()
      : '';
    const canLinkText =
      (editorType === 'html' || editorType === 'markdown') &&
      selected &&
      !/^https?:\/\//i.test(selected);

    if (existingLink && editor.chain) {
      editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
    } else if (canLinkText && editor.chain) {
      editor.chain().focus().setLink({ href }).run();
    } else if (editor.chain) {
      editor.chain().focus().insertContent(href).run();
    } else {
      editor.commands?.insertContent?.(href);
      editor.commands?.focus?.();
    }
    close();
  };

  const copy = async () => {
    const href = buildUtmUrl(base, params);
    if (!href) {
      setError(
        t('utm_invalid_url', 'Enter a full website link, starting with https://')
      );
      return;
    }
    try {
      await navigator.clipboard.writeText(href);
      toaster.show(t('utm_copied', 'Tracking link copied'), 'success');
    } catch {
      toaster.show(t('utm_copy_failed', 'Could not copy the link'), 'warning');
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (open ? close() : openPanel())}
        data-tooltip-id="tooltip"
        data-tooltip-content={t('utm_link', 'UTM link')}
        className={clsx(
          'flex h-8 shrink-0 cursor-pointer select-none items-center rounded-md border px-2 text-[12px] font-semibold',
          open
            ? 'border-[#612BD3] bg-[#f4f2fb] text-[#612BD3]'
            : 'border-[#e6e8ee] bg-white text-[#334155]'
        )}
      >
        UTM
      </button>
      {open &&
        createPortal(
          <div
            ref={panelRef}
            onClick={(event) => event.stopPropagation()}
            style={{
              position: 'fixed',
              top: position?.top ?? -9999,
              left: position?.left ?? -9999,
              visibility: position ? 'visible' : 'hidden',
            }}
            className="z-[5000] w-[320px] rounded-xl border border-[#e6e8ee] bg-white p-3 text-[#0f172a] shadow-lg"
          >
            <div className="mb-3 text-[13px] font-semibold">
              {t('utm_builder', 'Tracking link')}
            </div>
            {severalChannels && (
              <p className="mb-3 text-[12px] leading-5 text-[#64748b]">
                {t(
                  'utm_shared_post',
                  'This post is shared across channels, so source starts as social. Customise one channel to use its name.'
                )}
              </p>
            )}
            <div className="flex flex-col gap-2.5">
              <Field
                label={t('website_url', 'Website URL')}
                value={base}
                placeholder="https://example.com/page"
                onChange={(value) => {
                  setBase(value);
                  setError('');
                }}
              />
              <Field
                label={t('utm_source', 'Source')}
                value={params.source || ''}
                placeholder={sourceDefault}
                onChange={update('source')}
              />
              <Field
                label={t('utm_medium', 'Medium')}
                value={params.medium || ''}
                placeholder="social"
                onChange={update('medium')}
              />
              <Field
                label={t('utm_campaign', 'Campaign')}
                value={params.campaign || ''}
                placeholder={t('utm_campaign_placeholder', 'spring-launch')}
                onChange={update('campaign')}
              />
              <button
                type="button"
                onClick={() => setShowOptional((value) => !value)}
                className="self-start text-[12px] font-medium text-[#612BD3]"
              >
                {showOptional
                  ? t('utm_hide_optional', 'Hide term and content')
                  : t('utm_show_optional', 'Add term and content')}
              </button>
              {showOptional && (
                <>
                  <Field
                    label={t('utm_term', 'Term')}
                    value={params.term || ''}
                    onChange={update('term')}
                  />
                  <Field
                    label={t('utm_content', 'Content')}
                    value={params.content || ''}
                    onChange={update('content')}
                  />
                </>
              )}
            </div>
            <div className="mt-3 break-all rounded-lg bg-[#f8fafc] px-2.5 py-2 text-[12px] leading-5 text-[#334155]">
              {preview ||
                t('utm_preview_empty', 'The tracking link will show here.')}
            </div>
            {error && (
              <div className="mt-2 text-[12px] text-[#b42318]">{error}</div>
            )}
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={copy}
                className="h-9 flex-1 rounded-lg border border-[#e6e8ee] text-[13px] font-semibold text-[#334155]"
              >
                {t('copy', 'Copy')}
              </button>
              <button
                type="button"
                onClick={insert}
                className="h-9 flex-1 rounded-lg bg-[#612BD3] text-[13px] font-semibold text-white"
              >
                {t('insert_link', 'Insert link')}
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
