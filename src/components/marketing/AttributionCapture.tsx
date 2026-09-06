"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/analytics";

/** Invisible — captures UTM/referrer attribution once per session. No UI, no consent-gated network calls. */
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
