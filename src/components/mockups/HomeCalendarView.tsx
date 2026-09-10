import { chipPalette } from "./AppShell";
import StatusPill from "@/components/marketing/StatusPill";

// A large, believable month view for the homepage's calendar section only —
// deliberately separate from CalendarView.tsx (used elsewhere as a smaller,
// compact-week mockup) rather than overloading that shared component with
// homepage-specific density. No fabricated screenshots: platform icons,
// status pills and thumbnail placeholders are all existing Harlo visual
// primitives already used across the site's mockups.

type PostStatus = "Scheduled" | "Approved" | "Draft" | "Needs Review";

type Post = {
  day: number;
  time: string;
  platform: keyof typeof chipPalette;
  label: string;
  status: PostStatus;
  campaign?: string;
  thumbnail?: boolean;
};

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// A realistic 5-week month grid: a 30-day month starting on a Wednesday,
// with muted leading/trailing days from the adjacent months, the way a
// real calendar renders — not a stylised abstraction.
const weeks: { date: number; inMonth: boolean }[][] = [
  [29, 30, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, 1, 2, 3],
].map((row, weekIndex) =>
  row.map((date, i) => ({
    date,
    inMonth: !(weekIndex === 0 && i < 2) && !(weekIndex === 4 && i >= 4),
  }))
);

const today = 14;

const posts: Post[] = [
  { day: 1, time: "9:00", platform: "instagram", label: "New product teaser", status: "Scheduled", thumbnail: true },
  { day: 2, time: "11:00", platform: "linkedin", label: "Case study", status: "Approved" },
  { day: 3, time: "2:00", platform: "tiktok", label: "Reels batch", status: "Draft", thumbnail: true },
  { day: 5, time: "9:00", platform: "facebook", label: "Weekly roundup", status: "Scheduled" },
  { day: 7, time: "10:00", platform: "youtube", label: "Product launch", status: "Needs Review", campaign: "Product Launch", thumbnail: true },
  { day: 8, time: "1:00", platform: "instagram", label: "Behind the scenes", status: "Scheduled", thumbnail: true },
  { day: 10, time: "9:00", platform: "threads", label: "Quick update", status: "Draft" },
  { day: 12, time: "3:00", platform: "pinterest", label: "Inspiration board", status: "Scheduled" },
  { day: 14, time: "9:00", platform: "linkedin", label: "Monthly report", status: "Approved" },
  { day: 16, time: "11:00", platform: "x", label: "Client campaign", status: "Scheduled", campaign: "Bloom & Co" },
  { day: 18, time: "9:00", platform: "instagram", label: "Campaign approval", status: "Needs Review", campaign: "Product Launch" },
  { day: 21, time: "2:00", platform: "tiktok", label: "Reels batch", status: "Draft", thumbnail: true },
  { day: 23, time: "9:00", platform: "facebook", label: "Weekly roundup", status: "Scheduled" },
  { day: 26, time: "10:00", platform: "youtube", label: "Case study", status: "Approved" },
];

const postsByDay = new Map<number, Post[]>();
for (const p of posts) {
  const list = postsByDay.get(p.day) ?? [];
  list.push(p);
  postsByDay.set(p.day, list);
}

function EventChip({ post }: { post: Post }) {
  const c = chipPalette[post.platform];
  const Icon = c.Icon;
  return (
    <div className="rounded-[8px] border border-border bg-white p-1.5 shadow-[0_1px_2px_rgba(36,30,18,0.04)] sm:p-2">
      <div className="flex items-center justify-between gap-1">
        <div className="flex min-w-0 items-center gap-1">
          <Icon className="h-3 w-auto shrink-0" style={{ color: c.fg }} />
          <span className="truncate text-[10px] font-medium text-foreground sm:text-[11px]">{post.label}</span>
        </div>
      </div>
      {post.thumbnail && <div className="mt-1.5 h-8 w-full rounded-[6px] bg-surface-2 sm:h-10" />}
      <div className="mt-1.5 flex items-center justify-between gap-1">
        <span className="text-[9.5px] text-muted">{post.time}</span>
        <StatusPill status={post.status} className="px-1.5 py-0.5 text-[9px] sm:px-2 sm:text-[10px]" />
      </div>
      {post.campaign && (
        <div className="mt-1.5 truncate rounded-full bg-surface px-1.5 py-0.5 text-[9px] font-medium text-muted">
          {post.campaign}
        </div>
      )}
    </div>
  );
}

export default function HomeCalendarView() {
  return (
    <div className="rounded-[12px] border border-border-dark bg-white p-3 shadow-[0_20px_50px_-24px_rgba(36,30,18,0.18)] sm:p-4 md:p-5">
      {/* Toolbar — Calendar / Approvals left, Month / Week / List right (Month active). */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className="text-[13px] font-semibold text-foreground sm:text-[14px]">Calendar</span>
          <span className="text-[13px] font-medium text-muted sm:text-[14px]">Approvals</span>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-border bg-surface p-0.5">
          <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-foreground shadow-[0_1px_2px_rgba(36,30,18,0.08)] sm:px-3 sm:text-[12px]">
            Month
          </span>
          <span className="hidden px-2.5 py-1 text-[11px] font-medium text-muted sm:block sm:px-3 sm:text-[12px]">Week</span>
          <span className="hidden px-2.5 py-1 text-[11px] font-medium text-muted sm:block sm:px-3 sm:text-[12px]">List</span>
        </div>
      </div>

      {/* Weekday header — 3 columns on mobile (today + next 2), 7 from sm up. */}
      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-7 sm:gap-2">
        {weekdays.map((d, i) => (
          <div key={d} className={i >= 2 ? "hidden text-center sm:block" : "text-center"}>
            <span className="text-[10.5px] font-medium uppercase tracking-wide text-muted sm:text-[11px]">{d}</span>
          </div>
        ))}
      </div>

      {/* Month grid. Mobile shows only the week containing "today", 3 columns wide. */}
      <div className="mt-2 hidden gap-1.5 sm:grid sm:grid-cols-7 sm:gap-2">
        {weeks.map((week, wi) =>
          week.map((cell, di) => {
            const dayPosts = cell.inMonth ? (postsByDay.get(cell.date) ?? []) : [];
            const isToday = cell.inMonth && cell.date === today;
            return (
              <div
                key={`${wi}-${di}`}
                className={`min-h-[112px] rounded-[10px] border p-1.5 md:min-h-[128px] ${
                  isToday ? "border-primary/30 bg-primary-soft/40" : "border-border bg-surface/50"
                } ${cell.inMonth ? "" : "opacity-45"}`}
              >
                <span className={`text-[11px] font-medium ${isToday ? "text-primary" : cell.inMonth ? "text-foreground" : "text-muted"}`}>
                  {cell.date}
                </span>
                <div className="mt-1 space-y-1">
                  {dayPosts.map((p, i) => (
                    <EventChip key={i} post={p} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Mobile week strip — today + the following two days, larger and readable. */}
      <div className="mt-2 grid grid-cols-3 gap-1.5 sm:hidden">
        {weeks[2].slice(1, 4).map((cell, i) => {
          const dayPosts = postsByDay.get(cell.date) ?? [];
          const isToday = cell.date === today;
          return (
            <div
              key={i}
              className={`min-h-[150px] rounded-[10px] border p-1.5 ${
                isToday ? "border-primary/30 bg-primary-soft/40" : "border-border bg-surface/50"
              }`}
            >
              <span className={`text-[11px] font-medium ${isToday ? "text-primary" : "text-foreground"}`}>{cell.date}</span>
              <div className="mt-1 space-y-1.5">
                {dayPosts.map((p, i) => (
                  <EventChip key={i} post={p} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center text-[10.5px] text-muted sm:hidden">This week shown · full month on desktop</p>
    </div>
  );
}
