/**
 * Deep link sözleşmesi: uygulamanın açabildiği yollar. Mobildeki rota
 * tablosunun (AppLinkParser) web karşılığı; iki taraf aynı test vektörlerini
 * kullanır (deeplink-vectors.json). Yeni link = bu tabloya yeni satır.
 *
 * Yalnız biçime bakar, veritabanına gitmez: linkteki kişinin ya da içeriğin
 * var olup olmadığı buradan anlaşılamaz.
 */

/** Etkinlik, gönderi, uid, işletme ve destek kaydı kimlikleri. */
export const ID_RE = /^[A-Za-z0-9_-]{1,128}$/;

export type LinkKind = "event" | "post" | "profile" | "screen" | "support" | "business";

const EVENT_SECTIONS = [
  "album",
  "participants",
  "ticket",
  "feedback",
  "requests",
  "check-in",
  "edit",
];

/** /app/… altındaki ekranlar; ilk beşi ana sayfa sekmeleri. */
export const APP_SCREENS = [
  "feed",
  "messages",
  "discover",
  "notifications",
  "profile",
  "my-events",
  "rewards",
  "rewards/achievements",
  "rewards/leaderboard",
  "rewards/catalog",
  "friends",
  "friends/add",
  "friends/requests",
  "search",
  "create/event",
  "create/post",
  "settings",
  "settings/language",
  "settings/blocked",
  "settings/archive",
  "support",
  "about",
];

const BUSINESS_SECTIONS = ["stats", "sales", "revenue", "team", "team/audit", "qr", "verification"];

interface LinkRoute {
  parts: string[];
  kind: LinkKind;
}

function route(pattern: string, kind: LinkKind): LinkRoute {
  return { parts: pattern.split("/"), kind };
}

const ROUTES: LinkRoute[] = [
  route("event/:id", "event"),
  ...EVENT_SECTIONS.map((s) => route(`event/:id/${s}`, "event")),
  route("post/:id", "post"),
  route("u/:id", "profile"),
  route("u/:id/followers", "profile"),
  route("u/:id/following", "profile"),
  // Eski biçimler: web'de 308 ile /u/:id'ye gider, uygulama doğrudan açar.
  route("user/:id", "profile"),
  route("business/:id", "profile"),
  ...APP_SCREENS.map((s) => route(`app/${s}`, "screen")),
  route("app/support/:id", "support"),
  route("app/business/:id", "business"),
  ...BUSINESS_SECTIONS.map((s) => route(`app/business/:id/${s}`, "business")),
];

export interface LinkMatch {
  kind: LinkKind;
  /** Kanonik yol: sabit parçalar küçük harf, kimlik doğrulanmış. Ör. "/u/abc". */
  path: string;
  id?: string;
}

/** Yol sözleşmedeyse eşleşmeyi döner, değilse null. */
export function matchLink(pathname: string): LinkMatch | null {
  let segs: string[];
  try {
    segs = pathname.split("/").filter(Boolean).map(decodeURIComponent);
  } catch {
    return null; // bozuk yüzde kodlaması
  }
  for (const r of ROUTES) {
    if (r.parts.length !== segs.length) continue;
    const out: string[] = [];
    let id: string | undefined;
    let ok = true;
    for (let i = 0; i < r.parts.length && ok; i++) {
      const part = r.parts[i];
      if (part.startsWith(":")) {
        ok = ID_RE.test(segs[i]);
        id = segs[i];
        out.push(segs[i]);
      } else {
        ok = part === segs[i].toLowerCase();
        out.push(part);
      }
    }
    if (ok) return { kind: r.kind, path: `/${out.join("/")}`, id };
  }
  return null;
}

const HOSTS = new Set(["www.socioloc.app", "socioloc.app"]);

/**
 * Tam link → eşleşme. Yalnız kendi alan adlarımız (https) ve `socioloc://`
 * şeması kabul edilir; mobildeki ayrıştırıcıyla aynı kural.
 */
export function parseLink(raw: string): LinkMatch | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  // socioloc://event/abc → host "event", yol "/abc"
  if (url.protocol === "socioloc:") return matchLink(`/${url.hostname}${url.pathname}`);
  if (url.protocol === "https:" && HOSTS.has(url.hostname.toLowerCase())) {
    return matchLink(url.pathname);
  }
  return null;
}
