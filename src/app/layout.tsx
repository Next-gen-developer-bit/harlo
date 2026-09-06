import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/seo/JsonLd";
import { siteUrl, siteName, productName } from "@/lib/site";
import { CookieConsentProvider } from "@/components/cookies/CookieConsentContext";
import CookieBanner from "@/components/cookies/CookieBanner";
import CookieSettingsModal from "@/components/cookies/CookieSettingsModal";
import ConsentedAnalytics from "@/components/cookies/ConsentedAnalytics";
import AttributionCapture from "@/components/marketing/AttributionCapture";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  // Italic loaded for the editorial rebuild's single-phrase emphasis
  // treatment (hero/footer headlines) — genuine Poppins Italic, not a
  // different typeface and not a synthetic browser-faked oblique.
  style: ["normal", "italic"],
});

const title = "Social Media Management Platform | Harlo Social";
const description =
  "Plan, publish and manage social media content across Instagram, Facebook, LinkedIn, TikTok and more from one place. Harlo Social helps businesses, teams and agencies stay organised and see what's working.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s" },
  description,
  // og:image / twitter:image come from the app/opengraph-image.png +
  // app/twitter-image.png file conventions instead of being set here — a
  // page that defines its own `openGraph`/`twitter` object (several do)
  // fully replaces this one rather than merging field-by-field, which was
  // silently dropping an `images` array set at this level.
  openGraph: {
    type: "website",
    siteName,
    title,
    description,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  other: {
    "tiktok-developers-site-verification": "SoEehEPqa7pVo2L0IrItBXPjLRhV0WGP",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    alternateName: productName,
    url: siteUrl,
    logo: `${siteUrl}/harlo-logo.png`,
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    alternateName: productName,
    url: siteUrl,
    publisher: {
      "@type": "Organization",
      name: siteName,
    },
  };

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteName,
    alternateName: productName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description,
    url: siteUrl,
    brand: {
      "@type": "Brand",
      name: siteName,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "0",
      highPrice: "99",
      offerCount: "4",
    },
  };

  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <JsonLd data={softwareApplicationSchema} />
        <CookieConsentProvider>
          {children}
          <CookieBanner />
          <CookieSettingsModal />
          <ConsentedAnalytics />
          <AttributionCapture />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
