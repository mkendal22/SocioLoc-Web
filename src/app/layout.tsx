import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE } from "@/lib/config";
import { MotionProvider } from "@/components/MotionProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "SocioLoc — Yakınındaki etkinlikleri keşfet, tanış, katıl",
    template: "%s | SocioLoc",
  },
  description:
    "SocioLoc; yakınındaki etkinlikleri haritada keşfetmeni, anlık sohbet etmeni ve gerçek hayatta tanışmanı sağlayan sosyal etkinlik uygulaması.",
  keywords: [
    "SocioLoc",
    "etkinlik uygulaması",
    "sosyal mekan",
    "yakındaki etkinlikler",
    "tanışma",
    "sosyal ağ",
    "harita etkinlik",
  ],
  applicationName: "SocioLoc",
  authors: [{ name: "SocioLoc" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE.url,
    siteName: "SocioLoc",
    title: "SocioLoc — Yakınındaki etkinlikleri keşfet, tanış, katıl",
    description:
      "Yakınındaki etkinlikleri haritada keşfet, anlık sohbet et ve gerçek hayatta tanış.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "SocioLoc",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SocioLoc — Etkinlikleri keşfet, tanış",
    description:
      "Yakınındaki etkinlikleri haritada keşfet, anlık sohbet et, tanış.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  category: "social",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0b0a14" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0a14" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MotionProvider>{children}</MotionProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MobileApplication",
              name: "SocioLoc",
              operatingSystem: "iOS, ANDROID",
              applicationCategory: "SocialNetworkingApplication",
              offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
              url: SITE.url,
              installUrl: SITE.appStoreUrl,
              downloadUrl: SITE.googlePlayUrl,
              email: SITE.email,
              sameAs: [
                SITE.social.instagram,
                SITE.social.x,
                SITE.social.tiktok,
                SITE.social.linkedin,
              ],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "5.0",
                ratingCount: "16",
              },
              description:
                "Yakınındaki etkinlikleri haritada keşfet, anlık sohbet et, tanış.",
            }),
          }}
        />
      </body>
    </html>
  );
}
