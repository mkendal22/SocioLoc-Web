import "server-only";
import { SITE } from "./config";
import { matchLink, type LinkKind, type LinkMatch } from "./links";
import { qrSvg } from "./qr";
import {
  appStoreUrl,
  classifyClient,
  intentUrl,
  pickUtm,
  playStoreUrl,
  type Utm,
} from "./stores";

const HEADERS = {
  // Yanıt istemciye göre değişir; ara katmanlar (Cloudflare dahil) önbelleğe almasın.
  "Cache-Control": "private, no-store",
  Vary: "User-Agent",
  "X-Robots-Tag": "noindex, nofollow",
} as const;

// Önizlemede yalnız türe göre genel başlık: ad, kullanıcı adı, görsel yok.
const COPY: Record<LinkKind, { title: string; description: string }> = {
  event: {
    title: "SocioLoc'ta bir etkinlik",
    description: "Bu etkinliği görmek için SocioLoc uygulamasını indir.",
  },
  post: {
    title: "SocioLoc'ta bir gönderi",
    description: "Bu gönderiyi görmek için SocioLoc uygulamasını indir.",
  },
  profile: {
    title: "SocioLoc'ta bir profil",
    description: "Bu profili görmek için SocioLoc uygulamasını indir.",
  },
  screen: { title: "SocioLoc'ta aç", description: "Bu sayfa SocioLoc uygulamasında açılır." },
  support: { title: "SocioLoc'ta aç", description: "Bu sayfa SocioLoc uygulamasında açılır." },
  business: { title: "SocioLoc'ta aç", description: "Bu sayfa SocioLoc uygulamasında açılır." },
};

/**
 * Uygulama kapısı. Uygulama yüklüyse işletim sistemi linki doğrudan uygulamaya
 * verir ve buraya istek hiç gelmez. Gelirse:
 * - iPhone → App Store
 * - Android Chrome → intent://: uygulama varsa hedef ekran, yoksa Play (referrer ile)
 * - Diğer Android tarayıcıları ve uygulama içi tarayıcılar → Play (referrer ile)
 * - Önizleme botu ve masaüstü → genel başlıklı sayfa, QR kodu ve mağaza düğmeleri
 *
 * Veritabanına dokunmaz: var olan ve olmayan kimlik aynı yanıtı alır, linkle
 * kimin SocioLoc'ta olduğu yoklanamaz. Sözleşmede olmayan yol 404.
 */
export function appGate(request: Request): Response {
  const url = new URL(request.url);
  const link = matchLink(url.pathname);
  if (!link) {
    return new Response("Bulunamadı", {
      status: 404,
      headers: { ...HEADERS, "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const utm = pickUtm(url.searchParams);
  const play = playStoreUrl(link.path, utm);
  const redirect = (location: string) =>
    new Response(null, { status: 302, headers: { ...HEADERS, Location: location } });

  switch (classifyClient(request.headers.get("user-agent") ?? "")) {
    case "ios":
      return redirect(appStoreUrl(utm));
    case "android-chrome":
      return redirect(intentUrl(link.path, play));
    case "android":
      return redirect(play);
    default:
      return new Response(gatePage(link, utm, play), {
        status: 200,
        headers: { ...HEADERS, "Content-Type": "text/html; charset=utf-8" },
      });
  }
}

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function esc(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

const CSS = `
:root{color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:grid;place-items:center;padding:32px 16px;background:#07060c;color:#f5f3ff;font:16px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
main{max-width:420px;text-align:center}
.brand{display:inline-block;margin-bottom:28px;color:#c4b5fd;font-weight:600;text-decoration:none}
h1{margin:0;font-size:28px;line-height:1.2;letter-spacing:-.01em;text-wrap:balance}
p{margin:12px 0 0;color:#a8a4b8}
.qr{width:176px;margin:28px auto 0;padding:8px;border-radius:16px;background:#fff}
.qr svg{display:block;width:100%;height:auto}
.hint{font-size:13px}
.stores{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:24px}
.stores a{display:inline-flex;align-items:center;height:44px;padding:0 20px;border-radius:999px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);color:#f5f3ff;text-decoration:none;font-size:14px}
.stores a:hover{background:rgba(255,255,255,.08)}
a:focus-visible{outline:2px solid #a78bfa;outline-offset:2px}
`;

/** Bot ve masaüstü için sade sayfa. Linkteki kimlik yalnız QR ve mağaza adresinde. */
function gatePage(link: LinkMatch, utm: Utm, play: string): string {
  const { title, description } = COPY[link.kind];
  const pageUrl = `${SITE.url}${link.path}`;
  const ogImage = `${SITE.url}${SITE.ogImage}`;
  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · ${esc(SITE.name)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="noindex, nofollow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${esc(ogImage)}">
<meta property="og:locale" content="tr_TR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(ogImage)}">
<meta name="apple-itunes-app" content="app-id=${esc(SITE.appStoreId)}, app-argument=${esc(pageUrl)}">
<link rel="icon" href="/favicon.ico">
<style>${CSS}</style>
</head>
<body>
<main>
<a class="brand" href="/">${esc(SITE.name)}</a>
<h1>${esc(title)}</h1>
<p>${esc(description)}</p>
<div class="qr" role="img" aria-label="Bu linkin QR kodu">${qrSvg(pageUrl)}</div>
<p class="hint">Telefonunun kamerasıyla okut. Uygulama yüklüyse doğrudan açılır.</p>
<div class="stores">
<a href="${esc(appStoreUrl(utm))}">App Store</a>
<a href="${esc(play)}">Google Play</a>
</div>
</main>
</body>
</html>`;
}
