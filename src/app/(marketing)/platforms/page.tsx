import type { Metadata } from "next";
import Section from "@/components/marketing/Section";
import FinalCta from "@/components/marketing/FinalCta";
import SupportedNetworksGrid from "@/components/marketing/SupportedNetworksGrid";
import Eyebrow from "@/components/ui/Eyebrow";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Integrations | Harlo Social",
  description: "Connect Instagram, Facebook, LinkedIn, TikTok, YouTube, Threads, Pinterest and X to Harlo and manage them from one workspace.",
  path: "/platforms",
});

export default function PlatformsPage() {
  return (
    <>
      <Section className="pb-12 pt-12 text-center md:pt-16">
        <div className="flex justify-center">
          <Eyebrow>Integrations</Eyebrow>
        </div>
        <h1 className="balance mx-auto mt-6 max-w-2xl text-h1-page font-semibold text-foreground">
          Connect the channels you already use.
        </h1>
        <p className="balance mx-auto mt-5 max-w-md text-[16px] leading-relaxed text-muted md:text-[18px]">
          Bring your social accounts into Harlo and manage them from one workspace.
        </p>
      </Section>

      <Section className="pt-4">
        <SupportedNetworksGrid />
      </Section>

      <FinalCta
        title="Connect your accounts and start planning."
        description="Start free and bring the platforms you already use into one workspace."
      />
    </>
  );
}
