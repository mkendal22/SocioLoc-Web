"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Smartphone, X } from "lucide-react";
import { SITE } from "@/lib/config";

type Platform = "ios" | "android" | "other" | null;

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "other";
}

// SSR sırasında null dön, hydrate olunca gerçek platformu çöz.
// useSyncExternalStore + tek seferlik subscribe ile setState-in-effect lint
// uyarısı oluşmaz; React 19 strict moduyla uyumlu.
const subscribe = () => () => {};
function usePlatform(): Platform {
  return useSyncExternalStore(
    subscribe,
    detectPlatform,
    () => null,
  );
}

/**
 * Mobil tarayıcılarda görünen üst banner.
 * - iOS: `socioloc://` custom scheme dene; açılmazsa App Store fallback.
 *   (Chrome/Safari aynı domain'e Universal Link tetiklemediği için bu
 *   yöntem Chrome iOS dahil her tarayıcıda çalışır.)
 * - Android: `intent://` ile pakete özel deep link + Play Store fallback.
 * - Masaüstünde gösterilmez.
 */
export function OpenInAppBanner({ eventId }: { eventId: string }) {
  const platform = usePlatform();
  const [closed, setClosed] = useState(false);

  const storeUrl = useMemo(() => {
    if (platform === "ios") return SITE.appStoreUrl;
    if (platform === "android") return SITE.googlePlayUrl;
    return null;
  }, [platform]);

  if (closed || platform === null || platform === "other") return null;

  const onOpen = () => {
    const started = Date.now();

    // Android: `intent://` ile pakete özel deep link. Yüklü değilse
    // S.browser_fallback_url devreye girer, store'a yönlendirir.
    // scheme=socioloc → `socioloc://event/<id>`: uygulamanın manifest'inde
    // web fallback'i için tanımlı custom scheme (iOS ile aynı biçim).
    // (Eskiden scheme=https ile `https://event/<id>` üretiliyordu; host
    // "event" olduğundan uygulamanın filtresiyle eşleşmiyordu.)
    if (platform === "android") {
      const fallback = encodeURIComponent(SITE.googlePlayUrl);
      const intent =
        `intent://event/${encodeURIComponent(eventId)}` +
        `#Intent;scheme=socioloc;package=${SITE.androidPackage};` +
        `S.browser_fallback_url=${fallback};end`;
      window.location.href = intent;
      return;
    }

    // iOS: custom scheme `socioloc://event/<id>` dene. Tarayıcı (Safari/
    // Chrome) uygulamayı açar; yüklü değilse hiçbir şey olmaz veya
    // "açılacak uygulama yok" gösterir. 1.5sn içinde sayfa görünür
    // kalmışsa App Store'a düş.
    const scheme = `socioloc://event/${eventId}`;
    window.location.href = scheme;

    const tStore = window.setTimeout(() => {
      if (
        storeUrl &&
        document.visibilityState === "visible" &&
        Date.now() - started < 3500
      ) {
        window.location.href = storeUrl;
      }
    }, 1500);

    const onVisible = () => {
      if (document.visibilityState === "hidden") {
        window.clearTimeout(tStore);
        document.removeEventListener("visibilitychange", onVisible);
      }
    };
    document.addEventListener("visibilitychange", onVisible);
  };

  return (
    <div className="sticky top-16 z-40 border-b border-white/[0.06] bg-black/70 backdrop-blur-xl">
      <div className="container-x flex items-center gap-3 py-3">
        <div className="grid size-9 place-items-center rounded-xl bg-brand-500/20 text-brand-200">
          <Smartphone className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-white">
            En iyi deneyim için SocioLoc uygulamasında aç
          </p>
          <p className="truncate text-[11px] text-white/50">
            Sohbet, katıl ve katılımcıları gör
          </p>
        </div>
        <button
          onClick={onOpen}
          className="btn-primary h-9 px-4 text-xs"
        >
          Aç
        </button>
        <button
          aria-label="Kapat"
          onClick={() => setClosed(true)}
          className="grid size-9 place-items-center rounded-xl text-white/55 hover:bg-white/[0.06] hover:text-white"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
