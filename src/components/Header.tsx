"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { href: "#features", label: "Özellikler" },
  { href: "#how", label: "Nasıl çalışır" },
  { href: "#showcase", label: "Galeri" },
  { href: "#faq", label: "SSS" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-50 transition-colors",
        scrolled ? "backdrop-blur-md bg-black/40 border-b border-white/5" : "bg-transparent",
      ].join(" ")}
    >
      <div className="container-x flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid place-items-center w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-fuchsia-500 shadow-[0_8px_24px_-6px_rgba(139,92,246,0.6)]">
            <span className="text-sm font-black text-white">S</span>
          </span>
          <span className="text-lg">SocioLoc</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-white/75">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-white transition-colors">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a className="btn-primary text-sm h-10 px-5" href="#download">İndir</a>
        </div>

        <button
          aria-label="Menüyü aç/kapat"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg border border-white/10"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-black/70 backdrop-blur">
          <div className="container-x py-4 flex flex-col gap-3 text-white/85">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="py-2"
              >
                {n.label}
              </a>
            ))}
            <a className="btn-primary mt-2 self-start text-sm h-10 px-5" href="#download">
              İndir
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
