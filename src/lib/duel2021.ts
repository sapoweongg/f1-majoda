import "server-only";
import { getSeasonResults, getSeasonSprints, type Race } from "./api/jolpica";
import { isPole } from "./poles";

// Datos del duelo Verstappen–Hamilton de 2021, compartidos por las dos páginas especiales.

export const VER = "max_verstappen";
export const HAM = "hamilton";

export type DuelSide = {
  grid: number;
  /** Posición final si quedó clasificado; null si abandonó o no terminó. */
  position: number | null;
  positionText: string;
  pole: boolean;
  fastestLap: boolean;
  sprintWin: boolean;
  /** Puntos de la carrera y el sprint de esa ronda. */
  points: number;
  /** Puntos acumulados tras la ronda. */
  total: number;
};

export type DuelRound = {
  round: number;
  raceName: string;
  circuitId: string;
  country: string;
  /** Código del ganador de la carrera (VER, HAM, PER…). */
  winner: string;
  ver: DuelSide;
  ham: DuelSide;
  /** Puntos de ventaja de Max sobre Hamilton tras la ronda (negativo: manda Hamilton). */
  gap: number;
};

export type DuelTotals = {
  wins: number;
  podiums: number;
  poles: number;
  fastestLaps: number;
  sprintWins: number;
  points: number;
  /** Rondas tras las que lideraba el campeonato (sin contar empates). */
  leadRounds: number;
};

export function buildDuel(results: Race[], sprints: Race[]) {
  const totals = { [VER]: 0, [HAM]: 0 };
  const rounds: DuelRound[] = [];
  for (const race of [...results].sort((a, b) => Number(a.round) - Number(b.round))) {
    const sprint = sprints.find((s) => s.round === race.round);
    const side = (id: typeof VER | typeof HAM): DuelSide => {
      const r = race.Results?.find((x) => x.Driver.driverId === id);
      const s = sprint?.SprintResults?.find((x) => x.Driver.driverId === id);
      const points = (Number(r?.points) || 0) + (Number(s?.points) || 0);
      totals[id] += points;
      const classified = r ? /^\d+$/.test(r.positionText) : false;
      return {
        grid: Number(r?.grid ?? 0),
        position: classified ? Number(r!.position) : null,
        positionText: r?.positionText ?? "—",
        pole: isPole(race, id),
        fastestLap: r?.FastestLap?.rank === "1",
        sprintWin: s?.position === "1",
        points,
        total: totals[id],
      };
    };
    const ver = side(VER);
    const ham = side(HAM);
    rounds.push({
      round: Number(race.round),
      raceName: race.raceName,
      circuitId: race.Circuit.circuitId,
      country: race.Circuit.Location.country,
      winner: race.Results?.find((x) => x.position === "1")?.Driver.code ?? "",
      ver,
      ham,
      gap: ver.total - ham.total,
    });
  }

  const sum = (pick: (r: DuelRound) => DuelSide, sign: 1 | -1): DuelTotals => {
    const sides = rounds.map(pick);
    return {
      wins: sides.filter((s) => s.position === 1).length,
      podiums: sides.filter((s) => s.position !== null && s.position <= 3).length,
      poles: sides.filter((s) => s.pole).length,
      fastestLaps: sides.filter((s) => s.fastestLap).length,
      sprintWins: sides.filter((s) => s.sprintWin).length,
      points: sides.at(-1)?.total ?? 0,
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

  return { rounds, ver: sum((r) => r.ver, 1), ham: sum((r) => r.ham, -1), leadChanges };
}

export type Duel2021 = ReturnType<typeof buildDuel>;

export async function getDuel2021(): Promise<Duel2021> {
  const [results, sprints] = await Promise.all([getSeasonResults(2021), getSeasonSprints(2021)]);
  return buildDuel(results, sprints);
}
