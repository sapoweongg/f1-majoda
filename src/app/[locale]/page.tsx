import { getTranslations, setRequestLocale } from "next-intl/server";
import { Radio } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  getConstructorStandings,
  getCurrentSeason,
  getDriverStandings,
  getRace,
  getSchedule,
  getSeasonResults,
  getSeasonSprints,
} from "@/lib/api/jolpica";
import { getLatestSession } from "@/lib/api/openf1";
import { getForecast } from "@/lib/api/weather";
import { isSessionLive } from "@/lib/live-types";
import { buildProgression } from "@/lib/championship";
import { circuitInfo, trackShape } from "@/lib/circuits";
import { countryToIso } from "@/lib/countries";
import { raceStart } from "@/lib/mapping";
import { getDriverPhotos } from "@/lib/photos";
import { safe } from "@/lib/safe";
import { teamColor } from "@/lib/teams";
import { driverCard, lastRace, nextRace, progressionSeries, teamCard, weekendSessions } from "@/lib/view";
import { DriverCard } from "@/components/cards/DriverCard";
import { TeamCard } from "@/components/cards/TeamCard";
import { LineSeriesChart } from "@/components/charts/LineSeriesChart";
import { TrackOutline } from "@/components/track/TrackOutline";
import { DriverAvatar } from "@/components/ui/media";
import { EmptyState, Flag, GlassCard, SectionHeader } from "@/components/ui/primitives";
import { RatingWidget } from "@/components/ui/Rating";
import { Countdown, LocalTime } from "@/components/ui/time";
import { ForecastChip } from "@/components/ui/Weather";

export const revalidate = 300;

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const ts = await getTranslations("sessions");
  const tcal = await getTranslations("calendar");

  const season = await safe(getCurrentSeason(), new Date().getUTCFullYear());
  const now = new Date();
  const schedule = await safe(getSchedule(season), []);
  const [driverStandings, constructorStandings, latestSession] = await Promise.all([
    safe(getDriverStandings(season), { round: 0, standings: [] }),
    safe(getConstructorStandings(season), { round: 0, standings: [] }),
    safe(getLatestSession(), undefined),
  ]);

  // Pretemporada (o primera carrera aún sin clasificar): mostramos la clasificación del año anterior.
  // Se decide con el calendario y no solo porque la respuesta llegue vacía: si la API falla a mitad de
  // temporada, enseñar el campeonato del año pasado como si fuera el actual confunde más que un "sin datos".
  const done = schedule.filter((r) => raceStart(r).getTime() < now.getTime()).length;
  const standingsSeason = !driverStandings.standings.length && done <= 1 ? season - 1 : season;
  const [ds, cs] =
    standingsSeason === season
      ? [driverStandings, constructorStandings]
      : await Promise.all([
          safe(getDriverStandings(standingsSeason), { round: 0, standings: [] }),
          safe(getConstructorStandings(standingsSeason), { round: 0, standings: [] }),
        ]);

  const next = nextRace(schedule, now);
  const last = lastRace(schedule, now);
  const [lastResult, results, sprints] = await Promise.all([
    last ? safe(getRace(season, Number(last.round)), undefined) : undefined,
    safe(getSeasonResults(standingsSeason), []),
    safe(getSeasonSprints(standingsSeason), []),
  ]);

  const podium = lastResult?.Results?.slice(0, 3) ?? [];
  const photoDrivers = [...ds.standings.slice(0, 6).map((s) => s.Driver), ...podium.map((p) => p.Driver)];
  const photos = await safe(getDriverPhotos(photoDrivers, standingsSeason), {});

  const progression = buildProgression(results, sprints, "driver");
  const top3 = ds.standings.slice(0, 3).map((s) => s.Driver.driverId);
  const trend = progressionSeries(progression, top3);

  const live = latestSession && isSessionLive(latestSession.date_start, latestSession.date_end, now.getTime());

  const sessions = next ? weekendSessions(next) : [];
  const upcoming = sessions.find((s) => new Date(s.iso).getTime() > now.getTime()) ?? sessions.at(-1);
  const shape = next ? trackShape(next.Circuit.circuitId, season) : undefined;
  const circuit = next ? circuitInfo(next.Circuit.circuitId) : undefined;

  let forecast: Awaited<ReturnType<typeof getForecast>>[number] | undefined;
  if (next) {
    const days = (raceStart(next).getTime() - now.getTime()) / 86400000;
    if (days < 15) {
      const list = await safe(getForecast(Number(next.Circuit.Location.lat), Number(next.Circuit.Location.long)), []);
      forecast = list.find((f) => f.date === next.date);
    }
  }

  return (
    <div className="space-y-14">
      {live && latestSession && (
        <Link
          href="/live"
          className="flex items-center justify-between gap-4 rounded-2xl border border-accent/40 bg-accent/10 px-5 py-3"
        >
          <span className="flex items-center gap-3">
            <span className="live-dot h-2.5 w-2.5 rounded-full bg-accent" />
            <span className="display text-lg">{t("liveNow")}</span>
            <span className="text-sm text-ink-2">
              {latestSession.country_name} · {latestSession.session_name}
            </span>
          </span>
          <span className="flex items-center gap-2 text-sm font-semibold">
            <Radio size={16} /> {t("watchLive")}
          </span>
        </Link>
      )}

      {/* HÉROE: próximo GP */}
      {next ? (
        <section className="ember-glow relative overflow-hidden rounded-[2rem] border border-line">
          <div className="grid items-center gap-6 p-6 sm:p-10 lg:grid-cols-[1.1fr_1fr]">
            <div className="relative z-10 space-y-6">
              <div>
                <p className="eyebrow mb-3 !text-white/60">
                  {t("nextRace")} · {tc("round")} {next.round}
                </p>
                <h1 className="display text-5xl uppercase sm:text-7xl">{next.raceName.replace(/Grand Prix/i, "GP")}</h1>
                <p className="mt-3 flex items-center gap-2 text-ink-2">
                  <Flag iso={countryToIso(next.Circuit.Location.country)} />
                  {next.Circuit.circuitName} · {next.Circuit.Location.locality}
                </p>
              </div>
              {upcoming && (
                <div>
                  <p className="eyebrow mb-2 !text-white/70">
                    {ts(upcoming.key)} ·{" "}
                    <LocalTime iso={upcoming.iso} options={{ weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }} />
                  </p>
                  <Countdown target={upcoming.iso} />
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {sessions.map((s) => (
                  <span key={s.key} className="chip">
                    {ts(s.key)} ·{" "}
                    <LocalTime iso={s.iso} options={{ weekday: "short", hour: "2-digit", minute: "2-digit" }} />
                  </span>
                ))}
              </div>
              {forecast && (
                <ForecastChip f={forecast} label={tcal("forecast")} rainLabel={tcal("rainChance", { p: forecast.rainProb })} />
              )}
            </div>
            {shape && (
              <Link href={`/circuits/${next.Circuit.circuitId}`} className="relative mx-auto block aspect-square w-full max-w-md">
                <TrackOutline shape={shape} className="h-full w-full" />
                {circuit && <span className="sr-only">{circuit.name}</span>}
              </Link>
            )}
          </div>
          <div className="border-t border-white/10 px-6 py-4 sm:px-10">
            <div className="mb-2 flex justify-between text-xs text-ink-2">
              <span>{t("seasonProgress", { season, done, total: schedule.length })}</span>
              <Link href="/calendar" className="hover:text-ink">
                {tc("viewAll")} →
              </Link>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-ember via-accent to-accent-2"
                style={{ width: `${schedule.length ? (done / schedule.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </section>
      ) : (
        <section className="ember-glow rounded-[2rem] border border-line p-10">
          <p className="eyebrow mb-3">{season}</p>
          <h1 className="display text-5xl sm:text-7xl">{t("seasonOver")}</h1>
        </section>
      )}

      {/* CAMPEONATO DE PILOTOS */}
      <section>
        <SectionHeader
          eyebrow={`${tc("season")} ${standingsSeason}`}
          title={t("wdcLeaders")}
          action={{ href: "/standings", label: tc("viewAll") }}
        />
        {ds.standings.length ? (
          <div className="grid gap-x-5 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            {ds.standings.slice(0, 3).map((s, i) => (
              <DriverCard key={s.Driver.driverId} d={driverCard(s, standingsSeason, photos)} ptsLabel={tc("pts")} priority={i === 0} />
            ))}
          </div>
        ) : (
          <EmptyState>{tc("noData")}</EmptyState>
        )}
      </section>

      {/* CAMPEONATO DE CONSTRUCTORES */}
      <section>
        <SectionHeader
          eyebrow={`${tc("season")} ${standingsSeason}`}
          title={t("wccLeaders")}
          action={{ href: "/standings?view=constructors", label: tc("viewAll") }}
        />
        {cs.standings.length ? (
          <div className="grid gap-5 pr-4 sm:grid-cols-2 lg:grid-cols-3">
            {cs.standings.slice(0, 3).map((s) => (
              <TeamCard key={s.Constructor.constructorId} t={teamCard(s, standingsSeason, ds.standings, photos)} ptsLabel={tc("pts")} />
            ))}
          </div>
        ) : (
          <EmptyState>{tc("noData")}</EmptyState>
        )}
      </section>

      {/* ÚLTIMO GP + EVOLUCIÓN */}
      <section className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
        {last && lastResult?.Results?.length ? (
          <GlassCard className="p-6">
            <p className="eyebrow mb-1">{t("lastRace")}</p>
            <h3 className="display flex items-center gap-2 text-2xl">
              <Flag iso={countryToIso(last.Circuit.Location.country)} />
              {last.raceName}
            </h3>
            <ol className="mt-5 space-y-2">
              {podium.map((p) => (
                <li key={p.Driver.driverId} className="flex items-center gap-3 rounded-2xl bg-white/[0.03] p-2 pr-4">
                  <span className="display w-7 text-center text-2xl">{p.position}</span>
                  <DriverAvatar
                    photo={photos[p.Driver.driverId]}
                    name={`${p.Driver.givenName} ${p.Driver.familyName}`}
                    color={teamColor(p.Constructor.constructorId)}
                    size={44}
                  />
                  <Link href={`/drivers/${p.Driver.driverId}`} className="min-w-0 flex-1">
                    <p className="truncate font-semibold">
                      {p.Driver.givenName} <span className="uppercase">{p.Driver.familyName}</span>
                    </p>
                    <p className="truncate text-xs text-ink-3">{p.Constructor.name}</p>
                  </Link>
                  <span className="num text-sm text-ink-2">{p.Time?.time ?? p.status}</span>
                </li>
              ))}
            </ol>
            <Link
              href={`/races/${season}/${last.round}`}
              className="mt-4 inline-block text-sm font-medium text-ink-2 hover:text-ink"
            >
              {t("fullResults")} →
            </Link>
            <div className="mt-6 border-t border-line pt-5">
              <p className="eyebrow mb-3">{t("rateIt")}</p>
              <RatingWidget season={season} round={Number(last.round)} open />
            </div>
          </GlassCard>
        ) : (
          <div />
        )}
        {trend.length > 0 && progression.rounds.length > 1 && (
          <GlassCard className="p-6">
            <p className="eyebrow mb-1">{standingsSeason}</p>
            <h3 className="display mb-4 text-2xl">{t("top3Trend")}</h3>
            <LineSeriesChart
              labels={progression.rounds.map((r) => String(r.round))}
              fullLabels={progression.rounds.map((r) => r.raceName)}
              series={trend}
              height={300}
              tableLabel={tc("table")}
              chartLabel={tc("chart")}
            />
          </GlassCard>
        )}
      </section>
    </div>
  );
}
