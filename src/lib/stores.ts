import { SITE } from "./config";

/**
 * Uygulama kapısının ve indirme linklerinin ortak parçaları: istemciyi
 * tanıma ve mağaza adresleri. Mağaza adresleri sabittir; kullanıcı girdisi
 * yalnız doğrulanmış yol ve UTM olarak, parametre değeri şeklinde girer.
 */

/** Kapının ayırt ettiği istemciler. */
export type Client = "bot" | "ios" | "android-chrome" | "android" | "desktop";

// Önizleme ve arama botları yönlendirilmez; genel başlıklı sayfayı alır.
// Genel "bot" kelimesi yalnız tek başına eşleşir: "CUBOT" gibi telefon
// markaları bot sayılmasın.
const BOT =
  /\b(bot|crawler|spider)\b|googlebot|bingbot|applebot|duckduckbot|yandex(bot|images)|baiduspider|petalbot|facebookexternalhit|facebookcatalog|whatsapp|telegrambot|slackbot|discordbot|linkedinbot|twitterbot|pinterestbot|redditbot|skypeuripreview|embedly|iframely/i;

// Android'de intent:// adresini açamayan uygulama içi tarayıcılar (WebView).
const ANDROID_IN_APP = /; wv\)|Instagram|FBAN|FBAV|FB_IAB|musical_ly|Bytedance|TikTok|LinkedInApp|Snapchat|Line\//i;

export function classifyClient(ua: string): Client {
  if (BOT.test(ua)) return "bot";
  // iPadOS 13 ve sonrası masaüstü Safari gibi görünür; yalnız eski iPad'ler buraya düşer.
  if (/iPhone|iPod|iPad/.test(ua)) return "ios";
  if (/Android/i.test(ua)) {
    return /Chrome\/\d/.test(ua) && !ANDROID_IN_APP.test(ua) ? "android-chrome" : "android";
  }
  return "desktop";
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;
const UTM_VALUE = /^[A-Za-z0-9._-]{1,64}$/;

export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>;

/** Yalnız utm_* parametreleri; biçimi uymayan ya da uzun değer atılır. */
export function pickUtm(params: URLSearchParams): Utm {
  const out: Utm = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value && UTM_VALUE.test(value)) out[key] = value;
  }
  return out;
}

/**
 * Google Play. `referrer`, kurulumdan sonraki ilk açılışta uygulamanın
 * okuyacağı hedef yolu (`link`) ve kaynağı (UTM) taşır. Play Console da
 * kurulumları bu UTM'lere göre gösterir.
 */
export function playStoreUrl(link: string | null, utm: Utm = {}): string {
  const referrer = new URLSearchParams({
    utm_source: utm.utm_source ?? "socioloc_web",
    utm_medium: utm.utm_medium ?? "web",
  });
  if (utm.utm_campaign) referrer.set("utm_campaign", utm.utm_campaign);
  if (link) referrer.set("link", link);
  const url = new URL(SITE.googlePlayUrl);
  url.searchParams.set("referrer", referrer.toString());
  return url.toString();
}

/**
 * App Store. APP_STORE_PROVIDER_TOKEN tanımlıysa kampanya parametreleri
 * eklenir (pt, ct): kurulumlar App Store Connect'te kampanya bazında görünür.
 * iOS'ta içerik bağlamı mağazadan geçmez.
 */
export function appStoreUrl(
  utm: Utm = {},
  providerToken = process.env.APP_STORE_PROVIDER_TOKEN,
): string {
  const url = new URL(SITE.appStoreUrl);
  if (providerToken && /^\d{1,20}$/.test(providerToken)) {
    url.searchParams.set("pt", providerToken);
    url.searchParams.set("ct", (utm.utm_campaign ?? utm.utm_source ?? "web").slice(0, 40));
    url.searchParams.set("mt", "8");
  }
  return url.toString();
}

/**
 * Android Chrome için intent adresi: uygulama yüklüyse `socioloc://` ile hedef
 * ekranda açılır, değilse Chrome `fallback` adresine (Play) geçer. Şema, eski
 * uygulama sürümleri de açabilsin diye https değil `socioloc`.
 * `path` sözleşmeden geçmiş (doğrulanmış) yol olmalı.
 */
export function intentUrl(path: string, fallback: string): string {
  return (
    `intent://${path.replace(/^\/+/, "")}#Intent;scheme=socioloc;` +
    `package=${SITE.androidPackage};S.browser_fallback_url=${encodeURIComponent(fallback)};end`
  );
}
