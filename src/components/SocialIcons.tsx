import { SITE } from "@/lib/config";

type Item = { href: string; label: string; svg: React.ReactNode };

// Inline brand SVG icons (currentColor compatible)
const ITEMS: Item[] = [
  {
    href: SITE.social.instagram,
    label: "Instagram",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4">
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.22.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.05.41 2.22.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.22-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.05.36-2.22.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.22-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.05-.41-2.22-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.22.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.36 2.22-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.39C1.34 2.69.93 3.36.62 4.15.32 4.91.12 5.79.06 7.06.01 8.34 0 8.74 0 12s.01 3.66.07 4.94c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.39 2.13.67.67 1.34 1.08 2.13 1.39.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.94-.07c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.39.67-.67 1.08-1.34 1.39-2.13.3-.76.5-1.64.56-2.91.06-1.27.07-1.68.07-4.94s-.01-3.67-.07-4.94c-.06-1.27-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.39-2.13C20.31 1.34 19.64.93 18.85.62 18.09.32 17.21.12 15.94.06 14.66.01 14.26 0 11 0h1zM12 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 12 8a4 4 0 0 1 0 8zm6.41-10.41a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
      </svg>
    ),
  },
  {
    href: SITE.social.x,
    label: "X (Twitter)",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4">
        <path d="M18.244 2H21l-6.52 7.45L22 22h-6.83l-4.78-6.26L4.8 22H2.04l6.97-7.97L2 2h6.91l4.34 5.74L18.24 2zm-1.2 18h1.79L7.05 4h-1.9l11.9 16z" />
      </svg>
    ),
  },
  {
    href: SITE.social.tiktok,
    label: "TikTok",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.84a8.16 8.16 0 0 0 4.77 1.52V6.93a4.85 4.85 0 0 1-1.84-.24z" />
      </svg>
    ),
  },
  {
    href: SITE.social.linkedin,
    label: "LinkedIn",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.57h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
      </svg>
    ),
  },
];

export function SocialIcons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {ITEMS.map((it) => (
        <a
          key={it.label}
          href={it.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={it.label}
          className="group relative grid place-items-center size-9 rounded-full border border-white/10 bg-white/[0.04] hover:bg-gradient-to-br hover:from-brand-500/30 hover:to-fuchsia-500/30 hover:border-white/20 hover:text-white text-white/70 transition-all"
        >
          {it.svg}
        </a>
      ))}
    </div>
  );
}
