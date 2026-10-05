import type { Race } from "./api/jolpica";

export type DriverSeasonStats = {
  points: number;
  wins: number;
  podiums: number;
  poles: number;
  dnfs: number;
  starts: number;
  avgGrid: number | null;
  avgFinish: number | null;
  bestFinish: number | null;
  gained: number;
};

const classified = (text: string) => /^\d+$/.test(text);

export function seasonStats(driverId: string, results: Race[], sprints: Race[]): DriverSeasonStats {
  let points = 0,
    wins = 0,
    podiums = 0,
    dnfs = 0,
    starts = 0,
    gained = 0;
  const grids: number[] = [];
  const finishes: number[] = [];
  for (const race of results) {
    const r = race.Results?.find((x) => x.Driver.driverId === driverId);
    if (!r) continue;
    starts++;
    points += Number(r.points) || 0;
    const pos = Number(r.position);
    if (classified(r.positionText)) {
      finishes.push(pos);
      if (pos === 1) wins++;
      if (pos <= 3) podiums++;
      const grid = Number(r.grid);
      if (grid > 0) gained += grid - pos;
    } else {
      dnfs++;
    }
    const grid = Number(r.grid);
    if (grid > 0) grids.push(grid);
  }
  for (const race of sprints) {
    const r = race.SprintResults?.find((x) => x.Driver.driverId === driverId);
    if (r) points += Number(r.points) || 0;
  }
  // Pole = salir primero: Jolpica solo tiene clasificaciones desde 1994 (con huecos hasta 2002) y la
  // parrilla coincide con las cifras oficiales de pole
  const poles = results.filter((race) => race.Results?.find((x) => x.Driver.driverId === driverId)?.grid === "1").length;
  const avg = (xs: number[]) => (xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : null);
  return {
    points,
    wins,
    podiums,
    poles,
    dnfs,
    starts,
    avgGrid: avg(grids),
    avgFinish: avg(finishes),
    bestFinish: finishes.length ? Math.min(...finishes) : null,
    gained,
  };
}

export type HeadToHead = { a: number; b: number };

/**
 * Quién terminó por delante en carrera y en clasificación cuando ambos participaron. Si falta la
 * clasificación de una ronda (antes de 1994 y con huecos hasta 2002) se compara la parrilla.
 */
export function headToHead(aId: string, bId: string, results: Race[], qualifying: Race[]) {
  const race: HeadToHead = { a: 0, b: 0 };
  const quali: HeadToHead = { a: 0, b: 0 };
  for (const r of results) {
    const a = r.Results?.find((x) => x.Driver.driverId === aId);
    const b = r.Results?.find((x) => x.Driver.driverId === bId);
    if (!a || !b) continue;
    // Resultado oficial: la posición final ya ordena también a los no clasificados
    if (Number(a.position) < Number(b.position)) race.a++;
    else race.b++;
  }
  const byRound = new Map<string, { quali?: Race; race?: Race }>();
  for (const q of qualifying) byRound.set(q.round, { quali: q });
  for (const r of results) byRound.set(r.round, { ...byRound.get(r.round), race: r });
  for (const { quali: q, race: r } of byRound.values()) {
    const qa = q?.QualifyingResults?.find((x) => x.Driver.driverId === aId);
    const qb = q?.QualifyingResults?.find((x) => x.Driver.driverId === bId);
    let pa = Number(qa?.position);
    let pb = Number(qb?.position);
    if (!qa || !qb) {
      pa = Number(r?.Results?.find((x) => x.Driver.driverId === aId)?.grid);
      pb = Number(r?.Results?.find((x) => x.Driver.driverId === bId)?.grid);
      // 0 = salió desde el pit lane: no dice nada de la clasificación
      if (!(pa > 0 && pb > 0)) continue;
    }
    if (pa < pb) quali.a++;
    else quali.b++;
  }
  return { race, quali };
}

/** Posición de cada piloto ronda a ronda (null si no corrió). */
export function roundByRound(ids: string[], results: Race[]) {
  return results.map((r) => ({
    round: Number(r.round),
    raceName: r.raceName,
    country: r.Circuit.Location.country,
    positions: ids.map((id) => {
      const res = r.Results?.find((x) => x.Driver.driverId === id);
      if (!res) return null;
      const ok = classified(res.positionText);
      const label = ok ? `P${res.positionText}` : ({ R: "DNF", D: "DSQ", W: "DNS", E: "EX", F: "DNQ" }[res.positionText] ?? "NC");
      // position (no positionText) ordena también a los no clasificados
      return { label, pos: Number(res.position), points: Number(res.points) || 0 };
    }),
  }));
}
