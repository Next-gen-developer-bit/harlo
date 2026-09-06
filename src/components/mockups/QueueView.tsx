const slots = [
  { day: "Monday", time: "9:00 AM", filled: true },
  { day: "Wednesday", time: "1:00 PM", filled: true },
  { day: "Friday", time: "6:00 PM", filled: false },
];

export default function QueueView() {
  return (
    <div className="space-y-3">
      {slots.map((s) => (
        <div
          key={s.day}
          className="flex items-center justify-between rounded-2xl border border-border p-4"
        >
          <div>
            <div className="text-[14px] font-medium">{s.day}</div>
            <div className="text-[12px] text-muted">{s.time}</div>
          </div>
          {s.filled ? (
            <div className="flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-[12px] font-medium text-primary">
              Post queued
            </div>
          ) : (
            <div className="rounded-full border border-dashed border-border px-3 py-1.5 text-[12px] text-muted">
              Next available
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
