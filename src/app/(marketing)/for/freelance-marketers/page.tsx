import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/marketing/Section";
import FinalCta from "@/components/marketing/FinalCta";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import { BrowserFrame } from "@/components/mockups/Frames";
import { AppShell } from "@/components/mockups/AppShell";
import WorkspacesView from "@/components/mockups/WorkspacesView";
import ComposerView from "@/components/mockups/ComposerView";
import { StandardCard, FeaturedCard } from "@/components/marketing/ShowcaseCard";
import { CalendarIcon, ClipboardListIcon, ChecklistIcon, AlbumIcon, ChartIcon } from "@/components/icons/NavIcons";

const title = "Social Media Management for Freelancers & Consultants | Harlo Social";
const description =
  "Manage client calendars, content and social accounts from one workspace. Harlo is built for freelance social media managers and marketing consultants.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/for/freelance-marketers" },
  openGraph: { title, description, url: "/for/freelance-marketers" },
  twitter: { title, description },
};

const without = [
  "Separate calendars and spreadsheets for every client",
  "Feedback scattered across email, chat and documents",
  "Publishing dates remembered manually",
  "Assets stored across random folders",
  "Constant switching between platform accounts",
];

const withHarlo = [
  "One workspace for every client",
  "Approvals kept inside the workflow",
  "One view of what is scheduled",
  "Content organised by client",
  "Publish to connected accounts from Harlo",
];

// Content Editing gets its own dedicated section further down the page, so
// it's deliberately left out of this grid to avoid explaining it twice.
const features = [
  {
    title: "Calendar",
    description: "See exactly what is planned across each client.",
    href: "/social-media-calendar",
    icon: CalendarIcon,
    visual: (
      <div className="grid grid-cols-4 gap-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`h-3 rounded-sm ${i === 2 || i === 5 ? "bg-primary/40" : "bg-surface-2"}`} />
        ))}
      </div>
    ),
  },
  {
    title: "Campaigns",
    description: "Organise content around specific client initiatives and campaigns.",
    href: "/campaigns",
    icon: ClipboardListIcon,
    visual: (
      <div className="flex flex-wrap gap-1.5">
        <span className="rounded-full bg-white px-2.5 py-1 text-[10.5px] font-medium text-foreground">Bloom & Co launch</span>
      </div>
    ),
  },
  {
    title: "Approvals",
    description: "Give clients a simple, structured way to review content before publication.",
    href: "/features/team-collaboration",
    icon: ChecklistIcon,
    visual: (
      <div className="flex items-center justify-between rounded-lg bg-white px-2.5 py-2 text-[11px]">
        <span className="font-medium text-foreground">Weekly roundup</span>
        <span className="rounded-full bg-primary-soft px-2 py-0.5 font-medium text-primary">Approved</span>
      </div>
    ),
  },
  {
    title: "Content Library",
    description: "Keep client media and reusable assets organised.",
    href: "/features/content-library",
    icon: AlbumIcon,
    visual: (
      <div className="grid grid-cols-3 gap-1.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-8 rounded-lg bg-white" />
        ))}
      </div>
    ),
  },
  {
    title: "Analytics",
    description: "Quickly understand and communicate what performed for each client.",
    href: "/features/analytics",
    icon: ChartIcon,
    visual: (
      <div className="flex h-8 items-end gap-1">
        {[40, 65, 50, 80, 60].map((h, i) => (
          <div key={i} className="flex-1 rounded-t bg-primary/30" style={{ height: `${h}%` }} />
        ))}
      </div>
    ),
  },
];

const outcomeCards = [
  { label: "More clients", tint: "blue" as const },
  { label: "Less admin", tint: "green" as const },
  { label: "Faster approvals", tint: "peach" as const },
  { label: "Clearer reporting", tint: "purple" as const },
];

const tintBg: Record<string, string> = {
  blue: "var(--pastel-blue)",
  green: "var(--pastel-green)",
  peach: "var(--pastel-peach)",
  purple: "var(--pastel-purple)",
};

export default function FreelanceMarketersPage() {
  return (
    <>
      {/* HERO */}
      <Section className="pb-10 pt-12 text-center md:pt-16">
        <div className="flex justify-center">
          <Eyebrow>For Freelancers & Marketing Consultants</Eyebrow>
        </div>
        <h1 className="balance mx-auto mt-6 max-w-3xl text-h1-page font-semibold text-foreground">
          Manage every client without the juggling act.
        </h1>
        <p className="balance mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-muted md:text-[18px]">
          Give each client their own workspace, calendar and connected accounts so you can stay organised
          without switching between separate tools and spreadsheets.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/signup" size="lg" trackEvent="signup_started">Start free</Button>
          <Button href="/pricing" variant="secondary" size="lg">See pricing</Button>
        </div>
      </Section>

      <Section className="pt-0">
        <BrowserFrame className="mx-auto max-w-[1080px]">
          <AppShell title="Workspaces">
            <WorkspacesView />
          </AppShell>
        </BrowserFrame>
      </Section>

      {/* THE PROBLEM — editorial two-column comparison (thin vertical
          divider, no outer table/border) rather than the previous large
          bordered comparison table. */}
      <Section className="bg-surface/60">
        <div className="mx-auto max-w-[640px] text-center">
          <Eyebrow>The problem</Eyebrow>
          <h2 className="balance mt-4 text-h2-page font-semibold text-foreground">
            Client work gets messy quickly.
          </h2>
          <p className="balance mt-4 text-[15.5px] leading-relaxed text-muted">
            A few clients can turn into dozens of calendars, folders, approvals and platform logins. Harlo
            gives you one place to manage the workflow without mixing client content together.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-0 sm:divide-x sm:divide-border">
          <div className="sm:pr-10">
            <div className="text-[11.5px] font-semibold uppercase tracking-wide text-muted">Without Harlo</div>
            <ul className="mt-5">
              {without.map((item) => (
                <li key={item} className="border-t border-border py-4 text-[14.5px] leading-relaxed text-muted first:border-t-0 first:pt-0">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:pl-10">
            <div className="text-[11.5px] font-semibold uppercase tracking-wide text-primary">With Harlo</div>
            <ul className="mt-5">
              {withHarlo.map((item) => (
                <li key={item} className="border-t border-border py-4 text-[14.5px] leading-relaxed text-foreground first:border-t-0 first:pt-0">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* FEATURE — one large featured card (Workspaces) + supporting grid */}
      <Section>
        <div className="mx-auto max-w-xl text-center">
          <Eyebrow>What&apos;s inside</Eyebrow>
          <h2 className="balance mt-5 text-h2-page font-semibold text-foreground">A more organised way to run client work.</h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 lg:grid-cols-2">
          <FeaturedCard
            className="lg:col-span-2"
            tint="blue"
            label="Workspaces"
            title="Every client, kept separate."
            description="Each workspace holds its own connected accounts, calendar, content library and analytics, so nothing from one client ever blends into another."
            visual={<WorkspacesView />}
          />
          {features.map((f) => (
            <Link key={f.title} href={f.href}>
              <StandardCard title={f.title} description={f.description} visual={f.visual} icon={f.icon} />
            </Link>
          ))}
        </div>
        <div className="mx-auto mt-6 max-w-5xl text-center">
          <Link href="/features/workspaces" className="text-[15px] font-medium text-primary">
            Explore Workspaces ↗
          </Link>
        </div>
      </Section>

      {/* VALUE — pastel outcome cards, deliberately smaller/lighter than the feature grid above */}
      <Section className="bg-surface/60">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="balance text-h2-page font-semibold text-foreground">Look more organised without doing more admin.</h2>
          <p className="balance mt-4 text-[15.5px] leading-relaxed text-muted">
            Harlo helps you deliver a more structured, professional client experience while giving you the
            capacity to manage additional accounts.
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          {outcomeCards.map((o) => (
            <div key={o.label} className="rounded-[10px] p-4 text-center" style={{ backgroundColor: tintBg[o.tint] }}>
              <div className="text-[13.5px] font-semibold text-foreground">{o.label}</div>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-xl text-center">
          <h3 className="text-[16px] font-semibold text-foreground">Built to grow with your client list.</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">
            Start with a small number of accounts and add more workspaces as your business grows. You do not
            need to rebuild your workflow every time you win another client.
          </p>
        </div>
      </Section>

      {/* CONTENT EDITING VISUAL — side-by-side, closes out the feature story */}
      <Section>
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 md:items-center">
          <div>
            <div className="mb-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-muted">Content Editing</div>
            <div className="text-[22px] font-semibold text-foreground md:text-[26px]">Create and adapt content without switching tools.</div>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
              Write and customise a post for each platform from the same composer, instead of rebuilding it in
              a separate app for every client and channel.
            </p>
            <Link href="/social-media-scheduler" className="mt-5 inline-flex items-center gap-1.5 text-[14.5px] font-medium text-primary">
              Explore the Post Composer ↗
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
      </Section>

      <FinalCta
        title="Spend less time managing the process."
        description="Give yourself one place to run every client's social content."
        ctaLabel="Start free"
      />
    </>
  );
}
