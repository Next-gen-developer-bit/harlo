import type { Metadata } from "next";
import FeaturePageTemplate from "@/components/marketing/FeaturePageTemplate";
import QueueView from "@/components/mockups/QueueView";
import { CalendarDateIcon, ChecklistIcon, EditIcon } from "@/components/icons/NavIcons";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Queue Scheduling | Harlo Social",
  description: "Set your posting times once and let Harlo automatically fill the next available slot.",
  path: "/features/queue-scheduling",
});

export default function QueueSchedulingPage() {
  return (
    <FeaturePageTemplate
      eyebrow="Queue Scheduling"
      h1="Set your posting times once."
      subcopy="Create recurring publishing slots and add new content to the next available time without manually choosing a date for every post."
      appShellTitle="Queue"
      mockup={<div className="mx-auto max-w-sm"><QueueView /></div>}
      intro={{
        title: "Stop picking a time for every single post.",
        copy: "Set your regular posting schedule once (Monday at 9:00 AM, Wednesday at 1:00 PM, Friday at 6:00 PM) and every new piece of content drops into the next open slot automatically.",
      }}
      benefits={[
        { title: "Set it once", copy: "Define your regular posting times per platform or workspace and reuse them every week.", icon: CalendarDateIcon },
        { title: "Never miss a slot", copy: "New content automatically fills the next available time, with no manual scheduling required.", icon: ChecklistIcon },
        { title: "Stay consistent", copy: "Keep a steady publishing rhythm without deciding a new time for every post." },
        { title: "Adjust anytime", copy: "Add, remove or reorder queue times whenever your schedule changes.", icon: EditIcon },
      ]}
      related={[
        { name: "Social Media Calendar", href: "/social-media-calendar", description: "See queued and scheduled posts in one view." },
        { name: "Social Media Scheduler", href: "/social-media-scheduler", description: "Plan and schedule posts across multiple platforms." },
        { name: "Analytics", href: "/features/analytics", description: "See what performs best." },
      ]}
      faqs={[
        { q: "What is queue scheduling?", a: "Queue scheduling lets you set fixed posting times in advance, then add content that automatically fills the next open slot instead of picking a time for every post." },
        { q: "Can I have different queues for different accounts?", a: "Yes. Each workspace and connected account can have its own queue times." },
        { q: "Can I still schedule a post for a specific time?", a: "Yes. You can either add a post to your queue or choose an exact date and time." },
      ]}
      ctaTitle="Start scheduling your queue."
      ctaCopy="Set your posting times once and keep every account moving."
    />
  );
}
