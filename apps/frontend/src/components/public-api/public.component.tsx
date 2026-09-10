'use client';

import React, { useState, useCallback } from 'react';
import useSWR from 'swr';
import { useUser } from '../layout/user.context';
import copy from 'copy-to-clipboard';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useRouter } from 'next/navigation';
import { Webhooks } from '@gitroom/frontend/components/webhooks/webhooks';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { deleteDialog } from '@gitroom/react/helpers/delete.dialog';

export const PublicComponent = () => {
  const user = useUser();
  const router = useRouter();
  const fetch = useFetch();
  const toaster = useToaster();
  const modals = useModals();

  const [newKeyRevealed, setNewKeyRevealed] = useState<string | null>(null);

  if (!user) return null;

  const isFree = user?.tier?.current === 'FREE' || !user?.tier?.public_api;

  // Load API Keys
  const loadKeys = useCallback(async () => {
    try {
      const res = await (await fetch('/user/approved-apps')).json();
      return (res || []) as any[];
    } catch {
      return [];
    }
  }, [fetch]);

  const { data: keysList, mutate } = useSWR('api-keys-list', loadKeys, {
    revalidateOnFocus: true,
  });

  const handleCreateKey = useCallback(async () => {
    try {
      const res = await fetch('/user/api-key', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        const generatedKey = data.key || 'ph_live_' + Math.random().toString(36).substring(2);
        setNewKeyRevealed(generatedKey);
        mutate();
      } else {
        toaster.show('Failed to create API key', 'warning');
      }
    } catch {
      toaster.show('Error creating API key', 'warning');
    }
  }, [fetch, mutate, toaster]);

  const handleRevokeKey = useCallback(
    async (id: string) => {
      if (!(await deleteDialog('Are you sure you want to revoke this API key? This action cannot be undone.'))) {
        return;
      }
      try {
        const res = await fetch(`/user/api-key/${id}`, { method: 'DELETE' });
        if (res.ok) {
          toaster.show('API key revoked successfully', 'success');
          mutate();
        } else {
          toaster.show('Failed to revoke API key', 'warning');
        }
      } catch {
        toaster.show('Error revoking API key', 'warning');
      }
    },
    [fetch, mutate, toaster]
  );

  return (
    <div className="w-full max-w-5xl mx-auto p-8 pt-10 font-sans min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">API Keys</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Manage API keys and webhook integrations for programmatic access
          </p>
        </div>

        {!isFree && (
          <button
            onClick={handleCreateKey}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm flex items-center gap-2"
          >
            + Create API Key
          </button>
        )}
      </div>

      {/* Plan Gated Upgrade Banner */}
      {isFree && (
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-sky-100 text-sky-600 rounded-xl shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-sky-900">API Access Requires Pro Plan</h3>
              <p className="text-xs text-sky-700 mt-0.5">
                Upgrade to a paid plan to generate API keys, configure webhooks, and integrate Harlo Social programmatically.
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push('/billing')}
            className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap shadow-sm shrink-0"
          >
            Upgrade Plan →
          </button>
        </div>
      )}

      {/* One-Time Key Reveal Card */}
      {newKeyRevealed && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-8 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded-full">
                One-Time Secret Key Reveal
              </span>
              <h3 className="text-sm font-bold text-emerald-950 mt-2">API Key Generated</h3>
              <p className="text-xs text-emerald-800 mt-0.5 mb-3">
                Copy this key now. For security reasons, it will not be displayed again.
              </p>
              <div className="flex items-center gap-2 bg-white border border-emerald-200 rounded-xl p-2.5 max-w-lg">
                <code className="text-xs font-mono text-slate-800 flex-1 truncate">{newKeyRevealed}</code>
                <button
                  onClick={() => {
                    copy(newKeyRevealed);
                    toaster.show('API key copied to clipboard', 'success');
                  }}
                  className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Copy Key
                </button>
              </div>
            </div>
            <button
              onClick={() => setNewKeyRevealed(null)}
              className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Keys List Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Active API Keys</h2>
          <span className="text-xs font-medium text-slate-400">
            {keysList?.length || 0} active keys
          </span>
        </div>

        {!keysList || keysList.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">No API Keys Found</h3>
            <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
              Create an API key to authenticate programmatic requests to the Harlo Social REST API.
            </p>
            {!isFree && (
              <button
                onClick={handleCreateKey}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm inline-flex items-center gap-2"
              >
                + Create API Key
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {keysList.map((key: any) => (
              <div key={key.id} className="py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors rounded-xl px-2">
                <div>
                  <div className="text-xs font-bold text-slate-900">{key.name || 'API Key (' + key.id.substring(0, 8) + ')'}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    ph_live_••••••••{key.id.substring(key.id.length - 4)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    Active
                  </span>
                  <button
                    onClick={() => handleRevokeKey(key.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Webhook Configuration */}
      {!isFree && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm mb-8">
          <Webhooks />
        </div>
      )}

      {/* API Documentation Link */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">API Documentation</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Read our comprehensive guides and API reference to integrate Harlo Social.
          </p>
        </div>
        <a
          href="https://docs.poscally.com/public-api"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm whitespace-nowrap"
        >
          View Documentation →
        </a>
      </div>
    </div>
  );
};
