"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Plus } from "lucide-react";

const QA = [
  {
    q: "SocioLoc ücretsiz mi?",
    a: "Evet, indirme ve temel tüm özellikler ücretsizdir. İleride opsiyonel premium etkinlik biletleme gibi ek hizmetler eklenebilir.",
  },
  {
    q: "Hangi şehirlerde aktif?",
    a: "Türkiye genelinde tüm şehirlerde kullanılabilir; etkinlik yoğunluğu büyük şehirlerde (İstanbul, Ankara, İzmir, Bursa, Antalya) daha yüksektir.",
  },
  {
    q: "Verilerim güvende mi?",
    a: "Verileriniz Firebase güvenlik kurallarıyla korunur, KVKK uyumludur ve iletişim trafiği uçtan uca şifrelenir. Detaylar için gizlilik politikamıza bakabilirsiniz.",
  },
  {
    q: "Etkinlik oluşturmak için ek bir koşul var mı?",
    a: "Hayır, hesap oluşturduktan sonra herkes etkinlik açabilir. Topluluk kurallarına aykırı içerikler moderasyona tabidir; sahte/zararlı etkinlikler hızla kaldırılır.",
  },
  {
    q: "Anonim sohbet mümkün mü?",
    a: "Evet, bazı etkinliklerde takma ad ile sohbet edebilirsiniz; kimliğiniz açıkça paylaşılmaz. Kimlik doğrulaması ise yine arka planda yapılır.",
  },
  {
    q: "Bildirimleri kapatabilir miyim?",
    a: "Evet, ayarlardan tüm bildirimleri tek bir anahtarla kapatabilirsiniz veya kategori bazlı (sohbet, davet, sistem) yönetebilirsiniz.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative section-pad">
      <div className="container-x max-w-4xl">
        <div className="text-center max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs uppercase tracking-[0.18em] text-brand-300 font-semibold"
          >
            SSS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-balance"
          >
            Sık sorulan sorular.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 text-white/65"
          >
            Aradığını bulamadın mı? <a href="mailto:hi@socioloc.app" className="underline underline-offset-4 hover:text-white">Bize yaz</a>.
          </motion.p>
        </div>

        <div className="mt-12 grid gap-3">
          {QA.map((it, i) => {
            const active = open === i;
            return (
              <motion.div
                key={it.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
                className={[
                  "rounded-2xl border bg-white/[0.02] backdrop-blur-sm overflow-hidden transition-colors",
                  active
                    ? "border-brand-400/40 bg-gradient-to-br from-brand-500/[0.06] to-fuchsia-500/[0.04]"
                    : "border-white/10 hover:border-white/20",
                ].join(" ")}
              >
                <button
                  onClick={() => setOpen(active ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center gap-4"
                  aria-expanded={active}
                >
                  <span className="flex-1 font-medium text-white/95 text-base sm:text-lg">
                    {it.q}
                  </span>
                  <span
                    className={[
                      "grid place-items-center size-9 rounded-full transition-all duration-300",
                      active
                        ? "bg-gradient-to-br from-brand-500 to-fuchsia-500 rotate-45"
                        : "bg-white/5 border border-white/10",
                    ].join(" ")}
                  >
                    <Plus className="size-4" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-white/65 leading-relaxed">
                        {it.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
