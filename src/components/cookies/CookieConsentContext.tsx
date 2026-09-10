"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CookieCategories = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  advertising: boolean;
};

type StoredConsent = CookieCategories & { decided: true; updatedAt: string };

const STORAGE_KEY = "harlo-cookie-consent";

const defaultCategories: CookieCategories = {
  necessary: true,
  functional: false,
  analytics: false,
  advertising: false,
};

type CookieConsentContextValue = {
  consent: CookieCategories;
  hasDecided: boolean;
  bannerVisible: boolean;
  settingsOpen: boolean;
  acceptAll: () => void;
  rejectOptional: () => void;
  savePreferences: (prefs: Omit<CookieCategories, "necessary">) => void;
  openSettings: () => void;
  closeSettings: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

function readStoredConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredConsent;
  } catch {
    return null;
  }
}

function writeStoredConsent(categories: CookieCategories) {
  const stored: StoredConsent = { ...categories, decided: true, updatedAt: new Date().toISOString() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieCategories>(defaultCategories);
  const [hasDecided, setHasDecided] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const stored = readStoredConsent();
    if (stored) {
      setConsent(stored);
      setHasDecided(true);
      setBannerVisible(false);
    } else {
      setBannerVisible(true);
    }
  }, []);

  const acceptAll = useCallback(() => {
    const next: CookieCategories = { necessary: true, functional: true, analytics: true, advertising: true };
    setConsent(next);
    writeStoredConsent(next);
    setHasDecided(true);
    setBannerVisible(false);
    setSettingsOpen(false);
  }, []);

  const rejectOptional = useCallback(() => {
    const next: CookieCategories = { necessary: true, functional: false, analytics: false, advertising: false };
    setConsent(next);
    writeStoredConsent(next);
    setHasDecided(true);
    setBannerVisible(false);
    setSettingsOpen(false);
  }, []);

  const savePreferences = useCallback((prefs: Omit<CookieCategories, "necessary">) => {
    const next: CookieCategories = { necessary: true, ...prefs };
    setConsent(next);
    writeStoredConsent(next);
    setHasDecided(true);
    setBannerVisible(false);
    setSettingsOpen(false);
  }, []);

  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const value = useMemo(
    () => ({ consent, hasDecided, bannerVisible, settingsOpen, acceptAll, rejectOptional, savePreferences, openSettings, closeSettings }),
    [consent, hasDecided, bannerVisible, settingsOpen, acceptAll, rejectOptional, savePreferences, openSettings, closeSettings]
  );

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error("useCookieConsent must be used within a CookieConsentProvider");
  return ctx;
}
