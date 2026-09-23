import { describe, expect, it } from "vitest";
import { makeEvent } from "../../../test/event-fixture";
import { rankEvents } from "./ranking";

// 24 Eylül Perşembe 00:30 İstanbul
const NOW = new Date("2026-09-23T21:30:00Z");

describe("rankEvents", () => {
  it("İstanbul'da başlamış etkinlik (UTC'de hâlâ gelecek görünse de) geride kalır", () => {
    // 23.09 23:00 İstanbul = 20:00 UTC → NOW'dan 1,5 saat önce başladı.
    const started = makeEvent({ docId: "started", date: "23.09.2026", time: "23:00", creatorId: "a" });
    const upcoming = makeEvent({ docId: "upcoming", date: "25.09.2026", time: "20:00", creatorId: "b" });
    const order = rankEvents([started, upcoming], { now: NOW }).map((e) => e.docId);
    expect(order).toEqual(["upcoming", "started"]);
  });

  it("aynı düzenleyenin etkinlikleri art arda gelmez", () => {
    const e1 = makeEvent({ docId: "e1", date: "24.09.2026", creatorId: "c1" });
    const e2 = makeEvent({ docId: "e2", date: "25.09.2026", creatorId: "c1" });
    const e3 = makeEvent({ docId: "e3", date: "26.09.2026", creatorId: "c1" });
    const f = makeEvent({ docId: "f", date: "30.10.2026", creatorId: "c2" });
    const order = rankEvents([f, e3, e2, e1], { now: NOW }).map((e) => e.docId);
    expect(order).toEqual(["e1", "f", "e2", "e3"]);
  });
});
