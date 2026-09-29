import { describe, expect, it } from "vitest";
import { makeEvent } from "../../../test/event-fixture";
import { eventFromMap } from "./types";
import { eventVisibility, isListable } from "./visibility";

describe("eventVisibility", () => {
  it.each([
    [{}, "public"],
    [{ cancelled: true }, "cancelled"],
    [{ audience: "followers" }, "locked"],
    [{ archived: true }, "locked"],
    [{ isHidden: true }, "removed"],
    // Takipçilere özel ve iptal: ayrıntı yine gösterilmez.
    [{ audience: "followers", cancelled: true }, "locked"],
    // Moderasyon her şeyin önünde.
    [{ isHidden: true, audience: "followers", archived: true }, "removed"],
    // Bilinmeyen değer güvenli tarafa: kilitli.
    [{ audience: "friends" }, "locked"],
  ] as const)("%j → %s", (over, expected) => {
    expect(eventVisibility(makeEvent(over))).toBe(expected);
  });

  it("yalnız herkese açık etkinlikler listelenir", () => {
    expect(isListable(makeEvent())).toBe(true);
    for (const over of [
      { cancelled: true },
      { audience: "followers" },
      { archived: true },
      { isHidden: true },
    ]) {
      expect(isListable(makeEvent(over))).toBe(false);
    }
  });
});

describe("eventFromMap görünürlük alanları", () => {
  it("alanı olmayan eski etkinlik herkese açık", () => {
    const e = eventFromMap({ title: "Eski" }, "x");
    expect(e).toMatchObject({ audience: "public", cancelled: false, isHidden: false, archived: false });
    expect(eventVisibility(e)).toBe("public");
  });

  it("Firestore değerleri okunur", () => {
    const e = eventFromMap(
      { audience: "followers", cancelled: true, isHidden: false, archived: true },
      "x",
    );
    expect(e).toMatchObject({ audience: "followers", cancelled: true, archived: true });
  });

  it("yalnız true değeri bayrak sayılır", () => {
    const e = eventFromMap({ isHidden: "true", cancelled: 1, archived: "yes" }, "x");
    expect(e).toMatchObject({ isHidden: false, cancelled: false, archived: false });
  });
});
