import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resolveSiteUrl } from "./config";

describe("resolveSiteUrl", () => {
  // undefined girdisi varsayılan parametre üzerinden ortam değişkenini okur;
  // testin sonucu geliştiricinin/CI'ın ortamına bağlı olmasın.
  beforeEach(() => vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined));
  afterEach(() => vi.unstubAllEnvs());

  it.each([
    [undefined, "https://www.socioloc.app"],
    ["", "https://www.socioloc.app"],
    ["   ", "https://www.socioloc.app"],
    ["www.socioloc.app", "https://www.socioloc.app"],
    ["https://www.socioloc.app/", "https://www.socioloc.app"],
    ["http://localhost:3000", "http://localhost:3000"],
  ])("%j → %s", (raw, expected) => {
    expect(resolveSiteUrl(raw)).toBe(expected);
  });

  it("girdi verilmezse ortam değişkenini kullanır", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://staging.socioloc.app/");
    expect(resolveSiteUrl()).toBe("https://staging.socioloc.app");
  });
});
