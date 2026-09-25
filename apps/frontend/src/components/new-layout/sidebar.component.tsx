'use client';

import React, { FC, useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useUser } from '@gitroom/frontend/components/layout/user.context';
import { useVariables } from '@gitroom/react/helpers/variable.context';
import { deleteDialog } from '@gitroom/react/helpers/delete.dialog';
import { setCookie } from '@gitroom/frontend/components/layout/layout.context';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { FeedbackModal } from '@gitroom/frontend/components/feedback/feedback.modal';
import { useOrganizations } from '@gitroom/frontend/components/layout/use.organizations';
import { useClickAway } from '@uidotdev/usehooks';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SIDEBAR STYLES — Harlo Social Official Brand Identity
   Matches the Harlo reference design exactly:
   - Clean white background
   - Section headers: uppercase, small, gray (#94a3b8)
   - Active item: light blue bg (#eff6ff), blue text (#2563eb)
   - Nav items: medium weight, #475569 text
   - User footer at bottom with email + plan
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
  border-right: 1px solid #e2e8f0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  overflow: hidden;
  user-select: none;
}

/* ── Brand ── */
.pb-sidebar .pb-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px 20px 16px;
  flex-shrink: 0;
  text-decoration: none;
}
.pb-sidebar .pb-brand-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #1a1a2e;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.pb-sidebar .pb-brand-icon svg {
  width: 16px;
  height: 16px;
}
.pb-sidebar .pb-brand-name {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a !important;
  letter-spacing: -0.02em;
}

/* ── Navigation Container with Always-Visible Custom Scrollbar / Side Line ── */
.pb-scroll-wrap {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
}
.pb-scroll {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 16px 14px 12px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.pb-scroll::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}
.pb-scrollbar-rail {
  position: absolute;
  top: 6px;
  bottom: 6px;
  right: 4px;
  width: 8px;
  background: #f1f5f9;
  border-radius: 9999px;
  cursor: pointer;
  z-index: 20;
  user-select: none;
  touch-action: none;
  transition: background-color 0.15s ease;
}
.pb-scrollbar-rail:hover {
  background: #e2e8f0;
}
.pb-scrollbar-thumb {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 48px;
  background: #94a3b8;
  border-radius: 9999px;
  cursor: grab;
  user-select: none;
  touch-action: none;
  transition: background-color 0.15s ease;
}
.pb-scrollbar-thumb:hover,
.pb-scrollbar-thumb:active {
  background: #64748b;
  cursor: grabbing;
}
.pb-group {
  display: flex;
  flex-direction: column;
  gap: 1px;
  margin-bottom: 4px;
}
.pb-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 8px 6px;
}
.pb-sec {
  padding: 8px 12px 4px;
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
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 500;
  color: #475569 !important;
  background: transparent;
  text-decoration: none;
  transition: all 0.12s ease;
  cursor: pointer;
  border: none;
  font-family: inherit;
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
  justify-content: center;
  color: #64748b;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
.pb-nav-icon svg {
  width: 18px;
  height: 18px;
}
.pb-nav--active .pb-nav-icon {
  color: #2563eb !important;
}

/* ── Help & Support ── */
.pb-help-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  margin: 4px 6px 4px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 500;
  color: #475569 !important;
  background: transparent;
  text-decoration: none;
  transition: all 0.12s ease;
  cursor: pointer;
  border: none;
  font-family: inherit;
}
.pb-help-link:hover {
  background: #f8fafc;
  color: #0f172a !important;
}
.pb-help-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
.pb-help-icon svg {
  width: 18px;
  height: 18px;
}
.pb-help-ext {
  margin-left: auto;
  color: #94a3b8;
  display: flex;
  align-items: center;
}
.pb-help-ext svg {
  width: 14px;
  height: 14px;
}

/* ── User Profile Footer ── */
.pb-user-footer {
  position: relative;
  padding: 12px 14px;
  border-top: 1px solid #e8ecf1;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: background 0.15s;
  flex-shrink: 0;
}
.pb-user-footer:hover {
  background: #f8fafc;
}
.pb-user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.pb-user-info {
  flex: 1;
  overflow: hidden;
}
.pb-user-email {
  font-size: 13px;
  font-weight: 500;
  color: #0f172a !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pb-user-plan {
  font-size: 11px;
  color: #64748b !important;
}
.pb-user-chevron {
  color: #94a3b8;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.pb-user-chevron svg {
  width: 16px;
  height: 16px;
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
  font-family: inherit;
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

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ICONS — Matching the Harlo reference design
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const iconHome = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const iconCompose = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const iconCalendar = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const iconContentLibrary = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);
const iconPosts = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const iconQueue = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const iconWorkspaces = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);
const iconCampaigns = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
  </svg>
);
const iconTeam = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const iconSocialAccounts = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);
const iconOverview = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const iconReports = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const iconGeneralSettings = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const iconBilling = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);
const iconApiKeys = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);
const iconHelpSupport = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const iconExternalLink = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   NAV ITEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const NavItem: FC<{
  icon: React.ReactNode;
  label: string;
  path: string;
  match?: (p: string) => boolean;
}> = ({ icon, label, path, match }) => {
  const pathname = usePathname();
  const search = useSearchParams();
  const href = search.toString()
    ? `${pathname}?${search.toString()}`
    : pathname;
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
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
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
            <button
              className="cwm-btn cwm-btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
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

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SIDEBAR COMPONENT — Matches Harlo reference design exactly
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export const Sidebar: FC = () => {
  const router = useRouter();
  const modals = useModals();
  const user = useUser();
  const fetch = useFetch();
  const { isSecured } = useVariables();
  const { data: organizations } = useOrganizations();
  const [accountOpen, setAccountOpen] = useState(false);

  const accountRef = useClickAway<HTMLDivElement>(() => setAccountOpen(false));

  const otherWorkspaces = useMemo(
    () =>
      (organizations || []).filter(
        (org: { id: string }) => org.id !== user?.orgId
      ),
    [organizations, user?.orgId]
  );

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

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const railRef = React.useRef<HTMLDivElement>(null);
  const thumbRef = React.useRef<HTMLDivElement>(null);

  const isDraggingRef = React.useRef(false);
  const startYRef = React.useRef(0);
  const startScrollTopRef = React.useRef(0);
  const [thumbHeight, setThumbHeight] = useState(48);
  const [thumbTop, setThumbTop] = useState(0);

  const updateScrollbar = useCallback(() => {
    const el = scrollRef.current;
    const rail = railRef.current;
    if (!el || !rail) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    const trackHeight = rail.clientHeight;
    if (trackHeight <= 0) return;

    const scrollRange = scrollHeight - clientHeight;

    if (scrollRange <= 0) {
      const defaultH = Math.max(40, Math.min(80, trackHeight * 0.35));
      setThumbHeight(defaultH);
      if (!isDraggingRef.current) {
        setThumbTop(0);
      }
      return;
    }

    const ratio = clientHeight / scrollHeight;
    const h = Math.max(32, Math.min(trackHeight - 20, trackHeight * ratio));
    const availableTrack = trackHeight - h;
    const fraction = Math.max(0, Math.min(1, scrollTop / scrollRange));
    const top = fraction * availableTrack;

    setThumbHeight(h);
    if (!isDraggingRef.current) {
      setThumbTop(top);
    }
  }, []);

  React.useEffect(() => {
    updateScrollbar();
    window.addEventListener('resize', updateScrollbar);
    return () => window.removeEventListener('resize', updateScrollbar);
  }, [updateScrollbar]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const rail = railRef.current;
    const el = scrollRef.current;
    const thumb = thumbRef.current;
    if (!rail || !el || !thumb) return;

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    startScrollTopRef.current = el.scrollTop;

    if (e.target !== thumb) {
      const rect = rail.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const availableTrack = rect.height - thumbHeight;
      if (availableTrack > 0) {
        const targetThumbTop = Math.max(0, Math.min(availableTrack, clickY - thumbHeight / 2));
        const fraction = targetThumbTop / availableTrack;
        const scrollRange = el.scrollHeight - el.clientHeight;
        if (scrollRange > 0) {
          el.scrollTop = fraction * scrollRange;
        }
        setThumbTop(targetThumbTop);
        startScrollTopRef.current = el.scrollTop;
      }
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    e.stopPropagation();

    const el = scrollRef.current;
    const rail = railRef.current;
    if (!el || !rail) return;

    const deltaY = e.clientY - startYRef.current;
    const trackHeight = rail.clientHeight;
    const availableTrack = trackHeight - thumbHeight;
    if (availableTrack <= 0) return;

    const scrollRange = el.scrollHeight - el.clientHeight;
    if (scrollRange > 0) {
      const scrollDelta = (deltaY / availableTrack) * scrollRange;
      const newScrollTop = Math.max(0, Math.min(scrollRange, startScrollTopRef.current + scrollDelta));
      el.scrollTop = newScrollTop;

      const newFraction = newScrollTop / scrollRange;
      setThumbTop(newFraction * availableTrack);
    } else {
      const visualTop = Math.max(0, Math.min(availableTrack, deltaY));
      setThumbTop(visualTop);
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    updateScrollbar();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SIDEBAR_STYLES }} />
      <nav className="pb-sidebar">
        {/* ── Brand Logo ── */}
        <Link href="/overview" className="pb-brand">
          <img
            src="/harlo-icon-wordmark-dark.png"
            alt="Harlo"
            className="pb-brand-mark"
            style={{ height: 28, width: 'auto', display: 'block' }}
          />
        </Link>

        {/* ── Scrollable Nav Items with Always-Visible Rail ── */}
        <div className="pb-scroll-wrap">
          <div className="pb-scroll" ref={scrollRef} onScroll={updateScrollbar}>
            {/* Home (no section header) */}
            <div className="pb-group">
              <NavItem path="/overview" label="Home" icon={iconHome} />
            </div>

            {/* CREATE */}
            <div className="pb-group">
              <div className="pb-sec">Create</div>
              <NavItem path="/compose" label="Compose" icon={iconCompose} />
              <NavItem
                path="/launches"
                label="Calendar"
                match={(p) => p.startsWith('/launches') && !p.includes('state=')}
                icon={iconCalendar}
              />
              <NavItem path="/media" label="Content Library" icon={iconContentLibrary} />
              <NavItem
                path="/launches?state=all"
                label="Posts"
                match={(p) => p.includes('state=all') || p.includes('state=draft') || p.includes('state=scheduled') || p.includes('state=published') || p.includes('state=failed')}
                icon={iconPosts}
              />
              <NavItem path="/queue" label="Queue" icon={iconQueue} />
            </div>

            <div className="pb-divider" />

            {/* MANAGE */}
            <div className="pb-group">
              <div className="pb-sec">Manage</div>
              <NavItem path="/workspaces" label="Workspaces" icon={iconWorkspaces} />
              <NavItem path="/campaigns" label="Campaigns" icon={iconCampaigns} />
              <NavItem path="/teams" label="Team" icon={iconTeam} />
              <NavItem path="/third-party" label="Social Accounts" icon={iconSocialAccounts} />
            </div>

            <div className="pb-divider" />

            {/* ANALYTICS */}
            <div className="pb-group">
              <div className="pb-sec">Analytics</div>
              <NavItem path="/analytics" label="Overview" icon={iconOverview} />
              <NavItem path="/reports" label="Reports" icon={iconReports} />
            </div>

            <div className="pb-divider" />

            {/* SETTINGS */}
            <div className="pb-group">
              <div className="pb-sec">Settings</div>
              <NavItem path="/settings" label="General Settings" icon={iconGeneralSettings} />
              <NavItem path="/billing" label="Billing & Plan" icon={iconBilling} />
              <NavItem path="/api-keys" label="API Keys" icon={iconApiKeys} />
            </div>
          </div>

          {/* Always-visible custom scrollbar rail / side line */}
          <div
            className="pb-scrollbar-rail"
            ref={railRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            title="Scroll navigation"
          >
            <div
              className="pb-scrollbar-thumb"
              ref={thumbRef}
              style={{
                height: `${thumbHeight}px`,
                transform: `translateY(${thumbTop}px)`,
              }}
            />
          </div>
        </div>

        <div className="pb-divider" style={{ margin: '0 12px' }} />

        {/* ── Help & Support (standalone, above footer) ── */}
        <Link href="/docs" className="pb-help-link">
          <span className="pb-help-icon">{iconHelpSupport}</span>
          <span>Help & Support</span>
          <span className="pb-help-ext">{iconExternalLink}</span>
        </Link>

        {/* ── User Profile Footer ── */}
        <div
          className="pb-user-footer"
          ref={accountRef}
          onClick={() => setAccountOpen((open) => !open)}
        >
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
              user?.email || user?.name || 'Harlo Social'
            )}`}
            alt="User"
            className="pb-user-avatar"
          />
          <div className="pb-user-info">
            <div className="pb-user-email">
              {user?.email || user?.name || 'Account'}
            </div>
            <div className="pb-user-plan">
              {planLabel(user?.tier?.current)} Plan
            </div>
          </div>
          <span className="pb-user-chevron">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
          {accountOpen && (
            <div
              className="pb-menu"
              style={{ bottom: '100%', left: 14, right: 14 }}
            >
              <Link
                href="/settings"
                onClick={(event) => event.stopPropagation()}
              >
                Profile
              </Link>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  setAccountOpen(false);
                  openFeedback();
                }}
              >
                Share Feedback
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
