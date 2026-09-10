import type { ReactNode } from "react";
import Link from "next/link";
import Eyebrow from "@/components/ui/Eyebrow";

export default function FeatureRow({
  eyebrow,
  title,
  description,
  bullets,
  ctaLabel,
  ctaHref,
  visual,
  reverse = false,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  bullets?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  visual: ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-16 ${reverse ? "" : ""}`}>
      <div className={reverse ? "lg:order-2" : ""}>
        {eyebrow && <div className="mb-4"><Eyebrow>{eyebrow}</Eyebrow></div>}
        <h3 className="balance text-h3 font-semibold text-foreground">
          {title}
        </h3>
        <p className="mt-4 max-w-md text-[16px] leading-relaxed text-muted">{description}</p>
        {bullets && (
          <ul className="mt-6 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-[14.5px] text-foreground">
                <CheckIcon />
                {b}
              </li>
            ))}
          </ul>
        )}
        {ctaLabel && ctaHref && (
          <Link
            href={ctaHref}
            className="mt-7 inline-flex items-center gap-1.5 text-[15px] font-medium text-primary hover:gap-2.5 transition-all"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
      <div className={reverse ? "lg:order-1" : ""}>{visual}</div>
    </div>
  );
}

function CheckIcon() {
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] leading-none text-primary"
    >
      ✓
    </span>
  );
}
