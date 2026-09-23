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

function sortByCreatedAtDesc(events: EventModel[]): EventModel[] {
  return [...events].sort((a, b) => {
    const ta = a.createdAt?.getTime() ?? 0;
    const tb = b.createdAt?.getTime() ?? 0;
    return tb - ta;
  });
}

async function fetchAllEventsClient(max: number): Promise<EventModel[]> {
  const db = getDb();
  const snap = await getDocs(
    query(collection(db, COLL), orderBy("createdAt", "desc"), limit(max)),
  );
  const list = snap.docs.map((d) =>
    eventFromMap(d.data() as DocumentData, d.id),
  );
  return sortByCreatedAtDesc(list);
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
      return sortByCreatedAtDesc(list);
    } catch (e) {
      console.error("[fetchAllEvents] Admin SDK hatası, istemci deneniyor:", e);
    }
  } else if (process.env.NODE_ENV === "development") {
    console.warn("[fetchAllEvents] Admin yok → istemci Firestore (sık gRPC hatası).");
  }
  try {
    return await fetchAllEventsClient(max);
  } catch (e) {
    console.error("[fetchAllEvents] İstemci Firestore hatası:", e);
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

export async function fetchEventById(id: string): Promise<EventModel | null> {
  const adb = getAdminFirestore();
  if (adb) {
    try {
      const snap = await adb.collection(COLL).doc(id).get();
      if (!snap.exists) return null;
      return eventFromMap(snap.data() as Record<string, unknown>, snap.id);
    } catch (e) {
      console.error("[fetchEventById] Admin SDK hatası, istemci deneniyor:", e);
    }
  }
  try {
    return await fetchEventByIdClient(id);
  } catch (e) {
    console.error("[fetchEventById] İstemci Firestore hatası:", e);
    return null;
  }
}
