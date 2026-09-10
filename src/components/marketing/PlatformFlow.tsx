import { platformItems } from "@/lib/nav-data";
import PlatformBadge from "@/components/icons/PlatformBadge";
import { chipPalette } from "@/components/mockups/AppShell";

const supported = platformItems.filter((p) => p.status === "Supported");

// Evenly space each platform badge around an ellipse centred on the calendar card.
const positioned = supported.map((p, i) => {
  const angle = (360 / supported.length) * i - 90;
  const rad = (angle * Math.PI) / 180;
  const rx = 44;
  const ry = 40;
  const x = 50 + rx * Math.cos(rad);
  const y = 50 + ry * Math.sin(rad);
  return { ...p, x, y };
});

export default function PlatformFlow() {
  return (
    <>
      {/* Desktop: platforms orbiting the calendar */}
      <div className="relative mx-auto hidden h-[380px] max-w-[720px] md:block">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          {positioned.map((p) => (
            <line
              key={p.slug}
              x1={p.x}
              y1={p.y}
              x2={50}
              y2={50}
              stroke="var(--border)"
              strokeWidth="0.4"
              strokeDasharray="1.5 1.5"
            />
          ))}
        </svg>

        <div className="absolute left-1/2 top-1/2 flex w-[230px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 rounded-[12px] border border-border bg-white p-5 shadow-[0_30px_60px_-20px_rgba(20,20,40,0.25)]">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary text-[15px] font-bold text-white">
            P
          </span>
          <div className="text-[13px] font-semibold text-foreground">Harlo Calendar</div>
          <div className="mt-1 grid grid-cols-4 gap-1.5">
            {["instagram", "facebook", "linkedin", "tiktok"].map((slug) => {
              const c = chipPalette[slug as keyof typeof chipPalette];
              const Icon = c.Icon;
              return (
                <span
                  key={slug}
                  className="flex h-6 w-6 items-center justify-center rounded-full"
                  style={{ backgroundColor: c.bg }}
                >
                  <Icon className="h-3 w-auto" style={{ color: c.fg }} />
                </span>
              );
            })}
          </div>
        </div>

        {positioned.map((p) => (
          <div
            key={p.slug}
            className="icon-pop absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <PlatformBadge slug={p.slug} size={52} rounded="rounded-[10px]" />
          </div>
        ))}
      </div>

      {/* Mobile: simple grid, no absolute positioning */}
      <div className="mx-auto max-w-sm md:hidden">
        <div className="mb-6 flex flex-col items-center gap-2 rounded-[12px] border border-border bg-white p-5 shadow-[0_20px_40px_-20px_rgba(20,20,40,0.25)]">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary text-[15px] font-bold text-white">
            P
          </span>
          <div className="text-[13px] font-semibold text-foreground">Harlo Calendar</div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {supported.map((p) => (
            <div key={p.slug} className="flex justify-center">
              <PlatformBadge slug={p.slug} size={44} rounded="rounded-[10px]" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
