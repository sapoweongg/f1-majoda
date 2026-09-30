import "server-only";
import type { Driver, Race } from "./api/jolpica";
import { getSessions, type OFDriver, type Session } from "./api/openf1";

/** OpenF1 solo tiene datos desde 2023. */
export const OPENF1_FIRST_SEASON = 2023;

export function raceStart(race: Pick<Race, "date" | "time">) {
  return new Date(`${race.date}T${race.time ?? "12:00:00Z"}`);
}

export type WeekendSessions = {
  meetingKey: number;
  race?: Session;
  qualifying?: Session;
  sprint?: Session;
  sprintQualifying?: Session;
  all: Session[];
};

/** Busca en OpenF1 las sesiones del mismo fin de semana que una carrera de Jolpica. */
export async function findWeekendSessions(race: Race): Promise<WeekendSessions | null> {
  const season = Number(race.season);
  if (season < OPENF1_FIRST_SEASON) return null;
  let sessions: Session[];
  try {
    sessions = await getSessions({ year: season });
  } catch {
    return null;
  }
  const start = raceStart(race).getTime();
  // La sesión "Race" que empieza a menos de 36 h de la hora de Jolpica
  const raceSession = sessions
    .filter((s) => s.session_type === "Race" && s.session_name === "Race")
    .map((s) => ({ s, diff: Math.abs(new Date(s.date_start).getTime() - start) }))
    .sort((a, b) => a.diff - b.diff)
    .find((x) => x.diff < 36 * 3600 * 1000)?.s;
  if (!raceSession) return null;
  const all = sessions
    .filter((s) => s.meeting_key === raceSession.meeting_key)
    .sort((a, b) => a.date_start.localeCompare(b.date_start));
  const byName = (name: string) => all.find((s) => s.session_name === name);
  return {
    meetingKey: raceSession.meeting_key,
    race: raceSession,
    qualifying: byName("Qualifying"),
    sprint: byName("Sprint"),
    sprintQualifying: byName("Sprint Qualifying") ?? byName("Sprint Shootout"),
    all,
  };
}

/** Relaciona un piloto de OpenF1 con uno de Jolpica: dorsal de esa carrera, siglas o apellido. */
export function matchDriver(
  of: Pick<OFDriver, "driver_number" | "name_acronym" | "last_name">,
  candidates: { driver: Driver; number?: string }[],
) {
  return (
    candidates.find((c) => c.number && Number(c.number) === of.driver_number) ??
    candidates.find((c) => c.driver.code && c.driver.code === of.name_acronym) ??
    candidates.find((c) => c.driver.familyName.toLowerCase() === of.last_name?.toLowerCase())
  )?.driver;
}
