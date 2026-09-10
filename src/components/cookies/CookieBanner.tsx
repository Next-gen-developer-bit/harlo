"use client";

import { useCookieConsent } from "./CookieConsentContext";

export default function CookieBanner() {
  const { bannerVisible, acceptAll, rejectOptional, openSettings } = useCookieConsent();

  if (!bannerVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4 sm:px-6">
      <div className="fade-up mx-auto flex max-w-3xl flex-col gap-4 rounded-3xl border border-border bg-white/95 p-5 shadow-[0_30px_60px_-20px_rgba(20,20,40,0.35)] backdrop-blur-md sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <div className="flex-1">
          <div className="text-[14.5px] font-semibold text-foreground">Your privacy matters</div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
            We use cookies to keep Harlo working, understand how our website is used and measure our marketing.
            You can accept all cookies, reject optional cookies or choose your preferences.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={openSettings}
            className="flex h-11 items-center justify-center rounded-[13px] border border-border px-4 text-[13.5px] font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface"
          >
            Cookie Settings
          </button>
          <button
            type="button"
            onClick={rejectOptional}
            className="flex h-11 items-center justify-center rounded-[13px] border border-border px-4 text-[13.5px] font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface"
          >
            Reject Optional
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="flex h-11 items-center justify-center rounded-[13px] bg-primary px-4 text-[13.5px] font-medium text-white shadow-[0_2px_8px_-2px_rgba(61,90,254,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_12px_24px_-8px_rgba(61,90,254,0.55)]"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
