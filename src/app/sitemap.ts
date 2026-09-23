import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { fetchAllEvents } from "@/lib/events/fetch";
import { parseEventStart } from "@/lib/events/types";

/** Etkinlik URL'leri saatte bir tazelenir (ISR). */
export const revalidate = 3600;

/** /etkinlikler'deki "süresi geçmiş" eşiğiyle aynı: 3 günden eskiler girmez. */
const RECENT_DAYS = 3;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE.url}/etkinlikler`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE.url}/gizlilik`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE.url}/kullanim-kosullari`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE.url}/kvkk`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE.url}/teslimat-ve-iade`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE.url}/mesafeli-satis`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE.url}/ticari-elektronik-ileti`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  let events: MetadataRoute.Sitemap = [];
  try {
    const all = await fetchAllEvents(300);
    events = all
      .filter((e) => {
        const start = parseEventStart(e);
        return (
          start !== null &&
          now.getTime() - start.getTime() <= RECENT_DAYS * 86_400_000
        );
      })
      .map((e) => ({
        url: `${SITE.url}/event/${e.docId}`,
        lastModified: e.updatedAt ?? e.createdAt ?? undefined,
        changeFrequency: "daily" as const,
        priority: 0.6,
      }));
  } catch (e) {
    console.error("[sitemap] etkinlikler alınamadı", e);
  }

  return [...pages, ...events];
}
