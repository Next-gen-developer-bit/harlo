// Lightweight, vendor-following analytics interface.
//
// ConsentedAnalytics.tsx already wires up GA4 (window.gtag) and Meta Pixel
// (window.fbq), gated on cookie consent and only loading once real IDs are
// configured via env vars — nothing fires today. `track()` follows that same
// pattern rather than introducing a separate vendor: it's always safe to
// call, and no-ops until those scripts are actually present.
//
// Primary marketing-site actions should carry a stable `data-track` value
// (see PRIMARY_EVENTS below) so a GTM/GA4 click trigger can key off them
// without any additional JS — see Button.tsx's optional `trackEvent` prop.

export type AnalyticsEvent =
  | "pricing_viewed"
  | "signup_started"
  | "signup_completed"
  | "trial_started"
  | "plan_selected"
  | "social_account_connected"
  | "post_created"
  | "post_scheduled"
  | "post_published"
  | "upgrade_started"
  | "subscription_started"
  | "cta_clicked";

type EventProperties = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Fires an event through whichever consented tracking script is currently loaded. Safe to call unconditionally. */
export function track(event: AnalyticsEvent, properties?: EventProperties) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, properties);
  window.fbq?.("trackCustom", event, properties);
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
const STORAGE_KEY = "harlo_attribution";

/**
 * Captures UTM parameters and referrer from the current URL on first landing
 * and persists them for the session, so they can be attached to the signup
 * flow later. Best-effort only — never throws if storage is unavailable.
 */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const captured: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) captured[key] = value;
    }
    if (document.referrer) captured.referrer = document.referrer;
    captured.landing_page = window.location.pathname;
    if (Object.keys(captured).length > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
    }
  } catch {
    // sessionStorage unavailable (privacy mode, etc.) — skip silently.
  }
}

/** Reads back whatever attribution was captured this session, if any. */
export function getAttribution(): Record<string, string> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Appends stored attribution params onto a signup link so they survive the handoff to the app. */
export function withAttribution(href: string): string {
  const attribution = getAttribution();
  if (!attribution) return href;
  const [path, existingQuery] = href.split("?");
  const params = new URLSearchParams(existingQuery);
  for (const [key, value] of Object.entries(attribution)) {
    if (!params.has(key)) params.set(key, value);
  }
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}
