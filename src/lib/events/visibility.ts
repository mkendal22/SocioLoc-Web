import type { EventModel } from "./types";

/**
 * Bir etkinliğin web'de nasıl görüneceği. Firestore kurallarının (events →
 * `allow get`) ve uygulamanın keşif listesinin (event_repository.dart →
 * `_kaydiUygula`) web karşılığı:
 *
 * - removed: moderasyonla ya da yasakla gizlenmiş (`isHidden`). 404; kararın
 *   kendisi de dışarı sızmaz, "yok" ile aynı görünür.
 * - locked: takipçilere özel ya da arşivlenmiş. Ayrıntı gösterilmez, uygulama
 *   kapısına döner.
 * - cancelled: iptal edilmiş. Sayfa "iptal edildi" bandıyla açılır ama arama
 *   motorlarına, listeye ve sitemap'e girmez.
 * - public: herkese açık.
 *
 * Sıra önemli: takipçilere özel ve iptal edilmiş bir etkinlik kilitli sayılır.
 * Bilinmeyen bir `audience` değeri de kilitli sayılır; web güvenli taraftan
 * yanılır.
 */
export type EventVisibility = "public" | "cancelled" | "locked" | "removed";

type VisibilityFields = Pick<EventModel, "audience" | "cancelled" | "isHidden" | "archived">;

export function eventVisibility(e: VisibilityFields): EventVisibility {
  if (e.isHidden) return "removed";
  if (e.audience !== "public" || e.archived) return "locked";
  if (e.cancelled) return "cancelled";
  return "public";
}

/** /etkinlikler listesine ve sitemap'e yalnız herkese açık etkinlikler girer. */
export function isListable(e: VisibilityFields): boolean {
  return eventVisibility(e) === "public";
}
