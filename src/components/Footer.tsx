import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { SITE } from "@/lib/config";
import { SocialIcons } from "./SocialIcons";
import { StoreBadges } from "./StoreBadges";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-20 border-t border-white/[0.06]">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(700px 300px at 80% 0%, rgba(139,92,246,0.10), transparent 60%)",
        }}
      />
      <div className="container-x relative py-14 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Link href="/" className="inline-flex items-center gap-2.5 font-semibold">
            <Image
              src="/brand/icon.png"
              alt="SocioLoc"
              width={36}
              height={36}
              className="rounded-xl shadow-[0_8px_24px_-6px_rgba(139,92,246,0.55)]"
            />
            <span className="text-lg">SocioLoc</span>
          </Link>
          <p className="mt-4 text-sm text-white/55 max-w-sm leading-relaxed">
            Yakındaki etkinlikleri keşfet, anlık sohbet et ve gerçek hayatta tanış.
            SocioLoc — sosyal hayatın haritası.
          </p>

          <div className="mt-6">
            <SocialIcons />
          </div>

          <div className="mt-7">
            <StoreBadges />
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-xs uppercase tracking-[0.16em] text-white/55 font-semibold">
            Ürün
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/75">
            <li>
              <Link className="hover:text-white transition-colors" href="/etkinlikler">
                Etkinlikler
              </Link>
            </li>
            <li>
              <a className="hover:text-white transition-colors" href="/#features">
                Özellikler
              </a>
            </li>
            <li>
              <a className="hover:text-white transition-colors" href="/#how">
                Nasıl çalışır
              </a>
            </li>
            <li>
              <a className="hover:text-white transition-colors" href="/#showcase">
                Uygulama
              </a>
            </li>
            <li>
              <a className="hover:text-white transition-colors" href="/#business">
                İşletmeler
              </a>
            </li>
            <li>
              <a className="hover:text-white transition-colors" href="/#faq">
                SSS
              </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-xs uppercase tracking-[0.16em] text-white/55 font-semibold">
            Yasal
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/75">
            <li>
              <Link className="hover:text-white transition-colors" href="/gizlilik">
                Gizlilik politikası
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-white transition-colors"
                href="/kullanim-kosullari"
              >
                Kullanım koşulları
              </Link>
            </li>
            <li>
              <Link className="hover:text-white transition-colors" href="/kvkk">
                KVKK Aydınlatma Metni
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-white transition-colors"
                href="/teslimat-ve-iade"
              >
                Teslimat, iptal ve iade
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-white transition-colors"
                href="/mesafeli-satis"
              >
                Mesafeli satış sözleşmesi
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-white transition-colors"
                href="/ticari-elektronik-ileti"
              >
                Ticari ileti
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-xs uppercase tracking-[0.16em] text-white/55 font-semibold">
            İletişim
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li>
              <a
                className="inline-flex items-center gap-2 hover:text-white transition-colors"
                href={`mailto:${SITE.email}`}
              >
                <Mail className="size-4 text-brand-300" />
                {SITE.email}
              </a>
            </li>
          </ul>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-white/55 leading-relaxed">
              Görüş ve geri bildirimlerin için bize yaz; her mesajını okuyoruz.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.05]">
        <div className="container-x py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/45">
          <p className="sm:min-w-[200px]">© {year} SocioLoc. Tüm hakları saklıdır.</p>
          <div className="rounded-xl bg-white px-3 py-2 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.45)]">
            <img
              src="/payments/logo_band_colored.svg"
              alt="iyzico ile Öde — Mastercard, Visa, American Express, Troy"
              width={429}
              height={32}
              className="h-7 w-auto max-w-[min(100%,280px)] sm:max-w-[320px]"
            />
          </div>
          <p className="sm:min-w-[200px] sm:text-right">
            Türkiye'de tasarlandı ve geliştirildi · v{" "}
            <span className="text-white/60">1.0.6</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
