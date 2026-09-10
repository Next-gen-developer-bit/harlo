import Link from "next/link";

// Toggle this to enable/disable the announcement bar sitewide.
// Disabled per the compact-floating-nav rebuild: the navbar now floats
// 12px from the very top of the viewport, which an announcement bar
// above it would break.
export const ANNOUNCEMENT_ENABLED = false;

export default function AnnouncementBar() {
  if (!ANNOUNCEMENT_ENABLED) return null;

  return (
    <Link
      href="/mobile"
      className="flex items-center justify-center gap-2 bg-foreground px-4 py-2 text-center text-[12.5px] font-medium text-white transition-colors duration-200 hover:bg-foreground/90"
    >
      <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide">
        New
      </span>
      Harlo Mobile is coming soon. Join the waitlist
    </Link>
  );
}
