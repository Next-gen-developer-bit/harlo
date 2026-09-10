import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/marketing/Section";
import FeatureRow from "@/components/marketing/FeatureRow";
import FinalCta from "@/components/marketing/FinalCta";
import Faq from "@/components/marketing/Faq";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import { BrowserFrame } from "@/components/mockups/Frames";
import { AppShell } from "@/components/mockups/AppShell";
import ComposerView from "@/components/mockups/ComposerView";
import CalendarView from "@/components/mockups/CalendarView";
import QueueView from "@/components/mockups/QueueView";
import ContentLibraryView from "@/components/mockups/ContentLibraryView";
import WorkspacesView from "@/components/mockups/WorkspacesView";
import AnalyticsView from "@/components/mockups/AnalyticsView";
import StatTile from "@/components/marketing/StatTile";
import PlatformBadge from "@/components/icons/PlatformBadge";
import JsonLd from "@/components/seo/JsonLd";
import { siteUrl } from "@/lib/site";
import { platformItems } from "@/lib/nav-data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Social Media Scheduler | Schedule Posts with Harlo",
  description:
    "Plan, create and schedule social media posts across multiple platforms with Harlo. Manage your content, queues, calendar and publishing from one simple workspace.",
  path: "/social-media-scheduler",
});

const supportedPlatforms = platformItems.filter((p) => p.status === "Supported");

const publishingStates = [
  { name: "Scheduled", color: "#94A3B8", copy: "Waiting for its scheduled publishing time." },
  { name: "Publishing", color: "#3D5AFE", copy: "Currently being sent to the selected social platform." },
  { name: "Published", color: "#16A34A", copy: "Successfully published." },
  { name: "Needs Attention", color: "#DC2626", copy: "Something prevented the post from publishing successfully." },
];

const faqs = [
  { q: "Which social networks can I schedule with Harlo?", a: "Instagram, Facebook, LinkedIn, TikTok, YouTube, Threads, Pinterest and X are supported today, with more platforms on the way." },
  { q: "Can I schedule one post across multiple social platforms?", a: "Yes. Choose the connected accounts you want to publish to and schedule the same post across every platform from one composer." },
  { q: "Can I customise content for each social network?", a: "Yes. You can adjust captions, media and supported settings for individual platforms before scheduling, without changing what goes out everywhere else." },
  { q: "Can I create a regular posting schedule?", a: "Yes. Set your regular posting times once in your queue, and new content automatically fills the next available slot." },
  { q: "Can I save posts without scheduling them?", a: "Yes. Save any post as a draft and come back to finish and schedule it whenever it's ready." },
  { q: "Can I manage multiple brands or businesses?", a: "Yes. Create a separate workspace for each brand, business or client, each with its own connected accounts and calendar." },
  { q: "Can I organise posts into campaigns?", a: "Yes. Assign posts to a campaign to keep related content grouped together and easier to review." },
  { q: "What happens if a post fails to publish?", a: "Harlo shows the status of every scheduled post, including Scheduled, Publishing, Published and Needs Attention, so you can quickly see if something requires action." },
  { q: "Can I see upcoming posts in a calendar?", a: "Yes. Every scheduled, drafted and published post appears on your content calendar, so you always know what's going out and when." },
  { q: "Does Harlo include analytics?", a: "Yes. Harlo currently provides analytics and reporting, so you can see performance metrics for your published content." },
  { q: "Do I need a credit card to start?", a: "No. You can start on the Free plan without entering payment details." },
];

export default function SocialMediaSchedulerPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Harlo",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${siteUrl}/social-media-scheduler`,
    description:
      "Harlo is a social media scheduler that lets you plan, create and schedule posts across multiple connected social accounts from one workspace.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <JsonLd data={schema} />

      {/* 1. HERO — editorial split rather than a centred hero + centred
          frame stacked underneath: copy and platform indicators on the
          left, the composer itself large on the right, with one small
          real-information card overlapping the frame's edge. */}
      <Section className="pb-10 pt-12 md:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div className="min-w-0 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <Eyebrow>Social Media Scheduler</Eyebrow>
            </div>
            <h1 className="balance mt-4 text-h1-page font-semibold text-foreground">
              Plan, schedule and publish from one place.
            </h1>
            <p className="balance mx-auto mt-5 max-w-md text-[16px] leading-relaxed text-muted md:text-[18px] lg:mx-0">
              Create content once, tailor it for each channel and schedule posts across your connected social
              accounts from one simple workspace.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-1.5 lg:justify-start">
              {supportedPlatforms.slice(0, 6).map((p) => (
                <PlatformBadge key={p.slug} slug={p.slug} size={30} rounded="rounded-[9px]" />
              ))}
            </div>
            <div className="mt-7 flex justify-center lg:justify-start">
              <Button href="/signup" size="lg" trackEvent="signup_started">Start free</Button>
            </div>
            <p className="mt-4 text-[13.5px] text-muted">Start free. No credit card required.</p>
          </div>

          <div className="relative min-w-0">
            <BrowserFrame>
              <AppShell title="New Post">
                <ComposerView />
              </AppShell>
            </BrowserFrame>
            <div className="animate-float absolute -bottom-5 -left-5 hidden w-[180px] rounded-[10px] border border-border-dark bg-white p-3 shadow-[0_20px_40px_-20px_rgba(20,20,40,0.25)] sm:block">
              <div className="text-[11px] text-muted">Scheduled for</div>
              <div className="mt-1 text-[12.5px] font-medium text-foreground">Fri, 6:00 PM · 4 channels</div>
            </div>
          </div>
        </div>
      </Section>

      {/* 2. SUPPORTED NETWORKS */}
      <Section className="bg-surface/60">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-h2-page font-semibold text-foreground">Publish where your audience already is</h2>
          <p className="balance mt-4 text-[15.5px] leading-relaxed text-muted">
            Connect your social accounts to Harlo and manage your publishing from one place.
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {supportedPlatforms.map((p) => (
            <Link key={p.slug} href={p.href} className="surface-card flex items-center gap-3 rounded-[10px] p-4">
              <PlatformBadge slug={p.slug} size={40} rounded="rounded-[10px]" />
              <div className="min-w-0">
                <div className="text-[14px] font-medium text-foreground">{p.name}</div>
                <span className="text-[11px] font-medium text-primary">Supported</span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* 3. MULTI-PLATFORM PUBLISHING */}
      <Section>
        <FeatureRow
          title="Schedule across multiple social accounts at once"
          description="Choose the accounts you want to publish to, create your content once and schedule it across multiple platforms without opening each social network separately."
          bullets={["Select multiple connected accounts", "Schedule from one composer", "Manage publishing from one place"]}
          visual={
            <BrowserFrame>
              <AppShell title="New Post">
                <ComposerView />
              </AppShell>
            </BrowserFrame>
          }
        />
      </Section>

      {/* 4. POST CREATION AND CUSTOMISATION */}
      <Section className="bg-surface/60">
        <FeatureRow
          reverse
          title="One workflow for every channel."
          description="Create your post once, then tailor the copy and content for each selected network."
          bullets={[
            "Post Composer: create a post, add media and choose where it should be published",
            "Platform-Specific Editing: adjust supported content and post settings for individual platforms without changing every version",
            "Drafts: save unfinished content and return to it when it is ready",
          ]}
          visual={
            <BrowserFrame>
              <AppShell title="New Post">
                <ComposerView />
              </AppShell>
            </BrowserFrame>
          }
        />
      </Section>

      {/* 5. SCHEDULING AND QUEUES */}
      <Section>
        <FeatureRow
          title="Build a schedule once."
          description="Create recurring posting slots and let new content fill the next available time automatically."
          bullets={[
            "Schedule Posts: choose the date and time content should be published",
            "Queue Scheduling: create regular publishing times and add new posts to the next available slot",
          ]}
          ctaLabel="Explore Queue Scheduling"
          ctaHref="/features/queue-scheduling"
          visual={
            <BrowserFrame className="mx-auto max-w-[520px]">
              <AppShell title="Queue">
                <QueueView />
              </AppShell>
            </BrowserFrame>
          }
        />
      </Section>

      {/* 6. CONTENT CALENDAR */}
      <Section className="bg-surface/60">
        <FeatureRow
          reverse
          title="See what is going out and when."
          description="View upcoming content across every connected channel from one calendar. Move posts, fill gaps and keep your schedule balanced."
          bullets={["Upcoming posts", "Drafts", "Published content", "Connected accounts"]}
          ctaLabel="Explore Content Calendar"
          ctaHref="/social-media-calendar"
          visual={
            <BrowserFrame>
              <AppShell title="Calendar">
                <CalendarView />
              </AppShell>
            </BrowserFrame>
          }
        />
      </Section>

      {/* 7. CONTENT LIBRARY */}
      <Section>
        <FeatureRow
          title="Keep reusable content within reach"
          description="Keep your social media assets organised so they're easy to find when building new posts."
          bullets={["Images", "Videos", "Reusable media"]}
          ctaLabel="Explore the Content Library"
          ctaHref="/features/content-library"
          visual={
            <BrowserFrame>
              <AppShell title="Content Library">
                <ContentLibraryView />
              </AppShell>
            </BrowserFrame>
          }
        />
      </Section>

      {/* 8. WORKSPACES AND CAMPAIGN ORGANISATION */}
      <Section className="bg-surface/60">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-h2-page font-semibold text-foreground">Keep brands, accounts and campaigns organised</h2>
          <p className="balance mt-4 text-[15.5px] leading-relaxed text-muted">
            Separate different brands, businesses or clients into workspaces and group related posts into
            campaigns.
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-5 lg:grid-cols-2">
          <div className="min-w-0 rounded-[12px] border border-border bg-white p-8">
            <h3 className="text-[18px] font-semibold text-foreground">Workspaces</h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted">
              Separate different social accounts and content into organised environments.
            </p>
            <div className="mt-6">
              <WorkspacesView />
            </div>
            <Link href="/features/workspaces" className="mt-6 inline-block text-[14.5px] font-medium text-primary">
              Explore Workspaces
            </Link>
          </div>
          <div className="min-w-0 rounded-[12px] border border-border bg-white p-8">
            <h3 className="text-[18px] font-semibold text-foreground">Campaigns</h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted">
              Group related posts together and assign content to campaigns.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <StatTile label="Campaign" value="Summer Drop" />
              <StatTile label="Posts assigned" value="24" />
              <StatTile label="Start date" value="Jun 3" />
              <StatTile label="End date" value="Jun 21" />
            </div>
            <Link href="/campaigns" className="mt-6 inline-block text-[14.5px] font-medium text-primary">
              Explore Campaigns
            </Link>
          </div>
        </div>
      </Section>

      {/* 9. PUBLISHING STATUS AND RELIABILITY */}
      <Section id="publishing-status" className="scroll-mt-24">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-h2-page font-semibold text-foreground">Know what happened to every post</h2>
          <p className="balance mt-4 text-[15.5px] leading-relaxed text-muted">
            See the publishing status of your content and quickly identify anything that needs attention.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-4xl">
          <BrowserFrame>
            <AppShell title="Publishing status">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {publishingStates.map((s) => (
                  <div key={s.name} className="rounded-[10px] border border-border p-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-[13.5px] font-medium text-foreground">{s.name}</span>
                    </div>
                    <p className="mt-2 text-[12px] leading-relaxed text-muted">{s.copy}</p>
                  </div>
                ))}
              </div>
            </AppShell>
          </BrowserFrame>
        </div>
      </Section>

      {/* 10. BASIC ANALYTICS AND REPORTING — a light teaser, not a second
          dark section: the one flagship dark showcase lives on the
          dedicated Analytics page (/features/analytics) this links to. */}
      <Section className="bg-surface/60">
        <div className="mx-auto max-w-xl text-center">
          <Eyebrow>Analytics</Eyebrow>
          <h2 className="balance mt-5 text-h2-page font-semibold text-foreground">See how your published content performed</h2>
          <p className="balance mt-4 text-[15.5px] leading-relaxed text-muted">
            Review essential social media metrics and get a straightforward view of how your published content
            is performing.
          </p>
        </div>
        <div className="relative mt-10">
          <BrowserFrame className="mx-auto max-w-[1080px]">
            <AppShell title="Analytics">
              <AnalyticsView />
            </AppShell>
          </BrowserFrame>
        </div>
        <div className="mt-10 text-center">
          <Link href="/features/analytics" className="text-[15px] font-medium text-primary">
            Explore Analytics
          </Link>
        </div>
      </Section>

      {/* 11. FAQ */}
      <Section>
        <Faq items={faqs} title="Social media scheduler FAQs" />
      </Section>

      {/* 12. FINAL CTA */}
      <FinalCta
        title="Take the manual work out of scheduling."
        description="Create, customise and schedule your social content across multiple platforms from one organised workspace."
        microcopy="Start free. No credit card required."
      />
    </>
  );
}
