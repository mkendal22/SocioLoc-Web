import { describe, expect, it } from "vitest";
import { getLegalDoc, type LegalSlug } from "./legal";

const SLUGS: LegalSlug[] = [
  "gizlilik",
  "kullanim-kosullari",
  "kvkk",
  "teslimat-ve-iade",
  "mesafeli-satis",
  "ticari-elektronik-ileti",
];

// Şirket künyesi basılan metinler
const WITH_KUNYE: LegalSlug[] = ["gizlilik", "kvkk", "teslimat-ve-iade", "mesafeli-satis"];

describe("content/legal/*.md", () => {
  it.each(SLUGS)("%s: başlık, tarih ve gövde dolu; yer tutucu kalmamış", (slug) => {
    const doc = getLegalDoc(slug);
    expect(doc.title).not.toBe("");
    expect(doc.updated).toMatch(/^\d{1,2} \S+ \d{4}$/);
    expect(doc.html).toContain("<h2>");
    expect(doc.html).not.toContain("{{");
  });

  it.each(WITH_KUNYE)("%s: künye config.ts'ten basılıyor", (slug) => {
    const { html } = getLegalDoc(slug);
    expect(html).toContain("Ticaret Unvanı: Socioloc Teknoloji Anonim Şirketi");
    expect(html).toContain("MERSİS No: 0772176093000001");
  });
});
