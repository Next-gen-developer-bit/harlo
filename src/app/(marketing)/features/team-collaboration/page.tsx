import type { Metadata } from "next";
import FeaturePageTemplate from "@/components/marketing/FeaturePageTemplate";
import TeamView from "@/components/mockups/TeamView";
import { TeamIcon, KeyIcon, ChecklistIcon, CalendarIcon, MentionCircleIcon } from "@/components/icons/NavIcons";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Team Collaboration | Harlo Social",
  description: "Invite team members, assign permissions and plan content together in one shared workspace.",
  path: "/features/team-collaboration",
});

export default function TeamCollaborationPage() {
  return (
    <FeaturePageTemplate
      eyebrow="Team Collaboration"
      h1="Plan content together, in one shared workspace."
      subcopy="Invite team members, assign permissions and keep everyone working from the same calendar, without passing screenshots back and forth."
      appShellTitle="Team"
      mockup={<div className="mx-auto max-w-md"><TeamView /></div>}
      benefits={[
        { title: "Invite team members", copy: "Bring collaborators into a workspace with a role that fits how they work.", icon: TeamIcon },
        { title: "Set permissions", copy: "Control who can create, edit or publish content.", icon: KeyIcon },
        { title: "Approval workflows", copy: "Review upcoming content and approve posts before they go live.", icon: ChecklistIcon },
        { title: "Shared calendar", copy: "Everyone works from the same content calendar, so nothing gets missed.", icon: CalendarIcon },
        { title: "Comment on posts", copy: "Leave feedback directly on a post instead of a separate thread.", icon: MentionCircleIcon },
      ]}
      related={[
        { name: "Workspaces", href: "/features/workspaces", description: "Keep brands and clients separate." },
        { name: "Drafts", href: "/features/drafts", description: "Save posts as drafts before they're ready to schedule." },
        { name: "Social Media Calendar", href: "/social-media-calendar", description: "See your entire content schedule in one place." },
      ]}
      faqs={[
        { q: "Can I control what each team member can do?", a: "Yes. Permissions can be set per team member, from viewing content to publishing it." },
        { q: "Can posts require approval before publishing?", a: "Yes. Approval workflows are available on Pro and Agency plans, so content can be reviewed before it goes live." },
      ]}
      ctaTitle="Bring your team in."
      ctaCopy="Plan and publish content together."
    />
  );
}
