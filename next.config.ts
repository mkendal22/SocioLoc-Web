import type { NextConfig } from "next";

// Birincil adres (src/lib/config.ts ile aynı kaynak).
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.socioloc.app"
).replace(/\/+$/, "");
const CANONICAL_HOST = new URL(SITE_URL).host;
const APEX_HOST = CANONICAL_HOST.replace(/^www\./, "");

const nextConfig: NextConfig = {
  serverExternalPackages: ["firebase-admin"],
  async redirects() {
    if (CANONICAL_HOST === APEX_HOST) return [];
    return [
      {
        // socioloc.app → www (308). /.well-known hariç: Apple ve Google
        // AASA/assetlinks doğrulamasında yönlendirme izlemez; bu dosyalar iki
        // alan adında da doğrudan 200 dönmeli. Vercel'de apex alan adı
        // "Redirect" yerine doğrudan bu projeye bağlandığında devreye girer.
        source: "/:path((?!\\.well-known/).*)",
        has: [{ type: "host", value: APEX_HOST }],
        destination: `${SITE_URL}/:path`,
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/.well-known/apple-app-site-association",
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
      {
        source: "/.well-known/assetlinks.json",
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
    ];
  },
};

export default nextConfig;
