import type { Metadata } from "next";
import FeaturePageTemplate from "@/components/marketing/FeaturePageTemplate";
import DraftsView from "@/components/mockups/DraftsView";
import { FeaturedCard, StandardCard } from "@/components/marketing/ShowcaseCard";
import StatusPill from "@/components/marketing/StatusPill";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Social Media Drafts | Save Posts Before You Schedule | Harlo Social",
  description:
    "Save social media drafts as ideas come to you, then finish and schedule them whenever they're ready with Harlo's social media content planning workspace.",
  path: "/features/drafts",
});

const calendarStrip: { day: string; label: string; status: string }[] = [
  { day: "Mon", label: "Product teaser", status: "Draft" },
  { day: "Tue", label: "Case study", status: "Scheduled" },
  { day: "Wed", label: "Weekly roundup", status: "Draft" },
];

function DraftsBenefits() {
  return (
    <div className="grid gap-5 lg:grid-cols-5">
      <FeaturedCard
        className="lg:col-span-3"
        title="Save ideas without committing to a date"
        description="Start creating content when the idea is fresh, save it as a draft and decide when to publish later."
        visual={<DraftsView />}
      />
      <div className="flex flex-col gap-5 lg:col-span-2">
        <StandardCard
          title="Pick up where you left off"
          description="Return to unfinished content without rebuilding the post from scratch."
          visual={
            <div className="rounded-xl border border-border bg-white p-3">
              <div className="h-10 rounded-lg bg-surface-2" />
              <div className="mt-2 text-[10.5px] text-muted">142 / 2,200 characters</div>
            </div>
          }
        />
        <StandardCard
          className="flex-1"
          title="See drafts in your calendar"
          description="Keep unfinished content visible alongside your upcoming schedule so good ideas don't disappear into another notes app."
          visual={
            <div className="grid grid-cols-3 gap-1.5">
              {calendarStrip.map((d) => (
                <div key={d.day} className="rounded-lg bg-white p-1.5 text-center">
                  <div className="text-[9.5px] text-muted">{d.day}</div>
                  <div className="mt-1 truncate text-[9.5px] font-medium text-foreground">{d.label}</div>
                  <StatusPill status={d.status} className="mt-1 px-1.5 py-0.5 text-[8.5px]" />
                </div>
              ))}
            </div>
          }
        />
      </div>

      <StandardCard
        className="lg:col-span-2"
        title="Move from draft to scheduled"
        description="Finish your post, choose where it should publish and move it directly into your schedule."
        visual={
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-dashed border-border bg-white p-2.5 text-center">
              <StatusPill status="Draft" />
            </div>
            <ArrowGlyph />
            <div className="flex-1 rounded-lg bg-primary-soft p-2.5 text-center">
              <StatusPill status="Scheduled" />
            </div>
          </div>
        }
      />
      <StandardCard
        className="lg:col-span-3"
        title="Add media when you're ready"
        description="Pull images and video straight from your content library instead of searching for files while you write."
        visual={
          <div className="flex items-center gap-3">
            <div className="grid grid-cols-3 gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-10 w-10 rounded-lg bg-surface-2" />
              ))}
            </div>
            <ArrowGlyph />
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-dashed border-border bg-white p-2.5">
              <span className="h-2 w-2 shrink-0 rounded-full bg-muted/50" />
              <span className="text-[11px] text-muted">Draft in progress</span>
            </div>
          </div>
        }
      />
    </div>
  );
}

export default function DraftsPage() {
  return (
    <FeaturePageTemplate
      eyebrow="Drafts"
      h1="Save it now. Schedule it later."
      subcopy="Not every post is ready to go out straight away. Save it as a draft and come back to it whenever it's ready."
      appShellTitle="Drafts"
      mockup={<DraftsView />}
      benefitsSlot={<DraftsBenefits />}
      related={[
        { name: "Social Media Calendar", href: "/social-media-calendar", description: "See drafts alongside scheduled and published posts." },
        { name: "Content Library", href: "/features/content-library", description: "Store, organise and reuse images, videos and content." },
        { name: "Queue Scheduling", href: "/features/queue-scheduling", description: "Add a finished draft straight into your posting queue." },
      ]}
      faqs={[
        { q: "Where do my drafts go when I save them?", a: "Every draft appears on your content calendar alongside scheduled and published posts, so it stays visible instead of getting lost." },
        { q: "Can I add media to a draft later?", a: "Yes. You can pull images and video from your content library into a draft whenever it's ready." },
        { q: "How do I schedule a draft once it's finished?", a: "Open the draft, choose where and when it should publish, and it moves directly into your schedule." },
      ]}
      ctaTitle="Never lose an idea."
      ctaCopy="Save drafts and schedule them whenever you're ready."
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
