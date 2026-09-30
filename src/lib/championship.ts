import type { Race } from "./api/jolpica";
import { MAX_RACE, MAX_RACE_TEAM, MAX_SPRINT, MAX_SPRINT_TEAM } from "./points";

export type Kind = "driver" | "constructor";

export type ProgressRow = {
  id: string;
  name: string;
  /** constructorId para el color (el más reciente en el caso de pilotos). */
  teamId: string;
  code?: string;
  /** Puntos acumulados tras cada ronda (mismo orden que `rounds`). */
  cumulative: number[];
  total: number;
};

export type Progression = {
  rounds: { round: number; raceName: string; country: string }[];
  rows: ProgressRow[];
};

/**
 * Puntos acumulados ronda a ronda a partir de resultados de carrera y sprint.
 * Nota: en temporadas antiguas con descarte de resultados la suma puede superar la oficial.
 */
export function buildProgression(results: Race[], sprints: Race[], kind: Kind): Progression {
  const rounds = results
    .filter((r) => r.Results?.length)
    .map((r) => ({ round: Number(r.round), raceName: r.raceName, country: r.Circuit.Location.country }));
  const index = new Map(rounds.map((r, i) => [r.round, i]));
  const rows = new Map<string, ProgressRow & { gained: number[] }>();

  const add = (race: Race, list: Race["Results"]) => {
    const i = index.get(Number(race.round));
    if (i === undefined || !list) return;
    for (const res of list) {
      const id = kind === "driver" ? res.Driver.driverId : res.Constructor.constructorId;
      let row = rows.get(id);
      if (!row) {
        row = {
          id,
          name: kind === "driver" ? `${res.Driver.givenName} ${res.Driver.familyName}` : res.Constructor.name,
          teamId: res.Constructor.constructorId,
          code: kind === "driver" ? res.Driver.code : undefined,
          cumulative: [],
          total: 0,
          gained: new Array(rounds.length).fill(0),
        };
        rows.set(id, row);
      }
      row.gained[i] += Number(res.points) || 0;
      // El color sigue al último equipo con el que corrió
      if (kind === "driver") row.teamId = res.Constructor.constructorId;
    }
  };

  for (const race of results) add(race, race.Results);
  for (const race of sprints) add(race, race.SprintResults);

  const out: ProgressRow[] = [];
  for (const { gained, ...row } of rows.values()) {
    let sum = 0;
    row.cumulative = gained.map((g) => (sum += g));
    row.total = sum;
    out.push(row);
  }
  out.sort((a, b) => b.total - a.total);
  return { rounds, rows: out };
}

export type Remaining = { races: number; sprints: number };

/** Carreras y sprints que faltan después de la última ronda con clasificación publicada. */
export function remainingEvents(schedule: Race[], lastRound: number): Remaining {
  const left = schedule.filter((r) => Number(r.round) > lastRound);
  return { races: left.length, sprints: left.filter((r) => r.Sprint).length };
}

export function maxRemainingPoints(remaining: Remaining, kind: Kind) {
  return kind === "driver"
    ? remaining.races * MAX_RACE + remaining.sprints * MAX_SPRINT
    : remaining.races * MAX_RACE_TEAM + remaining.sprints * MAX_SPRINT_TEAM;
}

export type ContentionStatus = "champion" | "leader" | "contender" | "eliminated";

export type Contention = {
  id: string;
  points: number;
  gap: number;
  maxPossible: number;
  status: ContentionStatus;
  /** Para el líder: ventaja extra que necesita para asegurar el título. */
  toClinch?: number;
};

/**
 * Quién puede ganar todavía. Un empate a puntos se decide por desempate (victorias),
 * así que igualar al líder cuenta como "todavía puede".
 */
export function titleContention(
  standings: { id: string; points: number }[],
  remaining: Remaining,
  kind: Kind,
): Contention[] {
  const max = maxRemainingPoints(remaining, kind);
  const sorted = [...standings].sort((a, b) => b.points - a.points);
  const leader = sorted[0];
  if (!leader) return [];
  const second = sorted[1];
  const lead = second ? leader.points - second.points : Infinity;
  const clinched = lead > max;

  return sorted.map((s, i) => {
    const gap = leader.points - s.points;
    const maxPossible = s.points + max;
    if (i === 0) {
      return {
        id: s.id,
        points: s.points,
        gap: 0,
        maxPossible,
        status: clinched ? "champion" : "leader",
        toClinch: clinched ? 0 : max - lead + 1,
      };
    }
    return {
      id: s.id,
      points: s.points,
      gap,
      maxPossible,
      status: maxPossible >= leader.points && !clinched ? "contender" : "eliminated",
    };
  });
}
