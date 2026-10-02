import "server-only";
import { getConstructorStandings, getDriverStandings, getRace, getSchedule, type Result } from "./api/jolpica";
import { raceStart } from "./mapping";
import { safe } from "./safe";

/**
 * Pilotos y equipos de la última carrera con resultados. La clasificación no sirve para esto porque
 * lista todos los equipos por los que pasó un piloto en el año, sin orden fiable.
 * En pretemporada devuelve la última carrera del año anterior.
 */
async function latestRace(season: number, now: number): Promise<{ season: number; results: Result[] } | undefined> {
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

export type GridDriver = Result & { pos?: number; pts?: string };
export type GridTeam = { id: string; name: string; pos?: number; pts?: string; drivers: GridDriver[] };

/** Parrilla actual agrupada por equipos, en el orden de los dos campeonatos. */
export async function currentGrid(season: number, now: number): Promise<{ season: number; teams: GridTeam[]; results: Result[] } | undefined> {
  const race = await latestRace(season, now);
  if (!race) return undefined;
  const [ds, cs] = await Promise.all([
    safe(getDriverStandings(race.season), { round: 0, standings: [] }),
    safe(getConstructorStandings(race.season), { round: 0, standings: [] }),
  ]);
  const driverPos = new Map(ds.standings.map((s, i) => [s.Driver.driverId, { pos: Number(s.position ?? i + 1), pts: s.points }]));
  const teamPos = new Map(cs.standings.map((s, i) => [s.Constructor.constructorId, { pos: Number(s.position ?? i + 1), pts: s.points }]));

  const teams = new Map<string, GridTeam>();
  for (const r of race.results) {
    const id = r.Constructor.constructorId;
    const team = teams.get(id) ?? { id, name: r.Constructor.name, ...teamPos.get(id), drivers: [] };
    team.drivers.push({ ...r, ...driverPos.get(r.Driver.driverId) });
    teams.set(id, team);
  }
  const ordered = [...teams.values()]
    .sort((a, b) => (a.pos ?? 99) - (b.pos ?? 99))
    .map((team) => ({ ...team, drivers: team.drivers.sort((a, b) => (a.pos ?? 99) - (b.pos ?? 99)) }));
  return { season: race.season, teams: ordered, results: race.results };
}
