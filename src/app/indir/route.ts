import { NextResponse, type NextRequest } from "next/server";
import { SITE } from "@/lib/config";

/**
 * Tek "İndir" linki: cihaza göre doğru mağazaya yönlendirir.
 * iPhone/iPad → App Store, Android → Google Play, diğerleri (masaüstü)
 * → ana sayfadaki mağaza rozetleri. QR kodlarda da bu adres kullanılabilir.
 */
export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";

  let target: string | URL;
  if (/iPhone|iPad|iPod/i.test(ua)) {
    target = SITE.appStoreUrl;
  } else if (/Android/i.test(ua)) {
    target = SITE.googlePlayUrl;
  } else {
    const home = request.nextUrl.clone();
    home.pathname = "/";
    home.search = "";
    home.hash = "download";
    target = home;
  }

  const res = NextResponse.redirect(target, 302);
  // Yanıt cihaza göre değişir; ara katmanlar önbelleğe almasın.
  res.headers.set("Cache-Control", "private, no-store");
  res.headers.set("Vary", "User-Agent");
  return res;
}
