import { describe, expect, it } from "vitest";
import { resolveSiteUrl } from "./config";

describe("resolveSiteUrl", () => {
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
});
