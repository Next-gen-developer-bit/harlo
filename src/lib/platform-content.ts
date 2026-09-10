import {
  InstagramIcon,
  FacebookIcon,
  LinkedInIcon,
  TikTokIcon,
  YouTubeIcon,
  ThreadsIcon,
  PinterestIcon,
  XIcon,
} from "@/components/icons/PlatformIcons";
import type { SVGProps } from "react";

export type PlatformFaq = { q: string; a: string };
export type PlatformDetail = { title: string; copy: string };
export type PlatformMetric = { label: string; value: string };

export type PlatformContent = {
  slug: string;
  name: string;
  path: string;
  Icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subcopy: string;

  /** Row 1 — primary capability (largest visual weight on the page). */
  capabilityHeading: string;
  capabilityCopy: string;

  /** Supported content formats — shown as compact chips alongside the primary capability. */
  formats: PlatformDetail[];

  /** Account requirements — shown as a compact supported/not-supported/connection panel. */
  accountSupported: string[];
  accountNotSupported?: string;
  connectionMethod: string;
  accountNote?: string;

  /** Row 2 — platform-specific editing. */
  customisationHeading: string;
  customisationCopy: string;
  customisationFields: string[];

  /** Row 3 — analytics. */
  analyticsHeading: string;
  analyticsCopy: string;
  analyticsMetrics: PlatformMetric[];

  /** Row 4 — multi-account / workspaces. */
  multiAccountHeading: string;
  multiAccountCopy: string;
  exampleAccounts: [string, string];

  /** Row 5 — platform/API note, shown alongside the shared API-transparency copy. */
  apiNote?: string;

  relatedSlugs: string[];
  faqs: PlatformFaq[];
  ctaTitle: string;
  ctaCopy: string;
};

export const platformContent: Record<string, PlatformContent> = {
  instagram: {
    slug: "instagram",
    name: "Instagram",
    path: "/instagram-scheduler",
    Icon: InstagramIcon,
    metaTitle: "Instagram Scheduler | Harlo Social",
    metaDescription: "Schedule Instagram posts, carousels and Reels ahead of time. Plan your Instagram calendar and see analytics with Harlo.",
    h1: "Schedule Instagram without leaving your content calendar.",
    subcopy: "Plan and schedule supported Instagram content alongside every other channel, then tailor the post before it goes live.",
    capabilityHeading: "Schedule Instagram content without manual reminders",
    capabilityCopy: "Harlo publishes feed posts, carousels and Reels directly to Instagram at the time you schedule, with no push notification reminders to tap.",
    formats: [
      { title: "Feed posts", copy: "Single-image and video posts, scheduled directly to your grid." },
      { title: "Carousels", copy: "Upload multiple images or videos and set the order before it goes live." },
      { title: "Reels", copy: "Schedule Reels alongside the rest of your content, with no separate app required." },
    ],
    accountSupported: ["Business accounts", "Creator accounts"],
    accountNotSupported: "Personal accounts aren't supported by Instagram's API for direct publishing.",
    connectionMethod: "Connected securely through Meta's supported account connection flow.",
    accountNote: "Instagram determines which account types third-party platforms can publish to through its API.",
    customisationHeading: "Tailor your post for Instagram",
    customisationCopy: "Start with one piece of content, then adjust the Instagram version without changing what will publish to your other connected platforms.",
    customisationFields: ["Caption", "Hashtags", "First comment"],
    analyticsHeading: "Understand how your Instagram content performs",
    analyticsCopy: "Review the available reach, impressions and engagement for your published Instagram content without opening Instagram Insights every time.",
    analyticsMetrics: [
      { label: "Reach", value: "24.8K" },
      { label: "Impressions", value: "38.2K" },
      { label: "Engagement", value: "1.9K" },
      { label: "Followers", value: "+214" },
    ],
    multiAccountHeading: "Keep multiple Instagram accounts organised",
    multiAccountCopy: "Connect more than one Instagram account and keep them separated through Harlo Workspaces, so content for different brands or clients never gets mixed together.",
    exampleAccounts: ["Brand Instagram", "Client Instagram"],
    relatedSlugs: ["threads", "tiktok", "facebook"],
    faqs: [
      { q: "Do I need a Business or Creator account?", a: "Yes. Instagram requires a Business or Creator account connected to a Facebook Page for third-party scheduling tools like Harlo to publish on your behalf." },
      { q: "Can I schedule Instagram Reels?", a: "Yes. Reels can be scheduled alongside feed posts and carousels from the same composer." },
      { q: "Can I schedule carousel posts?", a: "Yes. Upload multiple images or videos and set the order before it goes live." },
      { q: "Can I schedule content to multiple Instagram accounts?", a: "Yes. Connect more than one Instagram account and organise them across separate workspaces." },
      { q: "Can Harlo schedule Instagram Stories?", a: "Not yet. Story scheduling is on our roadmap. Feed posts, carousels and Reels are fully supported today." },
      { q: "Can I schedule hashtags in a first comment?", a: "Yes. You can add hashtags to your caption or schedule them to post automatically as a first comment." },
    ],
    ctaTitle: "Plan your next Instagram post with Harlo.",
    ctaCopy: "Plan your feed, carousels and Reels from one calendar.",
  },

  facebook: {
    slug: "facebook",
    name: "Facebook",
    path: "/facebook-scheduler",
    Icon: FacebookIcon,
    metaTitle: "Facebook Scheduler | Harlo Social",
    metaDescription: "Schedule Facebook Page posts ahead of time. Plan, customise and publish content to your Facebook Pages from one simple calendar with Harlo.",
    h1: "Plan and schedule Facebook content with Harlo.",
    subcopy: "Create Facebook content alongside the rest of your social plan and manage publishing from the same workspace.",
    capabilityHeading: "Schedule Facebook Page content from one place",
    capabilityCopy: "Harlo publishes directly to your Facebook Page at your scheduled time, with no manual publishing required.",
    formats: [
      { title: "Page posts", copy: "Text, image and video posts scheduled directly to your Facebook Page." },
      { title: "Link posts", copy: "Share links with an automatically generated preview card." },
      { title: "Video posts", copy: "Upload and schedule native video content to your Page." },
    ],
    accountSupported: ["Facebook Pages"],
    accountNotSupported: "Personal profiles aren't supported by Facebook's API for third-party scheduling.",
    connectionMethod: "Connected through Facebook's supported business integration.",
    customisationHeading: "Tailor your post for Facebook",
    customisationCopy: "Start with one piece of content, then adjust the Facebook version without changing what will publish to your other connected platforms.",
    customisationFields: ["Caption", "Link preview", "Media"],
    analyticsHeading: "See how your Facebook content is performing",
    analyticsCopy: "Review the available reach, engagement and Page likes for your published content without opening Meta Business Suite every time.",
    analyticsMetrics: [
      { label: "Reach", value: "18.6K" },
      { label: "Engagement", value: "1.2K" },
      { label: "Page likes", value: "+96" },
      { label: "Posts published", value: "16" },
    ],
    multiAccountHeading: "Keep multiple Facebook Pages organised",
    multiAccountCopy: "Connect more than one Facebook Page and keep them separated through Harlo Workspaces, so content for different brands or clients never gets mixed together.",
    exampleAccounts: ["Brand Page", "Client Page"],
    relatedSlugs: ["instagram", "linkedin", "x"],
    apiNote: "Facebook's API only allows scheduled publishing to Pages, not personal profiles.",
    faqs: [
      { q: "Can Harlo schedule posts to a Facebook Page I manage?", a: "Yes. Connect any Facebook Page you're an admin of and schedule posts directly to it." },
      { q: "Can Harlo publish to personal Facebook profiles?", a: "No. Facebook's API only allows scheduled publishing to Pages, not personal profiles." },
      { q: "Can I manage multiple Pages?", a: "Yes. Connect multiple Pages and organise them across different workspaces." },
      { q: "Will my post publish automatically?", a: "Yes. Harlo publishes directly to Facebook at your scheduled time." },
    ],
    ctaTitle: "Plan your next Facebook post with Harlo.",
    ctaCopy: "Plan your Page posts from one calendar.",
  },

  linkedin: {
    slug: "linkedin",
    name: "LinkedIn",
    path: "/linkedin-scheduler",
    Icon: LinkedInIcon,
    metaTitle: "LinkedIn Scheduler | Harlo Social",
    metaDescription: "Schedule LinkedIn posts for your personal profile or company Page. Plan and publish LinkedIn content from one simple calendar with Harlo.",
    h1: "Keep LinkedIn in the same content workflow.",
    subcopy: "Plan and schedule supported LinkedIn content alongside your other social channels without managing another separate calendar.",
    capabilityHeading: "Plan professional content ahead of time",
    capabilityCopy: "Harlo publishes directly to LinkedIn at your scheduled time, with no reminder notifications to act on.",
    formats: [
      { title: "Text posts", copy: "Written updates scheduled to publish at the right time." },
      { title: "Image posts", copy: "Single images with a caption, scheduled to your profile or Page." },
      { title: "Document posts", copy: "Share PDFs and slide decks as scrollable document posts." },
    ],
    accountSupported: ["Personal profiles", "Company Pages"],
    connectionMethod: "Connected through LinkedIn's official authorisation flow.",
    customisationHeading: "Tailor your post for LinkedIn",
    customisationCopy: "Start with one piece of content, then adjust the professional tone and formatting for LinkedIn without changing your other platforms.",
    customisationFields: ["Caption tone", "Formatting", "Document attachment"],
    analyticsHeading: "Understand which LinkedIn posts are getting attention",
    analyticsCopy: "Review the available impressions, engagement and follower growth for your published LinkedIn content in one place.",
    analyticsMetrics: [
      { label: "Impressions", value: "12.4K" },
      { label: "Engagement", value: "684" },
      { label: "Followers", value: "+58" },
      { label: "Posts published", value: "9" },
    ],
    multiAccountHeading: "Keep your profile and company Page organised",
    multiAccountCopy: "Connect your personal profile and any Company Pages you manage, kept separated through Harlo Workspaces so nothing gets mixed together.",
    exampleAccounts: ["Company Page", "Personal Profile"],
    relatedSlugs: ["facebook", "x", "youtube"],
    faqs: [
      { q: "Can I schedule posts to my personal LinkedIn profile?", a: "Yes. You can connect your personal profile as well as any Company Pages you manage." },
      { q: "Can I connect a personal LinkedIn profile?", a: "Yes. Personal profiles and Company Pages are both supported." },
      { q: "Can I schedule posts for a company Page?", a: "Yes. Connect your Company Page and schedule posts directly to it." },
      { q: "Does Harlo support LinkedIn carousels?", a: "Document posts can be used to share multi-page PDF content in a carousel-style format." },
      { q: "Will my post publish automatically?", a: "Yes. Harlo publishes directly to LinkedIn at your scheduled time." },
    ],
    ctaTitle: "Keep your LinkedIn content moving.",
    ctaCopy: "Plan your profile and company posts from one calendar.",
  },

  tiktok: {
    slug: "tiktok",
    name: "TikTok",
    path: "/tiktok-scheduler",
    Icon: TikTokIcon,
    metaTitle: "TikTok Scheduler | Harlo Social",
    metaDescription: "Plan and schedule TikTok videos ahead of time. Publish to TikTok from the same calendar you use for every other platform with Harlo.",
    h1: "Plan TikTok alongside the rest of your social content.",
    subcopy: "Prepare and schedule supported TikTok content from the same calendar you use for your other channels.",
    capabilityHeading: "Schedule TikTok content to publish automatically",
    capabilityCopy: "Harlo publishes directly to TikTok at your scheduled time through TikTok's official API.",
    formats: [
      { title: "Video posts", copy: "Schedule TikTok videos with captions, hashtags and cover images." },
    ],
    accountSupported: ["Business accounts", "Creator accounts"],
    connectionMethod: "Connected through TikTok's official login.",
    customisationHeading: "Tailor your post for TikTok",
    customisationCopy: "Start with one piece of content, then adjust the caption and hashtags for TikTok without changing what's posted elsewhere.",
    customisationFields: ["Caption", "Hashtags", "Cover image"],
    analyticsHeading: "Track your TikTok content performance",
    analyticsCopy: "Review the available views, likes and engagement for your published TikTok content in one place.",
    analyticsMetrics: [
      { label: "Views", value: "42.1K" },
      { label: "Likes", value: "3.6K" },
      { label: "Engagement", value: "8.1%" },
      { label: "Followers", value: "+340" },
    ],
    multiAccountHeading: "Keep multiple TikTok accounts organised",
    multiAccountCopy: "Connect more than one TikTok account and keep them separated through Harlo Workspaces, so content for different brands or clients never gets mixed together.",
    exampleAccounts: ["Brand TikTok", "Client TikTok"],
    relatedSlugs: ["instagram", "youtube", "threads"],
    apiNote: "Some accounts may need to confirm a scheduled post in the TikTok app, depending on the permissions TikTok grants that account.",
    faqs: [
      { q: "Can I schedule TikTok videos?", a: "Yes. Upload your video, write a caption and schedule it to publish through TikTok's official API." },
      { q: "Which TikTok account types are supported?", a: "TikTok Business and Creator accounts connected through TikTok's official login." },
      { q: "Does TikTok publish automatically?", a: "Yes, for accounts with direct publishing enabled. Some accounts may need to confirm the post in the TikTok app depending on TikTok's permissions." },
      { q: "Can I schedule TikTok videos alongside other platforms?", a: "Yes. Upload once and schedule it to TikTok and your other connected accounts from the same composer." },
    ],
    ctaTitle: "Schedule your next TikTok with Harlo.",
    ctaCopy: "Plan your TikTok content from one calendar.",
  },

  youtube: {
    slug: "youtube",
    name: "YouTube",
    path: "/youtube-scheduler",
    Icon: YouTubeIcon,
    metaTitle: "YouTube Scheduler | Harlo Social",
    metaDescription: "Schedule YouTube videos and Shorts ahead of time. Plan titles, descriptions and publish times from one simple calendar with Harlo.",
    h1: "Keep YouTube content connected to your social plan.",
    subcopy: "Organise and schedule supported YouTube content alongside the campaigns and channels surrounding it.",
    capabilityHeading: "Plan and schedule YouTube content from the same workflow",
    capabilityCopy: "Harlo sets your video to publish automatically at the time you choose, using YouTube's official API.",
    formats: [
      { title: "Videos", copy: "Schedule standard YouTube video uploads with a title, description and tags." },
      { title: "Shorts", copy: "Plan and schedule YouTube Shorts alongside your long-form content." },
    ],
    accountSupported: ["YouTube channels with management permission"],
    connectionMethod: "Connected through Google, with permission to manage the channel.",
    customisationHeading: "Tailor your upload for YouTube",
    customisationCopy: "Write a title, description and tags specifically for YouTube without changing your other platforms.",
    customisationFields: ["Title", "Description", "Tags", "Thumbnail"],
    analyticsHeading: "Review YouTube content performance",
    analyticsCopy: "Review the available views, watch time and subscriber growth for your published videos in one place.",
    analyticsMetrics: [
      { label: "Views", value: "9.8K" },
      { label: "Watch time", value: "412 hrs" },
      { label: "Subscribers", value: "+64" },
      { label: "Videos published", value: "4" },
    ],
    multiAccountHeading: "Keep multiple YouTube channels organised",
    multiAccountCopy: "Connect more than one YouTube channel and keep them separated through Harlo Workspaces, so content for different brands or clients never gets mixed together.",
    exampleAccounts: ["Main Channel", "Client Channel"],
    relatedSlugs: ["tiktok", "instagram", "linkedin"],
    faqs: [
      { q: "Can I schedule YouTube videos?", a: "Yes. Upload your video file and Harlo publishes it to your channel at your scheduled time." },
      { q: "Can I schedule YouTube Shorts?", a: "Yes. Shorts can be scheduled the same way as standard videos." },
      { q: "Can I manage multiple YouTube channels?", a: "Yes. Connect multiple channels and organise them across separate workspaces." },
      { q: "Do I need channel owner permissions?", a: "You need management access to the YouTube channel you want to connect." },
    ],
    ctaTitle: "Schedule your next YouTube upload with Harlo.",
    ctaCopy: "Plan your videos and Shorts from one calendar.",
  },

  threads: {
    slug: "threads",
    name: "Threads",
    path: "/threads-scheduler",
    Icon: ThreadsIcon,
    metaTitle: "Threads Scheduler | Harlo Social",
    metaDescription: "Schedule posts to Threads ahead of time. Plan and publish Threads content from the same calendar you use for Instagram and your other platforms.",
    h1: "Plan Threads without adding another workflow.",
    subcopy: "Create and schedule supported Threads content alongside your other social channels from one workspace.",
    capabilityHeading: "Plan your Threads content alongside your other channels",
    capabilityCopy: "Harlo publishes directly to Threads at your scheduled time through Meta's official API.",
    formats: [
      { title: "Text posts", copy: "Written Threads posts, scheduled to publish at the right time." },
      { title: "Image posts", copy: "Single and multi-image posts scheduled to Threads." },
      { title: "Video posts", copy: "Schedule video content directly to Threads." },
    ],
    accountSupported: ["Threads accounts linked to an Instagram Business or Creator account"],
    connectionMethod: "Connected through your linked Instagram account via Meta's connection flow.",
    accountNote: "Threads is treated as its own integration, connected through your linked Instagram account rather than sharing Instagram's full feature set.",
    customisationHeading: "Tailor your post for Threads",
    customisationCopy: "Write a version of your post specifically for Threads without changing your Instagram caption.",
    customisationFields: ["Caption"],
    analyticsHeading: "See how your Threads content performs",
    analyticsCopy: "Review the available views and engagement for your published Threads posts in one place.",
    analyticsMetrics: [
      { label: "Views", value: "6.2K" },
      { label: "Engagement", value: "412" },
      { label: "Posts published", value: "11" },
    ],
    multiAccountHeading: "Keep multiple Threads accounts organised",
    multiAccountCopy: "Connect more than one Threads account and keep them separated through Harlo Workspaces, so content for different brands or clients never gets mixed together.",
    exampleAccounts: ["Brand Threads", "Client Threads"],
    relatedSlugs: ["instagram", "x", "tiktok"],
    faqs: [
      { q: "Can I schedule Threads posts?", a: "Yes. Harlo publishes directly to Threads at your scheduled time." },
      { q: "Which Threads accounts can connect?", a: "Threads accounts connected through a linked Instagram Business or Creator account." },
      { q: "Can I schedule the same post to Threads and Instagram?", a: "Yes, and you can adjust the wording for each platform before scheduling." },
      { q: "Can I edit a Threads post after scheduling?", a: "Yes, up until it publishes. Once live, edits are limited by Threads itself." },
    ],
    ctaTitle: "Plan your next Threads post with Harlo.",
    ctaCopy: "Plan your Threads posts from one calendar.",
  },

  pinterest: {
    slug: "pinterest",
    name: "Pinterest",
    path: "/pinterest-scheduler",
    Icon: PinterestIcon,
    metaTitle: "Pinterest Scheduler | Harlo Social",
    metaDescription: "Schedule Pinterest Pins ahead of time. Plan boards, images and video Pins from one simple calendar with Harlo.",
    h1: "Plan Pinterest alongside every other channel.",
    subcopy: "Organise and schedule supported Pinterest content without keeping another separate content calendar.",
    capabilityHeading: "Keep your Pins publishing consistently",
    capabilityCopy: "Harlo publishes Pins directly to Pinterest at your scheduled time through Pinterest's official API.",
    formats: [
      { title: "Image Pins", copy: "Schedule standard image Pins with a title, description and link." },
      { title: "Video Pins", copy: "Upload and schedule video Pins to your boards." },
    ],
    accountSupported: ["Pinterest Business accounts"],
    connectionMethod: "Connected through Pinterest's official login.",
    customisationHeading: "Tailor your Pin for Pinterest",
    customisationCopy: "Write a title and description specifically for each Pin without changing your other platforms.",
    customisationFields: ["Pin title", "Description", "Destination URL", "Board"],
    analyticsHeading: "Track how your Pins are performing",
    analyticsCopy: "Review the available impressions, saves and clicks for your published Pins in one place.",
    analyticsMetrics: [
      { label: "Impressions", value: "31.5K" },
      { label: "Saves", value: "1.4K" },
      { label: "Clicks", value: "620" },
      { label: "Pins published", value: "14" },
    ],
    multiAccountHeading: "Keep multiple Pinterest accounts organised",
    multiAccountCopy: "Connect more than one Pinterest account and keep them separated through Harlo Workspaces, so content for different brands or clients never gets mixed together.",
    exampleAccounts: ["Brand Pinterest", "Client Pinterest"],
    relatedSlugs: ["instagram", "facebook", "youtube"],
    faqs: [
      { q: "Can I schedule Pins?", a: "Yes. Harlo publishes Pins directly to Pinterest at your scheduled time." },
      { q: "Which Pinterest accounts can connect?", a: "Pinterest Business accounts, connected through Pinterest's official login." },
      { q: "Can I choose which board a Pin goes to?", a: "Yes. Select the board for each Pin before scheduling." },
      { q: "Can I schedule video Pins?", a: "Yes. Both image and video Pins are supported." },
    ],
    ctaTitle: "Plan your next Pin with Harlo.",
    ctaCopy: "Plan your Pins from one calendar.",
  },

  x: {
    slug: "x",
    name: "X",
    path: "/x-scheduler",
    Icon: XIcon,
    metaTitle: "X Scheduler | Harlo Social",
    metaDescription: "Schedule posts on X ahead of time. Plan and publish X content from the same calendar you use for every other platform with Harlo.",
    h1: "Keep X inside your wider content plan.",
    subcopy: "Create and schedule supported posts for X alongside the rest of your social channels from one calendar.",
    capabilityHeading: "Keep your X publishing schedule organised",
    capabilityCopy: "Harlo publishes directly to X at your scheduled time through X's official API.",
    formats: [
      { title: "Text posts", copy: "Scheduled posts with support for X's character limit." },
      { title: "Image & video posts", copy: "Attach images or video to your scheduled post." },
      { title: "Threads of posts", copy: "Plan a connected series of posts and schedule them together." },
    ],
    accountSupported: ["X accounts"],
    connectionMethod: "Connected through X's official login.",
    customisationHeading: "Tailor your post for X",
    customisationCopy: "Adjust wording to fit X's character limit without changing what's posted to your other platforms.",
    customisationFields: ["Caption", "Media"],
    analyticsHeading: "See how your posts are performing on X",
    analyticsCopy: "Review the available impressions, engagement and follower growth for your posts in one place.",
    analyticsMetrics: [
      { label: "Impressions", value: "15.9K" },
      { label: "Engagement", value: "980" },
      { label: "Reposts", value: "142" },
      { label: "Followers", value: "+76" },
    ],
    multiAccountHeading: "Keep multiple X accounts organised",
    multiAccountCopy: "Connect more than one X account and keep them separated through Harlo Workspaces, so content for different brands or clients never gets mixed together.",
    exampleAccounts: ["Brand Account", "Client Account"],
    relatedSlugs: ["threads", "linkedin", "facebook"],
    faqs: [
      { q: "Can I schedule posts on X?", a: "Yes. Harlo publishes directly to X at your scheduled time." },
      { q: "Can I manage multiple X accounts?", a: "Yes. Connect multiple accounts and organise them across separate workspaces." },
      { q: "Can I schedule a thread of posts on X?", a: "Yes. Plan a connected series of posts and schedule them to publish together." },
      { q: "Can I attach images or video?", a: "Yes. Both image and video attachments are supported." },
    ],
    ctaTitle: "Schedule your next post on X with Harlo.",
    ctaCopy: "Plan your posts from one calendar.",
  },
};

export const platformSlugs = Object.keys(platformContent);
