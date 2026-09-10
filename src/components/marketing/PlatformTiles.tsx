import Link from "next/link";
import { platformItems, type PlatformItem } from "@/lib/nav-data";
import PlatformBadge from "@/components/icons/PlatformBadge";

// Single visible surface per platform — PlatformBadge's own border/bg/radius
// IS the container (its default border-border is already a light neutral
// grey, so only the hover state needs overriding here). There used to be a
// second outer box wrapping a smaller PlatformBadge inside it, which
// produced a double-border effect and left the actual logo tiny inside two
// layers of padding. The Link/div here is purely an interactive wrapper
// now; hover styling is passed through to the badge itself via className
// so only one surface ever lifts/darkens, not a second box.
const badgeClassName = "transition-all duration-150 ease-out hover:-translate-y-px hover:border-[#D3D8E1]";

// Fluid size/padding so all ten icons stay on one row at every viewport
// width (previously a fixed 44px/9px forced a wrap onto two rows below
// ~460px). Ceiling matches the original 44px/9px almost exactly and is
// reached by ~640px, so desktop is effectively unchanged; only narrow
// phones get progressively more compact.
const ICON_SIZE = "clamp(24px, 8px + 5vw, 44px)";
const ICON_PADDING = "clamp(4px, 1.5px + 0.8vw, 9px)";

function Tile({ p, ariaHidden }: { p: PlatformItem; ariaHidden?: boolean }) {
  const isComingSoon = p.status === "Coming Soon";
  const badge = (
    <PlatformBadge
      slug={p.slug}
      size={ICON_SIZE}
      rounded="rounded-[11px]"
      padding={ICON_PADDING}
      className={`${badgeClassName} ${isComingSoon ? "opacity-55" : ""}`}
    />
  );

  if (isComingSoon) {
    return (
      <div role={ariaHidden ? undefined : "img"} aria-label={ariaHidden ? undefined : `${p.name} (coming soon)`} aria-hidden={ariaHidden || undefined}>
        {badge}
      </div>
    );
  }

  return (
    <Link
      href={p.href}
      aria-label={ariaHidden ? undefined : p.name}
      aria-hidden={ariaHidden || undefined}
      tabIndex={ariaHidden ? -1 : undefined}
    >
      {badge}
    </Link>
  );
}

// Fluid gap alongside the icon size above — floor ~3px at 320px viewport,
// ceiling exactly the original 10px (gap-x-2.5) from ~640px up, so desktop
// spacing is unchanged and only narrow phones tighten up.
const ROW_GAP = "clamp(3px, 2.2vw - 4px, 10px)";

export default function PlatformTiles() {
  return (
    <div className="mx-auto flex w-full max-w-full flex-nowrap items-center justify-center" style={{ gap: ROW_GAP }}>
      {platformItems.map((p) => (
        <Tile key={p.slug} p={p} />
      ))}
    </div>
  );
}
