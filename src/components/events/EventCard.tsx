import Link from "next/link";
import { Calendar, MapPin, Users, Video } from "lucide-react";
import { allParticipantCount, type EventModel } from "@/lib/events/types";
import { parseWallDate } from "@/lib/time";

const TR_MONTHS_SHORT = [
  "Oca",
  "Şub",
  "Mar",
  "Nis",
  "May",
  "Haz",
  "Tem",
  "Ağu",
  "Eyl",
  "Eki",
  "Kas",
  "Ara",
];

function formatEventDate(rawDate: string, rawTime: string): string {
  // Türkiye takvim günü: sunucu (UTC) ve tarayıcı aynı metni üretir.
  const wall = parseWallDate(rawDate);
  if (!wall) return "";
  let out = `${wall.day} ${TR_MONTHS_SHORT[wall.month - 1]}`;
  if (rawTime) out += `, ${rawTime}`;
  return out;
}

function formatLocation(loc: string): string {
  if (!loc) return "";
  const i = loc.indexOf(",");
  return i >= 0 ? loc.slice(0, i).trim() : loc;
}

function capitalizeWords(s: string): string {
  return s
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toLocaleUpperCase("tr-TR") + w.slice(1))
    .join(" ");
}

export function EventCard({ data }: { data: EventModel }) {
  const dateText = formatEventDate(data.date, data.time);
  const isDigital = data.eventType === "Dijital";
  const locationText = isDigital ? "" : formatLocation(data.location);
  const imageUrl = data.thumbUrl || data.image;
  const limit = data.participantLimit;
  const count = allParticipantCount(data);

  return (
    <Link
      href={`/event/${data.docId}`}
      className="group block focus:outline-none"
    >
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-surface/40 transition-all duration-300 hover:border-brand-500/40 hover:bg-surface/60">
        <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden bg-surface-2">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={data.title || "Etkinlik"}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-700/40 to-fuchsia-700/30 text-white/40">
              <Calendar className="size-10" />
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute right-3 top-3 flex flex-wrap items-center gap-2">
            {data.category ? (
              <span className="rounded-full bg-brand-500/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                {data.category}
              </span>
            ) : null}
            {limit > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                <Users className="size-3.5" />
                {count} / {limit}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                <Users className="size-3.5" />
                {count}
              </span>
            )}
          </div>

          {isDigital && data.platformName ? (
            <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
              <Video className="size-3.5" />
              {data.platformName}
            </div>
          ) : null}
        </div>

        <div className="p-4">
          <h3 className="line-clamp-1 text-base font-semibold tracking-tight text-white">
            {data.title ? capitalizeWords(data.title) : "Başlık Yok"}
          </h3>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/60">
            {dateText ? (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-4" />
                {dateText}
              </span>
            ) : null}

            {isDigital ? (
              <span className="inline-flex items-center gap-1.5">
                <Video className="size-4" />
                Online Etkinlik
              </span>
            ) : locationText ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" />
                <span className="line-clamp-1">{locationText}</span>
              </span>
            ) : null}
          </div>

          <div className="mt-3 flex items-center gap-2">
            {data.creatorPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.creatorPhoto}
                alt={data.creatorNickname || "Organizatör"}
                loading="lazy"
                className="size-7 rounded-full border border-white/10 object-cover"
              />
            ) : (
              <div className="size-7 rounded-full border border-white/10 bg-surface-2" />
            )}
            <span className="line-clamp-1 text-xs text-white/55">
              {data.creatorNickname || "Organizatör"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
