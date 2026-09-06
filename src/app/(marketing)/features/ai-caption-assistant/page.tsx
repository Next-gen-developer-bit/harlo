import type { Metadata } from "next";
import FeaturePageTemplate from "@/components/marketing/FeaturePageTemplate";
import AiCaptionView from "@/components/mockups/AiCaptionView";
import { EditIcon, GlobeIcon, MentionCircleIcon } from "@/components/icons/NavIcons";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "AI Caption Assistant | Harlo Social",
  description: "Generate ideas, improve captions and adapt content for different social platforms while staying in control of what gets published.",
  path: "/features/ai-caption-assistant",
});

export default function AiCaptionAssistantPage() {
  return (
    <FeaturePageTemplate
      eyebrow="AI Caption Assistant"
      h1="Get help writing when you need it."
      subcopy="Use Harlo to generate ideas, improve captions and adapt content for different social platforms while staying in control of what gets published."
      appShellTitle="New Post"
      mockup={<div className="mx-auto max-w-md"><AiCaptionView /></div>}
      intro={{
        title: "AI helps you create faster. You decide what gets published.",
        copy: "The caption assistant is there for the moments you're stuck on wording. It's not a replacement for your voice, and nothing publishes without your review.",
      }}
      benefits={[
        { title: "Caption suggestions", copy: "Get a starting point when you're not sure how to open a post." },
        { title: "Rewrite captions", copy: "Improve tone, length or clarity with one click.", icon: EditIcon },
        { title: "Platform-specific variations", copy: "Adapt the same idea for Instagram, LinkedIn and every other platform you use.", icon: GlobeIcon },
        { title: "Hashtag suggestions", copy: "Get relevant hashtag ideas based on your caption.", icon: MentionCircleIcon },
      ]}
      related={[
        { name: "Social Media Scheduler", href: "/social-media-scheduler", description: "Plan and schedule posts across multiple platforms." },
        { name: "Analytics", href: "/features/analytics", description: "See what performs best." },
        { name: "Social Media Calendar", href: "/social-media-calendar", description: "See your entire content schedule in one place." },
      ]}
      faqs={[
        { q: "Does Harlo auto-publish AI-generated captions?", a: "No. AI suggestions are shown for you to review, edit or discard, and nothing publishes without your approval." },
        { q: "Can I turn off AI features?", a: "Yes. The caption assistant is optional and only appears when you choose to use it." },
      ]}
      ctaTitle="Write captions faster."
      ctaCopy="Get a hand with wording, without losing control of your voice."
    />
  );
}
