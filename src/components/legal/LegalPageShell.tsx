import type { ReactNode } from "react";
import Section from "@/components/marketing/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import LegalToc, { type LegalSectionRef } from "./LegalToc";
import { legalInfo } from "@/lib/legal-info";

export default function LegalPageShell({
  eyebrow,
  title,
  lastUpdated,
  intro,
  sections,
  contactEmail = legalInfo.privacyEmail,
  contactLabel = "Contact us about this policy",
  children,
}: {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSectionRef[];
  contactEmail?: string;
  contactLabel?: string;
  children: ReactNode;
}) {
  return (
    <>
      <Section className="pb-4 pt-12 md:pt-16">
        <div className="mx-auto max-w-[720px]">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="balance mt-5 text-h1-legal font-semibold text-foreground">
            {title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-surface px-3 py-1 text-[12.5px] font-medium text-muted">
              Last updated: {lastUpdated}
            </span>
            <a href={`mailto:${contactEmail}`} className="text-[12.5px] font-medium text-primary">
              {contactLabel}
            </a>
          </div>
          <p className="legal-ink mt-5 text-[15.5px] leading-relaxed">{intro}</p>
        </div>
      </Section>

      <Section className="pb-24 pt-4">
        <div className="mx-auto max-w-[1040px] lg:grid lg:grid-cols-[220px_1fr] lg:gap-16">
          <LegalToc sections={sections} />
          <div className="max-w-[720px]">{children}</div>
        </div>
      </Section>
    </>
  );
}
