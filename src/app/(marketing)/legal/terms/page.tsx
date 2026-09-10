import type { Metadata } from "next";
import Link from "next/link";
import LegalPageShell from "@/components/legal/LegalPageShell";
import LegalSection from "@/components/legal/LegalSection";
import { legalInfo } from "@/lib/legal-info";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service | Harlo Social",
  description: "The terms that apply when you use Harlo's website, web application, integrations and related services.",
  path: "/legal/terms",
});

const sections = [
  { id: "agreement", label: "Agreement" },
  { id: "service", label: "Service" },
  { id: "eligibility", label: "Eligibility" },
  { id: "accounts", label: "Accounts" },
  { id: "workspaces", label: "Workspaces" },
  { id: "social-networks", label: "Social Networks" },
  { id: "third-party-platform-changes", label: "Third-Party Platform Changes" },
  { id: "user-content", label: "User Content" },
  { id: "content-responsibility", label: "Content Responsibility" },
  { id: "social-permissions", label: "Social Permissions" },
  { id: "scheduled-publishing", label: "Scheduled Publishing" },
  { id: "ai-features", label: "AI Features" },
  { id: "plans", label: "Plans" },
  { id: "stripe-payments", label: "Stripe Payments" },
  { id: "renewal", label: "Renewal" },
  { id: "cancellation", label: "Cancellation" },
  { id: "refunds", label: "Refunds" },
  { id: "fair-use", label: "Fair Use" },
  { id: "prohibited-use", label: "Prohibited Use" },
  { id: "intellectual-property", label: "Intellectual Property" },
  { id: "feedback", label: "Feedback" },
  { id: "privacy", label: "Privacy" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "service-availability", label: "Service Availability" },
  { id: "suspension", label: "Suspension" },
  { id: "termination", label: "Termination" },
  { id: "third-party-services", label: "Third-Party Services" },
  { id: "disclaimer", label: "Disclaimer" },
  { id: "australian-consumer-law", label: "Australian Consumer Law" },
  { id: "liability", label: "Liability" },
  { id: "governing-law", label: "Governing Law" },
  { id: "contact", label: "Contact" },
];

export default function TermsPage() {
  return (
    <LegalPageShell
      eyebrow="Terms of Service"
      title="Terms of Service"
      lastUpdated={legalInfo.lastUpdated}
      intro="These Terms govern access to and use of Harlo. By creating an account, purchasing a subscription or using Harlo, you agree to these Terms and our related policies."
      sections={sections}
      contactEmail={legalInfo.privacyEmail}
      contactLabel="Contact us about these terms"
    >
      <LegalSection id="agreement" title="1. Agreement">
        <p>
          These Terms govern access to and use of <strong>Harlo Social</strong> (&quot;Harlo&quot;), based in{" "}
          {legalInfo.location}.
        </p>
        <p>
          By creating an account, purchasing a subscription or using Harlo, the user agrees to these Terms and
          related policies.
        </p>
      </LegalSection>

      <LegalSection id="service" title="2. Service">
        <p>Harlo provides social media management functionality that may include:</p>
        <ul>
          <li>Social account connections</li>
          <li>Content creation</li>
          <li>Scheduling and publishing</li>
          <li>Calendar management</li>
          <li>Analytics</li>
          <li>Workspaces</li>
          <li>Team collaboration</li>
          <li>AI-assisted features</li>
        </ul>
        <p>Features may depend on subscription level and third-party social network availability.</p>
      </LegalSection>

      <LegalSection id="eligibility" title="3. Eligibility">
        <p>Users must have legal capacity to enter into these Terms. Users acting for an organisation confirm they have authority to bind that organisation.</p>
      </LegalSection>

      <LegalSection id="accounts" title="4. Accounts">
        <p>Users are responsible for:</p>
        <ul>
          <li>Accurate account information</li>
          <li>Password security</li>
          <li>Account activity</li>
          <li>Team access</li>
          <li>Reporting compromised accounts</li>
        </ul>
      </LegalSection>

      <LegalSection id="workspaces" title="5. Workspaces">
        <p>Workspace owners are responsible for invitations, permissions, removing unauthorised users, and team compliance.</p>
      </LegalSection>

      <LegalSection id="social-networks" title="6. Social Networks">
        <p>Harlo may integrate with Facebook, Instagram, LinkedIn, TikTok, YouTube, Threads, Pinterest, and other future integrations. Users remain subject to each third-party platform&apos;s terms.</p>
      </LegalSection>

      <LegalSection id="third-party-platform-changes" title="7. Third-Party Platform Changes">
        <p>
          Social networks may alter APIs, permissions, features, rate limits or publishing rules. Harlo cannot
          guarantee that every integration will remain permanently available.
        </p>
      </LegalSection>

      <LegalSection id="user-content" title="8. User Content">
        <p>Users retain ownership of their content. Users grant Harlo permission to host, process and transmit that content where necessary to provide requested functionality.</p>
      </LegalSection>

      <LegalSection id="content-responsibility" title="9. Content Responsibility">
        <p>Users are responsible for ensuring content:</p>
        <ul>
          <li>Is lawful</li>
          <li>Does not violate intellectual property rights</li>
          <li>Does not violate privacy rights</li>
          <li>Does not contain malicious software</li>
          <li>Does not facilitate fraud</li>
          <li>Does not exploit children</li>
          <li>Does not violate third-party platform rules</li>
        </ul>
      </LegalSection>

      <LegalSection id="social-permissions" title="10. Social Permissions">
        <p>Connecting a social account authorises Harlo to perform actions within approved permissions.</p>
      </LegalSection>

      <LegalSection id="scheduled-publishing" title="11. Scheduled Publishing">
        <p>Publishing may fail or be delayed because of:</p>
        <ul>
          <li>Third-party outages</li>
          <li>API failures</li>
          <li>Expired permissions</li>
          <li>Rate limits</li>
          <li>Invalid content</li>
          <li>Infrastructure problems</li>
          <li>Platform restrictions</li>
        </ul>
        <p>Users remain responsible for checking important scheduled content.</p>
      </LegalSection>

      <LegalSection id="ai-features" title="12. AI Features">
        <p>
          AI-generated content may be incomplete or inaccurate. Users must review AI-assisted content before
          publishing. AI output is not professional advice.
        </p>
      </LegalSection>

      <LegalSection id="plans" title="13. Plans">
        <p>Harlo may offer free and paid subscription plans. Features and usage limits depend on the plan selected.</p>
      </LegalSection>

      <LegalSection id="stripe-payments" title="14. Stripe Payments">
        <p>Paid subscriptions are processed using <strong>Stripe</strong>.</p>
      </LegalSection>

      <LegalSection id="renewal" title="15. Renewal">
        <p>Paid plans automatically renew unless otherwise stated or cancelled before renewal.</p>
      </LegalSection>

      <LegalSection id="cancellation" title="16. Cancellation">
        <p>Users may cancel through applicable billing settings. Cancellation normally prevents future renewal.</p>
      </LegalSection>

      <LegalSection id="refunds" title="17. Refunds">
        <p>Payments are generally non-refundable for change of mind or unused subscription time unless:</p>
        <ul>
          <li>Harlo agrees otherwise</li>
          <li>Promotional terms provide otherwise</li>
          <li>Applicable law requires otherwise</li>
        </ul>
        <p>Nothing removes rights that cannot legally be excluded under Australian law.</p>
      </LegalSection>

      <LegalSection id="fair-use" title="18. Fair Use">
        <p>Reasonable limits may apply to API usage, publishing, storage, upload size, connected accounts, workspaces, team members and automated requests.</p>
      </LegalSection>

      <LegalSection id="prohibited-use" title="19. Prohibited Use">
        <p>Users must not:</p>
        <ul>
          <li>Circumvent security</li>
          <li>Gain unauthorised access</li>
          <li>Introduce malware</li>
          <li>Abuse APIs</li>
          <li>Commit fraud</li>
          <li>Impersonate others</li>
          <li>Interfere with users</li>
          <li>Circumvent subscription restrictions</li>
          <li>Unlawfully scrape Harlo</li>
          <li>Use Harlo unlawfully</li>
        </ul>
      </LegalSection>

      <LegalSection id="intellectual-property" title="20. Intellectual Property">
        <p>
          Harlo&apos;s software, code, interfaces, branding, documentation and product design remain owned by{" "}
          {legalInfo.operator} or applicable licensors.
        </p>
      </LegalSection>

      <LegalSection id="feedback" title="21. Feedback">
        <p>Harlo may use voluntarily provided suggestions and feedback to improve the product.</p>
      </LegalSection>

      <LegalSection id="privacy" title="22. Privacy">
        <p>
          Use of Harlo is governed by the <Link href="/legal/privacy">Privacy Policy</Link>,{" "}
          <Link href="/legal/gdpr">GDPR &amp; Data Protection</Link>,{" "}
          <Link href="/legal/cookies">Cookie Policy</Link> and <Link href="/legal/data-deletion">Data Deletion</Link> pages.
        </p>
      </LegalSection>

      <LegalSection id="infrastructure" title="23. Infrastructure">
        <p>Current core providers include Vercel, Supabase and Stripe.</p>
      </LegalSection>

      <LegalSection id="service-availability" title="24. Service Availability">
        <p>Harlo does not guarantee uninterrupted availability.</p>
      </LegalSection>

      <LegalSection id="suspension" title="25. Suspension">
        <p>Access may be suspended for non-payment, fraud, abuse, security concerns, serious Terms violations, legal requirements, or social-platform requirements.</p>
      </LegalSection>

      <LegalSection id="termination" title="26. Termination">
        <p>Users may stop using Harlo and request account deletion. Harlo may terminate access where permitted under these Terms or applicable law.</p>
      </LegalSection>

      <LegalSection id="third-party-services" title="27. Third-Party Services">
        <p>Harlo is not responsible for the independent operation or policies of connected third-party services.</p>
      </LegalSection>

      <LegalSection id="disclaimer" title="28. Disclaimer">
        <p>To the maximum extent permitted by law, Harlo does not guarantee:</p>
        <ul>
          <li>Every post will publish successfully</li>
          <li>Every integration will remain available</li>
          <li>Analytics will always be complete</li>
          <li>The Service will always be error-free</li>
          <li>AI output will always be accurate</li>
        </ul>
      </LegalSection>

      <LegalSection id="australian-consumer-law" title="29. Australian Consumer Law">
        <p>Nothing in these Terms removes statutory rights under Australian Consumer Law that cannot legally be excluded.</p>
      </LegalSection>

      <LegalSection id="liability" title="30. Liability">
        <p>To the maximum extent permitted by law, {legalInfo.operator} is not responsible for indirect or consequential losses arising from matters such as:</p>
        <ul>
          <li>Third-party social outages</li>
          <li>Failed scheduled posts</li>
          <li>API changes</li>
          <li>User configuration mistakes</li>
          <li>Third-party account restrictions</li>
          <li>Unauthorised access caused by failure to secure credentials</li>
        </ul>
        <p>Nothing limits liability where doing so is prohibited by law.</p>
      </LegalSection>

      <LegalSection id="governing-law" title="31. Governing Law">
        <p>
          These Terms are governed by the laws of <strong>{legalInfo.governingLaw}</strong>. Applicable Commonwealth
          laws also apply.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="32. Contact">
        <p>
          <strong>{legalInfo.product}</strong>
          <br />A product of <strong>{legalInfo.operator}</strong>
          <br />
          {legalInfo.location}
        </p>
        <p>
          Privacy enquiries: <a href={`mailto:${legalInfo.privacyEmail}`}>{legalInfo.privacyEmail}</a>
        </p>
        <p>
          Related: <Link href="/legal/privacy">Privacy Policy</Link>,{" "}
          <Link href="/legal/gdpr">GDPR &amp; Data Protection</Link>,{" "}
          <Link href="/legal/cookies">Cookie Policy</Link>,{" "}
          <Link href="/legal/data-deletion">Data Deletion</Link>,{" "}
          <Link href="/legal/partner-terms">Partner Terms</Link>.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
