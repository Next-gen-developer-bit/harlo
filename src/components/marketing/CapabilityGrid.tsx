import { chipPalette } from "@/components/mockups/AppShell";
import { PlayIcon, ChartIcon, ChecklistIcon, FolderIcon } from "@/components/icons/NavIcons";

const capabilities = [
  {
    title: "Publishing",
    description: "Plan, schedule and publish content across your social accounts from one calendar.",
    icon: PlayIcon,
    tint: "var(--pastel-blue)",
    visual: (
      <div className="flex h-full flex-col justify-center space-y-2">
        {[
          { day: "Mon", tint: "instagram" as const },
          { day: "Wed", tint: "linkedin" as const },
          { day: "Fri", tint: "tiktok" as const },
        ].map((row) => {
          const c = chipPalette[row.tint];
          return (
            <div key={row.day} className="flex items-center gap-2.5 rounded-lg bg-white px-2.5 py-2">
              <span className="w-7 text-[10px] font-medium text-muted">{row.day}</span>
              <span className="h-2 flex-1 rounded-full" style={{ backgroundColor: c.bg }} />
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: c.fg }} />
            </div>
          );
        })}
      </div>
    ),
  },
  {
    title: "Analytics",
    description: "Understand performance across brands, campaigns and channels.",
    icon: ChartIcon,
    tint: "var(--pastel-peach)",
    visual: (
      <div className="flex h-full items-end gap-1.5">
        {[38, 60, 48, 74, 55, 90, 66].map((h, i) => (
          <div key={i} className="flex-1 rounded-t bg-primary-soft" style={{ height: `${h}%` }}>
            <div className="h-1.5 rounded-t bg-primary" style={{ opacity: i === 5 ? 1 : 0.55 }} />
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Approvals & Collaboration",
    description: "Review content, gather feedback and keep approvals inside the same workflow.",
    icon: ChecklistIcon,
    tint: "var(--pastel-purple)",
    visual: (
      <div className="flex h-full flex-col justify-center rounded-lg bg-white p-3">
        <div className="flex-1 rounded-md bg-surface-2" />
        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-[10.5px] font-medium text-foreground">Weekly roundup</span>
          <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[9.5px] font-semibold text-primary">Approved</span>
        </div>
      </div>
    ),
  },
  {
    title: "Content Management",
    description: "Organise drafts, campaigns and assets without switching between tools.",
    icon: FolderIcon,
    tint: "var(--pastel-green)",
    visual: (
      <div className="grid h-full grid-cols-4 gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-full rounded-lg bg-white" />
        ))}
      </div>
    ),
  },
];

export default function CapabilityGrid() {
  return (
    <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2">
      {capabilities.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.title} className="flex min-w-0 flex-col rounded-[10px] border border-border bg-white p-6">
            <div className="h-28 rounded-[10px] bg-surface/70 p-4">{c.visual}</div>
            <div className="mt-5 flex items-center gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
                style={{ backgroundColor: c.tint }}
              >
                <Icon className="h-[17px] w-[17px]" />
              </div>
              <h3 className="text-[17px] font-semibold text-foreground">{c.title}</h3>
            </div>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">{c.description}</p>
          </div>
        );
      })}
    </div>
  );
}
