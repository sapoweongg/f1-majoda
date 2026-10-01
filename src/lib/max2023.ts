import "server-only";
import {
  getDriverStandings,
  getSeasonResults,
  getSeasonSprints,
  type Race,
} from "./api/jolpica";
import { buildProgression } from "./championship";

const MAX = "max_verstappen";
const SEASON = 2023;

export type RaceRow = {
  round: number;
  raceName: string;
  circuitId: string;
  country: string;
  grid: number;
  position: number | null;
  positionText: string;
  sprintWin: boolean;
  pole: boolean;
  fastestLap: boolean;
};

/** Racha más larga de victorias consecutivas y sus rondas. */
export function longestStreak<T extends Pick<RaceRow, "position">>(rows: T[]): T[] {
  let best: T[] = [];
  let current: T[] = [];
  for (const r of rows) {
    if (r.position === 1) {
      current = [...current, r];
      if (current.length > best.length) best = current;
    } else {
      current = [];
    }
  }
  return best;
}

export async function getMax2023() {
  const [results, sprints, standings] = await Promise.all([
    getSeasonResults(SEASON),
    getSeasonSprints(SEASON),
    getDriverStandings(SEASON),
  ]);

  const sprintWinners = new Set(
    sprints.filter((s) => s.SprintResults?.[0]?.Driver.driverId === MAX).map((s) => s.round),
  );

  const rows: RaceRow[] = results
    .map((race: Race) => {
      const r = race.Results?.find((x) => x.Driver.driverId === MAX);
      if (!r) return null;
      const classified = /^\d+$/.test(r.positionText);
      return {
        round: Number(race.round),
        raceName: race.raceName,
        circuitId: race.Circuit.circuitId,
        country: race.Circuit.Location.country,
        grid: Number(r.grid),
        position: classified ? Number(r.position) : null,
        positionText: r.positionText,
        sprintWin: sprintWinners.has(race.round),
        // salió desde la pole (en Bélgica fue el más rápido pero una penalización lo mandó al 6.º)
        pole: Number(r.grid) === 1,
        fastestLap: r.FastestLap?.rank === "1",
      };
    })
    .filter((x): x is RaceRow => x !== null);

  const wins = rows.filter((r) => r.position === 1).length;
  const podiums = rows.filter((r) => r.position !== null && r.position <= 3).length;
  const teamWins = results.filter((r) => r.Results?.[0]?.Constructor.constructorId === "red_bull").length;
  const maxStanding = standings.standings.find((s) => s.Driver.driverId === MAX);
  const second = standings.standings.find((s) => s.Driver.driverId !== MAX);
  const points = Number(maxStanding?.points ?? 0);
  const streak = longestStreak(rows);

  const progression = buildProgression(results, sprints, "driver");

  return {
    rows,
    races: rows.length,
    totalRaces: results.length,
    wins,
    podiums,
    poles: rows.filter((r) => r.pole).length,
    fastestLaps: rows.filter((r) => r.fastestLap).length,
    sprintWins: sprintWinners.size,
    points,
    margin: second ? points - Number(second.points) : 0,
    winRate: rows.length ? (wins / rows.length) * 100 : 0,
    teamWins,
    streak,
    progression,
  };
}
