import Button from "@/components/ui/Button";
import FeatureCheck from "@/components/ui/FeatureCheck";
import { type Plan, type BillingPeriod, getAnnualPricing, formatPrice, CURRENCY_LABEL } from "@/lib/pricing-data";

export default function PricingCard({ plan, billing }: { plan: Plan; billing: BillingPeriod }) {
  const isPopular = plan.badge === "popular";
  const isAgency = plan.badge === "agency";
  const isFree = plan.monthlyPrice === 0;
  const annual = plan.monthlyPrice > 0 ? getAnnualPricing(plan.monthlyPrice) : null;

  return (
    <div
      // The pricing hero's outer <Section> is `text-center` (it centres the
      // headline/copy above these cards), and text-align inherits — without
      // an explicit override here every piece of card text, including
      // wrapped feature lines, would centre inside its own shrunk flex box
      // instead of staying left-aligned. Setting it once at the card root
      // fixes it for every descendant rather than patching each element.
      className={`relative flex h-full flex-col rounded-[12px] border p-7 text-left transition-all duration-300 ${
        isPopular
          ? "border-primary bg-primary-soft/40 shadow-[0_25px_60px_-25px_rgba(61,90,254,0.35)] hover:-translate-y-1 md:-translate-y-3 md:hover:-translate-y-4"
          : "border-border shadow-[0_1px_2px_rgba(16,24,40,0.03)] hover:-translate-y-0.5 hover:border-[rgba(61,90,254,0.18)] hover:shadow-[0_16px_36px_-20px_rgba(16,24,40,0.18)]"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-white shadow-[0_8px_16px_-6px_rgba(61,90,254,0.5)]">
          Most Popular
        </div>
      )}

      {isAgency && (
        <div className="mb-3 inline-flex w-fit rounded-full bg-surface-2 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wide text-muted">
          Best for Agencies
        </div>
      )}

      <div className="text-[23px] font-semibold text-foreground">{plan.name}</div>
      <p className="mt-1.5 min-h-[36px] text-[13.5px] leading-snug text-muted">{plan.description}</p>

      <div className="mt-5 min-h-[64px]" aria-live="polite">
        {isFree ? (
          <div className="flex items-baseline gap-1">
            <span className="text-[34px] font-semibold tracking-tight text-foreground">$0</span>
            <span className="text-[13px] text-muted">/month</span>
          </div>
        ) : billing === "monthly" ? (
          <div className="transition-opacity duration-200">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[34px] font-semibold tracking-tight text-foreground">{formatPrice(plan.monthlyPrice)}</span>
              <span className="text-[13px] text-muted">{CURRENCY_LABEL}/month</span>
            </div>
          </div>
        ) : (
          <div className="transition-opacity duration-200">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[34px] font-semibold tracking-tight text-foreground">
                {formatPrice(annual ? annual.perMonth : 0)}
              </span>
              <span className="text-[13px] text-muted">{CURRENCY_LABEL}/month</span>
            </div>
            {annual && (
              <div className="mt-1 text-[12.5px] text-muted">
                Billed {formatPrice(annual.billedTotal)} {CURRENCY_LABEL} per year
              </div>
            )}
          </div>
        )}
      </div>

      <div className="my-6 h-px bg-border" />

      {plan.includesLabel && <div className="mb-3 text-[12.5px] font-semibold text-foreground">{plan.includesLabel}</div>}
      <ul className="flex-1 space-y-2.5">
        {plan.includes.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-foreground">
            {/* Fixed-width icon column, kept out of the flex-shrink
                calculation so it never moves as the text column wraps. */}
            <span className="mt-0.5 flex w-[19px] shrink-0 justify-start">
              <FeatureCheck />
            </span>
            {/* The text column is its own flex item with flex-1, so it owns
                a stable, predictable width to wrap within — wrapped lines
                align to this box's left edge, never centred. */}
            <span className="flex-1 text-left leading-snug">{f}</span>
          </li>
        ))}
      </ul>

      {plan.footnote && <p className="mt-5 text-[12px] leading-relaxed text-muted">{plan.footnote}</p>}

      <Button href={plan.ctaHref} variant={isPopular ? "primary" : "secondary"} className="mt-7 w-full" trackEvent="plan_selected">
        {plan.cta}
      </Button>
    </div>
  );
}
