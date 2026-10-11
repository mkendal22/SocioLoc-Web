import type { Metadata } from "next";
import { SITE } from "@/lib/config";
import type { EventModel } from "./types";
import { eventVisibility } from "./visibility";

export const LOCKED_TITLE = "SocioLoc'ta bir etkinlik";
export const LOCKED_DESCRIPTION =
  "Bu etkinliğin ayrıntıları yalnız SocioLoc uygulamasında görünür. Görmek için uygulamayı indir.";

/**
 * Etkinlik sayfasının metadata'sı. WhatsApp ve sosyal ağ önizlemeleri buradan
 * beslendiği için gizlilik kuralı (visibility.ts) burada da uygulanır: kilitli
 * etkinlikte başlık, açıklama ve görsel yazılmaz.
 */
export function eventMetadata(id: string, ev: EventModel | null): Metadata {
  const url = `${SITE.url}/event/${id}`;
  const visibility = ev ? eventVisibility(ev) : null;

  // Yok ya da gizlenmiş: sayfa 404 verir; içerikten hiçbir şey yazılmaz.
  if (!ev || visibility === "removed") {
    return { title: "Etkinlik bulunamadı", robots: { index: false, follow: false } };
  }

  // iOS Smart App Banner: Safari'de üstte "Aç" düğmesi; app-argument uygulamaya
  // bu sayfanın adresini verir.
  const smartBanner = { "apple-itunes-app": `app-id=${SITE.appStoreId}, app-argument=${url}` };

  // Takipçilere özel ya da arşivlenmiş: önizlemede yalnız genel başlık.
  if (visibility === "locked") {
    const ogImage = `${SITE.url}${SITE.ogImage}`;
    return {
      title: LOCKED_TITLE,
      description: LOCKED_DESCRIPTION,
      alternates: { canonical: `/event/${id}` },
      robots: { index: false, follow: false },
      openGraph: {
        title: LOCKED_TITLE,
        description: LOCKED_DESCRIPTION,
        url,
        siteName: SITE.name,
        locale: "tr_TR",
        images: [{ url: ogImage, width: 1200, height: 630, alt: SITE.name }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: LOCKED_TITLE,
        description: LOCKED_DESCRIPTION,
        images: [ogImage],
      },
      other: smartBanner,
    };
  }

  const cancelled = visibility === "cancelled";
  const title = `${cancelled ? "İptal edildi: " : ""}${ev.title || "Etkinlik"}`;
  const desc = ev.description?.slice(0, 160) || "SocioLoc'ta bu etkinliğe göz at ve katıl.";
  const image = ev.thumbUrl || ev.image || `${SITE.url}${SITE.ogImage}`;

  return {
    title,
    description: desc,
    alternates: { canonical: `/event/${id}` },
    // İptal edilen etkinlik arama sonuçlarında kalmasın.
    robots: cancelled ? { index: false, follow: true } : undefined,
    openGraph: {
      title: `${title} — ${SITE.name}`,
      description: desc,
      url,
      siteName: SITE.name,
      locale: "tr_TR",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [image],
    },
    other: smartBanner,
  };
}
