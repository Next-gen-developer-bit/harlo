'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { useUser } from '@gitroom/frontend/components/layout/user.context';
import { GlobalSettings } from '@gitroom/frontend/components/settings/global.settings';
import { ApprovedAppsComponent } from '@gitroom/frontend/components/approved-apps/approved-apps.component';
import { Webhooks } from '@gitroom/frontend/components/webhooks/webhooks';
import { showMediaBox } from '@gitroom/frontend/components/media/media.component';
import { useMediaDirectory } from '@gitroom/react/helpers/use.media.directory';
import { useSWRConfig } from 'swr';
import { useRouter } from 'next/navigation';
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
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const mediaDirectory = useMediaDirectory();

  const [activeTab, setActiveTab] = useState<
    'profile' | 'security' | 'notifications' | 'preferences' | 'apps'
  >('profile');

  // Profile State
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingDirect, setUploadingDirect] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [picture, setPicture] = useState<ProfilePicture>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security State
  const [sendingReset, setSendingReset] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loggingOutAll, setLoggingOutAll] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Preferences State
  const [weeklyGoal, setWeeklyGoal] = useState<number>(5);
  const [emailDigest, setEmailDigest] = useState<boolean>(true);
  const [postAlerts, setPostAlerts] = useState<boolean>(true);

  const loadProfile = useCallback(async () => {
    setLoadingProfile(true);
    try {
      const response = await fetch('/user/personal');
      const personal = (await response.json()) as PersonalProfile;
      setDisplayName(personal?.name || user?.name || '');
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
    showMediaBox((selected: any) => {
      const item = Array.isArray(selected) ? selected[0] : selected;
      if (!item?.id || !item?.path) {
        return;
      }
      setPicture({
        id: item.id,
        path: item.path,
      });
      toast.show('Photo selected. Click "Save profile" to save changes.', 'success');
    });
  }, [toast]);

  const handleDirectUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        toast.show('Please select a valid image file (.png, .jpg, .webp, etc.)', 'warning');
        return;
      }

      setUploadingDirect(true);
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/media/upload-simple', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data?.id || !data?.path) {
          const message = Array.isArray(data?.message)
            ? data.message[0]
            : data?.message;
          toast.show(
            typeof message === 'string' && message
              ? message
              : 'Could not upload photo',
            'warning'
          );
          return;
        }

        setPicture({
          id: data.id,
          path: data.path,
        });
        toast.show('Photo uploaded! Click "Save profile" to apply changes.', 'success');
      } catch {
        toast.show('Could not upload photo', 'warning');
      } finally {
        setUploadingDirect(false);
        if (event.target) event.target.value = '';
      }
    },
    [fetch, toast]
  );

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
          picture: picture ? { id: picture.id, path: picture.path } : null,
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
      toast.show('Profile updated successfully', 'success');
      await loadProfile();
      await mutate('/user/self');
    } catch {
      toast.show('Could not save your profile', 'warning');
    } finally {
      setSavingProfile(false);
    }
  }, [bio, displayName, fetch, loadProfile, mutate, picture, toast]);

  const handleChangePassword = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentPassword) {
        toast.show('Please enter your current password', 'warning');
        return;
      }
      if (newPassword.length < 8) {
        toast.show('New password must be at least 8 characters', 'warning');
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.show('New passwords do not match', 'warning');
        return;
      }

      setChangingPassword(true);
      try {
        const response = await fetch('/user/change-password', {
          method: 'POST',
          body: JSON.stringify({
            currentPassword,
            newPassword,
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
              : 'Could not change password',
            'warning'
          );
          return;
        }
        toast.show('Password changed successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } catch {
        toast.show('Could not change password', 'warning');
      } finally {
        setChangingPassword(false);
      }
    },
    [currentPassword, newPassword, confirmPassword, fetch, toast]
  );

  const handleSendResetEmail = useCallback(async () => {
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
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data?.forgot === false) {
        const message = Array.isArray(data?.message)
          ? data.message[0]
          : data?.message;
        toast.show(
          typeof message === 'string' && message
            ? message
            : 'Could not send password reset email. Ensure email delivery is configured.',
          'warning'
        );
        return;
      }
      toast.show(
        'Password reset link sent to your email. Please check your inbox.',
        'success'
      );
    } catch {
      toast.show('Could not send password reset email', 'warning');
    } finally {
      setSendingReset(false);
    }
  }, [user?.email, fetch, toast]);

  const handleLogoutAllDevices = useCallback(async () => {
    setLoggingOutAll(true);
    try {
      await fetch('/user/logout-all-devices', {
        method: 'POST',
      });
    } catch {
      // Proceed to clear cookies and redirect regardless of server/network response
    }

    // Clear client-accessible auth cookies
    document.cookie = 'auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'showorg=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'impersonate=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    toast.show('Logged out of all devices', 'success');
    setShowLogoutModal(false);
    setTimeout(() => {
      window.location.href = '/login';
    }, 300);
  }, [fetch, toast]);

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
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <img
                      src={photoSrc}
                      alt="Profile"
                      className="h-20 w-20 rounded-full border border-slate-200 object-cover bg-slate-50 shadow-inner"
                    />
                    {uploadingDirect && (
                      <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleDirectUpload}
                      className="hidden"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingDirect}
                        className="rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 shadow-xs transition-colors hover:bg-blue-100 disabled:opacity-50"
                      >
                        {uploadingDirect ? 'Uploading…' : 'Upload photo'}
                      </button>
                      <button
                        type="button"
                        onClick={openMedia}
                        className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50"
                      >
                        Choose from library
                      </button>
                      {picture && (
                        <button
                          type="button"
                          onClick={() => setPicture(null)}
                          className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors ml-1"
                        >
                          Remove photo
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Upload from your device or pick an image from your media library.
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
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 shadow-xs"
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
          <div className="space-y-8 max-w-xl">
            {/* Email Address Section */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-600 p-2.5 rounded-xl cursor-not-allowed font-medium"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Your registered Harlo Social account email
              </p>
            </div>

            {/* Password Section */}
            <div className="pt-6 border-t border-slate-100">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Password & Security
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Manage your account password and security credentials.
                </p>
              </div>

              {user?.providerName === 'LOCAL' ? (
                <div className="space-y-6">
                  {/* Direct Change Password Form */}
                  <form onSubmit={handleChangePassword} className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                    <div className="text-xs font-semibold text-slate-800">
                      Change Password
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        New Password (minimum 8 characters)
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        minLength={8}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        minLength={8}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
                    >
                      {changingPassword ? 'Updating password…' : 'Update password'}
                    </button>
                  </form>

                  {/* Password Reset Email Option */}
                  <div className="pt-2">
                    <div className="text-xs font-semibold text-slate-800 mb-1">
                      Reset Via Email
                    </div>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Need to reset your password via an email link? We will send a secure 20-minute reset link to your email.
                    </p>
                    <button
                      type="button"
                      disabled={sendingReset}
                      onClick={handleSendResetEmail}
                      className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs px-4 py-2 rounded-xl transition-colors shadow-xs disabled:opacity-50"
                    >
                      {sendingReset ? 'Sending link…' : 'Send Password Reset Email'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                  <div className="text-xs font-semibold text-blue-900">
                    Google Connected Account
                  </div>
                  <p className="mt-1 text-xs text-blue-700">
                    This account signs in with Google. Passwords and security are managed directly through your Google Account.
                  </p>
                </div>
              )}
            </div>

            {/* Logout of all devices */}
            <div className="pt-6 border-t border-slate-100">
              <div className="rounded-2xl border border-red-100 bg-red-50/40 p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-red-900">
                    Log out of all devices
                  </div>
                  <p className="text-xs text-red-700/80 mt-0.5">
                    Sign out of your account on all browsers and devices.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={loggingOutAll}
                  onClick={() => setShowLogoutModal(true)}
                  className="shrink-0 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60 shadow-xs"
                >
                  Log out all
                </button>
              </div>
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

      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Log out of all devices?
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              You will be signed out on all devices and will need to log back in.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={loggingOutAll}
                onClick={() => setShowLogoutModal(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loggingOutAll}
                onClick={handleLogoutAllDevices}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center gap-1.5"
              >
                {loggingOutAll && (
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                <span>{loggingOutAll ? 'Logging out…' : 'Log out of all'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
