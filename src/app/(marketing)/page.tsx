import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Faq from "@/components/marketing/Faq";
import FinalCta from "@/components/marketing/FinalCta";
import AudienceSection from "@/components/marketing/AudienceSection";
import PlatformTiles from "@/components/marketing/PlatformTiles";
import StatusPill from "@/components/marketing/StatusPill";
import { BrowserFrame } from "@/components/mockups/Frames";
import { AppShell } from "@/components/mockups/AppShell";
import HomeCalendarView from "@/components/mockups/HomeCalendarView";
import ComposerView from "@/components/mockups/ComposerView";
import AnalyticsView from "@/components/mockups/AnalyticsView";
import PlatformBadge from "@/components/icons/PlatformBadge";
import Eyebrow from "@/components/ui/Eyebrow";
import { ChecklistIcon, ClipboardIcon, FolderIcon } from "@/components/icons/NavIcons";
import { platformItems } from "@/lib/nav-data";
import { buildMetadata } from "@/lib/seo";

const title = "Social Media Management Platform | Harlo Social";
const description =
  "Plan, schedule, publish and analyse social content across multiple brands and channels from one workspace. Harlo is built for growing businesses, freelancers and agencies. Start free.";

export const metadata: Metadata = buildMetadata({ title, description, path: "" });

const supportedPlatforms = platformItems.filter((p) => p.status === "Supported");

// Homepage-only workspace data — kept local rather than edited into the
// shared WorkspacesView (used on 5 other pages with its own brand set),
// since this section specifically calls for exactly these four brands.
const homeWorkspaces = [
  { name: "Bloom & Co", accounts: 6, color: "#26262B" },
  { name: "Vela Studio", accounts: 3, color: "#C2296B", active: true },
  { name: "Peak Fitness", accounts: 5, color: "#1958C7" },
  { name: "Meridian Studio", accounts: 4, color: "#0F9D58" },
];

const whyHarlo = [
  {
    icon: ChecklistIcon,
    title: "Simple by design",
    description: "Get started without complicated onboarding or a dashboard full of features you never use.",
  },
  {
    icon: FolderIcon,
    title: "Every brand in one place",
    description: "Keep clients and brands separated while managing everything through the same Harlo account.",
  },
  {
    icon: ClipboardIcon,
    title: "Clear from planning to performance",
    description: "Move from scheduling content to understanding results without changing platforms.",
  },
];

const homeFaqs = [
  { q: "What is Harlo?", a: "Harlo is a social media management platform for planning, creating, scheduling, organising and analysing social content across multiple accounts, brands and platforms." },
  { q: "Which social platforms does Harlo support?", a: "Harlo is being built to support Instagram, Facebook, LinkedIn, TikTok, YouTube, Threads, Pinterest and X, subject to the publishing features available through each platform's official API." },
  { q: "Can Harlo publish posts automatically?", a: "Where the connected social platform and post type support direct publishing, Harlo can publish scheduled content automatically. Availability can vary by platform and content type." },
  { q: "Can I manage multiple brands or clients?", a: "Yes. Workspaces keep each brand or client's accounts, calendar, campaigns and content organised separately." },
  { q: "Can I customise posts for different platforms?", a: "Yes. Start with shared content and customise supported captions, media and publishing options for individual platforms before publishing." },
  { q: "Does Harlo include analytics?", a: "Yes. Harlo includes social performance analytics designed to help you understand reach, engagement, growth and content performance." },
  { q: "Is Harlo suitable for agencies?", a: "Yes. Harlo is designed for freelancers, consultants, agencies and internal marketing teams managing multiple accounts or brands." },
];

export default function Home() {
  return (
    <>
      {/* HERO — calm, centred, warm off-white canvas. No gradient, no
          product screenshot at the top, no card around the content. */}
      <section className="w-full bg-background">
        <Container className="pt-20 pb-16 md:pt-28 md:pb-20">
          <div className="mx-auto max-w-[900px] text-center">
            {/* text-[2.125rem]/leading-[1.15] below sm — this longer
                headline wraps to 4-5 tight lines at the shared --text-h1
                token's 44px mobile floor; this scoped override (mobile
                only, desktop/tablet untouched via sm:text-h1) keeps it to
                a balanced 2-3 lines without changing the shared token. */}
            <h1 className="fade-up balance mx-auto max-w-[880px] text-[2.125rem] font-semibold leading-[1.15] text-foreground sm:text-h1">
              Social media management, intelligence and growth.
            </h1>
            <p className="fade-up balance mx-auto mt-5 max-w-[560px] text-hero-desc text-muted">
              Schedule posts, manage content, campaigns and performance across every brand, client and channel
              from one workspace.
            </p>
            <div className="fade-up mx-auto mt-7 flex w-full max-w-[320px] flex-col items-center justify-center gap-2.5 sm:max-w-none sm:flex-row">
              <Button href="/signup" size="lg" className="w-full sm:w-auto" trackEvent="signup_started">
                Start free
              </Button>
              <Button href="/pricing" variant="secondary" size="lg" className="w-full sm:w-auto">
                See pricing
              </Button>
            </div>
            <p className="fade-up mt-4 text-[13px] text-muted">Free plan. No credit card required.</p>
          </div>

          <div className="fade-up mt-10">
            <PlatformTiles />
          </div>
        </Container>
      </section>

      {/* CALENDAR — the homepage's first major product demonstration,
          directly after the hero (per the "Hero → Calendar → Built for
          you" homepage flow). Copy carried over from the previous
          editorial-introduction section; the two previous sections (a
          small asymmetric intro collage, then a separate plain calendar
          section) are merged into this one large product-led section so
          there is exactly one calendar moment, not two. */}
      <section className="w-full bg-background py-16 md:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_2fr] lg:gap-14">
            <div className="min-w-0 text-center lg:text-left">
              <h2 className="balance text-h2 font-semibold text-foreground">
                Everything you need, before your workflow gets complicated.
              </h2>
              <p className="balance mx-auto mt-5 max-w-sm text-lg text-muted lg:mx-0">
                Harlo brings your calendar, content, publishing and performance into one workspace so managing
                more channels does not mean managing more tools.
              </p>
              <div className="mt-9 space-y-6">
                <div>
                  <div className="text-[16px] font-semibold text-foreground">Plan clearly</div>
                  <p className="mx-auto mt-1.5 max-w-sm text-[15px] leading-relaxed text-muted lg:mx-0">
                    See what is scheduled across brands and channels before anything goes live.
                  </p>
                </div>
                <div>
                  <div className="text-[16px] font-semibold text-foreground">Publish confidently</div>
                  <p className="mx-auto mt-1.5 max-w-sm text-[15px] leading-relaxed text-muted lg:mx-0">
                    Create once, tailor content by platform and choose exactly when it publishes.
                  </p>
                </div>
              </div>
              <div className="mt-7 flex justify-center lg:justify-start">
                <Link href="/social-media-calendar" className="inline-flex items-center gap-1.5 text-[15px] font-medium text-primary">
                  Explore the Social Media Calendar <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>

            <div className="min-w-0">
              <HomeCalendarView />
            </div>
          </div>
        </Container>
      </section>

      {/* BUILT FOR — three large editorial audience tiles (see
          AudienceSection.tsx). Third homepage section, directly under the
          calendar demo: Hero introduces Harlo, Calendar demonstrates the
          product, Built For You explains who it's for. */}
      <AudienceSection />

      {/* CREATE & PUBLISH — reversed: copy left, visual right, with a
          small platform-preview crop overlapping the composer's corner. */}
      <section className="w-full bg-background py-16 md:py-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div className="min-w-0 text-center lg:text-left">
              <Eyebrow>Create &amp; Publish</Eyebrow>
              <h2 className="balance mt-4 text-h2 font-semibold text-foreground">
                Create once.
                <br />
                <span className="italic">Tailor</span> it everywhere.
              </h2>
              <p className="balance mx-auto mt-4 max-w-sm text-lg text-muted lg:mx-0">
                Start with one post and customise captions, media and publishing options for each channel
                without rebuilding the same content again and again.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 lg:justify-start">
                {supportedPlatforms.slice(0, 6).map((p) => (
                  <PlatformBadge key={p.slug} slug={p.slug} size={28} rounded="rounded-[9px]" />
                ))}
              </div>
              <div className="mt-6 flex justify-center lg:justify-start">
                <Link href="/social-media-scheduler" className="inline-flex items-center gap-1.5 text-[15px] font-medium text-primary">
                  Explore Publishing &amp; Scheduling <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>

            <div className="relative min-w-0">
              <div className="rounded-[12px] bg-surface p-3 md:p-4">
                <BrowserFrame>
                  <AppShell title="New Post" compact>
                    <ComposerView />
                  </AppShell>
                </BrowserFrame>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* WORKSPACES — warm beige feature area (not grey). */}
      <section className="w-full bg-surface py-16 md:py-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            <div className="mx-auto min-w-0 w-full max-w-[620px] lg:order-first lg:mx-0">
              <div className="relative rounded-[12px] border border-border-dark bg-white p-4 md:p-5">
                <div className="absolute -right-1 -top-1 z-10 flex items-center gap-1.5 rounded-full border border-border-dark bg-white py-1 pl-1 pr-3 shadow-[0_6px_16px_-6px_rgba(36,30,18,0.2)]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white" style={{ backgroundColor: "#C2296B" }}>
                    V
                  </span>
                  <span className="text-[11.5px] font-medium text-foreground">Vela Studio</span>
                  <span aria-hidden="true" className="text-[9px] text-muted">▾</span>
                </div>
                <div className="grid gap-2.5 pt-3 sm:grid-cols-2">
                  {homeWorkspaces.map((w) => (
                    <div
                      key={w.name}
                      className={`rounded-[10px] border p-3.5 ${w.active ? "border-border-dark bg-white" : "border-border bg-white/60"}`}
                    >
                      <div className="mb-2.5 flex items-center gap-2.5">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-semibold text-white"
                          style={{ backgroundColor: w.color }}
                        >
                          {w.name.charAt(0)}
                        </div>
                        <div className="text-[14px] font-medium">{w.name}</div>
                      </div>
                      <div className="text-[12px] text-muted">{w.accounts} connected accounts</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 rounded-[10px] border border-border-dark bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11.5px] font-semibold uppercase tracking-wide text-muted">Campaign</div>
                    <div className="mt-1 text-[16px] font-semibold text-foreground">Summer Campaign</div>
                  </div>
                  <StatusPill status="Published" />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  <div className="rounded-[10px] bg-surface-2 p-3">
                    <div className="text-[11px] text-muted">Posts</div>
                    <div className="mt-1 text-[16px] font-semibold text-foreground">24</div>
                  </div>
                  <div className="rounded-[10px] bg-surface-2 p-3">
                    <div className="text-[11px] text-muted">Channels</div>
                    <div className="mt-1 text-[16px] font-semibold text-foreground">4</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-w-0 text-center lg:text-left">
              <Eyebrow>Workspaces</Eyebrow>
              <h2 className="balance mt-4 text-h2 font-semibold text-foreground">
                A place for every brand you manage.
              </h2>
              <p className="balance mx-auto mt-4 max-w-sm text-lg text-muted lg:mx-0">
                Separate accounts, content, campaigns and calendars by brand or client, then move between
                workspaces without changing tools.
              </p>
              <div className="mt-6 flex justify-center lg:justify-start">
                <Link href="/features/workspaces" className="inline-flex items-center gap-1.5 text-[15px] font-medium text-primary">
                  Explore Workspaces <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ANALYTICS — the one dark section, deep warm charcoal rather than
          near-black. Editorial restraint: heading, description, then the
          interface directly underneath, no benefit row, no white panel. */}
      <section className="w-full bg-[var(--dark-bg)] py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex justify-center">
              <Eyebrow className="text-white/50">Analytics</Eyebrow>
            </div>
            <h2 className="balance mt-4 text-h2 font-semibold text-white">
              Understand what worked.
              <br />
              Know what to do next.
            </h2>
            <p className="balance mt-4 text-lg text-white/60">
              See engagement, reach, growth and content performance across connected accounts without jumping
              between native dashboards.
            </p>
          </div>
          <div className="mt-12">
            <BrowserFrame className="mx-auto max-w-[900px]">
              <AppShell title="Analytics">
                <AnalyticsView />
              </AppShell>
            </BrowserFrame>
          </div>
          <p className="mt-4 text-center text-[12px] text-white/40">Example data shown for illustration.</p>
          <div className="mt-8 text-center">
            <Link href="/features/analytics" className="inline-flex items-center gap-1.5 text-[15px] font-medium text-white/80 hover:text-white">
              Explore Analytics <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </Container>
      </section>

      {/* WHY HARLO — quiet editorial break, no card, no image. */}
      <section className="w-full bg-background py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <div className="flex justify-center">
              <Eyebrow>Why Harlo</Eyebrow>
            </div>
            <h2 className="balance mt-4 text-h2 font-semibold text-foreground">
              Social management that fits the way you actually work.
            </h2>
            <p className="balance mx-auto mt-4 max-w-md text-lg text-muted">
              Harlo keeps the everyday work simple while giving you room to manage more brands, channels and
              clients as you grow.
            </p>
          </div>
        </Container>
      </section>

      {/* WHY HARLO — three restrained editorial cards. */}
      <section className="w-full bg-background pb-16 md:pb-24">
        <Container>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
            {whyHarlo.map((w) => {
              const Icon = w.icon;
              return (
                <div key={w.title} className="rounded-[10px] border border-border bg-white p-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-surface">
                    <Icon className="h-4.5 w-4.5 text-foreground" />
                  </div>
                  <h3 className="mt-5 text-h4 font-semibold text-foreground">{w.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{w.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* FAQ — editorial two-column layout. */}
      <section className="w-full bg-background py-16 md:py-24">
        <Container>
          <Faq
            items={homeFaqs}
            eyebrow="FAQ"
            title="Questions, answered."
            subtitle="Everything you need to know before getting started with Harlo."
            layout="split"
          />
        </Container>
      </section>

      {/* FINAL CTA — quiet editorial moment, no gradient banner, no card. */}
      <FinalCta
        title="Put your whole social operation in one place."
        description="Start with what you manage today. Add brands, channels and teammates as you grow."
        secondaryCtaLabel="See pricing"
        fullBleed
      />
    </>
  );
}
