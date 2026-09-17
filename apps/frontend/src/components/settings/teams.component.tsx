'use client';

import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import useSWR from 'swr';
import React, { useCallback, useMemo, useState } from 'react';
import { useUser } from '@gitroom/frontend/components/layout/user.context';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { deleteDialog } from '@gitroom/react/helpers/delete.dialog';
import { useRouter } from 'next/navigation';
import {
  useOrganizations,
  type UserOrganization,
} from '@gitroom/frontend/components/layout/use.organizations';
import { useClickAway } from '@uidotdev/usehooks';
import clsx from 'clsx';
import copy from 'copy-to-clipboard';
import {
  PLATFORM_LABELS,
  channelKindLabel,
  platformFamily,
} from '@gitroom/frontend/components/launches/helpers/mvp.platforms';

type TeamMember = {
  id: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'USER';
  user: {
    email: string;
    id: string;
    name?: string | null;
    lastName?: string | null;
  };
};

type IntegrationItem = {
  id: string;
  name: string;
  identifier: string;
  picture?: string;
  display?: string;
};

const roleLabel = (role?: string) => {
  if (role === 'SUPERADMIN') {
    return 'Owner';
  }
  if (role === 'ADMIN') {
    return 'Admin';
  }
  return 'Editor';
};

const roleClass = (role?: string) => {
  if (role === 'SUPERADMIN') {
    return 'bg-violet-50 text-violet-700';
  }
  if (role === 'ADMIN') {
    return 'bg-blue-50 text-blue-700';
  }
  return 'bg-emerald-50 text-emerald-700';
};

const memberName = (member: TeamMember) => {
  const full = [member.user.name, member.user.lastName]
    .filter(Boolean)
    .join(' ');
  return full || member.user.email.split('@')[0];
};

const initials = (value?: string) =>
  (value || 'A')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'A';

const platformIcon = (identifier?: string) => {
  const family = platformFamily(identifier);
  if (family === 'youtube') {
    return '/icons/platforms/youtube.svg';
  }
  return `/icons/platforms/${identifier || family}.png`;
};

export const TeamsComponent = () => {
  const fetch = useFetch();
  const user = useUser();
  const modals = useModals();
  const router = useRouter();
  const toast = useToaster();
  const [searchQuery, setSearchQuery] = useState('');

  const loadTeam = useCallback(async () => {
    return (await (await fetch('/settings/team')).json()).users as TeamMember[];
  }, [fetch]);

  const loadIntegrations = useCallback(async () => {
    try {
      const res = await (await fetch('/integrations/list')).json();
      return (res.integrations || []) as IntegrationItem[];
    } catch {
      return [];
    }
  }, [fetch]);

  const { data, mutate } = useSWR('/api/teams', loadTeam, {
    revalidateOnFocus: true,
  });
  const { data: integrations } = useSWR('connections-list', loadIntegrations, {
    revalidateOnFocus: true,
  });

  const isGated = user?.tier?.current === 'FREE' || !user?.tier?.team_members;
  const members = data || [];
  const invitedMembers = members.filter(
    (member) => member.user.id !== user?.id
  );
  const hasTeam = invitedMembers.length > 0;
  const query = searchQuery.toLowerCase().trim();
  const visible =
    !query ||
    (user?.orgName || 'Workspace').toLowerCase().includes(query) ||
    members.some((member) =>
      [memberName(member), member.user.email]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );

  const openCreateTeam = useCallback(() => {
    modals.openModal({
      id: 'create-team-modal',
      closeOnClickOutside: true,
      withCloseButton: false,
      removeLayout: true,
      children: (close) => (
        <CreateTeamModal
          members={members}
          integrations={integrations || []}
          onClose={close}
          onCreated={async () => {
            await mutate();
            close();
          }}
        />
      ),
    });
  }, [modals, members, integrations, mutate]);

  const remove = useCallback(
    (toRemove: TeamMember) => async () => {
      if (
        !(await deleteDialog(
          `Are you sure you want to remove ${toRemove.user.email} from the workspace?`
        ))
      ) {
        return;
      }
      const response = await fetch(`/settings/team/${toRemove.user.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        toast.show('Could not remove this member', 'warning');
        return;
      }
      toast.show('Member removed', 'success');
      await mutate();
    },
    [fetch, mutate, toast]
  );

  return (
    <div className="w-full min-h-full px-6 py-8 md:px-8 font-sans">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[28px] leading-tight font-bold text-slate-900">
            Teams
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Invite members, assign roles and workspaces, and control who can
            publish.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-72">
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
              placeholder="Search team members, workspaces or anything..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full bg-white border border-slate-200 text-sm text-slate-700 pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-blue-500"
            />
          </div>
          {!isGated && (
            <button
              onClick={openCreateTeam}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm whitespace-nowrap"
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
              New team
            </button>
          )}
        </div>
      </div>

      {isGated && (
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-sky-900">
              Team collaboration requires Pro
            </h3>
            <p className="text-xs text-sky-700 mt-0.5">
              Upgrade to invite members and manage publishing access.
            </p>
          </div>
          <button
            onClick={() => router.push('/billing')}
            className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl whitespace-nowrap"
          >
            Upgrade Plan
          </button>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl min-h-[420px] flex flex-col">
        {!hasTeam || !visible ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
            <div className="w-24 h-24 mb-5 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              No teams created yet
            </h2>
            <p className="text-sm text-slate-500 max-w-sm mb-6">
              Create your first team to share account access, approvals and
              publishing workflows.
            </p>
            {!isGated && (
              <button
                onClick={openCreateTeam}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl"
              >
                + Create team
              </button>
            )}
          </div>
        ) : (
          <div className="p-5">
            <div className="border border-slate-200 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {user?.orgName || 'Workspace'}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Members who can access this workspace and its connected
                    accounts.
                  </p>
                </div>
                <button
                  onClick={openCreateTeam}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Edit team
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {(integrations || []).slice(0, 6).map((account) => (
                  <span
                    key={account.id}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-2.5 py-1"
                  >
                    <img
                      src={platformIcon(account.identifier)}
                      alt=""
                      className="w-3.5 h-3.5"
                    />
                    {account.name}
                  </span>
                ))}
              </div>
              <div className="divide-y divide-slate-100">
                {members.map((member) => (
                  <div
                    key={member.user.id}
                    className="py-3 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold">
                        {initials(memberName(member))}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900 truncate">
                          {memberName(member)}
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                          {member.user.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={clsx(
                          'text-[11px] font-semibold px-2.5 py-0.5 rounded-full',
                          roleClass(member.role)
                        )}
                      >
                        {roleLabel(member.role)}
                      </span>
                      {member.user.id !== user?.id && (
                        <button
                          onClick={remove(member)}
                          className="text-xs text-red-500 hover:text-red-700 font-semibold"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CreateTeamModal = ({
  members,
  integrations,
  onClose,
  onCreated,
}: {
  members: TeamMember[];
  integrations: IntegrationItem[];
  onClose: () => void;
  onCreated: () => Promise<void>;
}) => {
  const fetch = useFetch();
  const user = useUser();
  const toast = useToaster();
  const { data: organizations } = useOrganizations();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [requireApproval, setRequireApproval] = useState(false);
  const [selectedWorkspaces, setSelectedWorkspaces] = useState<string[]>(
    user?.orgId ? [user.orgId] : []
  );
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(
    integrations.map((item) => item.id)
  );
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'USER'>('USER');
  const [pendingInvites, setPendingInvites] = useState<
    Array<{ email: string; role: 'ADMIN' | 'USER' }>
  >([]);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const workspaceRef = useClickAway<HTMLDivElement>(() =>
    setWorkspaceOpen(false)
  );
  const accountRef = useClickAway<HTMLDivElement>(() => setAccountOpen(false));

  const workspaceOptions = useMemo((): UserOrganization[] => {
    return (organizations || []).map((org) => ({
      id: org.id,
      name: org.name,
    }));
  }, [organizations]);

  const availableAccounts = integrations.filter(
    (item) => !selectedAccounts.includes(item.id)
  );

  const addPendingInvite = () => {
    const email = inviteEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      toast.show('Enter a valid email address', 'warning');
      return;
    }
    const alreadyMember = members.some(
      (member) => member.user.email.toLowerCase() === email
    );
    const alreadyPending = pendingInvites.some((item) => item.email === email);
    if (alreadyMember || alreadyPending) {
      toast.show('That person is already on this team', 'warning');
      return;
    }
    setPendingInvites((current) => [...current, { email, role: inviteRole }]);
    setInviteEmail('');
  };

  const toggleWorkspace = (id: string) => {
    if (id === user?.orgId) {
      return;
    }
    setSelectedWorkspaces((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const submit = async () => {
    if (!pendingInvites.length) {
      toast.show('Add at least one member to invite', 'warning');
      return;
    }
    setLoading(true);
    try {
      let allEmailsSent = true;
      let emailConfigured = true;
      const inviteLinks: string[] = [];
      for (const invite of pendingInvites) {
        const response = await fetch('/settings/team', {
          method: 'POST',
          body: JSON.stringify({
            email: invite.email,
            role: invite.role,
            sendEmail: true,
          }),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          toast.show(
            payload?.message || `Failed to invite ${invite.email}`,
            'warning'
          );
          setLoading(false);
          return;
        }
        if (payload?.url) {
          inviteLinks.push(payload.url);
        }
        allEmailsSent = allEmailsSent && Boolean(payload?.emailed);
        emailConfigured = emailConfigured && Boolean(payload?.emailConfigured);
      }
      if (inviteLinks.length) {
        copy(inviteLinks.join('\n'));
      }
      if (allEmailsSent) {
        toast.show('Team invitations sent and links copied', 'success');
      } else if (emailConfigured) {
        toast.show(
          'Some emails could not be sent. The invitation link was copied.',
          'warning'
        );
      } else {
        toast.show(
          'Email is not configured. The invitation link was copied.',
          'warning'
        );
      }
      await onCreated();
    } catch {
      toast.show('Failed to create team', 'warning');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/40 flex items-start justify-center overflow-y-auto px-4 py-10"
      onClick={onClose}
    >
      <div
        className="my-auto w-full max-w-[680px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-team-title"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 pb-4 pt-6">
          <h2
            id="create-team-title"
            className="text-xl font-bold text-slate-900"
          >
            Create team
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close create team"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs leading-5 text-blue-700">
            Member invitations are applied to{' '}
            <strong>{user?.orgName || 'the current workspace'}</strong>. Team
            naming and scoped workspace/account access are currently a setup
            preview.
          </div>
          <label className="block">
            <span className="block text-sm font-medium text-slate-700 mb-1.5">
              Team name
            </span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Growth Team"
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
            </span>
            <textarea
              value={description}
              maxLength={500}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="For marketers and collaborators managing content, campaigns and approvals across Harlo Social."
              disabled
              className="min-h-[88px] w-full cursor-not-allowed resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500"
            />
            <div className="text-right text-[11px] text-slate-400 mt-1">
              {description.length}/500
            </div>
          </label>

          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-slate-800">
                Require approval before publishing{' '}
                <span className="text-[10px] font-semibold text-slate-400">
                  Coming soon
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Posts from this team will need to be approved before going live.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRequireApproval((value) => !value)}
              disabled
              className={clsx(
                'w-11 h-6 rounded-full relative transition-colors cursor-not-allowed opacity-60',
                requireApproval ? 'bg-blue-600' : 'bg-slate-200'
              )}
              aria-pressed={requireApproval}
            >
              <span
                className={clsx(
                  'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all',
                  requireApproval ? 'left-5' : 'left-0.5'
                )}
              />
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">
                Workspace access
              </span>
              <div className="relative" ref={workspaceRef}>
                <button
                  type="button"
                  onClick={() => setWorkspaceOpen((value) => !value)}
                  disabled
                  className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-400"
                >
                  Select workspaces
                </button>
                {workspaceOpen && (
                  <div className="absolute right-0 top-9 z-20 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-1">
                    {workspaceOptions.map((org) => (
                      <button
                        key={org.id}
                        type="button"
                        onClick={() => toggleWorkspace(org.id)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center justify-between"
                      >
                        <span>{org.name}</span>
                        {selectedWorkspaces.includes(org.id) && (
                          <span className="text-blue-600 text-xs">
                            Selected
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              Select which workspaces this team can access.
            </p>
            <div className="flex flex-wrap gap-2">
              {workspaceOptions
                .filter((org) => selectedWorkspaces.includes(org.id))
                .map((org) => (
                  <span
                    key={org.id}
                    className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-sm text-slate-700 rounded-full px-3 py-1"
                  >
                    {org.name}
                    {org.id !== user?.orgId && (
                      <button
                        type="button"
                        onClick={() => toggleWorkspace(org.id)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">
                Social accounts
              </span>
              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  onClick={() => setAccountOpen((value) => !value)}
                  disabled
                  className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-400"
                >
                  Add account
                </button>
                {accountOpen && (
                  <div className="absolute right-0 top-9 z-20 w-64 bg-white border border-slate-200 rounded-xl shadow-lg py-1 max-h-56 overflow-y-auto">
                    {availableAccounts.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-slate-400">
                        No more accounts to add
                      </div>
                    ) : (
                      availableAccounts.map((account) => (
                        <button
                          key={account.id}
                          type="button"
                          onClick={() => {
                            setSelectedAccounts((current) => [
                              ...current,
                              account.id,
                            ]);
                            setAccountOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2"
                        >
                          <img
                            src={platformIcon(account.identifier)}
                            alt=""
                            className="w-4 h-4"
                          />
                          {account.name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              Add social accounts this team can publish to.
            </p>
            <div className="space-y-2">
              {integrations
                .filter((account) => selectedAccounts.includes(account.id))
                .map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between gap-3 border border-slate-100 rounded-xl px-3 py-2.5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={platformIcon(account.identifier)}
                        alt=""
                        className="w-5 h-5"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">
                          {account.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {channelKindLabel(account.identifier) ||
                            PLATFORM_LABELS[
                              platformFamily(account.identifier)
                            ] ||
                            platformFamily(account.identifier)}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedAccounts((current) =>
                          current.filter((id) => id !== account.id)
                        )
                      }
                      disabled
                      className="cursor-not-allowed px-1 text-slate-300"
                      aria-label="Account scope is coming soon"
                    >
                      ⋮
                    </button>
                  </div>
                ))}
              {selectedAccounts.length === 0 && (
                <div className="text-sm text-slate-400 py-2">
                  No social accounts connected yet.
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-slate-700 mb-1">
              Members & access
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Invite team members and assign their role.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                placeholder="name@company.com"
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
              <select
                value={inviteRole}
                onChange={(event) =>
                  setInviteRole(event.target.value as 'ADMIN' | 'USER')
                }
                className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700"
              >
                <option value="USER">Editor</option>
                <option value="ADMIN">Admin</option>
              </select>
              <button
                type="button"
                onClick={addPendingInvite}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold px-3 py-2.5 rounded-xl whitespace-nowrap"
              >
                Add member
              </button>
            </div>
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.user.id}
                  className="flex items-center justify-between gap-3 py-1"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold">
                      {initials(memberName(member))}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-900 truncate">
                        {memberName(member)}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {member.user.email}
                      </div>
                    </div>
                  </div>
                  <span
                    className={clsx(
                      'text-[11px] font-semibold px-2.5 py-0.5 rounded-full',
                      roleClass(member.role)
                    )}
                  >
                    {roleLabel(member.role)}
                  </span>
                </div>
              ))}
              {pendingInvites.map((invite) => (
                <div
                  key={invite.email}
                  className="flex items-center justify-between gap-3 py-1"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold">
                      {initials(invite.email)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-900 truncate">
                        {invite.email.split('@')[0]}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {invite.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={clsx(
                        'text-[11px] font-semibold px-2.5 py-0.5 rounded-full',
                        roleClass(invite.role)
                      )}
                    >
                      {roleLabel(invite.role)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setPendingInvites((current) =>
                          current.filter((item) => item.email !== invite.email)
                        )
                      }
                      className="text-slate-400 hover:text-slate-700"
                      aria-label={`Remove invitation for ${invite.email}`}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-xl"
          >
            {loading ? 'Sending…' : 'Send invitations'}
          </button>
        </div>
      </div>
    </div>
  );
};
