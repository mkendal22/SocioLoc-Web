import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE.url}/etkinlikler`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE.url}/gizlilik`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE.url}/kullanim-kosullari`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE.url}/kvkk`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE.url}/teslimat-ve-iade`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE.url}/mesafeli-satis`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE.url}/ticari-elektronik-ileti`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
