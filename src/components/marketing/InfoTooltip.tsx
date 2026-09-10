"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";

// The comparison table's scroll pane uses `overflow-auto` to make its sticky
// header work (see PricingComparisonTable), which also clips any
// `position: absolute` child that tries to float outside the row it's in.
// Portaling a `position: fixed` panel straight to <body>, positioned from
// the trigger's own screen coordinates, sidesteps that clipping entirely.
export default function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  const show = () => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCoords({ top: rect.bottom + 8, left: rect.left + rect.width / 2 });
    setOpen(true);
  };
  const hide = () => setOpen(false);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label="More info"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={(e) => {
          e.stopPropagation();
          open ? hide() : show();
        }}
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-border text-[9.5px] font-semibold leading-none text-muted transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        i
      </button>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <span
            role="tooltip"
            className="fixed z-[100] w-[190px] -translate-x-1/2 rounded-xl border border-border bg-white p-2.5 text-[11.5px] font-normal normal-case leading-relaxed text-foreground shadow-lg"
            style={{ top: coords.top, left: coords.left }}
          >
            {text}
          </span>,
          document.body
        )}
    </>
  );
}
