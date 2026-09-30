import "server-only";
import type { ConstructorStanding, DriverStanding, Race } from "./api/jolpica";
import type { Progression } from "./championship";
import { nationalityToIso } from "./countries";
import { carImage, teamLogo } from "./media";
import { raceStart } from "./mapping";
import type { Photo } from "./photos";
import { teamStyle } from "./teams";
import type { DriverCardData } from "@/components/cards/DriverCard";
import type { TeamCardData } from "@/components/cards/TeamCard";
import type { Series } from "@/components/charts/LineSeriesChart";

export function driverCard(s: DriverStanding, season: number, photos: Record<string, Photo>): DriverCardData {
  const team = s.Constructors.at(-1);
  const style = teamStyle(team?.constructorId);
  return {
    driverId: s.Driver.driverId,
    givenName: s.Driver.givenName,
    familyName: s.Driver.familyName,
    number: s.Driver.permanentNumber,
    teamName: team?.name ?? "",
    color: style.color,
    accent: style.accent,
    logo: team ? teamLogo(team.constructorId, season) : null,
    points: s.points,
    position: s.position ?? s.positionText,
    iso: nationalityToIso(s.Driver.nationality),
    photo: photos[s.Driver.driverId],
  };
}

export function teamCard(
  s: ConstructorStanding,
  season: number,
  drivers: DriverStanding[],
  photos: Record<string, Photo>,
): TeamCardData {
  const id = s.Constructor.constructorId;
  const style = teamStyle(id);
  return {
    constructorId: id,
    name: s.Constructor.name,
    color: style.color,
    accent: style.accent,
    car: carImage(id, season),
    logo: teamLogo(id, season),
    points: s.points,
    position: s.position ?? s.positionText,
    drivers: drivers
      .filter((d) => d.Constructors.at(-1)?.constructorId === id)
      .slice(0, 2)
      .map((d) => ({ name: `${d.Driver.givenName} ${d.Driver.familyName}`, photo: photos[d.Driver.driverId] })),
  };
}

/** Series para el gráfico de puntos: el segundo piloto de cada equipo va en discontinua. */
export function progressionSeries(prog: Progression, ids?: string[]): Series[] {
  const rows = ids ? prog.rows.filter((r) => ids.includes(r.id)) : prog.rows;
  const seenTeams = new Set<string>();
  return rows.map((r) => {
    const dashed = seenTeams.has(r.teamId);
    seenTeams.add(r.teamId);
    return {
      id: r.id,
      label: r.code ?? r.name,
      color: teamStyle(r.teamId).color,
      dashed,
      values: r.cumulative,
    };
  });
}

export type NextSession = { key: string; iso: string };

const SESSION_KEYS = [
  "FirstPractice",
  "SecondPractice",
  "ThirdPractice",
  "SprintQualifying",
  "SprintShootout",
  "Sprint",
  "Qualifying",
] as const;

/** Sesiones del fin de semana en orden cronológico (incluida la carrera). */
export function weekendSessions(race: Race): NextSession[] {
  const list: NextSession[] = [];
  for (const key of SESSION_KEYS) {
    const s = race[key];
    if (s) list.push({ key, iso: `${s.date}T${s.time ?? "00:00:00Z"}` });
  }
  list.push({ key: "Race", iso: raceStart(race).toISOString() });
  return list.sort((a, b) => a.iso.localeCompare(b.iso));
}

/** Próxima carrera (la primera cuya salida aún no ha ocurrido hace más de 3 h). */
export function nextRace(schedule: Race[], now = new Date()) {
  return schedule.find((r) => raceStart(r).getTime() + 3 * 3600 * 1000 > now.getTime());
}

export function lastRace(schedule: Race[], now = new Date()) {
  return [...schedule].reverse().find((r) => raceStart(r).getTime() + 2 * 3600 * 1000 < now.getTime());
}
