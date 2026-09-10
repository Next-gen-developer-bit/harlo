"use client";

import { useEffect, useState } from "react";

export type LegalSectionRef = { id: string; label: string };

export default function LegalToc({ sections }: { sections: LegalSectionRef[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <>
      {/* Desktop sticky sidebar */}
      <nav className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-4">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-muted">On this page</div>
          <ul className="space-y-0.5 border-l border-border">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={`-ml-px block border-l-2 py-1.5 pl-4 text-[13px] transition-colors duration-200 ${
                    active === s.id
                      ? "border-primary font-medium text-primary"
                      : "border-transparent text-muted hover:text-foreground"
                  }`}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile horizontal section nav */}
      <div className="mb-8 -mx-6 overflow-x-auto px-6 lg:hidden">
        <div className="flex gap-2 pb-2">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors duration-200 ${
                active === s.id ? "border-primary bg-primary-soft text-primary" : "border-border text-muted"
              }`}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
