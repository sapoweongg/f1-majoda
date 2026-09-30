import "server-only";
import data from "@/data/circuits.json";

// Trazados: julesr0y/f1-circuits-svg (CC-BY-4.0), cruzados con los circuitId de Jolpica
// por scripts/build-circuits.mjs. Cada SVG usa un lienzo de 500×500.
export const TRACK_VIEWBOX = 500;

export type TrackShape = { d: string; start?: string; arrow?: string; rotate?: number; layoutId: string };

type CircuitEntry = {
  svgId: string;
  name: string;
  locality: string;
  country: string;
  lat: number;
  lng: number;
  layouts: { id: string; seasons: number[]; rotate?: number }[];
};

const circuits = data.circuits as unknown as Record<string, CircuitEntry>;
const layouts = data.layouts as unknown as Record<string, { d: string; start?: string; arrow?: string }>;

export function circuitInfo(circuitId: string): CircuitEntry | undefined {
  return circuits[circuitId];
}

/** Trazado usado en una temporada concreta (o el más reciente si no hay dato para ese año). */
export function trackShape(circuitId: string, season?: number): TrackShape | undefined {
  const c = circuits[circuitId];
  if (!c) return undefined;
  const byRecent = [...c.layouts].sort((a, b) => b.seasons[0] - a.seasons[0]);
  const layout =
    (season ? c.layouts.find((l) => l.seasons.includes(season)) : undefined) ??
    // si ese año no aparece, el trazado anterior más cercano en el tiempo
    (season ? byRecent.find((l) => l.seasons[0] <= season) : undefined) ??
    byRecent[0];
  const shape = layouts[layout.id];
  if (!shape) return undefined;
  return { ...shape, rotate: layout.rotate, layoutId: layout.id };
}

// Datos del trazado actual (longitud km, vueltas de carrera, curvas).
const FACTS: Record<string, { km: number; laps: number; turns: number }> = {
  albert_park: { km: 5.278, laps: 58, turns: 14 },
  shanghai: { km: 5.451, laps: 56, turns: 16 },
  suzuka: { km: 5.807, laps: 53, turns: 18 },
  miami: { km: 5.412, laps: 57, turns: 19 },
  villeneuve: { km: 4.361, laps: 70, turns: 14 },
  monaco: { km: 3.337, laps: 78, turns: 19 },
  catalunya: { km: 4.657, laps: 66, turns: 14 },
  red_bull_ring: { km: 4.318, laps: 71, turns: 10 },
  silverstone: { km: 5.891, laps: 52, turns: 18 },
  spa: { km: 7.004, laps: 44, turns: 19 },
  hungaroring: { km: 4.381, laps: 70, turns: 14 },
  zandvoort: { km: 4.259, laps: 72, turns: 14 },
  monza: { km: 5.793, laps: 53, turns: 11 },
  madring: { km: 5.474, laps: 57, turns: 22 },
  baku: { km: 6.003, laps: 51, turns: 20 },
  sepang: { km: 5.543, laps: 56, turns: 15 },
  marina_bay: { km: 4.94, laps: 62, turns: 19 },
  americas: { km: 5.513, laps: 56, turns: 20 },
  rodriguez: { km: 4.304, laps: 71, turns: 17 },
  interlagos: { km: 4.309, laps: 71, turns: 15 },
  vegas: { km: 6.201, laps: 50, turns: 17 },
  losail: { km: 5.419, laps: 57, turns: 16 },
  yas_marina: { km: 5.281, laps: 58, turns: 16 },
  bahrain: { km: 5.412, laps: 57, turns: 15 },
  jeddah: { km: 6.174, laps: 50, turns: 27 },
  imola: { km: 4.909, laps: 63, turns: 19 },
};

export function circuitFacts(circuitId: string) {
  const f = FACTS[circuitId];
  return f ? { ...f, distance: Math.round(f.km * f.laps * 10) / 10 } : undefined;
}
