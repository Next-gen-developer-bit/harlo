const stats = [
  { label: "Engagement", value: "8.4%", delta: "+1.2%" },
  { label: "Reach", value: "128.4K", delta: "+18%" },
  { label: "Followers", value: "24,910", delta: "+412" },
];

const bars = [40, 65, 50, 80, 60, 95, 70];

export default function AnalyticsView() {
  return (
    <div>
      <div className="mb-5 grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border p-4">
            <div className="text-[12px] text-muted">{s.label}</div>
            <div className="mt-1 text-[20px] font-semibold tracking-tight">{s.value}</div>
            <div className="mt-1 text-[11px] font-medium text-[#0F9D58]">{s.delta}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-border p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[13px] font-medium">Engagement this week</span>
          <span className="text-[11px] text-muted">Last 7 days</span>
        </div>
        <div className="flex h-32 items-end gap-3">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 rounded-t-lg bg-pastel-green" style={{ height: `${h}%` }}>
              <div className="h-2 rounded-t-lg bg-[#0F9D58]" style={{ opacity: i === 5 ? 1 : 0.55 }} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border p-4">
          <div className="mb-2 text-[12px] font-medium text-muted">Posts published</div>
          <div className="text-[15px] font-semibold">24 this week</div>
        </div>
        <div className="rounded-2xl border border-border p-4">
          <div className="mb-2 text-[12px] font-medium text-muted">Top performing platform</div>
          <div className="text-[15px] font-semibold">Instagram</div>
        </div>
      </div>
    </div>
  );
}
