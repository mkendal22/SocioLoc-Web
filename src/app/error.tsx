"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/**
 * Sayfa düzeyindeki beklenmeyen hatalar için Türkçe hata sayfası (10 Eki 2026'ya
 * dek Next'in İngilizce varsayılanı çıkıyordu). `retry` segmenti yeniden çekip çizer (Next 16'da önerilen;
 * `reset` yalnız hata durumunu siler, veriyi yeniden çekmez).
 */
export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="container-x grid min-h-[calc(100vh-220px)] place-items-center py-16">
          <div className="max-w-xl text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-white/[0.06] bg-surface-2 text-brand-200">
              <RefreshCw className="size-6" />
            </div>
            <h1 className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Bir şeyler ters gitti
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-white/65">
              Sayfa şu an yüklenemedi. Biraz sonra yeniden deneyebilirsin.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => retry()}
                className="btn-primary h-11 px-6 text-sm inline-flex items-center gap-2"
              >
                Tekrar dene
              </button>
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
