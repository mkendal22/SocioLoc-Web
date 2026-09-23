import "server-only";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  type DocumentData,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { getAdminFirestore } from "@/lib/firebaseAdmin";
import { eventFromMap, type EventModel } from "./types";

const COLL = "events";

/**
 * Üretimde (build dışında) okuma hatası yutulmaz, fırlatılır. /etkinlikler,
 * etkinlik sayfası ve sitemap ISR ile önbelleklenir: yeniden üretim hata
 * fırlatınca Next son başarılı sürümü sunmaya devam eder. Hata boş liste /
 * null'a çevrilseydi, geçici bir Firestore sorunu "Etkinlik bulunamadı" ya da
 * 404 olarak önbelleğe girerdi.
 * Build sırasında (servis hesabı olmayabilir) ve geliştirmede eski davranış:
 * boş sonuç.
 */
const STRICT =
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PHASE !== "phase-production-build";

async function fetchAllEventsClient(max: number): Promise<EventModel[]> {
  const db = getDb();
  const snap = await getDocs(
    query(collection(db, COLL), orderBy("createdAt", "desc"), limit(max)),
  );
  return snap.docs.map((d) => eventFromMap(d.data() as DocumentData, d.id));
}

/**
 * En yeni etkinlikleri çeker (createdAt'e göre azalan, en fazla [max] doküman).
 * Sırasız limit Firestore'da doküman ID sırasıyla (pratikte rastgele) döner;
 * koleksiyon büyüyünce yeni etkinlikler listeden düşerdi. `createdAt` alanı
 * olmayan (çok eski) dokümanlar bu sorguya girmez.
 *
 * **Firebase Admin** tanımlıysa sunucuda HTTP ile okur (Node’da gRPC client hatası olmaz).
 * Tanımlı değilse veya hata olursa istemci SDK kullanılır.
 */
export async function fetchAllEvents(max = 300): Promise<EventModel[]> {
  let adminError: unknown;
  const adb = getAdminFirestore();
  if (adb) {
    try {
      const snap = await adb
        .collection(COLL)
        .orderBy("createdAt", "desc")
        .limit(max)
        .get();
      const list = snap.docs.map((d) =>
        eventFromMap(d.data() as Record<string, unknown>, d.id),
      );
      if (process.env.NODE_ENV === "development") {
        console.info(`[fetchAllEvents] Admin OK, ham doküman: ${list.length}`);
      }
      return list;
    } catch (e) {
      adminError = e;
      console.error("[fetchAllEvents] Admin SDK hatası, istemci deneniyor:", e);
    }
  } else if (process.env.NODE_ENV === "development") {
    console.warn("[fetchAllEvents] Admin yok → istemci Firestore (sık gRPC hatası).");
  }
  try {
    return await fetchAllEventsClient(max);
  } catch (e) {
    console.error("[fetchAllEvents] İstemci Firestore hatası:", e);
    if (STRICT) throw adminError ?? e;
    return [];
  }
}

async function fetchEventByIdClient(id: string): Promise<EventModel | null> {
  const db = getDb();
  const ref = doc(db, COLL, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return eventFromMap(snap.data() as DocumentData, snap.id);
}

/** Etkinlik yoksa null; okuma hatasında üretimde fırlatır (bkz. STRICT). */
export async function fetchEventById(id: string): Promise<EventModel | null> {
  let adminError: unknown;
  const adb = getAdminFirestore();
  if (adb) {
    try {
      const snap = await adb.collection(COLL).doc(id).get();
      if (!snap.exists) return null;
      return eventFromMap(snap.data() as Record<string, unknown>, snap.id);
    } catch (e) {
      adminError = e;
      console.error("[fetchEventById] Admin SDK hatası, istemci deneniyor:", e);
    }
  }
  try {
    return await fetchEventByIdClient(id);
  } catch (e) {
    console.error("[fetchEventById] İstemci Firestore hatası:", e);
    if (STRICT) throw adminError ?? e;
    return null;
  }
}
