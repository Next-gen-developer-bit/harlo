import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/marketing/Section";
import FinalCta from "@/components/marketing/FinalCta";
import Faq from "@/components/marketing/Faq";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import { BrowserFrame } from "@/components/mockups/Frames";
import { AppShell, chipPalette } from "@/components/mockups/AppShell";
import CalendarView from "@/components/mockups/CalendarView";
import { FeaturedCard, StandardCard } from "@/components/marketing/ShowcaseCard";
import StatusPill from "@/components/marketing/StatusPill";
import PlatformBadge from "@/components/icons/PlatformBadge";
import { platformItems } from "@/lib/nav-data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Social Media Calendar & Content Planner | Harlo Social",
  description:
    "Plan every social media post from one visual calendar. Organise drafts, scheduled posts and published content across all your accounts.",
  path: "/social-media-calendar",
});

const supportedPlatforms = platformItems.filter((p) => p.status === "Supported");

const scheduleDays: { day: string; posts: { platform: keyof typeof chipPalette; label: string; status: string }[] }[] = [
  { day: "Mon 12", posts: [{ platform: "instagram", label: "Product teaser", status: "Scheduled" }] },
  { day: "Tue 13", posts: [{ platform: "linkedin", label: "Case study", status: "Published" }] },
  { day: "Wed 14", posts: [
    { platform: "tiktok", label: "Behind the scenes", status: "Scheduled" },
    { platform: "facebook", label: "Weekly roundup", status: "Draft" },
  ] },
  { day: "Thu 15", posts: [{ platform: "youtube", label: "Tutorial", status: "Scheduled" }] },
];

const draftRows: { label: string; status: string }[] = [
  { label: "Inspiration board", status: "Draft" },
  { label: "Announcement", status: "Scheduled" },
];

const workspacePills = [
  { name: "Personal Brand", color: "#3D5AFE" },
  { name: "Bloom & Co", color: "#C2296B" },
];

const faqs = [
  { q: "What is a social media calendar?", a: "A social media calendar is a visual overview of your upcoming, drafted and published social media posts, organised by date." },
  { q: "How do I create a social media calendar?", a: "In Harlo, connect your social accounts and every post you schedule automatically appears on your calendar. There's no separate spreadsheet to maintain." },
  { q: "Can I schedule posts from a content calendar?", a: "Yes. You can create and schedule a new post directly from any day on the calendar." },
  { q: "What should a social media calendar include?", a: "A useful calendar should show what's scheduled, drafted and published across every platform and account you manage, ideally in one view." },
];

export default function SocialMediaCalendarPage() {
  return (
    <>
      <Section className="pb-10 pt-12 text-center md:pt-16">
        <div className="flex justify-center">
          <Eyebrow>Social Media Calendar</Eyebrow>
        </div>
        <h1 className="balance mx-auto mt-6 max-w-2xl text-h1-page font-semibold text-foreground">
          See your whole social schedule in one place.
        </h1>
        <p className="balance mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-muted md:text-[18px]">
          Plan upcoming content across brands and channels, move posts around and see exactly what is
          scheduled without relying on spreadsheets.
        </p>
        <div className="mt-8 flex justify-center">
          <Button href="/signup" size="lg" trackEvent="signup_started">Start free</Button>
        </div>
      </Section>

      <Section className="pt-0">
        <BrowserFrame className="mx-auto max-w-[980px]">
          <AppShell title="Calendar">
            <CalendarView />
          </AppShell>
        </BrowserFrame>
      </Section>

      <Section className="bg-surface/60">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-h2-page font-semibold text-foreground">
            Know exactly what is coming next.
          </h2>
          <p className="balance mt-4 text-[15.5px] leading-relaxed text-muted">
            View drafts, scheduled posts and upcoming campaigns in one clear calendar, instead of a spreadsheet,
            a notes app and half a dozen platform dashboards.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid gap-5 lg:grid-cols-5">
          <FeaturedCard
            className="lg:col-span-3"
            title="See your entire schedule"
            description="Know exactly what is going out, where it is being posted and when it will publish, for every connected account, in one calendar."
            visual={
              <div className="grid grid-cols-4 gap-2">
                {scheduleDays.map((d) => (
                  <div key={d.day} className="min-h-[128px] rounded-xl border border-border bg-white p-1.5">
                    <div className="px-1 pb-1.5 text-[10.5px] font-medium text-muted">{d.day}</div>
                    {d.posts.map((p) => {
                      const c = chipPalette[p.platform];
                      const Icon = c.Icon;
                      return (
                        <div key={p.label} className="mb-1 rounded-lg p-1.5" style={{ backgroundColor: c.bg }}>
                          <Icon className="h-3 w-auto" style={{ color: c.fg }} />
                          <div className="mt-1 truncate text-[9.5px] font-medium leading-tight" style={{ color: c.fg }}>
                            {p.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            }
          />
          <div className="flex flex-col gap-5 lg:col-span-2">
            <StandardCard
              title="Drag and drop to reschedule"
              description="Move a post to a new date or time without opening it. Harlo updates the schedule instantly."
              visual={
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-lg border border-dashed border-border bg-white p-2.5 text-center text-[10.5px] text-muted">
                    Tue 13
                  </div>
                  <ArrowGlyph />
                  <div className="flex-1 rounded-lg bg-primary-soft p-2.5 text-center text-[10.5px] font-medium text-primary">
                    Wed 14
                  </div>
                </div>
              }
            />
            <StandardCard
              className="flex-1"
              title="Manage multiple platforms"
              description="See every connected account in the same view, so nothing needs its own separate calendar."
              visual={
                <div className="flex flex-wrap gap-2">
                  {supportedPlatforms.map((p) => (
                    <PlatformBadge key={p.slug} slug={p.slug} size={28} rounded="rounded-lg" />
                  ))}
                </div>
              }
            />
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <StandardCard
            title="Drafts stay in view"
            description="Keep drafts, upcoming posts and published content visible in the same planning workflow so nothing gets forgotten."
            visual={
              <div className="space-y-2">
                {draftRows.map((r) => (
                  <div key={r.label} className="flex items-center justify-between rounded-lg bg-white px-2.5 py-2">
                    <span className="truncate text-[11.5px] font-medium text-foreground">{r.label}</span>
                    <StatusPill status={r.status} />
                  </div>
                ))}
              </div>
            }
          />
          <StandardCard
            title="Move between brands without losing visibility"
            description="Each workspace keeps its own social schedule while Harlo gives you one consistent way to manage them."
            visual={
              <div className="flex flex-wrap gap-2">
                {workspacePills.map((w) => (
                  <div key={w.name} className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold text-white" style={{ backgroundColor: w.color }}>
                      {w.name.charAt(0)}
                    </span>
                    <span className="text-[11.5px] font-medium text-foreground">{w.name}</span>
                  </div>
                ))}
              </div>
            }
          />
          <StandardCard
            title="Create from the calendar"
            description="Click any day to start a new post without leaving the calendar view."
            visual={
              <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-white py-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[15px] font-medium text-white">+</span>
              </div>
            }
          />
        </div>
      </Section>

      <Section className="bg-surface/60">
        <Faq items={faqs} title="Social media calendar FAQs" />
      </Section>

      <Section>
        <h2 className="mb-8 text-[20px] font-semibold tracking-tight text-foreground">Related</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/features/queue-scheduling" className="surface-card rounded-[10px] p-5">
            <div className="text-[14.5px] font-semibold text-foreground">Queue Scheduling</div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">Build recurring posting schedules and automatically fill available slots.</p>
          </Link>
          <Link href="/social-media-scheduler" className="surface-card rounded-[10px] p-5">
            <div className="text-[14.5px] font-semibold text-foreground">Social Media Scheduler</div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">Plan and schedule posts across multiple platforms.</p>
          </Link>
          <Link href="/campaigns" className="surface-card rounded-[10px] p-5">
            <div className="text-[14.5px] font-semibold text-foreground">Campaigns</div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">Group related posts together and see them in context.</p>
          </Link>
        </div>
      </Section>

      <FinalCta
        title="Bring your social calendar into one place."
        description="Start free and see every brand, channel and post on one calendar."
      />
    </>
  );
}

function ArrowGlyph() {
  return (
    <span aria-hidden="true" className="shrink-0 text-[15px] leading-none text-muted">
      →
    </span>
  );
}
