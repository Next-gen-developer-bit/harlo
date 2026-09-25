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
import {
  AppPage,
  Card,
  CardHeader,
  Chip,
  EmptyState,
  FilterSelect,
  Icon,
  ICONS,
  Pagination,
  PrimaryButton,
  SearchInput,
  SecondaryButton,
  StatCard,
  Table,
  Th,
  Td,
  TabBar,
  Toggle,
  TrendText,
} from '@gitroom/frontend/components/harlo-pages/ui';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Types
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
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

type RoleKey = 'SUPERADMIN' | 'ADMIN' | 'USER';

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

const roleLabel = (role?: string) => {
  if (role === 'SUPERADMIN') {
    return 'Owner';
  }
  if (role === 'ADMIN') {
    return 'Admin';
  }
  return 'Editor';
};

const roleTone = (role?: string): 'violet' | 'blue' | 'emerald' | 'orange' => {
  if (role === 'SUPERADMIN') {
    return 'violet';
  }
  if (role === 'ADMIN') {
    return 'blue';
  }
  return 'emerald';
};

const platformIcon = (identifier?: string) => {
  const family = platformFamily(identifier);
  if (family === 'youtube') {
    return '/icons/platforms/youtube.svg';
  }
  return `/icons/platforms/${identifier || family}.png`;
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Data hooks — each useSWR lives in its own hook (rules-of-hooks)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const useTeamMembers = () => {
  const fetch = useFetch();
  const loadTeam = useCallback(async () => {
    return (await (await fetch('/settings/team')).json()).users as TeamMember[];
  }, [fetch]);
  return useSWR('/api/teams', loadTeam, { revalidateOnFocus: true });
};

const useIntegrationsList = () => {
  const fetch = useFetch();
  const loadIntegrations = useCallback(async () => {
    try {
      const res = await (await fetch('/integrations/list')).json();
      return (res.integrations || []) as IntegrationItem[];
    } catch {
      return [] as IntegrationItem[];
    }
  }, [fetch]);
  return useSWR('connections-list', loadIntegrations, {
    revalidateOnFocus: true,
  });
};

const PAGE_SIZE = 8;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export const TeamsComponent = () => {
  const user = useUser();
  const modals = useModals();
  const router = useRouter();
  const toast = useToaster();

  const { data, mutate } = useTeamMembers();
  const { data: integrations } = useIntegrationsList();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [workspaceFilter, setWorkspaceFilter] = useState('all');
  const [tab, setTab] = useState<'members' | 'pending'>('members');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const menuRef = useClickAway<HTMLDivElement>(() => setMenuOpenFor(null));

  const isGated = user?.tier?.current === 'FREE' || !user?.tier?.team_members;
  const members = data || [];
  const invitedMembers = members.filter(
    (member) => member.user.id !== user?.id
  );
  const hasTeam = invitedMembers.length > 0;

  // Pending invites are not exposed by the API today — keep the count honest.
  const pendingCount = 0;

  const orgName = user?.orgName || 'Workspace';

  // Role counts (real, derived from the member list)
  const counts = useMemo(() => {
    const admins = members.filter((m) => m.role === 'ADMIN').length;
    const editors = members.filter((m) => m.role === 'USER').length;
    return {
      total: members.length,
      admins,
      editors,
      // No "viewer" role exists in the data model yet.
      viewers: 0,
    };
  }, [members]);

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return members.filter((member) => {
      if (roleFilter !== 'all' && member.role !== roleFilter) {
        return false;
      }
      if (
        query &&
        ![memberName(member), member.user.email, orgName]
          .join(' ')
          .toLowerCase()
          .includes(query)
      ) {
        return false;
      }
      return true;
    });
  }, [members, searchQuery, roleFilter, orgName]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  const roleOptions = [
    { value: 'all', label: 'All roles' },
    { value: 'SUPERADMIN', label: 'Owner' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'USER', label: 'Editor' },
  ];
  const workspaceOptions = [
    { value: 'all', label: 'All workspaces' },
    { value: user?.orgId || 'current', label: orgName },
  ];

  const allOnPageSelected =
    pageItems.length > 0 &&
    pageItems.every((m) => selected[m.user.id]);

  const toggleAll = () => {
    setSelected((current) => {
      const next = { ...current };
      for (const m of pageItems) {
        next[m.user.id] = !allOnPageSelected;
      }
      return next;
    });
  };

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
      const fetch = window.fetch;
      // Use the configured fetch via context is not available here; reuse the
      // same endpoint as the original implementation.
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
    [mutate, toast]
  );

  return (
    <AppPage>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="mb-1 text-sm font-medium text-slate-500">Teams</p>
          <h1 className="text-[30px] font-extrabold leading-tight tracking-tight text-slate-900">
            Work better, together.
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your team members, roles and permissions across your
            workspaces.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!isGated && (
            <PrimaryButton onClick={openCreateTeam}>
              <Icon path={ICONS.plus} className="h-4 w-4" />
              Invite member
            </PrimaryButton>
          )}
        </div>
      </div>

      {/* Gated / upgrade banner */}
      {isGated && (
        <Card className="mb-6 flex flex-col items-start justify-between gap-3 bg-sky-50 p-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
              <Icon path={ICONS.shield} className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-sky-900">
                Team collaboration requires Pro
              </h3>
              <p className="mt-0.5 text-xs text-sky-700">
                Upgrade to invite members and manage publishing access.
              </p>
            </div>
          </div>
          <PrimaryButton
            onClick={() => router.push('/billing')}
            className="bg-sky-600 hover:bg-sky-700"
          >
            Upgrade Plan
          </PrimaryButton>
        </Card>
      )}

      {/* Stat row */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={ICONS.users}
          tone="blue"
          label="Team members"
          value={counts.total}
          trend={{ value: `${counts.total}`, label: 'in this workspace' }}
        />
        <StatCard
          icon={ICONS.user}
          tone="violet"
          label="Admins"
          value={counts.admins}
          note="Owners & admins"
        />
        <StatCard
          icon={ICONS.users}
          tone="emerald"
          label="Editors"
          value={counts.editors}
          note="Can create & edit posts"
        />
        <StatCard
          icon={ICONS.eye}
          tone="orange"
          label="Viewers"
          value={counts.viewers}
          note="Read-only access"
        />
      </div>

      {/* Members card */}
      <Card className="mb-6 min-h-[420px] flex flex-col">
        {!hasTeam ? (
          <EmptyState
            icon={ICONS.users}
            title="No teams created yet"
            description="Create your first team to share account access, approvals and publishing workflows."
            className="flex-1"
          >
            {!isGated ? (
              <PrimaryButton onClick={openCreateTeam}>
                <Icon path={ICONS.plus} className="h-4 w-4" />
                Create team
              </PrimaryButton>
            ) : null}
          </EmptyState>
        ) : (
          <>
            {/* Header row: tabs + filters */}
            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
              <TabBar
                value={tab}
                onChange={setTab}
                tabs={[
                  { value: 'members', label: 'Members', count: members.length },
                  ...(pendingCount > 0
                    ? [
                        {
                          value: 'pending' as const,
                          label: 'Pending invites',
                          count: pendingCount,
                        },
                      ]
                    : []),
                ]}
              />
              <div className="flex flex-wrap items-center gap-2">
                <SearchInput
                  placeholder="Search team members..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                  className="w-full sm:w-64"
                />
                <FilterSelect
                  value={roleFilter}
                  onChange={(v) => {
                    setRoleFilter(v);
                    setPage(1);
                  }}
                  options={roleOptions}
                  className="w-40"
                />
                <FilterSelect
                  value={workspaceFilter}
                  onChange={setWorkspaceFilter}
                  options={workspaceOptions}
                  className="w-44"
                />
              </div>
            </div>

            {/* Table */}
            <div className="flex-1">
              <Table>
                <thead className="border-b border-slate-100">
                  <tr className="bg-slate-50/60">
                    <Th className="w-10">
                      <input
                        type="checkbox"
                        aria-label="Select all on page"
                        checked={allOnPageSelected}
                        onChange={toggleAll}
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </Th>
                    <Th>Name</Th>
                    <Th>Role</Th>
                    <Th>Workspaces</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pageItems.map((member) => {
                    const isOwner = member.role === 'SUPERADMIN';
                    return (
                      <tr
                        key={member.user.id}
                        className="transition-colors hover:bg-slate-50/60"
                      >
                        <Td>
                          <input
                            type="checkbox"
                            aria-label={`Select ${memberName(member)}`}
                            checked={Boolean(selected[member.user.id])}
                            onChange={() =>
                              setSelected((current) => ({
                                ...current,
                                [member.user.id]: !current[member.user.id],
                              }))
                            }
                            className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                        </Td>
                        <Td>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                              {initials(memberName(member))}
                            </div>
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-slate-900">
                                {memberName(member)}
                                {member.user.id === user?.id ? ' (you)' : ''}
                              </div>
                              <div className="truncate text-xs text-slate-400">
                                {member.user.email}
                              </div>
                            </div>
                          </div>
                        </Td>
                        <Td>
                          <Chip tone={roleTone(member.role)}>
                            {roleLabel(member.role)}
                          </Chip>
                        </Td>
                        <Td>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Chip tone="slate">{orgName}</Chip>
                          </div>
                        </Td>
                        <Td>
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        </Td>
                        <Td>
                          <div
                            className="relative inline-block"
                            ref={menuOpenFor === member.user.id ? menuRef : undefined}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setMenuOpenFor((current) =>
                                  current === member.user.id
                                    ? null
                                    : member.user.id
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                              aria-label={`Actions for ${memberName(member)}`}
                            >
                              <Icon
                                path="M5 12h.01M12 12h.01M19 12h.01"
                                className="h-4 w-4"
                              />
                            </button>
                            {menuOpenFor === member.user.id && (
                              <div className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMenuOpenFor(null);
                                    openCreateTeam();
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                >
                                  Edit team
                                </button>
                                {member.user.id !== user?.id && !isOwner && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setMenuOpenFor(null);
                                      remove(member)();
                                    }}
                                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                  >
                                    Remove member
                                  </button>
                                )}
                                {isOwner && (
                                  <div className="px-3 py-2 text-xs text-slate-400">
                                    Owner cannot be removed
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </Td>
                      </tr>
                    );
                  })}
                  {pageItems.length === 0 && (
                    <tr>
                      <Td className="py-10 text-center text-sm text-slate-400">
                        No members match your filters.
                      </Td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>

            {/* Footer */}
            <Pagination
              page={safePage}
              pages={pageCount}
              onChange={setPage}
              summary={`Showing ${
                filtered.length === 0 ? 0 : start + 1
              }–${Math.min(start + PAGE_SIZE, filtered.length)} of ${
                filtered.length
              } members`}
            />
          </>
        )}
      </Card>

      {/* Footer cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Icon path={ICONS.users} className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900">
                Invite your team
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Collaborate with your team and get more done together.
              </p>
            </div>
          </div>
          <SecondaryButton onClick={openCreateTeam} disabled={isGated}>
            <Icon path={ICONS.plus} className="h-4 w-4" />
            Invite member
          </SecondaryButton>
        </Card>

        <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Icon path={ICONS.shield} className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900">
                Set permissions
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Control what your team members can access and manage.
              </p>
            </div>
          </div>
          <SecondaryButton
            onClick={() => toast.show('Role permissions: Owner, Admin, Editor.', 'success')}
          >
            Learn about roles
          </SecondaryButton>
        </Card>
      </div>
    </AppPage>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Create team modal
   — Team name / description / approval toggle / workspace+account scoping are
   intentionally disabled (backend does not support them yet). Only the
   member invitation flow (POST /settings/team) is functional.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
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
  const [loading, setLoading] = useState(false);

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
        emailConfigured =
          emailConfigured && Boolean(payload?.emailConfigured);
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

  const disabledNote =
    'Team naming and scoped workspace/account access are currently a setup preview.';

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-10"
      onClick={onClose}
    >
      <div
        className="my-auto w-full max-w-[680px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-team-title"
      >
        {/* Header */}
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
            <Icon path={ICONS.x} className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-5">
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs leading-5 text-blue-700">
            Member invitations are applied to{' '}
            <strong>{user?.orgName || 'the current workspace'}</strong>.{' '}
            {disabledNote}
          </div>

          {/* Team name */}
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
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

          {/* Description */}
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
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
            <div className="mt-1 text-right text-[11px] text-slate-400">
              {description.length}/500
            </div>
          </label>

          {/* Approval toggle */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-slate-800">
                Require approval before publishing{' '}
                <span className="text-[10px] font-semibold text-slate-400">
                  Coming soon
                </span>
              </div>
              <div className="mt-0.5 text-xs text-slate-500">
                Posts from this team will need to be approved before going live.
              </div>
            </div>
            <Toggle
              label="Require approval before publishing"
              checked={requireApproval}
              onChange={setRequireApproval}
              disabled
            />
          </div>

          {/* Workspace access */}
          <div>
            <div className="mb-1 text-sm font-medium text-slate-700">
              Workspace access
            </div>
            <p className="mb-2 text-xs text-slate-400">
              Select which workspaces this team can access.
            </p>
            <div className="mb-2">
              <SecondaryButton disabled className="cursor-not-allowed opacity-60">
                Select workspaces
              </SecondaryButton>
            </div>
            <div className="flex flex-wrap gap-2">
              {workspaceOptions
                .filter((org) => selectedWorkspaces.includes(org.id))
                .map((org) => (
                  <span
                    key={org.id}
                    className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-400"
                  >
                    {org.name}
                    {org.id !== user?.orgId && (
                      <span className="text-slate-300" aria-hidden>
                        ×
                      </span>
                    )}
                  </span>
                ))}
            </div>
          </div>

          {/* Social accounts */}
          <div>
            <div className="mb-1 text-sm font-medium text-slate-700">
              Social accounts
            </div>
            <p className="mb-2 text-xs text-slate-400">
              Add social accounts this team can publish to.
            </p>
            <div className="mb-2">
              <SecondaryButton disabled className="cursor-not-allowed opacity-60">
                Add account
              </SecondaryButton>
            </div>
            <div className="space-y-2">
              {integrations
                .filter((account) => selectedAccounts.includes(account.id))
                .map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-3 py-2.5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={platformIcon(account.identifier)}
                        alt=""
                        className="h-5 w-5"
                      />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-slate-900">
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
                      disabled
                      className="cursor-not-allowed px-1 text-slate-300"
                      aria-label="Account scope is coming soon"
                    >
                      ⋮
                    </button>
                  </div>
                ))}
              {selectedAccounts.length === 0 && (
                <div className="py-2 text-sm text-slate-400">
                  No social accounts connected yet.
                </div>
              )}
            </div>
          </div>

          {/* Members & access */}
          <div>
            <div className="mb-1 text-sm font-medium text-slate-700">
              Members &amp; access
            </div>
            <p className="mb-3 text-xs text-slate-400">
              Invite team members and assign their role.
            </p>
            <div className="mb-3 flex flex-col gap-2 sm:flex-row">
              <input
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addPendingInvite();
                  }
                }}
                placeholder="name@company.com"
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
              <select
                value={inviteRole}
                onChange={(event) =>
                  setInviteRole(event.target.value as 'ADMIN' | 'USER')
                }
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700"
              >
                <option value="USER">Editor</option>
                <option value="ADMIN">Admin</option>
              </select>
              <SecondaryButton onClick={addPendingInvite}>
                <Icon path={ICONS.plus} className="h-4 w-4" />
                Add member
              </SecondaryButton>
            </div>
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.user.id}
                  className="flex items-center justify-between gap-3 py-1"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                      {initials(memberName(member))}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-slate-900">
                        {memberName(member)}
                      </div>
                      <div className="truncate text-xs text-slate-400">
                        {member.user.email}
                      </div>
                    </div>
                  </div>
                  <Chip tone={roleTone(member.role)}>
                    {roleLabel(member.role)}
                  </Chip>
                </div>
              ))}
              {pendingInvites.map((invite) => (
                <div
                  key={invite.email}
                  className="flex items-center justify-between gap-3 py-1"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                      {initials(invite.email)}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-slate-900">
                        {invite.email.split('@')[0]}
                      </div>
                      <div className="truncate text-xs text-slate-400">
                        {invite.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip tone={roleTone(invite.role)}>
                      {roleLabel(invite.role)}
                    </Chip>
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

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton onClick={submit} disabled={loading}>
            {loading ? 'Sending…' : 'Create team'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
