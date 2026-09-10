import type { ComponentType, SVGProps } from "react";
import { CalendarIcon, PlayIcon, FolderIcon, ChartIcon, ClipboardListIcon, AlbumIcon, ChecklistIcon, ShopIcon, MonitorSmartphoneIcon, TeamIcon } from "@/components/icons/NavIcons";

export type NavProductLink = { name: string; href: string; blurb?: string; icon?: ComponentType<SVGProps<SVGSVGElement>> };

export type NavProductItem = {
  key: string;
  name: string;
  href: string;
  /** Short 3-6 word descriptor shown under the item name in the nav dropdown. */
  blurb: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

// Functional pastel-accent system — each concept keeps ONE colour
// consistently sitewide (nav dropdown, icon badges, section tints) rather
// than colour being decorative or random:
//   Planning / Calendar        -> soft blue
//   Publishing / Creation      -> soft peach
//   Analytics / Growth         -> soft green
//   Content / Campaigns        -> soft yellow
//   Teams / Workspaces / Agencies -> soft purple
export const categoryTint: Record<string, { bg: string; fg: string }> = {
  calendar: { bg: "var(--pastel-blue)", fg: "#3D5AFE" },
  publishing: { bg: "var(--pastel-peach)", fg: "#C2670A" },
  analytics: { bg: "var(--pastel-green)", fg: "#0F9D58" },
  campaigns: { bg: "var(--pastel-yellow)", fg: "#9A7B0A" },
  workspaces: { bg: "var(--pastel-purple)", fg: "#7C4DFF" },
  "content-library": { bg: "var(--pastel-pink)", fg: "#C2296B" },
  "queue-scheduling": { bg: "var(--pastel-peach)", fg: "#C2670A" },
};

// Seven flat product pillars — deliberately not nested (Calendar / Drafts /
// Campaigns, Composer / Editing / Library, etc. used to each get their own
// row). Every underlying page still exists; the dropdown just stops acting
// like a sitemap. "View all features" is the escape hatch to the fuller,
// grouped list on /features for anyone who wants the detail.
export const productItems: NavProductItem[] = [
  { key: "publishing", name: "Social Media Scheduler", href: "/social-media-scheduler", blurb: "Publish everywhere, on time", icon: PlayIcon },
  { key: "calendar", name: "Social Media Calendar", href: "/social-media-calendar", blurb: "Plan content visually", icon: CalendarIcon },
  { key: "analytics", name: "Analytics", href: "/features/analytics", blurb: "See what performs", icon: ChartIcon },
  { key: "campaigns", name: "Campaigns", href: "/campaigns", blurb: "Group content by initiative", icon: ClipboardListIcon },
  { key: "workspaces", name: "Workspaces", href: "/features/workspaces", blurb: "Keep brands organised", icon: FolderIcon },
  { key: "content-library", name: "Content Library", href: "/features/content-library", blurb: "Reusable media, ready to go", icon: AlbumIcon },
  { key: "queue-scheduling", name: "Queue Scheduling", href: "/features/queue-scheduling", blurb: "Set your posting times once", icon: ChecklistIcon },
];

export type FeatureItem = {
  name: string;
  slug: string;
  href: string;
  description: string;
  group: "Plan" | "Create" | "Publish" | "Organise" | "Analytics";
};

// Fuller list used on the /features overview page — kept to the same
// Phase 1 whitelist as the Product dropdown above.
export const featureItems: FeatureItem[] = [
  { name: "Content Calendar", slug: "social-media-calendar", href: "/social-media-calendar", description: "Plan upcoming content and see what is scheduled across your social accounts.", group: "Plan" },
  { name: "Drafts", slug: "drafts", href: "/features/drafts", description: "Save unfinished posts and come back to them when they are ready.", group: "Plan" },
  { name: "Campaigns", slug: "campaigns", href: "/campaigns", description: "Group related content together and assign posts to campaigns.", group: "Plan" },

  { name: "Post Composer", slug: "post-composer", href: "/social-media-scheduler", description: "Create social media posts from one central workspace.", group: "Create" },
  { name: "Platform-Specific Editing", slug: "platform-specific-editing", href: "/social-media-scheduler", description: "Adjust your content for each social platform before it is published.", group: "Create" },
  { name: "Content Library", slug: "content-library", href: "/features/content-library", description: "Keep reusable images, videos and social content organised in one place.", group: "Create" },

  { name: "Social Account Connections", slug: "social-account-connections", href: "/social-media-scheduler", description: "Connect and manage the accounts you want to publish through Harlo.", group: "Publish" },
  { name: "Social Media Scheduling", slug: "social-media-scheduling", href: "/social-media-scheduler", description: "Choose exactly when your content should be published.", group: "Publish" },
  { name: "Queue Scheduling", slug: "queue-scheduling", href: "/features/queue-scheduling", description: "Build a consistent publishing schedule and add content to your queue.", group: "Publish" },
  { name: "Multi-Platform Publishing", slug: "multi-platform-publishing", href: "/social-media-scheduler", description: "Publish across multiple connected accounts without managing each platform separately.", group: "Publish" },
  { name: "Publishing Status & Reliability", slug: "publishing-status", href: "/social-media-scheduler#publishing-status", description: "See what's happening with scheduled content and what needs attention.", group: "Publish" },

  { name: "Workspaces", slug: "workspaces", href: "/features/workspaces", description: "Separate brands, businesses, clients or projects into organised workspaces.", group: "Organise" },

  { name: "Content Performance", slug: "analytics", href: "/features/analytics", description: "See the performance metrics for your published social content.", group: "Analytics" },
  { name: "Reporting", slug: "reporting", href: "/features/analytics", description: "Bring publishing activity and performance together in one view.", group: "Analytics" },
];

export type PlatformItem = {
  name: string;
  slug: string;
  href: string;
  status: "Supported" | "Coming Soon";
};

// The three approved Harlo audiences — same set used on the homepage
// AudienceSection, just with shorter blurbs sized for a nav dropdown.
export const solutionItems: NavProductLink[] = [
  { name: "Growing Businesses & Marketing Teams", href: "/for/growing-businesses", blurb: "One workspace as you grow", icon: ShopIcon },
  { name: "Freelancers & Consultants", href: "/for/freelance-marketers", blurb: "Manage every client in one place", icon: MonitorSmartphoneIcon },
  { name: "Agencies", href: "/for/agencies", blurb: "Client workspaces, kept separate", icon: TeamIcon },
];

export const platformItems: PlatformItem[] = [
  { name: "Instagram", slug: "instagram", href: "/instagram-scheduler", status: "Supported" },
  { name: "Facebook", slug: "facebook", href: "/facebook-scheduler", status: "Supported" },
  { name: "LinkedIn", slug: "linkedin", href: "/linkedin-scheduler", status: "Supported" },
  { name: "TikTok", slug: "tiktok", href: "/tiktok-scheduler", status: "Supported" },
  { name: "YouTube", slug: "youtube", href: "/youtube-scheduler", status: "Supported" },
  { name: "Threads", slug: "threads", href: "/threads-scheduler", status: "Supported" },
  { name: "Pinterest", slug: "pinterest", href: "/pinterest-scheduler", status: "Supported" },
  { name: "X", slug: "x", href: "/x-scheduler", status: "Supported" },
  { name: "Google Business Profile", slug: "google-business-profile", href: "/platforms", status: "Coming Soon" },
  { name: "Bluesky", slug: "bluesky", href: "/platforms", status: "Coming Soon" },
];
