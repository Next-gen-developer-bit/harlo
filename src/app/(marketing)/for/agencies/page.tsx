import type { Metadata } from "next";
import Section from "@/components/marketing/Section";
import FinalCta from "@/components/marketing/FinalCta";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import { BrowserFrame } from "@/components/mockups/Frames";
import { AppShell } from "@/components/mockups/AppShell";
import TeamView from "@/components/mockups/TeamView";
import WorkspacesView from "@/components/mockups/WorkspacesView";
import ComposerView from "@/components/mockups/ComposerView";
import StatusPill from "@/components/marketing/StatusPill";
import StatTile from "@/components/marketing/StatTile";
import ProductSpotlight from "@/components/marketing/ProductSpotlight";

const title = "Social Media Management for Agencies | Harlo Social";
const description =
  "Manage client social accounts, calendars, campaigns and reporting from one workspace. Harlo helps agencies stay organised as their client base grows.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/for/agencies" },
  openGraph: { title, description, url: "/for/agencies" },
  twitter: { title, description },
};

// One pipeline, four clients, four different stages — a genuine approval
// workflow (Draft → In Review → Approved → Scheduled) rather than a
// paragraph describing one. Approval workflows are real, shipped
// functionality (see /features/team-collaboration), so this reflects an
// actual product state rather than inventing one.
const approvalPipeline = [
  { client: "Bloom & Co", color: "#26262B", post: "Product launch teaser", status: "Draft" },
  { client: "Vela Studio", color: "#C2296B", post: "Weekly roundup", status: "In Review" },
  { client: "Peak Fitness", color: "#1958C7", post: "Class schedule update", status: "Approved" },
  { client: "Meridian Studio", color: "#0F9D58", post: "Studio spotlight", status: "Scheduled" },
];

const clientReports = [
  { label: "Bloom & Co · Engagement", value: "8.4%" },
  { label: "Vela Studio · Reach", value: "42.1K" },
  { label: "Peak Fitness · Followers", value: "+412" },
  { label: "Meridian Studio · Top platform", value: "Instagram" },
];

export default function AgenciesPage() {
  return (
    <>
      {/* HERO */}
      <Section className="pb-10 pt-12 text-center md:pt-16">
        <div className="flex justify-center">
          <Eyebrow>For Agencies</Eyebrow>
        </div>
        <h1 className="balance mx-auto mt-6 max-w-3xl text-h1-page font-semibold text-foreground">
          Run every client from one social workspace.
        </h1>
        <p className="balance mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-muted md:text-[18px]">
          Keep client accounts, campaigns, calendars and content organised without turning your social
          management stack into an enterprise software project.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/signup" size="lg" trackEvent="signup_started">Start free</Button>
          <Button href="/pricing" variant="secondary" size="lg">See pricing</Button>
        </div>
      </Section>

      <Section className="pt-0">
        <BrowserFrame className="mx-auto max-w-[1080px]">
          <AppShell title="Team" workspace="Meridian Studio">
            <TeamView />
          </AppShell>
        </BrowserFrame>
      </Section>

      {/* THREE PRODUCT STORIES — client organisation, approval workflow,
          reporting. Open editorial layout: no outer marketing cards, just
          text + product visual staggered left/right/left across three
          sections, each sitting directly on the white page background.
          Every accent colour lives inside the visual column only. */}

      {/* CLIENT ORGANISATION — text left, visual right. */}
      <Section className="py-16 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[5fr_7fr] lg:gap-20">
          <div className="min-w-0 text-center lg:text-left">
            <Eyebrow>Client organisation</Eyebrow>
            <h2 className="balance mt-4 text-feature font-semibold text-foreground">
              Every client in their own workspace, with agency-wide visibility.
            </h2>
            <p className="balance mx-auto mt-4 max-w-md text-lg text-muted lg:mx-0">
              Bloom &amp; Co, Vela Studio, Peak Fitness and Meridian Studio each get their own connected
              accounts, content and calendar. Your team moves between them without mixing information or
              losing context.
            </p>
          </div>
          <div className="mx-auto min-w-0 w-full max-w-[740px] rounded-[12px] bg-surface p-4 md:p-5 lg:mx-0">
            <WorkspacesView />
          </div>
        </div>
      </Section>

      {/* APPROVALS — reversed: visual left, text right. DOM stays
          text-first so mobile/tablet stack in reading order; lg:order-first
          on the visual pulls it into the left column only at desktop. */}
      <Section className="py-16 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[7fr_5fr] lg:gap-20">
          <div className="min-w-0 text-center lg:order-last lg:text-left">
            <Eyebrow>Approvals</Eyebrow>
            <h2 className="balance mt-4 text-feature font-semibold text-foreground">
              Content moves through review before it goes live.
            </h2>
            <p className="balance mx-auto mt-4 max-w-md text-lg text-muted lg:mx-0">
              See exactly where each client&apos;s content sits, from first draft to approved and scheduled,
              so nothing publishes before it&apos;s ready.
            </p>
          </div>
          <div className="mx-auto min-w-0 w-full max-w-[740px] rounded-[12px] bg-surface p-4 md:p-5 lg:order-first lg:mx-0">
            <div className="space-y-2">
              {approvalPipeline.map((row) => (
                <div key={row.client} className="flex items-center gap-3 rounded-xl bg-white px-3.5 py-2.5">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                    style={{ backgroundColor: row.color }}
                  >
                    {row.client.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12.5px] font-medium text-foreground">{row.post}</div>
                    <div className="truncate text-[11px] text-muted">{row.client}</div>
                  </div>
                  <StatusPill status={row.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* REPORTING — back to text left, visual right. */}
      <Section className="py-16 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[5fr_7fr] lg:gap-20">
          <div className="min-w-0 text-center lg:text-left">
            <Eyebrow>Reporting</Eyebrow>
            <h2 className="balance mt-4 text-feature font-semibold text-foreground">
              Understand performance client by client.
            </h2>
            <p className="balance mx-auto mt-4 max-w-md text-lg text-muted lg:mx-0">
              See engagement, reach and growth broken down by workspace, so you always know what to report
              back to each client.
            </p>
          </div>
          <div className="mx-auto min-w-0 w-full max-w-[740px] rounded-[12px] bg-surface p-4 md:p-5 lg:mx-0">
            <div className="grid grid-cols-2 gap-2.5">
              {clientReports.map((r) => (
                <StatTile key={r.label} label={r.label} value={r.value} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* PUBLISHING WORKFLOW — this page's one Product Spotlight (see
          ProductSpotlight.tsx). A distinct, dark, panel-based section
          reserved for this one moment: a genuinely new topic for this page
          (organisation/approvals/reporting are already covered above by
          the staggered sections) that ties create → tailor → schedule →
          publish together as one agency-wide workflow. */}
      <ProductSpotlight
        introLabel="See how it works"
        introHref="/social-media-scheduler"
        visualGradient="blue"
        benefits={[
          { title: "Create once", description: "Build your post in one place before it goes anywhere." },
          { title: "Tailor per channel", description: "Adjust content for each social channel without duplicating work." },
          { title: "Schedule with confidence", description: "Set posting times once and let your queue fill automatically." },
          { title: "Publish across clients", description: "Manage publishing for every client from one workspace." },
        ]}
        visual={
          <BrowserFrame>
            <AppShell title="New Post" workspace="Meridian Studio" compact>
              <ComposerView />
            </AppShell>
          </BrowserFrame>
        }
        cta={{ label: "Explore Publishing & Scheduling", href: "/social-media-scheduler" }}
      />

      <FinalCta
        title="Bring every client workflow into one place."
        description="Manage brands, teams, approvals and publishing from one agency workspace."
        ctaLabel="Start free"
        secondaryCtaLabel="See pricing"
      />
    </>
  );
}
