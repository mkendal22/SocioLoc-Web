import Link from "next/link";
import { ChevronRight, Mail } from "lucide-react";
import { SITE } from "@/lib/config";
import { LAST_UPDATED } from "@/lib/legal-texts";

type Props = {
  title: string;
  intro?: string;
  body: string;
  current: string;
  updated?: string;
};

const LINKS = [
  { href: "/gizlilik", label: "Gizlilik Politikası" },
  { href: "/kullanim-kosullari", label: "Kullanım Koşulları" },
  { href: "/kvkk", label: "KVKK Aydınlatma Metni" },
  { href: "/teslimat-ve-iade", label: "Teslimat, İptal ve İade" },
  { href: "/mesafeli-satis", label: "Mesafeli Satış Sözleşmesi" },
  { href: "/ticari-elektronik-ileti", label: "Ticari Elektronik İleti" },
];

export function LegalLayout({ title, intro, body, current, updated }: Props) {
  // Body'i parse et: paragraflar (boş satırla ayrılmış)
  const blocks = body
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <main className="flex-1 relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] -z-10"
        style={{
          background:
            "radial-gradient(1100px 480px at 50% 0%, rgba(139,92,246,0.18), transparent 60%)",
        }}
      />

      <div className="container-x pt-12 pb-20">
        {/* Breadcrumb */}
        <nav className="text-xs text-white/55 flex items-center gap-1.5">
          <Link href="/" className="hover:text-white transition-colors">
            Anasayfa
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-white/85">{title}</span>
        </nav>

        <div className="mt-6 grid lg:grid-cols-12 gap-10">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.03] p-2">
              {LINKS.map((l) => {
                const active = l.href === current;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={[
                      "block px-3.5 py-2.5 rounded-xl text-sm transition-colors",
                      active
                        ? "bg-gradient-to-br from-brand-500/20 to-fuchsia-500/15 text-white border border-white/10"
                        : "text-white/65 hover:text-white hover:bg-white/[0.04]",
                    ].join(" ")}
                  >
                    {l.label}
                  </Link>
                );
              })}
              <div className="mt-2 px-3.5 py-3 border-t border-white/[0.06]">
                <p className="text-xs text-white/45">İletişim</p>
                <a
                  href={`mailto:${SITE.email}`}
                  className="mt-1 inline-flex items-center gap-2 text-xs text-white/85 hover:text-white"
                >
                  <Mail className="size-3.5 text-brand-300" />
                  {SITE.email}
                </a>
              </div>
            </div>
          </aside>

          {/* Body */}
          <article className="lg:col-span-9">
            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-7 sm:p-12">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-brand-300 font-semibold">
                Yasal
              </span>
              <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
                {title}
              </h1>
              <p className="mt-3 text-sm text-white/55">
                Son güncelleme: {updated ?? LAST_UPDATED}
              </p>
              {intro && (
                <p className="mt-6 text-white/70 text-balance leading-relaxed">
                  {intro}
                </p>
              )}

              <div className="mt-8 space-y-5 text-[15px] leading-[1.85] text-white/80">
                {blocks.map((block, i) => {
                  // Başlık olabilecek satırları tespit et: kısa ve büyük harfle başlıyor
                  const isHeading =
                    block.length < 110 &&
                    /^([0-9]+\.|[A-ZĞÜŞİÖÇa-z]).+$/.test(block) &&
                    !block.includes(". ") &&
                    block === block.trimEnd();
                  // Tüm büyük harfli ana başlıklar
                  if (
                    i === 0 ||
                    block === block.toUpperCase() ||
                    /^\d+\.\s+[A-ZĞÜŞİÖÇ].{0,80}$/.test(block)
                  ) {
                    return (
                      <h2
                        key={i}
                        className={
                          i === 0
                            ? "text-xl sm:text-2xl font-semibold tracking-tight text-white pt-2"
                            : "text-lg font-semibold tracking-tight text-white pt-4"
                        }
                      >
                        {block}
                      </h2>
                    );
                  }
                  // Madde işaretli liste
                  if (block.split("\n").every((l) => l.trim().startsWith("•"))) {
                    return (
                      <ul key={i} className="space-y-2 pl-1">
                        {block
                          .split("\n")
                          .map((l) => l.replace(/^•\s*/, ""))
                          .filter(Boolean)
                          .map((item, j) => (
                            <li key={j} className="flex gap-3">
                              <span className="mt-2.5 size-1.5 rounded-full bg-gradient-to-br from-brand-500 to-fuchsia-500 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                      </ul>
                    );
                  }
                  // Tek satırlık küçük başlık
                  if (isHeading && block.length < 70 && !block.endsWith(".")) {
                    return (
                      <h3
                        key={i}
                        className="text-base font-semibold text-white pt-2"
                      >
                        {block}
                      </h3>
                    );
                  }
                  return (
                    <p key={i} className="whitespace-pre-line">
                      {block}
                    </p>
                  );
                })}
              </div>

              <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/45">
                <p>© {new Date().getFullYear()} SocioLoc</p>
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-white/65 hover:text-white inline-flex items-center gap-1.5"
                >
                  <Mail className="size-3.5" />
                  Soru ve talepler için yazın
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
