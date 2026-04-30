"use client";

import { motion } from "framer-motion";

const TILES = [
  {
    title: "Harita keşfi",
    desc: "Yakınındaki etkinlikler haritada — kategoriye, mesafeye, zamana göre filtre.",
    grad: "from-violet-500/35 to-fuchsia-500/20",
  },
  {
    title: "Grup sohbeti",
    desc: "Etkinliğe katıldığın anda grup chat'ine düş; konuşmayı kaçırma.",
    grad: "from-pink-500/30 to-amber-400/20",
  },
  {
    title: "Profil & arkadaşlar",
    desc: "İlgi alanların, etkinlik geçmişin ve arkadaş ağın tek bir profilde.",
    grad: "from-sky-400/30 to-violet-500/20",
  },
  {
    title: "Bildirim akışı",
    desc: "Kişisel bildirimler kişinin fotoğrafıyla, sistemsel olanlar yıldız ikonla.",
    grad: "from-emerald-400/25 to-violet-500/20",
  },
];

export function Showcase() {
  return (
    <section id="showcase" className="section-pad">
      <div className="container-x">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.18em] text-brand-300 font-semibold">
            Galeri
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
            Uygulama içinden bölümler.
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TILES.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: i * 0.06 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] aspect-[16/10] flex items-end p-6"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${t.grad}`} />
              <div
                className="absolute inset-0 opacity-[0.10]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                  maskImage: "radial-gradient(80% 60% at 50% 40%, black, transparent)",
                }}
              />
              <div className="relative">
                <h3 className="text-xl font-semibold tracking-tight">{t.title}</h3>
                <p className="mt-1.5 text-sm text-white/75 max-w-md">{t.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
