import type { Metadata } from "next";
import PlatformPageTemplate from "@/components/marketing/PlatformPageTemplate";
import { platformContent } from "@/lib/platform-content";
import { buildMetadata } from "@/lib/seo";

const data = platformContent["x"];

export const metadata: Metadata = buildMetadata({
  title: data.metaTitle,
  description: data.metaDescription,
  path: data.path,
});

export default function XSchedulerPage() {
  return <PlatformPageTemplate data={data} />;
}
