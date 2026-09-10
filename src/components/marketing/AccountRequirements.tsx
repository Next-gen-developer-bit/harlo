export default function AccountRequirements({
  platformName,
  supported,
  notSupported,
  connectionMethod,
  note,
}: {
  platformName: string;
  supported: string[];
  notSupported?: string;
  connectionMethod: string;
  note?: string;
}) {
  const columns = notSupported ? 3 : 2;

  return (
    <div className="rounded-[10px] border border-border bg-surface/60 p-6 md:p-8">
      <div className="mb-5">
        <div className="text-[12px] font-semibold uppercase tracking-wide text-muted">Account requirements</div>
        <p className="mt-1.5 text-[13.5px] text-muted">What can connect to Harlo for {platformName}.</p>
      </div>

      <div className={`grid gap-6 divide-y divide-border md:divide-y-0 md:divide-x ${columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        <div className={columns === 3 ? "md:pr-6" : "md:pr-6"}>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">Supported</div>
          <ul className="mt-2.5 space-y-2">
            {supported.map((s) => (
              <li key={s} className="flex items-start gap-2 text-[13.5px] text-foreground">
                <CheckGlyph />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {notSupported && (
          <div className="pt-5 md:px-6 md:pt-0">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">Not supported</div>
            <div className="mt-2.5 flex items-start gap-2 text-[13.5px] text-muted">
              <CrossGlyph />
              <span>{notSupported}</span>
            </div>
          </div>
        )}

        <div className="pt-5 md:pl-6 md:pt-0">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">Connection</div>
          <p className="mt-2.5 text-[13.5px] leading-relaxed text-foreground">{connectionMethod}</p>
        </div>
      </div>

      {note && (
        <p className="mt-5 border-t border-border pt-4 text-[12.5px] leading-relaxed text-muted">{note}</p>
      )}
    </div>
  );
}

function CheckGlyph() {
  return (
    <span aria-hidden="true" className="mt-0.5 shrink-0 text-[13px] leading-none text-primary">
      ✓
    </span>
  );
}
function CrossGlyph() {
  return (
    <span aria-hidden="true" className="mt-0.5 shrink-0 text-[13px] leading-none text-muted">
      ×
    </span>
  );
}
