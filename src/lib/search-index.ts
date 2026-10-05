import "server-only";
import { getAllCircuits, getCurrentSeason } from "./api/jolpica";
import { getTeamIndex } from "./constructors";
import { countryToIso } from "./countries";
import { driverYears, getDriverIndex } from "./drivers";
import { gapYears } from "./format";
import { gpName } from "./gp-names";
import { getAllRaces } from "./races-index";
import { safe } from "./safe";

/**
 * Índice compacto para el buscador del menú (se descarga solo al abrirlo).
 * Listas de tuplas para que pese poco: ~1.000 pilotos y ~1.200 carreras.
 */
export type SearchIndex = {
  current: number;
  /** [id, nombre, apellido, desde, hasta, títulos, victorias, temporadas (solo si hay huecos)] */
  drivers: [string, string, string, number, number, number, number, number[]?][];
  /** [id, nombre, desde, hasta, títulos, victorias, temporadas (solo si hay huecos)] */
  teams: [string, string, number, number, number, number, number[]?][];
  /** [id, nombre, ciudad, país traducido, iso] */
  circuits: [string, string, string, string, string][];
  /** [temporada, ronda, nombre traducido, circuitId] */
  races: [number, number, string, string][];
};

export async function buildSearchIndex(locale: string): Promise<SearchIndex> {
  const current = await safe(getCurrentSeason(), new Date().getUTCFullYear());
  const [drivers, teams, circuits, { rows }] = await Promise.all([
    getDriverIndex(current),
    getTeamIndex(current),
    safe(getAllCircuits(), []),
    getAllRaces(current),
  ]);
  const regions = new Intl.DisplayNames([locale], { type: "region" });
  // La lista de temporadas solo se añade si hay huecos (un `undefined` se volvería null en el JSON)
  const gaps = (years: number[], from: number, to: number): [] | [number[]] => {
    const list = gapYears(years, from, to);
    return list ? [list] : [];
  };
  return {
    current,
    drivers: drivers.map((d) => [d.id, d.given, d.family, d.from, d.to, d.titles, d.wins, ...gaps(driverYears(d), d.from, d.to)]),
    teams: teams.map((t) => [t.id, t.name, t.from, t.to, t.titles, t.wins, ...gaps(t.years, t.from, t.to)]),
    circuits: circuits.map((c) => {
      const iso = countryToIso(c.Location.country) ?? "";
      return [c.circuitId, c.circuitName, c.Location.locality, (iso && regions.of(iso.toUpperCase())) || c.Location.country, iso];
    }),
    races: rows.map(([season, round, name, circuitId]) => [season, round, gpName(name, locale), circuitId]),
  };
}
