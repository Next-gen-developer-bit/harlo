import Link from "next/link";
import Eyebrow from "@/components/ui/Eyebrow";
import { ShopIcon, MonitorSmartphoneIcon, TeamIcon } from "@/components/icons/NavIcons";
import ComposerView from "@/components/mockups/ComposerView";
import WorkspacesView from "@/components/mockups/WorkspacesView";
import TeamView from "@/components/mockups/TeamView";

// Three broad operating models — the full customer base, not an exhaustive
// ICP list. Editorial layout: heading first, then three large plain tiles
// (small product crop, headline, short copy, text link) — no tabs, no
// cards, no big rounded panel. Copy/hrefs unchanged from the previous pass.
const audiences = [
  {
    icon: ShopIcon,
    tint: "var(--pastel-blue)",
    title: "Growing Businesses & Marketing Teams",
    description: "Bring your channels, campaigns and content into one place as your marketing operation grows.",
    cta: "Explore Harlo for Teams",
    href: "/for/growing-businesses",
    crop: (
      <div className="h-full w-full origin-top-left scale-[0.55]">
        <ComposerView />
      </div>
    ),
  },
  {
    icon: MonitorSmartphoneIcon,
    tint: "var(--pastel-peach)",
    title: "Freelancers & Consultants",
    description: "Manage multiple clients without juggling separate calendars, spreadsheets and disconnected tools.",
    cta: "Explore Harlo for Freelancers",
    href: "/for/freelance-marketers",
    crop: (
      <div className="h-full w-full origin-top-left scale-[0.55]">
        <WorkspacesView />
      </div>
    ),
  },
  {
    icon: TeamIcon,
    tint: "var(--pastel-purple)",
    title: "Agencies",
    description: "Keep every client, campaign and channel organised without paying for unnecessary enterprise complexity.",
    cta: "Explore Harlo for Agencies",
    href: "/for/agencies",
    crop: (
      <div className="h-full w-full origin-top-left scale-[0.55]">
        <TeamView />
      </div>
    ),
  },
];

export default function AudienceSection() {
  return (
    <section className="w-full bg-background py-16 md:py-24">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="mx-auto max-w-xl text-center">
          <div className="flex justify-center">
            <Eyebrow>Built for you</Eyebrow>
          </div>
          <h2 className="balance mt-4 text-h2 font-semibold text-foreground">
            Made for people managing social every day.
          </h2>
          <p className="balance mx-auto mt-4 max-w-lg text-lg text-muted">
            Whether you manage your own business, several clients or a marketing team, Harlo keeps the
            workflow organised.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          {audiences.map((a) => {
            const Icon = a.icon;
            return (
              <div key={a.title}>
                <div
                  className="h-32 w-full overflow-hidden rounded-[10px] border border-border p-3"
                  style={{ backgroundColor: a.tint }}
                >
                  {a.crop}
                </div>
                <div className="mt-5 flex h-8 w-8 items-center justify-center rounded-[8px] border border-border-dark bg-white">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="mt-4 text-h3 font-semibold text-foreground">{a.title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{a.description}</p>
                <Link
                  href={a.href}
                  className="group mt-4 inline-flex items-center gap-1.5 text-[14.5px] font-medium text-primary transition-colors duration-200 hover:text-primary/80"
                >
                  {a.cta}
                  <span aria-hidden="true" className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">
                    ↗
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
