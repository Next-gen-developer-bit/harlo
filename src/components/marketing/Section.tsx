import type { ReactNode } from "react";
import Container from "@/components/ui/Container";

export default function Section({
  children,
  className = "",
  containerClassName = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-20 py-section ${className}`}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
