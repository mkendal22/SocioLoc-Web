/**
 * Etkinlik tarih/saatleri mobilde Türkiye saatiyle girilir. Sunucu (Vercel)
 * UTC'de, ziyaretçi ise herhangi bir saat diliminde olabilir; bu yüzden tüm
 * takvim hesapları açıkça Europe/Istanbul üzerinden yapılır. Sunucu ve
 * tarayıcı aynı sonucu üretir (hydration uyuşmazlığı olmaz).
 */
export const TIME_ZONE = "Europe/Istanbul";

/** İstanbul takvim günü. `month` 1–12. */
export type WallDate = { year: number; month: number; day: number };

const partsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

function istanbulParts(date: Date) {
  const p: Record<string, number> = {};
  for (const { type, value } of partsFormatter.formatToParts(date)) {
    if (type !== "literal") p[type] = Number(value);
  }
  return {
    year: p.year,
    month: p.month,
    day: p.day,
    hour: p.hour,
    minute: p.minute,
    second: p.second,
  };
}

/** Verilen anda İstanbul'un UTC'ye göre farkı (dakika). */
export function istanbulOffsetMinutes(date: Date): number {
  const p = istanbulParts(date);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  const wholeSeconds = Math.floor(date.getTime() / 1000) * 1000;
  return Math.round((asUtc - wholeSeconds) / 60_000);
}

/** İstanbul duvar saati (takvim günü + saat) → gerçek an. */
export function istanbulDate(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
): Date {
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  const offset = istanbulOffsetMinutes(new Date(guess));
  return new Date(guess - offset * 60_000);
}

/** Bir anın İstanbul'daki takvim günü. */
export function istanbulWallDate(date: Date): WallDate {
  const p = istanbulParts(date);
  return { year: p.year, month: p.month, day: p.day };
}

/** Takvim günü → karşılaştırılabilir gün numarası. */
export function dayNumber(d: WallDate): number {
  return Math.floor(Date.UTC(d.year, d.month - 1, d.day) / 86_400_000);
}

/** Pazartesi = 1 … Pazar = 7 (mobildeki Dart `weekday` ile aynı). */
export function isoWeekday(d: WallDate): number {
  const wd = new Date(Date.UTC(d.year, d.month - 1, d.day)).getUTCDay();
  return wd === 0 ? 7 : wd;
}

/** JSON-LD için ofsetli ISO: "2026-09-23T20:00:00+03:00". */
export function toIstanbulISO(date: Date): string {
  const p = istanbulParts(date);
  const offset = istanbulOffsetMinutes(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  const sign = offset >= 0 ? "+" : "-";
  const abs = Math.abs(offset);
  return (
    `${p.year}-${pad(p.month)}-${pad(p.day)}` +
    `T${pad(p.hour)}:${pad(p.minute)}:${pad(p.second)}` +
    `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
  );
}

function validWallDate(d: WallDate): WallDate | null {
  const probe = new Date(Date.UTC(d.year, d.month - 1, d.day));
  const ok =
    probe.getUTCFullYear() === d.year &&
    probe.getUTCMonth() === d.month - 1 &&
    probe.getUTCDate() === d.day;
  return ok ? d : null;
}

const OFFSET_ISO = /T.*(Z|[+-]\d{2}:?\d{2})$/i;

/**
 * Mobilin yazdığı tarih biçimlerini İstanbul takvim gününe çevirir:
 * "YYYY-MM-DD", "DD.MM.YYYY" ve ISO ("…T…", ofsetli ya da ofsetsiz).
 */
export function parseWallDate(raw: string): WallDate | null {
  const s = raw.trim();
  if (!s) return null;

  let m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (m) return validWallDate({ year: +m[3], month: +m[2], day: +m[1] });

  m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return validWallDate({ year: +m[1], month: +m[2], day: +m[3] });

  // Ofsetli ISO gerçek bir andır: o anın İstanbul günü alınır.
  if (OFFSET_ISO.test(s)) {
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : istanbulWallDate(d);
  }

  // Ofsetsiz ISO ("2026-09-23T20:00:00.000"): tarih kısmı İstanbul günüdür.
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})T/);
  if (m) return validWallDate({ year: +m[1], month: +m[2], day: +m[3] });

  return null;
}

/** "HH:mm" → saat/dakika. */
export function parseClock(raw: string): { hour: number; minute: number } | null {
  const m = raw.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const hour = +m[1];
  const minute = +m[2];
  if (hour > 23 || minute > 59) return null;
  return { hour, minute };
}

/**
 * Etkinliğin başlangıç anı. `time` varsa İstanbul günü + o saat; yoksa ISO
 * içindeki saat (ofsetliyse an olduğu gibi), o da yoksa gün başı.
 */
export function eventStartInstant(date: string, time: string): Date | null {
  const wall = parseWallDate(date);
  if (!wall) return null;

  let clock = parseClock(time);
  if (!clock) {
    const s = date.trim();
    if (OFFSET_ISO.test(s)) {
      const d = new Date(s);
      return Number.isNaN(d.getTime()) ? null : d;
    }
    const m = s.match(/T(\d{2}):(\d{2})/);
    clock = m ? { hour: +m[1], minute: +m[2] } : { hour: 0, minute: 0 };
  }
  return istanbulDate(wall.year, wall.month, wall.day, clock.hour, clock.minute);
}
