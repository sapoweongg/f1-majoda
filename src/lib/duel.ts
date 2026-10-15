import "server-only";
import { getSeasonResults, getSeasonSprints, type Race } from "./api/jolpica";
import { isPole } from "./poles";

// Duelo de dos pilotos en una temporada, carrera a carrera, para las páginas especiales
// (Verstappen–Hamilton 2021, Senna–Prost 1989…). El piloto A va primero: la ventaja es A − B.

export type DuelSide = {
  grid: number;
  /** Posición final si quedó clasificado; null si abandonó o no terminó. */
  position: number | null;
  positionText: string;
  pole: boolean;
  fastestLap: boolean;
  sprintWin: boolean;
  /** Salida y llegada en el sprint, si esa ronda lo tuvo. */
  sprint?: { grid: number; position: number | null };
  /** Puntos de la carrera y el sprint de esa ronda. */
  points: number;
  /** Puntos que cuentan para el campeonato tras la ronda (con descartes si los hay). */
  total: number;
};

export type DuelRound = {
  round: number;
  raceName: string;
  circuitId: string;
  country: string;
  /** Código del ganador de la carrera (VER, HAM…) o su apellido si no tiene código (años antiguos). */
  winner: string;
  a: DuelSide;
  b: DuelSide;
  /** Puntos de ventaja de A sobre B tras la ronda (negativo: manda B). */
  gap: number;
};

export type DuelTotals = {
  wins: number;
  podiums: number;
  poles: number;
  fastestLaps: number;
  sprintWins: number;
  /** Puntos que cuentan al final (con descartes si los hay). */
  points: number;
  /** Todos los puntos sumados, sin descartes. */
  gross: number;
  /** Rondas tras las que lideraba el campeonato (sin contar empates). */
  leadRounds: number;
};

export type DuelOptions = {
  /** Solo cuentan los N mejores resultados (p. ej. 11 de 16 en 1989). */
  bestOf?: number;
};

/** Suma de los N mejores resultados (o de todos si no hay descartes). */
function counted(scores: number[], bestOf?: number) {
  const kept = bestOf ? [...scores].sort((x, y) => y - x).slice(0, bestOf) : scores;
  return kept.reduce((s, x) => s + x, 0);
}

export function buildDuel(results: Race[], sprints: Race[], aId: string, bId: string, opts: DuelOptions = {}) {
  const scores: Record<"a" | "b", number[]> = { a: [], b: [] };
  const rounds: DuelRound[] = [];
  for (const race of [...results].sort((x, y) => Number(x.round) - Number(y.round))) {
    const sprint = sprints.find((s) => s.round === race.round);
    const side = (key: "a" | "b", id: string): DuelSide => {
      const r = race.Results?.find((x) => x.Driver.driverId === id);
      const s = sprint?.SprintResults?.find((x) => x.Driver.driverId === id);
      const points = (Number(r?.points) || 0) + (Number(s?.points) || 0);
      scores[key].push(points);
      const classified = r ? /^\d+$/.test(r.positionText) : false;
      return {
        grid: Number(r?.grid ?? 0),
        position: classified ? Number(r!.position) : null,
        positionText: r?.positionText ?? "—",
        pole: isPole(race, id),
        fastestLap: r?.FastestLap?.rank === "1",
        sprintWin: s?.position === "1",
        sprint: s ? { grid: Number(s.grid), position: /^\d+$/.test(s.positionText) ? Number(s.position) : null } : undefined,
        points,
        total: counted(scores[key], opts.bestOf),
      };
    };
    const a = side("a", aId);
    const b = side("b", bId);
    const winner = race.Results?.find((x) => x.position === "1")?.Driver;
    rounds.push({
      round: Number(race.round),
      raceName: race.raceName,
      circuitId: race.Circuit.circuitId,
      country: race.Circuit.Location.country,
      winner: winner?.code ?? winner?.familyName ?? "",
      a,
      b,
      gap: a.total - b.total,
    });
  }

  const sum = (key: "a" | "b", sign: 1 | -1): DuelTotals => {
    const sides = rounds.map((r) => r[key]);
    return {
      wins: sides.filter((s) => s.position === 1).length,
      podiums: sides.filter((s) => s.position !== null && s.position <= 3).length,
      poles: sides.filter((s) => s.pole).length,
      fastestLaps: sides.filter((s) => s.fastestLap).length,
      sprintWins: sides.filter((s) => s.sprintWin).length,
      points: sides.at(-1)?.total ?? 0,
      gross: scores[key].reduce((s, x) => s + x, 0),
      leadRounds: rounds.filter((r) => r.gap * sign > 0).length,
    };
  };

  // Cambios de líder: cada vez que la ventaja cambia de signo (los empates no cuentan como cambio)
  let leadChanges = 0;
  let last = 0;
  for (const r of rounds) {
    const sign = Math.sign(r.gap);
    if (sign && last && sign !== last) leadChanges++;
    if (sign) last = sign;
  }

  return { rounds, a: sum("a", 1), b: sum("b", -1), leadChanges };
}

export type Duel = ReturnType<typeof buildDuel>;

export async function getDuel(season: number, aId: string, bId: string, opts: DuelOptions = {}): Promise<Duel> {
  const [results, sprints] = await Promise.all([getSeasonResults(season), getSeasonSprints(season)]);
  return buildDuel(results, sprints, aId, bId, opts);
}
