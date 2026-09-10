// One shared chevron for every dropdown/accordion indicator sitewide
// (nav dropdowns, mobile accordion, FAQ rows) — replaces the previous
// mix of a plain-text "▾" character and other ad hoc glyphs. Rotates
// smoothly on open via the `open` prop; never a different symbol family
// (no plus icons, carets or arrows for the same kind of control).
export default function Chevron({ open = false, className = "" }: { open?: boolean; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className={`shrink-0 transition-transform duration-200 ease-in-out ${open ? "rotate-180" : ""} ${className}`}
      style={{ width: 15, height: 15 }}
    >
      <path d="M3.5 6L8 10.5L12.5 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
