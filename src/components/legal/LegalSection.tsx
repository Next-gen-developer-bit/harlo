import type { ReactNode } from "react";

export default function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-b border-border py-10 first:pt-0 last:border-b-0">
      <h2 className="text-[clamp(1.375rem,1.2rem+0.5vw,1.75rem)] font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="legal-prose mt-4">{children}</div>
    </section>
  );
}
