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
import {
  AppPage,
  PageHeader,
  Card,
  PrimaryButton,
  Icon,
  ICONS,
  Chip,
  SearchInput,
  FilterSelect,
  Table,
  Th,
  Td,
  EmptyState,
  PlatformIcon,
} from '@gitroom/frontend/components/harlo-pages/ui';

dayjs.extend(relativeTime);

const WS_BADGE_COLORS = [
  'bg-violet-600',
  'bg-blue-600',
  'bg-pink-500',
  'bg-emerald-600',
  'bg-slate-800',
  'bg-orange-500',
  'bg-sky-600',
];

const wsInitials = (value?: string) =>
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

  const workspaceOptions = useMemo(
    () => [
      { value: 'current', label: `Current: ${workspaceName}` },
      ...(organizations || [])
        .filter((org: { id: string }) => org.id !== user?.orgId)
        .map((org: { id: string; name: string }) => ({
          value: org.id,
          label: `Switch to ${org.name}`,
        })),
    ],
    [organizations, user?.orgId, workspaceName]
  );

  const hasLastSynced = useMemo(
    () => connectedList.some((account) => !!account.updatedAt),
    [connectedList]
  );

  return (
    <AppPage>
      <PageHeader
        eyebrow="Social Accounts"
        title="Connect and manage your social accounts."
        subtitle="Add, remove or manage the social media accounts for your workspaces. Connect multiple accounts to publish, analyse and collaborate from one place."
      >
        <PrimaryButton onClick={connectAccount}>
          <Icon path={ICONS.plus} className="h-4 w-4" />
          Connect Account
        </PrimaryButton>
      </PageHeader>

      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0">
          <PlatformChip
            active={platformFilter === 'all'}
            onClick={() => setPlatformFilter('all')}
            label="All"
            count={platformCounts.all || 0}
          />
          {SOCIAL_ACCOUNT_FILTERS.map((family) => (
            <PlatformChip
              key={family}
              active={platformFilter === family}
              onClick={() => setPlatformFilter(family)}
              label={PLATFORM_LABELS[family]}
              count={platformCounts[family] || 0}
              identifier={family}
            />
          ))}
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <SearchInput
            placeholder="Search accounts..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-full sm:w-56"
          />
          <FilterSelect
            value={workspaceFilter}
            options={workspaceOptions}
            onChange={(value) => changeWorkspace(value)}
            className="w-full sm:w-[200px]"
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        {!isLoading && groupedAccounts.length === 0 ? (
          <EmptyState
            icon={ICONS.link}
            title="No social accounts connected yet"
            description="Connect a channel to start publishing from this workspace."
          >
            <PrimaryButton onClick={connectAccount}>
              <Icon path={ICONS.plus} className="h-4 w-4" />
              Connect Account
            </PrimaryButton>
          </EmptyState>
        ) : (
          <Table>
            <thead>
              <tr className="border-b border-slate-100">
                <Th>Account</Th>
                <Th>Platform</Th>
                <Th>Workspace</Th>
                <Th>Status</Th>
                {hasLastSynced ? <Th>Last synced</Th> : null}
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && (
                <tr>
                  <Td
                    colSpan={hasLastSynced ? 6 : 5}
                    className="py-16 text-center text-slate-400"
                  >
                    Loading connected accounts…
                  </Td>
                </tr>
              )}
              {groupedAccounts.map(([groupName, accounts], groupIndex) => (
                <React.Fragment key={groupName}>
                  <tr className="bg-slate-50/80">
                    <td
                      colSpan={hasLastSynced ? 6 : 5}
                      className="px-5 py-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={clsx(
                            'flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white',
                            WS_BADGE_COLORS[
                              groupIndex % WS_BADGE_COLORS.length
                            ]
                          )}
                        >
                          {wsInitials(groupName)}
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
                    const needsRefresh = !!account.refreshNeeded;
                    const setupRequired = !!account.inBetweenSteps;
                    const isDisabled = !needsRefresh && !setupRequired && !!account.disabled;
                    return (
                      <tr
                        key={account.id}
                        className="hover:bg-slate-50"
                      >
                        <Td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {account.picture ? (
                              <img
                                src={account.picture}
                                alt=""
                                className="h-9 w-9 rounded-full object-cover"
                              />
                            ) : (
                              <div
                                className={clsx(
                                  'flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white',
                                  WS_BADGE_COLORS[index % WS_BADGE_COLORS.length]
                                )}
                              >
                                {wsInitials(account.name)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-slate-900">
                                {accountHandle(account)}
                              </div>
                              <div className="text-xs text-slate-400">
                                {kind || account.name}
                              </div>
                            </div>
                          </div>
                        </Td>
                        <Td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <PlatformIcon
                              identifier={account.identifier}
                              className="h-5 w-5"
                            />
                            <span className="text-sm text-slate-700">
                              {PLATFORM_LABELS[family] || family}
                            </span>
                          </div>
                        </Td>
                        <Td className="px-5 py-3.5">
                          <Chip tone="blue">{groupName}</Chip>
                        </Td>
                        <Td className="px-5 py-3.5">
                          <StatusBadge
                            needsRefresh={needsRefresh}
                            setupRequired={setupRequired}
                            disabled={isDisabled}
                          />
                        </Td>
                        {hasLastSynced ? (
                          <Td className="px-5 py-3.5 text-slate-500">
                            {account.updatedAt
                              ? dayjs(account.updatedAt).fromNow()
                              : '—'}
                          </Td>
                        ) : null}
                        <Td className="px-5 py-3.5 text-right">
                          <AccountActions
                            open={openMenuId === account.id}
                            onToggle={() =>
                              setOpenMenuId(
                                openMenuId === account.id ? null : account.id
                              )
                            }
                            onClose={() => setOpenMenuId(null)}
                            onReconnect={
                              needsRefresh
                                ? () =>
                                    startOAuth(
                                      account.identifier,
                                      account.internalId
                                    )
                                : undefined
                            }
                            onContinue={
                              setupRequired
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
                        </Td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </AppPage>
  );
};

const PlatformChip = ({
  active,
  onClick,
  label,
  count,
  identifier,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  identifier?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx(
      'inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-colors',
      active
        ? 'border border-slate-200 bg-white font-semibold text-slate-900 shadow-sm'
        : 'border border-transparent text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
    )}
  >
    {identifier ? (
      <PlatformIcon identifier={identifier} className="h-4 w-4" />
    ) : null}
    {label}
    <span
      className={clsx(
        'inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold',
        active
          ? 'bg-slate-100 text-slate-600'
          : 'bg-slate-100 text-slate-400'
      )}
    >
      {count}
    </span>
  </button>
);

const StatusBadge = ({
  needsRefresh,
  setupRequired,
  disabled,
}: {
  needsRefresh: boolean;
  setupRequired: boolean;
  disabled: boolean;
}) => {
  if (needsRefresh) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-rose-600">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
        Needs refresh
      </span>
    );
  }
  if (setupRequired) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-amber-600">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Setup required
      </span>
    );
  }
  if (disabled) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
        Disabled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      Connected
    </span>
  );
};

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
        type="button"
        onClick={onToggle}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        aria-label="Account actions"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-20 w-40 rounded-xl border border-slate-200 bg-white py-1 text-left shadow-lg">
          {onReconnect && (
            <button
              type="button"
              className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
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
              type="button"
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
            type="button"
            className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
            onClick={() => {
              onClose();
              onToggleEnabled();
            }}
          >
            {enabled ? 'Disable' : 'Enable'}
          </button>
          <button
            type="button"
            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
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
