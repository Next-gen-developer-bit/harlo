import type { Metadata } from "next";
import { Suspense } from "react";
import Section from "@/components/marketing/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import FeedbackForm from "@/components/marketing/FeedbackForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Feedback | Harlo Social",
  description: "Share a feature suggestion or let us know what's confusing. Your feedback helps shape what we build next in Harlo.",
  path: "/feedback",
});

export default function FeedbackPage() {
  return (
    <Section className="pb-24 pt-12 md:pt-16">
      <div className="mx-auto max-w-md text-center">
        <div className="flex justify-center">
          <Eyebrow>Feedback</Eyebrow>
        </div>
        <h1 className="balance mx-auto mt-6 text-h1-page font-semibold text-foreground">
          Help us make Harlo better.
        </h1>
        <p className="mt-5 text-[15.5px] leading-relaxed text-muted">
          Found something we could improve or have an idea for the next update? We&apos;d love to hear it.
        </p>
      </div>

      <div className="mt-10">
        <Suspense fallback={null}>
          <FeedbackForm />
        </Suspense>
      </div>
    </Section>
  );
}
