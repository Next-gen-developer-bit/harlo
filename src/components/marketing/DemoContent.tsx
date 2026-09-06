"use client";

import { useState } from "react";
import Section from "@/components/marketing/Section";
import FinalCta from "@/components/marketing/FinalCta";
import Eyebrow from "@/components/ui/Eyebrow";
import { BrowserFrame } from "@/components/mockups/Frames";
import { AppShell } from "@/components/mockups/AppShell";
import CalendarView from "@/components/mockups/CalendarView";
import ComposerView from "@/components/mockups/ComposerView";
import AnalyticsView from "@/components/mockups/AnalyticsView";
import QueueView from "@/components/mockups/QueueView";

const tabs = [
  { key: "calendar", label: "Calendar", title: "Calendar", view: <CalendarView /> },
  { key: "composer", label: "Compose", title: "New Post", view: <ComposerView /> },
  { key: "analytics", label: "Analytics", title: "Analytics", view: <AnalyticsView /> },
  { key: "queue", label: "Queue", title: "Queue", view: <div className="max-w-sm"><QueueView /></div> },
] as const;

export default function DemoContent() {
  const [active, setActive] = useState<(typeof tabs)[number]["key"]>("calendar");
  const current = tabs.find((t) => t.key === active)!;

  return (
    <>
      <Section className="pb-10 pt-16 text-center md:pt-20">
        <div className="flex justify-center">
          <Eyebrow>Product preview</Eyebrow>
        </div>
        <h1 className="balance mx-auto mt-6 max-w-xl text-h1-page font-semibold text-foreground">
          Take a look around.
        </h1>
        <p className="balance mx-auto mt-5 max-w-md text-[16px] leading-relaxed text-muted md:text-[18px]">
          No sign-up required. Click through the calendar, composer, analytics and queue to see how Harlo works.
        </p>
      </Section>

      <Section className="pt-0">
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`rounded-full px-4 py-2 text-[13.5px] font-medium transition-all duration-200 ${
                active === t.key
                  ? "bg-primary text-white shadow-[0_6px_16px_-4px_rgba(61,90,254,0.5)]"
                  : "bg-surface text-foreground hover:-translate-y-0.5 hover:bg-surface-2"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <BrowserFrame className="mx-auto max-w-[980px]">
          <AppShell title={current.title}>{current.view}</AppShell>
        </BrowserFrame>
      </Section>

      <FinalCta title="Ready to try it yourself?" description="Create a free account and start scheduling in minutes." />
    </>
  );
}
