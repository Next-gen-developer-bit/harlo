const members = [
  { name: "Jordan Reyes", role: "Owner", color: "#3D5AFE" },
  { name: "Priya Shah", role: "Editor", color: "#C2296B" },
  { name: "Marcus Tran", role: "Reviewer", color: "#1958C7" },
  { name: "Alex Kim", role: "Editor", color: "#26262B" },
];

export default function TeamView() {
  return (
    <div className="space-y-2.5">
      {members.map((m) => (
        <div key={m.name} className="flex items-center justify-between rounded-2xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-semibold text-white"
              style={{ backgroundColor: m.color }}
            >
              {m.name.charAt(0)}
            </div>
            <div className="text-[13.5px] font-medium text-foreground">{m.name}</div>
          </div>
          <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-muted">{m.role}</span>
        </div>
      ))}
      <div className="flex items-center gap-2 rounded-2xl border border-dashed border-border p-4 text-[13px] text-muted">
        + Invite team member
      </div>
    </div>
  );
}
