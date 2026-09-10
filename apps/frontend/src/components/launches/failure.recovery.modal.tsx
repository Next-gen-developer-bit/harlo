'use client';

import React, { FC, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { readablePostError } from '@gitroom/helpers/utils/publish.error';

const classifyPublishError = (
  error?: string | null,
  needsReconnect?: boolean
) => {
  if (needsReconnect) {
    return 'This account connection expired. Reconnect the account, then retry only this destination.';
  }

  const message = (error || '').toLowerCase();
  if (
    message.includes('token') ||
    message.includes('oauth') ||
    message.includes('unauthorized') ||
    message.includes('expired') ||
    message.includes('reconnect')
  ) {
    return 'The social connection is no longer valid. Reconnect the account, then retry this destination.';
  }

  if (
    message.includes('format') ||
    message.includes('media') ||
    message.includes('video') ||
    message.includes('image') ||
    message.includes('aspect') ||
    message.includes('duration') ||
    message.includes('unsupported')
  ) {
    return 'The media or format is not supported for this platform. Replace the media, then retry this destination.';
  }

  return (
    error ||
    'The platform rejected this post. Edit the content if needed, then retry only this destination.'
  );
};

export const FailureRecoveryModal: FC<{
  postId: string;
  platformName: string;
  error?: string | null;
  needsReconnect?: boolean;
  onEdit: () => void;
  onRetried?: () => void;
  onClose: () => void;
}> = ({
  postId,
  platformName,
  error,
  needsReconnect,
  onEdit,
  onRetried,
  onClose,
}) => {
  const router = useRouter();
  const fetch = useFetch();
  const toaster = useToaster();
  const t = useT();
  const [retrying, setRetrying] = useState(false);
  const readableError = readablePostError(error);
  const explanation = classifyPublishError(readableError, needsReconnect);

  const retryDestination = useCallback(async () => {
    if (needsReconnect) {
      router.push('/third-party');
      return;
    }

    setRetrying(true);
    try {
      const response = await fetch(`/posts/${postId}/retry`, {
        method: 'POST',
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          body.message ||
            t('failed_to_retry_post', 'Could not retry this destination')
        );
      }

      toaster.show(
        t(
          'retrying_failed_destination',
          'Retrying this destination only. Other accounts were not republished.'
        )
      );
      onRetried?.();
      onClose();
    } catch (err) {
      toaster.show(
        err instanceof Error
          ? err.message
          : t('failed_to_retry_post', 'Could not retry this destination'),
        'warning'
      );
    } finally {
      setRetrying(false);
    }
  }, [
    fetch,
    needsReconnect,
    onClose,
    onRetried,
    postId,
    router,
    t,
    toaster,
  ]);

  return (
    <div className="bg-white rounded-2xl p-6 text-left shadow-xl max-w-md w-full font-sans">
      <h2 className="text-lg font-bold text-slate-900 mb-2">Publishing failed</h2>
      <p className="text-sm text-slate-600 mb-4">
        {platformName} could not publish this destination. Successful
        destinations were not republished.
      </p>
      <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-slate-700 mb-5">
        {explanation}
      </div>
      {readableError && readableError !== explanation && (
        <div className="text-[11px] text-slate-400 mb-5 break-words">
          {readableError}
        </div>
      )}
      <div className="flex flex-col gap-2">
        {needsReconnect && (
          <button
            onClick={() => router.push('/third-party')}
            className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
          >
            Reconnect account
          </button>
        )}
        <button
          onClick={retryDestination}
          disabled={retrying || needsReconnect}
          className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {retrying
            ? t('retrying', 'Retrying…')
            : t('retry_this_account', 'Retry this account')}
        </button>
        <button
          onClick={onEdit}
          className="w-full px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
        >
          Edit content or replace media
        </button>
        <button
          onClick={onClose}
          className="w-full px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 rounded-xl border border-slate-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};
