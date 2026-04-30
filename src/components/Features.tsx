"use client";

import { motion } from "framer-motion";
import {
  MapPinned,
  MessagesSquare,
  Users,
  CalendarPlus,
  ShieldCheck,
  Bell,
} from "lucide-react";

const ITEMS = [
  {
    icon: MapPinned,
    title: "Haritada keşif",
    desc: "Yakınındaki etkinlikleri canlı haritada filtrele, kategoriye göre bul.",
  },
  {
    icon: MessagesSquare,
    title: "Anlık sohbet",
    desc: "Bire bir mesaj, grup sohbeti, fotoğraf ve etkinlik paylaşımı.",
  },
  {
    icon: Users,
    title: "Etkinlik grupları",
    desc: "Katıldığın etkinliğin grup chat'inde kolayca tanış, organize ol.",
  },
  {
    icon: CalendarPlus,
    title: "Hızlı oluşturma",
    desc: "Birkaç adımda kendi etkinliğini yarat, davet linkini paylaş.",
  },
  {
    icon: Bell,
    title: "Akıllı bildirim",
    desc: "İlgi alanına ve konumuna göre kişiselleşen bildirim akışı.",
  },
  {
    icon: ShieldCheck,
    title: "Güvenli topluluk",
    desc: "Engelleme, raporlama ve içerik moderasyonu ile güvende hisset.",
  },
];

export function Features() {
  return (
    <section id="features" className="section-pad">
      <div className="container-x">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.18em] text-brand-300 font-semibold">
            Özellikler
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
            Etkinlik bul, sohbet et, <span className="gradient-text">tanış.</span>
          </h2>
          <p className="mt-4 text-white/65 text-balance">
            SocioLoc, sosyal hayatı tek bir uygulamada toplar. Tek tap ile etkinliğe katıl,
            grup sohbetine düş, yeni insanlarla tanış.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ITEMS.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass rounded-2xl p-5 hover:border-white/20 transition-colors"
            >
              <div className="size-10 rounded-xl bg-gradient-to-br from-brand-500/30 to-fuchsia-500/30 grid place-items-center border border-white/10">
                <it.icon className="size-5 text-brand-300" />
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{it.title}</h3>
              <p className="mt-1.5 text-sm text-white/65 leading-relaxed">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
