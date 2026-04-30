"use client";

import { Apple, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

export function CtaBanner() {
  return (
    <section className="section-pad">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 px-6 sm:px-12 py-12 sm:py-16"
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-brand-600/40 via-fuchsia-500/25 to-transparent"
          />
          <div
            aria-hidden
            className="absolute -inset-1 opacity-30 blur-3xl bg-gradient-to-tr from-violet-500/40 to-fuchsia-500/40"
          />
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-8 justify-between">
            <div className="max-w-xl">
              <h3 className="text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
                Sosyal hayatına bugün başla.
              </h3>
              <p className="mt-3 text-white/75">
                Saniyeler içinde indir, ilk etkinliğine bu hafta katıl.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a className="btn-primary" href="#" aria-label="App Store'dan indir">
                <Apple className="size-5" />
                App Store
              </a>
              <a className="btn-ghost" href="#" aria-label="Google Play'den indir">
                <Smartphone className="size-5" />
                Google Play
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
