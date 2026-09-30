import type { CarData, Location } from "./api/openf1";

export type Sample = {
  /** segundos desde el inicio de la vuelta */
  t: number;
  /** metros recorridos */
  d: number;
  speed: number;
  throttle: number;
  brake: number;
  gear: number;
};

/**
 * OpenF1 no da distancia: la calculamos integrando la velocidad (km/h → m/s) por el tiempo
 * con la regla del trapecio.
 */
export function buildTrace(car: CarData[], lapStartIso: string): Sample[] {
  const t0 = new Date(lapStartIso).getTime();
  const sorted = [...car].sort((a, b) => a.date.localeCompare(b.date));
  const out: Sample[] = [];
  let d = 0;
  for (let i = 0; i < sorted.length; i++) {
    const c = sorted[i];
    const t = (new Date(c.date).getTime() - t0) / 1000;
    if (i > 0) {
      const prev = out[out.length - 1];
      const dt = t - prev.t;
      d += (((prev.speed + c.speed) / 2) * dt) / 3.6;
    }
    out.push({ t, d, speed: c.speed, throttle: c.throttle, brake: c.brake > 0 ? 100 : 0, gear: c.n_gear });
  }
  return out;
}

function lerp(a: number, b: number, f: number) {
  return a + (b - a) * f;
}

/** Valor interpolado de `key` cuando `by` vale `x` (la serie debe ser creciente en `by`). */
export function interpolate<T extends Record<string, number>>(rows: T[], by: keyof T, x: number, key: keyof T): number {
  if (!rows.length) return NaN;
  if (x <= rows[0][by]) return rows[0][key];
  let lo = 0;
  let hi = rows.length - 1;
  if (x >= rows[hi][by]) return rows[hi][key];
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (rows[mid][by] <= x) lo = mid;
    else hi = mid;
  }
  const span = rows[hi][by] - rows[lo][by];
  const f = span === 0 ? 0 : (x - rows[lo][by]) / span;
  return lerp(rows[lo][key], rows[hi][key], f);
}

export type ComparedPoint = {
  /** distancia en metros sobre la longitud común */
  d: number;
  aSpeed: number;
  bSpeed: number;
  aThrottle: number;
  bThrottle: number;
  aBrake: number;
  bBrake: number;
  aGear: number;
  bGear: number;
  /** tiempo de B menos tiempo de A: positivo = A va por delante */
  delta: number;
};

/**
 * Lleva las dos vueltas a una escala de distancia común (cada una normalizada a su propio total,
 * que difiere unos metros por la integración) y las remuestrea en `n` puntos.
 */
export function compareLaps(a: Sample[], b: Sample[], n = 400): ComparedPoint[] {
  if (a.length < 2 || b.length < 2) return [];
  const totalA = a[a.length - 1].d;
  const totalB = b[b.length - 1].d;
  const length = (totalA + totalB) / 2;
  const na = a.map((s) => ({ ...s, f: s.d / totalA }));
  const nb = b.map((s) => ({ ...s, f: s.d / totalB }));
  const out: ComparedPoint[] = [];
  for (let i = 0; i <= n; i++) {
    const f = i / n;
    const ta = interpolate(na, "f", f, "t");
    const tb = interpolate(nb, "f", f, "t");
    out.push({
      d: Math.round(f * length),
      aSpeed: Math.round(interpolate(na, "f", f, "speed")),
      bSpeed: Math.round(interpolate(nb, "f", f, "speed")),
      aThrottle: Math.round(interpolate(na, "f", f, "throttle")),
      bThrottle: Math.round(interpolate(nb, "f", f, "throttle")),
      aBrake: interpolate(na, "f", f, "brake") > 50 ? 100 : 0,
      bBrake: interpolate(nb, "f", f, "brake") > 50 ? 100 : 0,
      aGear: Math.round(interpolate(na, "f", f, "gear")),
      bGear: Math.round(interpolate(nb, "f", f, "gear")),
      delta: Math.round((tb - ta) * 1000) / 1000,
    });
  }
  return out;
}

/** Para cada mini-sector, quién fue más rápido ("a" o "b"). */
export function miniSectorWinners(a: Sample[], b: Sample[], count = 25): ("a" | "b")[] {
  if (a.length < 2 || b.length < 2) return [];
  const totalA = a[a.length - 1].d;
  const totalB = b[b.length - 1].d;
  const na = a.map((s) => ({ ...s, f: s.d / totalA }));
  const nb = b.map((s) => ({ ...s, f: s.d / totalB }));
  const winners: ("a" | "b")[] = [];
  for (let i = 0; i < count; i++) {
    const f0 = i / count;
    const f1 = (i + 1) / count;
    const da = interpolate(na, "f", f1, "t") - interpolate(na, "f", f0, "t");
    const db = interpolate(nb, "f", f1, "t") - interpolate(nb, "f", f0, "t");
    winners.push(da <= db ? "a" : "b");
  }
  return winners;
}

export type TrackPoint = { x: number; y: number; f: number };

/** Posiciones del coche en la vuelta con la fracción de vuelta recorrida en cada punto. */
export function trackWithFraction(locations: Location[], trace: Sample[], lapStartIso: string): TrackPoint[] {
  if (!trace.length) return [];
  const t0 = new Date(lapStartIso).getTime();
  const total = trace[trace.length - 1].d;
  return [...locations]
    .sort((a, b) => a.date.localeCompare(b.date))
    .filter((p) => p.x !== 0 || p.y !== 0)
    .map((p) => {
      const t = (new Date(p.date).getTime() - t0) / 1000;
      return { x: p.x, y: p.y, f: Math.min(1, Math.max(0, interpolate(trace, "t", t, "d") / total)) };
    });
}

/** Encaja puntos x/y en un lienzo cuadrado (el eje y de OpenF1 crece hacia arriba). */
export function fitToBox<T extends { x: number; y: number }>(points: T[], size: number, pad = 20) {
  if (!points.length) return [];
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const scale = (size - pad * 2) / Math.max(maxX - minX, maxY - minY || 1);
  const offX = (size - (maxX - minX) * scale) / 2;
  const offY = (size - (maxY - minY) * scale) / 2;
  return points.map((p) => ({
    ...p,
    x: Math.round(((p.x - minX) * scale + offX) * 10) / 10,
    y: Math.round((size - ((p.y - minY) * scale + offY)) * 10) / 10,
  }));
}
