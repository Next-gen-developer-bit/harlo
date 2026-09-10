export default function AiCaptionView() {
  return (
    <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
      <div className="mb-3 text-[12px] font-medium text-muted">Caption</div>
      <div className="rounded-2xl bg-surface p-4 text-[13.5px] leading-relaxed text-foreground">
        Big news: our summer collection just went live. Tap the link in bio to shop the drop.
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-primary-soft px-3 py-1.5 text-[12px] font-medium text-primary">
          ✦ Improve with AI
        </span>
        <span className="rounded-full border border-border px-3 py-1.5 text-[12px] font-medium text-muted">
          Rewrite for LinkedIn
        </span>
        <span className="rounded-full border border-border px-3 py-1.5 text-[12px] font-medium text-muted">
          Add hashtags
        </span>
      </div>
    </div>
  );
}
