'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { useUser } from '@gitroom/frontend/components/layout/user.context';
import { GlobalSettings } from '@gitroom/frontend/components/settings/global.settings';
import { ApprovedAppsComponent } from '@gitroom/frontend/components/approved-apps/approved-apps.component';
import { Webhooks } from '@gitroom/frontend/components/webhooks/webhooks';
import clsx from 'clsx';

export const SettingsPopup = () => {
  const fetch = useFetch();
  const toast = useToaster();
  const user = useUser();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'preferences' | 'apps'>('profile');
  const [weeklyGoal, setWeeklyGoal] = useState<number>(5);
  const [emailDigest, setEmailDigest] = useState<boolean>(true);
  const [postAlerts, setPostAlerts] = useState<boolean>(true);

  const form = useForm({
    values: { fullname: '', bio: '', picture: '' },
  });

  const loadProfile = useCallback(async () => {
    try {
      const personal = await (await fetch('/user/personal')).json();
      form.setValue('fullname', personal.name || '');
      form.setValue('bio', personal.bio || '');
      form.setValue('picture', personal.picture);
    } catch {
      // Fallback
    }
  }, [fetch, form]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <div className="w-full max-w-5xl mx-auto p-8 pt-10 font-sans min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Manage your account profile, preferences, security, and connected apps
        </p>
      </div>

      {/* Tabbed Card Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <nav className="flex space-x-6 overflow-x-auto">
            {[
              { id: 'profile', label: 'Profile' },
              { id: 'security', label: 'Email & Security' },
              { id: 'notifications', label: 'Notifications' },
              { id: 'preferences', label: 'Platform & Weekly Goal' },
              { id: 'apps', label: 'Connected Apps' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={clsx(
                  'whitespace-nowrap pb-2 text-xs font-semibold border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <FormProvider {...form}>
            <div className="space-y-6">
              <GlobalSettings />
            </div>
          </FormProvider>
        )}

        {/* Tab 2: Email & Security */}
        {activeTab === 'security' && (
          <div className="space-y-6 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-600 p-2.5 rounded-xl cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400 mt-1">Your registered Harlo Social account email</p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Password & Security</h3>
              <button
                onClick={() => toast.show('Password reset link sent to your email', 'success')}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm"
              >
                Send Password Reset Email
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-5 max-w-xl">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Notification Preferences</h3>
            
            <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-slate-900">Weekly Summary Digest</div>
                <div className="text-[11px] text-slate-500">Receive a weekly overview of post performance</div>
              </div>
              <input
                type="checkbox"
                checked={emailDigest}
                onChange={(e) => setEmailDigest(e.target.checked)}
                className="text-emerald-500 focus:ring-emerald-400 w-4 h-4 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-slate-900">Failed Post Alerts</div>
                <div className="text-[11px] text-slate-500">Instant notification if a post fails to publish</div>
              </div>
              <input
                type="checkbox"
                checked={postAlerts}
                onChange={(e) => setPostAlerts(e.target.checked)}
                className="text-emerald-500 focus:ring-emerald-400 w-4 h-4 rounded"
              />
            </label>
          </div>
        )}

        {/* Tab 4: Platform & Weekly Goal */}
        {activeTab === 'preferences' && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Weekly Posting Goal</h3>
              <p className="text-xs text-slate-500 mb-3">Set target posts per week to track posting consistency</p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={weeklyGoal}
                  onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                  className="w-24 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 p-2.5 rounded-xl text-center"
                />
                <span className="text-xs text-slate-500 font-medium">posts / week</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Timezone</h3>
              <p className="text-xs text-slate-500 mb-2">Default schedule timezone</p>
              <input
                type="text"
                disabled
                value={Intl.DateTimeFormat().resolvedOptions().timeZone}
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-600 p-2.5 rounded-xl cursor-not-allowed"
              />
            </div>
          </div>
        )}

        {/* Tab 5: Connected Apps */}
        {activeTab === 'apps' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Approved Applications</h3>
              <p className="text-xs text-slate-500 mb-4">OAuth apps and third-party tools connected to your account</p>
              <ApprovedAppsComponent />
            </div>

            {user?.tier?.webhooks && (
              <div className="pt-6 border-t border-slate-100">
                <Webhooks />
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
