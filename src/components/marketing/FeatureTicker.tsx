const features = [
  "Calendar",
  "Scheduling",
  "Post Queue",
  "Drafts",
  "Analytics",
  "AI Captions",
  "Workspaces",
  "Multi-Platform Publishing",
  "Content Planning",
  "Team Management",
  "Post History",
  "Social Accounts",
];

const loop = [...features, ...features];

export default function FeatureTicker() {
  return (
    <div className="marquee-mask">
      <div className="marquee-track marquee-track-reverse marquee-track-slow gap-2.5">
        {loop.map((f, i) => (
          <span
            key={`${f}-${i}`}
            className="shrink-0 rounded-full bg-surface px-4 py-2 text-[13px] font-medium text-muted"
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}
