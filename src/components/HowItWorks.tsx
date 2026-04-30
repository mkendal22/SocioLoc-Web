"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Download, Compass, PartyPopper } from "lucide-react";

const STEPS = [
  {
    n: "01",
    icon: Download,
    t: "İndir & üye ol",
    d: "App Store veya Google Play'den uygulamayı indir, telefon veya e-posta ile saniyeler içinde başla.",
    chip: "30 sn",
  },
  {
    n: "02",
    icon: Compass,
    t: "Etkinlik bul ya da oluştur",
    d: "Haritada yakınındaki etkinlikleri keşfet veya birkaç adımda kendi etkinliğini yarat.",
    chip: "Sınırsız",
  },
  {
    n: "03",
    icon: PartyPopper,
    t: "Katıl, sohbet et, tanış",
    d: "Etkinliğe katıl, grup chat'inde organize ol; gerçek hayatta yeni insanlarla buluş.",
    chip: "Hayatın",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 30%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="how" className="relative section-pad bg-black/40 border-y border-white/5 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(900px 500px at 80% 0%, rgba(139,92,246,0.18), transparent 60%), radial-gradient(900px 500px at 0% 100%, rgba(217,70,239,0.12), transparent 60%)",
        }}
      />
      <div className="container-x relative">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs uppercase tracking-[0.18em] text-brand-300 font-semibold"
          >
            Nasıl çalışır
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-balance"
          >
            3 adımda <span className="gradient-text">sosyal hayatına</span> dön.
          </motion.h2>
        </div>

        {/* Timeline */}
        <div ref={ref} className="relative mt-16">
          {/* vertical animated line (mobile + lg center) */}
          <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-px bg-white/10" aria-hidden />
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-6 lg:left-1/2 top-0 w-px bg-gradient-to-b from-brand-500 via-fuchsia-500 to-pink-500"
            aria-hidden
          />

          <div className="space-y-14 sm:space-y-20">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const reverse = i % 2 === 1;
              return (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  className={[
                    "relative grid lg:grid-cols-2 gap-6 lg:gap-12",
                    "pl-16 lg:pl-0",
                  ].join(" ")}
                >
                  {/* Bullet on the line */}
                  <div
                    className="absolute left-6 lg:left-1/2 top-2 -translate-x-1/2"
                    aria-hidden
                  >
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-brand-500 animate-ping opacity-30" />
                      <div className="relative size-4 rounded-full bg-gradient-to-br from-brand-500 to-fuchsia-500 ring-4 ring-black" />
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className={[
                      "card-grad p-6 sm:p-8 group",
                      reverse ? "lg:col-start-2" : "lg:col-start-1",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="size-11 sm:size-12 rounded-2xl bg-gradient-to-br from-brand-500 to-fuchsia-500 grid place-items-center shadow-[0_10px_30px_-8px_rgba(139,92,246,0.7)] transition-transform group-hover:scale-110 shrink-0">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <div className="text-5xl sm:text-7xl font-bold leading-none tracking-tight bg-gradient-to-br from-white/20 to-white/[0.04] bg-clip-text text-transparent">
                          {s.n}
                        </div>
                      </div>
                      <span className="ml-auto text-[11px] sm:text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/65 font-medium shrink-0">
                        {s.chip}
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight">
                      {s.t}
                    </h3>
                    <p className="mt-3 text-sm sm:text-base text-white/65 leading-relaxed">
                      {s.d}
                    </p>
                  </div>

                  {/* spacer for alternating columns */}
                  <div className="hidden lg:block" aria-hidden />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
