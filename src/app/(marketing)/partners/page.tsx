import type { Metadata } from "next";
import Section from "@/components/marketing/Section";
import Faq from "@/components/marketing/Faq";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import { legalInfo } from "@/lib/legal-info";
import { buildMetadata } from "@/lib/seo";

const title = "Partner Program | Harlo Social";
const description = "Refer businesses, teams and agencies to Harlo and earn recurring commission for every customer you bring on.";

export const metadata: Metadata = buildMetadata({
  title,
  description,
  path: "/partners",
});

const steps = [
  { n: 1, title: "Apply", copy: "Tell us about your audience. Approval is quick and free." },
  { n: 2, title: "Share your link", copy: "Get a unique referral link and ready-made assets to share with your network." },
  { n: 3, title: "Earn", copy: "Earn recurring commission for every paying customer you refer, for as long as they stay on Harlo." },
];

const audiences = [
  { name: "Marketing consultants and freelancers", tint: "var(--pastel-blue)" },
  { name: "Agencies recommending tools to clients", tint: "var(--pastel-green)" },
  { name: "Marketing and social media creators", tint: "var(--pastel-peach)" },
  { name: "Business-focused communities and newsletters", tint: "var(--pastel-purple)" },
];

const reasons = [
  "Recurring revenue rather than one-off payouts",
  "A product designed for ongoing use",
  "Marketing assets provided",
  "Straightforward referral tracking",
];

const faqs = [
  { q: "How do I join?", a: "Apply through the partner application. Approval is quick and free, and you don't need to be a current Harlo customer to apply." },
  { q: "How does tracking work?", a: "Once approved, you get a unique referral link. Signups that come through your link are attributed to you automatically." },
  { q: "When and how do I get paid?", a: "Commission is paid out on a recurring schedule once referrals are confirmed. Exact payout timing is confirmed when your partner account is approved." },
  { q: "Can agencies join?", a: "Yes. Agencies and consultants are welcome to apply, and often refer multiple clients over time." },
  { q: "Is there a limit on how much I can earn?", a: "No. Commission scales with the number of paying customers you refer, for as long as they stay on Harlo." },
];

export default function PartnersPage() {
  return (
    <>
      {/* HERO */}
      <Section className="pb-12 pt-16 text-center md:pt-20">
        <div className="flex justify-center">
          <Eyebrow>Partner Program</Eyebrow>
        </div>
        <h1 className="balance mx-auto mt-6 max-w-2xl text-h1-page font-semibold text-foreground">
          Partner with Harlo.
        </h1>
        <p className="balance mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-muted md:text-[18px]">
          Refer businesses, teams and agencies to Harlo and earn recurring commission for every customer you bring
          on. Simple to join, built for people who already talk to the right audience.
        </p>
        <div className="mt-8 flex justify-center">
          <Button href="/contact?interest=partner" size="lg">Become a partner</Button>
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section className="bg-surface/60">
        <h2 className="mb-10 text-center text-h2-page font-semibold text-foreground">How it works</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="surface-card rounded-[10px] bg-white p-7">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-[13px] font-semibold text-primary">
                {s.n}
              </div>
              <div className="text-[16px] font-semibold text-foreground">{s.title}</div>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{s.copy}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* WHAT YOU EARN — each commercial figure (commission rate, attribution
          window, validation period, payout schedule) is gated behind its own
          `*Confirmed` flag in legalInfo, so a figure can go live the moment
          it's actually approved without waiting on the others. Do not render
          a specific number here until its flag is true — see legal-info.ts. */}
      <Section>
        <div className="mx-auto max-w-lg text-center">
          <Eyebrow>What you earn</Eyebrow>
          <h2 className="balance mt-4 text-h2-page font-semibold tracking-tight text-foreground">
            {legalInfo.partnerCommissionConfirmed
              ? `${legalInfo.partnerCommission} recurring commission.`
              : "Recurring commission on every referral."}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            {legalInfo.partnerCommissionConfirmed
              ? `Earn ${legalInfo.partnerCommission} of every payment your referral makes, for as long as they remain a paying customer.`
              : "Approved partners earn recurring commission for as long as their referral stays a paying Harlo customer."}{" "}
            {legalInfo.partnerReferralWindowConfirmed && legalInfo.partnerValidationPeriodConfirmed && legalInfo.partnerPayoutScheduleConfirmed ? (
              <>
                Referrals are attributed within a {legalInfo.partnerReferralWindow} window, confirmed after a{" "}
                {legalInfo.partnerValidationPeriod} validation period, then paid out{" "}
                {legalInfo.partnerPayoutSchedule.toLowerCase()}.
              </>
            ) : (
              "Attribution window and payout schedule are confirmed when your partner account is approved."
            )}
          </p>
        </div>
      </Section>

      {/* WHO IT'S FOR */}
      <Section className="bg-surface/60">
        <h2 className="mb-10 text-center text-h2-page font-semibold text-foreground">Who it&apos;s for</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((a) => (
            <div key={a.name} className="rounded-[12px] border border-border bg-white p-6">
              <div className="mb-4 h-9 w-9 rounded-full" style={{ background: a.tint }} />
              <div className="text-[14.5px] font-medium leading-snug text-foreground">{a.name}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* WHY PARTNER WITH HARLO — paired statements with a thin divider,
          no bullet dots. */}
      <Section>
        <h2 className="mb-10 text-center text-h2-page font-semibold text-foreground">Why partner with Harlo</h2>
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-x-10 sm:grid-cols-2">
          {reasons.map((r, i) => (
            <div
              key={r}
              className={`border-t border-border py-4 text-[14.5px] leading-relaxed text-foreground first:pt-0 sm:py-4 ${
                i < 2 ? "sm:border-t-0 sm:pt-0" : ""
              }`}
            >
              {r}
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-surface/60">
        <Faq items={faqs} title="Partner FAQs" />
      </Section>

      {/* CLOSING CTA */}
      <Section className="pb-28 text-center">
        <h2 className="balance mx-auto max-w-lg text-h2-page font-semibold text-foreground">
          Ready to partner with Harlo?
        </h2>
        <div className="mt-8 flex justify-center">
          <Button href="/contact?interest=partner" size="lg">Become a partner</Button>
        </div>
      </Section>
    </>
  );
}
