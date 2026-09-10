'use client';

import React, { useCallback, useState } from 'react';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { Button } from '@gitroom/react/form/button';
import { PublishedPostAnalytics } from '@gitroom/frontend/components/platform-analytics/use.published.posts.analytics';

export const ImportStatsModal = ({
  post,
  onSaved,
}: {
  post: PublishedPostAnalytics;
  onSaved: () => void;
}) => {
  const modals = useModals();
  const toaster = useToaster();
  const fetch = useFetch();
  const [impressions, setImpressions] = useState(
    post.impressions === null || post.impressions === undefined
      ? ''
      : String(post.impressions)
  );
  const [likes, setLikes] = useState(
    post.likes === null || post.likes === undefined ? '' : String(post.likes)
  );
  const [comments, setComments] = useState(
    post.comments === null || post.comments === undefined
      ? ''
      : String(post.comments)
  );
  const [shares, setShares] = useState(
    post.shares === null || post.shares === undefined ? '' : String(post.shares)
  );
  const [loading, setLoading] = useState(false);
  const analyticsUrl = post.importUrl || post.releaseURL;

  const parseMetric = (value: string) => {
    if (value.trim() === '') {
      return undefined;
    }
    const numeric = Number(value);
    return Number.isFinite(numeric)
      ? Math.max(0, Math.round(numeric))
      : undefined;
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const body = {
        impressions: parseMetric(impressions),
        likes: parseMetric(likes),
        comments: parseMetric(comments),
        shares: parseMetric(shares),
      };
      if (
        [body.impressions, body.likes, body.comments, body.shares].every(
          (value) => value === undefined
        )
      ) {
        toaster.show('Enter at least one metric.', 'warning');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/analytics/posts/${post.id}/snapshot`, {
          method: 'POST',
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          throw new Error('Failed to save stats');
        }
        modals.closeAll();
        toaster.show('Stats saved.', 'success');
        onSaved();
      } catch {
        toaster.show('Could not save stats. Please try again.', 'warning');
      } finally {
        setLoading(false);
      }
    },
    [
      comments,
      fetch,
      impressions,
      likes,
      modals,
      onSaved,
      post.id,
      shares,
      toaster,
    ]
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[16px] w-[420px]">
      <p className="text-[14px] text-newTextColor">
        {post.importHint ||
          'Copy the stats from the platform analytics page and save them here.'}
      </p>

      <div className="flex flex-col gap-[8px] text-[14px]">
        {analyticsUrl ? (
          <a
            href={analyticsUrl}
            target="_blank"
            rel="noreferrer"
            className="font-[600] underline"
          >
            Open post analytics
          </a>
        ) : null}
        {post.releaseURL && post.releaseURL !== analyticsUrl ? (
          <a
            href={post.releaseURL}
            target="_blank"
            rel="noreferrer"
            className="font-[600] underline"
          >
            Open post
          </a>
        ) : null}
      </div>

      {(
        [
          ['Impressions', impressions, setImpressions],
          ['Reactions', likes, setLikes],
          ['Comments', comments, setComments],
          ['Reposts', shares, setShares],
        ] as Array<[string, string, (value: string) => void]>
      ).map(([label, value, setValue]) => (
        <label key={label} className="flex flex-col gap-[6px]">
          <span className="text-[14px]">{label}</span>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="h-[42px] bg-newBgColor border-newTableBorder border rounded-[8px] px-[16px] text-[14px] outline-none"
          />
        </label>
      ))}

      <div className="flex justify-end gap-[12px] pt-[8px]">
        <Button type="button" secondary onClick={() => modals.closeAll()}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Save stats
        </Button>
      </div>
    </form>
  );
};
