"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    n: "01",
    t: "İndir & üye ol",
    d: "App Store veya Google Play'den uygulamayı indir, telefon veya e-posta ile saniyeler içinde başla.",
  },
  {
    n: "02",
    t: "Etkinlik bul ya da oluştur",
    d: "Haritada yakınındaki etkinlikleri keşfet veya birkaç adımda kendi etkinliğini yarat.",
  },
  {
    n: "03",
    t: "Katıl, sohbet et, tanış",
    d: "Etkinliğe katıl, grup chat'inde organize ol; gerçek hayatta yeni insanlarla buluş.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="section-pad bg-black/30 border-y border-white/5">
      <div className="container-x">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.18em] text-brand-300 font-semibold">
            Nasıl çalışır
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
            3 adımda sosyal hayatına dön.
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <div className="text-5xl font-bold text-white/15 tabular-nums">{s.n}</div>
              <h3 className="mt-2 text-xl font-semibold tracking-tight">{s.t}</h3>
              <p className="mt-2 text-sm text-white/65 leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
