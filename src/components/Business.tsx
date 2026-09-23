"use client";

import { motion } from "framer-motion";
import {
  Building2,
  UserRound,
  QrCode,
  Ticket,
  Users,
  BarChart3,
  Megaphone,
  LayoutDashboard,
  ArrowRight,
  Check,
} from "lucide-react";
import { SITE } from "@/lib/config";

const TYPES = [
  {
    icon: Building2,
    title: "Mekân, kulüp, dernek, şirket",
    desc: "Kafe, bar, etkinlik alanı veya marka hesabı. Konum, çalışma saati ve galeriyle işletme profilini yayınla.",
    tags: ["Müzik & gece", "Yeme & içme", "Spor", "Etkinlik mekânı"],
  },
  {
    icon: UserRound,
    title: "Kişisel / creator profil",
    desc: "Atölye, yürüyüş, konser veya topluluk düzenleyenler için. Takipçilerine etkinlik ve gönderi duyur.",
    tags: ["Eğitim", "Müzik", "Sanat", "Lifestyle"],
  },
];

const CAPS = [
  {
    icon: Ticket,
    title: "Ücretli etkinlik ve bilet",
    desc: "Bilet SocioLoc üzerinden satılır, ödeme iyzico ile alınır. Satış ve net gelir Yönetim Merkezi’nde durur.",
  },
  {
    icon: QrCode,
    title: "QR ile giriş",
    desc: "Kapıda bileti okut, check-in’i kaydet. Ekip üyeleri de QR giriş yapabilir.",
  },
  {
    icon: LayoutDashboard,
    title: "Yönetim Merkezi",
    desc: "Etkinlikler, satış, banka bilgisi, doğrulama ve profil tek panelden yönetilir.",
  },
  {
    icon: Users,
    title: "Ekip ve roller",
    desc: "Çalışan ekle, rol ver. İstatistik sahibi ve yöneticide, satış yalnız işletme sahibinde kalır.",
  },
  {
    icon: BarChart3,
    title: "İstatistik",
    desc: "Görüntülenme, takipçi ve etkinlik performansı. Kimlerin geldiğini tahmin etmek yerine sayı gör.",
  },
  {
    icon: Megaphone,
    title: "Öne çıkar",
    desc: "Etkinliği belirli süre keşifte öne çıkar. Ücret App Store / Play üzerinden alınır.",
  },
];

const STEPS = [
  { n: "01", t: "Başvur", d: "Uygulamada işletme türünü seç, profilini doldur, başvuruyu gönder." },
  { n: "02", t: "Onay", d: "Başvuru incelenene kadar hesabın kişisel olarak çalışmaya devam eder." },
  { n: "03", t: "Yönet", d: "Onaydan sonra Yönetim Merkezi açılır: etkinlik, bilet, QR, ekip." },
];

export function Business() {
  return (
    <section id="business" className="relative section-pad">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(900px 480px at 10% 0%, rgba(139,92,246,0.16), transparent 60%), radial-gradient(800px 420px at 90% 80%, rgba(217,70,239,0.10), transparent 60%)",
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
            İşletmeler
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-balance"
          >
            Mekânını veya topluluğunu{" "}
            <span className="gradient-text">SocioLoc’ta yönet.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 text-white/65 max-w-xl text-balance"
          >
            Başvur, onaydan sonra Yönetim Merkezi’nden etkinlik aç, bilet sat,
            kapıda QR ile giriş al. Satıcı SocioLoc’tur; organizatör etkinliği
            fiilen gerçekleştirir.
          </motion.p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {TYPES.map((item, i) => {
            const TypeIcon = item.icon;
            return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="card-grad p-6 sm:p-8"
            >
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-gradient-to-br from-brand-500 to-fuchsia-500 grid place-items-center">
                  <TypeIcon className="size-5" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
              </div>
              <p className="mt-4 text-sm text-white/65 leading-relaxed">{item.desc}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
            );
          })}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAPS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="size-10 rounded-xl bg-white/[0.06] grid place-items-center">
                  <Icon className="size-5 text-brand-300" />
                </div>
                <h3 className="mt-4 font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="rounded-2xl border border-white/10 bg-black/20 p-5"
            >
              <p className="text-xs font-semibold tracking-[0.16em] text-brand-300">
                {step.n}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{step.t}</h3>
              <p className="mt-2 text-sm text-white/60 leading-relaxed">{step.d}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5"
        >
          <div>
            <p className="font-medium">İşletme başvurusu uygulamadan yapılır.</p>
            <p className="mt-1 text-sm text-white/55 inline-flex items-center gap-2">
              <Check className="size-3.5 text-brand-300" />
              Onay beklerken kişisel hesabın kapanmaz.
            </p>
          </div>
          <a
            href={SITE.appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm h-11 px-5 shrink-0"
          >
            Uygulamayı indir
            <ArrowRight className="size-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
