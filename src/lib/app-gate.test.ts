import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { appGate } from "./app-gate";
import { SITE } from "./config";
import { UA } from "../../test/user-agents";

const UID = "Zq81hV3kLmP0sT7wYb2Nc4Rd5Ex6";

function gate(path: string, ua: string): Response {
  return appGate(new Request(`https://www.socioloc.app${path}`, { headers: { "user-agent": ua } }));
}

describe("appGate", () => {
  beforeEach(() => vi.stubEnv("APP_STORE_PROVIDER_TOKEN", undefined));
  afterEach(() => vi.unstubAllEnvs());

  it("iPhone → App Store", () => {
    const res = gate(`/u/${UID}`, UA.iphone);
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe(SITE.appStoreUrl);
  });

  it("Android Chrome → intent; yedek Play referrer'ı yolu ve UTM'yi taşır", () => {
    const res = gate(`/post/abc?utm_source=app&utm_medium=share&utm_campaign=post`, UA.androidChrome);
    expect(res.status).toBe(302);
    const location = res.headers.get("location") ?? "";
    expect(location.startsWith("intent://post/abc#Intent;scheme=socioloc;package=com.socioloc.app;")).toBe(true);
    const fallback = decodeURIComponent(/S\.browser_fallback_url=([^;]+)/.exec(location)?.[1] ?? "");
    const referrer = new URLSearchParams(new URL(fallback).searchParams.get("referrer") ?? "");
    expect(referrer.get("link")).toBe("/post/abc");
    expect(referrer.get("utm_campaign")).toBe("post");
  });

  it("Android uygulama içi tarayıcı → doğrudan Play", () => {
    const res = gate("/app/discover", UA.androidInstagram);
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toMatch(/^https:\/\/play\.google\.com\/store\/apps\/details\?/);
  });

  it.each(["whatsapp", "facebook", "desktop"] as const)("%s → genel başlıklı sayfa", (client) => {
    const res = gate(`/u/${UID}`, UA[client]);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
  });

  it("sayfada kişisel veri yok, yalnız türe göre genel başlık", async () => {
    const html = await gate(`/u/${UID}`, UA.whatsapp).text();
    expect(html).toContain('<meta property="og:title" content="SocioLoc&#39;ta bir profil">');
    expect(html).toContain('<meta name="robots" content="noindex, nofollow">');
    // Kimlik yalnız link adreslerinde (Smart App Banner, mağaza) geçer; başlık,
    // açıklama ve sayfa metninde geçmez. QR kodu SVG yol verisidir, metin değil.
    const withoutLinks = html.replace(/app-argument=[^"]*/, "").replace(/href="[^"]*"/g, "");
    expect(withoutLinks).not.toContain(UID);
  });

  it("önbelleğe alınmaz, arama motorlarına kapalı", () => {
    for (const ua of [UA.iphone, UA.androidChrome, UA.desktop]) {
      const res = gate("/post/abc", ua);
      expect(res.headers.get("cache-control")).toBe("private, no-store");
      expect(res.headers.get("vary")).toBe("User-Agent");
      expect(res.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    }
  });

  it.each([
    "/app/settings/password",
    "/app/messages/abc",
    "/event/abc/payment",
    "/post/a.b",
    "/u/abc/posts",
  ])("sözleşmede olmayan yol 404: %s", (path) => {
    expect(gate(path, UA.iphone).status).toBe(404);
  });

  it("kötü niyetli UTM yönlendirme adresine girmez", () => {
    const res = gate(
      "/post/abc?utm_source=%22%3E%3Cscript%3E&utm_campaign=https://evil.example",
      UA.androidChrome,
    );
    const location = res.headers.get("location") ?? "";
    expect(location).not.toContain("evil.example");
    expect(location).not.toContain("script");
  });

  it("APP_STORE_PROVIDER_TOKEN tanımlıysa App Store kampanya parametreleri", () => {
    vi.stubEnv("APP_STORE_PROVIDER_TOKEN", "123456");
    const location = gate("/post/abc?utm_campaign=post", UA.iphone).headers.get("location") ?? "";
    const url = new URL(location);
    expect(url.searchParams.get("pt")).toBe("123456");
    expect(url.searchParams.get("ct")).toBe("post");
  });
});
