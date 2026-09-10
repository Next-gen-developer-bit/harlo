import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/marketing/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Legal Centre | Harlo Social",
  description: "The policies and information that explain how Harlo works, how we protect your data, and the terms that apply when using our services.",
  path: "/legal",
});

const available = [
  { title: "Terms of Service", copy: "The agreement that applies when you use Harlo.", href: "/legal/terms", dot: "var(--pastel-blue)" },
  { title: "Privacy Policy", copy: "How we collect, use and protect your information.", href: "/legal/privacy", dot: "var(--pastel-purple)" },
  { title: "GDPR & Data Protection", copy: "How Harlo approaches GDPR and related European privacy laws.", href: "/legal/gdpr", dot: "var(--pastel-blue)" },
  { title: "Cookie Policy", copy: "How Harlo uses cookies and similar technologies.", href: "/legal/cookies", dot: "var(--pastel-green)" },
  { title: "Data Deletion", copy: "How to delete your account and request removal of your data.", href: "/legal/data-deletion", dot: "var(--pastel-peach)" },
  { title: "Partner Program Terms", copy: "The terms that apply to Harlo's partner program.", href: "/legal/partner-terms", dot: "var(--pastel-pink)" },
];

const future = [
  { title: "Data Processing Agreement", copy: "For business customers requiring a DPA." },
  { title: "Subprocessors", copy: "A full list of Harlo's third-party service providers." },
  { title: "Security", copy: "How Harlo protects your account and data." },
];

export default function LegalHubPage() {
  return (
    <>
      <Section className="pb-10 pt-12 text-center md:pt-16">
        <div className="flex justify-center">
          <Eyebrow>Legal</Eyebrow>
        </div>
        <h1 className="balance mx-auto mt-6 max-w-2xl text-h1-page font-semibold text-foreground">
          Legal
        </h1>
        <p className="balance mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-muted md:text-[18px]">
          The policies and information that explain how Harlo works, how we protect your data and the terms that
          apply when using our services.
        </p>
      </Section>

      <Section className="pt-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {available.map((item) => (
            <Link key={item.href} href={item.href} className="surface-card group rounded-[10px] p-6">
              <div
                className="mb-4 h-9 w-9 rounded-full transition-transform duration-300 group-hover:scale-110"
                style={{ background: item.dot }}
              />
              <div className="text-[15.5px] font-semibold text-foreground">{item.title}</div>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{item.copy}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section className="bg-surface/60 pt-12">
        <h2 className="mb-8 text-[18px] font-semibold tracking-tight text-foreground">Coming soon</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {future.map((item) => (
            <div key={item.title} className="rounded-[10px] border border-dashed border-border p-6 opacity-70">
              <div className="text-[14.5px] font-semibold text-foreground">{item.title}</div>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">{item.copy}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
