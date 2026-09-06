import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "dark" | "light";
  size?: "md" | "lg" | "hero";
  className?: string;
  /** Stable event identifier for analytics tooling (GTM/GA4 click triggers key off data-track) — purely declarative, adds no client JS. */
  trackEvent?: string;
};

// Global CTA shape: one rounded-rectangle system used everywhere (nav,
// hero, sections, forms) rather than a mix of pill and rectangle buttons.
// Radius lives per-size (below) rather than here, since the hero size uses
// a slightly tighter radius than every other size. Never rounded-full.
const base =
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.97] active:duration-100 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2";

// Primary = approved Harlo blue background, white text, sitewide — the one
// CTA colour, per the final brand brief (blue is the primary-button colour,
// not just a supporting accent). "dark" is kept only as a backward-compatible
// alias for call sites that named it explicitly, and renders identically.
const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-primary text-white shadow-none hover:-translate-y-0.5 hover:bg-primary/90",
  // Soft beige surface rather than plain white — editorial rebuild's
  // secondary-button treatment (brief: "soft beige surface, dark text").
  secondary:
    "bg-surface text-foreground border border-border-dark hover:-translate-y-0.5 hover:border-border-dark-hover",
  ghost: "text-foreground hover:bg-surface",
  dark: "bg-primary text-white shadow-none hover:-translate-y-0.5 hover:bg-primary/90",
  // Secondary action on a dark background (Analytics dark section, a dark
  // FinalCta variant) — the primary action there uses "secondary" instead
  // (solid white reads as the strong CTA against black).
  light: "bg-transparent text-white border border-white/25 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/5",
};

// Editorial rebuild: compact, architectural radius (8-10px) rather than
// the previous rounded-pill-adjacent 13px — see brief's button-radius spec.
const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  md: "h-12 px-6 text-[0.9375rem] rounded-[9px]",
  lg: "h-[52px] px-7 text-[1rem] rounded-[10px]",
  // Homepage hero only — more compact/refined than the sitewide default.
  hero: "h-[46px] px-[26px] text-[14.5px] rounded-[9px]",
};

export default function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  trackEvent,
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...(trackEvent ? { "data-track": trackEvent } : {})}
    >
      {children}
    </Link>
  );
}
