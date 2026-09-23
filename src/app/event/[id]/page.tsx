import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Users, Video, Tag, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OpenInAppBanner } from "@/components/events/OpenInAppBanner";
import { fetchEventById } from "@/lib/events/fetch";
import { allParticipantCount, parseEventStart, type EventModel } from "@/lib/events/types";
import { SITE } from "@/lib/config";
import { parseWallDate, toIstanbulISO } from "@/lib/time";

export const revalidate = 60;

interface Props {
  params: Promise<{ id: string }>;
}

const TR_MONTHS = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

function formatDateLong(rawDate: string): string {
  // Türkiye takvim günü; sunucunun (UTC) saat diliminden bağımsız.
  const wall = parseWallDate(rawDate);
  if (!wall) return "";
  return `${wall.day} ${TR_MONTHS[wall.month - 1]} ${wall.year}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  let ev: EventModel | null = null;
  try {
    ev = await fetchEventById(id);
  } catch {
    ev = null;
  }

  const title = ev?.title || "Etkinlik";
  const desc =
    ev?.description?.slice(0, 160) ||
    "SocioLoc'ta bu etkinliğe göz at ve katıl.";
  const image = ev?.thumbUrl || ev?.image || `${SITE.url}/og.png`;
  const url = `${SITE.url}/event/${id}`;

  return {
    title,
    description: desc,
    alternates: { canonical: `/event/${id}` },
    openGraph: {
      title: `${title} — ${SITE.name}`,
      description: desc,
      url,
      siteName: SITE.name,
      locale: "tr_TR",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [image],
    },
    // iOS Smart App Banner — Safari'de bu sayfa açılınca üstte "App'te Aç"
    // butonu görünür. app-argument deep link path'i taşır; uygulama açılınca
    // doğrudan etkinliğe yönlendirilir.
    other: {
      "apple-itunes-app": `app-id=${SITE.appStoreId}, app-argument=${url}`,
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;

  // Okuma hatası üretimde fırlatılır (fetch.ts → STRICT): geçici bir Firestore
  // sorunu yayındaki etkinliği 404 olarak önbelleğe sokmaz.
  const ev = await fetchEventById(id);
  if (!ev) {
    notFound();
  }

  const start = parseEventStart(ev);
  const isDigital = ev.eventType === "Dijital";
  const imageUrl = ev.image || ev.thumbUrl || "";
  const dateLong = formatDateLong(ev.date);
  const participantText =
    ev.participantLimit > 0
      ? `${allParticipantCount(ev)} / ${ev.participantLimit} katılımcı`
      : `${allParticipantCount(ev)} katılımcı`;

  const ldJson = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: ev.title || "Etkinlik",
    description: ev.description || undefined,
    // Ofsetli Türkiye saati: "2026-09-23T20:00:00+03:00"
    startDate: start ? toIstanbulISO(start) : undefined,
    image: imageUrl ? [imageUrl] : undefined,
    eventAttendanceMode: isDigital
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: isDigital
      ? {
          "@type": "VirtualLocation",
          // Toplantı linki (onlineLink) yalnızca katılımcılara; herkese açık
          // yapısal veriye sayfanın kendi adresi yazılır.
          url: `${SITE.url}/event/${id}`,
        }
      : {
          "@type": "Place",
          name: ev.location || undefined,
          geo: ev.geoLocation
            ? {
                "@type": "GeoCoordinates",
                latitude: ev.geoLocation.latitude,
                longitude: ev.geoLocation.longitude,
              }
            : undefined,
        },
    organizer: ev.creatorNickname
      ? { "@type": "Person", name: ev.creatorNickname }
      : undefined,
    url: `${SITE.url}/event/${id}`,
  };

  return (
    <>
      <Header />
      <OpenInAppBanner eventId={id} />
      <main className="flex-1">
        <article className="container-x pt-8 pb-24">
          <Link
            href="/etkinlikler"
            className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white"
          >
            <span aria-hidden>←</span>
            Tüm etkinlikler
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <div className="overflow-hidden rounded-3xl border border-white/[0.06] bg-surface-2">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={ev.title || "Etkinlik"}
                  className="aspect-[4/5] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/5] w-full items-center justify-center bg-gradient-to-br from-brand-700/40 to-fuchsia-700/30 text-white/40">
                  <Calendar className="size-12" />
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                {ev.category ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/15 px-3 py-1 text-xs font-medium text-brand-100 ring-1 ring-brand-500/30">
                    <Tag className="size-3.5" />
                    {ev.category}
                  </span>
                ) : null}
                {isDigital ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-3 py-1 text-xs font-medium text-white/80">
                    <Video className="size-3.5" />
                    Online
                  </span>
                ) : null}
              </div>

              <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                {ev.title || "Etkinlik"}
              </h1>

              {ev.creatorNickname ? (
                <div className="mt-3 flex items-center gap-2 text-sm text-white/65">
                  {ev.creatorPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ev.creatorPhoto}
                      alt={ev.creatorNickname}
                      className="size-7 rounded-full border border-white/10 object-cover"
                    />
                  ) : (
                    <div className="size-7 rounded-full border border-white/10 bg-surface" />
                  )}
                  <span>
                    Düzenleyen{" "}
                    <span className="text-white/90 font-medium">
                      @{ev.creatorNickname}
                    </span>
                  </span>
                </div>
              ) : null}

              <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {dateLong ? (
                  <InfoItem icon={<Calendar className="size-4" />} label="Tarih">
                    {dateLong}
                    {ev.time ? `, ${ev.time}` : ""}
                  </InfoItem>
                ) : null}

                {!isDigital && ev.location ? (
                  <InfoItem icon={<MapPin className="size-4" />} label="Konum">
                    {ev.location}
                  </InfoItem>
                ) : null}

                {isDigital && ev.platformName ? (
                  <InfoItem icon={<Video className="size-4" />} label="Platform">
                    {ev.platformName}
                  </InfoItem>
                ) : null}

                <InfoItem icon={<Users className="size-4" />} label="Katılım">
                  {participantText}
                </InfoItem>
              </dl>

              {ev.description ? (
                <div className="mt-6 rounded-2xl border border-white/[0.06] bg-surface/40 p-5">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-white/55">
                    Açıklama
                  </h2>
                  <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-white/85">
                    {ev.description}
                  </p>
                </div>
              ) : null}

              {ev.rules ? (
                <div className="mt-4 rounded-2xl border border-white/[0.06] bg-surface/40 p-5">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-white/55">
                    Kurallar
                  </h2>
                  <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-white/85">
                    {ev.rules}
                  </p>
                </div>
              ) : null}

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  // Custom scheme — uygulama yüklüyse tarayıcı bunu yakalar,
                  // tüm tarayıcılarda (Chrome iOS dahil) güvenilir çalışır.
                  // Universal Link aynı domain'de tetiklenmediği için bu
                  // tek yöntem her tarayıcıda uygulamayı açabiliyor.
                  href={`socioloc://event/${id}`}
                  className="btn-primary h-11 px-6 text-sm group"
                >
                  Uygulamada aç
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href={SITE.appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/10 bg-white/[0.04] px-5 h-11 inline-flex items-center text-sm text-white/85 hover:bg-white/[0.08]"
                >
                  App Store
                </a>
                <a
                  href={SITE.googlePlayUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/10 bg-white/[0.04] px-5 h-11 inline-flex items-center text-sm text-white/85 hover:bg-white/[0.08]"
                >
                  Google Play
                </a>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        // Başlık/açıklama kullanıcı içeriği: "</script>" ile etiketten
        // kaçıp kod çalıştırmasın diye "<" karakteri kaçırılır.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ldJson).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}

function InfoItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-surface/40 p-4">
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-white/50">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-sm text-white/90">{children}</div>
    </div>
  );
}
