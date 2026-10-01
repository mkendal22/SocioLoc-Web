import { describe, expect, it } from "vitest";
import { makeEvent } from "../../../test/event-fixture";
import { toPublicEvent } from "./public";

describe("toPublicEvent", () => {
  const source = makeEvent({
    docId: "abc",
    participants: ["uid-katilimci-1", "uid-katilimci-2"],
    creatorId: "uid-duzenleyen",
    participantLimit: 10,
    onlineLink: "https://zoom.us/j/gizli",
    rules: "Kapı kodu 4321",
    participantGender: "Kadın",
    photos: ["https://cdn.socioloc.app/p.jpg"],
    geoLocation: { latitude: 40.123456, longitude: 29.654321 },
  });

  it("yalnızca herkese açık alanları içerir", () => {
    expect(Object.keys(toPublicEvent(source)).sort()).toEqual(
      [
        "id",
        "title",
        "description",
        "date",
        "time",
        "place",
        "category",
        "eventType",
        "image",
        "platformName",
        "participantCount",
        "participantLimit",
        "creatorNickname",
        "creatorPhoto",
      ].sort(),
    );
  });

  it("UID, link, kural, koordinat gibi değerler çıktıya sızmaz", () => {
    const json = JSON.stringify(toPublicEvent(source));
    for (const secret of [
      "uid-katilimci-1",
      "uid-duzenleyen",
      "zoom.us",
      "Kapı kodu",
      "40.123456",
      "Kadın",
    ]) {
      expect(json).not.toContain(secret);
    }
  });

  it("katılımcı sayısına düzenleyen de dahil", () => {
    expect(toPublicEvent(source).participantCount).toBe(3);
  });

  it("mekanda kısa konum, dijitalde platform", () => {
    expect(toPublicEvent(source)).toMatchObject({ place: "Kadıköy", platformName: null });
    const online = makeEvent({ eventType: "Dijital", platformName: "Zoom", location: "Ev" });
    expect(toPublicEvent(online)).toMatchObject({ place: "", platformName: "Zoom" });
  });

  it("görselde küçük boy öncelikli, hiç yoksa null", () => {
    expect(toPublicEvent(makeEvent({ thumbUrl: "t.jpg", image: "i.jpg" })).image).toBe("t.jpg");
    expect(toPublicEvent(makeEvent({ thumbUrl: null, image: "" })).image).toBeNull();
  });
});
