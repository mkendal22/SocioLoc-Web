import { allParticipants, parseEventStart, type EventModel } from "./types";

// ── Ağırlıklar ──
const W_F = 0.4;
const W_D = 0.3;
const W_R = 0.3;

// Konum yokken (web default) yeniden dağıtılmış ağırlıklar
const W_F_NO_LOC = 0.5;
const W_D_NO_LOC = 0.1;
const W_R_NO_LOC = 0.4;

const ALPHA_CREATOR = 0.7;
const K_JOIN = 3;
const L0_KM = 20;

const BETA_NEAR = 0.65;
const DELTA_MAX_DAYS = 45;
const AGE_MAX_DAYS = 21;

const BOOST_TODAY = 0.08;
const BOOST_TOMORROW = 0.04;
const EXPIRED_PENALTY = 0.25;

const K_HOST = 1;

export interface UserGeo {
  latitude: number;
  longitude: number;
}

export interface RankOptions {
  friendUids?: Set<string>;
  userPosition?: UserGeo | null;
  now?: Date;
}

/**
 * Mobil `EventRankingService.rank` portu.
 * - Filtre sonrası çağrılır, sadece sıralar.
 * - Konum yoksa F ağırlığı artar, D nötrlenir.
 */
export function rankEvents(
  events: EventModel[],
  opts: RankOptions = {},
): EventModel[] {
  if (events.length <= 1) return events;
  const { friendUids = new Set<string>(), userPosition = null, now = new Date() } = opts;

  const scored = events.map((e) => ({
    e,
    score: computeScore(e, friendUids, userPosition, now),
  }));

  // Skora göre azalan; stabil sort modern V8'de garanti.
  scored.sort((a, b) => b.score - a.score);

  return rerank(scored);
}

function computeScore(
  e: EventModel,
  friendUids: Set<string>,
  pos: UserGeo | null,
  now: Date,
): number {
  const eventStart = parseEventStart(e);

  const f = friendScore(e, friendUids);
  const d = distanceScore(e, pos);
  const r = timeScore(eventStart, e, now);

  const wF = pos ? W_F : W_F_NO_LOC;
  const wD = pos ? W_D : W_D_NO_LOC;
  const wR = pos ? W_R : W_R_NO_LOC;

  let score = wF * f + wD * d + wR * r;
  score += microBoost(eventStart, now);

  if (eventStart && eventStart.getTime() < now.getTime()) {
    score *= EXPIRED_PENALTY;
  }

  return clamp(score, 0, 1);
}

function friendScore(e: EventModel, friendUids: Set<string>): number {
  if (friendUids.size === 0) return 0;
  const fCreator = friendUids.has(e.creatorId) ? 1 : 0;

  let friendJoinCount = 0;
  for (const p of allParticipants(e)) {
    const uid = String(p);
    if (uid !== e.creatorId && friendUids.has(uid)) friendJoinCount++;
  }
  const fJoin = clamp(friendJoinCount / K_JOIN, 0, 1);

  return clamp(ALPHA_CREATOR * fCreator + (1 - ALPHA_CREATOR) * fJoin, 0, 1);
}

function distanceScore(e: EventModel, pos: UserGeo | null): number {
  if (!pos) return 0.5;
  if (!e.geoLocation) return 0.3;
  const km = haversineKm(pos.latitude, pos.longitude, e.geoLocation.latitude, e.geoLocation.longitude);
  return clamp(Math.exp(-km / L0_KM), 0, 1);
}

function timeScore(eventStart: Date | null, e: EventModel, now: Date): number {
  const rNear = nearScore(eventStart, now);
  const rFresh = freshScore(e, now);
  return clamp(BETA_NEAR * rNear + (1 - BETA_NEAR) * rFresh, 0, 1);
}

function nearScore(eventStart: Date | null, now: Date): number {
  if (!eventStart) return 0.3;
  const deltaDays = (eventStart.getTime() - now.getTime()) / 3_600_000 / 24;
  if (deltaDays < 0) return 0;
  return clamp(1 - deltaDays / DELTA_MAX_DAYS, 0, 1);
}

function freshScore(e: EventModel, now: Date): number {
  if (!e.createdAt) return 0.5;
  const ageDays = (now.getTime() - e.createdAt.getTime()) / 3_600_000 / 24;
  if (ageDays < 0) return 1;
  return clamp(1 - ageDays / AGE_MAX_DAYS, 0, 1);
}

function microBoost(eventStart: Date | null, now: Date): number {
  if (!eventStart) return 0;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const ed = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate());
  const diff = Math.round((ed.getTime() - today.getTime()) / 86_400_000);
  if (diff === 0) return BOOST_TODAY;
  if (diff === 1) return BOOST_TOMORROW;
  return 0;
}

function rerank(scored: { e: EventModel; score: number }[]): EventModel[] {
  const result: EventModel[] = [];
  const remaining = scored.slice();
  const recentHosts: string[] = [];

  while (remaining.length > 0) {
    let pickedIdx = -1;
    const recentSet = new Set(recentHosts);
    for (let i = 0; i < remaining.length; i++) {
      if (!recentSet.has(remaining[i].e.creatorId)) {
        pickedIdx = i;
        break;
      }
    }
    if (pickedIdx === -1) pickedIdx = 0;

    const picked = remaining.splice(pickedIdx, 1)[0];
    result.push(picked.e);

    recentHosts.push(picked.e.creatorId);
    if (recentHosts.length > K_HOST) recentHosts.shift();
  }

  return result;
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
