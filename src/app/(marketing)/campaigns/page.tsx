import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/marketing/Section";
import FinalCta from "@/components/marketing/FinalCta";
import Faq from "@/components/marketing/Faq";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import StatTile from "@/components/marketing/StatTile";
import StatusPill from "@/components/marketing/StatusPill";
import { StandardCard } from "@/components/marketing/ShowcaseCard";
import { BrowserFrame } from "@/components/mockups/Frames";
import { chipPalette } from "@/components/mockups/AppShell";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Social Media Campaign Management & Analytics | Harlo Social",
  description:
    "Group related social posts into campaigns, coordinate content across networks and see how each campaign performs across channels with Harlo's campaign analytics.",
  path: "/campaigns",
});

const campaignPosts: { platform: keyof typeof chipPalette; label: string; status: string }[] = [
  { platform: "instagram", label: "Launch teaser", status: "Published" },
  { platform: "linkedin", label: "Product reveal", status: "Published" },
  { platform: "tiktok", label: "Behind the scenes", status: "Scheduled" },
  { platform: "instagram", label: "Customer story", status: "Scheduled" },
  { platform: "x", label: "Final reminder", status: "Draft" },
];

const useCases = [
  { name: "Product launches", copy: "Keep teasers, announcements and follow-up posts together." },
  { name: "Promotions", copy: "Organise the content supporting a sale or seasonal campaign." },
  { name: "Events", copy: "Group promotional and reminder content around an event." },
  { name: "Ongoing content series", copy: "Keep recurring themed posts organised under one campaign." },
];

const faqs = [
  { q: "What is a campaign in Harlo?", a: "A campaign groups related social posts together, so content for a launch, promotion or ongoing series stays organised instead of scattered across your calendar." },
  { q: "Can I assign multiple posts to a campaign?", a: "Yes. You can assign as many related posts as you need to a single campaign." },
  { q: "Can campaigns include posts from multiple social platforms?", a: "Yes. A campaign can include posts across every platform you're publishing to." },
  { q: "Can I see scheduled and published posts inside a campaign?", a: "Yes. A campaign shows the status of every assigned post, including drafts, scheduled posts and published content." },
  { q: "Can I edit which campaign a post belongs to?", a: "Yes. You can reassign a post to a different campaign at any time." },
  { q: "Are campaigns separate between workspaces?", a: "Yes. Campaigns belong to the workspace they were created in, so different brands and clients stay organised separately." },
  { q: "Can I see how a campaign is performing, not just which posts are scheduled?", a: "Yes. Campaigns bring together reach, engagement and top-performing content across every post assigned to them, so you can see how the campaign is doing as a whole. Campaign analytics depth varies by plan." },
];

export default function CampaignsPage() {
  return (
    <>
      <Section className="pb-10 pt-12 text-center md:pt-16">
        <div className="flex justify-center">
          <Eyebrow>Campaigns</Eyebrow>
        </div>
        <h1 className="balance mx-auto mt-6 max-w-2xl text-h1-page font-semibold text-foreground">
          Keep every campaign together.
        </h1>
        <p className="balance mx-auto mt-5 max-w-md text-[16px] leading-relaxed text-muted md:text-[18px]">
          Group related posts and content into campaigns so you can organise what is being published, where it
          is going and how it performs.
        </p>
        <div className="mt-8 flex justify-center">
          <Button href="/signup" size="lg" trackEvent="signup_started">Start free</Button>
        </div>
      </Section>

      <Section className="pt-0">
        <div className="mx-auto max-w-[640px]">
          <BrowserFrame>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11.5px] text-muted">Campaign</div>
                  <div className="text-[18px] font-semibold text-foreground">Summer Drop</div>
                </div>
                <div className="text-right text-[12px] text-muted">Jun 3 – Jun 21</div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2.5">
                <StatTile label="Posts" value="12" />
                <StatTile label="Scheduled" value="6" />
                <StatTile label="Published" value="3" />
              </div>
              <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                <StatTile label="Reach" value="96.4K" />
                <StatTile label="Engagement" value="7.8%" />
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {(["instagram", "linkedin", "tiktok", "x"] as const).map((slug) => {
                  const c = chipPalette[slug];
                  const Icon = c.Icon;
                  return (
                    <span key={slug} className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: c.bg }}>
                      <Icon className="h-3.5 w-auto" style={{ color: c.fg }} />
                    </span>
                  );
                })}
              </div>
            </div>
          </BrowserFrame>
        </div>
        <p className="mt-6 text-center text-[12.5px] text-muted">Example data shown for illustration.</p>
      </Section>

      {/* GIVE EVERY POST A PURPOSE */}
      <Section className="bg-surface/60">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-h2-page font-semibold text-foreground">See the whole campaign.</h2>
          <p className="balance mt-4 text-[15.5px] leading-relaxed text-muted">
            A campaign is rarely one post. Keep launch announcements, reminders, supporting content and
            follow-ups grouped together so you can see how everything fits.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-lg rounded-[12px] border border-border bg-white p-3">
          <div className="mb-2 px-3 pt-2 text-[12px] font-medium text-muted">Summer Drop</div>
          <div className="space-y-1.5">
            {campaignPosts.map((p) => {
              const c = chipPalette[p.platform];
              const Icon = c.Icon;
              return (
                <div key={p.label} className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-surface/60">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: c.bg }}>
                      <Icon className="h-3.5 w-auto" style={{ color: c.fg }} />
                    </span>
                    <span className="text-[13px] font-medium text-foreground">{p.label}</span>
                  </div>
                  <StatusPill status={p.status} />
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ASSIGN WHILE PLANNING + CALENDAR CONTEXT */}
      <Section>
        <div className="grid gap-5 lg:grid-cols-2">
          <StandardCard
            title="Assign posts to campaigns as you plan"
            description="Associate a post with a campaign as part of your normal planning workflow, right from the composer."
            visual={
              <div className="rounded-xl border border-border bg-white p-3">
                <div className="h-8 rounded-lg bg-surface-2" />
                <div className="mt-2 flex items-center justify-between rounded-lg bg-surface/70 px-2.5 py-2">
                  <span className="text-[11px] text-muted">Campaign</span>
                  <span className="rounded-full bg-pastel-yellow px-2 py-0.5 text-[11px] font-medium text-[#9A7B0A]">Summer Drop</span>
                </div>
              </div>
            }
          />
          <StandardCard
            title="See the campaign, not just the individual posts"
            description="Campaign labels appear alongside your posts in the calendar, so you can see which content belongs together at a glance."
            visual={
              <div className="grid grid-cols-3 gap-1.5">
                {["Mon", "Tue", "Wed"].map((d, i) => (
                  <div key={d} className="rounded-lg bg-white p-1.5">
                    <div className="text-[9.5px] text-muted">{d}</div>
                    {i !== 1 && (
                      <div className="mt-1 rounded bg-pastel-yellow px-1 py-0.5 text-[8.5px] font-medium text-[#9A7B0A]">
                        Summer Drop
                      </div>
                    )}
                  </div>
                ))}
              </div>
            }
          />
        </div>
      </Section>

      {/* USE CASES */}
      <Section className="bg-surface/60">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-h3 font-semibold text-foreground">Stay organised across channels.</h2>
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((u) => (
            <div key={u.name} className="rounded-[10px] border border-border-dark bg-white p-5">
              <span className="inline-flex rounded-full bg-pastel-yellow px-2.5 py-1 text-[11px] font-medium text-[#9A7B0A]">
                {u.name}
              </span>
              <p className="mt-3 text-[13px] leading-relaxed text-muted">{u.copy}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CAMPAIGN PERFORMANCE */}
      <Section>
        <div className="mx-auto max-w-xl text-center">
          <Eyebrow>Performance</Eyebrow>
          <h2 className="balance mt-5 text-h2-page font-semibold text-foreground">
            Measure campaigns, not just individual posts.
          </h2>
          <p className="balance mt-4 text-[15.5px] leading-relaxed text-muted">
            Grouping related content together creates a clearer view of performance. See how a campaign is
            doing across channels and over time, not just whether each post went out on schedule.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl rounded-[12px] border border-border bg-white p-6 md:p-7">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11.5px] text-muted">Campaign</div>
              <div className="text-[17px] font-semibold text-foreground">Summer Drop</div>
            </div>
            <div className="text-right text-[12px] text-muted">Jun 3 – Jun 21</div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <StatTile label="Connected posts" value="12" />
            <StatTile label="Reach" value="96.4K" />
            <StatTile label="Engagement" value="7.8%" />
            <StatTile label="vs previous" value="+14.2%" />
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-surface/70 px-4 py-3">
            <span className="text-[12px] font-medium text-foreground">Top-performing content</span>
            <span className="flex items-center gap-1.5">
              {(["instagram", "linkedin", "tiktok"] as const).map((slug) => {
                const c = chipPalette[slug];
                const Icon = c.Icon;
                return (
                  <span key={slug} className="flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: c.bg }}>
                    <Icon className="h-3 w-auto" style={{ color: c.fg }} />
                  </span>
                );
              })}
            </span>
          </div>
        </div>
        <p className="mt-4 text-center text-[12px] text-muted">Example data shown for illustration.</p>
        <div className="mt-6 text-center">
          <Link href="/features/analytics" className="text-[15px] font-medium text-primary">
            Explore Analytics
          </Link>
        </div>
      </Section>

      <Section>
        <Faq items={faqs} title="Campaigns FAQs" />
      </Section>

      <Section className="bg-surface/60">
        <h2 className="mb-8 text-[20px] font-semibold tracking-tight text-foreground">Related features</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/social-media-calendar" className="surface-card rounded-[10px] bg-white p-5">
            <div className="text-[14.5px] font-semibold text-foreground">Social Media Calendar</div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">See campaign posts in context with everything else scheduled.</p>
          </Link>
          <Link href="/features/workspaces" className="surface-card rounded-[10px] bg-white p-5">
            <div className="text-[14.5px] font-semibold text-foreground">Workspaces</div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">Keep campaigns organised separately for each brand or client.</p>
          </Link>
          <Link href="/features/analytics" className="surface-card rounded-[10px] bg-white p-5">
            <div className="text-[14.5px] font-semibold text-foreground">Analytics</div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">See how the posts in your campaign are performing.</p>
          </Link>
        </div>
      </Section>

      <FinalCta
        title="Plan your next campaign with everything in one place."
        description="Start free today and keep your campaigns organised from the beginning."
      />
    </>
  );
}
