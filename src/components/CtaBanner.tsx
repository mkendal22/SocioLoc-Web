"use client";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { StoreBadges } from "./StoreBadges";

export function CtaBanner() {
  return (
    <section className="section-pad">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[24px] sm:rounded-[36px] border border-white/10 px-5 sm:px-12 py-12 sm:py-20 lg:py-24"
        >
          {/* Background layers */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-brand-700/45 via-fuchsia-600/35 to-pink-500/25"
          />
          <div
            aria-hidden
            className="absolute -inset-1 opacity-40 blur-3xl bg-gradient-to-tr from-brand-500/50 to-fuchsia-500/50"
          />
          <div aria-hidden className="absolute inset-0 bg-grid opacity-30" />
          <div className="noise" />

          {/* Decorative orbs */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 0.7, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="absolute -top-20 -right-10 size-72 rounded-full bg-pink-500/40 blur-3xl"
          />
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 0.7, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.15 }}
            className="absolute -bottom-32 -left-10 size-80 rounded-full bg-brand-500/40 blur-3xl"
          />

          <div className="relative flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs text-white/85 backdrop-blur">
              <Sparkles className="size-3.5 text-brand-200" />
              SocioLoc’a katıl
            </span>

            <h3 className="mt-5 sm:mt-6 text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] max-w-3xl text-balance">
              Sosyal hayatına <span className="gradient-text-shimmer">bugün</span> başla.
            </h3>
            <p className="mt-4 sm:mt-5 text-sm sm:text-base text-white/80 max-w-xl text-balance">
              Saniyeler içinde indir, ilk etkinliğine bu hafta katıl. Topluluk seni bekliyor.
            </p>

            <div className="mt-9 flex justify-center">
              <StoreBadges size="lg" />
            </div>

            <div className="mt-7 flex items-center gap-3 text-xs text-white/65">
              <div className="flex -space-x-2">
                {["bg-amber-300", "bg-rose-300", "bg-violet-300", "bg-fuchsia-300"].map((c, i) => (
                  <span
                    key={i}
                    className={`size-7 rounded-full ${c} ring-2 ring-black/40`}
                    aria-hidden
                  />
                ))}
              </div>
              <span>10.000+ kullanıcı zaten aramızda</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
