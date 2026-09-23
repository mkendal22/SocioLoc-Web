import { describe, expect, it } from "vitest";
import { applyFilters, type DateFilter, type FilterableEvent } from "./filter";

// 23 Eylül 21:30 UTC = 24 Eylül Perşembe 00:30 İstanbul.
// Sunucu UTC'de olsa bile "bugün" İstanbul'a göre 24 Eylül olmalı.
const NOW = new Date("2026-09-23T21:30:00Z");

function ev(date: string, time = "20:00", over: Partial<FilterableEvent> = {}): FilterableEvent {
  return {
    title: `${date} ${time}`,
    description: "",
    date,
    time,
    eventType: "Mekan",
    category: null,
    ...over,
  };
}

const EVENTS = [
  ev("20.09.2026", "10:00"), // 3 günden eski → gizli
  ev("21.09.2026", "12:00"), // Pazartesi
  ev("23.09.2026", "23:00"), // İstanbul'da dün (UTC'ye göre "bugün" sanılırdı)
  ev("24.09.2026"), // bugün
  ev("25.09.2026"), // yarın
  ev("26.09.2026"), // Cumartesi
  ev("27.09.2026"), // Pazar
  ev("28.09.2026"), // gelecek hafta
  ev("30.09.2026"),
  ev("01.10.2026"),
];

function titles(filter: DateFilter) {
  return applyFilters(EVENTS, { selectedDateFilter: filter, now: NOW }).map((e) => e.date);
}

describe("applyFilters — tarih filtreleri İstanbul takvimine göre", () => {
  it("Tümü: 3 günden eski etkinlik gizlenir", () => {
    expect(titles("Tümü")).not.toContain("20.09.2026");
    expect(titles("Tümü")).toContain("21.09.2026");
  });

  it("Bugün: UTC'de hâlâ 23'ü olsa da İstanbul'da 24'ü", () => {
    expect(titles("Bugün")).toEqual(["24.09.2026"]);
  });

  it("Yarın", () => {
    expect(titles("Yarın")).toEqual(["25.09.2026"]);
  });

  it("Bu hafta sonu: Cumartesi + Pazar", () => {
    expect(titles("Bu hafta sonu")).toEqual(["26.09.2026", "27.09.2026"]);
  });

  it("Bu hafta: Pazartesi–Pazar", () => {
    expect(titles("Bu hafta")).toEqual([
      "21.09.2026",
      "23.09.2026",
      "24.09.2026",
      "25.09.2026",
      "26.09.2026",
      "27.09.2026",
    ]);
  });

  it("Bu ay: yalnızca Eylül", () => {
    expect(titles("Bu ay")).not.toContain("01.10.2026");
    expect(titles("Bu ay")).toContain("30.09.2026");
  });
});

describe("applyFilters — arama ve tür", () => {
  const list = [
    ev("25.09.2026", "20:00", { title: "İstanbul Konseri" }),
    ev("25.09.2026", "21:00", { title: "Yoga", eventType: "Dijital" }),
  ];

  it("Türkçe büyük/küçük harf (İ/ı) doğru eşleşir", () => {
    const q = (searchQuery: string) =>
      applyFilters(list, { searchQuery, now: NOW }).map((e) => e.title);
    expect(q("istanbul")).toEqual(["İstanbul Konseri"]);
    expect(q("İSTANBUL")).toEqual(["İstanbul Konseri"]);
    expect(q("KONSER")).toEqual(["İstanbul Konseri"]);
  });

  it("etkinlik türüne göre süzer", () => {
    expect(
      applyFilters(list, { eventType: "Dijital", now: NOW }).map((e) => e.title),
    ).toEqual(["Yoga"]);
  });
});
