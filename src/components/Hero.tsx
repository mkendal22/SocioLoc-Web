"use client";

import { motion } from "framer-motion";
import { Apple, Smartphone, Sparkles } from "lucide-react";
import { PhoneMock } from "./PhoneMock";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at 50% 0%, black 50%, transparent 80%)",
        }}
      />
      <div className="container-x section-pad pt-28 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
          >
            <Sparkles className="size-3.5 text-brand-300" />
            Türkiye’nin sosyal etkinlik ağı
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-balance"
          >
            <span className="gradient-text">Yakınındaki</span> etkinlikleri keşfet,
            <br className="hidden sm:block" /> sohbet et,{" "}
            <span className="gradient-text">tanış.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 text-lg text-white/70 max-w-xl"
          >
            SocioLoc; haritadaki etkinlikleri görür, ilgi alanına göre filtreler,
            anlık sohbet ve grupla katıldığın insanlarla gerçek hayatta tanışırsın.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center gap-3"
            id="download"
          >
            <a className="btn-primary" href="#" aria-label="App Store'dan indir">
              <Apple className="size-5" />
              App Store
            </a>
            <a className="btn-ghost" href="#" aria-label="Google Play'den indir">
              <Smartphone className="size-5" />
              Google Play
            </a>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-10 grid grid-cols-3 gap-6 max-w-md"
          >
            {[
              { k: "10K+", v: "kullanıcı" },
              { k: "1.2K+", v: "etkinlik" },
              { k: "20+", v: "şehir" },
            ].map((s) => (
              <div key={s.v}>
                <div className="text-2xl font-semibold tracking-tight">{s.k}</div>
                <div className="text-xs text-white/55 mt-1">{s.v}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="absolute -inset-10 rounded-[40px] bg-gradient-to-tr from-brand-500/30 via-fuchsia-500/15 to-transparent blur-2xl" />
          <PhoneMock />
        </motion.div>
      </div>
    </section>
  );
}
