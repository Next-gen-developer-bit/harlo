const items = [
  { type: "image", tag: "Product" },
  { type: "video", tag: "Behind the scenes" },
  { type: "image", tag: "Quotes" },
  { type: "image", tag: "Product" },
  { type: "video", tag: "Tutorial" },
  { type: "image", tag: "Launch" },
  { type: "image", tag: "UGC" },
  { type: "video", tag: "Teaser" },
];

export default function ContentLibraryView() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {items.map((it, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-border">
          <div className="flex h-20 items-center justify-center bg-surface-2">
            {it.type === "video" ? <PlayGlyph /> : <ImageGlyph />}
          </div>
          <div className="px-2.5 py-2 text-[11px] font-medium text-foreground">{it.tag}</div>
        </div>
      ))}
    </div>
  );
}

function ImageGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-muted">
      <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 16l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function PlayGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-muted">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.5 9.5v5l4-2.5-4-2.5Z" fill="currentColor" />
    </svg>
  );
}
