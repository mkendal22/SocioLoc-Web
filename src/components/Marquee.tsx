const TAGS = [
  "Etkinlik",
  "Sohbet",
  "Topluluk",
  "Konser",
  "Yoga",
  "Atölye",
  "Yürüyüş",
  "Workshop",
  "Kahve",
  "Tanışma",
  "Doğa",
  "Spor",
  "Müzik",
  "Sanat",
  "Festival",
];

export function Marquee() {
  return (
    <div className="marquee py-8 border-y border-white/5 bg-white/[0.015]">
      {[0, 1].map((row) => (
        <div className="marquee-track" key={row} aria-hidden={row === 1}>
          {TAGS.concat(TAGS).map((t, i) => (
            <span
              key={`${row}-${i}`}
              className="text-2xl sm:text-3xl font-semibold tracking-tight text-white/30 whitespace-nowrap flex items-center gap-12"
            >
              {t}
              <span className="size-1.5 rounded-full bg-brand-500/60" aria-hidden />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
