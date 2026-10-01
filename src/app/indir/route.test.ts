import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { SITE } from "@/lib/config";
import { UA } from "../../../test/user-agents";
import { GET } from "./route";

function indir(query: string, ua: string) {
  return GET(new NextRequest(`https://www.socioloc.app/indir${query}`, { headers: { "user-agent": ua } }));
}

function referrerOf(location: string) {
  return Object.fromEntries(new URLSearchParams(new URL(location).searchParams.get("referrer") ?? ""));
}

describe("/indir", () => {
  beforeEach(() => vi.stubEnv("APP_STORE_PROVIDER_TOKEN", undefined));
  afterEach(() => vi.unstubAllEnvs());

  it("iPhone → App Store", () => {
    const res = indir("", UA.iphone);
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe(SITE.appStoreUrl);
  });

  it("Android → Play; referrer hedef linki ve UTM'yi taşır", () => {
    const res = indir("?link=/event/abc&utm_source=app&utm_campaign=invite", UA.androidChrome);
    expect(referrerOf(res.headers.get("location") ?? "")).toEqual({
      utm_source: "app",
      utm_medium: "web",
      utm_campaign: "invite",
      link: "/event/abc",
    });
  });

  it.each(["https://evil.example/x", "/app/settings/password", "/indir"])(
    "sözleşme dışı link referrer'a girmez: %s",
    (link) => {
      const res = indir(`?link=${encodeURIComponent(link)}`, UA.androidChrome);
      expect(referrerOf(res.headers.get("location") ?? "")).not.toHaveProperty("link");
    },
  );

  it("masaüstü → ana sayfadaki indirme bölümü, önbelleğe alınmaz", () => {
    const res = indir("?link=/event/abc", UA.desktop);
    expect(res.headers.get("location")).toBe("https://www.socioloc.app/#download");
    expect(res.headers.get("cache-control")).toBe("private, no-store");
  });
});
