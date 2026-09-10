import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/marketing/Section";
import FinalCta from "@/components/marketing/FinalCta";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import { FeaturedCard, StandardCard, HorizontalCard, CompactCard } from "@/components/marketing/ShowcaseCard";
import { BrowserFrame, PhoneFrame } from "@/components/mockups/Frames";
import { AppShell, chipPalette } from "@/components/mockups/AppShell";
import CalendarView from "@/components/mockups/CalendarView";
import ComposerView from "@/components/mockups/ComposerView";
import QueueView from "@/components/mockups/QueueView";
import AnalyticsView from "@/components/mockups/AnalyticsView";
import WorkspacesView from "@/components/mockups/WorkspacesView";
import ContentLibraryView from "@/components/mockups/ContentLibraryView";
import DraftsView from "@/components/mockups/DraftsView";
import TeamView from "@/components/mockups/TeamView";
import AiCaptionView from "@/components/mockups/AiCaptionView";
import { UpcomingPostsScreen, CreatePostScreen } from "@/components/mockups/MobileScreens";
import PlatformBadge from "@/components/icons/PlatformBadge";
import { CalendarIcon, PlayIcon, ChartIcon, TeamIcon } from "@/components/icons/NavIcons";
import { platformItems } from "@/lib/nav-data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Social Media Management Features | Harlo Social",
  description:
    "Explore Harlo's social media management features including scheduling, content planning, multi-platform publishing, analytics, workspaces and team collaboration.",
  path: "/features",
});

const supportedPlatforms = platformItems.filter((p) => p.status === "Supported");

// ---------------------------------------------------------------------------
// Small shared building blocks for this page only
// ---------------------------------------------------------------------------

function ComingSoonBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full bg-surface-2 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wide text-muted ${className}`}
    >
      Coming Soon
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  copy,
}: {
  eyebrow?: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <div className="flex justify-center">
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      )}
      <h2 className={`balance text-h2-page font-semibold text-foreground ${eyebrow ? "mt-5" : ""}`}>{title}</h2>
      <p className="balance mx-auto mt-4 max-w-xl text-[15.5px] leading-relaxed text-muted md:text-[17px]">{copy}</p>
    </div>
  );
}

const avatarSeed = [
  { i: "J", c: "#3D5AFE" },
  { i: "P", c: "#C2296B" },
  { i: "M", c: "#1958C7" },
  { i: "A", c: "#26262B" },
];

function AvatarStack({ size = 8 }: { size?: number }) {
  return (
    <div className="flex -space-x-2">
      {avatarSeed.map((a, i) => (
        <div
          key={i}
          className="flex shrink-0 items-center justify-center rounded-full border-2 border-white text-[11px] font-semibold text-white"
          style={{ background: a.c, width: size * 4, height: size * 4 }}
        >
          {a.i}
        </div>
      ))}
    </div>
  );
}

// A small stack of platform-tinted chips, used inside the overview collage
// cards to represent "content that's ready across channels" at a glance.
function PlatformChipRow({ slugs }: { slugs: (keyof typeof chipPalette)[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {slugs.map((slug) => {
        const c = chipPalette[slug];
        const Icon = c.Icon;
        return (
          <span
            key={slug}
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ backgroundColor: c.bg }}
          >
            <Icon className="h-3.5 w-auto" style={{ color: c.fg }} />
          </span>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Feature directory data (bottom-of-page navigation section)
// ---------------------------------------------------------------------------

type DirectoryItem = { name: string; copy: string; href: string; comingSoon?: boolean };
type DirectoryGroup = { name: string; icon: typeof CalendarIcon; tint: string; fg: string; items: DirectoryItem[] };

const directoryGroups: DirectoryGroup[] = [
  {
    name: "Planning",
    icon: CalendarIcon,
    tint: "var(--pastel-blue)",
    fg: "#3D5AFE",
    items: [
      { name: "Social Media Calendar", copy: "See every scheduled post in one place.", href: "/social-media-calendar" },
      { name: "Campaigns", copy: "Group related content around one goal.", href: "/campaigns" },
      { name: "Drafts", copy: "Save ideas before they're ready.", href: "/features/drafts" },
      { name: "Content Library", copy: "Keep reusable assets organised.", href: "/features/content-library" },
    ],
  },
  {
    name: "Publishing",
    icon: PlayIcon,
    tint: "var(--pastel-green)",
    fg: "#0F9D58",
    items: [
      { name: "Multi-Platform Scheduling", copy: "Publish everywhere from one composer.", href: "/social-media-scheduler" },
      { name: "Queue Scheduling", copy: "Keep a consistent posting rhythm.", href: "/features/queue-scheduling" },
      { name: "Platform Customisation", copy: "Adjust each post per platform.", href: "/social-media-scheduler" },
      { name: "Recurring Scheduling", copy: "Repeatable publishing routines.", href: "/features/queue-scheduling", comingSoon: true },
    ],
  },
  {
    name: "Analytics",
    icon: ChartIcon,
    tint: "var(--pastel-peach)",
    fg: "#C2670A",
    items: [
      { name: "Social Analytics", copy: "Understand what actually works.", href: "/features/analytics" },
      { name: "Platform Comparison", copy: "See which channels are gaining traction.", href: "/features/analytics" },
      { name: "Campaign Performance", copy: "Measure campaigns, not just posts.", href: "/features/analytics" },
      { name: "Best Publishing Times", copy: "Know when your audience is active.", href: "/features/analytics" },
    ],
  },
  {
    name: "Collaboration",
    icon: TeamIcon,
    tint: "var(--pastel-pink)",
    fg: "#C2296B",
    items: [
      { name: "Workspaces", copy: "Keep every brand separate.", href: "/features/workspaces" },
      { name: "Team Collaboration", copy: "Plan and publish together.", href: "/features/team-collaboration" },
      { name: "Approval Workflows", copy: "Review content before it goes live.", href: "/features/team-collaboration" },
      { name: "Permissions", copy: "Give people access to what they need.", href: "/features/team-collaboration" },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      {/* ================================================================ */}
      {/* HERO                                                             */}
      {/* ================================================================ */}
      <Section className="pb-10 pt-12 text-center md:pt-16">
        <div className="flex justify-center">
          <Eyebrow>Features</Eyebrow>
        </div>
        <h1 className="balance mx-auto mt-6 max-w-[850px] text-h1-page font-semibold text-foreground">
          Everything you need to manage social media in one place.
        </h1>
        <p className="balance mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-muted md:text-[18px]">
          Plan content, schedule posts, collaborate with your team and understand what is working across every
          social channel without adding more complexity to your workflow.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button href="/signup" size="lg" trackEvent="signup_started">
            Start free
          </Button>
          <Button href="/pricing" variant="secondary" size="lg">
            See pricing
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {supportedPlatforms.map((p) => (
            <PlatformBadge key={p.slug} slug={p.slug} size={40} rounded="rounded-[12px]" />
          ))}
        </div>

        {/* Large premium product preview */}
        <div className="relative mx-auto mt-14 max-w-[1080px] overflow-hidden rounded-[48px]">
          <div
            className="pointer-events-none absolute -inset-6 -z-10 rounded-[48px] opacity-80 blur-2xl md:-inset-10"
            style={{
              background:
                "radial-gradient(60% 70% at 20% 10%, rgba(147,112,219,0.16), transparent 65%), radial-gradient(55% 65% at 85% 90%, rgba(61,90,254,0.14), transparent 65%)",
            }}
          />
          <BrowserFrame className="mx-auto">
            <AppShell title="Calendar">
              <CalendarView />
            </AppShell>
          </BrowserFrame>
        </div>
      </Section>

      {/* ================================================================ */}
      {/* INTRODUCTORY OVERVIEW — Plan / Schedule / Understand / Collaborate */}
      {/* ================================================================ */}
      <Section className="pt-0">
        <SectionHeading
          title="Everything connected. Nothing complicated."
          copy="Harlo brings your content planning, publishing, analytics and collaboration into one simple workspace so you can spend less time managing tools and more time creating content that works."
        />

        <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-2">
          <FeaturedCard
            tint="blue"
            title="Plan"
            description="See your entire content strategy before it goes live. Organise campaigns, build your publishing calendar, save drafts and keep upcoming content visible across every channel."
            visual={
              <div className="space-y-2.5">
                <div className="flex items-center justify-between rounded-xl bg-white p-2.5">
                  <span className="text-[11.5px] font-medium text-foreground">Wed 14 · Weekly roundup</span>
                  <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-medium text-primary">Scheduled</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white p-2.5">
                  <span className="text-[11.5px] font-medium text-foreground">Inspiration board</span>
                  <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-muted">Draft</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white p-2.5">
                  <span className="rounded-full bg-white border border-border px-2 py-0.5 text-[10px] font-medium text-foreground">Summer Drop</span>
                  <span className="rounded-full bg-white border border-border px-2 py-0.5 text-[10px] font-medium text-foreground">12 posts</span>
                </div>
              </div>
            }
          />
          <FeaturedCard
            tint="purple"
            title="Schedule"
            description="Publish everywhere from one workflow. Create your post once, customise it for each social platform and schedule everything from the same composer."
            visual={
              <div className="space-y-2.5">
                <PlatformChipRow slugs={["instagram", "facebook", "linkedin", "x"]} />
                <div className="rounded-xl bg-white p-2.5 text-[11.5px] leading-relaxed text-muted">
                  Big news: our summer collection just went live ✨
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white p-2.5 text-[11px]">
                  <span className="text-muted">Schedule for</span>
                  <span className="font-medium text-foreground">Fri, 6:00 PM</span>
                </div>
              </div>
            }
          />
          <FeaturedCard
            tint="peach"
            title="Understand"
            description="Know what is actually working. Track account and post performance, identify your strongest content and make better decisions using clear social analytics."
            visual={
              <div className="space-y-2.5">
                <div className="flex gap-2.5">
                  <div className="flex-1 rounded-xl bg-white p-2.5">
                    <div className="text-[10px] text-muted">Engagement</div>
                    <div className="text-[14px] font-semibold text-foreground">8.4%</div>
                  </div>
                  <div className="flex-1 rounded-xl bg-white p-2.5">
                    <div className="text-[10px] text-muted">Reach</div>
                    <div className="text-[14px] font-semibold text-foreground">128.4K</div>
                  </div>
                </div>
                <div className="flex h-14 items-end gap-1.5 rounded-xl bg-white p-2.5">
                  {[40, 65, 50, 80, 60, 95, 70].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t bg-primary-soft" style={{ height: `${h}%` }}>
                      <div className="h-1 rounded-t bg-primary" style={{ opacity: i === 5 ? 1 : 0.5 }} />
                    </div>
                  ))}
                </div>
              </div>
            }
          />
          <FeaturedCard
            title="Collaborate"
            description="Keep your team and clients organised. Manage brands separately, invite team members, review content and keep feedback connected to the work."
            visual={
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <AvatarStack size={7} />
                  <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-medium text-primary">4 members</span>
                </div>
                <div className="rounded-xl bg-white p-2.5">
                  <div className="text-[11px] font-medium text-foreground">Priya Shah</div>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted">&quot;Can we swap the second image before this goes out?&quot;</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl bg-white p-2.5 text-[10.5px]">
                  <span className="h-2 w-2 rounded-full bg-[#3D5AFE]" /> Personal Brand
                  <span className="ml-auto h-2 w-2 rounded-full bg-[#C2296B]" /> Bloom & Co
                </div>
              </div>
            }
          />
        </div>
      </Section>

      {/* ================================================================ */}
      {/* PLAN                                                              */}
      {/* ================================================================ */}
      <Section className="bg-surface/60">
        <SectionHeading
          eyebrow="Plan"
          title="Plan everything before you publish."
          copy="Build a clear view of what is being created, what is scheduled and what still needs attention."
        />

        <div className="mx-auto mt-12 max-w-5xl">
          <div className="rounded-[12px] border border-border bg-white p-7 transition-all duration-200 hover:-translate-y-[3px] hover:border-[rgba(61,90,254,0.16)] hover:shadow-[0_20px_40px_-24px_rgba(16,24,40,0.28)] md:p-9">
            <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-center">
              <div>
                <div className="mb-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-muted">Social Media Calendar</div>
                <div className="text-[22px] font-semibold text-foreground md:text-[26px]">Your entire content schedule at a glance.</div>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
                  See every scheduled post across every connected platform from one calendar. Move content,
                  identify gaps and understand what is publishing next without jumping between different social
                  networks.
                </p>
                <Link href="/social-media-calendar" className="group mt-5 inline-flex items-center gap-1.5 text-[14.5px] font-medium text-primary">
                  Explore the Calendar
                  <span aria-hidden="true" className="inline-block transition-transform duration-150 group-hover:translate-x-1">↗</span>
                </Link>
              </div>
              <div className="rounded-[10px] bg-surface/70 p-3 md:p-4">
                <BrowserFrame>
                  <AppShell title="Calendar">
                    <CalendarView />
                  </AppShell>
                </BrowserFrame>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <StandardCard
              title="Content Library"
              description="Store images, videos and creative assets in one place so your best content is always easy to find and reuse."
              visual={
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="h-12 rounded-lg bg-surface-2" />
                  <div className="h-12 rounded-lg bg-surface-2" />
                  <div className="h-12 rounded-lg bg-surface-2" />
                </div>
              }
            />
            <StandardCard
              title="Drafts"
              description="Capture unfinished posts, concepts and captions without adding them to your publishing schedule."
              visual={
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between rounded-lg bg-white px-2.5 py-1.5">
                    <span className="truncate text-[11px] font-medium text-foreground">Summer collection teaser</span>
                    <span className="shrink-0 rounded-full bg-surface-2 px-1.5 py-0.5 text-[9px] font-medium text-muted">Draft</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-white px-2.5 py-1.5">
                    <span className="truncate text-[11px] font-medium text-foreground">Q3 product update</span>
                    <span className="shrink-0 rounded-full bg-surface-2 px-1.5 py-0.5 text-[9px] font-medium text-muted">Draft</span>
                  </div>
                </div>
              }
            />
            <StandardCard
              title="Campaigns"
              description="Group posts around launches, promotions, clients or campaigns so you can see how different content contributes to the same objective."
              visual={
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10.5px] font-medium text-foreground">Summer Drop</span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10.5px] font-medium text-foreground">12 posts</span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10.5px] font-medium text-foreground">Jun 3 – 21</span>
                </div>
              }
            />
          </div>
        </div>
      </Section>

      {/* ================================================================ */}
      {/* SCHEDULE                                                          */}
      {/* ================================================================ */}
      <Section>
        <SectionHeading
          eyebrow="Schedule"
          title="Schedule once. Publish everywhere."
          copy="Plan and publish content across your social channels without rebuilding every post from scratch."
        />

        <div className="mx-auto mt-12 max-w-5xl">
          <div className="rounded-[12px] border border-border bg-white p-7 transition-all duration-200 hover:-translate-y-[3px] hover:border-[rgba(61,90,254,0.16)] hover:shadow-[0_20px_40px_-24px_rgba(16,24,40,0.28)] md:p-9">
            <div className="grid gap-8 md:grid-cols-[0.75fr_1.25fr] md:items-center">
              <div>
                <div className="mb-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-muted">Multi-Platform Scheduling</div>
                <div className="text-[22px] font-semibold text-foreground md:text-[26px]">One composer. Every social channel.</div>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  Create your content once and publish across Instagram, Facebook, LinkedIn, TikTok, YouTube,
                  Threads, Pinterest and X from one workflow.
                </p>
                <Link href="/social-media-scheduler" className="group mt-5 inline-flex items-center gap-1.5 text-[14.5px] font-medium text-primary">
                  Explore the Scheduler
                  <span aria-hidden="true" className="inline-block transition-transform duration-150 group-hover:translate-x-1">↗</span>
                </Link>
              </div>
              <div className="rounded-[10px] bg-surface/70 p-3 md:p-4">
                <BrowserFrame>
                  <AppShell title="New Post">
                    <ComposerView />
                  </AppShell>
                </BrowserFrame>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <StandardCard
              tint="purple"
              title="Platform Customisation"
              description="Adjust captions, media and publishing settings individually for each social network before scheduling."
              visual={<PlatformChipRow slugs={["instagram", "tiktok", "youtube", "threads"]} />}
            />
            <StandardCard
              tint="blue"
              title="Queue Scheduling"
              description="Create reusable publishing times and automatically place queued posts into your preferred schedule."
              visual={
                <div className="flex items-center justify-between rounded-lg bg-white px-2.5 py-2">
                  <div>
                    <div className="text-[11px] font-medium text-foreground">Wednesday</div>
                    <div className="text-[9.5px] text-muted">1:00 PM</div>
                  </div>
                  <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[9.5px] font-medium text-primary">Queued</span>
                </div>
              }
            />
            <div className="rounded-[12px] border border-border bg-white p-6">
              <div className="mb-5 rounded-[10px] bg-surface/70 p-3.5">
                <div className="flex items-center gap-1.5 text-[10.5px] font-medium text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted/50" /> Every Monday · 9:00 AM
                </div>
              </div>
              <div className="text-[17px] font-semibold text-foreground">Recurring Scheduling</div>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                Set regular publishing schedules for recurring content so you spend less time manually selecting
                dates and times.
              </p>
              <ComingSoonBadge className="mt-3" />
            </div>
          </div>
        </div>
      </Section>

      {/* ================================================================ */}
      {/* ANALYTICS / UNDERSTAND                                            */}
      {/* ================================================================ */}
      <Section className="bg-surface/60">
        <SectionHeading
          eyebrow="Analytics"
          title="Understand what your content is doing."
          copy="See what's working, compare it against what came before, and use that to make better decisions about what to publish next."
        />

        <div className="mx-auto mt-12 max-w-5xl">
          <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-[10px] bg-white p-3 md:p-4">
              <BrowserFrame>
                <AppShell title="Analytics">
                  <AnalyticsView />
                </AppShell>
              </BrowserFrame>
            </div>
            <div className="flex flex-col gap-3">
              <div className="rounded-[10px] border border-border bg-white p-4">
                <div className="mb-2.5 text-[11.5px] font-semibold text-foreground">Top posts this week</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11.5px]">
                    <span className="truncate text-muted">Summer collection reel</span>
                    <span className="shrink-0 font-medium text-primary">8.4%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11.5px]">
                    <span className="truncate text-muted">Q3 product update</span>
                    <span className="shrink-0 font-medium text-primary">6.1%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11.5px]">
                    <span className="truncate text-muted">Behind the scenes clip</span>
                    <span className="shrink-0 font-medium text-primary">5.7%</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 rounded-[10px] border border-border bg-white p-4">
                <div className="mb-1.5 text-[11px] text-muted">Follower growth</div>
                <div className="text-[19px] font-semibold text-foreground">+412</div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(["instagram", "linkedin"] as const).map((slug) => {
                    const c = chipPalette[slug];
                    const Icon = c.Icon;
                    return (
                      <span key={slug} className="flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: c.bg }}>
                        <Icon className="h-3 w-auto" style={{ color: c.fg }} />
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <CompactCard
              title="Understand what performs"
              description="Track performance, compare channels and see which content is connecting with your audience, without digging through every platform's own dashboard."
            />
            <CompactCard
              title="Post Performance"
              description="Compare individual posts and quickly identify the formats, topics and creative that perform best."
            />
            <CompactCard
              title="Best Publishing Times"
              description="See which days and times your content tends to perform best, based on your own publishing history."
            />
            <div className="rounded-[12px] border border-border bg-white p-5">
              <div className="text-[15px] font-semibold text-foreground">AI Recommendations</div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                Use previous content performance to surface practical recommendations for future posts.
              </p>
              <ComingSoonBadge className="mt-3" />
            </div>
          </div>
        </div>
      </Section>

      {/* ================================================================ */}
      {/* WORKSPACES / COLLABORATION                                        */}
      {/* ================================================================ */}
      <Section>
        <SectionHeading
          eyebrow="Collaborate"
          title="Built for more than one person."
          copy="Whether you manage one brand or multiple clients, keep content, users and workflows organised without creating a mess."
        />

        <div className="mx-auto mt-12 max-w-5xl">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-[10px] bg-white p-3 md:p-4">
              <BrowserFrame>
                <AppShell title="Workspaces">
                  <WorkspacesView />
                </AppShell>
              </BrowserFrame>
            </div>
            <div className="rounded-[10px] bg-white p-3 md:p-4">
              <BrowserFrame>
                <AppShell title="Team" workspace="Meridian Studio">
                  <TeamView />
                </AppShell>
              </BrowserFrame>
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StandardCard
              tint="purple"
              title="Workspaces"
              description="Create dedicated workspaces for businesses, brands or clients while managing everything from the same Harlo account."
              visual={
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3D5AFE] text-[11px] font-semibold text-white">P</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C2296B] text-[11px] font-semibold text-white">C</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-border text-[11px] text-muted">+</span>
                </div>
              }
            />
            <StandardCard
              title="Team Collaboration"
              description="Invite teammates into your workspace and collaborate on planning, publishing and performance."
              visual={<AvatarStack size={6} />}
            />
            <StandardCard
              title="Approval Workflows"
              description="Give teams and clients a clearer way to review upcoming content and approve posts before publishing."
              visual={
                <div className="flex items-center justify-between rounded-lg bg-white px-2.5 py-2 text-[11px]">
                  <span className="font-medium text-foreground">Weekly roundup</span>
                  <span className="rounded-full bg-primary-soft px-2 py-0.5 font-medium text-primary">Approved</span>
                </div>
              }
            />
            <StandardCard
              title="Permissions"
              description="Control workspace and account access so team members can work without unnecessarily exposing every brand or client."
              visual={
                <div className="flex items-center justify-between rounded-lg bg-white px-2.5 py-2 text-[11px]">
                  <span className="font-medium text-foreground">Priya Shah</span>
                  <span className="rounded-full bg-surface-2 px-2 py-0.5 font-medium text-muted">Editor</span>
                </div>
              }
            />
          </div>
        </div>
      </Section>

      {/* ================================================================ */}
      {/* CONTENT CREATION                                                  */}
      {/* ================================================================ */}
      <Section className="bg-surface/60">
        <SectionHeading
          eyebrow="Create"
          title="From idea to scheduled post."
          copy="Keep the entire content workflow inside Harlo, from the first idea through to publishing."
        />

        <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-2">
          <HorizontalCard
            className="md:col-span-2"
            title="AI Caption Assistant"
            description="Generate ideas, improve existing copy and adapt captions without leaving your publishing workflow."
            visual={<AiCaptionView />}
          />
          <StandardCard
            title="Content Library"
            description="Organise frequently used images, videos and brand assets so they can easily be added to future posts."
            visual={<ContentLibraryView />}
          />
          <StandardCard
            title="Drafts"
            description="Save unfinished posts and return to them whenever you are ready to publish."
            visual={<DraftsView />}
          />
        </div>

        <div className="mx-auto mt-5 max-w-5xl">
          <HorizontalCard
            title="Platform Preview"
            description="Preview and customise content for each social channel before it goes live."
            visual={
              <div className="space-y-2">
                <div className="rounded-xl border border-border bg-white p-3">
                  <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium">
                    <span className="h-2 w-2 rounded-full bg-[#C2296B]" /> Instagram preview
                  </div>
                  <div className="text-[11px] leading-relaxed text-muted">Big news: our summer collection just went live ✨</div>
                </div>
                <div className="rounded-xl border border-border bg-white p-3">
                  <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium">
                    <span className="h-2 w-2 rounded-full bg-[#1A1A1F]" /> X preview
                  </div>
                  <div className="text-[11px] leading-relaxed text-muted">Summer collection is live. Shop the drop.</div>
                </div>
              </div>
            }
          />
        </div>
      </Section>

      {/* ================================================================ */}
      {/* MOBILE                                                            */}
      {/* ================================================================ */}
      <Section className="overflow-hidden">
        <div className="mx-auto max-w-xl text-center">
          <div className="flex justify-center">
            <ComingSoonBadge className="bg-primary-soft text-primary" />
          </div>
          <h2 className="balance mt-5 text-h2-page font-semibold text-foreground">Harlo wherever your content happens.</h2>
          <p className="balance mx-auto mt-4 max-w-md text-[15.5px] leading-relaxed text-muted md:text-[17px]">
            Plan, review and manage your social content from a mobile experience designed specifically for iOS
            and Android.
          </p>
        </div>

        <div className="relative mx-auto mt-14 max-w-2xl">
          <div
            className="pointer-events-none absolute -inset-10 -z-10 rounded-full opacity-70 blur-3xl"
            style={{ background: "radial-gradient(55% 55% at 50% 40%, rgba(61,90,254,0.16), transparent 70%)" }}
          />
          <div className="flex flex-wrap items-end justify-center gap-8">
            <PhoneFrame className="w-[220px] translate-y-4 opacity-90">
              <CreatePostScreen />
            </PhoneFrame>
            <PhoneFrame className="w-[240px]">
              <UpcomingPostsScreen />
            </PhoneFrame>
          </div>
          <p className="mt-8 text-center text-[12px] text-muted">Product preview: mobile app screens shown are in-progress designs.</p>
        </div>
      </Section>

      {/* ================================================================ */}
      {/* FEATURE DIRECTORY                                                 */}
      {/* ================================================================ */}
      <Section className="bg-surface/60">
        <SectionHeading title="Explore every Harlo feature." copy="A quick way to browse everything Harlo can do, grouped by workflow." />

        <div className="mx-auto mt-12 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {directoryGroups.map((group) => {
            const GroupIcon = group.icon;
            return (
              <div key={group.name} className="rounded-[10px] border border-border bg-white p-5">
                <div className="mb-4 flex items-center gap-2.5">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]"
                    style={{ background: group.tint }}
                  >
                    <GroupIcon className="h-[16px] w-[16px]" style={{ color: group.fg }} />
                  </span>
                  <span className="text-[13.5px] font-semibold text-foreground">{group.name}</span>
                </div>
                <div className="space-y-4">
                  {group.items.map((item) => (
                    <div key={item.name} className="border-t border-border/70 pt-4 first:border-t-0 first:pt-0">
                      <div className="text-[13.5px] font-medium text-foreground">{item.name}</div>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{item.copy}</p>
                      {item.comingSoon ? (
                        <ComingSoonBadge className="mt-2" />
                      ) : (
                        <Link
                          href={item.href}
                          className="group mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-primary"
                        >
                          Learn more
                          <span aria-hidden="true" className="inline-block text-[13px] leading-none transition-transform duration-150 group-hover:translate-x-0.5">↗</span>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ================================================================ */}
      {/* CTA                                                               */}
      {/* ================================================================ */}
      <FinalCta
        title="Your social media workflow is about to get simpler."
        description="Plan, schedule and understand your content from one place. Start using Harlo free and connect your first social accounts in minutes."
        ctaLabel="Start free"
      />
    </>
  );
}
