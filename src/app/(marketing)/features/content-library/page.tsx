import type { Metadata } from "next";
import FeaturePageTemplate from "@/components/marketing/FeaturePageTemplate";
import ContentLibraryView from "@/components/mockups/ContentLibraryView";
import { FeaturedCard, StandardCard } from "@/components/marketing/ShowcaseCard";
import StatusPill from "@/components/marketing/StatusPill";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Social Media Content Library | Organise Your Media | Harlo Social",
  description:
    "Keep the images, videos and reusable media you use for social publishing organised in one content library, ready to pull straight into your next post with Harlo.",
  path: "/features/content-library",
});

function ContentLibraryBenefits() {
  return (
    <div className="grid gap-5 lg:grid-cols-5">
      <FeaturedCard
        className="lg:col-span-3"
        title="One place for your social assets"
        description="Keep the images, videos and reusable media you use for social publishing inside Harlo instead of searching through folders every time you create a post."
        visual={<ContentLibraryView />}
      />
      <div className="flex flex-col gap-5 lg:col-span-2">
        <StandardCard
          title="Reuse media across posts"
          description="Upload an asset once and pull it into as many posts as you need, instead of re-uploading the same file."
          visual={
            <div className="flex items-center gap-2.5">
              <div className="h-11 w-11 shrink-0 rounded-lg bg-surface-2" />
              <ArrowGlyph />
              <div className="flex flex-1 gap-1.5">
                {[0, 1].map((i) => (
                  <div key={i} className="h-11 flex-1 rounded-lg border border-dashed border-border" />
                ))}
              </div>
            </div>
          }
        />
        <StandardCard
          className="flex-1"
          title="Bring media into the composer"
          description="Select an asset from your library directly inside the post composer, without leaving Harlo to find it."
          visual={
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-surface-2" />
              <ArrowGlyph />
              <div className="flex-1 rounded-lg border border-border bg-white p-2">
                <div className="h-6 rounded bg-surface-2" />
              </div>
            </div>
          }
        />
      </div>

      <StandardCard
        className="lg:col-span-2"
        title="Keep content organised"
        description="Every asset carries a short label, so you can find the right image or video without scrolling through everything you've ever uploaded."
        visual={
          <div className="grid grid-cols-3 gap-1.5">
            {["Product", "Launch", "UGC"].map((tag) => (
              <div key={tag} className="rounded-lg bg-white p-1.5">
                <div className="h-8 rounded bg-surface-2" />
                <div className="mt-1 truncate text-[9px] text-muted">{tag}</div>
              </div>
            ))}
          </div>
        }
      />
      <StandardCard
        className="lg:col-span-3"
        title="Keep content connected to your workflow"
        description="Media stays part of the same workflow as your drafts, calendar and campaigns, so it's easier to plan, reuse and understand what performs, rather than living in a separate file-storage tool."
        visual={
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-surface-2" />
            <ArrowGlyph />
            <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-2.5 py-2">
              <span className="text-[11.5px] font-medium text-foreground">Product launch teaser</span>
              <StatusPill status="Draft" />
            </div>
          </div>
        }
      />
    </div>
  );
}

export default function ContentLibraryPage() {
  return (
    <FeaturePageTemplate
      eyebrow="Content Library"
      h1="Your content, organised and ready."
      subcopy="Keep reusable media, drafts and social content in one place so your next post does not begin with searching through folders."
      appShellTitle="Content Library"
      mockup={<ContentLibraryView />}
      benefitsSlot={<ContentLibraryBenefits />}
      related={[
        { name: "Social Media Scheduler", href: "/social-media-scheduler", description: "Plan and schedule posts across multiple platforms." },
        { name: "Drafts", href: "/features/drafts", description: "Save posts as drafts before they're ready to schedule." },
        { name: "Social Media Calendar", href: "/social-media-calendar", description: "See your entire content schedule in one place." },
      ]}
      faqs={[
        { q: "Can I reuse the same image or video in multiple posts?", a: "Yes. Upload an asset once and pull it into as many posts as you need." },
        { q: "Can I add media from the library while writing a post?", a: "Yes. You can select assets from your content library directly inside the post composer." },
        { q: "How is content in the library organised?", a: "Each asset carries a short label so you can find the right image or video without searching through everything you've uploaded." },
      ]}
      ctaTitle="Keep your content organised."
      ctaCopy="Store your media once and reuse it across every post."
    />
  );
}

function ArrowGlyph() {
  return (
    <span aria-hidden="true" className="shrink-0 text-[15px] leading-none text-muted">
      →
    </span>
  );
}
