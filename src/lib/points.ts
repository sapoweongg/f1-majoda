// Sistema de puntos vigente (desde 2025 ya no hay punto extra por vuelta rápida).
export const RACE_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1] as const;
export const SPRINT_POINTS = [8, 7, 6, 5, 4, 3, 2, 1] as const;

export const MAX_RACE = RACE_POINTS[0];
export const MAX_SPRINT = SPRINT_POINTS[0];
/** Lo máximo que puede sumar un equipo: sus dos coches primero y segundo. */
export const MAX_RACE_TEAM = RACE_POINTS[0] + RACE_POINTS[1];
export const MAX_SPRINT_TEAM = SPRINT_POINTS[0] + SPRINT_POINTS[1];

export function racePoints(position: number) {
  return RACE_POINTS[position - 1] ?? 0;
}

export function sprintPoints(position: number) {
  return SPRINT_POINTS[position - 1] ?? 0;
}
