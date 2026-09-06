import type { Metadata } from "next";
import Section from "@/components/marketing/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import { buildMetadata } from "@/lib/seo";
import {
  ResourceCategorySection,
  FeaturedResourceCard,
  type ResourceCategory,
  type ResourceItem,
} from "@/components/marketing/ResourceCard";

export const metadata: Metadata = buildMetadata({
  title: "Resources | Harlo Social",
  description: "Guides, product updates and useful answers for planning, publishing and understanding social content with Harlo.",
  path: "/resources",
});

// No real articles, guides or product updates exist yet — this stays
// empty rather than fabricated (see brief: do not fabricate articles to
// fill the design). ResourceCategorySection hides any category with no
// items, and the page falls back to a clean empty state below. The
// reusable card layouts (ResourceCard.tsx) are fully built and ready to
// receive real content the moment it exists, without another redesign.
const featured: ResourceItem | null = null;
const resourceItems: ResourceItem[] = [];

const categories: ResourceCategory[] = [
  "Social Media Strategy",
  "Scheduling",
  "Analytics",
  "Agency Growth",
  "Marketing Workflows",
  "Harlo Guides",
  "Product Updates",
];

export default function ResourcesPage() {
  const hasContent = resourceItems.length > 0;

  return (
    <Section className="pb-24 pt-16 md:pt-20">
      <div className="text-center">
        <div className="flex justify-center">
          <Eyebrow>Resources</Eyebrow>
        </div>
        <h1 className="balance mx-auto mt-6 max-w-2xl text-h1-page font-semibold text-foreground">
          Practical resources for people managing social.
        </h1>
        <p className="balance mx-auto mt-5 max-w-md text-[15.5px] leading-relaxed text-muted">
          Guides, product updates and useful answers for planning, publishing and understanding social content
          with Harlo.
        </p>
      </div>

      {featured && (
        <div className="mx-auto mt-14 max-w-4xl">
          <FeaturedResourceCard item={featured} />
        </div>
      )}

      {hasContent ? (
        <div className="mx-auto mt-14 max-w-5xl space-y-14">
          {categories.map((category) => (
            <ResourceCategorySection
              key={category}
              category={category}
              items={resourceItems.filter((r) => r.category === category)}
            />
          ))}
        </div>
      ) : (
        <div className="mx-auto mt-14 max-w-md rounded-[10px] border border-border p-8 text-center">
          <div className="text-[15px] font-semibold text-foreground">Guides and updates are on the way.</div>
          <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">
            We&apos;re building out practical guides on social media strategy, scheduling, analytics and agency
            growth, plus regular Harlo product updates. Check back soon.
          </p>
        </div>
      )}
    </Section>
  );
}
