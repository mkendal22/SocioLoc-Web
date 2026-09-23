import { parseEventStart, type EventModel } from "./types";

export type DateFilter =
  | "Tümü"
  | "Yaklaşan"
  | "Bugün"
  | "Yarın"
  | "Bu hafta sonu"
  | "Bu hafta"
  | "Bu ay";

export interface EventFilterParams {
  searchQuery?: string;
  selectedDateFilter?: DateFilter;
  selectedCategories?: Set<string>;
  eventType?: string | null;
  filterTimeStart?: string | null;
  filterTimeEnd?: string | null;
  /** "expired" eventleri kaç gün sonra gizle (mobilde 3 gün). */
  expireGraceDays?: number;
}

/** Mobilden 1-1 port edilmiş filtre + (mesafe yoksa) varsayılan sıralama (createdAt desc). */
export function applyFilters(
  events: EventModel[],
  params: EventFilterParams = {},
): EventModel[] {
  const {
    searchQuery = "",
    selectedDateFilter = "Tümü",
    selectedCategories,
    eventType = null,
    filterTimeStart = null,
    filterTimeEnd = null,
    expireGraceDays = 3,
  } = params;

  const now = new Date();
  const search = searchQuery.trim().toLowerCase();

  const filtered = events.filter((data) => {
    // Süresi geçmiş etkinlikleri grace gün sonra gizle (tarih DD.MM.YYYY / ISO)
    const eventStart = parseEventStart(data);
    if (eventStart) {
      const ageDays = (now.getTime() - eventStart.getTime()) / 86_400_000;
      if (ageDays > expireGraceDays) return false;
    }

    if (search) {
      const title = (data.title || "").toLowerCase();
      const desc = (data.description || "").toLowerCase();
      if (!title.includes(search) && !desc.includes(search)) return false;
    }

    if (eventType && data.eventType !== eventType) return false;

    if (filterTimeStart && filterTimeEnd) {
      if (!matchesTimeRange(data.time, filterTimeStart, filterTimeEnd)) {
        return false;
      }
    }

    if (selectedDateFilter && selectedDateFilter !== "Tümü") {
      if (!matchesDateFilter(data.date, selectedDateFilter)) return false;
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

function matchesDateFilter(rawDate: string, filter: DateFilter): boolean {
  if (!rawDate) return false;
  try {
    const eventDate = new Date(rawDate);
    if (Number.isNaN(eventDate.getTime())) return false;
    const eventOnly = startOfDay(eventDate);
    const today = startOfDay(new Date());

    let start: Date | null = null;
    let end: Date | null = null;

    switch (filter) {
      case "Yaklaşan":
        start = today;
        end = addDays(today, 7);
        break;
      case "Bugün":
        start = today;
        end = addDays(start, 1);
        break;
      case "Yarın":
        start = addDays(today, 1);
        end = addDays(start, 1);
        break;
      case "Bu hafta sonu": {
        const wd = new Date().getDay() === 0 ? 7 : new Date().getDay();
        // Pazartesi=1 ... Pazar=7 (Dart weekday)
        if (wd >= 6) {
          start = addDays(today, -(wd - 6));
        } else {
          start = addDays(today, 6 - wd);
        }
        end = addDays(start, 2);
        break;
      }
      case "Bu hafta": {
        const wd = new Date().getDay() === 0 ? 7 : new Date().getDay();
        const daysFromMon = wd - 1;
        start = addDays(today, -daysFromMon);
        end = addDays(start, 7);
        break;
      }
      case "Bu ay": {
        const t = new Date();
        start = new Date(t.getFullYear(), t.getMonth(), 1);
        end =
          t.getMonth() === 11
            ? new Date(t.getFullYear() + 1, 0, 1)
            : new Date(t.getFullYear(), t.getMonth() + 1, 1);
        break;
      }
      default:
        return true;
    }

    if (!start || !end) return true;
    const sOnly = startOfDay(start);
    const eOnly = startOfDay(end);
    return eventOnly.getTime() >= sOnly.getTime() && eventOnly.getTime() < eOnly.getTime();
  } catch {
    return false;
  }
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
