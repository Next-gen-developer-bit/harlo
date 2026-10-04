'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { useUser } from '@gitroom/frontend/components/layout/user.context';
import { GlobalSettings } from '@gitroom/frontend/components/settings/global.settings';
import { ApprovedAppsComponent } from '@gitroom/frontend/components/approved-apps/approved-apps.component';
import { Webhooks } from '@gitroom/frontend/components/webhooks/webhooks';
import { showMediaBox } from '@gitroom/frontend/components/media/media.component';
import { useMediaDirectory } from '@gitroom/react/helpers/use.media.directory';
import clsx from 'clsx';

type ProfilePicture = {
  id: string;
  path: string;
} | null;

type PersonalProfile = {
  id?: string;
  name?: string | null;
  bio?: string | null;
  picture?: ProfilePicture;
};

export const SettingsPopup = () => {
  const fetch = useFetch();
  const toast = useToaster();
  const user = useUser();
  const mediaDirectory = useMediaDirectory();
  const [sendingReset, setSendingReset] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [activeTab, setActiveTab] = useState<
    'profile' | 'security' | 'notifications' | 'preferences' | 'apps'
  >('profile');
  const [weeklyGoal, setWeeklyGoal] = useState<number>(5);
  const [emailDigest, setEmailDigest] = useState<boolean>(true);
  const [postAlerts, setPostAlerts] = useState<boolean>(true);

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [picture, setPicture] = useState<ProfilePicture>(null);

  const loadProfile = useCallback(async () => {
    setLoadingProfile(true);
    try {
      const personal = (await (
        await fetch('/user/personal')
      ).json()) as PersonalProfile;
      setDisplayName(personal?.name || '');
      setBio(personal?.bio || '');
      setPicture(personal?.picture || null);
    } catch {
      setDisplayName(user?.name || '');
    } finally {
      setLoadingProfile(false);
    }
  }, [fetch, user?.name]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const openMedia = useCallback(() => {
    showMediaBox((selected) => {
      if (!selected?.id || !selected?.path) {
        return;
      }
      setPicture({
        id: selected.id,
        path: selected.path,
      });
    });
  }, []);

  const saveProfile = useCallback(async () => {
    const fullname = displayName.trim();
    if (fullname.length < 2) {
      toast.show('Display name must be at least 2 characters', 'warning');
      return;
    }
    setSavingProfile(true);
    try {
      const response = await fetch('/user/personal', {
        method: 'POST',
        body: JSON.stringify({
          fullname,
          bio: bio.trim(),
          ...(picture ? { picture } : {}),
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = Array.isArray(payload?.message)
          ? payload.message[0]
          : payload?.message;
        toast.show(
          typeof message === 'string' && message
            ? message
            : 'Could not save your profile',
          'warning'
        );
        return;
      }
      toast.show('Profile updated', 'success');
      await loadProfile();
    } catch {
      toast.show('Could not save your profile', 'warning');
    } finally {
      setSavingProfile(false);
    }
  }, [bio, displayName, fetch, loadProfile, picture, toast]);

  const photoSrc = picture?.path
    ? mediaDirectory.set(picture.path)
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        user?.email || displayName || 'Harlo Social'
      )}`;

  return (
    <div className="w-full max-w-5xl mx-auto p-8 pt-6 font-sans min-h-screen">
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
                    ? 'border-blue-500 text-blue-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'profile' && (
          <div className="max-w-xl space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Profile</h3>
              <p className="mt-1 text-xs text-slate-500">
                Update the display name and photo shown across Harlo Social.
              </p>
            </div>

            {loadingProfile ? (
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-8 text-center text-xs text-slate-400">
                Loading profile…
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <img
                    src={photoSrc}
                    alt="Profile"
                    className="h-20 w-20 rounded-full border border-slate-200 object-cover bg-slate-50"
                  />
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={openMedia}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                    >
                      Change photo
                    </button>
                    {picture && (
                      <button
                        type="button"
                        onClick={() => setPicture(null)}
                        className="block text-xs font-medium text-slate-500 hover:text-red-600"
                      >
                        Remove photo
                      </button>
                    )}
                    <p className="text-[11px] text-slate-400">
                      Choose an image from your media library.
                    </p>
                  </div>
                </div>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Display name
                  </span>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Bio
                  </span>
                  <textarea
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    placeholder="A short bio for your account"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500"
                  />
                </label>

                <button
                  type="button"
                  disabled={savingProfile}
                  onClick={saveProfile}
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingProfile ? 'Saving…' : 'Save profile'}
                </button>
              </>
            )}

            <div className="border-t border-slate-100 pt-6">
              <GlobalSettings />
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-600 p-2.5 rounded-xl cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Your registered Harlo Social account email
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                Password & Security
              </h3>
              {user?.providerName === 'LOCAL' ? (
                <button
                  disabled={sendingReset}
                  onClick={async () => {
                    if (!user?.email) {
                      toast.show('No email found on this account', 'warning');
                      return;
                    }
                    setSendingReset(true);
                    try {
                      const response = await fetch('/auth/forgot', {
                        method: 'POST',
                        body: JSON.stringify({ email: user.email }),
                      });
                      if (!response.ok) {
                        toast.show(
                          'Could not send password reset email',
                          'warning'
                        );
                        return;
                      }
                      toast.show(
                        'Password reset link sent to your email',
                        'success'
                      );
                    } catch {
                      toast.show(
                        'Could not send password reset email',
                        'warning'
                      );
                    } finally {
                      setSendingReset(false);
                    }
                  }}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                >
                  {sendingReset ? 'Sending...' : 'Send Password Reset Email'}
                </button>
              ) : (
                <p className="text-xs text-slate-500">
                  This account signs in with Google. There is no password to
                  reset — use Continue with Google on the login page.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-5 max-w-xl">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Notification Preferences
            </h3>

            <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Weekly Summary Digest
                </div>
                <div className="text-[11px] text-slate-500">
                  Receive a weekly overview of post performance
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailDigest}
                onChange={(e) => setEmailDigest(e.target.checked)}
                className="text-blue-500 focus:ring-blue-400 w-4 h-4 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Failed Post Alerts
                </div>
                <div className="text-[11px] text-slate-500">
                  Instant notification if a post fails to publish
                </div>
              </div>
              <input
                type="checkbox"
                checked={postAlerts}
                onChange={(e) => setPostAlerts(e.target.checked)}
                className="text-blue-500 focus:ring-blue-400 w-4 h-4 rounded"
              />
            </label>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                Weekly Posting Goal
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Set target posts per week to track posting consistency
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={weeklyGoal}
                  onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                  className="w-24 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 p-2.5 rounded-xl text-center"
                />
                <span className="text-xs text-slate-500 font-medium">
                  posts / week
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Timezone</h3>
              <p className="text-xs text-slate-500 mb-2">
                Default schedule timezone
              </p>
              <input
                type="text"
                disabled
                value={Intl.DateTimeFormat().resolvedOptions().timeZone}
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-600 p-2.5 rounded-xl cursor-not-allowed"
              />
            </div>
          </div>
        )}

        {activeTab === 'apps' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                Approved Applications
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                OAuth apps and third-party tools connected to your account
              </p>
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
