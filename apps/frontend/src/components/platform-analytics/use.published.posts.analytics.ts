'use client';

import { useCallback } from 'react';
import useSWR from 'swr';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';

export interface PublishedPostAnalytics {
  id: string;
  content: string;
  publishDate: string;
  releaseURL?: string | null;
  state: string;
  image?: string | null;
  integration?: {
    id: string;
    name: string;
    picture?: string | null;
    providerIdentifier: string;
  } | null;
  impressions: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  engagements: number | null;
  available: boolean;
  reachLabel?: string;
  unavailableHint?: string;
  canImportStats?: boolean;
  importHint?: string;
  importUrl?: string;
}

export interface PublishedPostsChannelAnalytics {
  id: string;
  name: string;
  picture?: string | null;
  providerIdentifier: string;
  posts: number;
  impressions: number | null;
  engagements: number | null;
  reachLabel?: string;
}

export interface PublishedPostsAnalytics {
  posts: PublishedPostAnalytics[];
  totals: {
    impressions: number | null;
    engagements: number | null;
    likes: number | null;
    comments: number | null;
    shares: number | null;
    published: number;
  };
  channels: PublishedPostsChannelAnalytics[];
}

export const formatMetric = (value?: number | null) => {
  if (value === null || value === undefined) {
    return 'Not available';
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toLocaleString();
};

export type AnalyticsPeriod = 7 | 30 | 90;

export const usePublishedPostsAnalytics = (date: AnalyticsPeriod) => {
  const fetch = useFetch();

  const load = useCallback(
    async (path: string) => {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error('Failed to load analytics');
      }
      return (await response.json()) as PublishedPostsAnalytics;
    },
    [fetch]
  );

  return useSWR(`/analytics/posts?date=${date}`, load, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 60_000,
  });
};
