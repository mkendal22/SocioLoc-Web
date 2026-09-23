import {
  dayNumber,
  isoWeekday,
  istanbulWallDate,
  parseWallDate,
} from "@/lib/time";
import { parseEventStart } from "./types";

export type DateFilter =
  | "Tümü"
  | "Yaklaşan"
  | "Bugün"
  | "Yarın"
  | "Bu hafta sonu"
  | "Bu hafta"
  | "Bu ay";

/** Filtrelemenin ihtiyaç duyduğu alanlar (EventModel ve PublicEvent ikisi de sağlar). */
export interface FilterableEvent {
  title: string;
  description: string;
  date: string;
  time: string;
  eventType: string;
  category: string | null;
}

export interface EventFilterParams {
  searchQuery?: string;
  selectedDateFilter?: DateFilter;
  selectedCategories?: Set<string>;
  eventType?: string | null;
  filterTimeStart?: string | null;
  filterTimeEnd?: string | null;
  /** "expired" eventleri kaç gün sonra gizle (mobilde 3 gün). */
  expireGraceDays?: number;
  /** Test ve önbellek için sabitlenebilir "şimdi". */
  now?: Date;
}

/** Mobilden 1-1 port edilmiş filtre. Takvim hesapları Türkiye saatine göre. */
export function applyFilters<T extends FilterableEvent>(
  events: T[],
  params: EventFilterParams = {},
): T[] {
  const {
    searchQuery = "",
    selectedDateFilter = "Tümü",
    selectedCategories,
    eventType = null,
    filterTimeStart = null,
    filterTimeEnd = null,
    expireGraceDays = 3,
    now = new Date(),
  } = params;

  const search = searchQuery.trim().toLocaleLowerCase("tr-TR");

  const filtered = events.filter((data) => {
    // Süresi geçmiş etkinlikleri grace gün sonra gizle (tarih DD.MM.YYYY / ISO)
    const eventStart = parseEventStart(data);
    if (eventStart) {
      const ageDays = (now.getTime() - eventStart.getTime()) / 86_400_000;
      if (ageDays > expireGraceDays) return false;
    }

    if (search) {
      const title = (data.title || "").toLocaleLowerCase("tr-TR");
      const desc = (data.description || "").toLocaleLowerCase("tr-TR");
      if (!title.includes(search) && !desc.includes(search)) return false;
    }

    if (eventType && data.eventType !== eventType) return false;

    if (filterTimeStart && filterTimeEnd) {
      if (!matchesTimeRange(data.time, filterTimeStart, filterTimeEnd)) {
        return false;
      }
    }

    if (selectedDateFilter && selectedDateFilter !== "Tümü") {
      if (!matchesDateFilter(data.date, selectedDateFilter, now)) return false;
    }

    if (selectedCategories && selectedCategories.size > 0) {
      if (!selectedCategories.has(data.category ?? "")) return false;
    }

    return true;
  });

  return filtered;
}

function matchesTimeRange(rawTime: string, start: string, end: string): boolean {
  if (!rawTime) return false;
  try {
    const toMinutes = (t: string) => {
      const parts = t.split(":");
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    };
    const eventMin = toMinutes(rawTime);
    const startMin = toMinutes(start);
    const endMin = toMinutes(end);
    if (startMin <= endMin) {
      return eventMin >= startMin && eventMin <= endMin;
    }
    return eventMin >= startMin || eventMin <= endMin;
  } catch {
    return false;
  }
}

function matchesDateFilter(rawDate: string, filter: DateFilter, now: Date): boolean {
  const wall = parseWallDate(rawDate);
  if (!wall) return false;

  const eventDay = dayNumber(wall);
  const todayWall = istanbulWallDate(now);
  const today = dayNumber(todayWall);
  // Pazartesi=1 ... Pazar=7 (Dart weekday)
  const wd = isoWeekday(todayWall);

  let start: number;
  let end: number;

  switch (filter) {
    case "Yaklaşan":
      start = today;
      end = today + 7;
      break;
    case "Bugün":
      start = today;
      end = today + 1;
      break;
    case "Yarın":
      start = today + 1;
      end = today + 2;
      break;
    case "Bu hafta sonu":
      start = wd >= 6 ? today - (wd - 6) : today + (6 - wd);
      end = start + 2;
      break;
    case "Bu hafta":
      start = today - (wd - 1);
      end = start + 7;
      break;
    case "Bu ay": {
      const { year, month } = todayWall;
      start = dayNumber({ year, month, day: 1 });
      end =
        month === 12
          ? dayNumber({ year: year + 1, month: 1, day: 1 })
          : dayNumber({ year, month: month + 1, day: 1 });
      break;
    }
    default:
      return true;
  }

  return eventDay >= start && eventDay < end;
}
