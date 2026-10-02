import "server-only";
import data from "@/data/teams.json";
import { getConstructorStandings, type ConstructorStanding } from "./api/jolpica";
import { safe } from "./safe";
import { teamFamily } from "./teams";

/** Un equipo en el buscador de /teams. */
export type TeamIndexEntry = {
  id: string;
  name: string;
  nationality: string;
  from: number;
  to: number;
  /** Temporadas en que corrió. */
  years: number[];
  wins: number;
  titles: number;
};

const STATIC = data.teams as TeamIndexEntry[];

/** Añade la clasificación de una temporada. El título solo cuenta si la temporada terminó. */
export function addTeamSeason(
  list: TeamIndexEntry[],
  season: number,
  standings: ConstructorStanding[],
  completed: boolean,
): TeamIndexEntry[] {
  const byId = new Map(list.map((t) => [t.id, t]));
  for (const s of standings) {
    const c = s.Constructor;
    const prev = byId.get(c.constructorId);
    if (prev?.years.includes(season)) continue; // ya contada
    const e: TeamIndexEntry = prev
      ? { ...prev, years: [...prev.years] }
      : { id: c.constructorId, name: c.name, nationality: c.nationality ?? "", from: season, to: season, years: [], wins: 0, titles: 0 };
    e.years.push(season);
    e.to = Math.max(e.to, season);
    e.name = c.name;
    e.wins += Number(s.wins);
    if (completed && Number(s.position) === 1) e.titles++;
    byId.set(c.constructorId, e);
  }
  return [...byId.values()];
}

/**
 * Une los chasis-motor de los años 50-70 ("lotus-climax", "brabham-repco") con su equipo, si este
 * existe en la lista: suma victorias y títulos y junta las temporadas.
 */
export function mergeFamilies(list: TeamIndexEntry[]): TeamIndexEntry[] {
  const byId = new Map(list.map((t) => [t.id, { ...t, years: [...t.years] }]));
  for (const t of list) {
    const family = teamFamily(t.id);
    const head = byId.get(family);
    if (family === t.id || !head) continue;
    head.years = [...new Set([...head.years, ...t.years])].sort((a, b) => a - b);
    head.from = head.years[0];
    head.to = head.years.at(-1)!;
    head.wins += t.wins;
    head.titles += t.titles;
    byId.delete(t.id);
  }
  return [...byId.values()];
}

/**
 * Todos los equipos desde 1950: el archivo estático (scripts/build-teams.mjs) más las temporadas
 * posteriores, que se piden en tiempo real (así Audi o Cadillac aparecen sin regenerar el archivo).
 */
export async function getTeamIndex(current: number): Promise<TeamIndexEntry[]> {
  let list = STATIC;
  for (let season = data.through + 1; season <= current; season++) {
    const { standings } = await safe(getConstructorStandings(season), { round: 0, standings: [] });
    list = addTeamSeason(list, season, standings, season < current);
  }
  return mergeFamilies(list);
}

/**
 * Victorias y títulos de los chasis-motor de la misma familia que no son el propio id (p. ej. para
 * Lotus, las de "lotus-climax" y "lotus-ford"). Son todos históricos, así que basta el archivo.
 */
export function familyExtras(constructorId: string): { wins: number; titles: number } {
  const family = teamFamily(constructorId);
  let wins = 0;
  let titles = 0;
  for (const t of STATIC) {
    if (t.id === constructorId || teamFamily(t.id) !== family) continue;
    wins += t.wins;
    titles += t.titles;
  }
  return { wins, titles };
}
