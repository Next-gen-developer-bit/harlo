"use client";

import type { BillingPeriod } from "@/lib/pricing-data";

export default function BillingToggle({
  value,
  onChange,
}: {
  value: BillingPeriod;
  onChange: (value: BillingPeriod) => void;
}) {
  const isAnnual = value === "annual";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isAnnual}
      aria-label="Bill annually and save 20%"
      onClick={() => onChange(isAnnual ? "monthly" : "annual")}
      className="inline-flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
    >
      <span
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 ${
          isAnnual ? "bg-primary" : "bg-surface-2"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(16,24,40,0.3)] transition-transform duration-200 ease-out ${
            isAnnual ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </span>
      <span className="flex items-center gap-2">
        <span className="text-[14.5px] font-medium text-foreground">Pay annually</span>
        <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11.5px] font-medium text-primary">
          Save 20%
        </span>
      </span>
    </button>
  );
}
