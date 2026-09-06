import Image from "next/image";

// Official Harlo Social artwork, processed via scripts/gen-brand-assets.mjs
// from the source files in public/brand/ into the crops used here:
//  - harlo-icon-{dark,light}.png            icon only, square
//  - harlo-icon-wordmark-{dark,light}.png   icon + "Harlo" (no SOCIAL line) — compact placements
//  - harlo-lockup-{dark,light}.png          full lockup incl. "SOCIAL" — needs more room to stay legible
const ASPECT = {
  iconWordmark: { dark: 1228 / 414, light: 1163 / 392 },
  lockup: { dark: 1265 / 414, light: 1222 / 392 },
};

type LogoProps = {
  /** "dark" = dark mark for light backgrounds (default). "light" = white mark for dark backgrounds. */
  variant?: "dark" | "light";
  /** Use the full lockup (includes "SOCIAL") instead of the compact icon+"Harlo" crop — needs more vertical room to stay legible. */
  showSocial?: boolean;
  className?: string;
  /** Rendered height in px; width follows the artwork's own aspect ratio. */
  height?: number;
  priority?: boolean;
};

export function LogoMark({
  variant = "dark",
  className = "",
  size = 28,
  priority,
}: {
  variant?: "dark" | "light";
  className?: string;
  size?: number;
  priority?: boolean;
}) {
  return (
    <Image
      src={`/brand/harlo-icon-${variant}.png`}
      alt="Harlo Social"
      width={size}
      height={size}
      priority={priority}
      className={className}
    />
  );
}

export default function Logo({ variant = "dark", showSocial = false, className = "", height = 28, priority }: LogoProps) {
  const kind = showSocial ? "lockup" : "iconWordmark";
  const file = showSocial ? "harlo-lockup" : "harlo-icon-wordmark";
  const ratio = ASPECT[kind][variant];
  const width = Math.round(height * ratio);

  return (
    <Image
      src={`/brand/${file}-${variant}.png`}
      alt="Harlo Social"
      width={width}
      height={height}
      priority={priority}
      className={className}
      style={{ height, width: "auto" }}
    />
  );
}
