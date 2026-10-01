import { describe, expect, it } from "vitest";
import { SITE } from "./config";
import { UA } from "../../test/user-agents";
import { appStoreUrl, classifyClient, intentUrl, pickUtm, playStoreUrl } from "./stores";

describe("classifyClient", () => {
  it.each([
    ["iphone", "ios"],
    ["iphoneInstagram", "ios"],
    ["androidChrome", "android-chrome"],
    ["samsung", "android-chrome"],
    ["cubot", "android-chrome"],
    ["androidWebView", "android"],
    ["androidInstagram", "android"],
    ["androidFirefox", "android"],
    ["whatsapp", "bot"],
    ["facebook", "bot"],
    ["telegram", "bot"],
    ["googlebotSmartphone", "bot"],
    ["desktop", "desktop"],
    ["ipadDesktopMode", "desktop"],
  ] as const)("%s → %s", (name, expected) => {
    expect(classifyClient(UA[name])).toBe(expected);
  });

  it("boş user-agent masaüstü sayılır", () => {
    expect(classifyClient("")).toBe("desktop");
  });
});

describe("pickUtm", () => {
  it("yalnız utm_* ve güvenli değerler", () => {
    const params = new URLSearchParams({
      utm_source: "app",
      utm_medium: "share",
      utm_campaign: "<script>",
      ref: "abc",
      id: "x",
    });
    expect(pickUtm(params)).toEqual({ utm_source: "app", utm_medium: "share" });
  });

  it("uzun değer atılır", () => {
    expect(pickUtm(new URLSearchParams({ utm_source: "a".repeat(65) }))).toEqual({});
  });
});

describe("playStoreUrl", () => {
  const referrerOf = (url: string) =>
    Object.fromEntries(new URLSearchParams(new URL(url).searchParams.get("referrer") ?? ""));

  it("referrer hedef yolu ve UTM'yi taşır", () => {
    const url = playStoreUrl("/u/abc", {
      utm_source: "app",
      utm_medium: "share",
      utm_campaign: "profile",
    });
    expect(new URL(url).searchParams.get("id")).toBe(SITE.androidPackage);
    expect(referrerOf(url)).toEqual({
      utm_source: "app",
      utm_medium: "share",
      utm_campaign: "profile",
      link: "/u/abc",
    });
  });

  it("UTM yoksa kaynak web", () => {
    expect(referrerOf(playStoreUrl(null))).toEqual({
      utm_source: "socioloc_web",
      utm_medium: "web",
    });
  });
});

describe("appStoreUrl", () => {
  it("sağlayıcı değeri yoksa sade App Store adresi", () => {
    expect(appStoreUrl({}, undefined)).toBe(SITE.appStoreUrl);
  });

  it("sağlayıcı değeri varsa kampanya parametreleri", () => {
    const url = new URL(appStoreUrl({ utm_campaign: "event" }, "123456"));
    expect(url.searchParams.get("pt")).toBe("123456");
    expect(url.searchParams.get("ct")).toBe("event");
    expect(url.searchParams.get("mt")).toBe("8");
  });

  it("biçimi bozuk sağlayıcı değeri yok sayılır", () => {
    expect(appStoreUrl({}, "abc&x=1")).toBe(SITE.appStoreUrl);
  });
});

describe("intentUrl", () => {
  it("socioloc şeması, paket ve kodlanmış yedek adres", () => {
    const fallback = "https://play.google.com/store/apps/details?id=com.socioloc.app&referrer=a%3Db";
    expect(intentUrl("/event/abc/ticket", fallback)).toBe(
      "intent://event/abc/ticket#Intent;scheme=socioloc;package=com.socioloc.app;" +
        `S.browser_fallback_url=${encodeURIComponent(fallback)};end`,
    );
  });
});
