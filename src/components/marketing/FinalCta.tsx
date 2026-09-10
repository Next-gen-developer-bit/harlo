import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "./Section";

export default function FinalCta({
  title = "Your social calendar is about to get simpler.",
  description = "Plan, schedule and manage your content from one place.",
  microcopy,
  ctaLabel = "Start free",
  secondaryCtaLabel,
  secondaryCtaHref = "/pricing",
  /** Homepage-only: renders as a quiet, flat, full-width editorial moment
   * on the warm canvas (no card, no dark surface, no gradient banner)
   * instead of the dark rounded card used elsewhere. Every other existing
   * call site omits this and renders byte-identical to before. */
  fullBleed = false,
}: {
  title?: string;
  description?: string;
  microcopy?: string;
  ctaLabel?: string;
  /** Optional second, lighter-weight action next to the primary CTA — most pages don't need one. */
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  fullBleed?: boolean;
}) {
  const content = fullBleed ? (
    <>
      <h2 className="balance mx-auto max-w-xl text-h2 font-semibold text-foreground">{title}</h2>
      <p className="balance mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-muted">{description}</p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Button href="/signup" variant="primary" size="lg" trackEvent="signup_started">
          {ctaLabel}
        </Button>
        {secondaryCtaLabel && (
          <Button href={secondaryCtaHref} variant="secondary" size="lg">
            {secondaryCtaLabel}
          </Button>
        )}
      </div>
      {microcopy && <p className="mt-4 text-[13.5px] text-muted">{microcopy}</p>}
    </>
  ) : (
    <>
      <h2 className="balance mx-auto max-w-xl text-h2 font-semibold text-white">{title}</h2>
      <p className="balance mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-white/65">{description}</p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Button href="/signup" variant="secondary" size="lg" trackEvent="signup_started">
          {ctaLabel}
        </Button>
        {secondaryCtaLabel && (
          <Button href={secondaryCtaHref} variant="light" size="lg">
            {secondaryCtaLabel}
          </Button>
        )}
      </div>
      {microcopy && <p className="mt-4 text-[13.5px] text-white/50">{microcopy}</p>}
    </>
  );

  if (fullBleed) {
    return (
      <Section className="text-center">
        <Container className="relative">{content}</Container>
      </Section>
    );
  }

  return (
    <Section className="pb-28">
      <div className="relative overflow-hidden rounded-[12px] bg-[var(--dark-bg)] px-6 py-14 text-center sm:px-8 sm:py-20">
        <div className="relative">{content}</div>
      </div>
    </Section>
  );
}
