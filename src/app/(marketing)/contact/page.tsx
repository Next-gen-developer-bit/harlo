import type { Metadata } from "next";
import Section from "@/components/marketing/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import { legalInfo } from "@/lib/legal-info";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact | Harlo Social",
  description: "Get in touch with the Harlo team for support, sales or general questions.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <Section className="pb-24 pt-16 md:pt-20">
        <div className="mx-auto max-w-md text-center">
          <div className="flex justify-center">
            <Eyebrow>Contact</Eyebrow>
          </div>
          <h1 className="balance mx-auto mt-6 text-h1-page font-semibold text-foreground">
            Get in touch.
          </h1>
          <p className="mt-5 text-[15.5px] leading-relaxed text-muted">
            For support, product questions or anything else, email us and we&apos;ll get back to you.
          </p>
          <a
            href={`mailto:${legalInfo.privacyEmail}`}
            className="mt-7 inline-flex h-12 items-center rounded-[9px] bg-primary px-6 text-[14.5px] font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
          >
            {legalInfo.privacyEmail}
          </a>
        </div>
      </Section>
    </>
  );
}
