'use client';

import React, { useState, useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { deleteDialog } from '@gitroom/react/helpers/delete.dialog';
import clsx from 'clsx';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { ApiModal } from '@gitroom/frontend/components/third-parties/third-party.list.component';
import {
  MVP_PLATFORM_FAMILIES,
  channelKindLabel,
} from '@gitroom/frontend/components/launches/helpers/mvp.platforms';

interface MVPPlatformDef {
  identifier: string;
  name: string;
  description: string;
  iconBg: string;
  textColor: string;
  iconText: string;
}

const MVP_PLATFORMS: MVPPlatformDef[] = [
  {
    identifier: 'instagram',
    name: 'Instagram',
    description: 'Connect eligible personal and professional account types using official Meta access.',
    iconBg: 'bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600',
    textColor: 'text-white',
    iconText: 'IG',
  },
  {
    identifier: 'facebook',
    name: 'Facebook',
    description: 'Connect eligible personal/professional profiles and Business Pages where official access permits.',
    iconBg: 'bg-blue-600',
    textColor: 'text-white',
    iconText: 'FB',
  },
  {
    identifier: 'linkedin',
    name: 'LinkedIn',
    description:
      'Profile and company page are separate. Connect a personal profile to post as yourself, then connect a company page you admin.',
    iconBg: 'bg-blue-700',
    textColor: 'text-white',
    iconText: 'in',
  },
  {
    identifier: 'tiktok',
    name: 'TikTok',
    description: 'Connect eligible personal and business accounts.',
    iconBg: 'bg-slate-900',
    textColor: 'text-white',
    iconText: 'TT',
  },
  {
    identifier: 'youtube',
    name: 'YouTube',
    description: 'Connect YouTube channels.',
    iconBg: 'bg-red-600',
    textColor: 'text-white',
    iconText: 'YT',
  },
  {
    identifier: 'threads',
    name: 'Threads',
    description: 'Connect eligible Threads profiles.',
    iconBg: 'bg-slate-900',
    textColor: 'text-white',
    iconText: '@',
  },
  {
    identifier: 'pinterest',
    name: 'Pinterest',
    description: 'Connect eligible personal and business accounts and available boards.',
    iconBg: 'bg-red-700',
    textColor: 'text-white',
    iconText: 'P',
  },
  {
    identifier: 'x',
    name: 'X',
    description: 'Connect your X (Twitter) account to schedule and publish posts.',
    iconBg: 'bg-black',
    textColor: 'text-white',
    iconText: 'X',
  },
];

export const ThirdPartyComponent = () => {
  const fetch = useFetch();
  const toaster = useToaster();
  const modals = useModals();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'connected' | 'unconnected'>('all');

  // Load connected channels / integrations
  const loadIntegrations = useCallback(async () => {
    try {
      const res = await (await fetch('/integrations/list')).json();
      return (res.integrations || []) as any[];
    } catch {
      return [];
    }
  }, [fetch]);

  const { data: connectedIntegrations, mutate } = useSWR('connections-list', loadIntegrations, {
    revalidateOnFocus: true,
  });

  const connectedList = connectedIntegrations || [];

  // Handle disconnect / delete channel
  const handleDisconnect = useCallback(
    async (id: string, name: string) => {
      if (!(await deleteDialog(`Are you sure you want to disconnect ${name}?`))) {
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
          toaster.show(`Failed to disconnect ${name}`, 'error');
        }
      } catch {
        toaster.show(`Error disconnecting ${name}`, 'error');
      }
    },
    [fetch, toaster, mutate]
  );

  const startOAuth = useCallback(
    async (identifier: string, refresh?: string) => {
      const params = refresh ? `?refresh=${encodeURIComponent(refresh)}` : '';
      const oauthRes = await fetch(`/integrations/social/${identifier}${params}`);
      const data = await oauthRes.json();
      if (data?.url) {
        window.location.href = data.url;
        return true;
      }
      if (data?.err) {
        toaster.show(`Could not connect ${identifier}`, 'error');
        return true;
      }
      return false;
    },
    [fetch, toaster]
  );

  const handleConnect = useCallback(
    async (
      identifier: string,
      title: string,
      refreshInternalId?: string
    ) => {
      try {
        const started = await startOAuth(identifier, refreshInternalId);
        if (started) {
          return;
        }

        modals.openModal({
          title: `Connect ${title}`,
          withCloseButton: true,
          children: (
            <ApiModal
              identifier={identifier}
              title={title}
              update={() => mutate()}
            />
          ),
        });
      } catch {
        toaster.show(`Unable to initialize connection for ${title}`, 'error');
      }
    },
    [startOAuth, modals, mutate, toaster]
  );

  // Map MVP platforms with their connected account data if present
  const platformRows = useMemo(() => {
    return MVP_PLATFORMS.map((platform) => {
      const connectedItems = connectedList.filter((c: any) => {
        const family = MVP_PLATFORM_FAMILIES[platform.identifier] || [
          platform.identifier,
        ];
        return family.includes(c.identifier);
      });

      return {
        ...platform,
        isConnected: connectedItems.length > 0,
        connectedAccounts: connectedItems,
      };
    });
  }, [connectedList]);

  // Filter rows based on search query and status filter
  const filteredRows = useMemo(() => {
    return platformRows.filter((row) => {
      const matchesSearch =
        row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'connected'
          ? row.isConnected
          : !row.isConnected;

      return matchesSearch && matchesStatus;
    });
  }, [platformRows, searchQuery, statusFilter]);

  const totalConnectedCount = useMemo(
    () => platformRows.filter((r) => r.isConnected).length,
    [platformRows]
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6 md:p-8 font-sans min-h-screen">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Connections
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Connect and manage social media accounts for your workspace
        </p>
      </div>

      {/* ── Single Large White Card Container (Section 3.9) ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 md:p-8">
        
        {/* Top Controls: Search & Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
          <div className="relative w-full sm:w-80">
            <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search platforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-700 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-slate-500 font-medium">
              {totalConnectedCount} of {MVP_PLATFORMS.length} platforms connected
            </span>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 px-3 py-2 rounded-xl focus:outline-none"
            >
              <option value="all">All Platforms</option>
              <option value="connected">Connected</option>
              <option value="unconnected">Not Connected</option>
            </select>
          </div>
        </div>

        {/* ── MVP Platforms Rows List ── */}
        <div className="divide-y divide-slate-100">
          {filteredRows.map((platform) => (
            <div
              key={platform.identifier}
              className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
            >
              {/* Platform Info */}
              <div className="flex items-start gap-4">
                <div className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-sm', platform.iconBg, platform.textColor)}>
                  {platform.iconText}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{platform.name}</h3>
                    {platform.isConnected && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        Connected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1 max-w-xl">
                    {platform.description}
                  </p>

                  {/* Connected Accounts Sub-Row */}
                  {platform.isConnected && platform.connectedAccounts.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {platform.connectedAccounts.map((account: any) => (
                        <div key={account.id} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 w-fit">
                          <img
                            src={account.picture || '/no-picture.jpg'}
                            alt={account.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-800">{account.name}</div>
                            <div className="text-[10px] text-slate-400">
                              {[
                                channelKindLabel(account.identifier),
                                account.refreshNeeded
                                  ? 'Reconnection required'
                                  : account.disabled
                                  ? 'Disabled'
                                  : 'Connected',
                              ]
                                .filter(Boolean)
                                .join(' · ')}
                            </div>
                          </div>
                          {account.refreshNeeded && (
                            <button
                              onClick={() =>
                                handleConnect(
                                  account.identifier || platform.identifier,
                                  account.name,
                                  account.internalId
                                )
                              }
                              className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 py-1 hover:bg-blue-50 rounded-lg"
                            >
                              Reconnect
                            </button>
                          )}
                          <button
                            onClick={() => handleDisconnect(account.id, account.name)}
                            className="text-xs text-red-500 hover:text-red-700 font-semibold ml-1 px-2 py-1 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            Disconnect
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button: Connect / Reconnect */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0 flex-wrap justify-end">
                {platform.identifier === 'linkedin' ? (
                  <>
                    <button
                      onClick={() =>
                        handleConnect('linkedin', 'LinkedIn Profile')
                      }
                      className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm"
                    >
                      Connect profile
                    </button>
                    <button
                      onClick={() =>
                        handleConnect('linkedin-page', 'LinkedIn Page')
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm"
                    >
                      Connect company page
                    </button>
                  </>
                ) : platform.isConnected ? (
                  <button
                    onClick={() => handleConnect(platform.identifier, platform.name)}
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm"
                  >
                    Connect another
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(platform.identifier, platform.name)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredRows.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs">
              No matching platforms found for "{searchQuery}".
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
