import "server-only";
import data from "@/data/drivers.json";
import { getDriverStandings, type DriverStanding } from "./api/jolpica";
import { safe } from "./safe";
import { driverFinals, STANDINGS_THROUGH } from "./standings";

/** Un piloto en el buscador de /drivers. */
export type DriverIndexEntry = {
  id: string;
  given: string;
  family: string;
  nationality: string;
  from: number;
  to: number;
  seasons: number;
  wins: number;
  titles: number;
  /** Mejor posición final en el campeonato (99 = sin posición). */
  best: number;
};

/**
 * Añade la clasificación de una temporada al índice. Solo cuenta el título si la temporada terminó
 * (`completed`); en la temporada en curso el líder todavía no es campeón.
 */
export function addSeason(
  list: DriverIndexEntry[],
  season: number,
  standings: DriverStanding[],
  completed: boolean,
): DriverIndexEntry[] {
  const byId = new Map(list.map((d) => [d.id, d]));
  for (const s of standings) {
    const d = s.Driver;
    const prev = byId.get(d.driverId);
    if (prev && prev.to >= season) continue; // ya contada
    const pos = Number(s.position);
    const e: DriverIndexEntry = prev
      ? { ...prev }
      : {
          id: d.driverId,
          given: d.givenName,
          family: d.familyName,
          nationality: d.nationality ?? "",
          from: season,
          to: season,
          seasons: 0,
          wins: 0,
          titles: 0,
          best: 99,
        };
    e.to = season;
    e.seasons++;
    e.wins += Number(s.wins);
    if (completed && pos === 1) e.titles++;
    if (completed && pos && pos < e.best) e.best = pos;
    byId.set(d.driverId, e);
  }
  return [...byId.values()];
}

/**
 * Temporadas de un piloto: las cerradas, del archivo de clasificaciones; las posteriores se dan por
 * corridas hasta la última en la que aparece.
 */
export function driverYears(d: Pick<DriverIndexEntry, "id" | "to">): number[] {
  const years = [...driverFinals(d.id).keys()];
  for (let s = STANDINGS_THROUGH + 1; s <= d.to; s++) years.push(s);
  return years;
}

/**
 * Todos los pilotos desde 1950: el archivo estático (scripts/build-drivers.mjs) más las temporadas
 * posteriores, que se piden en tiempo real. Así un piloto nuevo aparece sin regenerar el archivo.
 */
export async function getDriverIndex(current: number): Promise<DriverIndexEntry[]> {
  let list = data.drivers as DriverIndexEntry[];
  for (let season = data.through + 1; season <= current; season++) {
    const { standings } = await safe(getDriverStandings(season), { round: 0, standings: [] });
    list = addSeason(list, season, standings, season < current);
  }
  return list;
}
