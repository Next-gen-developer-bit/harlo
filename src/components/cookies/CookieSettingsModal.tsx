"use client";

import { useEffect, useState } from "react";
import { useCookieConsent, type CookieCategories } from "./CookieConsentContext";

const categories: {
  key: keyof Omit<CookieCategories, "necessary">;
  title: string;
  description: string;
}[] = [
  {
    key: "functional",
    title: "Functional",
    description: "Helps Harlo remember your preferences and provide a more personalised experience.",
  },
  {
    key: "analytics",
    title: "Analytics",
    description: "Helps us understand how people use Harlo so we can improve the website and product. This may include Google Analytics.",
  },
  {
    key: "advertising",
    title: "Advertising",
    description: "Helps us measure advertising performance and understand whether campaigns lead to signups or purchases. This may include Meta Pixel.",
  },
];

export default function CookieSettingsModal() {
  const { settingsOpen, closeSettings, consent, acceptAll, rejectOptional, savePreferences } = useCookieConsent();
  const [draft, setDraft] = useState({
    functional: consent.functional,
    analytics: consent.analytics,
    advertising: consent.advertising,
  });

  useEffect(() => {
    if (settingsOpen) {
      setDraft({ functional: consent.functional, analytics: consent.analytics, advertising: consent.advertising });
    }
  }, [settingsOpen, consent]);

  if (!settingsOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close cookie settings"
        onClick={closeSettings}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"
      />
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_30px_80px_-20px_rgba(20,20,40,0.4)] sm:rounded-[28px]">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="text-[17px] font-semibold text-foreground">Cookie Settings</div>
          <button
            type="button"
            onClick={closeSettings}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-surface hover:text-foreground"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <p className="text-[13.5px] leading-relaxed text-muted">
            We use cookies to keep Harlo working, understand how the website is used and measure our marketing.
            You can choose which optional cookies you allow.
          </p>

          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-border bg-surface/60 p-4">
              <div className="flex items-center justify-between">
                <div className="text-[14px] font-semibold text-foreground">Strictly Necessary</div>
                <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted">Always Active</span>
              </div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
                Required for Harlo to function securely. These cookies support account login, authentication,
                security, session management and your privacy preferences.
              </p>
            </div>

            {categories.map((c) => (
              <div key={c.key} className="rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-[14px] font-semibold text-foreground">{c.title}</div>
                  <Toggle
                    checked={draft[c.key]}
                    onChange={(v) => setDraft((d) => ({ ...d, [c.key]: v }))}
                    label={c.title}
                  />
                </div>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{c.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border px-6 py-5 sm:flex-row">
          <button
            type="button"
            onClick={rejectOptional}
            className="flex flex-1 h-12 items-center justify-center rounded-[13px] border border-border px-4 text-[13.5px] font-medium text-foreground transition-all duration-200 hover:bg-surface"
          >
            Reject Optional
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="flex flex-1 h-12 items-center justify-center rounded-[13px] border border-border px-4 text-[13.5px] font-medium text-foreground transition-all duration-200 hover:bg-surface"
          >
            Accept All
          </button>
          <button
            type="button"
            onClick={() => savePreferences(draft)}
            className="flex flex-1 h-12 items-center justify-center rounded-[13px] bg-primary px-4 text-[13.5px] font-medium text-white shadow-[0_2px_8px_-2px_rgba(61,90,254,0.5)] transition-all duration-200 hover:brightness-110"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
        checked ? "bg-primary" : "bg-surface-2"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-transform duration-200 ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function CloseIcon() {
  return (
    <span aria-hidden="true" className="text-[18px] leading-none">
      ×
    </span>
  );
}
