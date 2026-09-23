"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { SITE } from "@/lib/config";

type FaqItem = {
  q: string;
  a: string;
  links?: { href: string; label: string }[];
};

const QA: FaqItem[] = [
  {
    q: "SocioLoc ücretsiz mi?",
    a: "İndirmek ve temel kullanım ücretsizdir: keşif, etkinlik oluşturma, katılma ve sohbet için ücret alınmaz. Ücretli etkinlik bileti varsa tutar uygulamada gösterilir; kartlı ödeme iyzico üzerinden alınır. İşletmeler etkinliği belirli süre öne çıkarabilir; bu ayrı bir satın almadır.",
  },
  {
    q: "İşletme hesabı nasıl açılır?",
    a: "Uygulamada işletme türünü seçersin: mekân, kulüp, dernek, şirket veya kişisel/creator. Başvuru incelenir; onay gelene kadar hesabın kişisel olarak çalışmaya devam eder. Onaydan sonra Yönetim Merkezi açılır: etkinlik, bilet, QR giriş, ekip, istatistik ve satış.",
  },
  {
    q: "Bilet aldım, iptal edebilir miyim?",
    a: "SocioLoc’un T-24 kuralı: etkinliğin ilan edilen başlangıç saatinden 24 saat öncesine kadar bileti iptal edebilirsin. 24 saatten az kala yapılan alışta standart gönüllü iptal yoktur. Etkinlik iptal edilir veya yeri/tarihi esaslı değişirse T-24 uygulanmaz; iade SocioLoc tarafından yürütülür, organizatöre ayrıca yazman gerekmez.",
    links: [
      { href: "/teslimat-ve-iade", label: "Teslimat, iptal ve iade" },
      { href: "/mesafeli-satis", label: "Mesafeli satış sözleşmesi" },
    ],
  },
  {
    q: "Verilerim nasıl korunuyor?",
    a: "Veri sorumlusu Socioloc Teknoloji A.Ş.’dir. Hesap, konum, sohbet, bilet ve teknik kayıtlar KVKK kapsamında, amaca göre işlenir. Kart bilgisi iyzico altyapısında yürür. Organizatöre yalnızca etkinliğin yapılması için gereken sınırlı katılımcı bilgisi gider. Hakların ve başvuru yolu KVKK Aydınlatma Metni’ndedir.",
    links: [
      { href: "/gizlilik", label: "Gizlilik politikası" },
      { href: "/kvkk", label: "KVKK aydınlatma metni" },
    ],
  },
  {
    q: "Herkes etkinlik açabilir mi?",
    a: "Evet. Kişisel hesapla da etkinlik oluşturup davet linki paylaşabilirsin. İşletme hesabı ekstra olarak ücretli bilet, QR giriş, ekip rolleri ve satış dökümü verir. Topluluk kurallarına aykırı içerik kaldırılır; şikâyet ve engelleme uygulamada vardır.",
  },
  {
    q: "Kimlik doğrulama ne işe yarıyor?",
    a: "Uygulamada kimlik/selfie doğrulama, sahte hesapları azaltmak içindir. Zorunluluk etkinliğe göre değişebilir; organizatör yaş veya kimlik şartı koyduysa bu, ödeme öncesi etkinlik sayfasında yazmalıdır. Şartı karşılamadan kapıdan dönememek tek başına iade hakkı doğurmaz.",
  },
  {
    q: "Hangi şehirlerde kullanılabilir?",
    a: "Türkiye genelinde açılır. Etkinlik yoğunluğu büyük şehirlerde daha yüksektir; senin şehrinde ne kadar içerik olduğu, o anda oluşturulan etkinliklere bağlıdır.",
  },
  {
    q: "Bildirimleri kapatabilir miyim?",
    a: "Evet. Ayarlardan tüm bildirimleri kapatabilir veya sohbet, davet ve sistem bildirimlerini ayrı yönetebilirsin. İşletme takip ediyorsan gönderi/etkinlik bildirimlerini de hesap bazında ayarlayabilirsin.",
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
            Merak edilenler, net cevaplar.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 text-white/65"
          >
            Bilet, işletme veya hesap için yaz:{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="underline underline-offset-4 hover:text-white"
            >
              {SITE.email}
            </a>
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
                        <p>{it.a}</p>
                        {it.links && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {it.links.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/80 hover:text-white hover:border-white/25 transition-colors"
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        )}
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
