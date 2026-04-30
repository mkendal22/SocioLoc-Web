"use client";

import { useEffect, useRef } from "react";

/**
 * Mouse-following soft radial spotlight overlay.
 * Wrap inside a relatively positioned container.
 */
export function Spotlight({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--x", `${e.clientX - rect.left}px`);
      el.style.setProperty("--y", `${e.clientY - rect.top}px`);
    };
    const parent = el.parentElement;
    parent?.addEventListener("mousemove", onMove);
    return () => parent?.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 spotlight transition-opacity duration-300 ${className}`}
    />
  );
}
