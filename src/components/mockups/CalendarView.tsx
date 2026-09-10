import { chipPalette } from "./AppShell";

type Post = { day: number; time: string; platform: keyof typeof chipPalette; label: string; state?: "draft" | "scheduled" | "published" };

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const posts: Post[] = [
  { day: 0, time: "9:00", platform: "instagram", label: "Product teaser", state: "scheduled" },
  { day: 0, time: "2:30", platform: "linkedin", label: "Case study", state: "published" },
  { day: 1, time: "11:00", platform: "tiktok", label: "Behind the scenes", state: "scheduled" },
  { day: 2, time: "9:00", platform: "facebook", label: "Weekly roundup", state: "draft" },
  { day: 2, time: "5:00", platform: "youtube", label: "Tutorial", state: "scheduled" },
  { day: 3, time: "1:00", platform: "instagram", label: "Carousel", state: "scheduled" },
  { day: 4, time: "9:00", platform: "x", label: "Announcement", state: "published" },
  { day: 4, time: "6:00", platform: "threads", label: "Quick update", state: "scheduled" },
  { day: 5, time: "10:00", platform: "pinterest", label: "Inspiration board", state: "draft" },
];

const stateDot: Record<string, string> = {
  draft: "bg-muted/50",
  scheduled: "bg-primary",
  published: "bg-[#28c840]",
};

// Below the sm breakpoint, the full 7-day grid becomes too narrow per column
// to stay readable, so mobile shows a focused 3-day view (today + the next
// two days) instead of shrinking every column uniformly.
const mobileVisibleDays = 3;

export default function CalendarView() {
  return (
    <div>
      <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-7">
        {days.map((d, i) => (
          <div key={d} className={i >= mobileVisibleDays ? "hidden text-center sm:block" : "text-center"}>
            <div className="text-[11px] font-medium text-muted">{d}</div>
            <div
              className={`mx-auto mt-1 flex h-6 w-6 items-center justify-center rounded-full text-[12px] ${
                i === 2 ? "bg-primary text-white" : "text-foreground"
              }`}
            >
              {12 + i}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-7">
        {days.map((_, dayIndex) => (
          <div
            key={dayIndex}
            className={`min-h-[180px] rounded-2xl border border-border bg-surface/60 p-1.5 sm:min-h-[220px] ${
              dayIndex >= mobileVisibleDays ? "hidden sm:block" : ""
            }`}
          >
            {posts
              .filter((p) => p.day === dayIndex)
              .map((p, i) => {
                const c = chipPalette[p.platform];
                const Icon = c.Icon;
                return (
                  <div
                    key={i}
                    className="mb-1.5 rounded-xl border border-border bg-white p-2 shadow-sm"
                    style={{ backgroundColor: c.bg }}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className="h-3.5 w-auto" style={{ color: c.fg }} />
                      <span className={`h-1.5 w-1.5 rounded-full ${stateDot[p.state ?? "scheduled"]}`} />
                    </div>
                    <div className="mt-1 text-[10.5px] font-medium leading-tight" style={{ color: c.fg }}>
                      {p.label}
                    </div>
                    <div className="text-[10px] text-muted">{p.time}</div>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-[11px] text-muted sm:hidden">Mon–Wed shown · full week on desktop</p>
    </div>
  );
}
