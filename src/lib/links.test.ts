import { describe, expect, it } from "vitest";
import vectors from "./deeplink-vectors.json";
import { APP_SCREENS, matchLink, parseLink } from "./links";

describe("deeplink sözleşmesi: ortak vektörler (mobil ile aynı dosya)", () => {
  it.each(vectors)("$in", ({ in: raw, kind, id, path }) => {
    const match = parseLink(raw);
    if (kind === null) {
      expect(match).toBeNull();
    } else {
      expect(match).toEqual({ kind, id, path });
    }
  });
});

describe("matchLink", () => {
  it("sonda eğik çizgiyi yok sayar", () => {
    expect(matchLink("/post/abc/")).toEqual({ kind: "post", id: "abc", path: "/post/abc" });
  });

  it.each(["/post/a.b", "/post/a%2Fb", "/post/%E0%A4%A", "/u/" + "x".repeat(129)])(
    "geçersiz kimlik: %s",
    (path) => {
      expect(matchLink(path)).toBeNull();
    },
  );

  it("her uygulama ekranı eşleşir, kimlik almaz", () => {
    for (const screen of APP_SCREENS) {
      expect(matchLink(`/app/${screen}`)).toEqual({
        kind: "screen",
        id: undefined,
        path: `/app/${screen}`,
      });
    }
  });

  it("kök ve bilinmeyen yollar eşleşmez", () => {
    for (const path of ["/", "/app", "/event", "/app/unknown", "/u/abc/posts", "/indir"]) {
      expect(matchLink(path)).toBeNull();
    }
  });
});

describe("parseLink", () => {
  it("socioloc:// şemasında tür host'tan gelir", () => {
    expect(parseLink("socioloc://event/abc")).toEqual({
      kind: "event",
      id: "abc",
      path: "/event/abc",
    });
  });

  it("yalnız kendi alan adlarımız", () => {
    expect(parseLink("https://www.socioloc.app.example.com/event/abc")).toBeNull();
    expect(parseLink("https://evil.example/event/abc")).toBeNull();
    expect(parseLink("javascript:alert(1)")).toBeNull();
    expect(parseLink("bozuk")).toBeNull();
  });
});
