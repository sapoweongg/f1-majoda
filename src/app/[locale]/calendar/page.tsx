import { serverNow } from "@/lib/clock";
import { gpName } from "@/lib/gp-names";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCurrentSeason, getSchedule, getSeasonWinners } from "@/lib/api/jolpica";
import { getForecast } from "@/lib/api/weather";
import { trackShape } from "@/lib/circuits";
import { countryToIso } from "@/lib/countries";
import { clampSeason, cn } from "@/lib/format";
import { raceStart } from "@/lib/mapping";
import { safe } from "@/lib/safe";
import { weekendSessions } from "@/lib/view";
import { TrackOutline } from "@/components/track/TrackOutline";
import { EmptyState, Flag, GlassCard, PageTitle, SectionHeader } from "@/components/ui/primitives";
import { SeasonSelect } from "@/components/ui/SeasonSelect";
import { RacesTabs } from "@/components/races/RacesTabs";
import { Countdown, LocalTime, TimeZoneName } from "@/components/ui/time";
import { WeatherIcon } from "@/components/ui/Weather";

export async function generateMetadata({ params }: PageProps<"/[locale]/calendar">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("calendar") };
}

// Proyección equirectangular igual que public/world.svg (1000×500)
const project = (lat: number, lng: number) => ({ x: ((lng + 180) / 360) * 1000, y: ((90 - lat) / 180) * 500 });

export default async function CalendarPage({ params, searchParams }: PageProps<"/[locale]/calendar">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations("calendar");
  const tc = await getTranslations("common");
  const ts = await getTranslations("sessions");
  const tr = await getTranslations("races");

  const current = await safe(getCurrentSeason(), new Date().getUTCFullYear());
  const season = clampSeason(sp.season as string | undefined, current, current + 1);
  const [schedule, winners] = await Promise.all([safe(getSchedule(season), []), safe(getSeasonWinners(season), [])]);
  const winnerByRound = new Map(winners.map((w) => [w.round, w.Results?.[0]]));
  const now = serverNow();
  const next = schedule.find((r) => raceStart(r).getTime() + 3 * 3600 * 1000 > now);

  // Pronóstico solo para los GPs de los próximos 16 días
  const forecasts = new Map<string, Awaited<ReturnType<typeof getForecast>>[number][]>();
  await Promise.all(
    schedule
      .filter((r) => {
        const days = (raceStart(r).getTime() - now) / 86400000;
        return days > -1 && days < 15;
      })
      .map(async (r) => {
        const list = await safe(getForecast(Number(r.Circuit.Location.lat), Number(r.Circuit.Location.long)), []);
        const dates = weekendSessions(r).map((s) => s.iso.slice(0, 10));
        forecasts.set(r.round, list.filter((f) => dates.includes(f.date)));
      }),
  );

  return (
    <div>
      <PageTitle
        eyebrow={
          <span>
            {t("localTime")} · <TimeZoneName />
          </span>
        }
        title={t("title", { season })}
      >
        <SeasonSelect value={season} max={current + 1} />
      </PageTitle>
      <RacesTabs season={season} current={current} active="calendar" />

      {schedule.length === 0 ? (
        <EmptyState>{tc("noData")}</EmptyState>
      ) : (
        <div className="space-y-8">
          <GlassCard className="overflow-hidden p-0">
            <div className="p-5 pb-0">
              <SectionHeader title={t("map")} className="mb-2" />
            </div>
            <div className="relative">
              <svg viewBox="0 0 1000 500" className="w-full" role="img" aria-label={t("map")}>
                <image href="/world.svg" width="1000" height="500" />
                {/* Recorrido de la temporada en orden */}
                <polyline
                  points={schedule
                    .map((r) => project(Number(r.Circuit.Location.lat), Number(r.Circuit.Location.long)))
                    .map((p) => `${p.x},${p.y}`)
                    .join(" ")}
                  fill="none"
                  stroke="rgba(255,59,31,0.35)"
                  strokeWidth={1.2}
                  strokeDasharray="3 3"
                />
                {schedule.map((r) => {
                  const p = project(Number(r.Circuit.Location.lat), Number(r.Circuit.Location.long));
                  const done = raceStart(r).getTime() < now;
                  const isNext = r.round === next?.round;
                  return (
                    <a key={r.round} href={`#gp-${r.round}`}>
                      <title>{`${r.round}. ${gpName(r.raceName, locale)}`}</title>
                      {isNext && <circle cx={p.x} cy={p.y} r={11} fill="#ff3b1f" opacity={0.25} className="live-dot" />}
                      <circle cx={p.x} cy={p.y} r={isNext ? 6 : 4.5} fill={done ? "#6e6e78" : "#ff3b1f"} stroke="#111114" strokeWidth={2} />
                    </a>
                  );
                })}
              </svg>
            </div>
          </GlassCard>

          <div className="grid gap-4 md:grid-cols-2">
            {schedule.map((race) => {
              const done = raceStart(race).getTime() < now;
              const isNext = race.round === next?.round;
              const w = winnerByRound.get(race.round);
              const shape = trackShape(race.Circuit.circuitId, season);
              const fc = forecasts.get(race.round) ?? [];
              const sessions = weekendSessions(race);
              return (
                <article
                  key={race.round}
                  id={`gp-${race.round}`}
                  className={cn(
                    "glass relative scroll-mt-24 overflow-hidden p-5",
                    isNext && "ember-glow border-accent/40",
                    done && !isNext && "opacity-80",
                  )}
                >
                  {shape && (
                    <TrackOutline
                      shape={shape}
                      variant="mini"
                      className="absolute -right-6 -top-6 h-44 w-44 text-white/[0.06]"
                    />
                  )}
                  <div className="relative">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="eyebrow">
                        {tc("round")} {race.round}
                      </span>
                      {race.Sprint && <span className="chip !py-0 !text-[10px]">{t("sprintWeekend")}</span>}
                      {isNext && <span className="chip !border-accent/40 !py-0 !text-[10px] !text-accent">{t("next")}</span>}
                      {done && <span className="chip !py-0 !text-[10px]">{t("completed")}</span>}
                    </div>
                    <h3 className="display mt-2 flex items-center gap-2 text-2xl">
                      <Flag iso={countryToIso(race.Circuit.Location.country)} />
                      <Link href={`/races/${season}/${race.round}`} className="hover:text-accent">
                        {gpName(race.raceName, locale)}
                      </Link>
                    </h3>
                    <p className="text-xs text-ink-3">
                      {race.Circuit.circuitName} · {race.Circuit.Location.locality}
                    </p>

                    {isNext && (
                      <div className="mt-4">
                        <Countdown target={sessions.find((s) => new Date(s.iso).getTime() > now)?.iso ?? raceStart(race).toISOString()} compact />
                      </div>
                    )}

                    <ul className="mt-4 grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
                      {sessions.map((s) => (
                        <li key={s.key} className="flex justify-between gap-3 rounded-lg bg-white/[0.03] px-3 py-1.5">
                          <span className={s.key === "Race" ? "font-semibold" : "text-ink-2"}>{ts(s.key)}</span>
                          <LocalTime
                            iso={s.iso}
                            options={{ weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }}
                            className="num text-ink-2"
                          />
                        </li>
                      ))}
                    </ul>

                    {fc.length > 0 && (
                      <div className="mt-4">
                        <p className="eyebrow mb-2">{t("forecast")}</p>
                        <div className="flex gap-2">
                          {fc.map((f) => (
                            <div key={f.date} className="flex items-center gap-2 rounded-xl border border-line bg-black/25 px-3 py-2">
                              <WeatherIcon code={f.code} className="text-yellow" />
                              <div className="text-xs leading-tight">
                                <LocalTime iso={`${f.date}T12:00:00Z`} options={{ weekday: "short" }} className="text-ink-3" />
                                <p className="num font-semibold">
                                  {Math.round(f.tMax)}° <span className="font-normal text-ink-3">{f.rainProb}%</span>
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {w && (
                      <p className="mt-4 text-sm">
                        <span className="text-ink-3">{tr("winner")}:</span>{" "}
                        <Link href={`/drivers/${w.Driver.driverId}`} className="font-semibold hover:text-accent">
                          {w.Driver.givenName} {w.Driver.familyName}
                        </Link>{" "}
                        <span className="text-ink-3">· {w.Constructor.name}</span>
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
