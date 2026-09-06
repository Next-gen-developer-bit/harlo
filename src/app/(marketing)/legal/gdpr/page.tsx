import type { Metadata } from "next";
import Link from "next/link";
import LegalPageShell from "@/components/legal/LegalPageShell";
import LegalSection from "@/components/legal/LegalSection";
import { legalInfo } from "@/lib/legal-info";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "GDPR & Data Protection | Harlo Social",
  description: "How Harlo approaches GDPR and related European data protection laws.",
  path: "/legal/gdpr",
});

const sections = [
  { id: "who-this-applies-to", label: "Who This Applies To" },
  { id: "data-controller", label: "Data Controller" },
  { id: "privacy-by-design", label: "Privacy by Design" },
  { id: "legal-bases", label: "Legal Bases" },
  { id: "gdpr-rights", label: "GDPR Rights" },
  { id: "exercising-rights", label: "Exercising GDPR Rights" },
  { id: "social-media-data", label: "Social Media Data" },
  { id: "account-deletion", label: "Account Deletion" },
  { id: "international-transfers", label: "International Transfers" },
  { id: "subprocessors", label: "Subprocessors" },
  { id: "data-processing-agreements", label: "Data Processing Agreements" },
  { id: "cookies", label: "Cookies" },
  { id: "contact", label: "Contact" },
];

export default function GdprPage() {
  return (
    <LegalPageShell
      eyebrow="GDPR & Data Protection"
      title="GDPR & Data Protection"
      lastUpdated={legalInfo.lastUpdated}
      intro="This page supplements the Harlo Privacy Policy and explains how Harlo approaches GDPR and related European privacy laws."
      sections={sections}
      contactEmail={legalInfo.privacyEmail}
    >
      <LegalSection id="who-this-applies-to" title="1. Who This Applies To">
        <p>This page is particularly relevant to users in:</p>
        <ul>
          <li>European Economic Area</li>
          <li>United Kingdom</li>
          <li>Switzerland</li>
          <li>Other jurisdictions providing similar privacy rights</li>
        </ul>
      </LegalSection>

      <LegalSection id="data-controller" title="2. Data Controller">
        <p>
          For personal information collected directly through Harlo, <strong>{legalInfo.operator}</strong>{" "}
          generally acts as the data controller.
        </p>
        <p>
          When Harlo processes information on behalf of a business or agency customer, that customer may act as
          the controller and Harlo may act as a processor.
        </p>
      </LegalSection>

      <LegalSection id="privacy-by-design" title="3. Privacy by Design">
        <p>Harlo aims to avoid collecting personal information that is unnecessary for providing the Service. Information is primarily processed to:</p>
        <ul>
          <li>Maintain and secure accounts</li>
          <li>Connect social media platforms</li>
          <li>Schedule and publish content</li>
          <li>Retrieve authorised social data</li>
          <li>Provide analytics</li>
          <li>Process subscriptions</li>
          <li>Provide support</li>
          <li>Improve the Service</li>
        </ul>
      </LegalSection>

      <LegalSection id="legal-bases" title="4. Legal Bases">
        <h3>Performance of a Contract</h3>
        <p>Used where processing is necessary to provide Harlo, for example account creation, social media connection, scheduling, publishing and workspace functionality.</p>
        <h3>Legitimate Interests</h3>
        <p>May apply to security, fraud prevention, service improvement, analytics, troubleshooting and customer support.</p>
        <h3>Consent</h3>
        <p>May apply to optional cookies, marketing communications, optional integrations and optional data processing activities. Users may withdraw consent where applicable.</p>
        <h3>Legal Obligation</h3>
        <p>Information may be processed where required by law, regulation or lawful legal process.</p>
      </LegalSection>

      <LegalSection id="gdpr-rights" title="5. GDPR Rights">
        <p>Where GDPR applies, users may have:</p>
        <h3>Right of Access</h3>
        <p>Request confirmation of whether Harlo processes personal information and obtain a copy.</p>
        <h3>Right to Rectification</h3>
        <p>Request correction of inaccurate information.</p>
        <h3>Right to Erasure</h3>
        <p>Request deletion of personal information where applicable.</p>
        <h3>Right to Restriction</h3>
        <p>Request temporary restriction of certain processing.</p>
        <h3>Right to Data Portability</h3>
        <p>Request certain information in a structured, commonly used machine-readable format.</p>
        <h3>Right to Object</h3>
        <p>Object to processing based on legitimate interests or direct marketing.</p>
        <h3>Right to Withdraw Consent</h3>
        <p>Withdraw consent where consent is the legal basis.</p>
        <h3>Right to Lodge a Complaint</h3>
        <p>Users may contact the relevant data protection authority in their country.</p>
      </LegalSection>

      <LegalSection id="exercising-rights" title="6. Exercising GDPR Rights">
        <p>
          Requests should be sent to <a href={`mailto:${legalInfo.privacyEmail}`}>{legalInfo.privacyEmail}</a>.
        </p>
        <p>Harlo may verify identity before processing a request. Requests will be handled within timeframes required by applicable law.</p>
      </LegalSection>

      <LegalSection id="social-media-data" title="7. Social Media Data">
        <p>
          When a user connects a social network, Harlo processes information according to the permissions
          approved by the user. Users may disconnect integrations through Harlo or revoke access directly
          through the relevant social network.
        </p>
      </LegalSection>

      <LegalSection id="account-deletion" title="8. Account Deletion">
        <p>Users may request deletion of their Harlo account. Some information may be retained where legally or operationally required for:</p>
        <ul>
          <li>Tax and accounting</li>
          <li>Fraud prevention</li>
          <li>Security</li>
          <li>Legal obligations</li>
          <li>Disputes</li>
        </ul>
        <p>
          Published social media content may remain on connected social platforms. See{" "}
          <Link href="/legal/data-deletion">Data Deletion</Link>.
        </p>
      </LegalSection>

      <LegalSection id="international-transfers" title="9. International Transfers">
        <p>Harlo may use providers located outside the EEA, UK or Switzerland. Where required, lawful transfer protections may include:</p>
        <ul>
          <li>Standard Contractual Clauses</li>
          <li>Adequacy decisions</li>
          <li>Other approved legal transfer mechanisms</li>
        </ul>
      </LegalSection>

      <LegalSection id="subprocessors" title="10. Subprocessors">
        <p>Current key service providers include:</p>
        <ul>
          <li>Vercel</li>
          <li>Supabase</li>
          <li>Stripe</li>
          <li>CookieYes</li>
          <li>Google Analytics</li>
          <li>Meta</li>
        </ul>
        <p>A dedicated Subprocessors page may be added as Harlo&apos;s infrastructure expands.</p>
      </LegalSection>

      <LegalSection id="data-processing-agreements" title="11. Data Processing Agreements">
        <p>
          Business or agency customers requiring a Data Processing Agreement should contact{" "}
          <a href={`mailto:${legalInfo.privacyEmail}`}>{legalInfo.privacyEmail}</a>.
        </p>
      </LegalSection>

      <LegalSection id="cookies" title="12. Cookies">
        <p>
          Non-essential cookies requiring consent should only operate after the user has provided the appropriate
          consent. Users must be able to withdraw or modify consent through Cookie Settings at any time. See the{" "}
          <Link href="/legal/cookies">Cookie Policy</Link>.
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
          <Link href="/legal/cookies">Cookie Policy</Link>,{" "}
          <Link href="/legal/data-deletion">Data Deletion</Link>.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
