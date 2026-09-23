"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";

export function Counter({
  from = 0,
  to,
  duration = 1.6,
  suffix = "",
  prefix = "",
  format,
}: {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  format?: (n: number) => string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  // Sunucu HTML'i ve ilk boyama son değeri gösterir: JS'siz ziyaretçiler ve
  // önizleme botları "0" görmez. Metin MotionValue'dan basılır (re-render yok).
  const value = useMotionValue(to);
  const text = useTransform(value, (v) => {
    const n = format ? format(v) : Math.round(v).toLocaleString("tr-TR");
    return `${prefix}${n}${suffix}`;
  });
  const armed = useRef(false);

  // Yüklemede ekran dışındaysa sıfırlanır ve görünür olunca sayarak gelir;
  // ekrandaysa, sekme arka plandaysa ya da hareket azaltılmışsa son değer
  // olduğu gibi kalır (hiçbir durumda "0"da takılmaz).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hidden =
      document.visibilityState !== "visible" || window.innerHeight === 0;
    const { top, bottom } = el.getBoundingClientRect();
    if (reduce || hidden || (top < window.innerHeight && bottom > 0)) return;
    armed.current = true;
    value.set(from);
  }, [from, value]);

  useEffect(() => {
    if (!inView || !armed.current) return;
    armed.current = false;
    const controls = animate(value, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [inView, to, duration, value]);

  return (
    <motion.span ref={ref} className="tabular-nums">
      {text}
    </motion.span>
  );
}
