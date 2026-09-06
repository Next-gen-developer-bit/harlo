"use client";

import { useState } from "react";
import BillingToggle from "@/components/marketing/BillingToggle";
import PricingCard from "@/components/marketing/PricingCard";
import { plans, type BillingPeriod } from "@/lib/pricing-data";

export default function PricingCards() {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");

  return (
    <div>
      <div className="mt-6 flex justify-center">
        <BillingToggle value={billing} onChange={setBilling} />
      </div>

      <p className="mx-auto mt-4 max-w-sm text-center text-[13px] leading-relaxed text-muted">
        14-day free trial on all paid plans. Cancel anytime.
      </p>

      <div className="fade-text mx-auto mt-10 grid max-w-6xl items-stretch gap-5 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} billing={billing} />
        ))}
      </div>
    </div>
  );
}
