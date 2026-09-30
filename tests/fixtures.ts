import type { Race, Result } from "@/lib/api/jolpica";

const drivers = {
  ant: { driverId: "antonelli", givenName: "Andrea Kimi", familyName: "Antonelli", code: "ANT", permanentNumber: "12" },
  rus: { driverId: "russell", givenName: "George", familyName: "Russell", code: "RUS", permanentNumber: "63" },
  ham: { driverId: "hamilton", givenName: "Lewis", familyName: "Hamilton", code: "HAM", permanentNumber: "44" },
};
const teams = {
  mercedes: { constructorId: "mercedes", name: "Mercedes" },
  ferrari: { constructorId: "ferrari", name: "Ferrari" },
};

function result(d: keyof typeof drivers, team: keyof typeof teams, pos: number, points: number, grid = pos, text?: string): Result {
  return {
    number: drivers[d].permanentNumber,
    position: String(pos),
    positionText: text ?? String(pos),
    points: String(points),
    Driver: drivers[d],
    Constructor: teams[team],
    grid: String(grid),
    laps: "50",
    status: text ? "Retired" : "Finished",
  };
}

function race(round: number, results: Result[], extra: Partial<Race> = {}): Race {
  return {
    season: "2026",
    round: String(round),
    raceName: `GP ${round}`,
    date: `2026-03-0${round}`,
    time: "12:00:00Z",
    Circuit: {
      circuitId: "monza",
      circuitName: "Monza",
      Location: { lat: "45.6", long: "9.28", locality: "Monza", country: "Italy" },
    },
    Results: results,
    ...extra,
  };
}

export const results: Race[] = [
  race(1, [result("ant", "mercedes", 1, 25, 2), result("ham", "ferrari", 2, 18, 1), result("rus", "mercedes", 3, 15)]),
  race(2, [result("rus", "mercedes", 1, 25), result("ant", "mercedes", 2, 18, 3), result("ham", "ferrari", 3, 15, 2, "R")]),
];

export const sprints: Race[] = [
  {
    ...race(2, []),
    Results: undefined,
    SprintResults: [result("ham", "ferrari", 1, 8), result("ant", "mercedes", 2, 7)],
  },
];

export const qualifying: Race[] = [
  { ...race(1, []), Results: undefined, QualifyingResults: [
    { number: "44", position: "1", Driver: drivers.ham, Constructor: teams.ferrari },
    { number: "12", position: "2", Driver: drivers.ant, Constructor: teams.mercedes },
    { number: "63", position: "3", Driver: drivers.rus, Constructor: teams.mercedes },
  ] },
  { ...race(2, []), Results: undefined, QualifyingResults: [
    { number: "63", position: "1", Driver: drivers.rus, Constructor: teams.mercedes },
    { number: "44", position: "2", Driver: drivers.ham, Constructor: teams.ferrari },
    { number: "12", position: "3", Driver: drivers.ant, Constructor: teams.mercedes },
  ] },
];

export const schedule: Race[] = [1, 2, 3, 4, 5].map((r) => race(r, [], r === 4 ? { Sprint: { date: "2026-04-01" } } : {}));
