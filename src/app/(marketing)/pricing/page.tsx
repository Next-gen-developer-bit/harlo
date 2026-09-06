import type { Metadata } from "next";
import Section from "@/components/marketing/Section";
import FinalCta from "@/components/marketing/FinalCta";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Faq from "@/components/marketing/Faq";
import PricingCards from "@/components/marketing/PricingCards";
import PricingComparisonTable from "@/components/marketing/PricingComparisonTable";
import FadeIn from "@/components/marketing/FadeIn";
import PageViewTracker from "@/components/marketing/PageViewTracker";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Pricing | Harlo Social",
  description:
    "Simple social media management pricing for businesses, freelancers, teams and agencies. Start free and upgrade as you add brands, channels and collaborators.",
  path: "/pricing",
});

const faqs = [
  {
    q: "Can I change plans later?",
    a: "Yes. You can upgrade or downgrade your plan at any time from your account settings, and changes apply at your next billing date.",
  },
  {
    q: "What counts as a social account?",
    a: "Each connected profile or page you publish to counts as one social account, regardless of which platform it's on.",
  },
  {
    q: "What is a workspace?",
    a: "A workspace is a separate environment for managing a brand, business or client, with its own accounts, calendar and content.",
  },
  {
    q: "What is a team user?",
    a: "A team user is a person who can log in and work inside your Harlo account, such as a teammate or collaborator.",
  },
  {
    q: "What happens if I reach my social account limit?",
    a: "You'll be prompted to upgrade to a plan with a higher account limit before you can connect additional accounts.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. The Free plan lets you connect 2 social accounts and schedule up to 30 posts a month at no cost.",
  },
  {
    q: "Do paid plans include a free trial?",
    a: "Yes. Every paid plan includes a 14-day free trial, and you can cancel at any time during the trial.",
  },
  {
    q: "Can I cancel at any time?",
    a: "Yes. You can cancel at any time, and you'll keep access until the end of your current billing period.",
  },
  {
    q: "What happens to scheduled content if I downgrade?",
    a: "Already scheduled posts continue to publish as planned. If a lower plan's limits are exceeded, you may need to reduce accounts or workspaces before scheduling new content.",
  },
  {
    q: "Can agencies add more clients later?",
    a: "Yes. You can add more workspaces, accounts and team users as you grow, or contact us for higher limits on the Agency plan.",
  },
  {
    q: "Is annual billing discounted?",
    a: "Yes. Annual billing saves 20% compared to paying monthly, shown as a discounted monthly rate billed once per year.",
  },
  {
    q: "Which social networks are supported?",
    a: "Harlo is being built to support Instagram, Facebook, LinkedIn, TikTok, YouTube, Threads, Pinterest and X, subject to the publishing features available through each platform's official API.",
  },
];

export default function PricingPage() {
  return (
    <div className="relative">
      <PageViewTracker event="pricing_viewed" />
      <Section className="pb-6 pt-12 text-center md:pt-16">
        <FadeIn className="flex justify-center">
          <Eyebrow>Pricing</Eyebrow>
        </FadeIn>
        <FadeIn delay={60}>
          <h1 className="balance mx-auto mt-4 max-w-[30rem] text-h1-page font-semibold text-foreground sm:max-w-xl">
            Simple pricing that grows with you.
          </h1>
        </FadeIn>
        <FadeIn delay={120}>
          <p className="balance mx-auto mt-4 max-w-md text-[15.5px] leading-relaxed text-muted md:text-[17px]">
            Start small, then move up as you manage more accounts, brands and people. Clear plans, transparent
            pricing and no sales call required.
          </p>
        </FadeIn>
        <FadeIn delay={160}>
          <PricingCards />
        </FadeIn>
      </Section>

      <Section className="pt-8 md:pt-12">
        <FadeIn className="mx-auto max-w-xl text-center">
          <div className="flex justify-center">
            <Eyebrow>Compare plans</Eyebrow>
          </div>
          <h2 className="balance mx-auto mt-5 text-h2-page font-semibold text-foreground">
            Choose the plan that fits how you work.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            Every Harlo plan gives you access to supported social channels. Higher plans add more capacity,
            workspaces, collaboration and reporting as your needs grow.
          </p>
        </FadeIn>

        <FadeIn delay={100} className="mt-8">
          <PricingComparisonTable />
        </FadeIn>

        <FadeIn delay={120} className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Clear plan limits", copy: "Know exactly what each plan includes before you upgrade." },
            { title: "Upgrade when you need to", copy: "Start small and move up when your workflow becomes more complex." },
            { title: "Cancel anytime", copy: "No long-term commitment required." },
            { title: "Built to scale with you", copy: "Add more brands, users and functionality as your business grows." },
          ].map((c) => (
            <div key={c.title} className="rounded-[10px] border border-border bg-white p-5 text-center">
              <div className="text-[14.5px] font-semibold text-foreground">{c.title}</div>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">{c.copy}</p>
            </div>
          ))}
        </FadeIn>

        <FadeIn delay={160} className="mx-auto mt-10 max-w-2xl rounded-[10px] border border-border bg-surface/60 p-6 text-center sm:p-8">
          <h3 className="text-h4 font-semibold text-foreground">Need more room to grow?</h3>
          <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-muted">
            Need additional social accounts, workspaces or team members? Talk to us about a setup that fits your
            team.
          </p>
          <div className="mt-5 flex justify-center">
            <Button href="/contact" variant="secondary">
              Contact us
            </Button>
          </div>
        </FadeIn>
      </Section>

      <Section className="pt-8 md:pt-12">
        <FadeIn>
          <Faq items={faqs} title="Questions, answered." />
        </FadeIn>
      </Section>

      <FadeIn>
        <FinalCta
          title="Start free. Upgrade when you're ready."
          description="Choose the plan that fits what you manage today and move up when you need more."
        />
      </FadeIn>
    </div>
  );
}
