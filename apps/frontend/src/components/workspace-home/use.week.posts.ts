'use client';

import { useCallback } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import useSWR from 'swr';
import { expandPosts } from '@gitroom/helpers/utils/posts.list.minify';
import { newDayjs } from '@gitroom/frontend/components/layout/set.timezone';

export const useWeekPosts = (startDate: string, endDate: string) => {
  const fetch = useFetch();

  const load = useCallback(async (path: string) => {
    return expandPosts(await (await fetch(path)).json());
  }, [fetch]);

  const start = newDayjs(startDate).startOf('day').utc().format();
  const end = newDayjs(endDate).endOf('day').utc().format();

  return useSWR(
    `/posts?startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(
      end
    )}`,
    load,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );
};
