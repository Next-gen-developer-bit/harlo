'use client';

import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';

export interface PostAnalyticsPoint {
  total: string | number;
  date: string;
}

export interface PostAnalyticsSeries {
  label: string;
  data: PostAnalyticsPoint[];
  percentageChange: number;
}

export interface PostAnalyticsTotals {
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  engagements: number;
}

const sumSeries = (data?: PostAnalyticsPoint[]) =>
  (data || []).reduce((acc, curr) => acc + Number(curr.total || 0), 0);

export const totalsFromAnalytics = (
  analytics: PostAnalyticsSeries[] | undefined
): PostAnalyticsTotals => {
  const empty = {
    impressions: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    engagements: 0,
  };
  if (!Array.isArray(analytics)) {
    return empty;
  }

  const pick = (labels: string[]) => {
    for (const label of labels) {
      const row = analytics.find(
        (item) => item.label.toLowerCase() === label.toLowerCase()
      );
      if (row) {
        return sumSeries(row.data);
      }
    }
    return 0;
  };

  const likes = pick(['Likes', 'Reactions']);
  const comments = pick(['Comments', 'Replies']);
  const shares = pick(['Shares', 'Reposts', 'Retweets']);

  return {
    impressions: pick(['Impressions', 'Views', 'Reach', 'Unique Impressions']),
    likes,
    comments,
    shares,
    engagements: likes + comments + shares,
  };
};

export const usePostAnalytics = (postId?: string) => {
  const fetch = useFetch();

  const load = useCallback(async () => {
    if (!postId) {
      return [] as PostAnalyticsSeries[];
    }
    return (await (await fetch(`/analytics/post/${postId}?date=7`)).json()) as
      | PostAnalyticsSeries[]
      | { missing: true };
  }, [fetch, postId]);

  const { data, isLoading, error } = useSWR(
    postId ? `/analytics/post/${postId}?date=7` : null,
    load,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const totals = useMemo(
    () => totalsFromAnalytics(Array.isArray(data) ? data : undefined),
    [data]
  );

  return { data, isLoading, error, totals };
};
