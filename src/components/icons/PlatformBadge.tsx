import { platformIconMap } from "./PlatformIcons";

// Official brand marks are self-contained (fixed colours, several with their
// own background shape already baked in), so the badge itself just provides
// a neutral, consistent slot rather than a per-platform coloured background.
export default function PlatformBadge({
  slug,
  size = 32,
  rounded = "rounded-xl",
  className = "",
  padding,
}: {
  slug: string;
  /** Number (px) for a fixed size, or a CSS length/clamp() string (e.g. "clamp(26px, 6vw, 40px)") for fluid sizing — a caller passing a string must also pass an explicit `padding`, since the size*0.16 auto-fraction only applies to numeric sizes. */
  size?: number | string;
  rounded?: string;
  className?: string;
  /** Override the default size*0.16 padding — e.g. a caller rendering this as the ONE visible surface (no outer wrapper) needs a specific icon-to-container ratio, or any caller using a string `size`. Existing call sites are unaffected since this is optional. */
  padding?: number | string;
}) {
  const Icon = platformIconMap[slug];
  if (!Icon) return null;

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center border border-border bg-white ${rounded} ${className}`}
      style={{ width: size, height: size, padding: padding ?? (typeof size === "number" ? size * 0.16 : undefined) }}
    >
      <Icon className="h-full w-auto max-w-full" />
    </span>
  );
}
