import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/marketing/Section";
import FinalCta from "@/components/marketing/FinalCta";
import Faq from "@/components/marketing/Faq";
import Eyebrow from "@/components/ui/Eyebrow";
import Container from "@/components/ui/Container";
import { BrowserFrame } from "@/components/mockups/Frames";
import { AppShell, chipPalette } from "@/components/mockups/AppShell";
import AnalyticsView from "@/components/mockups/AnalyticsView";
import { HorizontalCard } from "@/components/marketing/ShowcaseCard";
import StatTile from "@/components/marketing/StatTile";

// Shared local layout + typography for the four Engagement/Audience/Content/
// Platforms "story" sections only, so they read as one consistent sequence.
// These are scoped classes applied directly at each call site — NOT global
// typography tokens. Nothing here touches globals.css or any other page.
// fr-based ratio (420:640) rather than fixed px tracks, so the grid still
// fits the container between 1024px (the lg breakpoint) and 1160px, only
// reaching literal 420/640 at the full max-width; storyText/storyVisual
// each cap their own max-width so neither ever grows past that target.
const storyGrid = "mx-auto grid max-w-[1160px] items-center gap-x-20 gap-y-8 lg:grid-cols-[0.656fr_1fr]";
const storyGridReversed = "mx-auto grid max-w-[1160px] items-center gap-x-20 gap-y-8 lg:grid-cols-[1fr_0.656fr]";
const storyText = "mx-auto min-w-0 max-w-[420px] text-center lg:mx-0 lg:text-left";
const storyHeading = "mt-3.5 text-[clamp(1.75rem,1.65rem+0.25vw,2rem)] font-semibold leading-[1.15] text-foreground";
const storyBody = "mt-3 text-[clamp(0.9375rem,0.92rem+0.08vw,1.0625rem)] leading-[1.6] text-muted";
const storyVisual = "mx-auto flex h-[240px] w-full max-w-[640px] flex-col justify-center rounded-[10px] bg-surface/70 p-5 lg:mx-0";

const title = "Social Media Analytics & Performance Tracking | Harlo Social";
const description =
  "Track engagement, reach and follower growth across your connected social accounts, compare platforms and campaigns, and see which content is working with Harlo's social media analytics.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/features/analytics" },
  openGraph: { title, description, url: "/features/analytics", images: ["/opengraph-image.png"] },
  twitter: { title, description, card: "summary_large_image", images: ["/twitter-image.png"] },
};

const trendStats: { label: string; value: string; delta: string; up: boolean }[] = [
  { label: "Engagement", value: "42.8K", delta: "+18.4%", up: true },
  { label: "Reach", value: "384K", delta: "-3.1%", up: false },
  { label: "Follower growth", value: "+1,284", delta: "+7.2%", up: true },
];

const engagementBars = [38, 55, 46, 70, 58, 82, 64];

const followerGrowth = [
  { platform: "instagram" as const, delta: "+124" },
  { platform: "linkedin" as const, delta: "+38" },
];

const formatPerformance = [
  { label: "Video", value: 6.8 },
  { label: "Carousel", value: 5.1 },
  { label: "Image", value: 2.9 },
];

const platformComparison: { platform: keyof typeof chipPalette; name: string; posts: string; reach: string; engagement: string; rate: string; growth: string }[] = [
  { platform: "instagram", name: "Instagram", posts: "24", reach: "128.4K", engagement: "8.4K", rate: "6.5%", growth: "+214" },
  { platform: "tiktok", name: "TikTok", posts: "12", reach: "96.2K", engagement: "11.6K", rate: "12.1%", growth: "+340" },
  { platform: "linkedin", name: "LinkedIn", posts: "9", reach: "42.1K", engagement: "2.9K", rate: "6.9%", growth: "+58" },
  { platform: "facebook", name: "Facebook", posts: "16", reach: "58.3K", engagement: "3.1K", rate: "5.3%", growth: "+96" },
];

const topPosts: { platform: keyof typeof chipPalette; label: string; date: string; reach: string; rate: string; top?: boolean }[] = [
  { platform: "instagram", label: "Summer collection reel", date: "Jun 14", reach: "84.2K", rate: "8.4%", top: true },
  { platform: "linkedin", label: "Q3 product update", date: "Jun 9", reach: "128.4K", rate: "6.1%" },
  { platform: "tiktok", label: "Behind the scenes clip", date: "Jun 3", reach: "51.9K", rate: "6.1%" },
];

const reportStats = [
  { label: "Posts published", value: "24" },
  { label: "Reach", value: "384K" },
  { label: "Engagement rate", value: "8.4%" },
  { label: "Follower change", value: "+1,284" },
];

const faqs = [
  { q: "What analytics can I see in Harlo?", a: "Account overview, post-level performance, reach, impressions, engagement, engagement rate and follower growth across your connected accounts, plus platform comparison and period-over-period trends." },
  { q: "Can I compare performance across different social platforms?", a: "Yes. Platform comparison brings your connected accounts into one view, so you don't need to check each network's own dashboard separately." },
  { q: "Can I see how a campaign is performing, not just individual posts?", a: "Yes. Grouping posts into a campaign gives you a combined view of reach, engagement and top-performing content for that campaign. Campaign analytics depth varies by plan." },
  { q: "Can I compare the current period with a previous one?", a: "Yes. Harlo shows how metrics like engagement, reach and follower growth have changed compared with a previous period, not just the raw totals." },
  { q: "How far back does my analytics history go?", a: "This depends on your plan, from 30 days on Free up to 24 months and beyond on Agency. See the pricing page for exact history by plan." },
  { q: "Does every social platform provide the same metrics?", a: "No. Available metrics vary by social network and account type, based on what each platform's API exposes. For example, saves and clicks aren't available everywhere." },
  { q: "Can I export or share performance data?", a: "Reporting exports are available on Pro and Agency plans. Broader reporting options are an active area of development." },
  { q: "Can I view analytics by workspace?", a: "Yes. Analytics are shown in the context of the workspace you're viewing, so different brands and clients stay separated." },
];

function TrendArrow({ up }: { up: boolean }) {
  return (
    <span aria-hidden="true" className="shrink-0 text-[11px] leading-none">
      {up ? "↑" : "↓"}
    </span>
  );
}

export default function AnalyticsPage() {
  return (
    <>
      {/* FLAGSHIP DARK SHOWCASE — the one strong dark section on the site.
          Near-black bg, white heading, muted-grey body, a restrained green
          accent (see AnalyticsView). No section numbering, no grid overlay,
          no CTA between the copy and the interface — heading, description,
          then the product visual directly. */}
      <section className="relative overflow-hidden bg-[var(--dark-bg)] pb-14 pt-12 md:pt-16">
        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="balance mx-auto mt-4 max-w-2xl text-h1-page font-semibold text-white">
              Performance you can actually read.
            </h1>
            <p className="balance mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-white/60 md:text-[18px]">
              Understand engagement, reach, growth and content performance across your connected social
              accounts without digging through separate native dashboards.
            </p>
          </div>

          <div className="mt-12">
            <BrowserFrame className="mx-auto max-w-[1250px]">
              <AppShell title="Analytics">
                <AnalyticsView />
              </AppShell>
            </BrowserFrame>
          </div>
          <p className="mt-4 text-center text-[12px] text-white/40">Example data shown for illustration.</p>

          <div className="mx-auto mt-10 grid max-w-md grid-cols-2 gap-3">
            {trendStats.slice(0, 2).map((s) => (
              <div key={s.label} className="rounded-[10px] border border-white/10 bg-white/5 p-4">
                <div className="text-[11.5px] text-white/50">{s.label}</div>
                <div className="mt-1.5 text-[20px] font-semibold tracking-tight text-white">{s.value}</div>
                <div className="mt-1.5 flex items-center gap-1 text-[12px] font-medium text-[#4ADE80]">
                  <TrendArrow up={s.up} />
                  {s.delta}
                  <span className="font-normal text-white/40">vs previous period</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ENGAGEMENT — text left, visual right. No outer marketing card:
          the chart's own surface (bg-surface/70) is the only visible
          container, matching the "actual product UI, not a card" rule. */}
      <Section className="bg-surface/60 py-10 md:py-10">
        <div className={storyGrid}>
          <div className={storyText}>
            <Eyebrow>Engagement</Eyebrow>
            <h2 className={storyHeading}>See how far your content travels</h2>
            <p className={storyBody}>
              Review engagement, reach and available platform metrics to understand how people are responding
              to your published content.
            </p>
          </div>
          <div className={storyVisual}>
            <div className="flex flex-1 items-end gap-2 pt-4">
              {engagementBars.map((h, i) => (
                <div key={i} className="flex-1 rounded-t bg-primary/20" style={{ height: `${h}%` }}>
                  <div className="h-1.5 rounded-t bg-primary" style={{ opacity: i === 5 ? 1 : 0.5 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* AUDIENCE — reversed: visual left, text right. DOM stays text-first
          for mobile/tablet stacking; lg:order-first on the visual pulls it
          left only at desktop. Visual is a sibling of Engagement's: same
          size, radius, background and padding. */}
      <Section className="py-10 md:py-10">
        <div className={storyGridReversed}>
          <div className={storyText}>
            <Eyebrow>Audience</Eyebrow>
            <h2 className={storyHeading}>Track how your audience is growing</h2>
            <p className={storyBody}>
              See how follower counts change over time across connected social accounts and understand which
              audiences are gaining momentum.
            </p>
          </div>
          <div className={`${storyVisual} lg:order-first`}>
            <svg viewBox="0 0 160 40" className="h-24 w-full" fill="none" preserveAspectRatio="none">
              <path
                d="M2 34 L30 28 L58 30 L86 18 L114 20 L142 6 L158 3"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-4 flex flex-wrap gap-2">
              {followerGrowth.map((f) => {
                const c = chipPalette[f.platform];
                const Icon = c.Icon;
                return (
                  <div key={f.platform} className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1">
                    <Icon className="h-3 w-auto" style={{ color: c.fg }} />
                    <span className="text-[11px] font-medium text-primary">{f.delta}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* CONTENT — text left, visual right (previously a large centred
          standalone section; now part of the same staggered sequence). */}
      <Section className="bg-surface/60 py-10 md:py-10">
        <div className={storyGrid}>
          <div className={storyText}>
            <Eyebrow>Content</Eyebrow>
            <h2 className={`balance ${storyHeading}`}>
              Learn from what you&apos;ve already published.
            </h2>
            <p className={`balance ${storyBody}`}>
              See which kinds of content are working, not just which individual posts did well, so you can move
              beyond vanity metrics and spot real patterns.
            </p>
          </div>
          <div className="mx-auto min-w-0 w-full max-w-[640px] rounded-[10px] border border-border bg-white p-5 lg:mx-0">
            <div className="mb-3.5 text-[13px] font-medium text-foreground">Content format performance</div>
            <div className="space-y-3">
              {formatPerformance.map((f) => (
                <div key={f.label}>
                  <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
                    <span className="font-medium text-foreground">{f.label}</span>
                    <span className="font-medium text-muted">{f.value}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(f.value / formatPerformance[0].value) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-muted">Average engagement rate by content format.</p>
          </div>
        </div>
      </Section>

      {/* PLATFORMS — visual left, text right (previously a large centred
          standalone section with a full-width table). Compacted via row/
          cell/outer padding only — all columns, rows and data unchanged,
          table cell font sizes unchanged (matches surrounding product UI). */}
      <Section className="py-10 md:py-10">
        <div className={storyGridReversed}>
          <div className={storyText}>
            <Eyebrow>Platforms</Eyebrow>
            <h2 className={`balance ${storyHeading}`}>See the bigger picture.</h2>
            <p className={`balance ${storyBody}`}>
              Compare performance across your connected channels from one place and understand where your content
              is gaining the most traction.
            </p>
          </div>
          <div className="mx-auto min-w-0 w-full max-w-[640px] lg:order-first lg:mx-0">
            <div className="overflow-x-auto rounded-[10px] border border-border bg-white">
              <table className="w-full min-w-[520px] border-separate border-spacing-0 text-left">
                <thead>
                  <tr>
                    {["Platform", "Posts", "Reach", "Engagement", "Rate", "Growth"].map((h) => (
                      <th key={h} className="border-b border-border px-2.5 py-2 text-[11.5px] font-medium text-muted first:pl-3.5 last:pr-3.5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {platformComparison.map((p) => {
                    const c = chipPalette[p.platform];
                    const Icon = c.Icon;
                    return (
                      <tr key={p.platform}>
                        <td className="border-b border-border px-2.5 py-2 pl-3.5">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: c.bg }}>
                              <Icon className="h-3 w-auto" style={{ color: c.fg }} />
                            </span>
                            <span className="text-[13px] font-medium text-foreground">{p.name}</span>
                          </div>
                        </td>
                        <td className="border-b border-border px-2.5 py-2 text-[13px] text-foreground">{p.posts}</td>
                        <td className="border-b border-border px-2.5 py-2 text-[13px] text-foreground">{p.reach}</td>
                        <td className="border-b border-border px-2.5 py-2 text-[13px] text-foreground">{p.engagement}</td>
                        <td className="border-b border-border px-2.5 py-2 text-[13px] text-foreground">{p.rate}</td>
                        <td className="border-b border-border px-2.5 py-2 pr-3.5 text-[13px] font-medium text-[#16A34A]">{p.growth}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-center text-[12px] text-muted">
              Example data shown for illustration. Available metrics vary by social network and account type.
            </p>
          </div>
        </div>
      </Section>

      {/* TOP CONTENT */}
      <Section className="bg-surface/60">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-h2-page font-semibold text-foreground">Find the posts getting the strongest response</h2>
          <p className="balance mt-4 text-[15.5px] leading-relaxed text-muted">
            Compare published posts and quickly identify the content generating stronger engagement and reach,
            so you know what's worth repeating.
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
          {topPosts.map((p) => {
            const c = chipPalette[p.platform];
            const Icon = c.Icon;
            return (
              <div key={p.label} className="rounded-[10px] border border-border bg-white p-4">
                <div className="relative h-24 rounded-xl" style={{ backgroundColor: c.bg }}>
                  {p.top && (
                    <span className="absolute right-2 top-2 rounded-full bg-foreground px-2 py-0.5 text-[9.5px] font-semibold text-white">
                      Top performer
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <Icon className="h-3.5 w-auto" style={{ color: c.fg }} />
                  <span className="text-[11.5px] text-muted">{p.date}</span>
                </div>
                <div className="mt-1 text-[13.5px] font-medium text-foreground">{p.label}</div>
                <div className="mt-2 flex gap-1.5">
                  <span className="inline-flex rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-foreground">
                    {p.reach} reach
                  </span>
                  <span className="inline-flex rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
                    {p.rate} engagement
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* CAMPAIGN PERFORMANCE */}
      <Section>
        <HorizontalCard
          label="Campaigns"
          title="Measure campaigns, not just individual posts."
          description="Group related content together and understand how a campaign performs across channels and over time."
          tint="purple"
          visual={
            <div className="rounded-xl border border-border bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] font-semibold text-foreground">Summer Drop</span>
                <span className="text-[10.5px] text-muted">Jun 3 – Jun 21</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <StatTile label="Posts" value="12" />
                <StatTile label="Reach" value="96.4K" />
                <StatTile label="Engagement" value="7.8%" />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(["instagram", "linkedin", "tiktok"] as const).map((slug) => {
                  const cc = chipPalette[slug];
                  const CIcon = cc.Icon;
                  return (
                    <span key={slug} className="flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: cc.bg }}>
                      <CIcon className="h-3 w-auto" style={{ color: cc.fg }} />
                    </span>
                  );
                })}
              </div>
            </div>
          }
        />
        <div className="mt-6 text-center">
          <Link href="/campaigns" className="text-[15px] font-medium text-primary">
            Explore Campaigns
          </Link>
        </div>
      </Section>

      {/* REPORTING */}
      <Section className="bg-surface/60">
        <HorizontalCard
          label="Reporting"
          title="Turn performance into a clearer picture"
          description="Bring publishing activity and performance metrics together so you can understand what happened across your connected social accounts. Reporting exports are available on Pro and Agency plans."
          visual={
            <div className="grid grid-cols-2 gap-2.5">
              {reportStats.map((s) => (
                <StatTile key={s.label} label={s.label} value={s.value} />
              ))}
            </div>
          }
        />
      </Section>

      {/* WORKSPACE CONTEXT */}
      <Section>
        <HorizontalCard
          label="Workspaces"
          title="Keep performance in the right context"
          description="View analytics within the workspace you're managing, so brands and clients stay separated instead of blending together."
          visual={
            <div className="flex flex-wrap justify-center gap-2">
              {["Personal Brand", "Bloom & Co"].map((w, i) => (
                <span key={w} className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium ${i === 1 ? "bg-foreground text-white" : "border border-border text-muted"}`}>
                  {w}
                </span>
              ))}
            </div>
          }
        />
        <div className="mt-6 text-center">
          <Link href="/features/workspaces" className="text-[15px] font-medium text-primary">
            Explore Workspaces
          </Link>
        </div>
      </Section>

      {/* PLATFORM AVAILABILITY */}
      <Section className="bg-surface/60">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-h3 font-semibold text-foreground">The metrics available depend on the platform</h2>
          <p className="balance mt-4 text-[15px] leading-relaxed text-muted">
            Harlo brings available performance data into one experience, while the exact metrics available
            can vary between social networks depending on what each platform's API provides.
          </p>
        </div>
      </Section>

      <Section>
        <Faq items={faqs} title="Analytics FAQs" />
      </Section>

      <Section>
        <h2 className="mb-8 text-[20px] font-semibold tracking-tight text-foreground">Related features</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/campaigns" className="surface-card rounded-[10px] p-5">
            <div className="text-[14.5px] font-semibold text-foreground">Campaigns</div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">Measure how grouped content performs together.</p>
          </Link>
          <Link href="/social-media-calendar" className="surface-card rounded-[10px] p-5">
            <div className="text-[14.5px] font-semibold text-foreground">Social Media Calendar</div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">Plan your next post based on what's working.</p>
          </Link>
          <Link href="/features/workspaces" className="surface-card rounded-[10px] p-5">
            <div className="text-[14.5px] font-semibold text-foreground">Workspaces</div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">Compare performance across brands and clients.</p>
          </Link>
          <Link href="/pricing" className="surface-card rounded-[10px] p-5">
            <div className="text-[14.5px] font-semibold text-foreground">Pricing</div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">See analytics depth and history by plan.</p>
          </Link>
        </div>
      </Section>

      <FinalCta title="See what's actually working." description="Track performance across every connected account." />
    </>
  );
}
