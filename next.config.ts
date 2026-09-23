import type { NextConfig } from "next";
import { SITE } from "./src/lib/config";

// Birincil adres: tek kaynak src/lib/config.ts.
const SITE_URL = SITE.url;
const CANONICAL_HOST = new URL(SITE_URL).host;
const APEX_HOST = CANONICAL_HOST.replace(/^www\./, "");

// CSP önce yalnızca rapor modunda: hiçbir şeyi engellemez, ihlalleri tarayıcı
// konsoluna yazar. Bir süre temiz kaldığı görülünce anahtar
// "Content-Security-Policy" yapılıp zorunlu hale getirilebilir.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // Başka sitelerin iframe'ine gömülmeyi engeller (tıklama tuzağı).
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy-Report-Only", value: CSP },
];

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
        has: [{ type: "host", value: APEX_HOST.replace(/\./g, "\\.") }],
        destination: `${SITE_URL}/:path`,
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
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
