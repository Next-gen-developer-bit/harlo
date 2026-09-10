import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/marketing/Section";
import FinalCta from "@/components/marketing/FinalCta";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import { BrowserFrame } from "@/components/mockups/Frames";
import { AppShell } from "@/components/mockups/AppShell";
import CalendarView from "@/components/mockups/CalendarView";
import TeamView from "@/components/mockups/TeamView";
import { HorizontalCard, StandardCard } from "@/components/marketing/ShowcaseCard";
import StatTile from "@/components/marketing/StatTile";
import { ClipboardListIcon, TeamIcon, ChecklistIcon, AlbumIcon, ChartIcon, GlobeIcon } from "@/components/icons/NavIcons";

const title = "Social Media Management for Growing Teams | Harlo Social";
const description =
  "Plan, publish and analyse social content from one workspace. Harlo helps growing businesses and marketing teams manage multiple channels without the complexity.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/for/growing-businesses" },
  openGraph: { title, description, url: "/for/growing-businesses" },
  twitter: { title, description },
};

const problems = [
  "Content scattered across spreadsheets, chats and documents",
  "No single view of what's publishing across every channel",
  "Campaigns becoming inconsistent across platforms",
  "Different people publishing without a shared view",
  "Approvals getting buried in email or DMs",
  "No clear understanding of what is working",
];

const outcomes = [
  { label: "Better visibility", value: "One calendar" },
  { label: "Faster approvals", value: "Built-in workflow" },
  { label: "Less spreadsheet dependency", value: "One workspace" },
  { label: "Better decisions", value: "Real performance data" },
];

export default function GrowingBusinessesPage() {
  return (
    <>
      {/* HERO */}
      <Section className="pb-10 pt-12 text-center md:pt-16">
        <div className="flex justify-center">
          <Eyebrow>For Growing Businesses & Marketing Teams</Eyebrow>
        </div>
        <h1 className="balance mx-auto mt-6 max-w-3xl text-h1-page font-semibold text-foreground">
          One place for your whole social operation.
        </h1>
        <p className="balance mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-muted md:text-[18px]">
          As your marketing grows, your tools should not multiply with it. Bring your channels, campaigns,
          content and team into one organised workspace.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/signup" size="lg" trackEvent="signup_started">Start free</Button>
          <Button href="/pricing" variant="secondary" size="lg">See pricing</Button>
        </div>
      </Section>

      <Section className="pt-0">
        <BrowserFrame className="mx-auto max-w-[1080px]">
          <AppShell title="Calendar">
            <CalendarView />
          </AppShell>
        </BrowserFrame>
      </Section>

      {/* THE PROBLEM — asymmetric editorial layout: heading + short copy
          left, six numbered statements right (no bullet dots), a distinct
          italic-emphasis statement below. Replaces the previous centred
          heading + plain two-column bullet list. */}
      <Section className="bg-surface/60">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.45fr_0.55fr] lg:gap-16">
          <div className="text-center lg:text-left">
            <h2 className="balance text-h2-page font-semibold text-foreground">
              More channels shouldn&apos;t mean more chaos.
            </h2>
            <p className="balance mx-auto mt-4 max-w-sm text-[15.5px] leading-relaxed text-muted lg:mx-0">
              As channels multiply, it gets harder to keep everyone aligned on what is being published, by
              whom, and how it is performing.
            </p>
          </div>
          <div>
            {problems.map((p, i) => (
              <div key={p} className="flex items-start gap-4 border-t border-border py-4 first:border-t-0 first:pt-0">
                <span className="mt-0.5 text-[13px] font-semibold tabular-nums text-muted/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[14.5px] leading-relaxed text-foreground">{p}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-[640px] text-center">
          <p className="balance text-[17px] leading-relaxed text-foreground">
            Harlo brings planning, publishing and performance into one workspace, so your team can manage the
            full social workflow without piecing it together across <span className="italic">multiple tools</span>.
          </p>
        </div>
      </Section>

      {/* FEATURE — large side-by-side for the calendar, then a supporting grid */}
      <Section>
        <div className="mx-auto max-w-xl text-center">
          <Eyebrow>What&apos;s inside</Eyebrow>
          <h2 className="balance mt-5 text-h2-page font-semibold text-foreground">Everything your team needs to run social.</h2>
        </div>

        <div className="mx-auto mt-12 max-w-5xl">
          <div className="rounded-[12px] border border-border bg-white p-7 md:p-9">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-center">
              <div className="min-w-0">
                <div className="mb-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-muted">Unified Social Calendar</div>
                <div className="text-[22px] font-semibold text-foreground md:text-[26px]">See everything planned and published, in one view.</div>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
                  Every connected channel, every planned post and every published post shows up on the same
                  calendar, so no one has to ask what&apos;s going out this week.
                </p>
                <Link href="/social-media-calendar" className="mt-5 inline-flex items-center gap-1.5 text-[14.5px] font-medium text-primary">
                  Explore the Social Media Calendar ↗
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

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <StandardCard
              tint="blue"
              icon={ClipboardListIcon}
              label="Campaigns"
              title="Campaign Planning"
              description="Group related posts around campaigns, launches, promotions and business initiatives."
              visual={
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10.5px] font-medium text-foreground">Product launch</span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10.5px] font-medium text-foreground">12 posts</span>
                </div>
              }
            />
            <StandardCard
              tint="purple"
              icon={TeamIcon}
              label="Team"
              title="Team Collaboration"
              description="Keep content planning, feedback and responsibilities organised between marketing team members."
              visual={<TeamView />}
            />
            <StandardCard
              tint="peach"
              icon={ChecklistIcon}
              title="Approvals"
              description="Review content before it goes live and create a clearer publishing workflow."
              visual={
                <div className="flex items-center justify-between rounded-lg bg-white px-2.5 py-2 text-[11px]">
                  <span className="font-medium text-foreground">Weekly roundup</span>
                  <span className="rounded-full bg-primary-soft px-2 py-0.5 font-medium text-primary">Approved</span>
                </div>
              }
            />
            <StandardCard
              icon={AlbumIcon}
              title="Content Library"
              description="Keep reusable media, assets and campaign content accessible in one place."
              visual={
                <div className="grid grid-cols-3 gap-1.5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-12 rounded-lg bg-surface-2" />
                  ))}
                </div>
              }
            />
            <StandardCard
              tint="blue"
              icon={ChartIcon}
              title="Analytics"
              description="Understand which content, channels and campaigns are producing engagement and improving over time."
              visual={
                <div className="flex h-12 items-end gap-1.5">
                  {[40, 65, 50, 80, 60].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t bg-primary/25" style={{ height: `${h}%` }}>
                      <div className="h-1 rounded-t bg-primary" style={{ opacity: i === 3 ? 1 : 0.5 }} />
                    </div>
                  ))}
                </div>
              }
            />
            <StandardCard
              tint="purple"
              icon={GlobeIcon}
              title="Multi-Channel Scheduling"
              description="Plan once and adapt content across every supported social platform."
              visual={
                <div className="flex items-center justify-between rounded-lg bg-white px-2.5 py-2 text-[11px]">
                  <span className="text-muted">Schedule for</span>
                  <span className="font-medium text-foreground">Fri, 6:00 PM</span>
                </div>
              }
            />
          </div>
        </div>
      </Section>

      {/* OUTCOME */}
      <Section className="bg-surface/60">
        <HorizontalCard
          label="Outcome"
          title="Spend less time coordinating social. Spend more time improving it."
          description="Better visibility, faster approvals and more consistent publishing, without adding more spreadsheets or tools to your team's workflow."
          visual={
            <div className="grid grid-cols-2 gap-2.5">
              {outcomes.map((o) => (
                <StatTile key={o.label} label={o.label} value={o.value} />
              ))}
            </div>
          }
        />
        <div className="mt-6 text-center">
          <Link href="/features/analytics" className="text-[15px] font-medium text-primary">
            Explore Social Media Analytics ↗
          </Link>
        </div>
      </Section>

      <Section>
        <h2 className="mb-8 text-[20px] font-semibold tracking-tight text-foreground">Related to your team</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/campaigns" className="surface-card rounded-[10px] p-5">
            <div className="text-[14.5px] font-semibold text-foreground">Campaigns</div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">Group content around launches and initiatives.</p>
          </Link>
          <Link href="/features/team-collaboration" className="surface-card rounded-[10px] p-5">
            <div className="text-[14.5px] font-semibold text-foreground">Team Collaboration</div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">Plan and approve content together.</p>
          </Link>
          <Link href="/features/content-library" className="surface-card rounded-[10px] p-5">
            <div className="text-[14.5px] font-semibold text-foreground">Content Library</div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">Keep reusable assets organised centrally.</p>
          </Link>
        </div>
      </Section>

      <FinalCta
        title="Make social easier to manage as your business grows."
        description="Plan, approve and publish content across every channel from one workspace."
        ctaLabel="Start free"
      />
    </>
  );
}
