"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { EventCard } from "@/components/events/EventCard";
import { applyFilters, type DateFilter } from "@/lib/events/filter";
import type { PublicEvent } from "@/lib/events/types";

/**
 * Mobilde sayfa aşağı kaydırılırken filtre/arama barı yukarı gizlensin,
 * yukarı kaydırılınca tekrar görünsün. Masaüstünde Tailwind ile
 * `sm:translate-y-0` override edildiği için her zaman sticky kalır.
 *
 * - Her zaman görünür: sayfa en üste yakınken (< 80px).
 * - Eşik: küçük yön değişimlerinde titremeyi engellemek için 8px.
 */
function useHideOnScrollDown(): boolean {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    lastY.current = window.scrollY;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;

        if (y < 80) {
          setHidden(false);
        } else if (delta > 8) {
          setHidden(true);
        } else if (delta < -8) {
          setHidden(false);
        }

        lastY.current = y;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return hidden;
}

const DATE_FILTERS: DateFilter[] = [
  "Tümü",
  "Bugün",
  "Yarın",
  "Bu hafta",
  "Bu hafta sonu",
  "Bu ay",
];

const TYPE_FILTERS: { id: "all" | "Mekan" | "Dijital"; label: string }[] = [
  { id: "all", label: "Tümü" },
  { id: "Mekan", label: "Mekan" },
  { id: "Dijital", label: "Online" },
];

const PAGE_SIZE = 20;

/**
 * Filtrelerin kullandığı "şimdi". Sayfa ISR ile önbelleklendiği için dakikalar,
 * hatta saatler önce üretilmiş olabilir: hydration sırasında sunucunun
 * kullandığı an (renderedAt) kullanılır ki ilk boyama sunucu HTML'iyle aynı
 * olsun; ardından tarayıcı saatine geçilir ve dakikada bir tazelenir.
 */
function subscribeMinute(onChange: () => void) {
  const id = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(id);
}

function currentMinute() {
  return Math.floor(Date.now() / 60_000) * 60_000;
}

export function EventsExplorer({
  initialEvents,
  renderedAt,
  showDevAdminHint = false,
}: {
  /** Sunucuda sıralanmış, herkese açık alanlara indirgenmiş liste. */
  initialEvents: PublicEvent[];
  /** Sunucunun listeyi filtrelediği an (ms). */
  renderedAt: number;
  /** Yerel: servis hesabı yoksa boş liste + kurulum ipucu */
  showDevAdminHint?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("Tümü");
  const [typeFilter, setTypeFilter] = useState<"all" | "Mekan" | "Dijital">(
    "all",
  );
  const [visible, setVisible] = useState(PAGE_SIZE);

  const nowMs = useSyncExternalStore(
    subscribeMinute,
    currentMinute,
    () => renderedAt,
  );

  // Sıralama sunucuda yapıldı; filtre sırayı korur.
  const filtered = useMemo(
    () =>
      applyFilters(initialEvents, {
        searchQuery: query,
        selectedDateFilter: dateFilter,
        eventType: typeFilter === "all" ? null : typeFilter,
        now: new Date(nowMs),
      }),
    [initialEvents, query, dateFilter, typeFilter, nowMs],
  );

  const hasFilters =
    query.trim().length > 0 || dateFilter !== "Tümü" || typeFilter !== "all";

  const visibleEvents = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;
  const hidden = useHideOnScrollDown();

  return (
    <div>
      <div
        className={[
          "sticky top-16 z-30 -mx-4 mb-6 border-b border-white/[0.06] bg-black/60 px-4 py-3 backdrop-blur-xl",
          "sm:mx-0 sm:rounded-2xl sm:border sm:px-4 sm:py-3",
          // Mobil: aşağı scroll'da yukarı kayar; masaüstünde her zaman görünür.
          "transition-transform duration-300 ease-out will-change-transform",
          hidden ? "-translate-y-[120%]" : "translate-y-0",
          "sm:translate-y-0",
        ].join(" ")}
      >
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/45" />
            <input
              type="search"
              placeholder="Etkinlik ara"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              className="h-11 w-full rounded-full border border-white/10 bg-white/[0.04] pl-10 pr-10 text-sm text-white placeholder:text-white/55 focus:border-brand-500/60 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
            {query ? (
              <button
                aria-label="Aramayı temizle"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/55 hover:text-white"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <SlidersHorizontal className="size-3.5" />
              Filtre
            </div>

            <div className="flex flex-wrap gap-1.5">
              {TYPE_FILTERS.map((t) => (
                <Chip
                  key={t.id}
                  active={typeFilter === t.id}
                  onClick={() => {
                    setTypeFilter(t.id);
                    setVisible(PAGE_SIZE);
                  }}
                >
                  {t.label}
                </Chip>
              ))}
            </div>

            <span aria-hidden className="mx-1 h-4 w-px bg-white/10" />

            <div className="flex flex-wrap gap-1.5">
              {DATE_FILTERS.map((f) => (
                <Chip
                  key={f}
                  active={dateFilter === f}
                  onClick={() => {
                    setDateFilter(f);
                    setVisible(PAGE_SIZE);
                  }}
                >
                  {f}
                </Chip>
              ))}
            </div>

            {hasFilters ? (
              <button
                onClick={() => {
                  setQuery("");
                  setDateFilter("Tümü");
                  setTypeFilter("all");
                  setVisible(PAGE_SIZE);
                }}
                className="ml-auto text-xs text-brand-300 hover:text-brand-100"
              >
                Temizle
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <>
          {showDevAdminHint && initialEvents.length === 0 ? (
            <div className="mb-5 rounded-2xl border border-amber-500/35 bg-amber-500/[0.08] px-4 py-3 text-left text-sm leading-relaxed text-amber-50/95">
              <p className="font-semibold text-amber-100">Yerel geliştirme</p>
              <p className="mt-1 text-amber-50/90">
                <strong className="text-amber-100">Önce .env.local dosyasını Cmd+S ile kaydet.</strong>{" "}
                Kaydedilmemiş uzun satır diskte yok; Next.js boş env görür.
                Alternatif: indirdiğin JSON&apos;u{" "}
                <code className="rounded bg-black/30 px-1.5 py-0.5 text-xs">
                  private/serviceAccount.json
                </code>{" "}
                yap,{" "}
                <code className="rounded bg-black/30 px-1.5 py-0.5 text-xs">
                  FIREBASE_SERVICE_ACCOUNT_PATH=./private/serviceAccount.json
                </code>{" "}
                ekle (tek satır).
              </p>
            </div>
          ) : null}
          <EmptyState />
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleEvents.map((e) => (
              <EventCard key={e.id} data={e} />
            ))}
          </div>

          {hasMore ? (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-2.5 text-sm font-medium text-white/85 transition-colors hover:bg-white/[0.08]"
              >
                Daha fazla göster
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-brand-500/50 bg-brand-500/15 text-brand-100"
          : "border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.06]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-white/[0.06] bg-surface/40 px-6 py-16 text-center">
      <Search className="size-10 text-white/30" />
      <h3 className="mt-4 text-lg font-semibold text-white">
        Etkinlik bulunamadı
      </h3>
      <p className="mt-1 text-sm text-white/55">
        Filtreleri değiştirip tekrar deneyebilirsin.
      </p>
    </div>
  );
}
