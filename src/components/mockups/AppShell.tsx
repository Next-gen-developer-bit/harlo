import type { ReactNode } from "react";
import {
  InstagramIcon,
  FacebookIcon,
  LinkedInIcon,
  TikTokIcon,
  YouTubeIcon,
  ThreadsIcon,
  PinterestIcon,
  XIcon,
} from "@/components/icons/PlatformIcons";
import { platformPastel } from "@/lib/platform-colors";

const chipIcons = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  linkedin: LinkedInIcon,
  tiktok: TikTokIcon,
  youtube: YouTubeIcon,
  threads: ThreadsIcon,
  pinterest: PinterestIcon,
  x: XIcon,
} as const;

export const chipPalette: Record<keyof typeof chipIcons, { bg: string; fg: string; Icon: typeof InstagramIcon }> =
  Object.fromEntries(
    (Object.keys(chipIcons) as (keyof typeof chipIcons)[]).map((slug) => [
      slug,
      { ...platformPastel[slug], Icon: chipIcons[slug] },
    ])
  ) as Record<keyof typeof chipIcons, { bg: string; fg: string; Icon: typeof InstagramIcon }>;

export function SidebarIcon({ active = false, children }: { active?: boolean; children: ReactNode }) {
  return (
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-200 ${
        active ? "bg-primary text-white shadow-[0_4px_12px_-2px_rgba(61,90,254,0.45)]" : "text-muted hover:bg-surface-2 hover:text-foreground"
      }`}
    >
      {children}
    </div>
  );
}

export function AppShell({
  title,
  children,
  workspace = "Bloom & Co",
  compact = false,
}: {
  title: string;
  children: ReactNode;
  workspace?: string;
  /** Reduces frame min-height and internal padding for staggered/secondary
   * product-story visuals (e.g. homepage Create & Publish) — purely
   * additive, defaults to false so flagship showcases (Calendar, etc.)
   * render exactly as before. Visual-sizing only, no typography changes. */
  compact?: boolean;
}) {
  return (
    <div className={`flex h-full ${compact ? "min-h-[300px]" : "min-h-[420px]"}`}>
      <div
        className={`hidden w-16 shrink-0 flex-col items-center gap-3 border-r border-border bg-surface sm:flex ${
          compact ? "py-4" : "py-5"
        }`}
      >
        <div className="mb-2 h-8 w-8 rounded-xl bg-primary" />
        <SidebarIcon active>
          <CalendarGlyph />
        </SidebarIcon>
        <SidebarIcon>
          <ComposeGlyph />
        </SidebarIcon>
        <SidebarIcon>
          <LibraryGlyph />
        </SidebarIcon>
        <SidebarIcon>
          <ChartGlyph />
        </SidebarIcon>
        <div className="mt-auto h-8 w-8 rounded-full bg-surface-2" />
      </div>
      <div className="flex-1">
        <div className={`flex items-center justify-between border-b border-border px-5 ${compact ? "py-3" : "py-3.5"}`}>
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-primary-soft" />
            <span className="text-[13px] font-medium text-foreground">{workspace}</span>
            <span className="text-[13px] text-muted">/ {title}</span>
          </div>
          <div className="rounded-full bg-primary px-3.5 py-1.5 text-[12px] font-medium text-white">New Post</div>
        </div>
        <div className={compact ? "p-4" : "p-5"}>{children}</div>
      </div>
    </div>
  );
}

function CalendarGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="5" width="16" height="15" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 9.5h16M8 3v3.5M16 3v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function ComposeGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M5 19l1-4L16.5 4.5a1.4 1.4 0 0 1 2 2L8 17l-4 1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function LibraryGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="4" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <rect x="4" y="13" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="13" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function ChartGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M5 19V10M12 19V5M19 19v-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
