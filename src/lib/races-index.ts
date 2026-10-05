import "server-only";
import data from "@/data/races.json";
import { getAllCircuits, getSchedule, type Circuit, type Race } from "./api/jolpica";
import { raceStart } from "./mapping";
import { safe } from "./safe";

/** Una carrera del archivo: [temporada, ronda, nombre, circuitId, país]. */
export type RaceRow = [number, number, string, string, string];

/** Un circuito en el buscador de /circuits. */
export type CircuitIndexEntry = {
  id: string;
  name: string;
  locality: string;
  country: string;
  from: number;
  to: number;
  /** Temporadas con carrera (incluida la actual si está en el calendario). */
  years: number[];
  /** Carreras ya disputadas. */
  races: number;
};

const STATIC = data.races as RaceRow[];

/**
 * Todas las carreras desde 1950: el archivo estático (scripts/build-races.mjs) más las temporadas
 * posteriores, sacadas del calendario. Devuelve también el calendario de la temporada actual.
 */
export async function getAllRaces(current: number): Promise<{ rows: RaceRow[]; schedules: Race[] }> {
  const schedules: Race[] = [];
  for (let season = data.through + 1; season <= current; season++) {
    schedules.push(...(await safe(getSchedule(season), [])));
  }
  const rows: RaceRow[] = [
    ...STATIC,
    ...schedules.map((r): RaceRow => [Number(r.season), Number(r.round), r.raceName, r.Circuit.circuitId, r.Circuit.Location.country]),
  ];
  return { rows, schedules };
}

/**
 * Años y número de carreras de cada circuito. Las carreras del calendario que aún no se han corrido
 * cuentan para "en activo" pero no para el total.
 */
export function buildCircuitIndex(circuits: Circuit[], past: RaceRow[], schedules: Race[], now: number): CircuitIndexEntry[] {
  const stats = new Map<string, { from: number; to: number; years: number[]; races: number }>();
  const add = (id: string, season: number, held: boolean) => {
    const e = stats.get(id) ?? { from: season, to: season, years: [], races: 0 };
    e.from = Math.min(e.from, season);
    e.to = Math.max(e.to, season);
    if (!e.years.includes(season)) e.years.push(season);
    if (held) e.races++;
    stats.set(id, e);
  };
  for (const [season, , , id] of past) add(id, season, true);
  for (const r of schedules) add(r.Circuit.circuitId, Number(r.season), raceStart(r).getTime() < now);
  return circuits.flatMap((c) => {
    const e = stats.get(c.circuitId);
    if (!e) return [];
    return [{ id: c.circuitId, name: c.circuitName, locality: c.Location.locality, country: c.Location.country, ...e }];
  });
}

export async function getCircuitIndex(current: number, now: number) {
  const [circuits, { schedules }] = await Promise.all([safe(getAllCircuits(), []), getAllRaces(current)]);
  return buildCircuitIndex(circuits, STATIC, schedules, now);
}
