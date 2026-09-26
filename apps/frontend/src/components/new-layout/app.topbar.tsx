'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import NotificationComponent from '@gitroom/frontend/components/notifications/notification.component';

export const AppTopbar = () => {
  const router = useRouter();

  const openCreatePost = useCallback(() => {
    router.push('/compose');
  }, [router]);

  return (
    <div className="sticky top-0 z-20 flex items-center justify-end gap-2 border-b border-slate-100 bg-[#f8fafc]/95 px-6 py-3 backdrop-blur md:px-8">
      <div className="relative w-full max-w-[320px]">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
          />
        </svg>
        <input
          readOnly
          onClick={() => router.push('/launches?state=all')}
          placeholder="Search posts, campaigns or accounts..."
          className="h-10 w-full cursor-pointer rounded-full border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600">
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
  );
};
