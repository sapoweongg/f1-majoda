import { describe, expect, it } from "vitest";
import type { CarData } from "@/lib/api/openf1";
import { buildTrace, compareLaps, fitToBox, interpolate, miniSectorWinners } from "@/lib/telemetry";

const start = "2026-09-26T12:00:00.000Z";

/** Vuelta sintética: `speed(t)` km/h muestreada cada 0.25 s durante `seconds`. */
function lap(seconds: number, speed: (t: number) => number): CarData[] {
  const out: CarData[] = [];
  for (let t = 0; t <= seconds + 1e-9; t += 0.25) {
    out.push({
      date: new Date(new Date(start).getTime() + t * 1000).toISOString(),
      driver_number: 1,
      speed: speed(t),
      throttle: 100,
      brake: 0,
      n_gear: 8,
      rpm: 11000,
      drs: 0,
    });
  }
  return out;
}

describe("buildTrace", () => {
  it("integra la velocidad para obtener la distancia", () => {
    const trace = buildTrace(lap(10, () => 180), start);
    // 180 km/h = 50 m/s durante 10 s
    expect(trace.at(-1)!.d).toBeCloseTo(500, 5);
    expect(trace[0].t).toBe(0);
  });
});

describe("compareLaps", () => {
  it("delta positivo cuando A es más rápido", () => {
    const a = buildTrace(lap(10, () => 200), start);
    const b = buildTrace(lap(11, () => 200 * (10 / 11)), start);
    const cmp = compareLaps(a, b, 100);
    expect(cmp).toHaveLength(101);
    expect(cmp.at(-1)!.delta).toBeCloseTo(1, 1);
    expect(cmp[50].delta).toBeGreaterThan(0);
  });

  it("devuelve vacío si falta una vuelta", () => {
    expect(compareLaps([], buildTrace(lap(5, () => 100), start))).toEqual([]);
  });
});

describe("miniSectorWinners", () => {
  it("asigna cada tramo al más rápido", () => {
    // A rápido en la primera mitad de la distancia, B en la segunda
    const a = buildTrace(lap(10, (t) => (t < 4 ? 250 : 150)), start);
    const b = buildTrace(lap(10, (t) => (t < 6 ? 150 : 250)), start);
    const w = miniSectorWinners(a, b, 4);
    expect(w[0]).toBe("a");
    expect(w[3]).toBe("b");
  });
});

describe("interpolate / fitToBox", () => {
  it("interpola linealmente", () => {
    const rows = [
      { x: 0, y: 0 },
      { x: 10, y: 100 },
    ];
    expect(interpolate(rows, "x", 2.5, "y")).toBe(25);
    expect(interpolate(rows, "x", -5, "y")).toBe(0);
    expect(interpolate(rows, "x", 50, "y")).toBe(100);
  });

  it("encaja puntos en el lienzo manteniendo la proporción", () => {
    const pts = fitToBox(
      [
        { x: 0, y: 0 },
        { x: 1000, y: 500 },
      ],
      500,
      0,
    );
    expect(pts[0].x).toBe(0);
    expect(pts[1].x).toBe(500);
    // el eje y se invierte (en OpenF1 crece hacia arriba)
    expect(pts[1].y).toBeLessThan(pts[0].y);
  });
});
