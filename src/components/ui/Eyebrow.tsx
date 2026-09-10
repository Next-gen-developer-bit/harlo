import type { ReactNode } from "react";

// Small, uppercase, letter-spaced technical label — not a coloured pill.
// This is the "editorial" register (see section-numbering, product
// annotations): restrained and typographic rather than a branded badge.
export default function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center text-eyebrow font-semibold uppercase tracking-[0.08em] text-muted ${className}`}>
      {children}
    </span>
  );
}
