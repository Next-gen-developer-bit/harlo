import { chipPalette } from "./AppShell";

const selected: (keyof typeof chipPalette)[] = ["instagram", "facebook", "linkedin", "x"];

export default function ComposerView() {
  return (
    <div className="grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
      <div>
        <div className="mb-3 flex flex-wrap gap-2">
          {selected.map((p) => {
            const c = chipPalette[p];
            const Icon = c.Icon;
            return (
              <div
                key={p}
                className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5"
                style={{ backgroundColor: c.bg }}
              >
                <Icon className="h-3.5 w-auto" style={{ color: c.fg }} />
                <span className="text-[12px] font-medium capitalize" style={{ color: c.fg }}>
                  {p}
                </span>
              </div>
            );
          })}
          <div className="flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1.5 text-[12px] text-muted">
            + Add account
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface/60 p-4">
          <div className="text-[13px] leading-relaxed text-foreground">
            Big news: our summer collection just went live. Tap the link in bio to shop the drop before it sells out. ✨
          </div>
          <div className="mt-3 h-28 rounded-xl bg-surface-2" />
          <div className="mt-3 flex items-center justify-between text-[11px] text-muted">
            <span>142 / 2,200 characters</span>
            <span>1 image attached</span>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="rounded-2xl border border-border p-3.5">
          <div className="mb-2 flex items-center gap-1.5 text-[12px] font-medium">
            <span className="h-2 w-2 rounded-full bg-[#C2296B]" /> Instagram preview
          </div>
          <div className="text-[12px] text-muted leading-relaxed">
            Big news: our summer collection just went live. Tap the link in bio to shop the drop before it sells out ✨ #newdrop
          </div>
        </div>
        <div className="rounded-2xl border border-border p-3.5">
          <div className="mb-2 flex items-center gap-1.5 text-[12px] font-medium">
            <span className="h-2 w-2 rounded-full bg-[#1A1A1F]" /> X preview
          </div>
          <div className="text-[12px] text-muted leading-relaxed">
            Summer collection is live. Shop the drop at bloomandco.com/summer
          </div>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-surface p-3.5">
          <span className="text-[12px] text-muted">Schedule for</span>
          <span className="text-[12px] font-medium">Fri, 6:00 PM</span>
        </div>
      </div>
    </div>
  );
}
