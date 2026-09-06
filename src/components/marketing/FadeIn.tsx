"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Lightweight scroll-reveal wrapper built on IntersectionObserver — no
 * animation library. Content is visible by default (safe for no-JS,
 * crawlers, print, and slow hydration); only once JS confirms the element
 * is genuinely below the fold does it hide and set up the reveal-on-scroll,
 * with a timeout safety net so it can never stay stuck invisible.
 */
export default function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) return; // already in view — nothing to animate

    setVisible(false);
    setAnimated(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);

    // Safety net — content must never stay hidden indefinitely.
    const timeout = setTimeout(() => setVisible(true), 4000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        // "none" once settled, not "translateY(0)" — any non-"none" transform
        // on an ancestor breaks position:sticky for descendants (e.g. the
        // pricing comparison table's sticky header), so it must be cleared
        // once the reveal finishes rather than left at an identity transform.
        transform: visible ? "none" : "translateY(16px)",
        transition: animated ? `opacity 500ms ease ${delay}ms, transform 500ms ease ${delay}ms` : "none",
      }}
    >
      {children}
    </div>
  );
}
