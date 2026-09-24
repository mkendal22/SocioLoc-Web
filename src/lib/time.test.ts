import { describe, expect, it } from "vitest";
import {
  dayNumber,
  eventStartInstant,
  isoWeekday,
  istanbulDate,
  istanbulWallDate,
  parseClock,
  parseWallDate,
  toIstanbulISO,
} from "./time";

describe("test ortamı", () => {
  it("İstanbul dışı bir saat diliminde koşuyor (sonuçlar TZ'den bağımsız olmalı)", () => {
    const offset = new Date("2026-09-23T12:00:00Z").getTimezoneOffset();
    expect(offset).not.toBe(-180);
  });
});

describe("istanbulDate / toIstanbulISO", () => {
  it("İstanbul duvar saatini doğru ana çevirir", () => {
    expect(istanbulDate(2026, 9, 23, 20, 0).toISOString()).toBe(
      "2026-09-23T17:00:00.000Z",
    );
  });

  it("JSON-LD için ofsetli ISO üretir", () => {
    expect(toIstanbulISO(new Date("2026-09-23T17:00:00Z"))).toBe(
      "2026-09-23T20:00:00+03:00",
    );
  });

  it("UTC gece yarısı civarında İstanbul günü ileridedir", () => {
    // 21:30 UTC = ertesi gün 00:30 İstanbul
    expect(istanbulWallDate(new Date("2026-09-23T21:30:00Z"))).toEqual({
      year: 2026,
      month: 9,
      day: 24,
    });
  });
});

describe("parseWallDate", () => {
  const sep23 = { year: 2026, month: 9, day: 23 };

  it.each([
    ["2026-09-23", sep23],
    ["23.09.2026", sep23],
    ["3.9.2026", { year: 2026, month: 9, day: 3 }],
    ["2026-09-23T00:00:00.000", sep23],
    ["2026-09-22T21:30:00.000Z", sep23],
    ["2026-09-23T02:00:00+03:00", sep23],
    // Eski new Date() yedeğinin okuduğu biçimler
    ["2026/09/23", sep23],
    ["2026-9-23", sep23],
    ["2026/09/23 23:30", sep23],
    // Saat dilimli ISO dışı metin: sunucu saatinden bağımsız İstanbul günü
    // (01:30 +03:00 = önceki gün 22:30 UTC)
    ["Wed Sep 23 2026 01:30:00 GMT+0300", sep23],
    ["2026-09-23 01:30:00+03:00", sep23],
  ])("%s", (raw, expected) => {
    expect(parseWallDate(raw)).toEqual(expected);
  });

  it.each(["", "31.02.2026", "2026-13-01", "yarın"])("geçersiz: %j", (raw) => {
    expect(parseWallDate(raw)).toBeNull();
  });
});

describe("parseClock", () => {
  it("HH:mm okur, geçersizi reddeder", () => {
    expect(parseClock("20:05")).toEqual({ hour: 20, minute: 5 });
    expect(parseClock("9:30")).toEqual({ hour: 9, minute: 30 });
    expect(parseClock("20:5")).toEqual({ hour: 20, minute: 5 });
    expect(parseClock("24:00")).toBeNull();
    expect(parseClock("")).toBeNull();
  });
});

describe("eventStartInstant", () => {
  const expected = "2026-09-23T17:00:00.000Z";

  it("tüm tarih biçimlerinde aynı anı verir", () => {
    expect(eventStartInstant("2026-09-23", "20:00")?.toISOString()).toBe(expected);
    expect(eventStartInstant("23.09.2026", "20:00")?.toISOString()).toBe(expected);
    expect(eventStartInstant("2026-09-23T00:00:00.000", "20:00")?.toISOString()).toBe(expected);
  });

  it("saat alanı yoksa ISO içindeki saati kullanır", () => {
    expect(eventStartInstant("2026-09-23T20:00:00.000", "")?.toISOString()).toBe(expected);
    expect(eventStartInstant("2026-09-23T17:00:00.000Z", "")?.toISOString()).toBe(expected);
  });

  it("boşlukla ayrılmış saat ve saat dilimli metin", () => {
    expect(eventStartInstant("2026/09/23 20:00", "")?.toISOString()).toBe(expected);
    expect(
      eventStartInstant("Wed Sep 23 2026 20:00:00 GMT+0300", "")?.toISOString(),
    ).toBe(expected);
  });

  it("saat hiç yoksa İstanbul gün başı", () => {
    expect(eventStartInstant("23.09.2026", "")?.toISOString()).toBe(
      "2026-09-22T21:00:00.000Z",
    );
  });

  it("geçersiz tarihte null", () => {
    expect(eventStartInstant("", "20:00")).toBeNull();
  });
});

describe("takvim yardımcıları", () => {
  it("isoWeekday: Pazartesi=1 … Pazar=7", () => {
    expect(isoWeekday({ year: 2026, month: 9, day: 21 })).toBe(1);
    expect(isoWeekday({ year: 2026, month: 9, day: 23 })).toBe(3);
    expect(isoWeekday({ year: 2026, month: 9, day: 27 })).toBe(7);
  });

  it("dayNumber ardışık günlerde 1 artar (ay/yıl geçişi dahil)", () => {
    expect(
      dayNumber({ year: 2027, month: 1, day: 1 }) -
        dayNumber({ year: 2026, month: 12, day: 31 }),
    ).toBe(1);
  });
});
