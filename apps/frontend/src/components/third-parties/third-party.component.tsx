'use client';

import React, { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import clsx from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useClickAway } from '@uidotdev/usehooks';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useRouter } from 'next/navigation';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { deleteDialog } from '@gitroom/react/helpers/delete.dialog';
import { useUser } from '@gitroom/frontend/components/layout/user.context';
import { useOrganizations } from '@gitroom/frontend/components/layout/use.organizations';
import { useAddProvider } from '@gitroom/frontend/components/launches/add.provider.component';
import {
  PLATFORM_LABELS,
  SOCIAL_ACCOUNT_FILTERS,
  channelKindLabel,
  platformFamily,
} from '@gitroom/frontend/components/launches/helpers/mvp.platforms';

dayjs.extend(relativeTime);

const AVATAR_COLORS = [
  'bg-violet-600',
  'bg-blue-600',
  'bg-pink-500',
  'bg-emerald-600',
  'bg-slate-800',
  'bg-orange-500',
  'bg-sky-600',
];

const platformIcon = (identifier?: string) => {
  const family = platformFamily(identifier);
  if (family === 'youtube') {
    return '/icons/platforms/youtube.svg';
  }
  return `/icons/platforms/${identifier || family}.png`;
};

const initials = (value?: string) =>
  (value || 'A')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'A';

const accountHandle = (account: any) => {
  const display = String(account.display || account.profile || '').trim();
  if (display) {
    return display.startsWith('@') ? display : `@${display.replace(/^@/, '')}`;
  }
  return account.name || 'Account';
};

export const ThirdPartyComponent = () => {
  const fetch = useFetch();
  const router = useRouter();
  const toaster = useToaster();
  const user = useUser();
  const { data: organizations } = useOrganizations();
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [workspaceFilter, setWorkspaceFilter] = useState('current');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const loadIntegrations = useCallback(async () => {
    try {
      const res = await (await fetch('/integrations/list')).json();
      return (res.integrations || []) as any[];
    } catch {
      return [];
    }
  }, [fetch]);

  const {
    data: connectedIntegrations,
    isLoading,
    mutate,
  } = useSWR('connections-list', loadIntegrations, { revalidateOnFocus: true });

  const connectAccount = useAddProvider(() => mutate());
  const connectedList = connectedIntegrations || [];
  const workspaceName = user?.orgName || 'Workspace';

  const handleDisconnect = useCallback(
    async (id: string, name: string) => {
      if (
        !(await deleteDialog(`Are you sure you want to disconnect ${name}?`))
      ) {
        return;
      }
      try {
        const res = await fetch('/integrations', {
          method: 'DELETE',
          body: JSON.stringify({ id }),
        });
        if (res.ok || res.status === 200) {
          toaster.show(`${name} disconnected successfully`, 'success');
          mutate();
        } else {
          toaster.show(`Failed to disconnect ${name}`, 'warning');
        }
      } catch {
        toaster.show(`Error disconnecting ${name}`, 'warning');
      }
    },
    [fetch, toaster, mutate]
  );

  const startOAuth = useCallback(
    async (identifier: string, refresh?: string) => {
      const params = refresh ? `?refresh=${encodeURIComponent(refresh)}` : '';
      const oauthRes = await fetch(
        `/integrations/social/${identifier}${params}`
      );
      const data = await oauthRes.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      toaster.show(`Could not reconnect ${identifier}`, 'warning');
    },
    [fetch, toaster]
  );

  const setAccountEnabled = useCallback(
    async (id: string, enabled: boolean) => {
      const response = await fetch(
        `/integrations/${enabled ? 'enable' : 'disable'}`,
        {
          method: 'POST',
          body: JSON.stringify({ id }),
        }
      );
      if (!response.ok) {
        toaster.show(
          `Could not ${enabled ? 'enable' : 'disable'} this account`,
          'warning'
        );
        return;
      }
      toaster.show(`Account ${enabled ? 'enabled' : 'disabled'}`, 'success');
      await mutate();
    },
    [fetch, mutate, toaster]
  );

  const changeWorkspace = useCallback(
    async (id: string) => {
      if (!id || id === 'current' || id === user?.orgId) {
        setWorkspaceFilter('current');
        return;
      }
      await fetch('/user/change-org', {
        method: 'POST',
        body: JSON.stringify({ id }),
      });
      window.location.reload();
    },
    [fetch, user?.orgId]
  );

  const platformCounts = useMemo(() => {
    const counts: Record<string, number> = { all: connectedList.length };
    for (const account of connectedList) {
      const family = platformFamily(account.identifier);
      counts[family] = (counts[family] || 0) + 1;
    }
    return counts;
  }, [connectedList]);

  const filteredAccounts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return connectedList.filter((account) => {
      const family = platformFamily(account.identifier);
      const matchesPlatform =
        platformFilter === 'all' || family === platformFilter;
      const haystack = [
        account.name,
        account.display,
        account.identifier,
        PLATFORM_LABELS[family] || family,
        channelKindLabel(account.identifier),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return matchesPlatform && (!query || haystack.includes(query));
    });
  }, [connectedList, platformFilter, searchQuery]);

  const groupedAccounts = useMemo(() => {
    return filteredAccounts.length
      ? ([[workspaceName, filteredAccounts]] as Array<[string, any[]]>)
      : [];
  }, [filteredAccounts, workspaceName]);

  return (
    <div className="w-full min-h-full px-6 py-8 md:px-8 font-sans">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-400 mb-1">
            Social Accounts
          </p>
          <h1 className="text-[28px] leading-tight font-bold text-slate-900">
            Connect and manage your social accounts.
          </h1>
          <p className="text-sm text-slate-500 mt-2 max-w-2xl">
            Add, remove or manage the social accounts for your workspaces.
            Connect multiple accounts to publish, analyse and collaborate from
            one place.
          </p>
        </div>
        <button
          onClick={connectAccount}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shrink-0"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Connect Account
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0">
            <FilterChip
              active={platformFilter === 'all'}
              onClick={() => setPlatformFilter('all')}
              label="All"
              count={platformCounts.all || 0}
            />
            {SOCIAL_ACCOUNT_FILTERS.map((family) => (
              <FilterChip
                key={family}
                active={platformFilter === family}
                onClick={() => setPlatformFilter(family)}
                label={PLATFORM_LABELS[family]}
                count={platformCounts[family] || 0}
                icon={platformIcon(family === 'x' ? 'x' : family)}
              />
            ))}
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-56">
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full bg-white border border-slate-200 text-sm text-slate-700 pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
            <select
              value={workspaceFilter}
              onChange={(event) => {
                const value = event.target.value;
                if (value === 'current') {
                  setWorkspaceFilter('current');
                  return;
                }
                changeWorkspace(value);
              }}
              className="min-w-[160px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none"
            >
              <option value="current">Current: {workspaceName}</option>
              {(organizations || [])
                .filter((org: { id: string }) => org.id !== user?.orgId)
                .map((org: { id: string; name: string }) => (
                  <option key={org.id} value={org.id}>
                    Switch to {org.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] text-left">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 border-b border-slate-100">
                <th className="px-5 py-3 font-semibold">Account</th>
                <th className="px-5 py-3 font-semibold">Platform</th>
                <th className="px-5 py-3 font-semibold">Workspace</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Last synced</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-16 text-center text-sm text-slate-400"
                  >
                    Loading connected accounts…
                  </td>
                </tr>
              )}
              {!isLoading && groupedAccounts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="text-sm font-semibold text-slate-900 mb-1">
                      No social accounts connected yet
                    </div>
                    <p className="text-sm text-slate-500 mb-4">
                      Connect a channel to start publishing from this workspace.
                    </p>
                    <button
                      onClick={connectAccount}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl"
                    >
                      + Connect Account
                    </button>
                  </td>
                </tr>
              )}
              {groupedAccounts.map(([groupName, accounts]) => (
                <React.Fragment key={groupName}>
                  <tr className="bg-slate-50/80">
                    <td colSpan={6} className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={clsx(
                            'w-7 h-7 rounded-full text-white text-[11px] font-bold flex items-center justify-center',
                            AVATAR_COLORS[
                              groupName.length % AVATAR_COLORS.length
                            ]
                          )}
                        >
                          {initials(groupName)}
                        </div>
                        <div className="text-sm font-semibold text-slate-900">
                          {groupName}
                        </div>
                        <div className="text-xs text-slate-400">
                          ({accounts.length})
                        </div>
                      </div>
                    </td>
                  </tr>
                  {accounts.map((account: any, index: number) => {
                    const family = platformFamily(account.identifier);
                    const kind = channelKindLabel(account.identifier);
                    const status = account.refreshNeeded
                      ? 'Reconnect'
                      : account.inBetweenSteps
                      ? 'Setup required'
                      : account.disabled
                      ? 'Disabled'
                      : 'Connected';
                    return (
                      <tr
                        key={account.id}
                        className="border-b border-slate-100 last:border-b-0"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {account.picture ? (
                              <img
                                src={account.picture}
                                alt=""
                                className="w-9 h-9 rounded-full object-cover"
                              />
                            ) : (
                              <div
                                className={clsx(
                                  'w-9 h-9 rounded-full text-white text-xs font-bold flex items-center justify-center',
                                  AVATAR_COLORS[index % AVATAR_COLORS.length]
                                )}
                              >
                                {initials(account.name)}
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-semibold text-slate-900">
                                {accountHandle(account)}
                              </div>
                              <div className="text-xs text-slate-400">
                                {kind || account.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <img
                              src={platformIcon(account.identifier)}
                              alt=""
                              className="w-5 h-5 rounded-sm object-contain"
                            />
                            <span className="text-sm text-slate-700">
                              {PLATFORM_LABELS[family] || family}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                            {groupName}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={clsx(
                              'inline-flex items-center gap-1.5 text-sm',
                              status === 'Connected'
                                ? 'text-emerald-600'
                                : status === 'Disabled'
                                ? 'text-slate-500'
                                : 'text-amber-600'
                            )}
                          >
                            <span
                              className={clsx(
                                'w-1.5 h-1.5 rounded-full',
                                status === 'Connected'
                                  ? 'bg-emerald-500'
                                  : status === 'Disabled'
                                  ? 'bg-slate-400'
                                  : 'bg-amber-500'
                              )}
                            />
                            {status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-slate-500">
                          {account.updatedAt
                            ? dayjs(account.updatedAt).fromNow()
                            : '—'}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <AccountActions
                            open={openMenuId === account.id}
                            onToggle={() =>
                              setOpenMenuId(
                                openMenuId === account.id ? null : account.id
                              )
                            }
                            onClose={() => setOpenMenuId(null)}
                            onReconnect={
                              account.refreshNeeded
                                ? () =>
                                    startOAuth(
                                      account.identifier,
                                      account.internalId
                                    )
                                : undefined
                            }
                            onContinue={
                              account.inBetweenSteps
                                ? () =>
                                    router.push(
                                      `/launches?added=${account.identifier}&continue=${account.id}`
                                    )
                                : undefined
                            }
                            enabled={!account.disabled}
                            onToggleEnabled={() =>
                              setAccountEnabled(account.id, account.disabled)
                            }
                            onDisconnect={() =>
                              handleDisconnect(account.id, account.name)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const FilterChip = ({
  active,
  onClick,
  label,
  count,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  icon?: string;
}) => (
  <button
    onClick={onClick}
    className={clsx(
      'inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm border transition-colors',
      active
        ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold'
        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
    )}
  >
    {icon && <img src={icon} alt="" className="w-3.5 h-3.5 object-contain" />}
    {label}
    <span
      className={clsx('text-xs', active ? 'text-blue-500' : 'text-slate-400')}
    >
      {count}
    </span>
  </button>
);

const AccountActions = ({
  open,
  onToggle,
  onClose,
  onReconnect,
  onContinue,
  enabled,
  onToggleEnabled,
  onDisconnect,
}: {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onReconnect?: () => void;
  onContinue?: () => void;
  enabled: boolean;
  onToggleEnabled: () => void;
  onDisconnect: () => void;
}) => {
  const ref = useClickAway<HTMLDivElement>(() => {
    if (open) {
      onClose();
    }
  });

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={onToggle}
        className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 inline-flex items-center justify-center"
        aria-label="Account actions"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-20 w-40 bg-white border border-slate-200 rounded-xl shadow-lg py-1 text-left">
          {onReconnect && (
            <button
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              onClick={() => {
                onClose();
                onReconnect();
              }}
            >
              Reconnect
            </button>
          )}
          {onContinue && (
            <button
              className="w-full px-3 py-2 text-left text-sm text-blue-600 hover:bg-blue-50"
              onClick={() => {
                onClose();
                onContinue();
              }}
            >
              Complete setup
            </button>
          )}
          <button
            className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
            onClick={() => {
              onClose();
              onToggleEnabled();
            }}
          >
            {enabled ? 'Disable' : 'Enable'}
          </button>
          <button
            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            onClick={() => {
              onClose();
              onDisconnect();
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};
