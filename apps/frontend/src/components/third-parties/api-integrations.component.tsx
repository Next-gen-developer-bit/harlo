'use client';

import React, { useCallback } from 'react';
import useSWR from 'swr';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { ApiModal } from '@gitroom/frontend/components/third-parties/third-party.list.component';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { deleteDialog } from '@gitroom/react/helpers/delete.dialog';

type ConnectedIntegration = {
  id: string;
  identifier: string;
  title: string;
};

type AvailableIntegration = {
  identifier: string;
  title: string;
  description: string;
};

export const ApiIntegrationsComponent = () => {
  const fetch = useFetch();
  const modals = useModals();
  const toaster = useToaster();

  const loadConnected = useCallback(async () => {
    const response = await fetch('/third-party');
    if (!response.ok) {
      throw new Error('Could not load integrations');
    }
    return (await response.json()) as ConnectedIntegration[];
  }, [fetch]);

  const loadAvailable = useCallback(async () => {
    const response = await fetch('/third-party/list');
    if (!response.ok) {
      throw new Error('Could not load integration catalogue');
    }
    return (await response.json()) as AvailableIntegration[];
  }, [fetch]);

  const {
    data: connected,
    isLoading: connectedLoading,
    mutate,
  } = useSWR('third-party', loadConnected, {
    revalidateOnFocus: false,
  });
  const { data: available, isLoading: availableLoading } = useSWR(
    'third-party-list',
    loadAvailable,
    { revalidateOnFocus: false }
  );

  const openAdd = useCallback(
    (integration: AvailableIntegration) => {
      modals.openModal({
        title: `Add API key for ${integration.title}`,
        withCloseButton: true,
        children: (
          <ApiModal
            identifier={integration.identifier}
            title={integration.title}
            update={() => mutate()}
          />
        ),
      });
    },
    [modals, mutate]
  );

  const remove = useCallback(
    async (integration: ConnectedIntegration) => {
      if (
        !(await deleteDialog(
          `Delete the ${integration.title} integration from this workspace?`
        ))
      ) {
        return;
      }
      const response = await fetch(`/third-party/${integration.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        toaster.show('Could not delete this integration', 'warning');
        return;
      }
      toaster.show('Integration deleted', 'success');
      await mutate();
    },
    [fetch, mutate, toaster]
  );

  const isLoading = connectedLoading || availableLoading;

  return (
    <div className="min-h-full w-full px-6 py-8 font-sans md:px-8">
      <div className="mb-6">
        <p className="mb-1 text-xs font-semibold tracking-wide text-slate-400">
          Integrations
        </p>
        <h1 className="text-[28px] font-bold leading-tight text-slate-900">
          Connect your workspace tools.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Add API-key integrations that extend publishing and automation in this
          workspace.
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center text-sm text-slate-400">
          Loading integrations…
        </div>
      ) : (
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-900">
                Connected integrations
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                API keys currently available to this workspace.
              </p>
            </div>
            {!connected?.length ? (
              <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400">
                No API integrations connected yet.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {connected.map((integration) => (
                  <div
                    key={integration.id}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 p-4"
                  >
                    <img
                      src={`/icons/third-party/${integration.identifier}.png`}
                      alt=""
                      className="h-9 w-9 rounded-lg object-contain"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-slate-900">
                        {integration.title}
                      </div>
                      <div className="text-xs text-emerald-600">Connected</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(integration)}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-sm font-bold text-slate-900">
              Available integrations
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Select a service and add its API key.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {(available || []).map((integration) => (
                <button
                  key={integration.identifier}
                  type="button"
                  onClick={() => openAdd(integration)}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-200 hover:shadow-sm"
                >
                  <img
                    src={`/icons/third-party/${integration.identifier}.png`}
                    alt=""
                    className="h-10 w-10 rounded-xl object-contain"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-900">
                      {integration.title}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      {integration.description}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
