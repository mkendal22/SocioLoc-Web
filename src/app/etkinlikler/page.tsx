import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { EventsExplorer } from "@/components/events/EventsExplorer";
import { fetchAllEvents } from "@/lib/events/fetch";
import { applyFilters } from "@/lib/events/filter";
import { rankEvents } from "@/lib/events/ranking";
import { toPublicEvent } from "@/lib/events/public";
import type { PublicEvent } from "@/lib/events/types";
import { SITE } from "@/lib/config";

/** Boş önbellek / build anı: her istekte Firestore'dan taze veri. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Etkinlikler — Yakındaki sosyal etkinlikleri keşfet",
  description:
    "SocioLoc topluluğunun paylaştığı yakındaki ve online etkinlikleri keşfet, tarih ve kategoriye göre filtrele.",
  alternates: { canonical: "/etkinlikler" },
  openGraph: {
    title: "Etkinlikler — SocioLoc",
    description:
      "Yakındaki ve online etkinlikleri keşfet, tarih ve kategoriye göre filtrele.",
    url: `${SITE.url}/etkinlikler`,
    siteName: SITE.name,
    type: "website",
  },
};

export default async function EtkinliklerPage() {
  const b64Len =
    process.env.FIREBASE_SERVICE_ACCOUNT_BASE64?.replace(/\s/g, "").length ?? 0;
  const jsonLen =
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim()?.length ?? 0;
  const hasGac = Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim());
  const hasPath = Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim());
  const serverAdminConfigured =
    b64Len > 40 || jsonLen > 40 || hasGac || hasPath;
  const showDevAdminHint =
    process.env.NODE_ENV === "development" && !serverAdminConfigured;

  let events: PublicEvent[] = [];
  try {
    const all = await fetchAllEvents(500);
    // Default filtreler: süresi geçmiş 3 günden eski gizli, eventType filtresi yok
    const filtered = applyFilters(all, { selectedDateFilter: "Tümü" });
    // Tarayıcıya yalnızca herkese açık alanlar gider (UID, konum, link yok).
    events = rankEvents(filtered).map(toPublicEvent);
    if (process.env.NODE_ENV === "development") {
      console.info(
        `[etkinlikler] Firestore: ham=${all.length}, filtre sonrası=${filtered.length}, sıralı=${events.length}`,
      );
    }
  } catch (e) {
    console.error("[etkinlikler] fetch error", e);
    events = [];
  }

  return (
    <>
      <ScrollProgress />
      <Header />
      <main className="flex-1">
        <section className="relative pt-24 pb-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(139,92,246,0.18),transparent_70%)]"
          />
          <div className="container-x">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-300/80">
              Topluluk akışı
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
              Yaklaşan etkinlikleri keşfet
            </h1>
            <p className="mt-3 max-w-2xl text-white/65">
              SocioLoc topluluğunun paylaştığı etkinlikler. Detayları görmek ve
              katılmak için uygulamaya yönlendirileceksin.
            </p>
          </div>
        </section>

        <section className="pb-24">
          <div className="container-x">
            <EventsExplorer
              initialEvents={events}
              showDevAdminHint={showDevAdminHint}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
