"use client";

import { useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import EyebrowLabel from "@/components/ui/Eyebrow";
import Chevron from "@/components/ui/Chevron";

export type FaqItem = { q: string; a: string };

/**
 * The one shared FAQ component sitewide — thin-line accordion rows, same
 * chevron, same typography and animation everywhere a FAQ appears.
 * `layout="split"` (used on the homepage) puts the eyebrow/heading/
 * subtitle beside the accordion in two columns instead of centred above
 * it; the accordion rows themselves are identical either way.
 */
export default function Faq({
  items,
  title = "Frequently asked questions",
  eyebrow,
  subtitle,
  layout = "centered",
}: {
  items: FaqItem[];
  title?: string;
  /** Optional small label above the title — additive, existing call sites are unaffected. */
  eyebrow?: string;
  /** Optional one-line description below the title — additive, existing call sites are unaffected. */
  subtitle?: string;
  /** "split" = homepage two-column editorial treatment. Default "centered" renders exactly as before. */
  layout?: "centered" | "split";
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const rows = (
    <div className={layout === "split" ? "min-w-0 divide-y divide-border" : "mx-auto max-w-3xl divide-y divide-border"}>
      {items.map((f, i) => {
        const open = openIndex === i;
        return (
          <div key={f.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 py-5 text-left md:py-6"
            >
              <span className="text-[15px] font-medium text-foreground">{f.q}</span>
              <Chevron open={open} className={open ? "text-foreground" : "text-foreground/55"} />
            </button>
            <div className={`faq-panel ${open ? "is-open" : ""}`}>
              <div>
                <p className="pb-6 pr-8 text-[14px] leading-relaxed text-muted">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (layout === "split") {
    return (
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[0.4fr_0.6fr] md:gap-16 lg:gap-24">
        <div className="min-w-0">
          {eyebrow && <EyebrowLabel>{eyebrow}</EyebrowLabel>}
          <h2 className="balance mt-4 text-h2 font-semibold text-foreground">{title}</h2>
          {subtitle && <p className="mt-4 max-w-sm text-[15.5px] leading-relaxed text-muted">{subtitle}</p>}
        </div>
        {rows}
        <JsonLd data={schema} />
      </div>
    );
  }

  return (
    <>
      {eyebrow && (
        <div className="mb-3 flex justify-center">
          <EyebrowLabel>{eyebrow}</EyebrowLabel>
        </div>
      )}
      <h2 className="text-center text-[22px] font-semibold tracking-tight text-foreground">{title}</h2>
      {subtitle && <p className="mx-auto mb-8 mt-3 max-w-md text-center text-[15px] leading-relaxed text-muted">{subtitle}</p>}
      {!subtitle && <div className="mb-8" />}
      {rows}
      <JsonLd data={schema} />
    </>
  );
}
