import "server-only";
import {
  getDrivers,
  getLaps,
  getLive,
  getPits,
  getRaceControl,
  getSessions,
  getStints,
  hasLiveCredentials,
  type Interval,
  type Location,
  type OFDriver,
  type OFLap,
  type Pit,
  type Position,
  type RaceControl,
  type Session,
  type Stint,
  type Weather,
} from "./api/openf1";
import { unstable_cache } from "next/cache";
import type { ControlMessage, LiveSnapshot, ReplayData, ReplayFrame, SessionInfo, TowerRow } from "./live-types";
import { largeHeadshot } from "./media";
import { isKeyMessage } from "./race-control";
import { fitToBox } from "./telemetry";

export function sessionInfo(s: Session): SessionInfo {
  return {
    key: s.session_key,
    name: s.session_name,
    type: s.session_type,
    circuit: s.circuit_short_name,
    country: s.country_name,
    countryCode: s.country_code,
    start: s.date_start,
    end: s.date_end,
  };
}

export function isLiveWindow(s: Pick<Session, "date_start" | "date_end">, now = Date.now()) {
  return new Date(s.date_start).getTime() - 10 * 60_000 < now && now < new Date(s.date_end).getTime() + 15 * 60_000;
}

/** Solo los mensajes importantes: el estado de pista sale de ellos y la lista no se llena de ruido. */
function toMessages(rc: RaceControl[]): ControlMessage[] {
  return rc.filter(isKeyMessage).map((m) => ({ date: m.date, lap: m.lap_number, message: m.message, flag: m.flag, category: m.category }));
}

/** Estado de pista a partir de los mensajes de dirección de carrera (en orden cronológico). */
export function trackStatusFrom(messages: Pick<ControlMessage, "flag" | "category" | "message">[]) {
  let status: string | null = null;
  for (const m of messages) {
    const text = m.message.toUpperCase();
    if (m.category === "SafetyCar") {
      if (text.includes("VIRTUAL") && text.includes("DEPLOYED")) status = "VSC";
      else if (text.includes("DEPLOYED")) status = "SC";
      continue;
    }
    if (m.flag === "RED") status = "RED";
    else if (m.flag === "CHEQUERED") status = "CHEQUERED";
    else if ((m.flag === "GREEN" || m.flag === "CLEAR") && text.includes("TRACK")) status = "GREEN";
  }
  return status;
}

function driverMeta(drivers: OFDriver[]) {
  return new Map(
    drivers.map((d) => [
      d.driver_number,
      {
        code: d.name_acronym,
        name: d.full_name,
        color: d.team_colour ? `#${d.team_colour}` : "#8e8e93",
        headshot: largeHeadshot(d.headshot_url),
      },
    ]),
  );
}

function stintAt(stints: Stint[], num: number, lap: number) {
  const list = stints.filter((s) => s.driver_number === num).sort((a, b) => a.stint_number - b.stint_number);
  const s = list.find((x) => lap >= x.lap_start && lap <= (x.lap_end ?? Infinity)) ?? list.at(-1);
  if (!s) return { compound: null, age: null };
  return { compound: s.compound, age: (s.tyre_age_at_start ?? 0) + Math.max(0, lap - s.lap_start) };
}

const fmtGap = (s: number) => `+${s.toFixed(3)}`;

// ---------------- Repetición (datos históricos gratis) ----------------

/** Última carrera terminada con datos en OpenF1. */
export async function latestFinishedRace(): Promise<Session | undefined> {
  const year = new Date().getUTCFullYear();
  for (const y of [year, year - 1]) {
    const list = await getSessions({ year: y, session_name: "Race" }).catch(() => [] as Session[]);
    const done = list.filter((s) => new Date(s.date_end).getTime() + 30 * 60_000 < Date.now());
    if (done.length) return done.sort((a, b) => a.date_start.localeCompare(b.date_start)).at(-1);
  }
  return undefined;
}

/**
 * Reconstruye la torre de tiempos vuelta a vuelta: el momento en que cada coche cierra la vuelta N
 * es el inicio de su vuelta N+1 (o inicio + duración en la última).
 */
export async function buildReplay(session: Session): Promise<ReplayData | null> {
  const [drivers, laps, stints, pits, rc] = await Promise.all([
    getDrivers(session),
    getLaps(session),
    getStints(session),
    getPits(session),
    getRaceControl(session),
  ]);
  if (!laps.length) return null;
  const meta = driverMeta(drivers);
  const byDriver = new Map<number, OFLap[]>();
  for (const l of laps) byDriver.set(l.driver_number, [...(byDriver.get(l.driver_number) ?? []), l]);
  for (const list of byDriver.values()) list.sort((a, b) => a.lap_number - b.lap_number);

  // fin de cada vuelta por piloto (ms)
  const ends = new Map<number, Map<number, number>>();
  for (const [num, list] of byDriver) {
    const m = new Map<number, number>();
    list.forEach((l, i) => {
      const next = list[i + 1];
      const end = next?.date_start
        ? new Date(next.date_start).getTime()
        : l.date_start && l.lap_duration
          ? new Date(l.date_start).getTime() + l.lap_duration * 1000
          : null;
      if (end) m.set(l.lap_number, end);
    });
    ends.set(num, m);
  }
  const totalLaps = Math.max(...laps.map((l) => l.lap_number));
  const messages = toMessages(rc);
  const frames: ReplayFrame[] = [];

  for (let lap = 1; lap <= totalLaps; lap++) {
    const entries = [...byDriver.keys()].map((num) => {
      const m = ends.get(num)!;
      // última vuelta completada hasta esta vuelta
      let done = 0;
      let at = Infinity;
      for (let k = lap; k >= 1; k--) {
        if (m.has(k)) {
          done = k;
          at = m.get(k)!;
          break;
        }
      }
      return { num, done, at };
    });
    entries.sort((a, b) => b.done - a.done || a.at - b.at);
    const leader = entries[0];
    const rows: TowerRow[] = entries.map((e, i) => {
      const info = meta.get(e.num);
      const ahead = entries[i - 1];
      const lapObj = byDriver.get(e.num)?.find((l) => l.lap_number === e.done);
      const tyre = stintAt(stints, e.num, Math.max(1, e.done));
      const lapsDown = leader.done - e.done;
      const out = e.done < lap && !byDriver.get(e.num)?.some((l) => l.lap_number > e.done);
      return {
        number: e.num,
        code: info?.code ?? String(e.num),
        name: info?.name ?? String(e.num),
        color: info?.color ?? "#8e8e93",
        position: i + 1,
        gap: i === 0 ? null : lapsDown > 0 ? `+${lapsDown} L` : fmtGap((e.at - leader.at) / 1000),
        interval: i === 0 ? null : ahead && ahead.done === e.done ? fmtGap((e.at - ahead.at) / 1000) : lapsDown > 0 ? `+${lapsDown} L` : null,
        lastLap: lapObj?.lap_duration ?? null,
        compound: tyre.compound,
        tyreAge: tyre.age,
        stops: pits.filter((p: Pit) => p.driver_number === e.num && p.lap_number <= lap).length,
        out,
      };
    });
    frames.push({ lap, rows, trackStatus: trackStatusFrom(messages.filter((m) => (m.lap ?? 0) <= lap)) });
  }
  return { session: sessionInfo(session), totalLaps, frames, messages };
}

// ---------------- En vivo (requiere cuenta de pago de OpenF1) ----------------

/** Redondea "ahora" a tramos de N segundos para que la caché compartida agrupe peticiones. */
function bucket(seconds: number, offset = 0) {
  const ms = seconds * 1000;
  return new Date(Math.floor((Date.now() - offset * 1000) / ms) * ms).toISOString();
}



function liveFetch<T>(endpoint: string, query: Record<string, string | number>, cacheSeconds: number): Promise<T[]> {
  const key = JSON.stringify([endpoint, query]);
  // Un recurso que falla no debe vaciar toda la foto
  return unstable_cache(() => getLive<T[]>(endpoint, query), ["live", key], { revalidate: cacheSeconds })().catch(
    (err) => {
      console.error("[live]", endpoint, err instanceof Error ? err.message : err);
      return [] as T[];
    },
  );
}

export async function getLiveSession(): Promise<Session | undefined> {
  const forced = process.env.OPENF1_LIVE_SESSION_KEY;
  const list = await getSessions(forced ? { session_key: Number(forced) } : { session_key: "latest" }).catch(() => []);
  return list[0];
}

export async function buildLiveSnapshot(): Promise<LiveSnapshot> {
  const empty = (mode: LiveSnapshot["mode"], session: Session | null = null): LiveSnapshot => ({
    mode,
    session: session ? sessionInfo(session) : null,
    lap: null,
    rows: [],
    messages: [],
    trackStatus: null,
    weather: null,
    cars: [],
    outline: null,
    updatedAt: new Date().toISOString(),
  });

  const session = await getLiveSession();
  if (!session) return empty("idle");
  const forced = Boolean(process.env.OPENF1_LIVE_SESSION_KEY);
  if (!forced && !isLiveWindow(session)) return empty("idle", session);
  // Con una sesión forzada (pruebas) usamos datos históricos, que no requieren cuenta.
  if (!forced && !hasLiveCredentials()) return empty("disabled", session);

  const key = session.session_key;
  // En modo prueba "ahora" es poco antes de la bandera a cuadros de la sesión forzada
  let nowIso = bucket(5);
  if (forced) {
    const rc0 = await liveFetch<RaceControl>("race_control", { session_key: key }, 15);
    const end = rc0.find((m) => m.flag === "CHEQUERED") ?? rc0.at(-1);
    nowIso = new Date(new Date(end?.date ?? session.date_end).getTime() - 20_000).toISOString();
  }
  const since = (s: number) => new Date(new Date(nowIso).getTime() - s * 1000).toISOString();

  const [drivers, positions, intervals, laps, stints, rc, weather, locations] = await Promise.all([
    liveFetch<OFDriver>("drivers", { session_key: key }, 60),
    liveFetch<Position>("position", { session_key: key }, 10),
    liveFetch<Interval>("intervals", { session_key: key, "date>": since(30), "date<": nowIso }, 5),
    liveFetch<OFLap>("laps", { session_key: key, "date_start>": since(300) }, 20),
    liveFetch<Stint>("stints", { session_key: key }, 30),
    liveFetch<RaceControl>("race_control", { session_key: key }, 15),
    liveFetch<Weather>("weather", { session_key: key, "date>": since(180), "date<": nowIso }, 60),
    liveFetch<Location>("location", { session_key: key, "date>": since(4), "date<": nowIso }, 5),
  ]);

  const meta = driverMeta(drivers as OFDriver[]);
  const lastBy = <T extends { driver_number: number; date: string }>(list: readonly T[]) => {
    const m = new Map<number, T>();
    for (const x of list) {
      const prev = m.get(x.driver_number);
      if (!prev || prev.date < x.date) m.set(x.driver_number, x);
    }
    return m;
  };
  const posBy = lastBy(positions as Position[]);
  const intBy = lastBy(intervals as Interval[]);
  const lapsList = laps as OFLap[];
  const currentLap = lapsList.length ? Math.max(...lapsList.map((l) => l.lap_number)) : null;
  const lastLapBy = new Map<number, OFLap>();
  for (const l of lapsList) {
    if (l.lap_duration == null) continue;
    const prev = lastLapBy.get(l.driver_number);
    if (!prev || prev.lap_number < l.lap_number) lastLapBy.set(l.driver_number, l);
  }
  const pitsCount = new Map<number, number>();
  for (const s of stints as Stint[]) pitsCount.set(s.driver_number, Math.max(pitsCount.get(s.driver_number) ?? 0, s.stint_number - 1));

  const fmt = (v: number | string | null | undefined) => (v == null ? null : typeof v === "number" ? fmtGap(v) : v);
  const rows: TowerRow[] = [...posBy.values()]
    .sort((a, b) => a.position - b.position)
    .map((p) => {
      const info = meta.get(p.driver_number);
      const iv = intBy.get(p.driver_number);
      const tyre = stintAt(stints as Stint[], p.driver_number, currentLap ?? 1);
      return {
        number: p.driver_number,
        code: info?.code ?? String(p.driver_number),
        name: info?.name ?? "",
        color: info?.color ?? "#8e8e93",
        position: p.position,
        gap: p.position === 1 ? null : fmt(iv?.gap_to_leader),
        interval: p.position === 1 ? null : fmt(iv?.interval),
        lastLap: lastLapBy.get(p.driver_number)?.lap_duration ?? null,
        compound: tyre.compound,
        tyreAge: tyre.age,
        stops: pitsCount.get(p.driver_number) ?? 0,
      };
    });

  const messages = toMessages(rc as RaceControl[]);
  const w = (weather as Weather[]).at(-1);

  // Contorno del circuito: una vuelta completa del líder, guardada un día en caché
  const outlineData = await buildOutline(key, lapsList).catch(() => null);
  const cars = outlineData
    ? [...lastBy(locations as Location[]).values()].map((l) => ({ number: l.driver_number, ...outlineData.fit(l) }))
    : [];

  return {
    mode: "live",
    session: sessionInfo(session),
    lap: currentLap,
    rows,
    messages: messages.slice(-30).reverse(),
    trackStatus: trackStatusFrom(messages),
    weather: w ? { air: w.air_temperature, track: w.track_temperature, rain: w.rainfall > 0 } : null,
    cars,
    outline: outlineData?.points ?? null,
    updatedAt: new Date().toISOString(),
  };
}

async function buildOutline(sessionKey: number, recentLaps: OFLap[]) {
  // Buscamos una vuelta completa cualquiera (preferimos una reciente con duración conocida)
  const ref = recentLaps.find((l) => l.lap_duration && l.date_start && !l.is_pit_out_lap);
  if (!ref) return null;
  const from = ref.date_start!;
  const to = new Date(new Date(from).getTime() + ref.lap_duration! * 1000).toISOString();
  const pts = await unstable_cache(
    () => getLive<Location[]>("location", { session_key: sessionKey, driver_number: ref.driver_number, "date>": from, "date<": to }),
    ["outline", String(sessionKey)],
    { revalidate: 86400 },
  )();
  const clean = pts.filter((p) => p.x !== 0 || p.y !== 0);
  if (clean.length < 20) return null;
  const xs = clean.map((p) => p.x);
  const ys = clean.map((p) => p.y);
  const bounds = { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
  const fitted = fitToBox(clean, 500, 24);
  // Misma transformación para los coches
  const size = 500;
  const pad = 24;
  const scale = (size - pad * 2) / Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY || 1);
  const offX = (size - (bounds.maxX - bounds.minX) * scale) / 2;
  const offY = (size - (bounds.maxY - bounds.minY) * scale) / 2;
  return {
    points: fitted.map((p) => `${p.x},${p.y}`).join(" "),
    fit: (p: { x: number; y: number }) => ({
      x: Math.round(((p.x - bounds.minX) * scale + offX) * 10) / 10,
      y: Math.round((size - ((p.y - bounds.minY) * scale + offY)) * 10) / 10,
    }),
  };
}
