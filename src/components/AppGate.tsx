import { AppWindow, Smartphone } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StoreRedirect } from "@/components/StoreRedirect";

interface Props {
  title: string;
  description: string;
  appStoreHref: string;
  playStoreHref: string;
  /** Aynı linkin QR kodu (SVG); masaüstünde telefonla okutmak için. */
  qrSvg: string;
}

/**
 * Uygulama kapısının sayfa görünümü: yalnız uygulamada açılan içerik için
 * (ör. takipçilere özel etkinlik). İçerikten hiçbir veri göstermez. Mobilde
 * kullanıcı mağazaya geçer; masaüstünde QR kodu ve mağaza düğmeleri görünür.
 */
export function AppGate({ title, description, appStoreHref, playStoreHref, qrSvg }: Props) {
  return (
    <>
      <Header />
      <StoreRedirect ios={appStoreHref} android={playStoreHref} />
      <main className="flex-1">
        <section className="container-x grid min-h-[calc(100vh-220px)] place-items-center py-16">
          <div className="max-w-xl text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-white/[0.06] bg-surface-2 text-brand-200">
              <Smartphone className="size-6" />
            </div>
            <h1 className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              {title}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-white/65">{description}</p>

            <div className="mt-8 hidden md:block">
              <div
                role="img"
                aria-label="Bu linkin QR kodu"
                className="mx-auto w-44 overflow-hidden rounded-2xl bg-white p-2 [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
                // Kendi linkimizden üretilen SVG; kullanıcı girdisi içermez.
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
              <p className="mt-3 text-xs text-white/50">
                Telefonunun kamerasıyla okut. Uygulama yüklüyse doğrudan açılır.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href={appStoreHref}
                className="rounded-full border border-white/10 bg-white/[0.04] px-5 h-11 inline-flex items-center gap-2 text-sm text-white/85 hover:bg-white/[0.08]"
              >
                <AppWindow className="size-4" />
                App Store
              </a>
              <a
                href={playStoreHref}
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
