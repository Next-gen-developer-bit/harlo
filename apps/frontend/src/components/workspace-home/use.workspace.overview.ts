'use client';

import { useCallback } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import useSWR from 'swr';

export interface WorkspaceOverviewPost {
  id: string;
  content: string;
  publishDate: string;
  state: string;
  group: string;
  image?: string | null;
  error?: string | null;
  integration?: {
    id: string;
    providerIdentifier: string;
    name: string;
    picture?: string | null;
    refreshNeeded?: boolean;
  };
}

export interface WorkspaceOverview {
  drafts: number;
  scheduled: number;
  posted: number;
  failed: number;
  upcoming: WorkspaceOverviewPost[];
  failedPosts: WorkspaceOverviewPost[];
  weekPosts: WorkspaceOverviewPost[];
  dailyPosted: Array<{ date: string; count: number }>;
}

export const useWorkspaceOverview = () => {
  const fetch = useFetch();

  const load = useCallback(async (path: string) => {
    return (await (await fetch(path)).json()) as WorkspaceOverview;
  }, [fetch]);

  return useSWR('/posts/overview', load, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });
};
