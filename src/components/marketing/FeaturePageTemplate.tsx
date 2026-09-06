import type { ComponentType, CSSProperties, ReactNode } from "react";
import Link from "next/link";
import Section from "@/components/marketing/Section";
import FinalCta from "@/components/marketing/FinalCta";
import Faq, { type FaqItem } from "@/components/marketing/Faq";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import { BrowserFrame } from "@/components/mockups/Frames";
import { AppShell } from "@/components/mockups/AppShell";

export type BenefitItem = {
  title: string;
  copy: string;
  /** Small concept icon shown in a tinted badge above the title. Optional. */
  icon?: ComponentType<{ className?: string; style?: CSSProperties }>;
};

export type RelatedLink = { name: string; href: string; description: string };

const benefitTints = ["var(--pastel-blue)", "var(--pastel-green)", "var(--pastel-purple)", "var(--pastel-peach)"];

export default function FeaturePageTemplate({
  eyebrow,
  h1,
  subcopy,
  appShellTitle,
  mockup,
  intro,
  benefits,
  benefitsSlot,
  afterBenefits,
  related,
  faqs,
  ctaTitle,
  ctaCopy,
}: {
  eyebrow: string;
  h1: string;
  subcopy: string;
  appShellTitle: string;
  mockup: ReactNode;
  intro?: { title: string; copy: string };
  benefits?: BenefitItem[];
  /** Override the default benefits grid with a bespoke layout. */
  benefitsSlot?: ReactNode;
  /** Extra section rendered between benefits and FAQ — brings its own <Section> wrapper. */
  afterBenefits?: ReactNode;
  related: RelatedLink[];
  faqs?: FaqItem[];
  ctaTitle: string;
  ctaCopy: string;
}) {
  return (
    <>
      <Section className="pb-10 pt-12 text-center md:pt-16">
        <div className="flex justify-center">
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        <h1 className="balance mx-auto mt-6 max-w-3xl text-h1-page font-semibold text-foreground">
          {h1}
        </h1>
        <p className="balance mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-muted md:text-[18px]">
          {subcopy}
        </p>
        <div className="mt-8 flex justify-center">
          <Button href="/signup" size="lg" trackEvent="signup_started">Start free</Button>
        </div>
      </Section>

      <Section className="pt-0">
        <BrowserFrame className="mx-auto max-w-[980px]">
          <AppShell title={appShellTitle}>{mockup}</AppShell>
        </BrowserFrame>
      </Section>

      {intro && (
        <Section className="bg-surface/60">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-h2-page font-semibold text-foreground">{intro.title}</h2>
            <p className="balance mt-4 text-[15.5px] leading-relaxed text-muted">{intro.copy}</p>
          </div>
        </Section>
      )}

      <Section className={intro ? "" : "bg-surface/60"}>
        {benefitsSlot ? (
          benefitsSlot
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {benefits?.map((b, i) => {
              const Icon = b.icon;
              const tint = benefitTints[i % benefitTints.length];
              return (
                <div
                  key={b.title}
                  className={`rounded-[10px] border border-border p-6 transition-all duration-200 hover:-translate-y-[3px] hover:border-[rgba(61,90,254,0.18)] hover:shadow-[0_20px_40px_-24px_rgba(16,24,40,0.28)] ${
                    i % 2 === 0 ? "bg-surface/70" : "bg-white"
                  }`}
                >
                  {Icon && (
                    <div
                      className="mb-4 flex h-9 w-9 items-center justify-center rounded-[10px]"
                      style={{ backgroundColor: tint }}
                    >
                      <Icon className="h-[17px] w-[17px]" />
                    </div>
                  )}
                  <div className="text-[17px] font-semibold text-foreground">{b.title}</div>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted">{b.copy}</p>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {afterBenefits}

      {faqs && faqs.length > 0 && (
        <Section className={afterBenefits ? "" : "bg-surface/60"}>
          <Faq items={faqs} />
        </Section>
      )}

      <Section>
        <h2 className="mb-8 text-[20px] font-semibold tracking-tight text-foreground">Related features</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {related.map((r) => (
            <Link key={r.href} href={r.href} className="surface-card rounded-[10px] p-5">
              <div className="text-[14.5px] font-semibold text-foreground">{r.name}</div>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">{r.description}</p>
            </Link>
          ))}
        </div>
      </Section>

      <FinalCta title={ctaTitle} description={ctaCopy} />
    </>
  );
}
