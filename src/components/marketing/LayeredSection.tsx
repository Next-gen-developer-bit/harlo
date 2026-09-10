import type { ReactNode } from "react";

// Homepage-only "giant layer" outer-section system: the section itself is
// the large rounded surface (not a card floating inside a section). Each
// layer rises over the previous one via a negative top margin + rounded
// top corners + an explicit z-index, so the previous background stays
// visible around the incoming curve. This component only supplies that
// outer shape/stacking — every caller keeps its existing inner
// Container/layout completely unchanged as children.
const overlapClasses = {
  lg: "-mt-6 rounded-t-[28px] pt-16 md:-mt-10 md:rounded-t-[48px] md:pt-20 xl:-mt-16 xl:rounded-t-[72px] xl:pt-[120px]",
  // A quieter version for a lower-key utility section (e.g. FAQ) that still
  // needs to feel continuous with the sequence without matching the full
  // drama of the major product-story transitions.
  sm: "-mt-4 rounded-t-[20px] pt-12 md:-mt-6 md:rounded-t-[28px] md:pt-16 xl:-mt-8 xl:rounded-t-[36px] xl:pt-20",
} as const;

export default function LayeredSection({
  children,
  background,
  zIndex,
  overlap = "lg",
  className = "",
}: {
  children: ReactNode;
  /** Tailwind background utility class(es), e.g. "bg-[#F5F5F5]". */
  background: string;
  /** Explicit stacking order — higher paints over lower regardless of DOM order. */
  zIndex: number;
  /** "lg" for the major product-story transitions, "sm" for a quieter utility-section transition, false for a layer with nothing above it to rise over. */
  overlap?: "lg" | "sm" | false;
  className?: string;
}) {
  return (
    <section
      className={`relative scroll-mt-20 ${background} ${overlap ? overlapClasses[overlap] : ""} ${className}`}
      style={{ zIndex }}
    >
      {children}
    </section>
  );
}
