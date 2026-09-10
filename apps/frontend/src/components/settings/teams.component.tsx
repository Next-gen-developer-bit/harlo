'use client';

import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import useSWR from 'swr';
import React, { useCallback, useMemo, useState } from 'react';
import { useUser } from '@gitroom/frontend/components/layout/user.context';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { Input } from '@gitroom/react/form/input';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { Select } from '@gitroom/react/form/select';
import { Checkbox } from '@gitroom/react/form/checkbox';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { AddTeamMemberDto } from '@gitroom/nestjs-libraries/dtos/settings/add.team.member.dto';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { deleteDialog } from '@gitroom/react/helpers/delete.dialog';
import copy from 'copy-to-clipboard';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { useRouter } from 'next/navigation';

const roles = [
  { name: 'Member (User)', value: 'USER' },
  { name: 'Admin', value: 'ADMIN' },
];

export const AddMember = () => {
  const modals = useModals();
  const fetch = useFetch();
  const toast = useToaster();
  const resolver = useMemo(() => {
    return classValidatorResolver(AddTeamMemberDto);
  }, []);
  const form = useForm({
    defaultValues: {
      email: '',
      role: 'USER',
      sendEmail: true,
    },
    resolver,
    mode: 'onChange',
  });
  const sendEmail = useWatch({
    control: form.control,
    name: 'sendEmail',
  });
  const [loading, setLoading] = useState(false);

  const submit = useCallback(
    async (values: { email: string; role: string; sendEmail: boolean }) => {
      setLoading(true);
      try {
        const response = await fetch('/settings/team', {
          method: 'POST',
          body: JSON.stringify({
            ...values,
            sendEmail: Boolean(values.sendEmail),
          }),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          toast.show(
            payload?.message || 'Failed to invite member',
            'warning'
          );
          return;
        }
        if (payload?.url) {
          copy(payload.url);
        }
        modals.closeAll();
        if (values.sendEmail && payload?.emailed) {
          toast.show(
            'Invitation sent. Link also copied to clipboard.',
            'success'
          );
          return;
        }
        if (values.sendEmail && payload?.emailConfigured) {
          toast.show(
            'Could not send the invitation email. Invite link copied — send it to your teammate.',
            'warning'
          );
          return;
        }
        if (values.sendEmail) {
          toast.show(
            'Email is not configured on this server. Invite link copied — send it to your teammate.',
            'warning'
          );
          return;
        }
        toast.show('Invitation link copied to clipboard', 'success');
      } catch {
        toast.show('Failed to invite member', 'warning');
      } finally {
        setLoading(false);
      }
    },
    [fetch, modals, toast]
  );

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(submit, () => {
          toast.show('Please enter a valid email address', 'warning');
        })}
      >
        <div className="relative flex gap-4 flex-col p-6 bg-white rounded-xl">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Invite Team Member</h2>
          <p className="text-xs text-gray-500 mb-3">
            Send an email invitation or generate a copyable invite link for your workspace.
          </p>
          {sendEmail && (
            <Input
              label="Email Address"
              placeholder="colleague@company.com"
              name="email"
            />
          )}
          <Select label="Role" name="role">
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.name}
              </option>
            ))}
          </Select>
          <div className="flex items-center gap-2 mt-2">
            <Checkbox
              disableForm
              name="sendEmail"
              checked={!!sendEmail}
              onChange={(event) => {
                form.setValue('sendEmail', event.target.value, {
                  shouldValidate: true,
                });
              }}
            />
            <span className="text-xs text-gray-700">
              Send invitation via email
            </span>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => modals.closeAll()}
              className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg disabled:opacity-50 transition-colors shadow-sm"
            >
              {loading
                ? 'Sending...'
                : sendEmail
                  ? 'Send Invitation'
                  : 'Copy Invite Link'}
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export const TeamsComponent = () => {
  const fetch = useFetch();
  const user = useUser();
  const modals = useModals();
  const router = useRouter();

  const loadTeam = useCallback(async () => {
    return (await (await fetch('/settings/team')).json()).users as Array<{
      id: string;
      role: 'SUPERADMIN' | 'ADMIN' | 'USER';
      user: {
        email: string;
        id: string;
      };
    }>;
  }, [fetch]);

  const { data, mutate } = useSWR('/api/teams', loadTeam, {
    revalidateOnFocus: true,
  });

  const addMember = useCallback(() => {
    modals.openModal({
      classNames: {
        modal: 'bg-transparent p-0 w-[95%] max-w-[500px]',
      },
      withCloseButton: false,
      children: <AddMember />,
    });
  }, [modals]);

  const remove = useCallback(
    (toRemove: { user: { id: string; email: string } }) => async () => {
      if (
        !(await deleteDialog(
          `Are you sure you want to remove ${toRemove.user.email} from the workspace?`
        ))
      ) {
        return;
      }
      await fetch(`/settings/team/${toRemove.user.id}`, {
        method: 'DELETE',
      });
      await mutate();
    },
    [fetch, mutate]
  );

  // Check if team creation is plan gated
  const isGated = user?.tier?.current === 'FREE' || !user?.tier?.team_members;

  return (
    <div className="w-full max-w-5xl mx-auto p-8 pt-10 font-sans min-h-screen">
      {/* Page Heading & Short Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Teams</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Manage team members and workspace permissions
          </p>
        </div>

        {!isGated && (
          <button
            onClick={addMember}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Invite Member
          </button>
        )}
      </div>

      {/* One Compact Upgrade Banner (PRD Section 3.10) */}
      {isGated && (
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-sky-100 text-sky-600 rounded-xl shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-sky-900">Team Collaboration Requires Pro Plan</h3>
              <p className="text-xs text-sky-700 mt-0.5">
                Upgrade to Pro to create and manage teams. Invited members can accept invitations without upgrading.
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

      {/* Main Content Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Workspace Members</h2>
          <span className="text-xs font-medium text-slate-400">
            {data?.length || 0} active members
          </span>
        </div>

        {!data || data.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">No Team Members Yet</h3>
            <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
              Invite team members to collaborate on social posts and workspace scheduling.
            </p>
            {!isGated && (
              <button
                onClick={addMember}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm inline-flex items-center gap-2"
              >
                + Invite Member
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {data.map((member) => (
              <div key={member.user.id} className="py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors rounded-xl px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold border border-blue-100">
                    {member.user.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{member.user.email}</div>
                    <div className="text-[11px] text-slate-400">
                      {member.role === 'SUPERADMIN' ? 'Owner' : member.role === 'ADMIN' ? 'Admin' : 'Member'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    Active
                  </span>
                  {member.user.id !== user?.id && (
                    <button
                      onClick={remove(member)}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
