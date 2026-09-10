import { chipPalette } from "@/components/mockups/AppShell";

type Post = { platform: keyof typeof chipPalette; caption: string; status: "Scheduled" | "Published" };

const rowA: Post[] = [
  { platform: "instagram", caption: "Behind the scenes from today's shoot ✨", status: "Scheduled" },
  { platform: "linkedin", caption: "3 lessons from our Q3 product launch", status: "Published" },
  { platform: "tiktok", caption: "POV: your content calendar finally makes sense", status: "Scheduled" },
  { platform: "facebook", caption: "Weekend sale starts now: 20% off everything", status: "Scheduled" },
  { platform: "pinterest", caption: "10 ideas for your next campaign", status: "Published" },
  { platform: "threads", caption: "Quick update on what's coming next 👀", status: "Scheduled" },
];

const rowB: Post[] = [
  { platform: "youtube", caption: "Watch: how we plan a month of content", status: "Published" },
  { platform: "instagram", caption: "New drop, link in bio", status: "Scheduled" },
  { platform: "x", caption: "Announcing something big this week", status: "Scheduled" },
  { platform: "linkedin", caption: "Hiring: come build with us", status: "Published" },
  { platform: "tiktok", caption: "Day in the life of a social team", status: "Scheduled" },
  { platform: "facebook", caption: "Thank you for 10k followers 🎉", status: "Published" },
];

function Row({ posts, reverse = false, slow = false }: { posts: Post[]; reverse?: boolean; slow?: boolean }) {
  const loop = [...posts, ...posts];
  return (
    <div className="marquee-mask">
      <div className={`marquee-track gap-4 ${reverse ? "marquee-track-reverse" : ""} ${slow ? "marquee-track-slow" : ""}`}>
        {loop.map((p, i) => {
          const c = chipPalette[p.platform];
          const Icon = c.Icon;
          return (
            <div key={i} className="w-[220px] shrink-0 overflow-hidden rounded-[10px] border border-border bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
              <div className="flex h-28 items-center justify-center" style={{ backgroundColor: c.bg }}>
                <Icon className="h-7 w-auto" style={{ color: c.fg }} />
              </div>
              <div className="p-3.5">
                <p className="line-clamp-2 text-[12.5px] leading-snug text-foreground">{p.caption}</p>
                <span
                  className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    p.status === "Scheduled" ? "bg-primary-soft text-primary" : "bg-[#EAFAF1] text-[#1D9A5D]"
                  }`}
                >
                  {p.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ContentMarquee() {
  return (
    <div className="space-y-4">
      <Row posts={rowA} />
      <Row posts={rowB} reverse slow />
    </div>
  );
}
