import type { Metadata } from "next";
import Link from "next/link";
import LegalPageShell from "@/components/legal/LegalPageShell";
import LegalSection from "@/components/legal/LegalSection";
import CookieSettingsTrigger from "@/components/cookies/CookieSettingsTrigger";
import { legalInfo } from "@/lib/legal-info";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Cookie Policy | Harlo Social",
  description: "How Harlo uses cookies and similar technologies, and how to manage your preferences.",
  path: "/legal/cookies",
});

const sections = [
  { id: "introduction", label: "Introduction" },
  { id: "what-are-cookies", label: "What Are Cookies" },
  { id: "cookie-categories", label: "Cookie Categories" },
  { id: "cookieyes", label: "CookieYes" },
  { id: "first-party-cookies", label: "First-Party Cookies" },
  { id: "third-party-cookies", label: "Third-Party Cookies" },
  { id: "managing-cookies", label: "Managing Cookies" },
  { id: "gdpr", label: "GDPR" },
  { id: "us-privacy-rights", label: "US Privacy Rights" },
  { id: "international-processing", label: "International Processing" },
  { id: "changes", label: "Changes" },
  { id: "contact", label: "Contact" },
];

export default function CookiePolicyPage() {
  return (
    <LegalPageShell
      eyebrow="Cookie Policy"
      title="Cookie Policy"
      lastUpdated={legalInfo.lastUpdated}
      intro="This Cookie Policy explains how Harlo uses cookies and similar technologies. It should be read alongside our Privacy Policy."
      sections={sections}
      contactEmail={legalInfo.privacyEmail}
    >
      <LegalSection id="introduction" title="1. Introduction">
        <p>This Cookie Policy explains how Harlo uses cookies and similar technologies.</p>
        <p>
          <strong>{legalInfo.operator}</strong> is based in {legalInfo.location}.
        </p>
      </LegalSection>

      <LegalSection id="what-are-cookies" title="2. What Are Cookies?">
        <p>Cookies are small files stored on a browser or device. Similar technologies may include:</p>
        <ul>
          <li>Local storage</li>
          <li>Pixels</li>
          <li>Tags</li>
          <li>Tracking identifiers</li>
          <li>Browser storage</li>
        </ul>
      </LegalSection>

      <LegalSection id="cookie-categories" title="3. Cookie Categories">
        <p>Harlo uses four clear consent categories.</p>

        <h3>Strictly Necessary</h3>
        <p>Required for the platform to work. Examples: authentication, login sessions, security, fraud prevention, cookie consent preferences, and core application functionality. These cannot be disabled through the consent panel.</p>

        <h3>Functional</h3>
        <p>Used to remember preferences, such as time zone, interface preferences and saved settings. Users can enable or disable these.</p>

        <h3>Analytics</h3>
        <p>
          Used to understand usage and performance, including <strong>Google Analytics 4</strong>. Potential
          purposes: website traffic, page usage, conversions, navigation, performance and general product usage.
          Users can enable or disable analytics cookies.
        </p>

        <h3>Advertising</h3>
        <p>
          Used for advertising attribution and campaign measurement, including <strong>Meta Pixel</strong>.
          Potential purposes: advertising attribution, conversion measurement, campaign performance and retargeting
          where legally permitted. Users can enable or disable advertising cookies.
        </p>

        <p className="mt-4">
          <CookieSettingsTrigger className="inline-flex h-11 items-center rounded-[9px] bg-primary px-5 text-[13.5px] font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110">
            Manage Cookie Preferences
          </CookieSettingsTrigger>
        </p>
      </LegalSection>

      <LegalSection id="cookieyes" title="4. CookieYes">
        <p>
          Harlo uses <strong>CookieYes</strong> as the website&apos;s consent management platform. CookieYes is
          used to:
        </p>
        <ul>
          <li>Display the consent banner</li>
          <li>Store consent preferences</li>
          <li>Allow category selection</li>
          <li>Allow users to withdraw consent</li>
          <li>Reopen preferences through Cookie Settings</li>
          <li>Prevent non-essential cookies from loading before consent where legally required</li>
        </ul>
      </LegalSection>

      <LegalSection id="first-party-cookies" title="5. First-Party Cookies">
        <p>Harlo may use first-party cookies for sessions, authentication, security and preferences.</p>
      </LegalSection>

      <LegalSection id="third-party-cookies" title="6. Third-Party Cookies">
        <p>Third-party technologies may include CookieYes, Google Analytics 4 and Meta Pixel. Their use should match the user&apos;s cookie preferences.</p>
      </LegalSection>

      <LegalSection id="managing-cookies" title="7. Managing Cookies">
        <p>
          Users can control cookies through Cookie Settings (available in the footer of every page), the cookie
          banner, or their browser settings. Blocking strictly necessary browser functionality may prevent parts of
          Harlo from working correctly.
        </p>
      </LegalSection>

      <LegalSection id="gdpr" title="8. GDPR">
        <p>
          For users where GDPR and similar European rules apply, Harlo does not activate optional analytics or
          advertising technologies until appropriate consent has been given. Users must be able to withdraw consent
          as easily as it was provided. See <Link href="/legal/gdpr">GDPR &amp; Data Protection</Link>.
        </p>
      </LegalSection>

      <LegalSection id="us-privacy-rights" title="9. US Privacy Rights">
        <p>
          Some advertising technologies may legally be considered targeted advertising or &quot;sharing&quot; in
          certain US states. Where applicable, users must be given appropriate opt-out controls. Harlo does not
          sell personal information for monetary compensation.
        </p>
      </LegalSection>

      <LegalSection id="international-processing" title="10. International Processing">
        <p>Cookie providers may process information internationally. Applicable legal safeguards should be used where required.</p>
      </LegalSection>

      <LegalSection id="changes" title="11. Changes">
        <p>This page will be updated when cookie technologies or providers materially change.</p>
      </LegalSection>

      <LegalSection id="contact" title="12. Contact">
        <p>
          <a href={`mailto:${legalInfo.privacyEmail}`}>{legalInfo.privacyEmail}</a>
        </p>
        <p>
          Related: <Link href="/legal/privacy">Privacy Policy</Link>. Manage your preferences any time via{" "}
          <CookieSettingsTrigger className="text-primary underline underline-offset-2">
            Cookie Settings
          </CookieSettingsTrigger>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
