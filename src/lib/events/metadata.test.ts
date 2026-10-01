import { describe, expect, it } from "vitest";
import { makeEvent } from "../../../test/event-fixture";
import { LOCKED_TITLE, eventMetadata } from "./metadata";

const secret = makeEvent({
  docId: "gizli1",
  title: "Doğum günü partisi",
  description: "Moda'daki evimde, kapı kodu 4321",
  image: "https://cdn.socioloc.app/event/gizli.jpg",
  thumbUrl: "https://cdn.socioloc.app/event/gizli-thumb.jpg",
});

describe("eventMetadata", () => {
  it("herkese açık etkinlikte başlık ve görsel önizlemeye girer", () => {
    const meta = eventMetadata("gizli1", secret);
    expect(meta.title).toBe("Doğum günü partisi");
    expect(meta.robots).toBeUndefined();
    expect(JSON.stringify(meta)).toContain("gizli-thumb.jpg");
  });

  it.each([{ audience: "followers" }, { archived: true }])(
    "kilitli etkinlikte (%j) içerikten hiçbir şey yazılmaz",
    (over) => {
      const meta = eventMetadata("gizli1", { ...secret, ...over });
      expect(meta.title).toBe(LOCKED_TITLE);
      expect(meta.robots).toEqual({ index: false, follow: false });
      const json = JSON.stringify(meta);
      for (const leak of ["Doğum günü", "kapı kodu", "gizli.jpg", "gizli-thumb.jpg"]) {
        expect(json).not.toContain(leak);
      }
    },
  );

  it("gizlenmiş etkinlik ve olmayan etkinlik aynı görünür", () => {
    const hidden = eventMetadata("gizli1", { ...secret, isHidden: true });
    expect(hidden).toEqual(eventMetadata("gizli1", null));
    expect(JSON.stringify(hidden)).not.toContain("Doğum günü");
  });

  it("iptal edilen etkinlik arama motorlarına kapalı, başlıkta belirtilir", () => {
    const meta = eventMetadata("gizli1", { ...secret, cancelled: true });
    expect(meta.title).toBe("İptal edildi: Doğum günü partisi");
    expect(meta.robots).toEqual({ index: false, follow: true });
  });
});
