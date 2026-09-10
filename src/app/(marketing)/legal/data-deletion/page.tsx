import type { Metadata } from "next";
import Link from "next/link";
import LegalPageShell from "@/components/legal/LegalPageShell";
import LegalSection from "@/components/legal/LegalSection";
import { legalInfo } from "@/lib/legal-info";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Data Deletion | Harlo Social",
  description: "How to delete your Harlo account, remove connected social accounts, or request deletion of your data.",
  path: "/legal/data-deletion",
});

const sections = [
  { id: "about-data-deletion", label: "About Data Deletion" },
  { id: "how-to-delete", label: "How to Delete an Account" },
  { id: "information-covered", label: "Information Covered" },
  { id: "connected-accounts", label: "Connected Accounts" },
  { id: "published-content", label: "Published Content" },
  { id: "scheduled-content", label: "Scheduled Content" },
  { id: "information-retained", label: "Information That May Be Retained" },
  { id: "backups", label: "Backups" },
  { id: "stripe", label: "Stripe" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "google-youtube", label: "Google and YouTube" },
  { id: "meta", label: "Meta" },
  { id: "contact", label: "Contact" },
];

export default function DataDeletionPage() {
  return (
    <LegalPageShell
      eyebrow="Data Deletion"
      title="Data Deletion"
      lastUpdated={legalInfo.lastUpdated}
      intro="This page explains how to delete your Harlo account, disconnect individual social accounts, and request deletion of your data, including if you no longer have access to your account."
      sections={sections}
      contactEmail={legalInfo.privacyEmail}
      contactLabel="Contact us about deletion"
    >
      <LegalSection id="about-data-deletion" title="1. About Data Deletion">
        <p>
          <strong>{legalInfo.operator}</strong> is based in {legalInfo.location}. Users may request
          deletion of their Harlo account and personal information.
        </p>
      </LegalSection>

      <LegalSection id="how-to-delete" title="2. How to Delete an Account">
        <p>
          If account deletion functionality exists in Settings, users can delete their account directly from{" "}
          <strong>Settings, then Account, then Delete Account</strong>.
        </p>
        <p>
          Deletion requests can also be made by emailing{" "}
          <a href={`mailto:${legalInfo.privacyEmail}`}>{legalInfo.privacyEmail}</a>. Email requests should
          preferably come from the email address associated with the account. Identity verification may be
          required.
        </p>
      </LegalSection>

      <LegalSection id="information-covered" title="3. Information Covered">
        <p>Deletion may include:</p>
        <ul>
          <li>Account information</li>
          <li>Profile information</li>
          <li>Workspace information</li>
          <li>Connected social account references</li>
          <li>Stored social authentication tokens</li>
          <li>Draft content</li>
          <li>Scheduled content</li>
          <li>Uploaded media</li>
          <li>Harlo publishing history</li>
          <li>Stored analytics information</li>
          <li>Preferences and settings</li>
        </ul>
      </LegalSection>

      <LegalSection id="connected-accounts" title="4. Connected Accounts">
        <p>
          Deleting a Harlo account removes stored social connections under Harlo&apos;s control. Users may
          also revoke access through the connected social network.
        </p>
      </LegalSection>

      <LegalSection id="published-content" title="5. Published Content">
        <p>
          <strong>Deleting your Harlo account does not automatically delete content already published to social media platforms.</strong>
        </p>
        <p>
          Once Harlo has published a post to Instagram, Facebook, LinkedIn, TikTok, YouTube, Threads, Pinterest
          or another platform, that content exists on the third-party platform. Users may need to remove it
          directly from that social network.
        </p>
      </LegalSection>

      <LegalSection id="scheduled-content" title="6. Scheduled Content">
        <p>Scheduled content associated with a deleted or disconnected account will no longer be published.</p>
      </LegalSection>

      <LegalSection id="information-retained" title="7. Information That May Be Retained">
        <p>Limited information may remain where necessary for:</p>
        <ul>
          <li>Legal obligations</li>
          <li>Accounting and tax</li>
          <li>Fraud prevention</li>
          <li>Security</li>
          <li>Disputes</li>
          <li>Payment records</li>
        </ul>
      </LegalSection>

      <LegalSection id="backups" title="8. Backups">
        <p>Deleted information may temporarily remain in secure system backups until overwritten through normal backup processes.</p>
      </LegalSection>

      <LegalSection id="stripe" title="9. Stripe">
        <p>Payment records independently retained by Stripe remain subject to Stripe&apos;s own legal and privacy requirements.</p>
      </LegalSection>

      <LegalSection id="infrastructure" title="10. Infrastructure">
        <p>Harlo uses Vercel, Supabase and Stripe. Deletion processes remove or de-identify information under Harlo&apos;s control where appropriate.</p>
      </LegalSection>

      <LegalSection id="google-youtube" title="11. Google and YouTube">
        <p>
          Users can revoke Google and YouTube permissions through Google account security settings. Deletion
          requests may also be submitted to{" "}
          <a href={`mailto:${legalInfo.privacyEmail}`}>{legalInfo.privacyEmail}</a>.
        </p>
      </LegalSection>

      <LegalSection id="meta" title="12. Meta">
        <p>
          Users may revoke Facebook, Instagram or Threads access using Meta&apos;s connected-app or business
          integration settings. Deletion requests may also be submitted to{" "}
          <a href={`mailto:${legalInfo.privacyEmail}`}>{legalInfo.privacyEmail}</a>.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="13. Contact">
        <p>
          <strong>{legalInfo.product}</strong>
          <br />A product of <strong>{legalInfo.operator}</strong>
          <br />
          {legalInfo.location}
        </p>
        <p>
          <a href={`mailto:${legalInfo.privacyEmail}`}>{legalInfo.privacyEmail}</a>
        </p>
        <p>
          Related: <Link href="/legal/privacy">Privacy Policy</Link>,{" "}
          <Link href="/legal/gdpr">GDPR &amp; Data Protection</Link>.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
