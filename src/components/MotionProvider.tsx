"use client";

import { MotionConfig } from "framer-motion";

/**
 * İşletim sisteminde "hareketi azalt" açıksa Framer Motion'ın kayma/ölçek
 * animasyonlarını kapatır (CSS animasyonları globals.css'te ayrıca kapalı).
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
