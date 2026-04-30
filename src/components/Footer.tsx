import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-white/5">
      <div className="container-x py-12 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <span className="grid place-items-center w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-fuchsia-500">
              <span className="text-sm font-black text-white">S</span>
            </span>
            <span>SocioLoc</span>
          </div>
          <p className="mt-3 text-sm text-white/55 max-w-xs">
            Yakınındaki etkinlikleri keşfet, sohbet et, tanış.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Ürün</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/65">
            <li><a href="#features">Özellikler</a></li>
            <li><a href="#how">Nasıl çalışır</a></li>
            <li><a href="#showcase">Galeri</a></li>
            <li><a href="#faq">SSS</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Hukuki</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/65">
            <li><Link href="/gizlilik">Gizlilik Politikası</Link></li>
            <li><Link href="/kullanim-kosullari">Kullanım Şartları</Link></li>
            <li><Link href="/kvkk">KVKK Aydınlatma Metni</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">İletişim</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/65">
            <li><a href="mailto:hello@socioloc.app">hello@socioloc.app</a></li>
            <li><a href="https://instagram.com/socioloc" target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href="https://x.com/socioloc" target="_blank" rel="noreferrer">X</a></li>
          </ul>
        </div>
      </div>
      <div className="container-x py-6 border-t border-white/5 text-xs text-white/45 flex flex-col sm:flex-row justify-between gap-2">
        <span>© {year} SocioLoc. Tüm hakları saklıdır.</span>
        <span>İstanbul · Türkiye</span>
      </div>
    </footer>
  );
}
