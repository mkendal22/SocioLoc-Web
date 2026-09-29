import { NextResponse, type NextRequest } from "next/server";
import { matchLink } from "@/lib/links";
import { appStoreUrl, classifyClient, pickUtm, playStoreUrl } from "@/lib/stores";

/**
 * Tek "İndir" linki: cihaza göre doğru mağazaya yönlendirir.
 * iPhone/iPad → App Store, Android → Google Play, diğerleri (masaüstü)
 * → ana sayfadaki mağaza rozetleri. QR kodlarda da bu adres kullanılabilir.
 *
 * `?link=/event/abc` ve `utm_*` Play referrer'ına eklenir: uygulama kurulumdan
 * sonraki ilk açılışta bu içeriğe gidebilir. `link` yalnız deep link
 * sözleşmesindeki yollardan biri olabilir.
 */
export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const utm = pickUtm(params);
  const link = matchLink(params.get("link") ?? "")?.path ?? null;

  let target: string | URL;
  switch (classifyClient(request.headers.get("user-agent") ?? "")) {
    case "ios":
      target = appStoreUrl(utm);
      break;
    case "android":
    case "android-chrome":
      target = playStoreUrl(link, utm);
      break;
    default: {
      const home = request.nextUrl.clone();
      home.pathname = "/";
      home.search = "";
      home.hash = "download";
      target = home;
    }
  }

  const res = NextResponse.redirect(target, 302);
  // Yanıt cihaza göre değişir; ara katmanlar önbelleğe almasın.
  res.headers.set("Cache-Control", "private, no-store");
  res.headers.set("Vary", "User-Agent");
  return res;
}
