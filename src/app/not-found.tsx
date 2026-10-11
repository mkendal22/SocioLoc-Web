import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Sayfa bulunamadı",
  description: "Aradığın sayfa taşınmış ya da hiç var olmamış olabilir.",
};

/**
 * Bilinmeyen yollar için markalı, Türkçe 404 (10 Eki 2026'ya dek Next'in
 * İngilizce varsayılan sayfası çıkıyordu). Görünüm event/[id]/not-found ile aynı.
 */
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="container-x grid min-h-[calc(100vh-220px)] place-items-center py-16">
          <div className="max-w-xl text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-white/[0.06] bg-surface-2 text-brand-200">
              <Compass className="size-6" />
            </div>
            <h1 className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Sayfa bulunamadı
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-white/65">
              Aradığın sayfa taşınmış ya da link hatalı olabilir. Ana sayfaya
              dönebilir ya da yakınındaki etkinlikleri keşfedebilirsin.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/etkinlikler"
                className="btn-primary h-11 px-6 text-sm group inline-flex items-center gap-2"
              >
                Etkinlikleri keşfet
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/"
                className="rounded-full border border-white/10 bg-white/[0.04] px-5 h-11 inline-flex items-center gap-2 text-sm text-white/85 hover:bg-white/[0.08]"
              >
                Ana sayfa
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
