"use client";

import type { ReactNode } from "react";
import { useCookieConsent } from "./CookieConsentContext";

export default function CookieSettingsTrigger({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { openSettings } = useCookieConsent();
  return (
    <button type="button" onClick={openSettings} className={className}>
      {children}
    </button>
  );
}
