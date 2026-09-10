import type { Metadata } from "next";
import PlatformPageTemplate from "@/components/marketing/PlatformPageTemplate";
import { platformContent } from "@/lib/platform-content";
import { buildMetadata } from "@/lib/seo";

const data = platformContent["linkedin"];

export const metadata: Metadata = buildMetadata({
  title: data.metaTitle,
  description: data.metaDescription,
  path: data.path,
});

export default function LinkedinSchedulerPage() {
  return <PlatformPageTemplate data={data} />;
}
