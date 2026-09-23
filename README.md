# SocioLoc — Tanıtım Sitesi

Yakınındaki etkinlikleri keşfet, sohbet et, tanış. Bu repo, **SocioLoc** mobil uygulamasının tanıtım odaklı pazarlama sitesidir.

## Yığın

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v4** (CSS-first konfig — `src/app/globals.css` içindeki `@theme`)
- **Framer Motion**
- **lucide-react** (ikonlar)

## Geliştirme

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm start            # production start
```

## Ortam değişkenleri

`.env.local` (opsiyonel):

```
NEXT_PUBLIC_SITE_URL=https://www.socioloc.app
```

`metadataBase`, `robots.ts`, `sitemap.ts` ve JSON-LD bu değeri kullanır.

## Yapı

```
src/
  app/
    layout.tsx          # global meta, OG, viewport, JSON-LD
    page.tsx            # ana sayfa
    globals.css         # Tailwind v4 + brand tokens
    robots.ts           # /robots.txt
    sitemap.ts          # /sitemap.xml
    gizlilik/           # taslak
    kullanim-kosullari/ # taslak
    kvkk/               # taslak
  components/
    Header.tsx
    Hero.tsx
    PhoneMock.tsx       # mockup (görsel olmadan SVG/CSS)
    Features.tsx
    HowItWorks.tsx
    Showcase.tsx
    Faq.tsx
    CtaBanner.tsx
    Footer.tsx
```

## Yapılacaklar

- [ ] `public/og.png` (1200×630) eklenecek (paylaşım görseli)
- [ ] `public/apple-icon.png`, `public/icon.png` eklenecek
- [ ] App Store / Google Play linkleri (`#download` butonlarındaki `href="#"`)
- [ ] Gizlilik / Kullanım Şartları / KVKK metinleri tamamlanacak
- [ ] Gerçek istatistikler (`Hero.tsx` → 10K+, 1.2K+, 20+)
- [ ] Analytics (Plausible / GA4)
- [ ] Telefon mockup yerine gerçek ekran görüntüleri istenirse `PhoneMock.tsx` yerine `next/image` kullanılabilir

## Vercel'e deploy

1. Bu repoyu GitHub'a push et.
2. [vercel.com/new](https://vercel.com/new) → repoyu seç → varsayılan ayarlarla deploy.
3. Custom domain'i (ör. `socioloc.app`) Vercel'de bağla, `NEXT_PUBLIC_SITE_URL` env'ini ayarla.
