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
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { data, body: raw.slice(m[0].length) };
}

export function getLegalDoc(slug: LegalSlug): LegalDoc {
  const file = path.join(process.cwd(), "content", "legal", `${slug}.md`);
  const { data, body } = parseFrontmatter(readFileSync(file, "utf8"));

  const values = placeholders();
  const source = body.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = values[key];
    // Yazım hatası build sırasında yakalansın, sayfaya "{{...}}" çıkmasın.
    if (value === undefined) {
      throw new Error(`content/legal/${slug}.md: bilinmeyen yer tutucu {{${key}}}`);
    }
    return value;
  });

  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    intro: data.intro ?? "",
    updated: data.updated ?? "",
    html: markdown.parse(source, { async: false }),
  };
}

export function legalMetadata(slug: LegalSlug): Metadata {
  const doc = getLegalDoc(slug);
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: `/${slug}` },
  };
}
