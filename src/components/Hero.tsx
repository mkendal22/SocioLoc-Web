"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, Star } from "lucide-react";
import { useRef } from "react";
import { Aurora } from "./Aurora";
import { Spotlight } from "./Spotlight";
import { Counter } from "./Counter";
import { StoreBadges } from "./StoreBadges";

export function Hero() {
  const phoneRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [10, -10]), { stiffness: 130, damping: 15 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-10, 10]), { stiffness: 130, damping: 15 });
  const tx = useSpring(useTransform(mx, [-1, 1], [-12, 12]), { stiffness: 130, damping: 18 });
  const ty = useSpring(useTransform(my, [-1, 1], [-12, 12]), { stiffness: 130, damping: 18 });

  const handleMouse = (e: React.MouseEvent) => {
    const el = phoneRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(x * 2);
    my.set(y * 2);
  };
  const handleLeave = () => { mx.set(0); my.set(0); };

  return (
    <section className="relative overflow-hidden">
      <Aurora />
      <Spotlight />
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-50" aria-hidden />
      <div className="noise" />

      <div className="container-x section-pad pt-20 sm:pt-24 lg:pt-28 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
        <div className="lg:col-span-7">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur px-3 py-1.5 text-xs text-white/85"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full size-1.5 bg-brand-400" />
            </span>
            <Sparkles className="size-3.5 text-brand-300" />
            Türkiye’nin sosyal etkinlik ağı
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 text-[2.5rem] sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1] text-balance"
          >
            <span className="gradient-text-shimmer">Yakınındaki</span>
            <br />
            etkinlikleri keşfet,
            <br />
            <span className="gradient-text">tanış.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 text-base sm:text-lg text-white/65 max-w-xl leading-relaxed"
          >
            SocioLoc; haritadaki etkinlikleri görür, ilgi alanına göre filtreler,
            anlık sohbet ve grupla katıldığın insanlarla gerçek hayatta tanışırsın.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8"
            id="download"
          >
            <StoreBadges size="lg" />
          </motion.div>

          {/* Rating + verified badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-6 text-sm text-white/65"
          >
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span>4.9 / 5</span>
              <span className="text-white/30">·</span>
              <span>2.000+ değerlendirme</span>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-9 grid grid-cols-3 gap-3 sm:gap-6 max-w-md"
          >
            {[
              { to: 10000, suffix: "+", v: "kullanıcı" },
              { to: 1200, suffix: "+", v: "etkinlik" },
              { to: 25, suffix: "+", v: "şehir" },
            ].map((s) => (
              <div key={s.v}>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight gradient-text">
                  <Counter to={s.to} suffix={s.suffix} />
                </div>
                <div className="text-[11px] sm:text-xs text-white/55 mt-1.5">{s.v}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Phone with parallax tilt */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 relative flex justify-center lg:justify-end"
        >
          <div
            ref={phoneRef}
            onMouseMove={handleMouse}
            onMouseLeave={handleLeave}
            className="relative tilt-3d w-[78%] xs:w-[68%] sm:w-[60%] lg:w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[400px]"
          >
            <div className="absolute -inset-12 rounded-[40px] bg-gradient-to-tr from-brand-500/35 via-fuchsia-500/25 to-transparent blur-3xl" aria-hidden />

            <motion.div
              style={{
                rotateX: rx,
                rotateY: ry,
                x: tx,
                y: ty,
                transformStyle: "preserve-3d",
              }}
              className="relative aspect-[472/1024] rounded-[36px] overflow-hidden border border-white/10 glow-purple"
            >
              <Image
                src="/screens/02.png"
                alt="SocioLoc — yakınındaki etkinlikleri haritada keşfet"
                fill
                priority
                sizes="(min-width: 1024px) 400px, 360px"
                className="object-cover"
              />
              {/* shine overlay */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"
              />
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
