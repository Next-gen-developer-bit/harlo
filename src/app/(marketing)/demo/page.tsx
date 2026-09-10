import type { Metadata } from "next";
import DemoContent from "@/components/marketing/DemoContent";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Product Preview | Harlo Social",
  description: "Take a look around Harlo's calendar, composer, analytics and queue. No sign-up required.",
  path: "/demo",
});

export default function DemoPage() {
  return <DemoContent />;
}
