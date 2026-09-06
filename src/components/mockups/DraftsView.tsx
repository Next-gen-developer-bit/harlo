import { chipPalette } from "./AppShell";

const drafts: { platform: keyof typeof chipPalette; title: string; edited: string }[] = [
  { platform: "instagram", title: "Summer collection teaser", edited: "Edited 2h ago" },
  { platform: "linkedin", title: "Q3 product update", edited: "Edited yesterday" },
  { platform: "tiktok", title: "Behind the scenes clip", edited: "Edited 3 days ago" },
];

export default function DraftsView() {
  return (
    <div className="space-y-2.5">
      {drafts.map((d, i) => {
        const c = chipPalette[d.platform];
        const Icon = c.Icon;
        return (
          <div key={i} className="flex items-center justify-between rounded-2xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: c.bg }}>
                <Icon className="h-4 w-auto" style={{ color: c.fg }} />
              </div>
              <div>
                <div className="text-[13.5px] font-medium text-foreground">{d.title}</div>
                <div className="text-[11.5px] text-muted">{d.edited}</div>
              </div>
            </div>
            <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted">Draft</span>
          </div>
        );
      })}
    </div>
  );
}
