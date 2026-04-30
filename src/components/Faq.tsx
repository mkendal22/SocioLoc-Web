"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const QA = [
  {
    q: "SocioLoc ücretsiz mi?",
    a: "Evet, indirme ve temel tüm özellikler ücretsizdir.",
  },
  {
    q: "Hangi şehirlerde aktif?",
    a: "Türkiye genelinde tüm şehirlerde kullanılabilir; etkinlik yoğunluğu büyük şehirlerde daha yüksektir.",
  },
  {
    q: "Verilerim güvende mi?",
    a: "Verileriniz Firebase güvenlik kurallarıyla korunur; kişisel veri işleme ilkelerimize gizlilik politikası sayfasından ulaşabilirsiniz.",
  },
  {
    q: "Etkinlik oluşturmak için ek bir koşul var mı?",
    a: "Hayır, hesap oluşturduktan sonra herkes etkinlik açabilir. Topluluk kurallarına aykırı içerikler moderasyona tabidir.",
  },
  {
    q: "Anonim sohbet mümkün mü?",
    a: "Evet, bazı etkinliklerde takma ad ile sohbet edebilirsiniz; kimliğiniz açıkça paylaşılmaz.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="section-pad">
      <div className="container-x max-w-3xl">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.18em] text-brand-300 font-semibold">
            SSS
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
            Sık sorulan sorular.
          </h2>
        </div>

        <div className="mt-10 divide-y divide-white/5 border border-white/10 rounded-2xl bg-white/[0.02]">
          {QA.map((it, i) => {
            const active = open === i;
            return (
              <button
                key={it.q}
                onClick={() => setOpen(active ? null : i)}
                className="w-full text-left px-5 py-5 flex items-start gap-3 group"
                aria-expanded={active}
              >
                <span className="flex-1">
                  <span className="block font-medium text-white/95">{it.q}</span>
                  <span
                    className={[
                      "block text-sm text-white/65 leading-relaxed overflow-hidden transition-all",
                      active ? "max-h-40 mt-2 opacity-100" : "max-h-0 opacity-0",
                    ].join(" ")}
                  >
                    {it.a}
                  </span>
                </span>
                <ChevronDown
                  className={[
                    "size-5 mt-0.5 text-white/55 transition-transform",
                    active ? "rotate-180 text-white" : "",
                  ].join(" ")}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
