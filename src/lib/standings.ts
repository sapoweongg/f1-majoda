import "server-only";
import data from "@/data/standings.json";

/**
 * Clasificaciones finales de las temporadas cerradas (scripts/build-standings.mjs). Jolpica exige la
 * temporada en la URL, así que sin este archivo una ficha tendría que pedir una por una todas las
 * temporadas de un piloto o equipo; con él solo se piden las posteriores a `STANDINGS_THROUGH`.
 */
export const STANDINGS_THROUGH = data.through;

/** Posición tal como la da Jolpica ("1", "D" = descalificado, "-" = sin clasificar) y puntos oficiales. */
export type FinalStanding = { position: string; points: number; wins?: number };

type Row = [number, string, number, number?];

function index(list: unknown) {
  return new Map((list as [string, Row[]][]).map(([id, rows]) => [id, rows]));
}
const DRIVERS = index(data.drivers);
const TEAMS = index(data.teams);

function finals(rows: Row[] | undefined): Map<number, FinalStanding> {
  return new Map((rows ?? []).map(([season, position, points, wins]) => [season, { position, points, wins }]));
}

/** Clasificación final de cada temporada cerrada de un piloto. */
export const driverFinals = (driverId: string) => finals(DRIVERS.get(driverId));

/** Clasificación final de constructores (desde 1958) de cada temporada cerrada de un equipo. */
export const teamFinals = (constructorId: string) => finals(TEAMS.get(constructorId));
