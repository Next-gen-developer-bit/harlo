import type { ReactNode } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

// PRODUCT SPOTLIGHT — a second, deliberately different section pattern
// reserved for a small number of high-value product moments (see the 2-4
// site-wide usages). Dark full-bleed section → one large white panel →
// lightweight editorial benefit row → the product interface on a darker
// internal canvas for contrast. Distinct from the staggered text+visual
// system and from the plain flagship dark showcases (e.g. homepage
// Analyse, /features/analytics hero) — do not use this for small features.

const gradients = {
  // Default — matches the reference gradient given in the design spec.
  teal: "linear-gradient(135deg, #111827 0%, #102A43 55%, #0F766E 100%)",
  // Alternate — Harlo-blue leaning, for a second spotlight elsewhere on
  // the site so two usages don't look identical.
  blue: "linear-gradient(135deg, #0B1220 0%, #111827 45%, #1E3A8A 100%)",
} as const;

interface SpotlightBenefit {
  title: string;
  description: string;
}

export default function ProductSpotlight({
  introLabel,
  introHref,
  benefits,
  visual,
  visualGradient = "teal",
  cta,
  className = "",
}: {
  introLabel?: string;
  introHref?: string;
  benefits: SpotlightBenefit[];
  visual: ReactNode;
  visualGradient?: keyof typeof gradients;
  cta?: { label: string; href: string };
  className?: string;
}) {
  const cols = benefits.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";

  return (
    <section className={`w-full bg-[var(--dark-bg)] py-14 sm:py-16 md:py-24 lg:py-28 ${className}`}>
      {introLabel && introHref && (
        <div className="mb-8 flex justify-center px-6 md:mb-10">
          <Link
            href={introHref}
            className="group inline-flex items-center gap-1.5 text-[13.5px] font-medium text-white/70 underline decoration-white/25 underline-offset-4 transition-colors duration-200 hover:text-white"
          >
            {introLabel}
            <span aria-hidden="true" className="inline-block transition-transform duration-200 motion-safe:group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      )}

      <div className="mx-auto w-[calc(100%-32px)] rounded-[28px] border border-[rgba(15,23,42,0.08)] bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:w-[calc(100%-48px)] sm:p-8 md:rounded-[40px] md:p-10 lg:w-[min(calc(100%-80px),1500px)] lg:max-w-[1480px] lg:rounded-[56px] lg:p-16">
        <div className={`grid grid-cols-1 gap-y-7 sm:grid-cols-2 sm:gap-8 ${cols} lg:gap-x-10 lg:gap-y-0`}>
          {benefits.map((b, i) => (
            <div key={b.title} className="group">
              <div
                className={`h-[3px] w-9 rounded-full transition-all duration-200 group-hover:w-12 ${
                  i === 0 ? "bg-gradient-to-r from-primary to-primary/20" : "bg-border-dark"
                }`}
              />
              <div className="mt-3.5 text-[18px] font-semibold text-foreground">{b.title}</div>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{b.description}</p>
            </div>
          ))}
        </div>

        <div
          className="fade-up mx-auto mt-8 w-full max-w-[1240px] rounded-[20px] p-4 sm:mt-10 sm:p-6 lg:mt-12"
          style={{ background: gradients[visualGradient] }}
        >
          {visual}
        </div>

        {cta && (
          <div className="mt-6 flex justify-center sm:justify-end">
            <Button href={cta.href} variant="dark" size="md">
              {cta.label}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
