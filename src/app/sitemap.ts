import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://socioloc.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteUrl}/gizlilik`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${siteUrl}/kullanim-kosullari`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${siteUrl}/kvkk`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];
}
