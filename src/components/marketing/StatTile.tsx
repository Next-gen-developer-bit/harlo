export default function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-border bg-surface/60 p-4">
      <div className="text-[11px] text-muted">{label}</div>
      <div className="mt-1 text-[16px] font-semibold text-foreground">{value}</div>
    </div>
  );
}
