"use client";

import { useId } from "react";
import { SITE } from "@/lib/config";

type Props = {
  size?: "md" | "lg";
  className?: string;
};

function AppleLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M17.543 12.514c-.022-2.243 1.832-3.318 1.916-3.371-1.043-1.526-2.667-1.735-3.246-1.76-1.382-.14-2.7.812-3.402.812-.701 0-1.788-.79-2.94-.768-1.512.022-2.908.879-3.685 2.232-1.572 2.722-.402 6.756 1.13 8.97.748 1.082 1.638 2.298 2.808 2.255 1.128-.045 1.554-.731 2.918-.731 1.363 0 1.745.731 2.94.708 1.213-.022 1.982-1.103 2.722-2.193.86-1.255 1.213-2.476 1.234-2.539-.027-.012-2.36-.905-2.395-3.615zm-2.245-6.642c.61-.74 1.022-1.766.91-2.788-.881.036-1.948.586-2.578 1.323-.566.654-1.063 1.7-.93 2.703.984.078 1.987-.5 2.598-1.238z" />
    </svg>
  );
}

function PlayLogo({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <defs>
        <linearGradient
          id={`a-${id}`}
          x1=".5"
          y1="2.6"
          x2="13.6"
          y2="15.7"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#00A0FF" />
          <stop offset=".007" stopColor="#00A1FF" />
          <stop offset=".26" stopColor="#00BEFF" />
          <stop offset=".512" stopColor="#00D2FF" />
          <stop offset=".76" stopColor="#00DFFF" />
          <stop offset="1" stopColor="#00E3FF" />
        </linearGradient>
        <linearGradient
          id={`b-${id}`}
          x1="20.7"
          y1="12"
          x2=".5"
          y2="12"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#FFE000" />
          <stop offset=".409" stopColor="#FFBD00" />
          <stop offset=".775" stopColor="#FFA500" />
          <stop offset="1" stopColor="#FF9C00" />
        </linearGradient>
        <linearGradient
          id={`c-${id}`}
          x1="13.4"
          y1="13.6"
          x2="-.05"
          y2="27.05"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#FF3A44" />
          <stop offset="1" stopColor="#C31162" />
        </linearGradient>
        <linearGradient
          id={`d-${id}`}
          x1="-.78"
          y1=".68"
          x2="5.21"
          y2="6.66"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#32A071" />
          <stop offset=".069" stopColor="#2DA771" />
          <stop offset=".476" stopColor="#15CF74" />
          <stop offset=".801" stopColor="#06E775" />
          <stop offset="1" stopColor="#00F076" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#a-${id})`}
        d="M.51 1.07c-.32.34-.51.86-.51 1.55v18.76c0 .69.18 1.21.51 1.55l.06.06L11 12.13v-.26L.57 1.01l-.06.06z"
      />
      <path
        fill={`url(#b-${id})`}
        d="M14.49 15.61L11 12.13v-.26L14.5 8.4l.08.04 4.13 2.35c1.18.67 1.18 1.76 0 2.43l-4.13 2.35-.09.04z"
      />
      <path
        fill={`url(#c-${id})`}
        d="M14.58 15.57L11 11.99.51 22.93c.39.41 1.03.46 1.75.05l12.32-7z"
      />
      <path
        fill={`url(#d-${id})`}
        d="M14.58 8.43L2.26 1.45C1.54 1.04.9 1.09.51 1.5L11 12.01l3.58-3.58z"
      />
    </svg>
  );
}

export function StoreBadges({ size = "md", className = "" }: Props) {
  const cls =
    size === "lg"
      ? "h-14 px-6 gap-3 text-[15px]"
      : "h-12 px-5 gap-2.5 text-sm";
  const iconCls = size === "lg" ? "size-6" : "size-5";

  const buttonBase =
    "group relative inline-flex items-center justify-center rounded-2xl bg-black border border-white/10 text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] min-w-[180px]";

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <a
        href={SITE.appStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="App Store'dan indir"
        className={`${buttonBase} ${cls}`}
      >
        <span
          aria-hidden
          className="absolute -inset-1.5 rounded-2xl bg-gradient-to-br from-brand-500/35 to-fuchsia-500/35 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
        />
        <AppleLogo className={`${iconCls} text-white`} />
        <span className="font-semibold tracking-tight">App Store</span>
      </a>
      <a
        href={SITE.googlePlayUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Google Play'den indir"
        className={`${buttonBase} ${cls}`}
      >
        <span
          aria-hidden
          className="absolute -inset-1.5 rounded-2xl bg-gradient-to-br from-brand-500/35 to-fuchsia-500/35 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
        />
        <PlayLogo className={iconCls} />
        <span className="font-semibold tracking-tight">Google Play</span>
      </a>
    </div>
  );
}
