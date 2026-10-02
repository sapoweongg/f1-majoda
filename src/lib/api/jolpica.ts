import "server-only";
import { cachedJson, createThrottle } from "./fetcher";

// API Jolpica-F1 (compatible con Ergast): https://github.com/jolpica/jolpica-f1
const BASE = "https://api.jolpi.ca/ergast/f1";
// Límite oficial: 4 req/s y 500 req/h. Vamos un poco por debajo.
const throttle = createThrottle(3);

const HOUR = 3600;
const DAY = 86400;

export type Driver = {
  driverId: string;
  permanentNumber?: string;
  code?: string;
  url?: string;
  givenName: string;
  familyName: string;
  dateOfBirth?: string;
  nationality?: string;
};

export type Constructor = {
  constructorId: string;
  url?: string;
  name: string;
  nationality?: string;
};

export type Circuit = {
  circuitId: string;
  url?: string;
  circuitName: string;
  Location: { lat: string; long: string; locality: string; country: string };
};

export type SessionTime = { date: string; time?: string };

export type Result = {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: Driver;
  Constructor: Constructor;
  grid?: string;
  laps?: string;
  status?: string;
  Time?: { millis?: string; time: string };
  FastestLap?: { rank?: string; lap?: string; Time?: { time: string } };
};

export type QualifyingResult = {
  number: string;
  position: string;
  Driver: Driver;
  Constructor: Constructor;
  Q1?: string;
  Q2?: string;
  Q3?: string;
};

export type Lap = { number: string; Timings: { driverId: string; position: string; time: string }[] };
export type PitStop = { driverId: string; lap: string; stop: string; time: string; duration: string };

export type Race = {
  season: string;
  round: string;
  url?: string;
  raceName: string;
  Circuit: Circuit;
  date: string;
  time?: string;
  FirstPractice?: SessionTime;
  SecondPractice?: SessionTime;
  ThirdPractice?: SessionTime;
  Qualifying?: SessionTime;
  Sprint?: SessionTime;
  SprintQualifying?: SessionTime;
  SprintShootout?: SessionTime;
  Results?: Result[];
  SprintResults?: Result[];
  QualifyingResults?: QualifyingResult[];
  Laps?: Lap[];
  PitStops?: PitStop[];
};

export type DriverStanding = {
  position?: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructors: Constructor[];
};

export type ConstructorStanding = {
  position?: string;
  positionText: string;
  points: string;
  wins: string;
  Constructor: Constructor;
};

type MRData<T> = { MRData: { limit: string; offset: string; total: string } & T };
type RaceTable = { RaceTable: { season?: string; Races: Race[] } };
type StandingsTable<K extends string, S> = {
  StandingsTable: {
    season?: string;
    round?: string;
    StandingsLists: ({ season: string; round: string } & Record<K, S[]>)[];
  };
};

/** Temporadas cerradas no cambian: caché larga. La actual se refresca cada 5 minutos. */
function ttl(season: number | string): number {
  return Number(season) < new Date().getUTCFullYear() ? 30 * DAY : 300;
}

function get<T>(path: string, revalidate: number, tags: string[] = []) {
  return cachedJson<MRData<T>>(`${BASE}${path}`, { revalidate, throttle, tags: ["jolpica", ...tags] });
}

/** Recorre todas las páginas (máx. 100 por página) y une las carreras por ronda. */
async function allRaces(path: string, revalidate: number, tags: string[] = []): Promise<Race[]> {
  const pageUrl = (offset: number) =>
    `${path}.json?limit=100${offset ? `&offset=${offset}` : ""}`;
  const first = await get<RaceTable>(pageUrl(0), revalidate, tags);
  const total = Number(first.MRData.total);
  const pages = [first];
  for (let offset = 100; offset < total; offset += 100) {
    pages.push(await get<RaceTable>(pageUrl(offset), revalidate, tags));
  }
  return mergeRacePages(pages.map((p) => p.MRData.RaceTable.Races));
}

/**
 * Une las páginas de una consulta en una carrera por temporada y ronda, en orden cronológico.
 * Las consultas de varias temporadas (ganadores de un circuito, carrera de un piloto) mezclan años,
 * así que se ordena primero por temporada y luego por ronda.
 */
export function mergeRacePages(pages: Race[][]): Race[] {
  const byRound = new Map<string, Race>();
  const listKeys = ["Results", "SprintResults", "QualifyingResults", "Laps", "PitStops"] as const;
  for (const page of pages) {
    for (const race of page) {
      const key = `${race.season}-${race.round}`;
      const prev = byRound.get(key);
      if (!prev) {
        byRound.set(key, structuredClone(race));
        continue;
      }
      for (const k of listKeys) {
        const items = race[k];
        if (!items) continue;
        // Las vueltas pueden cortarse a mitad de página: unimos los tiempos de la misma vuelta.
        if (k === "Laps") {
          const laps = (prev.Laps ??= []);
          for (const lap of items as Lap[]) {
            const same = laps.find((l) => l.number === lap.number);
            if (same) same.Timings.push(...lap.Timings);
            else laps.push(structuredClone(lap));
          }
        } else {
          (prev[k] as unknown[]) = [...((prev[k] as unknown[]) ?? []), ...items];
        }
      }
    }
  }
  return [...byRound.values()].sort(
    (a, b) => Number(a.season) - Number(b.season) || Number(a.round) - Number(b.round),
  );
}

// ---------- Temporada y calendario ----------

export async function getCurrentSeason(): Promise<number> {
  const data = await get<RaceTable>("/current.json?limit=1", HOUR);
  return Number(data.MRData.RaceTable.season ?? new Date().getUTCFullYear());
}

export async function getSchedule(season: number): Promise<Race[]> {
  const data = await get<RaceTable>(`/${season}.json?limit=100`, season < new Date().getUTCFullYear() ? 30 * DAY : HOUR);
  return data.MRData.RaceTable.Races;
}

// ---------- Clasificaciones ----------

export async function getDriverStandings(season: number, round?: number) {
  const path = round ? `/${season}/${round}/driverstandings` : `/${season}/driverstandings`;
  const data = await get<StandingsTable<"DriverStandings", DriverStanding>>(`${path}.json?limit=100`, ttl(season));
  const list = data.MRData.StandingsTable.StandingsLists[0];
  return { round: Number(list?.round ?? 0), standings: list?.DriverStandings ?? [] };
}

export async function getConstructorStandings(season: number, round?: number) {
  const path = round ? `/${season}/${round}/constructorstandings` : `/${season}/constructorstandings`;
  const data = await get<StandingsTable<"ConstructorStandings", ConstructorStanding>>(`${path}.json?limit=100`, ttl(season));
  const list = data.MRData.StandingsTable.StandingsLists[0];
  return { round: Number(list?.round ?? 0), standings: list?.ConstructorStandings ?? [] };
}

// ---------- Resultados ----------

export const getSeasonResults = (season: number) => allRaces(`/${season}/results`, ttl(season));
export const getSeasonSprints = (season: number) => allRaces(`/${season}/sprint`, ttl(season));
export const getSeasonQualifying = (season: number) => allRaces(`/${season}/qualifying`, ttl(season));

export async function getRace(season: number, round: number) {
  const [results] = await allRaces(`/${season}/${round}/results`, ttl(season));
  return results;
}
export async function getRaceQualifying(season: number, round: number) {
  const [race] = await allRaces(`/${season}/${round}/qualifying`, ttl(season));
  return race?.QualifyingResults ?? [];
}
export async function getRaceSprint(season: number, round: number) {
  const [race] = await allRaces(`/${season}/${round}/sprint`, ttl(season));
  return race?.SprintResults ?? [];
}
export async function getRaceLaps(season: number, round: number) {
  const [race] = await allRaces(`/${season}/${round}/laps`, ttl(season));
  return race?.Laps ?? [];
}
export async function getRacePitStops(season: number, round: number) {
  const [race] = await allRaces(`/${season}/${round}/pitstops`, ttl(season));
  return race?.PitStops ?? [];
}

// ---------- Pilotos, equipos y circuitos ----------

export async function getDriver(driverId: string): Promise<Driver | undefined> {
  const data = await get<{ DriverTable: { Drivers: Driver[] } }>(`/drivers/${driverId}.json`, 7 * DAY);
  return data.MRData.DriverTable.Drivers[0];
}

export async function getSeasonDrivers(season: number): Promise<Driver[]> {
  const data = await get<{ DriverTable: { Drivers: Driver[] } }>(`/${season}/drivers.json?limit=100`, ttl(season));
  return data.MRData.DriverTable.Drivers;
}

type SeasonTable = { SeasonTable: { Seasons: { season: string }[] } };

/** Temporadas en las que corrió un piloto. */
export async function getDriverSeasonList(driverId: string): Promise<number[]> {
  const data = await get<SeasonTable>(`/drivers/${driverId}/seasons.json?limit=100`, DAY);
  return data.MRData.SeasonTable.Seasons.map((x) => Number(x.season));
}

/**
 * Posición final del piloto por temporada. Jolpica exige la temporada en la URL, así que pedimos
 * una por una solo las `recent` más recientes (las temporadas cerradas quedan en caché 30 días).
 */
export async function getDriverSeasons(driverId: string, recent = 15) {
  const seasons = await getDriverSeasonList(driverId);
  const wanted = new Set(seasons.slice(-recent));
  return Promise.all(
    seasons.map(async (season) => {
      if (!wanted.has(season)) return { season, standing: undefined };
      const data = await get<StandingsTable<"DriverStandings", DriverStanding>>(
        `/${season}/drivers/${driverId}/driverstandings.json`,
        ttl(season),
      ).catch(() => null);
      return { season, standing: data?.MRData.StandingsTable.StandingsLists[0]?.DriverStandings[0] };
    }),
  );
}

export const getDriverCareerSprints = (driverId: string) => allRaces(`/drivers/${driverId}/sprint`, DAY);

export const getDriverCareerResults = (driverId: string) => allRaces(`/drivers/${driverId}/results`, DAY);

export async function getConstructor(constructorId: string): Promise<Constructor | undefined> {
  const data = await get<{ ConstructorTable: { Constructors: Constructor[] } }>(
    `/constructors/${constructorId}.json`,
    7 * DAY,
  );
  return data.MRData.ConstructorTable.Constructors[0];
}

/** Temporadas de un equipo; posición final solo de las `recent` más recientes. */
export async function getConstructorSeasons(constructorId: string, recent = 12) {
  const list = await get<SeasonTable>(`/constructors/${constructorId}/seasons.json?limit=100`, DAY);
  const seasons = list.MRData.SeasonTable.Seasons.map((x) => Number(x.season));
  const wanted = new Set(seasons.slice(-recent));
  return Promise.all(
    seasons.map(async (season) => {
      if (!wanted.has(season) || season < 1958) return { season, standing: undefined };
      const data = await get<StandingsTable<"ConstructorStandings", ConstructorStanding>>(
        `/${season}/constructors/${constructorId}/constructorstandings.json`,
        ttl(season),
      ).catch(() => null);
      return { season, standing: data?.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings[0] };
    }),
  );
}

/** Victorias totales de un equipo (solo leemos el total). */
export async function getConstructorWinCount(constructorId: string): Promise<number> {
  const data = await get<RaceTable>(`/constructors/${constructorId}/results/1.json?limit=1`, DAY);
  return Number(data.MRData.total);
}

export async function getCircuit(circuitId: string): Promise<Circuit | undefined> {
  const data = await get<{ CircuitTable: { Circuits: Circuit[] } }>(`/circuits/${circuitId}.json`, 30 * DAY);
  return data.MRData.CircuitTable.Circuits[0];
}

/** Todos los circuitos que han acogido una carrera del campeonato. */
export async function getAllCircuits(): Promise<Circuit[]> {
  const data = await get<{ CircuitTable: { Circuits: Circuit[] } }>("/circuits.json?limit=100", 30 * DAY);
  return data.MRData.CircuitTable.Circuits;
}

/** Ganadores de todas las carreras disputadas en un circuito. */
export const getCircuitWinners = (circuitId: string) => allRaces(`/circuits/${circuitId}/results/1`, DAY);

/** Ganador de cada carrera de la temporada (una sola petición). */
export const getSeasonWinners = (season: number) => allRaces(`/${season}/results/1`, ttl(season));

/** Número total de poles de un piloto (solo leemos el total de la respuesta). */
export async function getDriverPoleCount(driverId: string): Promise<number> {
  const data = await get<RaceTable>(`/drivers/${driverId}/qualifying/1.json?limit=1`, DAY);
  return Number(data.MRData.total);
}

/** Pilotos que corrieron para un equipo en una temporada. */
export async function getConstructorDrivers(constructorId: string, season: number): Promise<Driver[]> {
  const data = await get<{ DriverTable: { Drivers: Driver[] } }>(
    `/${season}/constructors/${constructorId}/drivers.json?limit=100`,
    ttl(season),
  );
  return data.MRData.DriverTable.Drivers;
}
