"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Logo from "@/components/brand/Logo";
import Chevron from "@/components/ui/Chevron";
import PlatformBadge from "@/components/icons/PlatformBadge";
import CookieSettingsTrigger from "@/components/cookies/CookieSettingsTrigger";
import { platformItems, solutionItems } from "@/lib/nav-data";

type FooterLink = { label: string; href: string };

const productLinks: FooterLink[] = [
  { label: "Social Media Scheduler", href: "/social-media-scheduler" },
  { label: "Social Media Calendar", href: "/social-media-calendar" },
  { label: "Analytics", href: "/features/analytics" },
  { label: "Campaigns", href: "/campaigns" },
  { label: "Workspaces", href: "/features/workspaces" },
  { label: "Content Library", href: "/features/content-library" },
  { label: "Queue Scheduling", href: "/features/queue-scheduling" },
];

const solutionLinks: FooterLink[] = solutionItems.map((s) => ({ label: s.name, href: s.href }));

// Text-only — no platform icons in the footer (icons belong in product/
// platform sections, not here).
const platformLinks: FooterLink[] = platformItems
  .filter((p) => p.status === "Supported")
  .map((p) => ({ label: p.name, href: p.href }));

const companyLinks: FooterLink[] = [
  { label: "Pricing", href: "/pricing" },
  { label: "Partner Program", href: "/partners" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
  { label: "Feedback", href: "/feedback" },
];

const legalLinks: FooterLink[] = [
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" },
  { label: "Cookies", href: "/legal/cookies" },
  { label: "GDPR", href: "/legal/gdpr" },
  { label: "Data Deletion", href: "/legal/data-deletion" },
  { label: "Partner Terms", href: "/legal/partner-terms" },
];

const navGroups = [
  { title: "Product", links: productLinks },
  { title: "Solutions", links: solutionLinks },
  { title: "Platforms", links: platformLinks },
  { title: "Company", links: companyLinks },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--dark-bg)]">
      <Container className="pt-16 md:pt-24">
        {/* TOP AREA — left brand block (~30-35%), right navigation. */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.32fr_0.68fr] lg:gap-10">
          <div>
            <Link href="/" className="inline-flex">
              <Logo variant="light" height={26} />
            </Link>
            <h2 className="balance mt-6 max-w-[15ch] text-h1-page font-semibold text-white">
              Plan clearly.
              <br />
              <span className="italic">Publish</span> consistently.
            </h2>
            <p className="mt-5 max-w-[26ch] text-[14.5px] leading-relaxed text-white/55">
              Social media management for businesses, marketers and agencies.
            </p>
          </div>

          {/* Desktop nav — four columns, always visible. */}
          <div className="hidden grid-cols-4 gap-8 sm:grid">
            {navGroups.map((g) => (
              <FooterColumn key={g.title} title={g.title} links={g.links} />
            ))}
          </div>

          {/* Mobile nav — accordions with the shared chevron. */}
          <div className="flex flex-col sm:hidden">
            {navGroups.map((g) => (
              <FooterAccordion key={g.title} title={g.title} links={g.links} />
            ))}
          </div>
        </div>

        {/* BOTTOM AREA — thin divider, copyright + legal + socials. */}
        <div className="mt-16 border-t border-white/10 py-6 md:mt-20">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[13px] text-white/45">© {new Date().getFullYear()} Harlo Social. All rights reserved.</span>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {legalLinks.map((l) => (
                <Link key={l.label} href={l.href} className="text-[13px] text-white/55 transition-colors duration-200 hover:text-white">
                  {l.label}
                </Link>
              ))}
              <CookieSettingsTrigger className="text-[13px] text-white/55 transition-colors duration-200 hover:text-white">
                Cookie Settings
              </CookieSettingsTrigger>
            </div>

            <div className="flex items-center gap-4">
              <SocialLink slug="instagram" href="/instagram-scheduler" />
              <SocialLink slug="x" href="/x-scheduler" />
              <SocialLink slug="linkedin" href="/linkedin-scheduler" />
              <SocialLink slug="tiktok" href="/tiktok-scheduler" />
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <div className="mb-5 text-[12px] font-medium uppercase tracking-wide text-white/45">{title}</div>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-[15px] text-white/70 transition-colors duration-200 hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterAccordion({ title, links }: { title: string; links: FooterLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-[52px] w-full items-center justify-between text-[13px] font-medium uppercase tracking-wide text-white/70"
      >
        {title}
        <Chevron open={open} className="text-white/45" />
      </button>
      {open && (
        <ul className="space-y-3 pb-5">
          {links.map((l) => (
            <li key={l.label}>
              <Link href={l.href} className="text-[15px] text-white/70 transition-colors duration-200 hover:text-white">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SocialLink({ slug, href }: { slug: string; href: string }) {
  return (
    <Link href={href} aria-label={slug} className="icon-pop block opacity-70 transition-opacity duration-200 hover:opacity-100">
      <PlatformBadge slug={slug} size={26} rounded="rounded-full" />
    </Link>
  );
}
