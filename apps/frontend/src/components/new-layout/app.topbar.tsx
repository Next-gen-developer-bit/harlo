'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import NotificationComponent from '@gitroom/frontend/components/notifications/notification.component';
import { useUser } from '@gitroom/frontend/components/layout/user.context';
import { useOrganizations } from '@gitroom/frontend/components/layout/use.organizations';
import ModeComponent from '@gitroom/frontend/components/layout/mode.component';

const LIST_STATES = new Set([
  'all',
  'draft',
  'scheduled',
  'published',
  'failed',
]);

const titleForPath = (pathname: string, state: string | null) => {
  if (pathname === '/media' || pathname.startsWith('/media/')) {
    return 'Content Library';
  }
  if (pathname === '/queue' || pathname.startsWith('/queue/')) {
    return 'Queue';
  }
  if (pathname === '/workspaces' || pathname.startsWith('/workspaces/')) {
    return 'Workspaces';
  }
  if (pathname === '/campaigns' || pathname.startsWith('/campaigns/')) {
    return 'Campaigns';
  }
  if (pathname === '/teams' || pathname.startsWith('/teams/')) {
    return 'Team';
  }
  if (pathname === '/third-party' || pathname.startsWith('/third-party/')) {
    return 'Social Accounts';
  }
  if (pathname === '/analytics' || pathname.startsWith('/analytics/')) {
    return 'Analytics';
  }
  if (pathname === '/reports' || pathname.startsWith('/reports/')) {
    return 'Reports';
  }
  if (pathname === '/settings' || pathname.startsWith('/settings/')) {
    return 'Settings';
  }
  if (pathname === '/launches' || pathname.startsWith('/launches/')) {
    return state && LIST_STATES.has(state) ? 'Posts' : 'Calendar';
  }
  return '';
};

export const AppTopbar = () => {
  const router = useRouter();
  const user = useUser();
  const { data: organizations } = useOrganizations();
  const pathname = usePathname() || '';
  const searchParams = useSearchParams();
  const workspaceName =
    organizations?.find((org) => org.id === user?.orgId)?.name ||
    user?.orgName ||
    'Home';
  const pageTitle =
    pathname === '/overview' || pathname === '/dashboard'
      ? workspaceName
      : titleForPath(pathname, searchParams.get('state'));

  const openCreatePost = useCallback(() => {
    router.push('/compose?create=1');
  }, [router]);

  return (
    <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-100 bg-[#f8fafc]/95 px-6 py-3 backdrop-blur dark:border-slate-800 dark:bg-[#0f1419]/95 md:px-8">
      {pathname === '/overview' || pathname === '/dashboard' ? (
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">
            Current workspace
          </p>
          <h1 className="truncate text-[28px] font-semibold leading-tight tracking-[-0.03em] text-slate-900 dark:text-slate-100">
            {workspaceName}
          </h1>
        </div>
      ) : pageTitle ? (
        <h1 className="shrink-0 text-[32px] font-semibold leading-tight tracking-[-0.03em] text-slate-900 dark:text-slate-100">
          {pageTitle}
        </h1>
      ) : null}
      <div className="ml-auto flex shrink-0 items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
        <ModeComponent />
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
        <NotificationComponent />
      </div>
      <button
        type="button"
        onClick={openCreatePost}
        aria-label="Create post"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563eb] text-white shadow-sm hover:bg-blue-700"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
        </svg>
      </button>
      </div>
    </div>
  );
};
