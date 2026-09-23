import type { EventModel } from "@/lib/events/types";

/** Testler için varsayılanlarla doldurulmuş etkinlik. */
export function makeEvent(over: Partial<EventModel> = {}): EventModel {
  return {
    docId: "e1",
    title: "Etkinlik",
    description: "",
    date: "24.09.2026",
    time: "20:00",
    location: "Kadıköy, İstanbul",
    geoLocation: { latitude: 40.99, longitude: 29.03 },
    category: "Müzik",
    eventType: "Mekan",
    image: "https://cdn.socioloc.app/event/a.jpg",
    thumbUrl: null,
    participants: [],
    participantLimit: 0,
    creatorId: "c1",
    creatorNickname: "ada",
    creatorPhoto: "",
    platformName: null,
    onlineLink: null,
    rules: null,
    createdAt: new Date("2026-09-20T10:00:00Z"),
    updatedAt: null,
    viewsCount: 0,
    interestedCount: 0,
    blurHash: null,
    photos: [],
    city: null,
    participantGender: null,
    verifiedOnly: false,
    ...over,
  };
}
