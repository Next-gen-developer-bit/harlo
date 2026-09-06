"use client";

import Script from "next/script";
import { useCookieConsent } from "./CookieConsentContext";

/**
 * Loads GA4 and Meta Pixel only after the relevant consent category has been
 * granted, and only once real IDs are configured via env vars. No IDs are
 * configured yet, so nothing loads today — this wires up the consent-gating
 * correctly so the real snippets can be dropped in later without revisiting
 * the consent logic.
 */
export default function ConsentedAnalytics() {
  const { consent, hasDecided } = useCookieConsent();

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  const analyticsAllowed = hasDecided && consent.analytics && Boolean(gaId);
  const advertisingAllowed = hasDecided && consent.advertising && Boolean(metaPixelId);

  return (
    <>
      {analyticsAllowed && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {advertisingAllowed && (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
