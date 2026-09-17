'use client';

import { useCallback } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import useSWR from 'swr';

export type UserOrganization = {
  id: string;
  name: string;
};

export const useOrganizations = () => {
  const fetch = useFetch();

  const load = useCallback(async () => {
    return (await (await fetch('/user/organizations')).json()) as UserOrganization[];
  }, [fetch]);

  return useSWR<UserOrganization[]>('organizations', load, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    revalidateOnReconnect: false,
  });
};
