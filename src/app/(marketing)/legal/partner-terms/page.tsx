import type { Metadata } from "next";
import Link from "next/link";
import LegalPageShell from "@/components/legal/LegalPageShell";
import LegalSection from "@/components/legal/LegalSection";
import { legalInfo } from "@/lib/legal-info";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Partner Program Terms | Harlo Social",
  description: "The terms that apply to Harlo's partner and affiliate program.",
  path: "/legal/partner-terms",
});

const sections = [
  { id: "program", label: "Program" },
  { id: "qualified-customer", label: "Qualified Customer" },
  { id: "commission", label: "Commission" },
  { id: "referral-window", label: "Referral Window" },
  { id: "validation", label: "Validation" },
  { id: "payments", label: "Payments" },
  { id: "partner-requirements", label: "Partner Requirements" },
  { id: "prohibited-activities", label: "Prohibited Activities" },
  { id: "branding", label: "Branding" },
  { id: "confidentiality", label: "Confidentiality" },
  { id: "independent-relationship", label: "Independent Relationship" },
  { id: "no-guaranteed-income", label: "No Guaranteed Income" },
  { id: "termination", label: "Termination" },
  { id: "program-changes", label: "Program Changes" },
  { id: "governing-law", label: "Governing Law" },
  { id: "contact", label: "Contact" },
];

export default function PartnerTermsPage() {
  return (
    <LegalPageShell
      eyebrow="Partner Terms"
      title="Partner Program Terms"
      lastUpdated={legalInfo.lastUpdated}
      intro="These terms apply to anyone who applies to, or participates in, the Harlo Partner Program. By applying, you agree to these terms in addition to Harlo's general Terms of Service."
      sections={sections}
      contactEmail={legalInfo.privacyEmail}
      contactLabel="Contact the privacy team"
    >
      <LegalSection id="program" title="1. Program">
        <p>The Harlo Partner Program allows approved Partners to refer new paying customers and earn commission. Partners may include:</p>
        <ul>
          <li>Creators</li>
          <li>Agencies</li>
          <li>Consultants</li>
          <li>Marketers</li>
          <li>Educators</li>
          <li>Technology partners</li>
          <li>Other approved businesses or individuals</li>
        </ul>
        <p>Participation requires approval.</p>
      </LegalSection>

      <LegalSection id="qualified-customer" title="2. Qualified Customer">
        <p>A Qualified Customer must:</p>
        <ul>
          <li>Be a new Harlo customer</li>
          <li>Not already have an existing subscription</li>
          <li>Not already be in an active Harlo sales process</li>
          <li>Register within the referral attribution window</li>
          <li>Purchase an eligible paid plan</li>
          <li>Complete successful payment</li>
          <li>Remain eligible through the validation period</li>
        </ul>
      </LegalSection>

      <LegalSection id="commission" title="3. Commission">
        {legalInfo.partnerCommissionConfirmed ? (
          <>
            <p>Approved Partners earn:</p>
            <ul>
              <li><strong>{legalInfo.partnerCommission} recurring commission</strong></li>
            </ul>
            <p>
              The Partner earns {legalInfo.partnerCommission} of qualifying subscription revenue for as long as the
              referred customer remains an active paying Harlo customer, and the Partner remains compliant with the
              Partner Program.
            </p>
          </>
        ) : (
          <p>
            Approved Partners earn recurring commission on qualifying subscription revenue for as long as the
            referred customer remains an active paying Harlo customer, and the Partner remains compliant with the
            Partner Program. The specific commission rate is confirmed when a Partner application is approved.
          </p>
        )}
        <p>Commission excludes taxes, refunds, chargebacks, credits, discounts and fraudulent transactions.</p>
      </LegalSection>

      <LegalSection id="referral-window" title="4. Referral Window">
        {legalInfo.partnerReferralWindowConfirmed ? (
          <>
            <p>Referral attribution lasts:</p>
            <ul>
              <li><strong>{legalInfo.partnerReferralWindow}</strong></li>
            </ul>
            <p>
              A referred visitor must create their Harlo account within {legalInfo.partnerReferralWindow} of using
              the Partner&apos;s approved referral link.
            </p>
          </>
        ) : (
          <p>
            A referred visitor must create their Harlo account within a fixed attribution window of using the
            Partner&apos;s approved referral link. The exact window is confirmed when a Partner application is
            approved.
          </p>
        )}
      </LegalSection>

      <LegalSection id="validation" title="5. Validation">
        {legalInfo.partnerValidationPeriodConfirmed ? (
          <>
            <p>Commission is subject to a:</p>
            <ul>
              <li><strong>{legalInfo.partnerValidationPeriod} validation period</strong></li>
            </ul>
          </>
        ) : (
          <p>Commission is subject to a validation period, confirmed when a Partner application is approved.</p>
        )}
        <p>This allows Harlo to confirm successful payment, no refund, no chargeback, no fraud, no self-referral, and compliance with the Partner Terms.</p>
      </LegalSection>

      <LegalSection id="payments" title="6. Payments">
        {legalInfo.partnerPayoutScheduleConfirmed ? (
          <>
            <p>Approved commissions are paid:</p>
            <ul>
              <li><strong>{legalInfo.partnerPayoutSchedule}</strong></li>
            </ul>
          </>
        ) : (
          <p>Approved commissions are paid out on a recurring schedule confirmed when a Partner application is approved.</p>
        )}
        <p>
          {legalInfo.partnerValidationPeriodConfirmed
            ? `Payment timing may account for the ${legalInfo.partnerValidationPeriod} validation period. `
            : "Payment timing may account for the validation period described above. "}
          Partners are responsible for taxes associated with Partner income.
        </p>
      </LegalSection>

      <LegalSection id="partner-requirements" title="7. Partner Requirements">
        <p>Partners must:</p>
        <ul>
          <li>Accurately represent Harlo</li>
          <li>Clearly disclose commercial relationships</li>
          <li>Follow advertising laws</li>
          <li>Follow privacy laws</li>
          <li>Use approved branding appropriately</li>
          <li>Avoid misleading claims</li>
          <li>Protect customer information</li>
        </ul>
      </LegalSection>

      <LegalSection id="prohibited-activities" title="8. Prohibited Activities">
        <p>Partners must not:</p>
        <ul>
          <li>Self-refer</li>
          <li>Create fake accounts</li>
          <li>Generate fraudulent referrals</li>
          <li>Use bots or click farms</li>
          <li>Use cookie stuffing</li>
          <li>Impersonate Harlo Social</li>
          <li>Claim to be an employee</li>
          <li>Mislead customers</li>
          <li>Bid on Harlo branded search terms without approval</li>
          <li>Use Harlo trademarks in domains without approval</li>
          <li>Spam</li>
          <li>Use misleading coupon websites</li>
          <li>Make false claims</li>
          <li>Manipulate referral tracking</li>
        </ul>
      </LegalSection>

      <LegalSection id="branding" title="9. Branding">
        <p>
          All Harlo Social trademarks, logos, software and marketing assets remain the property of Harlo Social.
          Partner branding permission is limited, non-exclusive and revocable.
        </p>
      </LegalSection>

      <LegalSection id="confidentiality" title="10. Confidentiality">
        <p>Non-public Partner information must remain confidential.</p>
      </LegalSection>

      <LegalSection id="independent-relationship" title="11. Independent Relationship">
        <p>Partners are independent. Participation does not create employment, agency, partnership, franchise, or joint venture. Partners cannot make commitments on behalf of Harlo.</p>
      </LegalSection>

      <LegalSection id="no-guaranteed-income" title="12. No Guaranteed Income">
        <p>Harlo does not guarantee Partner earnings.</p>
      </LegalSection>

      <LegalSection id="termination" title="13. Termination">
        <p>Harlo may suspend or terminate Partners for fraud, misleading advertising, brand misuse, illegal activity, referral manipulation, or breach of these Partner Terms.</p>
      </LegalSection>

      <LegalSection id="program-changes" title="14. Program Changes">
        <p>
          Harlo may modify commission, eligibility, payment methods, referral requirements, tracking, or
          promotional rules. Reasonable notice will be given for material changes where practical. Outstanding,
          correctly earned commission at the time of any change or termination will still be paid out according to
          the standard payment schedule, unless forfeited under Section 8.
        </p>
      </LegalSection>

      <LegalSection id="governing-law" title="15. Governing Law">
        <p>
          These Partner Terms are governed by the laws of <strong>{legalInfo.governingLaw}</strong>.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="16. Contact">
        <p>
          Privacy-related Partner enquiries: <a href={`mailto:${legalInfo.privacyEmail}`}>{legalInfo.privacyEmail}</a>.
          For general partner enquiries, see the{" "}
          <Link href="/partners">Partner Program page</Link>.
        </p>
        <p>
          Related: <Link href="/legal/privacy">Privacy Policy</Link>,{" "}
          <Link href="/legal/terms">Terms of Service</Link>.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
