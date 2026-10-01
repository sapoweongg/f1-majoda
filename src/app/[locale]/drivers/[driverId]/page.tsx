import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import champions from "@/data/champions.json";
import { Link } from "@/i18n/navigation";
import {
  getDriver,
  getDriverCareerResults,
  getDriverCareerSprints,
  getDriverPoleCount,
  getDriverSeasons,
} from "@/lib/api/jolpica";
import { nationalityToIso } from "@/lib/countries";
import { age, points as fmtPoints } from "@/lib/format";
import { teamLogo } from "@/lib/media";
import { getDriverPhotos } from "@/lib/photos";
import { safe } from "@/lib/safe";
import { teamStyle } from "@/lib/teams";
import { DriverHero, TeamLogo } from "@/components/ui/media";
import { EmptyState, Flag, GlassCard, SectionHeader, StatNumber } from "@/components/ui/primitives";

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/[locale]/drivers/[driverId]">): Promise<Metadata> {
  const { driverId } = await params;
  const d = await safe(getDriver(driverId), undefined);
  return { title: d ? `${d.givenName} ${d.familyName}` : undefined };
}

type SeasonRow = {
  season: number;
  teams: { id: string; name: string }[];
  points: number;
  wins: number;
  podiums: number;
  races: number;
  position?: string;
};

export default async function DriverPage({ params }: PageProps<"/[locale]/drivers/[driverId]">) {
  const { locale, driverId } = await params;
  setRequestLocale(locale);
  const driver = await safe(getDriver(driverId), undefined);
  if (!driver) notFound();
  const t = await getTranslations("driver");
  const tc = await getTranslations("common");
  const format = await getFormatter();

  const [standings, results, sprints, poles] = await Promise.all([
    safe(getDriverSeasons(driverId), []),
    safe(getDriverCareerResults(driverId), []),
    safe(getDriverCareerSprints(driverId), []),
    safe(getDriverPoleCount(driverId), 0),
  ]);

  // Estadísticas por temporada a partir de los resultados de su carrera
  const bySeason = new Map<number, SeasonRow>();
  const row = (season: number) => {
    let r = bySeason.get(season);
    if (!r) {
      r = { season, teams: [], points: 0, wins: 0, podiums: 0, races: 0 };
      bySeason.set(season, r);
    }
    return r;
  };
  for (const race of results) {
    const res = race.Results?.[0];
    if (!res) continue;
    const r = row(Number(race.season));
    r.races++;
    r.points += Number(res.points) || 0;
    if (res.position === "1") r.wins++;
    if (/^\d+$/.test(res.positionText) && Number(res.position) <= 3) r.podiums++;
    if (!r.teams.some((x) => x.id === res.Constructor.constructorId)) {
      r.teams.push({ id: res.Constructor.constructorId, name: res.Constructor.name });
    }
  }
  for (const race of sprints) {
    const res = race.SprintResults?.[0];
    if (res) row(Number(race.season)).points += Number(res.points) || 0;
  }
  for (const s of standings) {
    if (s.standing) {
      const r = row(s.season);
      r.position = s.standing.positionText;
      // La clasificación oficial manda (descartes de resultados en temporadas antiguas)
      r.points = Number(s.standing.points);
    }
  }
  const seasons = [...bySeason.values()].sort((a, b) => b.season - a.season);

  const lastSeason = seasons[0]?.season ?? new Date().getUTCFullYear();
  const photos = await safe(getDriverPhotos([driver], lastSeason), {});
  const photo = photos[driver.driverId];

  const titles = champions.filter((c) => c.driver?.driverId === driverId).map((c) => c.season);
  const totals = seasons.reduce(
    (a, s) => ({ races: a.races + s.races, wins: a.wins + s.wins, podiums: a.podiums + s.podiums, points: a.points + s.points }),
    { races: 0, wins: 0, podiums: 0, points: 0 },
  );

  const lastTeam = seasons[0]?.teams.at(-1);
  const style = teamStyle(lastTeam?.id);
  const maxPts = Math.max(1, ...seasons.map((s) => s.points));
  const yearsOld = age(driver.dateOfBirth);

  return (
    <div className="space-y-10">
      <section
        className="relative overflow-hidden rounded-[2rem] border border-white/10"
        style={{ background: `radial-gradient(110% 120% at 100% 100%, ${style.color} 0%, ${style.color}88 30%, #0b0b0f 72%)` }}
      >
        <span className="display pointer-events-none absolute -bottom-10 right-4 select-none text-[14rem] text-white/10 sm:text-[20rem]" aria-hidden>
          {driver.permanentNumber}
        </span>
        <div className="relative grid min-h-[22rem] items-end gap-6 p-6 sm:p-10 md:grid-cols-[1fr_auto]">
          <div className="relative z-10 space-y-4 pb-2 [text-shadow:0_2px_14px_rgb(0_0_0/0.5)]">
            <div className="flex items-center gap-3">
              <Flag iso={nationalityToIso(driver.nationality)} className="text-xl" />
              {lastTeam && <TeamLogo src={teamLogo(lastTeam.id, lastSeason)} name={lastTeam.name} className="h-7 w-auto" />}
              {lastTeam && <span className="text-sm text-white/75">{lastTeam.name}</span>}
            </div>
            <div>
              <p className="text-xl text-white/80">{driver.givenName}</p>
              <h1 className="display text-6xl uppercase sm:text-8xl">{driver.familyName}</h1>
            </div>
            <p className="text-sm text-white/70">
              {driver.dateOfBirth && t("bornIn", { date: format.dateTime(new Date(driver.dateOfBirth), { dateStyle: "long" }) })}
              {yearsOld ? ` · ${tc("age", { age: yearsOld })}` : ""}
              {driver.permanentNumber ? ` · ${t("number")} ${driver.permanentNumber}` : ""}
            </p>
          </div>
          {photo && (
            <DriverHero
              photo={photo}
              name={`${driver.givenName} ${driver.familyName}`}
              priority
              linkCredit
              className={
                photo.cutout
                  ? "relative -mb-10 h-80 w-auto justify-self-end sm:h-[26rem]"
                  : "relative h-72 w-64 justify-self-end overflow-hidden rounded-2xl sm:h-80 sm:w-72"
              }
            />
          )}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
        <StatNumber value={titles.length} label={t("championships")} />
        <StatNumber value={totals.races} label={t("races")} />
        <StatNumber value={totals.wins} label={tc("wins")} />
        <StatNumber value={totals.podiums} label={tc("podiums")} />
        <StatNumber value={poles} label={tc("poles")} />
        <StatNumber value={fmtPoints(Math.round(totals.points * 10) / 10)} label={t("careerPoints")} />
      </div>
      {titles.length > 0 && (
        <p className="flex flex-wrap gap-2">
          {titles.map((y) => (
            <span key={y} className="chip !border-yellow/40 !text-yellow">
              🏆 {y}
            </span>
          ))}
        </p>
      )}

      <section>
        <SectionHeader title={t("bySeason")} />
        {seasons.length === 0 ? (
          <EmptyState>{tc("noData")}</EmptyState>
        ) : (
          <GlassCard className="p-0">
            <div className="scroll-x">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{tc("season")}</th>
                    <th>{t("team")}</th>
                    <th className="text-right">{t("finalPosition")}</th>
                    <th className="text-right">{tc("wins")}</th>
                    <th className="text-right">{tc("podiums")}</th>
                    <th className="hidden w-[26%] md:table-cell" aria-hidden />
                    <th className="text-right">{tc("points")}</th>
                  </tr>
                </thead>
                <tbody>
                  {seasons.map((s) => {
                    const color = teamStyle(s.teams.at(-1)?.id).color;
                    return (
                      <tr key={s.season}>
                        <td>
                          <Link
                            href={
                              driverId === "max_verstappen" && s.season === 2025
                                ? "/parc-ferme"
                                : driverId === "max_verstappen" && s.season === 2023
                                  ? "/max-2023"
                                  : `/standings?season=${s.season}`
                            }
                            className="display text-lg hover:text-accent"
                          >
                            {s.season}
                          </Link>
                          {driverId === "max_verstappen" && s.season === 2023 && (
                            <Link
                              href="/max-2023"
                              className="ml-2 rounded-full border border-[#ffcc00]/40 bg-[#ffcc00]/10 px-2 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wider text-[#ffcc00] hover:bg-[#ffcc00]/20"
                            >
                              ★ {locale === "en" ? "Historic" : "Histórico"}
                            </Link>
                          )}
                        </td>
                        <td>
                          <span className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                            {s.teams.map((x) => x.name).join(" / ")}
                          </span>
                        </td>
                        <td className="display num text-right text-lg">
                          {s.position ?? (titles.includes(s.season) ? "1" : "—")}
                          {titles.includes(s.season) && <span className="ml-1 text-sm">🏆</span>}
                        </td>
                        <td className="num text-right text-ink-2">{s.wins}</td>
                        <td className="num text-right text-ink-2">{s.podiums}</td>
                        <td className="hidden md:table-cell">
                          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                            <div className="h-full rounded-full" style={{ width: `${(s.points / maxPts) * 100}%`, background: color }} />
                          </div>
                        </td>
                        <td className="num text-right">{fmtPoints(s.points)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}
      </section>
    </div>
  );
}
