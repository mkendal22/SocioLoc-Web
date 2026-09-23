import Link from "next/link";
import { Calendar, ArrowRight, AppWindow } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE } from "@/lib/config";

export const metadata = {
  title: "Etkinlik bulunamadı",
  description:
    "Aradığın etkinlik kaldırılmış ya da hiç var olmamış olabilir. SocioLoc'ta yeni etkinlikleri keşfet.",
};

export default function EventNotFound() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="container-x grid min-h-[calc(100vh-220px)] place-items-center py-16">
          <div className="max-w-xl text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-white/[0.06] bg-surface-2 text-brand-200">
              <Calendar className="size-6" />
            </div>
            <h1 className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Etkinlik bulunamadı
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-white/65">
              Bu etkinlik kaldırılmış olabilir ya da link hatalı olabilir.
              SocioLoc&apos;ta birbirinden güzel etkinlikleri keşfetmeye devam
              et.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/etkinlikler"
                className="btn-primary h-11 px-6 text-sm group inline-flex items-center gap-2"
              >
                Tüm etkinlikler
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href={SITE.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 bg-white/[0.04] px-5 h-11 inline-flex items-center gap-2 text-sm text-white/85 hover:bg-white/[0.08]"
              >
                <AppWindow className="size-4" />
                App Store
              </a>
              <a
                href={SITE.googlePlayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 bg-white/[0.04] px-5 h-11 inline-flex items-center gap-2 text-sm text-white/85 hover:bg-white/[0.08]"
              >
                <AppWindow className="size-4" />
                Google Play
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
