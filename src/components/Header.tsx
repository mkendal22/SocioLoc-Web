"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { SITE } from "@/lib/config";

const NAV = [
  { href: "/etkinlikler", label: "Etkinlikler" },
  { href: "/#features", label: "Özellikler" },
  { href: "/#how", label: "Nasıl çalışır" },
  { href: "/#showcase", label: "Uygulama" },
  { href: "/#business", label: "İşletmeler" },
  { href: "/#faq", label: "SSS" },
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
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "backdrop-blur-xl bg-black/50 border-b border-white/[0.06]"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="container-x flex items-center justify-between h-16">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold tracking-tight group"
        >
          <span className="relative">
            <Image
              src="/brand/icon.png"
              alt="SocioLoc"
              width={34}
              height={34}
              priority
              className="rounded-xl shadow-[0_8px_24px_-6px_rgba(139,92,246,0.55)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
            />
            <span
              aria-hidden
              className="absolute inset-0 rounded-xl bg-brand-500/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
            />
          </span>
          <span className="text-lg">SocioLoc</span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5 text-sm text-white/75">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="relative px-2.5 lg:px-3.5 py-2 rounded-full hover:text-white transition-colors group"
            >
              <span className="relative z-10">{n.label}</span>
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            className="btn-primary text-sm h-10 px-5 group"
            href={SITE.appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            İndir
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <button
          aria-label="Menüyü aç/kapat"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded-xl border border-white/10 bg-white/[0.04]"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-t border-white/5 bg-black/80 backdrop-blur-xl"
          >
            <div className="container-x py-5 flex flex-col gap-2 text-white/85">
              {NAV.map((n, i) => (
                <motion.a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.3 }}
                  className="py-2.5 px-3 rounded-lg hover:bg-white/[0.04]"
                >
                  {n.label}
                </motion.a>
              ))}
              <a
                className="btn-primary mt-3 self-start text-sm h-11 px-6"
                href={SITE.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                İndir
                <ArrowRight className="size-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
