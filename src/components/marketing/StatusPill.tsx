const statusStyles: Record<string, string> = {
  Draft: "bg-surface-2 text-muted",
  "In Review": "bg-[#FFF3E8] text-[#C2670A]",
  "Needs Review": "bg-[#FFF3E8] text-[#C2670A]",
  Approved: "bg-[#F3EDFE] text-[#7C4DFF]",
  Scheduled: "bg-primary-soft text-primary",
  Publishing: "bg-primary-soft text-primary",
  Published: "bg-[#E7F7EE] text-[#16A34A]",
  "Needs Attention": "bg-[#FDEDED] text-[#DC2626]",
};

export default function StatusPill({ status, className = "" }: { status: string; className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
        statusStyles[status] ?? "bg-surface-2 text-muted"
      } ${className}`}
    >
      {status}
    </span>
  );
}
