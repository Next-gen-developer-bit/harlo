import Link from "next/link";
import Section from "@/components/marketing/Section";
import FinalCta from "@/components/marketing/FinalCta";
import Faq from "@/components/marketing/Faq";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import PlatformBadge from "@/components/icons/PlatformBadge";
import { BrowserFrame } from "@/components/mockups/Frames";
import { AppShell } from "@/components/mockups/AppShell";
import ComposerView from "@/components/mockups/ComposerView";
import { FeaturedCard, StandardCard, HorizontalCard } from "@/components/marketing/ShowcaseCard";
import StatusPill from "@/components/marketing/StatusPill";
import AccountRequirements from "@/components/marketing/AccountRequirements";
import { platformContent, type PlatformContent } from "@/lib/platform-content";
import { platformPastel } from "@/lib/platform-colors";

const workflowSteps = [
  { name: "Create", copy: "Write your post in Harlo." },
  { name: "Customise", copy: "Adjust the platform-specific version." },
  { name: "Schedule", copy: "Choose when it should publish." },
  { name: "Publish", copy: "Harlo sends it through the platform's supported API." },
  { name: "Review", copy: "See available performance metrics once it's live." },
];

export default function PlatformPageTemplate({ data }: { data: PlatformContent }) {
  const {
    slug,
    name,
    h1,
    subcopy,
    capabilityHeading,
    capabilityCopy,
    formats,
    accountSupported,
    accountNotSupported,
    connectionMethod,
    accountNote,
    customisationHeading,
    customisationCopy,
    customisationFields,
    analyticsHeading,
    analyticsCopy,
    analyticsMetrics,
    multiAccountHeading,
    multiAccountCopy,
    exampleAccounts,
    apiNote,
    relatedSlugs,
    faqs,
    ctaTitle,
    ctaCopy,
  } = data;

  const accent = platformPastel[slug]?.fg ?? "var(--primary)";
  const accentBg = platformPastel[slug]?.bg ?? "var(--surface)";
  const related = relatedSlugs.map((s) => platformContent[s]).filter(Boolean);

  return (
    <>
      {/* HERO */}
      <Section className="pb-10 pt-12 text-center md:pt-16">
        <div className="flex justify-center">
          <PlatformBadge slug={slug} size={64} rounded="rounded-[12px]" />
        </div>
        <div className="mt-5 flex justify-center">
          <Eyebrow>{name} Scheduler</Eyebrow>
        </div>
        <h1 className="balance mx-auto mt-6 max-w-3xl text-h1-page font-semibold text-foreground">{h1}</h1>
        <p className="balance mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-muted md:text-[18px]">{subcopy}</p>
        <div className="mt-8 flex justify-center">
          <Button href="/signup" size="lg" trackEvent="signup_started">Start free</Button>
        </div>
      </Section>

      <Section className="pt-0">
        <BrowserFrame className="mx-auto max-w-[980px]">
          <AppShell title="New Post">
            <ComposerView />
          </AppShell>
        </BrowserFrame>
      </Section>

      {/* PLANNING */}
      <Section>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-h2-page font-semibold text-foreground">Plan {name} alongside the rest of your content.</h2>
          <p className="balance mt-4 text-[15.5px] leading-relaxed text-muted">
            See {name} posts in the same calendar as your other connected channels so your content strategy
            stays aligned.
          </p>
        </div>
      </Section>

      {/* ROW 1 — primary capability (large) + formats & account requirements (stacked) */}
      <Section className="bg-surface/60">
        <div className="grid gap-5 lg:grid-cols-5">
          <FeaturedCard
            className="lg:col-span-3"
            title={capabilityHeading}
            description={capabilityCopy}
            visual={
              <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: accentBg }}>
                  <PlatformBadge slug={slug} size={22} rounded="rounded-md" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="h-2.5 w-3/4 rounded bg-surface-2" />
                  <div className="mt-1.5 h-2.5 w-1/2 rounded bg-surface-2" />
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-[10.5px] text-muted">Fri, 6:00 PM</span>
                  <StatusPill status="Scheduled" />
                </div>
              </div>
            }
          />
          <StandardCard
            className="flex flex-col justify-center lg:col-span-2"
            title="Supported formats"
            description={`What you can publish to ${name} through Harlo.`}
            visual={
              <div className="flex flex-wrap gap-1.5">
                {formats.map((f) => (
                  <span key={f.title} className="rounded-full bg-white px-2.5 py-1 text-[11.5px] font-medium text-foreground">
                    {f.title}
                  </span>
                ))}
              </div>
            }
          />
        </div>
        <p className="mt-6 text-center text-[13px] leading-relaxed text-muted">{formats.map((f) => f.copy).join(" ")}</p>
      </Section>

      {/* WORKFLOW */}
      <Section>
        <div className="mx-auto flex max-w-4xl flex-wrap items-start justify-center gap-x-2 gap-y-6">
          {workflowSteps.map((s, i) => (
            <div key={s.name} className="flex items-start">
              <div className="w-[130px] text-center">
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-[12px] font-semibold text-foreground">
                  {i + 1}
                </div>
                <div className="mt-2 text-[13.5px] font-semibold text-foreground">{s.name}</div>
                <p className="mt-1 text-[12px] leading-snug text-muted">{s.copy}</p>
              </div>
              {i < workflowSteps.length - 1 && <ArrowGlyph className="mt-3.5 hidden shrink-0 sm:block" />}
            </div>
          ))}
        </div>
      </Section>

      {/* ROW 2 — platform-specific customisation */}
      <Section className="bg-surface/60">
        <HorizontalCard
          label="Customisation"
          title={customisationHeading}
          description={customisationCopy}
          visual={
            <div className="flex items-center gap-2.5">
              <div className="flex-1 rounded-lg border border-dashed border-border bg-white p-2.5 text-center text-[11px] text-muted">
                Original post
              </div>
              <ArrowGlyph className="shrink-0" />
              <div className="flex-1 rounded-lg bg-white p-2.5" style={{ boxShadow: `inset 0 0 0 1.5px ${accent}` }}>
                <div className="flex flex-wrap gap-1">
                  {customisationFields.map((f) => (
                    <span key={f} className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: accentBg, color: accent }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          }
        />
      </Section>

      {/* SCHEDULING */}
      <Section>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-h2-page font-semibold text-foreground">Schedule content ahead of time.</h2>
          <p className="balance mt-4 text-[15.5px] leading-relaxed text-muted">
            Choose when your {name} content should publish and keep upcoming posts visible in your Harlo
            calendar.
          </p>
        </div>
      </Section>

      {/* ROW 3 — analytics */}
      <Section>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-h2-page font-semibold text-foreground">{analyticsHeading}</h2>
          <p className="balance mt-4 text-[15.5px] leading-relaxed text-muted">{analyticsCopy}</p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl">
          <div className="rounded-[12px] border border-border bg-white p-6">
            <div className={`grid gap-3 ${analyticsMetrics.length >= 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}>
              {analyticsMetrics.map((m) => (
                <div key={m.label} className="rounded-[10px] bg-surface/70 p-3.5 text-center">
                  <div className="text-[11px] text-muted">{m.label}</div>
                  <div className="mt-1 text-[17px] font-semibold tracking-tight text-foreground">{m.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex h-14 items-end gap-2 rounded-[10px] bg-surface/70 p-3.5 pt-6">
              {[38, 55, 46, 70, 58, 82, 64].map((h, i) => (
                <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, backgroundColor: accentBg }}>
                  <div className="h-1.5 rounded-t" style={{ backgroundColor: accent, opacity: i === 5 ? 1 : 0.6 }} />
                </div>
              ))}
            </div>
          </div>
          <p className="mt-4 text-center text-[12px] text-muted">Example data shown for illustration.</p>
        </div>
      </Section>

      {/* ACCOUNT REQUIREMENTS */}
      <Section className="bg-surface/60">
        <div className="mx-auto max-w-3xl">
          <AccountRequirements
            platformName={name}
            supported={accountSupported}
            notSupported={accountNotSupported}
            connectionMethod={connectionMethod}
            note={accountNote}
          />
        </div>
      </Section>

      {/* ROW 4 — multi-account / workspaces */}
      <Section>
        <HorizontalCard
          label="Workspaces"
          title={multiAccountHeading}
          description={multiAccountCopy}
          visual={
            <div className="space-y-2">
              {exampleAccounts.map((a) => (
                <div key={a} className="flex items-center gap-2.5 rounded-lg bg-white px-3 py-2">
                  <PlatformBadge slug={slug} size={20} rounded="rounded-md" />
                  <span className="text-[12.5px] font-medium text-foreground">{a}</span>
                </div>
              ))}
            </div>
          }
        />
      </Section>

      {/* ROW 5 — API transparency */}
      <Section className="bg-surface/60">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-h3 font-semibold text-foreground">Built around official platform APIs</h2>
          <p className="balance mt-4 text-[15px] leading-relaxed text-muted">
            Harlo publishes through the supported APIs provided by each social network. Available account
            types, post formats and analytics can vary depending on the platform.
          </p>
          {apiNote && <p className="balance mt-3 text-[13.5px] leading-relaxed text-muted">{apiNote}</p>}
        </div>
      </Section>

      <Section>
        <Faq items={faqs} title={`${name} FAQs`} />
      </Section>

      {/* RELATED PLATFORMS */}
      <Section className="bg-surface/60">
        <h2 className="mb-8 text-[20px] font-semibold tracking-tight text-foreground">Schedule content across more than one platform</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((r) => (
            <Link key={r.slug} href={r.path} className="surface-card flex items-center gap-3 rounded-[10px] p-4">
              <PlatformBadge slug={r.slug} size={32} rounded="rounded-lg" />
              <span className="text-[13.5px] font-medium text-foreground">{r.name}</span>
            </Link>
          ))}
          <Link href="/platforms" className="surface-card flex items-center justify-center rounded-[10px] p-4 text-center">
            <span className="text-[13.5px] font-medium text-primary">View all supported platforms</span>
          </Link>
        </div>
      </Section>

      <FinalCta title={ctaTitle} description={ctaCopy} microcopy="Start free. No credit card required." />
    </>
  );
}

function ArrowGlyph({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`text-[15px] leading-none text-muted ${className}`}>
      →
    </span>
  );
}
