import type { Metadata } from "next";
import Link from "next/link";
import LegalPageShell from "@/components/legal/LegalPageShell";
import LegalSection from "@/components/legal/LegalSection";
import { legalInfo } from "@/lib/legal-info";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy | Harlo Social",
  description: "How Harlo Social collects, uses and protects your information, including data from connected social media accounts.",
  path: "/legal/privacy",
});

const sections = [
  { id: "introduction", label: "Introduction" },
  { id: "our-role", label: "Our Role" },
  { id: "information-we-collect", label: "Information We Collect" },
  { id: "how-we-use-information", label: "How We Use Information" },
  { id: "social-media-integrations", label: "Social Media Integrations" },
  { id: "disconnecting-social-accounts", label: "Disconnecting Social Accounts" },
  { id: "google-youtube", label: "Google and YouTube" },
  { id: "ai-assisted-features", label: "AI-Assisted Features" },
  { id: "cookies", label: "Cookies" },
  { id: "service-providers", label: "Service Providers" },
  { id: "sharing-information", label: "Sharing Information" },
  { id: "data-retention", label: "Data Retention" },
  { id: "security", label: "Security" },
  { id: "international-processing", label: "International Processing" },
  { id: "your-rights", label: "Your Rights" },
  { id: "childrens-privacy", label: "Children's Privacy" },
  { id: "changes", label: "Changes" },
  { id: "contact", label: "Contact" },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      lastUpdated={legalInfo.lastUpdated}
      intro="This Privacy Policy explains what information Harlo collects, how it's used, how it may be shared, how long it may be retained, and the rights and choices available to users. It applies to the Harlo website, web application, integrations and related services."
      sections={sections}
      contactEmail={legalInfo.privacyEmail}
    >
      <LegalSection id="introduction" title="1. Introduction">
        <p>
          <strong>Harlo Social</strong> (&quot;Harlo&quot;) is a social media management platform based in{" "}
          {legalInfo.location}.
        </p>
        <p>
          Harlo helps growing businesses, marketing teams, freelance social media managers and agencies plan,
          schedule, publish and manage social media content across supported social platforms.
        </p>
        <p>
          This Privacy Policy explains what information we collect, how we use it, how it may be shared, how long
          it may be retained, and the rights and choices available to users.
        </p>
        <p>This Policy applies to the Harlo website, web application, integrations and related services.</p>
      </LegalSection>

      <LegalSection id="our-role" title="2. Our Role">
        <p>
          For information collected directly through Harlo, {legalInfo.operator} generally acts as the
          organisation responsible for determining how and why that information is processed.
        </p>
        <p>
          In some cases, a business or agency may use Harlo to process information on behalf of its own
          organisation or customers. In those circumstances, the customer may act as the data controller and
          Harlo may act as a data processor or service provider.
        </p>
      </LegalSection>

      <LegalSection id="information-we-collect" title="3. Information We Collect">
        <h3>Account Information</h3>
        <p>We may collect:</p>
        <ul>
          <li>Name</li>
          <li>Email address</li>
          <li>Authentication information</li>
          <li>Time zone</li>
          <li>Preferences</li>
          <li>Workspace information</li>
          <li>Team member details and permissions</li>
          <li>Subscription information</li>
        </ul>

        <h3>Connected Social Media Accounts</h3>
        <p>
          When a user connects a supported social network, Harlo may receive information made available through
          that platform according to the permissions granted. This may include:
        </p>
        <ul>
          <li>Display name</li>
          <li>Username or social handle</li>
          <li>Profile image</li>
          <li>Account, page, profile or channel ID</li>
          <li>Authentication and access tokens</li>
          <li>Connected pages or profiles</li>
          <li>Existing or published posts</li>
          <li>Images and videos</li>
          <li>Follower counts</li>
          <li>Engagement information</li>
          <li>Views, impressions and reach</li>
          <li>Likes, comments, shares and clicks</li>
          <li>Analytics and performance data</li>
        </ul>
        <p>The exact information available depends on the social network, account type and permissions granted.</p>

        <h3>User Content</h3>
        <p>We may process content created, uploaded or scheduled through Harlo, including:</p>
        <ul>
          <li>Captions and text</li>
          <li>Images and videos</li>
          <li>Links and hashtags</li>
          <li>Draft posts and scheduled posts</li>
          <li>Publishing dates and times</li>
          <li>Uploaded media</li>
          <li>Publishing history</li>
        </ul>
        <p>Users retain ownership of their User Content.</p>

        <h3>Payments</h3>
        <p>Payments and subscriptions are processed through <strong>Stripe</strong>. Harlo may receive limited payment-related information including:</p>
        <ul>
          <li>Subscription plan</li>
          <li>Billing status</li>
          <li>Transaction amount and date</li>
          <li>Payment status</li>
          <li>Limited payment identifiers</li>
        </ul>
        <p>Harlo does not normally store full payment card details.</p>

        <h3>Technical and Usage Information</h3>
        <p>We may automatically collect:</p>
        <ul>
          <li>IP address</li>
          <li>Browser type</li>
          <li>Device type</li>
          <li>Operating system</li>
          <li>Approximate location derived from IP address</li>
          <li>Pages viewed and features used</li>
          <li>Login activity</li>
          <li>Dates and times of access</li>
          <li>Application errors and performance information</li>
          <li>Navigation activity</li>
        </ul>

        <h3>Customer Support</h3>
        <p>If users contact Harlo, we may collect:</p>
        <ul>
          <li>Contact information</li>
          <li>Message contents and support requests</li>
          <li>Screenshots and files voluntarily provided</li>
          <li>Technical information</li>
          <li>Feedback</li>
        </ul>
      </LegalSection>

      <LegalSection id="how-we-use-information" title="4. How We Use Information">
        <p>We may use information to:</p>
        <ul>
          <li>Create and manage accounts</li>
          <li>Authenticate users</li>
          <li>Connect social media accounts</li>
          <li>Schedule and publish content</li>
          <li>Upload media</li>
          <li>Retrieve authorised social media information</li>
          <li>Provide analytics</li>
          <li>Manage workspaces and teams</li>
          <li>Process subscriptions</li>
          <li>Provide support</li>
          <li>Send account and service communications</li>
          <li>Prevent fraud and abuse</li>
          <li>Protect account security</li>
          <li>Troubleshoot problems and improve performance</li>
          <li>Analyse product usage and develop new functionality</li>
          <li>Comply with legal obligations</li>
          <li>Enforce our policies</li>
        </ul>
        <p>
          Where permitted, Harlo may also send users product updates or marketing communications. Users may
          unsubscribe from marketing communications at any time.
        </p>
      </LegalSection>

      <LegalSection id="social-media-integrations" title="5. Social Media Integrations">
        <p>Harlo may support integrations with platforms such as:</p>
        <ul>
          <li>Facebook</li>
          <li>Instagram</li>
          <li>LinkedIn</li>
          <li>TikTok</li>
          <li>YouTube</li>
          <li>Threads</li>
          <li>Pinterest</li>
          <li>Other supported social platforms</li>
        </ul>
        <p>
          When users connect a social network, they authorise Harlo to exchange information with that platform
          according to the permissions they approve. Each social network operates under its own privacy policy and
          terms. Harlo does not control the independent privacy practices of third-party social platforms.
        </p>
        <p>
          Once content has been published to a third-party social network, deleting it from Harlo does not
          necessarily remove it from that network. Users may need to delete published content directly through the
          relevant social platform.
        </p>
      </LegalSection>

      <LegalSection id="disconnecting-social-accounts" title="6. Disconnecting Social Accounts">
        <p>Users may disconnect supported accounts through Harlo where available.</p>
        <p>
          Users may also revoke Harlo access through the relevant social platform&apos;s security or
          connected-app settings. Revoking access prevents future authorised access but does not automatically
          delete content already published.
        </p>
      </LegalSection>

      <LegalSection id="google-youtube" title="7. Google and YouTube">
        <p>If users connect Google or YouTube services, Harlo may use Google and YouTube APIs. Depending on granted permissions, information may include:</p>
        <ul>
          <li>Channel details and channel ID</li>
          <li>Videos and video metadata</li>
          <li>Analytics and engagement information</li>
          <li>Authentication tokens</li>
        </ul>
        <p>
          Users may revoke access through Google account security settings. Use of YouTube through Harlo may
          also be subject to Google&apos;s Privacy Policy and YouTube&apos;s Terms of Service.
        </p>
      </LegalSection>

      <LegalSection id="ai-assisted-features" title="8. AI-Assisted Features">
        <p>Harlo may offer AI-assisted features including:</p>
        <ul>
          <li>Caption generation</li>
          <li>Content suggestions</li>
          <li>Rewriting</li>
          <li>Content recommendations</li>
          <li>Performance insights</li>
        </ul>
        <p>
          When a user chooses to use an AI feature, information required to perform that request may be processed
          through third-party technology providers. Only information reasonably necessary to provide the feature
          should be submitted.
        </p>
        <p>
          Social passwords, payment card details and social access tokens must not intentionally be sent as AI
          prompts. Users remain responsible for reviewing AI-assisted content before publishing it.
        </p>
      </LegalSection>

      <LegalSection id="cookies" title="9. Cookies">
        <p>Harlo uses cookies and similar technologies for:</p>
        <ul>
          <li>Authentication</li>
          <li>Security</li>
          <li>Preferences</li>
          <li>Analytics</li>
          <li>Performance</li>
          <li>Marketing attribution</li>
        </ul>
        <p>
          See the <Link href="/legal/cookies">Cookie Policy</Link> for more information, or manage your preferences
          any time via Cookie Settings in the footer.
        </p>
      </LegalSection>

      <LegalSection id="service-providers" title="10. Service Providers">
        <p>Harlo currently uses:</p>
        <h3>Vercel</h3>
        <p>Used for application hosting, deployment and delivery.</p>
        <h3>Supabase</h3>
        <p>Used for database infrastructure, authentication and storage.</p>
        <h3>Stripe</h3>
        <p>Used for payments and subscription processing.</p>
        <h3>CookieYes</h3>
        <p>Used for cookie consent and preference management.</p>
        <h3>Google Analytics 4</h3>
        <p>Used for website traffic, usage and conversion analytics where enabled.</p>
        <h3>Meta Pixel</h3>
        <p>Used for advertising measurement and attribution where enabled.</p>
        <p>Only information reasonably necessary for each provider to perform its role should be shared. Providers may operate internationally.</p>
      </LegalSection>

      <LegalSection id="sharing-information" title="11. Sharing Information">
        <p>Harlo does not sell personal information in exchange for money. Information may be shared with:</p>
        <ul>
          <li>Connected social networks</li>
          <li>Authorised {legalInfo.operator} personnel</li>
          <li>Contractors necessary to operate Harlo</li>
          <li>Infrastructure providers</li>
          <li>Payment providers</li>
          <li>Analytics providers</li>
          <li>Security providers</li>
          <li>Customer support providers</li>
          <li>AI technology providers</li>
          <li>Government or regulatory authorities where legally required</li>
        </ul>
        <p>
          Information may also transfer as part of a merger, acquisition, financing, restructuring or sale of
          Harlo or related {legalInfo.operator} assets.
        </p>
      </LegalSection>

      <LegalSection id="data-retention" title="12. Data Retention">
        <p>Information is retained only for as long as reasonably necessary.</p>
        <p>While an account remains active, Harlo may retain information required to operate the account and Service.</p>
        <p>When an account is deleted, Harlo will take reasonable steps to delete or de-identify associated personal information, subject to:</p>
        <ul>
          <li>Backups</li>
          <li>Legal requirements</li>
          <li>Fraud prevention</li>
          <li>Security requirements</li>
          <li>Accounting and tax requirements</li>
          <li>Payment records</li>
          <li>Disputes</li>
        </ul>
        <p>Anonymous or aggregated information that no longer identifies a user may be retained for analytics and product improvement.</p>
      </LegalSection>

      <LegalSection id="security" title="13. Security">
        <p>Harlo uses reasonable administrative and technical measures designed to protect information. These may include:</p>
        <ul>
          <li>Authentication controls</li>
          <li>Restricted access</li>
          <li>Secure credential handling</li>
          <li>Secure social-token handling</li>
          <li>Encryption where appropriate</li>
          <li>Infrastructure monitoring</li>
          <li>Backups</li>
          <li>Security updates</li>
        </ul>
        <p>No online service can guarantee absolute security.</p>
      </LegalSection>

      <LegalSection id="international-processing" title="14. International Processing">
        <p>
          Harlo uses providers that may process or store information in countries outside the user&apos;s
          country. Where applicable privacy laws require international data-transfer protections, appropriate
          lawful safeguards will be used. See our <Link href="/legal/gdpr">GDPR &amp; Data Protection</Link> page
          for more detail.
        </p>
      </LegalSection>

      <LegalSection id="your-rights" title="15. Your Rights">
        <p>Depending on location, users may have rights to:</p>
        <ul>
          <li>Access personal information</li>
          <li>Request correction</li>
          <li>Request deletion</li>
          <li>Request restriction</li>
          <li>Object to certain processing</li>
          <li>Request portability</li>
          <li>Withdraw consent</li>
          <li>Opt out of marketing</li>
          <li>Disconnect social media accounts</li>
          <li>Revoke third-party permissions</li>
        </ul>
        <p>Identity verification may be required before certain requests are processed.</p>
      </LegalSection>

      <LegalSection id="childrens-privacy" title="16. Children's Privacy">
        <p>
          Harlo is designed primarily for businesses, marketing teams and professional users. Harlo does
          not knowingly collect personal information from children where doing so would violate applicable law.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="17. Changes">
        <p>
          This Privacy Policy may be updated as Harlo, its technology, integrations or legal obligations change.
          The latest update date will always appear at the top of this page.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="18. Contact">
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
          Related: <Link href="/legal/gdpr">GDPR &amp; Data Protection</Link>,{" "}
          <Link href="/legal/cookies">Cookie Policy</Link>,{" "}
          <Link href="/legal/data-deletion">Data Deletion</Link>,{" "}
          <Link href="/legal/terms">Terms of Service</Link>.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
