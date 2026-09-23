"use client";

import { motion } from "framer-motion";
import {
  MapPinned,
  MessagesSquare,
  Users,
  CalendarPlus,
  ShieldCheck,
  Bell,
  Sparkles,
} from "lucide-react";

export function Features() {
  return (
    <section id="features" className="relative section-pad">
      <div className="container-x relative">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs uppercase tracking-[0.18em] text-brand-300 font-semibold"
          >
            Özellikler
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-balance"
          >
            Etkinlik bul, sohbet et, <span className="gradient-text">tanış.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 text-white/65 max-w-xl text-balance"
          >
            SocioLoc, sosyal hayatı tek bir uygulamada toplar. Tek tap ile etkinliğe katıl,
            grup sohbetine düş, yeni insanlarla tanış.
          </motion.p>
        </div>

        {/* Bento grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 auto-rows-[minmax(180px,auto)] gap-4 lg:gap-5">
          {/* HERO card — Map */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="card-grad p-6 sm:p-8 sm:col-span-2 lg:col-span-4 lg:row-span-2 relative overflow-hidden group"
          >
            {/* decorative map */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-50"
              style={{
                background:
                  "radial-gradient(800px 400px at 70% -20%, rgba(139,92,246,0.35), transparent 60%), radial-gradient(600px 400px at 30% 120%, rgba(217,70,239,0.25), transparent 60%)",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-grid opacity-30 transition-opacity duration-500 group-hover:opacity-60"
            />
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl bg-gradient-to-br from-brand-500 to-fuchsia-500 grid place-items-center shadow-[0_10px_30px_-8px_rgba(139,92,246,0.7)]">
                  <MapPinned className="size-6" />
                </div>
                <span className="text-xs uppercase tracking-[0.16em] text-white/60 font-semibold">
                  Konum-tabanlı
                </span>
              </div>
              <h3 className="mt-5 sm:mt-6 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight">
                Haritada gerçek zamanlı keşif
              </h3>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-white/65 max-w-md">
                Yakındaki etkinlikleri kategoriye, mesafeye ve zamana göre filtrele. Bir
                tap ile detaya git, katıl.
              </p>

              {/* mini fake pins */}
              <div className="mt-8 flex -space-x-2">
                {["bg-brand-500", "bg-fuchsia-500", "bg-pink-500", "bg-violet-500"].map(
                  (c, i) => (
                    <span
                      key={i}
                      className={`size-9 rounded-full ${c} ring-2 ring-black/30 grid place-items-center text-xs font-bold`}
                    >
                      {i === 0 ? "🎵" : i === 1 ? "🍳" : i === 2 ? "🧘" : "⚽"}
                    </span>
                  )
                )}
                <span className="size-9 rounded-full bg-white/10 ring-2 ring-black/30 grid place-items-center text-xs font-bold">
                  +24
                </span>
              </div>
            </div>
          </motion.div>

          {/* Card — Chat */}
          <FeatureCard
            icon={MessagesSquare}
            title="Anlık sohbet"
            desc="Bire bir mesaj, grup sohbeti, fotoğraf ve etkinlik paylaşımı."
            className="lg:col-span-2"
            delay={0.05}
          />

          {/* Card — Groups */}
          <FeatureCard
            icon={Users}
            title="Etkinlik grupları"
            desc="Katıldığın etkinliğin grup chat'inde kolayca tanış, organize ol."
            className="lg:col-span-2"
            delay={0.1}
          />

          {/* Card — Create */}
          <FeatureCard
            icon={CalendarPlus}
            title="Hızlı oluşturma"
            desc="Birkaç adımda kendi etkinliğini yarat, davet linkini paylaş."
            className="lg:col-span-2"
            delay={0.15}
          />

          {/* Card — Notifications */}
          <FeatureCard
            icon={Bell}
            title="Akıllı bildirim"
            desc="İlgi alanına ve konumuna göre kişiselleşen bildirim akışı."
            className="lg:col-span-2"
            delay={0.2}
          />

          {/* Card — Safety */}
          <FeatureCard
            icon={ShieldCheck}
            title="Güvenli topluluk"
            desc="Engelleme, raporlama ve kimlik doğrulama ile güvende hisset."
            className="lg:col-span-2"
            delay={0.25}
            accent="from-emerald-500/30 to-brand-500/30"
            iconBg="from-emerald-400 to-brand-500"
          />
        </div>

        {/* Tag line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex items-center gap-2 text-sm text-white/55"
        >
          <Sparkles className="size-4 text-brand-300" />
          Ücretli bilet, QR giriş ve işletme paneli uygulamada.
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
  className,
  delay = 0,
  iconBg = "from-brand-500 to-fuchsia-500",
  accent = "from-brand-500/20 to-fuchsia-500/20",
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  className?: string;
  delay?: number;
  iconBg?: string;
  accent?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay }}
      className={`card-grad p-6 group relative overflow-hidden ${className ?? ""}`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-gradient-to-br ${accent} blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500`}
      />
      <div className="relative">
        <div
          className={`size-11 rounded-xl bg-gradient-to-br ${iconBg} grid place-items-center shadow-[0_8px_24px_-8px_rgba(139,92,246,0.6)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
        >
          <Icon className="size-5 text-white" />
        </div>
        <h3 className="mt-5 text-xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 text-sm text-white/60 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}
