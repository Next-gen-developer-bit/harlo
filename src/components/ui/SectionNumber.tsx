// Editorial section-number label, e.g. "01 / PLAN" — used sparingly, only
// on the homepage product story and a handful of key feature/solution
// pages (see section-numbering guidance). Deliberately plain text, not a
// tutorial-style numbered-step badge: no circle, no background, just a
// small tracked-out technical label sitting above the section heading.
export default function SectionNumber({ n, label, light = false }: { n: string; label: string; light?: boolean }) {
  return (
    <div
      className={`font-mono text-[11px] font-medium uppercase tracking-[0.14em] ${light ? "text-white/50" : "text-muted"}`}
    >
      {n} / {label}
    </div>
  );
}
