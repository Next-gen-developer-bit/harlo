'use client';

import copy from 'copy-to-clipboard';
import { useCallback } from 'react';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { useT } from '@gitroom/react/translation/get.transation.service.client';

export const CopyClient = () => {
  const toast = useToaster();
  const t = useT();
  const copyToClipboard = useCallback(() => {
    toast.show(
      t('link_copied_to_clipboard', 'Link copied to clipboard'),
      'success'
    );
    copy(window.location.href.split?.('?')?.shift()!);
  }, []);
  return (
    <button
      type="button"
      onClick={copyToClipboard}
      className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-slate-500"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
      {t('copy_link', 'Copy link')}
    </button>
  );
};
