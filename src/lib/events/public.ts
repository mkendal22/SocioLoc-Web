import "server-only";
import { allParticipantCount, type EventModel, type PublicEvent } from "./types";

function shortPlace(location: string): string {
  const i = location.indexOf(",");
  return (i >= 0 ? location.slice(0, i) : location).trim();
}

/**
 * Firestore dokümanını herkese açık karta indirger. İstemci bileşenlerine
 * EventModel yerine her zaman bu gönderilmeli (KVKK – ölçülülük).
 */
export function toPublicEvent(e: EventModel): PublicEvent {
  const isDigital = e.eventType === "Dijital";
  return {
    id: e.docId,
    title: e.title,
    description: e.description,
    date: e.date,
    time: e.time,
    place: isDigital ? "" : shortPlace(e.location),
    category: e.category,
    eventType: e.eventType,
    image: e.thumbUrl || e.image || null,
    platformName: isDigital ? e.platformName : null,
    participantCount: allParticipantCount(e),
    participantLimit: e.participantLimit,
    creatorNickname: e.creatorNickname,
    creatorPhoto: e.creatorPhoto,
  };
}
