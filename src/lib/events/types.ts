import { eventStartInstant } from "@/lib/time";

export type EventGeoPoint = {
  latitude: number;
  longitude: number;
};

export interface EventModel {
  docId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  geoLocation: EventGeoPoint | null;
  category: string | null;
  eventType: string;
  image: string;
  thumbUrl: string | null;
  participants: string[];
  participantLimit: number;
  creatorId: string;
  creatorNickname: string;
  creatorPhoto: string;
  platformName: string | null;
  onlineLink: string | null;
  rules: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  viewsCount: number;
  interestedCount: number;
  blurHash: string | null;
  photos: string[];
  city: string | null;
  participantGender: string | null;
  verifiedOnly: boolean;
}

function toDate(v: unknown): Date | null {
  if (!v) return null;
  if (typeof v === "object" && v !== null && "toDate" in v) {
    try {
      return (v as { toDate: () => Date }).toDate();
    } catch {
      return null;
    }
  }
  return null;
}

function toGeo(v: unknown): EventGeoPoint | null {
  if (!v || typeof v !== "object") return null;
  const g = v as {
    latitude?: number;
    longitude?: number;
    _latitude?: number;
    _longitude?: number;
  };
  const lat = (g.latitude ?? g._latitude) as number | undefined;
  const lng = (g.longitude ?? g._longitude) as number | undefined;
  if (typeof lat !== "number" || typeof lng !== "number") return null;
  return { latitude: lat, longitude: lng };
}

function toInt(v: unknown, fallback = 0): number {
  if (typeof v === "number") return Math.trunc(v);
  if (typeof v === "string") {
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? fallback : n;
  }
  return fallback;
}

function toStr(v: unknown, fallback = ""): string {
  if (v == null) return fallback;
  return String(v);
}

function toStrArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => String(x));
}

export function eventFromMap(
  raw: Record<string, unknown>,
  docId: string,
): EventModel {
  return {
    docId,
    title: toStr(raw.title),
    description: toStr(raw.description),
    date: toStr(raw.date),
    time: toStr(raw.time),
    location: toStr(raw.location),
    geoLocation: toGeo(raw.geoLocation),
    category: (raw.category as string | null) ?? null,
    eventType: toStr(raw.eventType, "Mekan"),
    image: toStr(raw.image),
    thumbUrl: (raw.thumbUrl as string | null) ?? null,
    participants: toStrArray(raw.participants),
    participantLimit: toInt(raw.participantLimit),
    creatorId: toStr(raw.creatorId),
    creatorNickname: toStr(raw.creatorNickname),
    creatorPhoto: toStr(raw.creatorPhoto),
    platformName: (raw.platformName as string | null) ?? null,
    onlineLink: (raw.onlineLink as string | null) ?? null,
    rules: (raw.rules as string | null) ?? null,
    createdAt: toDate(raw.createdAt),
    updatedAt: toDate(raw.updatedAt),
    viewsCount: toInt(raw.viewsCount),
    interestedCount: toInt(raw.interestedCount),
    blurHash: (raw.blurHash as string | null) ?? null,
    photos: toStrArray(raw.photos),
    city: (raw.city as string | null) ?? null,
    participantGender: (raw.participantGender as string | null) ?? null,
    verifiedOnly: raw.verifiedOnly === true,
  };
}

/** Creator dahil tüm katılımcılar (eski etkinliklerde creator participants'a eklenmemiş olabilir). */
export function allParticipants(e: EventModel): string[] {
  if (!e.creatorId || e.participants.includes(e.creatorId)) {
    return e.participants;
  }
  return [e.creatorId, ...e.participants];
}

export function allParticipantCount(e: EventModel): number {
  return allParticipants(e).length;
}

/**
 * `date` (YYYY-MM-DD, DD.MM.YYYY veya ISO) + `time` (HH:mm) → başlangıç anı.
 * Saatler Türkiye saatiyle yorumlanır; sunucunun saat diliminden bağımsızdır.
 */
export function parseEventStart(e: { date: string; time: string }): Date | null {
  return eventStartInstant(e.date, e.time);
}
