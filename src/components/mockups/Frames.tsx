import type { ReactNode } from "react";
import { LogoMark } from "@/components/brand/Logo";

// The Harlo Product Frame — a recognisable window into the application,
// not a recreated Chrome/macOS browser chrome (no traffic-light dots).
// Thin dark border + minimal shadow instead of a soft floating one; the H
// mark + app label read as "this is Harlo," not "this is a screenshot."
export function BrowserFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-[var(--radius-frame)] border border-border-dark bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <LogoMark size={16} className="shrink-0 opacity-90" />
        <div className="text-[12px] font-medium text-muted">app.harlosocial.com</div>
      </div>
      <div className="bg-white">{children}</div>
    </div>
  );
}

export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative mx-auto w-[260px] ${className}`}>
      <div className="relative overflow-hidden rounded-[42px] border-[6px] border-[#0b0b0f] bg-white shadow-[0_30px_60px_-20px_rgba(20,20,40,0.35)]">
        <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-[#0b0b0f]" />
        <div className="min-h-[540px] bg-white pt-8">{children}</div>
        <div className="absolute bottom-1.5 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-[#0b0b0f]/70" />
      </div>
    </div>
  );
}
