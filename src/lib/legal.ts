import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { Marked } from "marked";
import type { Metadata } from "next";
import { SITE } from "@/lib/config";

/**
 * Yasal metinler `content/legal/<slug>.md` dosyalarında durur.
 *
 * - Üstteki `---` bloğu: title, description (meta), intro, updated
 * - Başlıklar `##` / `###`, maddeler `- ` ile açıkça işaretlenir
 * - Tek satır sonu satır sonu olarak korunur (breaks)
 * - Şirket bilgileri yer tutucularla tek kaynaktan (config.ts) gelir:
 *   {{kunye}}, {{email}}, {{yonetimEmail}}, {{telefon}}, {{adres}}, {{web}}
 */
export type LegalSlug =
  | "gizlilik"
  | "kullanim-kosullari"
  | "kvkk"
  | "teslimat-ve-iade"
  | "mesafeli-satis"
  | "ticari-elektronik-ileti";

export type LegalDoc = {
  slug: LegalSlug;
  title: string;
  description: string;
  intro: string;
  updated: string;
  html: string;
};

const markdown = new Marked({ gfm: true, breaks: true });

function placeholders(): Record<string, string> {
  const c = SITE.company;
  const web = new URL(SITE.url).host;
  return {
    kunye: [
      `Ticaret Unvanı: ${c.name}`,
      `Ticaret Sicil No: ${c.tradeRegistry}`,
      `MERSİS No: ${c.mersis}`,
      `Vergi Dairesi / Vergi No: ${c.taxOffice} / ${c.taxNo}`,
      `Merkez Adresi: ${c.address}`,
      `E-posta: ${SITE.legalEmail}`,
      `Destek: ${SITE.email}`,
      `Telefon: ${SITE.phone}`,
      `Web: ${web}`,
    ].join("\n"),
    email: SITE.email,
    yonetimEmail: SITE.legalEmail,
    telefon: SITE.phone,
    adres: c.address,
    web,
  };
}

function parseFrontmatter(raw: string) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  const data: Record<string, string> = {};
  if (!m) return { data, body: raw };
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) {
      // title: "..." gibi tırnaklı yazımlar da kabul edilir.
      const value = line.slice(i + 1).trim().replace(/^(["'])(.*)\1$/, "$2");
      data[line.slice(0, i).trim()] = value;
    }
  }
  return { data, body: raw.slice(m[0].length) };
}

/**
 * Ham Markdown'u (frontmatter dahil) işler. `name` hata mesajları içindir.
 * Dosyadan bağımsız olduğu için testte doğrudan kullanılır.
 */
export function renderLegalMarkdown(
  name: string,
  raw: string,
): Omit<LegalDoc, "slug"> {
  // Windows'ta düzenlenen dosyalar: BOM ve CRLF satır sonları normalize edilir.
  const text = raw.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  const { data, body } = parseFrontmatter(text);

  // Eksik üst bilgi build sırasında yakalansın (sayfa başlıksız yayınlanmasın).
  for (const key of ["title", "updated"] as const) {
    if (!data[key]) throw new Error(`${name}: frontmatter'da "${key}" eksik`);
  }

  const values = placeholders();
  // Boşluklu ({{ kunye }}) ve Türkçe karakterli ({{künye}}) yazımlar da
  // yakalanır; bilinmeyen anahtar build'i durdurur.
  const source = body.replace(/\{\{\s*([^{}]*?)\s*\}\}/g, (_, key: string) => {
    if (!Object.hasOwn(values, key)) {
      throw new Error(`${name}: bilinmeyen yer tutucu {{${key}}}`);
    }
    return values[key];
  });
  // Kapanmamış ya da bozuk yer tutucu ({{kunye}, {kunye}}) sayfaya çıkmasın.
  if (/\{\{|\}\}/.test(source)) {
    throw new Error(`${name}: kapanmamış yer tutucu ("{{" ya da "}}")`);
  }

  return {
    title: data.title,
    description: data.description ?? "",
    intro: data.intro ?? "",
    updated: data.updated,
    html: markdown.parse(source, { async: false }),
  };
}

export function getLegalDoc(slug: LegalSlug): LegalDoc {
  const file = path.join(process.cwd(), "content", "legal", `${slug}.md`);
  const doc = renderLegalMarkdown(`content/legal/${slug}.md`, readFileSync(file, "utf8"));
  return { slug, ...doc };
}

export function legalMetadata(slug: LegalSlug): Metadata {
  const doc = getLegalDoc(slug);
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: `/${slug}` },
  };
}
