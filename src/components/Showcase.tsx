"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  MapPinned,
  CalendarHeart,
  MessagesSquare,
  ImagePlus,
  ShieldCheck,
  Check,
} from "lucide-react";

type Block = {
  eyebrow: string;
  title: string;
  desc: string;
  bullets: string[];
  src: string;
  alt: string;
  icon: React.ElementType;
  accent: string; // tw classes for accent gradient
};

const BLOCKS: Block[] = [
  {
    eyebrow: "Keşif",
    title: "Yakınındaki etkinlikleri haritada keşfet",
    desc: "Anlık konum tabanlı harita üzerinde, kategoriye ve mesafeye göre filtrelenmiş canlı etkinlik akışı.",
    bullets: [
      "Canlı harita & yakındakiler",
      "Kategori, tarih ve mesafe filtreleri",
      "Beğeniye göre kişisel öneriler",
    ],
    src: "/screens/02.png",
    alt: "Harita keşif ekranı",
    icon: MapPinned,
    accent: "from-brand-500 to-fuchsia-500",
  },
  {
    eyebrow: "Akış",
    title: "Ruhuna uygun etkinliği bul",
    desc: "İlgi alanına göre algoritmik bir akış: yemek atölyelerinden konserlere, doğa yürüyüşlerinden teknolojiye.",
    bullets: [
      "İlgine göre özel akış",
      "Tek dokunuşla katıl",
      "Arkadaşlarının katıldıkları öne çıkar",
    ],
    src: "/screens/06.png",
    alt: "Etkinlik akışı ekranı",
    icon: CalendarHeart,
    accent: "from-fuchsia-500 to-pink-500",
  },
  {
    eyebrow: "Bağlantı",
    title: "Buluşmadan önce tanış, planını yap",
    desc: "Katıldığın etkinliğin grup chat'inde organize ol, tanış, gerçek hayatta buluşmaya hazır gel.",
    bullets: [
      "Birebir & grup sohbeti",
      "Etkinlik içi grup chat",
      "Hızlı medya paylaşımı",
    ],
    src: "/screens/05.png",
    alt: "Sohbet ekranı",
    icon: MessagesSquare,
    accent: "from-violet-500 to-brand-500",
  },
  {
    eyebrow: "Hatıra",
    title: "Hatıralar ortak albümde toplanır",
    desc: "Sadece etkinlikte fiziksel olarak bulunanların yükleyebildiği güvenli, ortak ve özel albüm deneyimi.",
    bullets: [
      "Sadece katılımcılar yükler",
      "Otomatik düzenlenen ortak albüm",
      "İndir, paylaş, hatıra olarak sakla",
    ],
    src: "/screens/03.png",
    alt: "Etkinlik albümü ekranı",
    icon: ImagePlus,
    accent: "from-pink-500 to-fuchsia-500",
  },
  {
    eyebrow: "Güven",
    title: "Sadece doğrulanmış kişiler",
    desc: "Kimlik ve selfie doğrulaması sayesinde güvenli bir topluluk; sahte hesaplar ve kötü niyetlere karşı kalkan.",
    bullets: [
      "Resmi kimlik kontrolü",
      "Selfie doğrulama",
      "Anlık raporlama & moderasyon",
    ],
    src: "/screens/04.png",
    alt: "Kimlik doğrulama ekranı",
    icon: ShieldCheck,
    accent: "from-brand-600 to-fuchsia-500",
  },
];

function Block({ data, index }: { data: Block; index: number }) {
  const reverse = index % 2 === 1;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.4]);

  const Icon = data.icon;
  return (
    <div
      ref={ref}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16 items-center py-12 sm:py-20 lg:py-24"
    >
      {/* Phone visual */}
      <motion.div
        style={{ y, opacity }}
        className={[
          "lg:col-span-6 relative flex justify-center",
          reverse ? "lg:order-2" : "lg:order-1",
        ].join(" ")}
      >
        <div
          aria-hidden
          className={`absolute inset-0 -m-12 rounded-[40px] blur-3xl opacity-50 bg-gradient-to-br ${data.accent}`}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: reverse ? 4 : -4 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.02, rotate: reverse ? -1.5 : 1.5 }}
          className="relative w-[70%] sm:w-[55%] lg:w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[360px] aspect-[472/1024] rounded-[28px] sm:rounded-[32px] overflow-hidden border border-white/10 shadow-[0_30px_80px_-25px_rgba(139,92,246,0.6)]"
        >
          <Image
            src={data.src}
            alt={data.alt}
            fill
            sizes="(min-width: 1024px) 360px, 80vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>

      {/* Description card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className={[
          "lg:col-span-6 max-w-xl",
          reverse ? "lg:order-1" : "lg:order-2",
        ].join(" ")}
      >
        <span
          className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium tracking-wide`}
        >
          <span
            className={`size-5 rounded-md bg-gradient-to-br ${data.accent} grid place-items-center`}
          >
            <Icon className="size-3 text-white" />
          </span>
          <span className="text-white/80 uppercase tracking-[0.16em]">{data.eyebrow}</span>
        </span>

        <h3 className="mt-5 text-[1.65rem] sm:text-3xl lg:text-[2.6rem] font-semibold tracking-tight leading-[1.15] text-balance">
          {data.title}
        </h3>

        <p className="mt-4 text-white/65 text-base sm:text-lg leading-relaxed text-balance">
          {data.desc}
        </p>

        <ul className="mt-7 space-y-3">
          {data.bullets.map((b, i) => (
            <motion.li
              key={b}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
              className="flex items-start gap-3"
            >
              <span
                className={`mt-0.5 grid place-items-center size-6 rounded-full bg-gradient-to-br ${data.accent} shrink-0`}
              >
                <Check className="size-3.5 text-white" strokeWidth={3} />
              </span>
              <span className="text-white/85">{b}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

export function Showcase() {
  return (
    <section id="showcase" className="relative section-pad overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-dots opacity-[0.5]"
        style={{
          maskImage: "radial-gradient(ellipse at 50% 50%, #000 30%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, #000 30%, transparent 70%)",
        }}
      />
      <div className="container-x relative">
        <div className="max-w-2xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs uppercase tracking-[0.18em] text-brand-300 font-semibold"
          >
            Uygulama
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-balance"
          >
            Tek uygulamada, <span className="gradient-text">5 deneyim.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 text-white/65 text-balance"
          >
            Keşiften katılmaya, sohbetten hatıraya ve güvene kadar — her adımı SocioLoc'ta yaşa.
          </motion.p>
        </div>

        <div className="mt-12 lg:mt-20 divide-y divide-white/5">
          {BLOCKS.map((b, i) => (
            <Block key={b.title} data={b} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
