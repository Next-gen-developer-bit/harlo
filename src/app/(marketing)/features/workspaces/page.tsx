import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/marketing/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import FeaturePageTemplate from "@/components/marketing/FeaturePageTemplate";
import WorkspacesView from "@/components/mockups/WorkspacesView";
import { FeaturedCard, StandardCard } from "@/components/marketing/ShowcaseCard";
import PlatformBadge from "@/components/icons/PlatformBadge";
import StatTile from "@/components/marketing/StatTile";
import { platformItems } from "@/lib/nav-data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Social Media Workspaces | Manage Multiple Brands | Harlo Social",
  description:
    "Keep every brand, business or client in its own workspace with a dedicated calendar, connected accounts and content library. Manage multiple social media accounts from one Harlo login.",
  path: "/features/workspaces",
});

const contentPlatforms = platformItems.filter((p) => p.status === "Supported").slice(0, 4);

const switcherTabs = [
  { name: "Personal Brand", active: false },
  { name: "Bloom & Co", active: false },
  { name: "Vela Studio", active: true },
  { name: "Peak Fitness", active: false },
];

function WorkspacesBenefits() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <FeaturedCard
        className="lg:col-span-2"
        title="Everything for one brand, kept together"
        description="Each workspace holds its own connected accounts, calendar, content library and analytics, so a single login never mixes up different brands or clients."
        visual={
          <div className="rounded-xl border border-border bg-white p-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C2296B] text-[12px] font-semibold text-white">V</span>
              <span className="text-[13.5px] font-medium text-foreground">Vela Studio</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {["Accounts", "Calendar", "Library", "Analytics"].map((s) => (
                <div key={s} className="rounded-lg bg-surface/70 py-3 text-center text-[11.5px] font-medium text-foreground">
                  {s}
                </div>
              ))}
            </div>
          </div>
        }
      />

      <StandardCard
        title="Separate calendars"
        description="Each workspace has its own content calendar, kept fully independent of the others."
        visual={
          <div className="grid grid-cols-2 gap-3">
            {["Vela Studio", "Peak Fitness"].map((w) => (
              <div key={w} className="rounded-lg bg-white p-2">
                <div className="mb-1.5 text-[10px] font-medium text-muted">{w}</div>
                <div className="grid grid-cols-4 gap-1">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className={`h-3 rounded-sm ${i === 2 || i === 5 ? "bg-primary/40" : "bg-surface-2"}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        }
      />
      <StandardCard
        title="Separate social accounts"
        description="Connect different accounts to each workspace so nothing gets mixed up between brands."
        visual={
          <div className="flex flex-wrap gap-2">
            {contentPlatforms.map((p) => (
              <PlatformBadge key={p.slug} slug={p.slug} size={28} rounded="rounded-lg" />
            ))}
          </div>
        }
      />
      <StandardCard
        title="Organised content"
        description="Media uploaded to a workspace's content library stays associated with that brand, ready to reuse in future posts."
        visual={
          <div className="grid grid-cols-4 gap-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-white" />
            ))}
          </div>
        }
      />
      <StandardCard
        title="Workspace analytics"
        description="View performance in the context of the workspace you're managing, so brands and clients stay separated."
        visual={
          <div className="grid grid-cols-2 gap-2">
            <StatTile label="Reach" value="86.2K" />
            <StatTile label="Engagement" value="6.1%" />
          </div>
        }
      />
    </div>
  );
}

function WorkspaceSwitcherSection() {
  return (
    <Section className="bg-surface/60">
      <div className="mx-auto max-w-lg text-center">
        <Eyebrow>Workflow</Eyebrow>
        <h2 className="balance mt-5 text-h2-page font-semibold text-foreground">Switch between brands instantly.</h2>
        <p className="balance mt-4 text-[15.5px] leading-relaxed text-muted">
          Move from one workspace to another without logging out or rebuilding your workflow.
        </p>
      </div>
      <div className="mx-auto mt-10 max-w-2xl rounded-[12px] border border-border bg-white p-6">
        <div className="flex flex-wrap justify-center gap-2">
          {switcherTabs.map((t) => (
            <span
              key={t.name}
              className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium ${
                t.active ? "bg-foreground text-white" : "border border-border text-muted"
              }`}
            >
              {t.name}
            </span>
          ))}
        </div>
        <div className="mt-5 rounded-[10px] bg-surface/70 p-4 text-center">
          <div className="text-[13.5px] font-medium text-foreground">Vela Studio</div>
          <div className="mt-1 text-[12px] text-muted">3 connected accounts · 12 posts scheduled</div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-lg text-center">
        <h3 className="text-[16px] font-semibold text-foreground">Built for multi-brand management.</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">
          Whether you manage several internal brands or multiple clients, workspaces keep everything organised.
        </p>
      </div>
    </Section>
  );
}

export default function WorkspacesPage() {
  return (
    <FeaturePageTemplate
      eyebrow="Workspaces"
      h1="A clean workspace for every brand."
      subcopy="Keep each brand or client's social accounts, calendar, content and campaigns separated without maintaining entirely different tools or logins."
      appShellTitle="Workspaces"
      mockup={<WorkspacesView />}
      intro={{
        title: "Keep client work separate.",
        copy: "Each workspace gives you a dedicated place for that brand's social accounts and content.",
      }}
      benefitsSlot={<WorkspacesBenefits />}
      afterBenefits={<WorkspaceSwitcherSection />}
      related={[
        { name: "Campaigns", href: "/campaigns", description: "Assign posts to campaigns and keep them organised." },
        { name: "Social Media Calendar", href: "/social-media-calendar", description: "See your entire content schedule in one place." },
        { name: "Analytics", href: "/features/analytics", description: "Compare performance across brands and clients." },
      ]}
      faqs={[
        { q: "How many workspaces can I have?", a: "The number of workspaces you can create depends on your plan. See the pricing page for details." },
        { q: "Can I move an account between workspaces?", a: "Yes. Social accounts can be reassigned to a different workspace at any time." },
        { q: "Does each workspace have its own analytics?", a: "Yes. Analytics are shown in the context of the workspace you're viewing, so brands and clients stay separated." },
        { q: "Can I see combined reporting across all my workspaces?", a: "Multi-workspace reporting is available on the Agency plan, for teams managing several brands or clients who need a portfolio-wide view." },
      ]}
      ctaTitle="Keep every brand organised."
      ctaCopy="Create a workspace for every brand or client you manage."
    />
  );
}
