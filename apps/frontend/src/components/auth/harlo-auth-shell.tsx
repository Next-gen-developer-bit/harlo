'use client';

import { ReactNode, useEffect, useState, Suspense } from 'react';
import { HarloSocialLogoIcon } from '@gitroom/frontend/components/brand/logo.icon';
import ReturnUrlComponent from '@gitroom/frontend/app/(app)/auth/return.url.component';

const headlines = [
  { label: 'marketers', className: 'text-[#7B61FF]' },
  { label: 'agencies', className: 'text-[#3D5AFE]' },
  { label: 'consultants', className: 'text-[#2B8AEE]' },
  { label: 'growing businesses', className: 'text-[#7B61FF]' },
];

const week = [
  { day: 'Mon', date: '12' },
  { day: 'Tue', date: '13' },
  { day: 'Wed', date: '14', today: true },
  { day: 'Thu', date: '15' },
  { day: 'Fri', date: '16' },
  { day: 'Sat', date: '17' },
  { day: 'Sun', date: '18' },
];

const posts: Record<
  string,
  { title: string; time: string; color: string; icon: string }[]
> = {
  '12': [
    { title: 'Product teaser', time: '9:00', color: '#FDECF3', icon: 'instagram' },
    { title: 'Case study', time: '2:30', color: '#EAF1FF', icon: 'linkedin' },
  ],
  '13': [
    { title: 'Behind the scenes', time: '11:00', color: '#EEF0FF', icon: 'tiktok' },
  ],
  '14': [
    { title: 'Weekly roundup', time: '9:00', color: '#EAF1FF', icon: 'facebook' },
    { title: 'Tutorial', time: '5:00', color: '#FDECF3', icon: 'youtube' },
  ],
  '15': [
    { title: 'Carousel', time: '1:00', color: '#FDECF3', icon: 'instagram' },
  ],
  '16': [
    { title: 'Announcement', time: '9:00', color: '#F5F6F8', icon: 'x' },
    { title: 'Quick update', time: '6:00', color: '#EEF0FF', icon: 'threads' },
  ],
  '18': [
    { title: 'Inspiration board', time: '10:00', color: '#FDECF3', icon: 'pinterest' },
  ],
};

function PlatformMark({ name }: { name: string }) {
  const map: Record<string, { bg: string; letter: string }> = {
    instagram: { bg: 'linear-gradient(135deg,#F58529,#DD2A7B,#8134AF)', letter: '' },
    linkedin: { bg: '#0A66C2', letter: 'in' },
    tiktok: { bg: '#111', letter: '' },
    facebook: { bg: '#1877F2', letter: 'f' },
    youtube: { bg: '#FF0000', letter: '' },
    x: { bg: '#111', letter: 'X' },
    threads: { bg: '#111', letter: '@' },
    pinterest: { bg: '#E60023', letter: 'P' },
  };
  const item = map[name] || { bg: '#111', letter: name[0]?.toUpperCase() || '' };
  return (
    <span
      className="mt-[1px] inline-flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white"
      style={{ background: item.bg }}
      aria-hidden="true"
    >
      {name === 'instagram' ? (
        <span className="h-[8px] w-[8px] rounded-full border border-white" />
      ) : name === 'tiktok' ? (
        <span className="text-[9px] leading-none">♪</span>
      ) : name === 'youtube' ? (
        <span className="ml-[1px] h-0 w-0 border-y-[3px] border-y-transparent border-l-[5px] border-l-white" />
      ) : (
        item.letter
      )}
    </span>
  );
}

function CalendarMock() {
  return (
    <div className="overflow-hidden rounded-[22px] border border-[#E6ECF1] bg-white shadow-[0_24px_80px_rgba(20,30,50,0.08)]">
      <div className="flex items-center gap-2 border-b border-[#EEF2F6] px-4 py-3 text-[12.5px] text-[#6B7280]">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#111] text-[10px] font-bold text-white">
          H
        </span>
        app.harlosocial.com
      </div>
      <div className="flex min-h-[430px]">
        <div className="hidden w-[64px] flex-col items-center gap-3 border-r border-[#EEF2F6] py-4 sm:flex">
          <div className="h-8 w-8 rounded-full bg-[#3D5AFE]" />
          <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#EEF0FF] text-[#3D5AFE]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="5"
                width="18"
                height="16"
                rx="3"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path d="M3 10h18" stroke="currentColor" strokeWidth="1.7" />
              <path
                d="M8 3v4M16 3v4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </div>
          {['share', 'image', 'chart'].map((icon) => (
            <div
              key={icon}
              className="flex h-9 w-9 items-center justify-center rounded-[12px] text-[#9AA3AE]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                {icon === 'share' && (
                  <>
                    <circle cx="18" cy="5" r="2.2" stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="6" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="18" cy="19" r="2.2" stroke="currentColor" strokeWidth="1.6" />
                    <path
                      d="M8 12.8 16 18.2M16 5.8 8 11.2"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                  </>
                )}
                {icon === 'image' && (
                  <>
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <circle cx="8.5" cy="10" r="1.5" fill="currentColor" />
                    <path
                      d="M3 16l5-4 4 3 3-2.5 6 4.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                  </>
                )}
                {icon === 'chart' && (
                  <>
                    <path
                      d="M4 19V5M4 19h16"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8 15v-4M12 15V8M16 15v-6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </>
                )}
              </svg>
            </div>
          ))}
        </div>
        <div className="min-w-0 flex-1 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="truncate text-[14px] font-medium text-[#6B7280]">
              <span className="me-2 inline-block h-2.5 w-2.5 rounded-full bg-[#E5E7EB]" />
              Bloom & Co / Calendar
            </div>
            <div className="rounded-full bg-[#3D5AFE] px-3.5 py-1.5 text-[12px] font-semibold text-white">
              New Post
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {week.map((item) => (
              <div key={item.date} className="min-h-[250px] rounded-[16px] bg-[#F7F9FB] p-2">
                <div className="mb-2 text-center">
                  <div className="text-[11px] text-[#9AA3AE]">{item.day}</div>
                  <div
                    className={
                      item.today
                        ? 'mx-auto mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#3D5AFE] text-[13px] font-semibold text-white'
                        : 'mt-1 text-[13px] font-medium text-[#111]'
                    }
                  >
                    {item.date}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  {(posts[item.date] || []).map((post) => (
                    <div
                      key={post.title}
                      className="rounded-[10px] px-1.5 py-1.5"
                      style={{ background: post.color }}
                    >
                      <div className="flex items-start gap-1">
                        <PlatformMark name={post.icon} />
                        <div className="min-w-0">
                          <div className="truncate text-[10.5px] font-semibold leading-tight text-[#111]">
                            {post.title}
                          </div>
                          <div className="text-[10px] text-[#6B7280]">{post.time}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center text-[11px] text-[#9AA3AE] lg:hidden">
            Mon–Wed shown · full week on desktop
          </div>
        </div>
      </div>
    </div>
  );
}

function RotatingHeadline() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % headlines.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);
  const current = headlines[index];
  return (
    <h1 className="text-[2.25rem] font-semibold leading-[1.15] text-[#111] sm:text-[2.75rem] lg:text-[3.25rem]">
      Built for
      <br className="sm:hidden" />{' '}
      <span className={`inline-block ${current.className}`}>{current.label}</span>
      <span className="sr-only">
        {' '}
        marketers, agencies, consultants and growing businesses
      </span>
    </h1>
  );
}

export function AuthCard({ children }: { children?: ReactNode }) {
  return (
    <div className="w-full max-w-[440px] rounded-[28px] border border-[#E6ECF1] bg-white p-8 shadow-[0_30px_80px_-30px_rgba(20,20,40,0.18)] sm:p-10">
      <div className="flex justify-center">
        <a href="/" aria-label="Harlo Social home" className="flex items-center gap-2.5">
          <HarloSocialLogoIcon className="h-8 w-8" />
          <span className="text-[22px] font-semibold tracking-[-0.4px]">Harlo</span>
        </a>
      </div>
      {children}
    </div>
  );
}

export function AuthMarketingPanel() {
  return (
    <div className="w-full max-w-[720px]">
      <RotatingHeadline />
      <p className="mt-6 text-[22px] font-medium text-[#111]">
        Social media management, made simple.
      </p>
      <p className="mt-2 max-w-[520px] text-[15px] leading-6 text-[#60656C]">
        Plan, publish and grow across every channel from one workspace.
      </p>
      <div className="mt-8">
        <CalendarMock />
      </div>
    </div>
  );
}

export function AuthSplitLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F8F9FA] text-[#111] lg:flex-row">
      <Suspense fallback={null}>
        <ReturnUrlComponent />
      </Suspense>
      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:py-16">
        <AuthCard>{children}</AuthCard>
      </div>
      <div className="hidden flex-1 items-center justify-center px-6 pb-14 sm:px-10 lg:flex lg:px-14 lg:py-16">
        <AuthMarketingPanel />
      </div>
    </div>
  );
}

export function HarloAuthShell({ children }: { children?: ReactNode }) {
  return <AuthSplitLayout>{children}</AuthSplitLayout>;
}
