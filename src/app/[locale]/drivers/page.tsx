import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  getConstructorStandings,
  getCurrentSeason,
  getDriverStandings,
  getRace,
  getSchedule,
  type Result,
} from "@/lib/api/jolpica";
import { serverNow } from "@/lib/clock";
import { nationalityToIso } from "@/lib/countries";
import { getDriverIndex } from "@/lib/drivers";
import { raceStart } from "@/lib/mapping";
import { teamLogo } from "@/lib/media";
import { getDriverPhotos, teamsOf, type Photo } from "@/lib/photos";
import { safe } from "@/lib/safe";
import { teamColor } from "@/lib/teams";
import { DriverDirectory, type DirectoryEntry } from "@/components/drivers/DriverDirectory";
import { DriverHero, TeamLogo } from "@/components/ui/media";
import { Flag, PageTitle, SectionHeader } from "@/components/ui/primitives";

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/[locale]/drivers">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "drivers" });
  return { title: t("title"), description: t("subtitle") };
}

/**
 * Parrilla actual: pilotos y equipos de la última carrera con resultados. La clasificación no sirve
 * para esto porque lista todos los equipos por los que pasó un piloto en el año, sin orden fiable.
 */
async function latestGrid(season: number, now: number): Promise<{ season: number; results: Result[] } | undefined> {
  for (const s of [season, season - 1]) {
    const finished = (await safe(getSchedule(s), []))
      .filter((r) => raceStart(r).getTime() + 2 * 3600 * 1000 < now)
      .reverse();
    // La última carrera puede no tener resultados aún: probamos también la anterior
    for (const r of finished.slice(0, 2)) {
      const race = await safe(getRace(s, Number(r.round)), undefined);
      if (race?.Results?.length) return { season: s, results: race.Results };
    }
  }
  return undefined;
}

export default async function DriversPage({ params }: PageProps<"/[locale]/drivers">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("drivers");
  const tc = await getTranslations("common");

  const current = await safe(getCurrentSeason(), new Date().getUTCFullYear());
  const [grid, index] = await Promise.all([latestGrid(current, serverNow()), getDriverIndex(current)]);

  // Equipos en el orden del campeonato de constructores; pilotos en el del campeonato de pilotos
  const gridSeason = grid?.season ?? current;
  const [ds, cs, photos] = await Promise.all([
    safe(getDriverStandings(gridSeason), { round: 0, standings: [] }),
    safe(getConstructorStandings(gridSeason), { round: 0, standings: [] }),
    grid ? safe(getDriverPhotos(grid.results.map((r) => r.Driver), gridSeason, teamsOf(grid.results)), {}) : ({} as Record<string, Photo>),
  ]);
  const driverPos = new Map(ds.standings.map((s, i) => [s.Driver.driverId, { pos: Number(s.position ?? i + 1), pts: s.points }]));
  const teamPos = new Map(cs.standings.map((s, i) => [s.Constructor.constructorId, i]));
  const teams = new Map<string, { name: string; drivers: Result[] }>();
  for (const r of grid?.results ?? []) {
    const team = teams.get(r.Constructor.constructorId) ?? { name: r.Constructor.name, drivers: [] };
    team.drivers.push(r);
    teams.set(r.Constructor.constructorId, team);
  }
  const ordered = [...teams.entries()]
    .sort(([a], [b]) => (teamPos.get(a) ?? 99) - (teamPos.get(b) ?? 99))
    .map(([id, team]) => ({
      id,
      ...team,
      drivers: team.drivers.sort((a, b) => (driverPos.get(a.Driver.driverId)?.pos ?? 99) - (driverPos.get(b.Driver.driverId)?.pos ?? 99)),
    }));

  // País traducido en el servidor para que el buscador también encuentre "Colombia" o "Reino Unido"
  const regions = new Intl.DisplayNames([locale], { type: "region" });
  const entries: DirectoryEntry[] = index.map((d) => {
    const iso = nationalityToIso(d.nationality);
    return { ...d, iso, country: iso ? (regions.of(iso.toUpperCase()) ?? "") : "" };
  });

  return (
    <div>
      <PageTitle eyebrow={t("subtitle")} title={t("title")} />
      <DriverDirectory drivers={entries} current={current}>
        {ordered.length > 0 && (
          <section>
            <SectionHeader eyebrow={t("gridHint")} title={t("grid", { season: gridSeason })} />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {ordered.map((team) => {
                const color = teamColor(team.id);
                return (
                  <div
                    key={team.id}
                    className="overflow-hidden rounded-[1.5rem] border border-white/10"
                    style={{ background: `linear-gradient(160deg, ${color}40, #111114 55%)` }}
                  >
                    <Link
                      href={`/teams/${team.id}`}
                      className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-white/5"
                    >
                      <span className="display truncate text-lg">{team.name}</span>
                      <TeamLogo src={teamLogo(team.id, gridSeason, 64)} name={team.name} className="h-6 w-auto max-w-20" />
                    </Link>
                    <div className="grid grid-cols-2 gap-px">
                      {team.drivers.map((r) => {
                        const d = r.Driver;
                        const photo = photos[d.driverId];
                        const standing = driverPos.get(d.driverId);
                        return (
                          <Link
                            key={d.driverId}
                            href={`/drivers/${d.driverId}`}
                            className="group relative block h-44 overflow-hidden sm:h-48"
                            style={{ background: `radial-gradient(120% 100% at 50% 115%, ${color}, #111114 72%)` }}
                          >
                            <span className="display absolute right-2 top-1 text-6xl text-white/10">{d.permanentNumber ?? r.number}</span>
                            {standing && (
                              <span className="chip absolute left-2 top-2 z-10 !bg-black/45 !text-[0.65rem] backdrop-blur">
                                P{standing.pos} · {standing.pts} {tc("pts")}
                              </span>
                            )}
                            {photo && (
                              <DriverHero
                                photo={photo}
                                name={`${d.givenName} ${d.familyName}`}
                                className={
                                  photo.cutout
                                    ? "absolute bottom-0 left-1/2 h-[88%] w-auto -translate-x-1/2 transition-transform duration-300 group-hover:scale-105"
                                    : "absolute inset-0"
                                }
                              />
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-10">
                              <p className="flex items-center gap-1.5 text-xs text-white/75">
                                <Flag iso={nationalityToIso(d.nationality)} />
                                <span className="truncate">{d.givenName}</span>
                              </p>
                              <p className="display truncate text-xl uppercase">{d.familyName}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </DriverDirectory>
    </div>
  );
}
