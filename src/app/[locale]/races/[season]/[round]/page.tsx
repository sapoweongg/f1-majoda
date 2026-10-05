import { serverNow } from "@/lib/clock";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChevronLeft, ChevronRight, CloudRain, Droplets, Gauge, Thermometer, Users, Wind } from "lucide-react";
import {
  getCurrentSeason,
  getRace,
  getRaceLaps,
  getRacePitStops,
  getRaceQualifying,
  getRaceSprint,
  getSchedule,
  type Result,
} from "@/lib/api/jolpica";
import { getRaceControl, getStints, getWeather } from "@/lib/api/openf1";
import { countryToIso } from "@/lib/countries";
import { parseLapTime } from "@/lib/format";
import { gpName } from "@/lib/gp-names";
import { findWeekendSessions, OPENF1_FIRST_SEASON, raceStart } from "@/lib/mapping";
import { getDriverPhotos, teamsOf } from "@/lib/photos";
import { translateRaceControl } from "@/lib/race-control";
import { ratingsEnabled } from "@/lib/ratings";
import { safe } from "@/lib/safe";
import { teamColor } from "@/lib/teams";
import { LineSeriesChart, type Series } from "@/components/charts/LineSeriesChart";
import { DriverToggles } from "@/components/races/DriverToggles";
import { RacePreview } from "@/components/races/RacePreview";
import { QualifyingTable, ResultsTable } from "@/components/races/ResultsTable";
import { TyreStints, type StintRow } from "@/components/races/TyreStints";
import { CircuitCard } from "@/components/track/CircuitCard";
import { Link } from "@/i18n/navigation";
import { EmptyState, Flag, GlassCard, PageTitle, SectionHeader, TabLinks } from "@/components/ui/primitives";
import { RatingWidget } from "@/components/ui/Rating";
import { LocalTime } from "@/components/ui/time";

type Params = { locale: string; season: string; round: string };

async function load(p: Params) {
  const season = Number(p.season);
  const round = Number(p.round);
  if (!Number.isInteger(season) || !Number.isInteger(round) || season < 1950) return null;
  const schedule = await safe(getSchedule(season), []);
  const race = schedule.find((r) => Number(r.round) === round);
  return race ? { season, round, race, schedule } : null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const p = await params;
  const data = await load(p);
  return { title: data ? `${gpName(data.race.raceName, p.locale)} ${data.season}` : undefined };
}

/** Pilotos elegidos en ?d=a,b,c o los primeros `n` clasificados. */
function selection(param: string | string[] | undefined, results: Result[], n: number) {
  const ids = typeof param === "string" && param ? param.split(",") : [];
  const valid = ids.filter((id) => results.some((r) => r.Driver.driverId === id));
  return valid.length ? valid : results.slice(0, n).map((r) => r.Driver.driverId);
}

function seriesFor(results: Result[], ids: string[], values: (id: string) => (number | null)[]): Series[] {
  const seen = new Set<string>();
  return results
    .filter((r) => ids.includes(r.Driver.driverId))
    .map((r) => {
      const team = r.Constructor.constructorId;
      const dashed = seen.has(team);
      seen.add(team);
      return {
        id: r.Driver.driverId,
        label: r.Driver.code ?? r.Driver.familyName,
        color: teamColor(team),
        dashed,
        values: values(r.Driver.driverId),
      };
    });
}

export default async function RacePage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const p = await params;
  setRequestLocale(p.locale);
  const data = await load(p);
  if (!data) notFound();
  const { season, round, race, schedule } = data;
  const sp = await searchParams;
  const t = await getTranslations("races");
  const tc = await getTranslations("common");
  const ts = await getTranslations("sessions");

  const current = await safe(getCurrentSeason(), season);
  const started = raceStart(race).getTime() < serverNow();
  const finished = raceStart(race).getTime() + 2 * 3600 * 1000 < serverNow();
  const hasSprint = Boolean(race.Sprint);
  const tab = ["results", "qualifying", "sprint", "laps", "strategy"].includes(String(sp.tab)) ? String(sp.tab) : "results";

  const raceData = started ? await safe(getRace(season, round), undefined) : undefined;
  const results = raceData?.Results ?? [];

  const base = `/races/${season}/${round}`;
  const tabHref = (k: string) => (k === "results" ? base : `${base}?tab=${k}`);

  // Solo pedimos los datos de la pestaña abierta
  let body: React.ReactNode = null;
  const allDrivers = results.map((r) => r.Driver);

  if (tab === "results") {
    const photos = await safe(getDriverPhotos(allDrivers, season, teamsOf(results)), {});
    body = !started ? (
      <RacePreview race={race} now={serverNow()} />
    ) : results.length ? (
      <ResultsTable
        results={results}
        photos={photos}
        labels={{
          pos: tc("pos"),
          driver: tc("driver"),
          grid: tc("grid"),
          laps: tc("laps"),
          time: tc("time"),
          points: tc("pts"),
          fastest: t("fastestLap"),
        }}
        locale={p.locale}
      />
    ) : (
      <EmptyState>{t("notRun")}</EmptyState>
    );
  } else if (tab === "qualifying") {
    const quali = await safe(getRaceQualifying(season, round), []);
    const photos = await safe(getDriverPhotos(quali.map((q) => q.Driver), season, teamsOf(quali)), {});
    body = quali.length ? (
      <QualifyingTable results={quali} photos={photos} labels={{ pos: tc("pos"), driver: tc("driver"), time: tc("time") }} />
    ) : (
      <EmptyState>{t("notRun")}</EmptyState>
    );
  } else if (tab === "sprint") {
    const sprint = await safe(getRaceSprint(season, round), []);
    const photos = await safe(getDriverPhotos(sprint.map((q) => q.Driver), season, teamsOf(sprint)), {});
    body = sprint.length ? (
      <ResultsTable
        results={sprint}
        photos={photos}
        labels={{
          pos: tc("pos"),
          driver: tc("driver"),
          grid: tc("grid"),
          laps: tc("laps"),
          time: tc("time"),
          points: tc("pts"),
          fastest: t("fastestLap"),
        }}
        locale={p.locale}
      />
    ) : (
      <EmptyState>{t("notRun")}</EmptyState>
    );
  } else if (tab === "laps") {
    const laps = results.length ? await safe(getRaceLaps(season, round), []) : [];
    if (!laps.length) {
      body = <EmptyState>{t("noLaps")}</EmptyState>;
    } else {
      const selected = selection(sp.d, results, 5);
      const labels = laps.map((l) => l.number);
      const byDriver = new Map<string, { time: (number | null)[]; pos: (number | null)[] }>();
      laps.forEach((lap, i) => {
        for (const tm of lap.Timings) {
          let row = byDriver.get(tm.driverId);
          if (!row) {
            row = { time: new Array(laps.length).fill(null), pos: new Array(laps.length).fill(null) };
            byDriver.set(tm.driverId, row);
          }
          row.time[i] = parseLapTime(tm.time);
          row.pos[i] = Number(tm.position);
        }
      });
      // Vueltas muy lentas (pits, safety car) se ocultan para que el gráfico sea legible
      const allTimes = [...byDriver.values()].flatMap((r) => r.time).filter((x): x is number => x != null).sort((a, b) => a - b);
      const median = allTimes[Math.floor(allTimes.length / 2)] ?? 0;
      const cutoff = median * 1.12;
      const timeSeries = seriesFor(results, selected, (id) =>
        (byDriver.get(id)?.time ?? []).map((v) => (v != null && v <= cutoff ? v : null)),
      );
      const posIds = selection(sp.p, results, 10);
      const posSeries = seriesFor(results, posIds, (id) => byDriver.get(id)?.pos ?? []);
      const toggles = results.map((r) => ({
        id: r.Driver.driverId,
        label: r.Driver.code ?? r.Driver.familyName,
        color: teamColor(r.Constructor.constructorId),
      }));
      const q = (key: "d" | "p", ids: string[]) => {
        const params = new URLSearchParams({ tab: "laps" });
        const d = key === "d" ? ids : selected;
        const pp = key === "p" ? ids : posIds;
        params.set("d", d.join(","));
        params.set("p", pp.join(","));
        return `${base}?${params.toString()}`;
      };
      body = (
        <div className="space-y-6">
          <GlassCard>
            <SectionHeader title={t("lapTimes")} />
            <DriverToggles drivers={toggles} selected={selected} hrefFor={(ids) => q("d", ids)} />
            <LineSeriesChart
              labels={labels}
              fullLabels={labels.map((l) => `${t("lap")} ${l}`)}
              series={timeSeries}
              format="laptime"
              reversed={false}
              sortTooltip
              tableLabel={tc("table")}
              chartLabel={tc("chart")}
            />
          </GlassCard>
          <GlassCard>
            <SectionHeader title={t("positions")} />
            <DriverToggles drivers={toggles} selected={posIds} hrefFor={(ids) => q("p", ids)} />
            <LineSeriesChart
              labels={labels}
              fullLabels={labels.map((l) => `${t("lap")} ${l}`)}
              series={posSeries}
              reversed
              yDomain={[1, results.length]}
              height={420}
              tableLabel={tc("table")}
              chartLabel={tc("chart")}
            />
          </GlassCard>
        </div>
      );
    }
  } else if (tab === "strategy") {
    const pits = results.length ? await safe(getRacePitStops(season, round), []) : [];
    const weekend = season >= OPENF1_FIRST_SEASON && results.length ? await safe(findWeekendSessions(race), null) : null;
    const sessionKey = weekend?.race?.session_key;
    const [stints, control, weather] = sessionKey
      ? await Promise.all([
          safe(getStints(sessionKey), []),
          safe(getRaceControl(sessionKey), []),
          safe(getWeather(sessionKey), []),
        ])
      : [[], [], []];

    const totalLaps = Number(results[0]?.laps ?? 0) || Math.max(0, ...stints.map((s) => s.lap_end ?? 0));
    const stintRows: StintRow[] = results
      .map((r) => {
        const num = Number(r.number);
        const list = stints
          .filter((s) => s.driver_number === num)
          .sort((a, b) => a.stint_number - b.stint_number)
          .map((s) => ({
            compound: s.compound ?? "UNKNOWN",
            from: s.lap_start,
            to: Math.min(s.lap_end ?? totalLaps, totalLaps),
            age: s.tyre_age_at_start,
          }));
        return {
          id: r.Driver.driverId,
          label: r.Driver.code ?? r.Driver.familyName.slice(0, 3).toUpperCase(),
          teamColor: teamColor(r.Constructor.constructorId),
          stints: list,
        };
      })
      .filter((r) => r.stints.length);

    const driverName = (id: string) => {
      const r = results.find((x) => x.Driver.driverId === id);
      return r ? `${r.Driver.givenName} ${r.Driver.familyName}` : id;
    };
    const sortedPits = [...pits].sort((a, b) => Number(a.duration) - Number(b.duration));
    const temps = weather.length
      ? {
          air: [Math.min(...weather.map((w) => w.air_temperature)), Math.max(...weather.map((w) => w.air_temperature))],
          track: [Math.min(...weather.map((w) => w.track_temperature)), Math.max(...weather.map((w) => w.track_temperature))],
          humidity: Math.round(weather.reduce((a, w) => a + w.humidity, 0) / weather.length),
          wind: Math.max(...weather.map((w) => w.wind_speed)),
          rain: weather.some((w) => w.rainfall > 0),
        }
      : null;
    const flags = control.filter((c) => c.flag || c.category === "SafetyCar").slice(-40).reverse();

    body = (
      <div className="space-y-6">
        {season < OPENF1_FIRST_SEASON && <p className="chip">{tc("since2023")}</p>}
        {stintRows.length > 0 && totalLaps > 0 && (
          <GlassCard>
            <SectionHeader title={t("tyres")} />
            <TyreStints
              rows={stintRows}
              totalLaps={totalLaps}
              lapLabel={t("lap")}
              compoundLabels={{
                SOFT: t("compound.SOFT"),
                MEDIUM: t("compound.MEDIUM"),
                HARD: t("compound.HARD"),
                INTERMEDIATE: t("compound.INTERMEDIATE"),
                WET: t("compound.WET"),
                UNKNOWN: t("compound.UNKNOWN"),
              }}
            />
          </GlassCard>
        )}
        <div className="grid gap-6 lg:grid-cols-2">
          {sortedPits.length > 0 && (
            <GlassCard className="p-0">
              <div className="p-5 pb-0">
                <SectionHeader title={t("pits")} />
              </div>
              <div className="scroll-x max-h-[460px] overflow-y-auto">
                <table className="data-table num">
                  <thead className="sticky top-0 bg-surface">
                    <tr>
                      <th>{tc("driver")}</th>
                      <th className="text-right">{t("lap")}</th>
                      <th className="text-right">{t("stop")}</th>
                      <th className="text-right">{t("duration")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPits.map((ps, i) => (
                      <tr key={`${ps.driverId}-${ps.stop}`}>
                        <td className={i === 0 ? "font-semibold text-purple" : ""}>{driverName(ps.driverId)}</td>
                        <td className="text-right text-ink-2">{ps.lap}</td>
                        <td className="text-right text-ink-2">{ps.stop}</td>
                        <td className="text-right">{ps.duration}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}
          <div className="space-y-6">
            {temps && (
              <GlassCard>
                <SectionHeader title={t("weather")} />
                <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <dt className="eyebrow flex items-center gap-1"><Thermometer size={12} /> {t("air")}</dt>
                    <dd className="display num text-2xl">{Math.round(temps.air[0])}–{Math.round(temps.air[1])}°</dd>
                  </div>
                  <div>
                    <dt className="eyebrow flex items-center gap-1"><Thermometer size={12} /> {t("track")}</dt>
                    <dd className="display num text-2xl">{Math.round(temps.track[0])}–{Math.round(temps.track[1])}°</dd>
                  </div>
                  <div>
                    <dt className="eyebrow flex items-center gap-1"><Droplets size={12} /> {t("humidity")}</dt>
                    <dd className="display num text-2xl">{temps.humidity}%</dd>
                  </div>
                  <div>
                    <dt className="eyebrow flex items-center gap-1">{temps.rain ? <CloudRain size={12} /> : <Wind size={12} />} {temps.rain ? t("rain") : t("wind")}</dt>
                    <dd className="display num text-2xl">{temps.rain ? "✓" : `${temps.wind.toFixed(1)} m/s`}</dd>
                  </div>
                </dl>
              </GlassCard>
            )}
            {flags.length > 0 && (
              <GlassCard className="p-0">
                <div className="p-5 pb-0">
                  <SectionHeader title={t("raceControl")} />
                </div>
                <ul className="max-h-[360px] space-y-2 overflow-y-auto px-5 pb-5 text-sm">
                  {flags.map((c, i) => (
                    <li key={i} className="flex gap-3 border-b border-line pb-2">
                      <span className="num w-10 shrink-0 text-xs text-ink-3">{c.lap_number ? `L${c.lap_number}` : ""}</span>
                      <span className="text-ink-2">{translateRaceControl(c.message, p.locale)}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            )}
          </div>
        </div>
        {!stintRows.length && !sortedPits.length && !temps && <EmptyState>{tc("noData")}</EmptyState>}
      </div>
    );
  }

  const winner = results[0];
  const prev = schedule.find((r) => Number(r.round) === round - 1);
  const next = schedule.find((r) => Number(r.round) === round + 1);
  return (
    <div>
      <PageTitle
        eyebrow={
          <Link href={`/races/${season}`} className="transition-colors hover:text-ink">
            {tc("round")} {round} · {t("season", { season })}
          </Link>
        }
        title={
          <span className="flex items-center gap-4">
            <Flag iso={countryToIso(race.Circuit.Location.country)} className="text-3xl sm:text-5xl" />
            {gpName(race.raceName, p.locale)}
          </span>
        }
      >
        <span className="chip">
          <LocalTime iso={raceStart(race).toISOString()} options={{ dateStyle: "long" }} />
        </span>
        {winner && (
          <span className="chip">
            {t("winner")}: {winner.Driver.givenName} {winner.Driver.familyName}
          </span>
        )}
      </PageTitle>

      <nav className="-mt-4 mb-6 flex flex-wrap items-center gap-2" aria-label={t("season", { season })}>
        {prev && (
          <Link href={`/races/${season}/${prev.round}`} className="chip transition-colors hover:text-ink">
            <ChevronLeft size={14} aria-hidden /> {gpName(prev.raceName, p.locale, true)}
          </Link>
        )}
        {next && (
          <Link href={`/races/${season}/${next.round}`} className="chip transition-colors hover:text-ink">
            {gpName(next.raceName, p.locale, true)} <ChevronRight size={14} aria-hidden />
          </Link>
        )}
        <span className="mx-1 hidden h-4 w-px bg-line sm:block" aria-hidden />
        {started && season >= OPENF1_FIRST_SEASON && (
          <Link href={`/telemetry?season=${season}&round=${round}`} className="chip transition-colors hover:text-ink">
            <Gauge size={13} aria-hidden /> {t("telemetryLink")}
          </Link>
        )}
        <Link href={`/compare?season=${season}`} className="chip transition-colors hover:text-ink">
          <Users size={13} aria-hidden /> {t("compareLink", { season })}
        </Link>
      </nav>

      <TabLinks
        active={tab}
        items={[
          { key: "results", label: t("results"), href: tabHref("results") },
          { key: "qualifying", label: t("qualifying"), href: tabHref("qualifying") },
          ...(hasSprint ? [{ key: "sprint", label: t("sprint"), href: tabHref("sprint") }] : []),
          { key: "laps", label: t("laps"), href: tabHref("laps"), disabled: season < 1996 },
          { key: "strategy", label: t("strategy"), href: tabHref("strategy"), disabled: season < 2011 },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="min-w-0">{body}</div>
        <aside className="space-y-6">
          <CircuitCard circuit={race.Circuit} season={season} />
          {season >= current - 1 && ratingsEnabled() && (
            <GlassCard>
              <p className="eyebrow mb-3">{ts("Race")}</p>
              <RatingWidget season={season} round={round} open={finished} />
            </GlassCard>
          )}
        </aside>
      </div>
    </div>
  );
}
