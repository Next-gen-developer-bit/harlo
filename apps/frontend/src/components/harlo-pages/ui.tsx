'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Harlo design primitives
   Shared building blocks for every signed-in page so the app reads as one
   product: same shells, same cards, same pills, same table chrome.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const AppPage = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={clsx('w-full px-6 py-6 md:px-8 text-slate-800', className)}>
    {children}
  </div>
);

export const PageHeader = ({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) => (
  <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
    <div className="min-w-0">
      {eyebrow ? (
        <p className="mb-1 text-sm font-medium text-slate-500">{eyebrow}</p>
      ) : null}
      <h1 className="text-[30px] font-extrabold leading-tight tracking-tight text-slate-900">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      ) : null}
    </div>
    {children ? (
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    ) : null}
  </div>
);

export const Card = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <section
    className={clsx(
      'rounded-2xl border border-slate-200 bg-white',
      className
    )}
  >
    {children}
  </section>
);

export const CardHeader = ({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}) => (
  <div
    className={clsx(
      'flex items-start justify-between gap-4 px-5 pt-5',
      subtitle ? 'pb-3' : 'pb-4',
      className
    )}
  >
    <div className="min-w-0">
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
      {subtitle ? (
        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
      ) : null}
    </div>
    {action}
  </div>
);

export const ViewAllLink = ({
  href,
  children = 'View all',
}: {
  href: string;
  children?: ReactNode;
}) => (
  <Link
    href={href}
    className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
  >
    {children}
    <span aria-hidden>→</span>
  </Link>
);

/* ── Buttons ─────────────────────────────────────────────────────────── */

export const PrimaryButton = ({
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    {...rest}
    className={clsx(
      'inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
  >
    {children}
  </button>
);

export const PrimaryLink = ({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) => (
  <Link
    href={href}
    className={clsx(
      'inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700',
      className
    )}
  >
    {children}
  </Link>
);

export const SecondaryButton = ({
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    {...rest}
    className={clsx(
      'inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50',
      className
    )}
  >
    {children}
  </button>
);

export const GhostButton = ({
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    {...rest}
    className={clsx(
      'inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100',
      className
    )}
  >
    {children}
  </button>
);

/* ── Icons ───────────────────────────────────────────────────────────── */

export const Icon = ({
  path,
  className,
}: {
  path: string;
  className?: string;
}) => (
  <svg
    className={clsx('h-5 w-5', className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      d={path}
    />
  </svg>
);

export const ICONS = {
  calendar:
    'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  chart: 'M4 19V5M4 19h16M8 16v-5M12 16V8M16 16v-3',
  heart:
    'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  users:
    'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  eye: 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
  pen: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
  clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  check: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  alert:
    'M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z',
  image:
    'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  layers: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  megaphone: 'M3 11l18-5v12L3 14v-3zM11.6 16.8a3 3 0 11-5.8-1.6',
  link: 'M13.828 10.172a4 4 0 010 5.656l-4 4a4 4 0 01-5.656-5.656l1.5-1.5m14.144-1.828a4 4 0 00-5.656-5.656l-4 4a4 4 0 000 5.656l1.5 1.5',
  sparkles:
    'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  bolt: 'M13 10V3L4 14h7v7l9-11h-7z',
  plus: 'M12 4v16m8-8H4',
  filter: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L14 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 018 17v-3.586L3.293 6.707A1 1 0 013 6V4z',
  search: 'M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z',
  sort: 'M3 4h13M3 8h9M3 12h5m10-7v14m0 0l-3-3m3 3l3-3',
  upload: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
  boltChart: 'M13 10V3L4 14h7v7l9-11h-7z',
  refresh:
    'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  cursor: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122',
  trend: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  grid: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
  list: 'M4 6h16M4 10h16M4 14h16M4 18h16',
  bookmark:
    'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z',
  rocket:
    'M5 13l4 4L19 7m-8.5 9.5L9 20l-2 1 1-2 .5-3.5zM4 16l2.5-.5M20 4s-4 0-8 4-4 8-4 8',
  settings:
    'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
  shield:
    'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  book: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  bulb: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  share:
    'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z',
  smile:
    'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  hash: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14',
  x: 'M6 18L18 6M6 6l12 12',
  chevronRight: 'M9 5l7 7-7 7',
  chevronLeft: 'M15 19l-7-7 7-7',
  chevronDown: 'M19 9l-7 7-7-7',
} as const;

/* ── Stat cards ──────────────────────────────────────────────────────── */

export type StatTone =
  | 'blue'
  | 'violet'
  | 'orange'
  | 'emerald'
  | 'rose'
  | 'slate';

const TONE_TINT: Record<StatTone, string> = {
  blue: 'bg-blue-50 text-blue-600',
  violet: 'bg-violet-50 text-violet-600',
  orange: 'bg-orange-50 text-orange-500',
  emerald: 'bg-emerald-50 text-emerald-600',
  rose: 'bg-rose-50 text-rose-500',
  slate: 'bg-slate-100 text-slate-600',
};

export const StatCard = ({
  icon,
  tone = 'blue',
  label,
  value,
  note,
  trend,
}: {
  icon: string;
  tone?: StatTone;
  label: string;
  value: ReactNode;
  note?: string;
  trend?: { value: string; label?: string; direction?: 'up' | 'down' };
}) => (
  <Card className="flex items-start gap-4 p-5">
    <div
      className={clsx(
        'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
        TONE_TINT[tone]
      )}
    >
      <Icon path={icon} className="h-5 w-5" />
    </div>
    <div className="min-w-0">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-1 text-[26px] font-extrabold leading-none text-slate-900">
        {value}
      </div>
      {trend ? (
        <div
          className={clsx(
            'mt-2 flex items-center gap-1 text-[11px] font-semibold',
            trend.direction === 'down' ? 'text-rose-500' : 'text-emerald-600'
          )}
        >
          <span aria-hidden>{trend.direction === 'down' ? '↓' : '↑'}</span>
          {trend.value}
          {trend.label ? (
            <span className="font-medium text-slate-400">{trend.label}</span>
          ) : null}
        </div>
      ) : note ? (
        <div className="mt-2 text-[11px] font-medium text-slate-400">
          {note}
        </div>
      ) : null}
    </div>
  </Card>
);

/* ── Status pills ────────────────────────────────────────────────────── */

export type PostStatus =
  | 'published'
  | 'scheduled'
  | 'draft'
  | 'failed'
  | 'queued'
  | 'review';

const STATUS_STYLE: Record<PostStatus, { label: string; className: string }> = {
  published: { label: 'Published', className: 'bg-emerald-50 text-emerald-700' },
  scheduled: { label: 'Scheduled', className: 'bg-blue-50 text-blue-700' },
  draft: { label: 'Draft', className: 'bg-slate-100 text-slate-600' },
  failed: { label: 'Failed', className: 'bg-rose-50 text-rose-700' },
  queued: { label: 'Queued', className: 'bg-violet-50 text-violet-700' },
  review: { label: 'In review', className: 'bg-amber-50 text-amber-700' },
};

/** Maps the backend post `state` (+ release flags) to a design status. */
export const postStatus = (
  state?: string,
  options?: { queued?: boolean }
): PostStatus => {
  if (options?.queued) {
    return 'queued';
  }
  if (state === 'PUBLISHED') {
    return 'published';
  }
  if (state === 'ERROR') {
    return 'failed';
  }
  if (state === 'DRAFT') {
    return 'draft';
  }
  return 'scheduled';
};

export const StatusPill = ({
  status,
  label,
  className,
}: {
  status: PostStatus;
  label?: string;
  className?: string;
}) => {
  const style = STATUS_STYLE[status];
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold',
        style.className,
        className
      )}
    >
      {label || style.label}
    </span>
  );
};

export const Chip = ({
  children,
  tone = 'slate',
  className,
}: {
  children: ReactNode;
  tone?: StatTone | 'pink' | 'sky' | 'amber';
  className?: string;
}) => {
  const tints: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700',
    violet: 'bg-violet-50 text-violet-700',
    orange: 'bg-orange-50 text-orange-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    rose: 'bg-rose-50 text-rose-700',
    slate: 'bg-slate-100 text-slate-600',
    pink: 'bg-pink-50 text-pink-700',
    sky: 'bg-sky-50 text-sky-700',
    amber: 'bg-amber-50 text-amber-700',
  };
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold',
        tints[tone],
        className
      )}
    >
      {children}
    </span>
  );
};

/* ── Form controls ───────────────────────────────────────────────────── */

export const SearchInput = ({
  placeholder,
  value,
  onChange,
  className,
}: {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}) => (
  <div className={clsx('relative', className)}>
    <Icon
      path={ICONS.search}
      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
    />
    <input
      type="text"
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      placeholder={placeholder}
      className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500"
    />
  </div>
);

export const FilterSelect = ({
  icon,
  value,
  options,
  onChange,
  className,
}: {
  icon?: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange?: (value: string) => void;
  className?: string;
}) => (
  <div className={clsx('relative', className)}>
    {icon ? (
      <Icon
        path={icon}
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
      />
    ) : null}
    <select
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      className={clsx(
        'h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pr-9 text-sm font-medium text-slate-700 outline-none focus:border-blue-500',
        icon ? 'pl-9' : 'pl-3.5'
      )}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <Icon
      path={ICONS.chevronDown}
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
    />
  </div>
);

export const Toggle = ({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label: string;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={clsx(
      'relative h-6 w-11 shrink-0 rounded-full transition-colors',
      checked ? 'bg-blue-600' : 'bg-slate-200',
      disabled && 'cursor-not-allowed opacity-60'
    )}
  >
    <span
      className={clsx(
        'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all',
        checked ? 'left-[22px]' : 'left-0.5'
      )}
    />
  </button>
);

/* ── Tabs ────────────────────────────────────────────────────────────── */

export const TabBar = <T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: Array<{ value: T; label: string; count?: number }>;
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) => (
  <div
    className={clsx(
      'flex flex-wrap items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5',
      className
    )}
  >
    {tabs.map((tab) => {
      const active = tab.value === value;
      return (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={clsx(
            'inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm transition-colors',
            active
              ? 'bg-slate-100 font-semibold text-slate-900'
              : 'font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          )}
        >
          {tab.label}
          {tab.count != null ? (
            <span
              className={clsx(
                'rounded-md px-1.5 py-0.5 text-[11px] font-semibold',
                active
                  ? 'bg-slate-200 text-slate-700'
                  : 'bg-slate-100 text-slate-500'
              )}
            >
              {tab.count}
            </span>
          ) : null}
        </button>
      );
    })}
  </div>
);

export const UnderlineTabs = <T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: Array<{ value: T; label: string; icon?: string }>;
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) => (
  <div
    className={clsx(
      'flex flex-wrap items-center gap-6 border-b border-slate-200',
      className
    )}
  >
    {tabs.map((tab) => {
      const active = tab.value === value;
      return (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={clsx(
            '-mb-px inline-flex items-center gap-2 border-b-2 pb-3 text-sm transition-colors',
            active
              ? 'border-blue-600 font-semibold text-blue-600'
              : 'border-transparent font-medium text-slate-500 hover:text-slate-700'
          )}
        >
          {tab.icon ? <Icon path={tab.icon} className="h-4 w-4" /> : null}
          {tab.label}
        </button>
      );
    })}
  </div>
);

/* ── Media / platform helpers ────────────────────────────────────────── */

export const PLATFORM_LABEL: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  x: 'X',
  threads: 'Threads',
  pinterest: 'Pinterest',
  reddit: 'Reddit',
  bluesky: 'Bluesky',
  mastodon: 'Mastodon',
};

export const platformIconSrc = (identifier?: string) => {
  const family = (identifier || '').split('-')[0].toLowerCase();
  if (family === 'youtube') {
    return '/icons/platforms/youtube.svg';
  }
  return `/icons/platforms/${family || 'x'}.png`;
};

export const PlatformIcon = ({
  identifier,
  className,
}: {
  identifier?: string;
  className?: string;
}) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={platformIconSrc(identifier)}
    alt={PLATFORM_LABEL[identifier || ''] || 'Platform'}
    className={clsx('h-4 w-4 rounded-full object-contain', className)}
  />
);

export const stripCaption = (content?: string | null, fallback = 'Untitled post') =>
  (content || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim() || fallback;

export const postThumb = (image?: string | null) => {
  if (!image) {
    return null;
  }
  try {
    const parsed = JSON.parse(image);
    const first = Array.isArray(parsed) ? parsed[0] : parsed;
    return first?.thumbnail || first?.path || first?.url || null;
  } catch {
    return image.startsWith('http') || image.startsWith('/') ? image : null;
  }
};

export const Thumb = ({
  src,
  className,
  rounded = 'rounded-lg',
}: {
  src?: string | null;
  className?: string;
  rounded?: string;
}) => (
  <div
    className={clsx(
      'shrink-0 overflow-hidden bg-slate-100',
      rounded,
      className || 'h-10 w-10'
    )}
  >
    {src ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" className="h-full w-full object-cover" />
    ) : null}
  </div>
);

export const Avatar = ({
  name,
  src,
  className,
}: {
  name: string;
  src?: string | null;
  className?: string;
}) => {
  const initials =
    (name || 'A')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'A';
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className={clsx('shrink-0 rounded-full object-cover', className || 'h-9 w-9')}
      />
    );
  }
  return (
    <div
      className={clsx(
        'flex shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700',
        className || 'h-9 w-9'
      )}
    >
      {initials}
    </div>
  );
};

/** Deterministic avatar for a member/account without a picture. */
export const avatarFor = (seed?: string | null) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
    seed || 'Harlo Social'
  )}`;

/* ── Rail (right column) building blocks ─────────────────────────────── */

export const RailCard = ({
  icon,
  tone = 'blue',
  title,
  subtitle,
  action,
  children,
  className,
}: {
  icon: string;
  tone?: StatTone;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
}) => (
  <Card className={clsx('p-5', className)}>
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <div
          className={clsx(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
            TONE_TINT[tone]
          )}
        >
          <Icon path={icon} className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          {subtitle ? (
            <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
          ) : null}
        </div>
      </div>
      {action}
    </div>
    {children}
  </Card>
);

export const BulletList = ({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) => (
  <ul className={clsx('space-y-2', className)}>
    {items.map((item) => (
      <li key={item} className="flex items-start gap-2 text-xs text-slate-600">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
        {item}
      </li>
    ))}
  </ul>
);

export const EmptyState = ({
  icon,
  title,
  description,
  children,
  className,
}: {
  icon: string;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}) => (
  <div
    className={clsx(
      'flex flex-col items-center justify-center px-6 py-16 text-center',
      className
    )}
  >
    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-500">
      <Icon path={icon} className="h-9 w-9" />
    </div>
    <h3 className="text-base font-bold text-slate-900">{title}</h3>
    <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
      {description}
    </p>
    {children ? <div className="mt-5 flex gap-3">{children}</div> : null}
  </div>
);

export const Pagination = ({
  page,
  pages,
  onChange,
  summary,
}: {
  page: number;
  pages: number;
  onChange: (page: number) => void;
  summary?: string;
}) => (
  <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
    <p className="text-xs text-slate-500">{summary}</p>
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        aria-label="Previous page"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40"
      >
        <Icon path={ICONS.chevronLeft} className="h-4 w-4" />
      </button>
      {Array.from({ length: Math.min(pages, 5) }, (_, index) => index + 1).map(
        (item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={clsx(
              'h-8 w-8 rounded-lg text-xs font-semibold',
              item === page
                ? 'bg-blue-600 text-white'
                : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
            )}
          >
            {item}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => onChange(Math.min(pages, page + 1))}
        disabled={page >= pages}
        aria-label="Next page"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40"
      >
        <Icon path={ICONS.chevronRight} className="h-4 w-4" />
      </button>
    </div>
  </div>
);

/** Shared table chrome so every list page looks the same. */
export const Table = ({ children }: { children: ReactNode }) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[720px] text-left">{children}</table>
  </div>
);

export const Th = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => (
  <th
    className={clsx(
      'whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400',
      className
    )}
  >
    {children}
  </th>
);

export const Td = ({
  children,
  className,
  ...rest
}: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={clsx('px-4 py-3 align-middle text-sm text-slate-600', className)} {...rest}>
    {children}
  </td>
);

export const TrendText = ({
  value,
  label,
  direction = 'up',
}: {
  value: string;
  label?: string;
  direction?: 'up' | 'down';
}) => (
  <span
    className={clsx(
      'inline-flex items-center gap-1 text-[11px] font-semibold',
      direction === 'down' ? 'text-rose-500' : 'text-emerald-600'
    )}
  >
    <span aria-hidden>{direction === 'down' ? '↓' : '↑'}</span>
    {value}
    {label ? <span className="font-medium text-slate-400">{label}</span> : null}
  </span>
);
