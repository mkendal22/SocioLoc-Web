import { describe, expect, it } from "vitest";
import { SITE } from "./config";
import { getLegalDoc, renderLegalMarkdown, type LegalSlug } from "./legal";

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

describe("renderLegalMarkdown", () => {
  const doc = (body: string) =>
    ["---", "title: Deneme", "updated: 1 Ekim 2026", "---", "", body].join("\n");

  it("CRLF ve BOM'lu dosyada frontmatter okunur, gövdeye sızmaz", () => {
    const raw = "\uFEFF" + doc("## Başlık\n\nMetin").replace(/\n/g, "\r\n");
    const out = renderLegalMarkdown("deneme.md", raw);
    expect(out.title).toBe("Deneme");
    expect(out.updated).toBe("1 Ekim 2026");
    expect(out.html).not.toContain("title:");
    expect(out.html).toContain("<h2>Başlık</h2>");
  });

  it("tırnaklı frontmatter değeri", () => {
    const raw = doc("Metin").replace("title: Deneme", 'title: "Deneme"');
    expect(renderLegalMarkdown("deneme.md", raw).title).toBe("Deneme");
  });

  it("boşluklu yer tutucu çözülür", () => {
    expect(renderLegalMarkdown("deneme.md", doc("{{ email }}")).html).toContain(
      "info@socioloc.app",
    );
  });

  it.each(["{{künye}}", "{{constructor}}", "{{bilinmeyen}}"])(
    "bilinmeyen yer tutucu hata verir: %s",
    (tag) => {
      expect(() => renderLegalMarkdown("deneme.md", doc(tag))).toThrow(
        /bilinmeyen yer tutucu/,
      );
    },
  );

  it.each(["{{kunye}", "{kunye}}"])("kapanmamış yer tutucu hata verir: %s", (tag) => {
    expect(() => renderLegalMarkdown("deneme.md", doc(tag))).toThrow(/kapanmamış/);
  });

  it("üst bilgideki yer tutucular da çözülür ve denetlenir", () => {
    const raw = doc("Metin").replace("title: Deneme", "title: Deneme\nintro: {{web}} için");
    const web = new URL(SITE.url).host;
    expect(renderLegalMarkdown("deneme.md", raw).intro).toBe(`${web} için`);
    const bad = doc("Metin").replace("title: Deneme", "title: Deneme\nintro: {{kunye}");
    expect(() => renderLegalMarkdown("deneme.md", bad)).toThrow(/kapanmamış/);
  });

  it("title ya da updated eksikse hata verir", () => {
    expect(() => renderLegalMarkdown("deneme.md", "## Başlık")).toThrow(/title/);
  });
});
