/**
 * Birincil (canonical) adres. socioloc.app → www.socioloc.app yönlendirilir;
 * canonical, sitemap, OG ve paylaşım linkleri hep bu adresi kullanır.
 * next.config.ts de buradan okur. Boş ya da protokolsüz değer
 * ("www.socioloc.app") new URL()'i ve dolayısıyla build'i çökertmesin diye
 * normalize edilir.
 */
export function resolveSiteUrl(raw = process.env.NEXT_PUBLIC_SITE_URL): string {
  const value = raw?.trim() || "https://www.socioloc.app";
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withProtocol.replace(/\/+$/, "");
}

const SITE_URL = resolveSiteUrl();

export const SITE = {
  name: "SocioLoc",
  domain: "socioloc.app",
  url: SITE_URL,
  /** Paylaşım görseli. 11 Eki 2026'da 1200×630'a değişti: WhatsApp / Facebook / X görseli
   *  ADRESE göre önbelleğe aldığı için aynı `/og.png` eski dikey görseli göstermeyi sürdürür
   *  → sürüm parametresi; görsel her değiştiğinde artırın. */
  ogImage: "/og.png?v=20261011",
  email: "info@socioloc.app",
  legalEmail: "yonetim@socioloc.app",
  phone: "+90 549 903 69 27",
  company: {
    name: "Socioloc Teknoloji Anonim Şirketi",
    tradeRegistry: "48994",
    mersis: "0772176093000001",
    taxOffice: "İLYASBEY",
    taxNo: "7721760930",
    address:
      "GEBZE OSB MAH. KEMAL NEHROZOGLU CAD. NO:507/8 İÇ KAPI NO: Z01 GEBZE/KOCAELİ",
  },
  // Mobil mağazalar (uygulama yayında — gerçek linkler)
  appStoreUrl: "https://apps.apple.com/tr/app/socioloc/id6744417472",
  appStoreId: "6744417472",
  androidPackage: "com.socioloc.app",
  googlePlayUrl: "https://play.google.com/store/apps/details?id=com.socioloc.app",
  // Sosyal medya
  social: {
    instagram:
      "https://www.instagram.com/socioloc?igsh=MTF5bWh0NTBhZml5aw%3D%3D&utm_source=qr",
    x: "https://x.com/sociolocapp?s=21",
    tiktok: "https://www.tiktok.com/@socioloc?_r=1&_t=ZS-95y6AdBuIPg",
    linkedin: "https://www.linkedin.com/company/socioloc/",
  },
} as const;
