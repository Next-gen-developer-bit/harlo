const workspaces = [
  { name: "Personal Brand", accounts: 4, color: "#3D5AFE" },
  { name: "Bloom & Co", accounts: 6, color: "#26262B" },
  { name: "Vela Studio", accounts: 3, color: "#C2296B", active: true },
  { name: "Peak Fitness", accounts: 5, color: "#1958C7" },
];

// A small overlapping "currently viewing" selector, not just four equal
// cards — this is what visually demonstrates switching between brands
// rather than a caption explaining that switching exists.
export default function WorkspacesView() {
  return (
    <div className="relative">
      <div className="absolute -right-2 -top-2 z-10 flex items-center gap-1.5 rounded-full border border-border-dark bg-white py-1 pl-1 pr-3 shadow-[0_6px_16px_-6px_rgba(20,20,40,0.25)]">
        <span className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white" style={{ backgroundColor: "#C2296B" }}>
          V
        </span>
        <span className="text-[11.5px] font-medium text-foreground">Vela Studio</span>
        <span aria-hidden="true" className="text-[9px] text-muted">▾</span>
      </div>
      <div className="grid gap-3 pt-2 sm:grid-cols-2">
        {workspaces.map((w) => (
          <div
            key={w.name}
            className={`rounded-2xl border p-4 ${w.active ? "border-border-dark bg-white" : "border-border bg-white/60"}`}
          >
            <div className="mb-3 flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-semibold text-white"
                style={{ backgroundColor: w.color }}
              >
                {w.name.charAt(0)}
              </div>
              <div className="text-[14px] font-medium">{w.name}</div>
            </div>
            <div className="text-[12px] text-muted">{w.accounts} connected accounts</div>
          </div>
        ))}
      </div>
    </div>
  );
}
