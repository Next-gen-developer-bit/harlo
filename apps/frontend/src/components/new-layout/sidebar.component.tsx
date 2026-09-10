'use client';

import React, {
  FC,
  useCallback,
  useMemo,
  useState,
} from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useUser } from '@gitroom/frontend/components/layout/user.context';
import { useVariables } from '@gitroom/react/helpers/variable.context';
import { deleteDialog } from '@gitroom/react/helpers/delete.dialog';
import { setCookie } from '@gitroom/frontend/components/layout/layout.context';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { CreatePostModal } from '@gitroom/frontend/components/new-launch/create.post.modal';
import { FeedbackModal } from '@gitroom/frontend/components/feedback/feedback.modal';
import { useOrganizations } from '@gitroom/frontend/components/layout/use.organizations';
import { useClickAway } from '@uidotdev/usehooks';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SIDEBAR STYLES — Harlo Social Official Brand Identity (#2563EB Primary Blue)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SIDEBAR_STYLES = `
.pb-sidebar,
.pb-sidebar * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.pb-sidebar {
  display: flex;
  flex-direction: column;
  width: 240px;
  min-width: 240px;
  max-width: 240px;
  height: 100%;
  background: #ffffff !important;
  color: #334155 !important;
  border-right: 1px solid #f1f5f9;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  overflow: hidden;
  user-select: none;
}

/* ── Brand ── */
.pb-sidebar .pb-brand {
  display: flex;
  align-items: center;
  padding: 18px 20px 14px;
  flex-shrink: 0;
  text-decoration: none;
}
.pb-sidebar .pb-brand-mark {
  height: 28px;
  width: auto;
  display: block;
}

/* ── Workspace Box ── */
.pb-ws-wrap {
  position: relative;
  padding: 0 14px 12px;
}
.pb-ws-box {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.15s ease;
}
.pb-ws-box:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}
.pb-ws-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: transparent;
}
.pb-ws-avatar img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}
.pb-ws-info {
  flex: 1;
  text-align: left;
  overflow: hidden;
}
.pb-ws-name {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pb-ws-plan {
  font-size: 11px;
  color: #64748b !important;
}

/* ── Create Post CTA ── */
.pb-create-wrap {
  padding: 0 14px 14px;
}
.pb-create-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px 16px;
  border-radius: 10px;
  background: #2563eb !important;
  color: #ffffff !important;
  font-size: 13.5px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.25);
}
.pb-create-btn:hover {
  background: #1d4ed8 !important;
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.35);
}

/* ── Navigation List ── */
.pb-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 14px 14px;
}
.pb-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 12px;
}
.pb-sec {
  padding: 8px 10px 4px;
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8 !important;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.pb-nav {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 500;
  color: #475569 !important;
  background: transparent;
  text-decoration: none;
  transition: all 0.12s ease;
  cursor: pointer;
}
.pb-nav:hover {
  background: #f8fafc;
  color: #0f172a !important;
}
.pb-nav--active {
  background: #eff6ff !important;
  color: #2563eb !important;
  font-weight: 600;
}
.pb-nav-icon {
  display: flex;
  align-items: center;
  color: #64748b;
  width: 18px;
  height: 18px;
}
.pb-nav--active .pb-nav-icon {
  color: #2563eb !important;
}

/* ── User Profile Footer ── */
.pb-user-footer {
  position: relative;
  padding: 12px 14px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: background 0.15s;
}
.pb-user-footer:hover {
  background: #f8fafc;
}
.pb-user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
.pb-user-info {
  flex: 1;
  overflow: hidden;
}
.pb-user-name {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pb-user-email {
  font-size: 11px;
  color: #64748b !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pb-menu {
  position: absolute;
  z-index: 40;
  min-width: 212px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  padding: 6px;
}
.pb-menu button,
.pb-menu a {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #334155 !important;
  background: transparent;
  border: none;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
}
.pb-menu button:hover,
.pb-menu a:hover {
  background: #eff6ff;
  color: #2563eb !important;
}
.pb-menu-label {
  padding: 6px 10px 4px;
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
}
`;

const NavItem: FC<{
  icon: React.ReactNode;
  label: string;
  path: string;
  match?: (p: string) => boolean;
}> = ({ icon, label, path, match }) => {
  const pathname = usePathname();
  const search = useSearchParams();
  const href = search.toString() ? `${pathname}?${search.toString()}` : pathname;
  const isActive = match ? match(href) : pathname === path;

  return (
    <Link href={path} className={`pb-nav ${isActive ? 'pb-nav--active' : ''}`}>
      <span className="pb-nav-icon">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

const planLabel = (current?: string) => {
  switch (current) {
    case 'STANDARD':
      return 'Creator';
    case 'PRO':
    case 'TEAM':
      return 'Pro';
    case 'ULTIMATE':
      return 'Agency';
    default:
      return 'Free';
  }
};
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CREATE WORKSPACE MODAL STYLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const CREATE_WS_MODAL_STYLES = `
@keyframes cwm-slideUp {
  from { opacity: 0; transform: translateY(16px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes cwm-fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.cwm-overlay {
  position: fixed;
  inset: 0;
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(6px);
  animation: cwm-fadeIn 0.2s ease;
}
.cwm-card {
  width: 100%;
  max-width: 420px;
  margin: 16px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow:
    0 25px 60px rgba(15, 23, 42, 0.18),
    0 4px 16px rgba(37, 99, 235, 0.08);
  overflow: hidden;
  animation: cwm-slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.cwm-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 28px 0;
  gap: 14px;
}
.cwm-icon-ring {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.30);
}
.cwm-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
}
.cwm-subtitle {
  font-size: 13.5px;
  color: #64748b;
  text-align: center;
  line-height: 1.5;
}
.cwm-body {
  padding: 24px 28px 8px;
}
.cwm-field {
  position: relative;
}
.cwm-input {
  width: 100%;
  padding: 14px 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  color: #0f172a;
  background: #f8fafc;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
}
.cwm-input::placeholder {
  color: #94a3b8;
}
.cwm-input:focus {
  border-color: #2563eb;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}
.cwm-footer {
  display: flex;
  gap: 10px;
  padding: 20px 28px 24px;
  justify-content: flex-end;
}
.cwm-btn {
  padding: 10px 22px;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
}
.cwm-btn-cancel {
  background: #f1f5f9;
  color: #475569;
}
.cwm-btn-cancel:hover {
  background: #e2e8f0;
  color: #0f172a;
}
.cwm-btn-create {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}
.cwm-btn-create:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
  transform: translateY(-1px);
}
.cwm-btn-create:active {
  transform: translateY(0);
}
.cwm-btn-create:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
`;

const CreateWorkspaceModal: FC<{
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    // Auto-focus input on mount
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || loading) return;
    setLoading(true);
    try {
      await onSubmit(name);
    } catch {
      setLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CREATE_WS_MODAL_STYLES }} />
      <div className="cwm-overlay" onClick={onClose}>
        <div className="cwm-card" onClick={(e) => e.stopPropagation()}>
          <div className="cwm-header">
            <div className="cwm-icon-ring">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="cwm-title">Create Workspace</div>
            <div className="cwm-subtitle">
              Give your new workspace a name to get started.
            </div>
          </div>
          <div className="cwm-body">
            <div className="cwm-field">
              <input
                ref={inputRef}
                className="cwm-input"
                type="text"
                placeholder="e.g. My Brand, Marketing Team…"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmit();
                  if (e.key === 'Escape') onClose();
                }}
                disabled={loading}
                maxLength={64}
              />
            </div>
          </div>
          <div className="cwm-footer">
            <button className="cwm-btn cwm-btn-cancel" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button
              className="cwm-btn cwm-btn-create"
              onClick={handleSubmit}
              disabled={!name.trim() || loading}
            >
              {loading ? 'Creating…' : 'Create Workspace'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};


export const Sidebar: FC = () => {
  const router = useRouter();
  const modals = useModals();
  const user = useUser();
  const fetch = useFetch();
  const { isSecured } = useVariables();
  const { data: organizations } = useOrganizations();
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const workspaceRef = useClickAway<HTMLDivElement>(() => setWorkspaceOpen(false));
  const accountRef = useClickAway<HTMLDivElement>(() => setAccountOpen(false));

  const otherWorkspaces = useMemo(
    () => (organizations || []).filter((org: { id: string }) => org.id !== user?.orgId),
    [organizations, user?.orgId]
  );

  const handleCreatePost = useCallback(() => {
    modals.openModal({
      id: 'create-post-modal',
      closeOnClickOutside: true,
      withCloseButton: false,
      classNames: {
        modal: 'w-[95%] max-w-[1000px] text-textColor p-0 bg-transparent shadow-none',
      },
      children: <CreatePostModal />,
    });
  }, [modals]);

  const openFeedback = useCallback(() => {
    modals.openModal({
      id: 'feedback-modal',
      closeOnClickOutside: true,
      withCloseButton: false,
      classNames: {
        modal: 'bg-transparent p-0 w-[95%] max-w-[450px]',
      },
      children: <FeedbackModal />,
    });
  }, [modals]);

  const changeWorkspace = useCallback(
    (id: string) => async () => {
      await fetch('/user/change-org', {
        method: 'POST',
        body: JSON.stringify({ id }),
      });
      window.location.reload();
    },
    [fetch]
  );

  const createWorkspace = useCallback(() => {
    modals.openModal({
      id: 'create-workspace-modal',
      closeOnClickOutside: true,
      removeLayout: true,
      children: (close) => (
        <CreateWorkspaceModal
          onClose={close}
          onSubmit={async (name: string) => {
            await fetch('/user/workspace', {
              method: 'POST',
              body: JSON.stringify({ name: name.trim() }),
            });
            close();
            window.location.href = '/overview';
          }}
        />
      ),
    });
  }, [fetch, modals]);

  const logout = useCallback(async () => {
    if (await deleteDialog('Are you sure you want to logout?', 'Yes, logout')) {
      if (!isSecured) {
        setCookie('auth', '', -10);
      } else {
        await fetch('/user/logout', { method: 'POST' });
      }
      window.location.href = '/';
    }
  }, [fetch, isSecured]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SIDEBAR_STYLES }} />
      <nav className="pb-sidebar">
        <Link href="/overview" className="pb-brand">
          <img
            src="/harlo-icon-wordmark-dark.png"
            alt="Harlo"
            className="pb-brand-mark"
          />
        </Link>

        <div className="pb-ws-wrap" ref={workspaceRef}>
          <div className="pb-ws-box">
            <button
              className="flex items-center gap-2.5 flex-1 min-w-0 text-left bg-transparent border-0 p-0 cursor-pointer"
              onClick={() => router.push('/overview')}
            >
              <div className="pb-ws-avatar">
                <img src="/harlo-icon-dark.png" alt="" />
              </div>
              <div className="pb-ws-info">
                <div className="pb-ws-name">{user?.orgName || 'My Workspace'}</div>
                <div className="pb-ws-plan">{planLabel(user?.tier?.current)} Plan</div>
              </div>
            </button>
            <button
              className="p-1 rounded-md hover:bg-slate-100"
              onClick={() => setWorkspaceOpen((open) => !open)}
              aria-label="Switch workspace"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          {workspaceOpen && (
            <div className="pb-menu" style={{ top: '100%', left: 14, right: 14 }}>
              <div className="pb-menu-label">Workspaces</div>
              {otherWorkspaces.map((org: { id: string; name: string }) => (
                <button key={org.id} onClick={changeWorkspace(org.id)}>
                  {org.name}
                </button>
              ))}
              <button onClick={createWorkspace}>Create workspace</button>
            </div>
          )}
        </div>

        {/* Create Post CTA */}
        <div className="pb-create-wrap">
          <button className="pb-create-btn" onClick={handleCreatePost}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Create Post
          </button>
        </div>

        {/* Scrollable Nav Items */}
        <div className="pb-scroll">
          {/* Main */}
          <div className="pb-group">
            <div className="pb-sec">Create</div>
            <NavItem
              path="/media"
              label="Bulk Tools"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
          </div>

          {/* Content */}
          <div className="pb-group">
            <div className="pb-sec">Posts</div>
            <NavItem
              path="/launches?display=month"
              label="Calendar"
              match={(p) =>
                (p.startsWith('/launches') || p === '/launches') &&
                !p.includes('state=')
              }
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
            <NavItem
              path="/launches?state=all"
              label="All"
              match={(p) => p.includes('state=all')}
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              }
            />
            <NavItem
              path="/launches?state=scheduled"
              label="Scheduled"
              match={(p) => p.includes('state=scheduled')}
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <NavItem
              path="/launches?state=published"
              label="Posted"
              match={(p) => p.includes('state=published')}
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              }
            />
            <NavItem
              path="/launches?state=failed"
              label="Failed"
              match={(p) => p.includes('state=failed')}
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              }
            />
            <NavItem
              path="/launches?state=draft"
              label="Drafts"
              match={(p) => p.includes('state=draft')}
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              }
            />
            <NavItem
              path="/analytics"
              label="Analytics"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v64 4 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2v12" />
                </svg>
              }
            />
          </div>

          {/* Workspace */}
          <div className="pb-group">
            <div className="pb-sec">Workspace</div>
            <NavItem
              path="/third-party"
              label="Connections"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              }
            />
            <NavItem
              path="/teams"
              label="Teams"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
          </div>

          {/* Settings */}
          <div className="pb-group">
            <div className="pb-sec">Configuration</div>
            <NavItem
              path="/settings"
              label="Settings"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
            <NavItem
              path="/api-keys"
              label="API Keys"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              }
            />
            <NavItem
              path="/billing"
              label="Billing"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              }
            />
          </div>

          {/* Support */}
          <div className="pb-group">
            <div className="pb-sec">Support</div>
            
            <button className="pb-nav" onClick={openFeedback}>
              <span className="pb-nav-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </span>
              <span>Share Feedback</span>
            </button>

            <NavItem
              path="/referral"
              label="Referral"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            <NavItem
              path="/docs"
              label="Docs"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
            />
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="pb-user-footer" ref={accountRef} onClick={() => setAccountOpen((open) => !open)}>
          <img
            src={user?.picture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Harlo Social'}
            alt="User"
            className="pb-user-avatar"
          />
          <div className="pb-user-info">
            <div className="pb-user-name">{user?.name || user?.email || 'Account'}</div>
            <div className="pb-user-email">{planLabel(user?.tier?.current)} Plan</div>
          </div>
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
          {accountOpen && (
            <div className="pb-menu" style={{ bottom: '100%', left: 14, right: 14 }}>
              <Link href="/settings" onClick={(event) => event.stopPropagation()}>
                Profile
              </Link>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  setAccountOpen(false);
                  setWorkspaceOpen(true);
                }}
              >
                Switch workspace
              </button>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  logout();
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};
