"use client";

import { motion } from "framer-motion";
import { MapPin, MessageCircle, Heart } from "lucide-react";

/**
 * Görsel olmadığı için bir telefon mockup'ı SVG/CSS ile çiziyoruz.
 * Hero alanında ürünü "his" olarak sergilemek için yeterli.
 */
export function PhoneMock() {
  return (
    <div className="relative">
      <div className="relative w-[280px] sm:w-[320px] aspect-[9/19] rounded-[44px] border border-white/10 bg-gradient-to-b from-[#1a1626] to-[#0c0a14] shadow-[0_30px_80px_-20px_rgba(139,92,246,0.55)] overflow-hidden">
        {/* notch */}
        <div className="absolute left-1/2 top-2 -translate-x-1/2 h-6 w-32 rounded-full bg-black/80 border border-white/10 z-20" />

        {/* status bar */}
        <div className="absolute top-3 left-6 right-6 flex items-center justify-between text-[10px] text-white/70 z-30 mt-[2px]">
          <span>9:41</span>
          <span className="opacity-60">●●●</span>
        </div>

        {/* content */}
        <div className="absolute inset-0 pt-12 px-5 pb-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Keşfet</h3>
            <div className="size-7 rounded-full bg-white/10 grid place-items-center">
              <Heart className="size-3.5 text-pink-300" />
            </div>
          </div>

          {/* map preview */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="relative h-44 rounded-2xl overflow-hidden border border-white/10"
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 80% at 30% 30%, rgba(139,92,246,0.35), transparent 60%), radial-gradient(120% 80% at 80% 70%, rgba(236,72,153,0.30), transparent 60%), #0b0a14",
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.18]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
            {[
              { left: "20%", top: "35%" },
              { left: "55%", top: "55%" },
              { left: "70%", top: "25%" },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.12, type: "spring", stiffness: 220, damping: 16 }}
                className="absolute"
                style={{ left: p.left, top: p.top }}
              >
                <div className="relative">
                  <div className="absolute -inset-2 rounded-full bg-brand-500/40 animate-ping" />
                  <div className="size-6 rounded-full bg-gradient-to-br from-brand-500 to-fuchsia-500 grid place-items-center shadow">
                    <MapPin className="size-3.5 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* event card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-amber-300 to-pink-400" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">Kasımpaşa Mangal Pikniği</div>
                <div className="text-[11px] text-white/55 truncate">Bugün 19:30 · 12 katılımcı</div>
              </div>
              <button className="text-[11px] rounded-full bg-white/10 px-2.5 py-1 border border-white/10">
                Katıl
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 flex items-center gap-3"
          >
            <div className="size-9 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400" />
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-medium">Timur</div>
              <div className="text-[11px] text-white/55 truncate">
                seni etkinliğe çağırdı
              </div>
            </div>
            <MessageCircle className="size-4 text-white/55" />
          </motion.div>

          {/* bottom bar */}
          <div className="mt-auto h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-around px-3 text-white/55 text-[10px]">
            <span>Keşfet</span>
            <span>Sohbet</span>
            <div className="-mt-7 size-12 rounded-full bg-gradient-to-br from-brand-500 to-fuchsia-500 grid place-items-center shadow-[0_10px_30px_-6px_rgba(139,92,246,0.7)]">
              <MapPin className="size-5 text-white" />
            </div>
            <span>Bildirim</span>
            <span>Profil</span>
          </div>
        </div>
      </div>
    </div>
  );
}
