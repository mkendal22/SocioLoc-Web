"use client";

import { useEffect } from "react";

/**
 * Yalnız uygulamada açılan sayfalarda mobil kullanıcıyı mağazaya geçirir.
 * Sayfa statik (ISR) kaldığı için yönlendirmeyi tarayıcı yapar. Önizleme
 * botları betik çalıştırmadığı için genel başlıklı sayfayı görür; betik
 * çalıştıran arama botları da yönlendirilmez.
 */
export function StoreRedirect({ ios, android }: { ios: string; android: string }) {
  useEffect(() => {
    const ua = navigator.userAgent;
    if (/\b(bot|crawler|spider)\b|googlebot|bingbot|applebot/i.test(ua)) return;
    if (/iPhone|iPod|iPad/.test(ua)) window.location.replace(ios);
    else if (/Android/i.test(ua)) window.location.replace(android);
  }, [ios, android]);
  return null;
}
