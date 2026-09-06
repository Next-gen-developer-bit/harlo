import { chipPalette } from "./AppShell";

export function UpcomingPostsScreen() {
  const items: { platform: keyof typeof chipPalette; time: string; label: string }[] = [
    { platform: "instagram", time: "Today, 5:00 PM", label: "Product teaser" },
    { platform: "linkedin", time: "Tomorrow, 9:00 AM", label: "Case study" },
    { platform: "tiktok", time: "Fri, 11:00 AM", label: "Behind the scenes" },
  ];
  return (
    <div className="px-4">
      <div className="mb-4 text-[17px] font-semibold">Upcoming</div>
      <div className="space-y-2.5">
        {items.map((it, i) => {
          const c = chipPalette[it.platform];
          const Icon = c.Icon;
          return (
            <div key={i} className="flex items-center gap-3 rounded-2xl border border-border p-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: c.bg }}
              >
                <Icon className="h-4 w-auto" style={{ color: c.fg }} />
              </div>
              <div className="min-w-0">
                <div className="truncate text-[13px] font-medium">{it.label}</div>
                <div className="text-[11px] text-muted">{it.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CreatePostScreen() {
  return (
    <div className="px-4">
      <div className="mb-4 text-[17px] font-semibold">New post</div>
      <div className="mb-3 h-32 rounded-2xl bg-surface-2" />
      <div className="mb-3 rounded-2xl border border-border p-3 text-[12px] leading-relaxed text-muted">
        Big news: our summer collection just went live ✨
      </div>
      <div className="mb-4 flex gap-2">
        {(["instagram", "facebook", "tiktok"] as const).map((p) => {
          const c = chipPalette[p];
          const Icon = c.Icon;
          return (
            <div
              key={p}
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: c.bg }}
            >
              <Icon className="h-3.5 w-auto" style={{ color: c.fg }} />
            </div>
          );
        })}
      </div>
      <div className="rounded-full bg-primary py-3 text-center text-[13px] font-medium text-white">
        Schedule post
      </div>
    </div>
  );
}

export function AnalyticsScreen() {
  const bars = [30, 55, 40, 70, 50, 85, 60];
  return (
    <div className="px-4">
      <div className="mb-4 text-[17px] font-semibold">Analytics</div>
      <div className="mb-3 rounded-2xl border border-border p-3.5">
        <div className="text-[11px] text-muted">Reach this week</div>
        <div className="text-[19px] font-semibold">42.1K</div>
        <div className="text-[11px] font-medium text-primary">+14%</div>
      </div>
      <div className="flex h-24 items-end gap-1.5 rounded-2xl border border-border p-3.5">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 rounded-t bg-primary-soft" style={{ height: `${h}%` }}>
            <div className="h-1.5 rounded-t bg-primary" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CalendarScreen() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div className="px-4">
      <div className="mb-4 text-[17px] font-semibold">Calendar</div>
      <div className="mb-3 grid grid-cols-7 gap-1 text-center text-[10px] text-muted">
        {days.map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 21 }).map((_, i) => (
          <div
            key={i}
            className={`flex h-8 items-center justify-center rounded-lg text-[11px] ${
              [4, 9, 15].includes(i) ? "bg-primary text-white" : "bg-surface text-foreground"
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AccountsScreen() {
  const accounts: (keyof typeof chipPalette)[] = ["instagram", "facebook", "linkedin", "tiktok", "youtube"];
  return (
    <div className="px-4">
      <div className="mb-4 text-[17px] font-semibold">Accounts</div>
      <div className="space-y-2.5">
        {accounts.map((p) => {
          const c = chipPalette[p];
          const Icon = c.Icon;
          return (
            <div key={p} className="flex items-center justify-between rounded-2xl border border-border p-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ backgroundColor: c.bg }}
                >
                  <Icon className="h-4 w-auto" style={{ color: c.fg }} />
                </div>
                <div className="text-[13px] font-medium capitalize">{p}</div>
              </div>
              <span className="h-2 w-2 rounded-full bg-[#28c840]" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
