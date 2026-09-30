import "server-only";
import { ApiError, cachedJson, createThrottle, freshJson } from "./fetcher";

// API OpenF1: https://openf1.org — datos desde 2023. Gratis sin auth (3 req/s, 30 req/min);
// el tiempo real requiere cuenta de pago y token Bearer.
const BASE = "https://api.openf1.org/v1";
const throttle = createThrottle(2.5);

export type Session = {
  session_key: number;
  session_type: string;
  session_name: string;
  date_start: string;
  date_end: string;
  meeting_key: number;
  circuit_key: number;
  circuit_short_name: string;
  country_code: string;
  country_name: string;
  location: string;
  gmt_offset: string;
  year: number;
  is_cancelled?: boolean;
};

export type Meeting = {
  meeting_key: number;
  meeting_name: string;
  meeting_official_name: string;
  location: string;
  country_code: string;
  country_name: string;
  circuit_key: number;
  circuit_short_name: string;
  date_start: string;
  date_end?: string;
  year: number;
};

export type OFDriver = {
  driver_number: number;
  broadcast_name: string;
  full_name: string;
  name_acronym: string;
  team_name: string | null;
  team_colour: string | null;
  first_name: string;
  last_name: string;
  headshot_url: string | null;
  country_code: string | null;
  session_key: number;
};

export type OFLap = {
  driver_number: number;
  lap_number: number;
  date_start: string | null;
  duration_sector_1: number | null;
  duration_sector_2: number | null;
  duration_sector_3: number | null;
  i1_speed: number | null;
  i2_speed: number | null;
  st_speed: number | null;
  is_pit_out_lap: boolean;
  lap_duration: number | null;
};

export type CarData = {
  date: string;
  driver_number: number;
  speed: number;
  throttle: number;
  brake: number;
  n_gear: number;
  rpm: number;
  drs: number;
};

export type Location = { date: string; driver_number: number; x: number; y: number; z: number };
export type Position = { date: string; driver_number: number; position: number };
export type Interval = {
  date: string;
  driver_number: number;
  gap_to_leader: number | string | null;
  interval: number | string | null;
};
export type Stint = {
  driver_number: number;
  stint_number: number;
  lap_start: number;
  lap_end: number;
  compound: string | null;
  tyre_age_at_start: number | null;
};
export type Pit = {
  date: string;
  driver_number: number;
  lap_number: number;
  pit_duration?: number | null;
  lane_duration?: number | null;
  stop_duration?: number | null;
};
export type RaceControl = {
  date: string;
  category: string;
  flag: string | null;
  message: string;
  scope: string | null;
  sector: number | null;
  driver_number: number | null;
  lap_number: number | null;
};
export type Weather = {
  date: string;
  air_temperature: number;
  track_temperature: number;
  humidity: number;
  pressure: number;
  rainfall: number;
  wind_direction: number;
  wind_speed: number;
};
export type SessionResult = {
  position: number | null;
  driver_number: number;
  number_of_laps: number;
  dnf: boolean;
  dns: boolean;
  dsq: boolean;
  duration: number | number[] | null;
  gap_to_leader: number | string | (number | string | null)[] | null;
};
export type Overtake = {
  date: string;
  overtaking_driver_number: number;
  overtaken_driver_number: number;
  position: number;
};

// ---------- Autenticación opcional (modo en vivo) ----------

let token: { value: string; expires: number } | null = null;

export function hasLiveCredentials() {
  return Boolean(process.env.OPENF1_USERNAME && process.env.OPENF1_PASSWORD);
}

async function authHeaders(): Promise<Record<string, string>> {
  if (!hasLiveCredentials()) return {};
  if (!token || token.expires < Date.now() + 60_000) {
    const res = await fetch("https://api.openf1.org/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        username: process.env.OPENF1_USERNAME!,
        password: process.env.OPENF1_PASSWORD!,
      }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`OpenF1 token: HTTP ${res.status}`);
    const json = (await res.json()) as { access_token: string; expires_in: string | number };
    token = { value: json.access_token, expires: Date.now() + Number(json.expires_in) * 1000 };
  }
  return { authorization: `Bearer ${token.value}` };
}

// ---------- Consultas ----------

type Query = Record<string, string | number | boolean | undefined>;

function url(endpoint: string, query: Query) {
  // OpenF1 usa operadores en el nombre del parámetro (date>=, lap_number<) sin codificar.
  const qs = Object.entries(query)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join("&");
  return `${BASE}/${endpoint}${qs ? `?${qs}` : ""}`;
}

/** Sesión terminada hace más de un día: sus datos ya no cambian. */
function ttlForSession(sessionKey: number | "latest", finished?: boolean) {
  if (sessionKey === "latest") return 60;
  return finished === false ? 60 : 86400;
}

/** OpenF1 responde 404 cuando una consulta no tiene resultados: lo tratamos como lista vacía. */
async function emptyOn404<T>(promise: Promise<T>): Promise<T> {
  try {
    return await promise;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return [] as T;
    throw err;
  }
}

function get<T>(endpoint: string, query: Query, revalidate: number) {
  return emptyOn404(
    cachedJson<T>(url(endpoint, query), {
      revalidate,
      throttle,
      headers: authHeaders,
      tags: ["openf1"],
    }),
  );
}

export function getLive<T>(endpoint: string, query: Query) {
  return emptyOn404(freshJson<T>(url(endpoint, query), { throttle, headers: authHeaders }));
}

export const getSessions = (query: Query) => get<Session[]>("sessions", query, 3600);
export const getMeetings = (year: number) => get<Meeting[]>("meetings", { year }, 3600);

export async function getLatestSession(): Promise<Session | undefined> {
  const [s] = await get<Session[]>("sessions", { session_key: "latest" }, 60);
  return s;
}

export const getDrivers = (sessionKey: number | "latest") =>
  get<OFDriver[]>("drivers", { session_key: sessionKey }, ttlForSession(sessionKey));

export const getLaps = (sessionKey: number, driverNumber?: number) =>
  get<OFLap[]>("laps", { session_key: sessionKey, driver_number: driverNumber }, ttlForSession(sessionKey));

export const getStints = (sessionKey: number) =>
  get<Stint[]>("stints", { session_key: sessionKey }, ttlForSession(sessionKey));

export const getPits = (sessionKey: number) => get<Pit[]>("pit", { session_key: sessionKey }, ttlForSession(sessionKey));

export const getRaceControl = (sessionKey: number) =>
  get<RaceControl[]>("race_control", { session_key: sessionKey }, ttlForSession(sessionKey));

export const getWeather = (sessionKey: number) =>
  get<Weather[]>("weather", { session_key: sessionKey }, ttlForSession(sessionKey));

export const getSessionResult = (sessionKey: number) =>
  get<SessionResult[]>("session_result", { session_key: sessionKey }, ttlForSession(sessionKey));

export const getOvertakes = (sessionKey: number) =>
  get<Overtake[]>("overtakes", { session_key: sessionKey }, ttlForSession(sessionKey));

export const getPositions = (sessionKey: number) =>
  get<Position[]>("position", { session_key: sessionKey }, ttlForSession(sessionKey));

/** Telemetría de un piloto en una ventana de tiempo (una vuelta ≈ 300–400 muestras). */
export const getCarData = (sessionKey: number, driverNumber: number, from: string, to: string) =>
  get<CarData[]>(
    "car_data",
    { session_key: sessionKey, driver_number: driverNumber, "date>": from, "date<": to },
    86400,
  );

export const getLocation = (sessionKey: number, driverNumber: number, from: string, to: string) =>
  get<Location[]>(
    "location",
    { session_key: sessionKey, driver_number: driverNumber, "date>": from, "date<": to },
    86400,
  );
