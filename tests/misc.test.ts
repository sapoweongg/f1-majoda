import { describe, expect, it } from "vitest";
import { circuitInfo, trackShape } from "@/lib/circuits";
import { deltaE, distinctPair } from "@/lib/color";
import { headToHead, roundByRound, seasonStats } from "@/lib/compare";
import { lapTime, parseLapTime } from "@/lib/format";
import { mergeRacePages, type Circuit, type ConstructorStanding, type DriverStanding, type Race } from "@/lib/api/jolpica";
import { addTeamSeason, mergeFamilies, type TeamIndexEntry } from "@/lib/constructors";
import { buildCircuitIndex } from "@/lib/races-index";
import { addSeason, type DriverIndexEntry } from "@/lib/drivers";
import { matchDriver } from "@/lib/mapping";
import { f1DriverCode } from "@/lib/photos";
import { gpName } from "@/lib/gp-names";
import { hitHref, prepareIndex, searchIndex } from "@/lib/search";
import racesData from "@/data/races.json";
import { validateVote, voterHash } from "@/lib/ratings";
import { teamColor, teamStyle } from "@/lib/teams";
import { qualifying, results, sprints } from "./fixtures";

describe("trazados", () => {
  it("elige el trazado de cada época", () => {
    expect(trackShape("monza", 1955)?.layoutId).toBe("monza-2");
    expect(trackShape("monza", 2026)?.layoutId).toBe("monza-7");
    // Año sin carrera en ese circuito: el trazado anterior más cercano
    expect(trackShape("red_bull_ring", 1990)?.layoutId).toBe("spielberg-2");
    expect(trackShape("jeddah")?.d.length).toBeGreaterThan(100);
  });

  it("todos los circuitos del calendario 2026 tienen trazado", () => {
    const ids = ["albert_park", "shanghai", "suzuka", "miami", "villeneuve", "monaco", "catalunya", "red_bull_ring", "silverstone", "spa", "hungaroring", "zandvoort", "monza", "madring", "baku", "sepang", "marina_bay", "americas", "rodriguez", "interlagos", "vegas", "losail", "yas_marina"];
    for (const id of ids) expect(trackShape(id, 2026), id).toBeDefined();
    expect(circuitInfo("americas")?.svgId).toBe("austin");
  });
});

describe("comparativa", () => {
  it("cuenta el cara a cara en carrera y clasificación", () => {
    const h = headToHead("antonelli", "russell", results, qualifying);
    expect(h.race).toEqual({ a: 1, b: 1 });
    expect(h.quali).toEqual({ a: 1, b: 1 });
  });

  it("calcula estadísticas de temporada", () => {
    const s = seasonStats("hamilton", results, sprints, qualifying);
    expect(s.points).toBe(18 + 15 + 8);
    expect(s.dnfs).toBe(1);
    expect(s.poles).toBe(1);
    expect(s.avgGrid).toBe(1.5);
    const rbr = roundByRound(["hamilton"], results);
    expect(rbr[1].positions[0]?.label).toBe("DNF");
  });
});

describe("colores", () => {
  it("separa a compañeros de equipo", () => {
    const pair = distinctPair(teamColor("mercedes"), teamColor("mercedes"));
    expect(pair.bDashed).toBe(true);
    expect(deltaE(pair.a, pair.b)).toBeGreaterThanOrEqual(12);
    expect(distinctPair(teamColor("ferrari"), teamColor("mercedes")).bDashed).toBe(false);
  });

  it("resuelve ids compuestos y desconocidos", () => {
    expect(teamStyle("cooper-climax").color).toBe(teamStyle("cooper").color);
    expect(teamStyle("equipo-inventado").color).toMatch(/^#/);
  });
});

describe("formato", () => {
  it("convierte tiempos de vuelta", () => {
    expect(lapTime(83.456)).toBe("1:23.456");
    expect(lapTime(59.1)).toBe("59.100");
    expect(parseLapTime("1:51.904")).toBeCloseTo(111.904);
    expect(parseLapTime(undefined)).toBeNull();
  });
});

describe("mapping", () => {
  it("relaciona pilotos por dorsal, siglas o apellido", () => {
    const cands = [
      { driver: { driverId: "norris", givenName: "Lando", familyName: "Norris", code: "NOR" }, number: "1" },
      { driver: { driverId: "piastri", givenName: "Oscar", familyName: "Piastri", code: "PIA" }, number: "81" },
    ];
    expect(matchDriver({ driver_number: 1, name_acronym: "XXX", last_name: "x" }, cands)?.driverId).toBe("norris");
    expect(matchDriver({ driver_number: 99, name_acronym: "PIA", last_name: "x" }, cands)?.driverId).toBe("piastri");
    expect(matchDriver({ driver_number: 99, name_acronym: "ZZZ", last_name: "Norris" }, cands)?.driverId).toBe("norris");
  });
});

describe("valoraciones", () => {
  const start = new Date("2026-09-26T11:00:00Z");

  it("valida votos", () => {
    const after = new Date("2026-09-26T14:00:00Z");
    expect(validateVote({ season: 2026, round: 15, rating: 5 }, start, after)).toEqual({ season: 2026, round: 15, rating: 5 });
    expect(validateVote({ season: 2026, round: 15, rating: 6 }, start, after)).toBe("invalid");
    expect(validateVote({ season: 2026, round: 15, rating: 3.5 }, start, after)).toBe("invalid");
    expect(validateVote({ season: 2026, round: 15, rating: 4 }, start, new Date("2026-09-26T12:00:00Z"))).toBe("not-finished");
    expect(validateVote({ season: 2026, round: 99, rating: 4 }, null, after)).toBe("unknown-race");
    expect(validateVote("hola", start, after)).toBe("invalid");
  });

  it("el hash es estable y no contiene la IP", () => {
    const h = voterHash("1.2.3.4", "UA", "sal");
    expect(h).toHaveLength(64);
    expect(h).toBe(voterHash("1.2.3.4", "UA", "sal"));
    expect(h).not.toBe(voterHash("1.2.3.5", "UA", "sal"));
    expect(h).not.toContain("1.2.3.4");
  });
});

describe("carreras de varias temporadas", () => {
  const race = (season: string, round: string, extra: Partial<Race> = {}) =>
    ({ season, round, raceName: `${season}-${round}`, ...extra }) as Race;

  it("ordena por temporada y luego por ronda", () => {
    // Mónaco 1959 fue la ronda 1: ordenar solo por ronda la ponía delante de 1950 (ronda 2)
    const merged = mergeRacePages([[race("2026", "6"), race("1950", "2"), race("1959", "1")], [race("1955", "2")]]);
    expect(merged.map((r) => r.season)).toEqual(["1950", "1955", "1959", "2026"]);
  });

  it("une las vueltas cortadas entre páginas", () => {
    const timing = (driverId: string) => ({ driverId, position: "1", time: "1:30.000" });
    const merged = mergeRacePages([
      [race("2024", "1", { Laps: [{ number: "1", Timings: [timing("a")] }] })],
      [race("2024", "1", { Laps: [{ number: "1", Timings: [timing("b")] }, { number: "2", Timings: [timing("a")] }] })],
    ]);
    expect(merged).toHaveLength(1);
    expect(merged[0].Laps?.map((l) => l.Timings.length)).toEqual([2, 1]);
  });
});

describe("fotos oficiales", () => {
  it("saca el código del CDN de la URL de OpenF1 o lo arma con el nombre", () => {
    const url = "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ARVLIN01_Arvid_Lindblad/arvlin01.png.transform/1col/image.png";
    expect(f1DriverCode(url)).toBe("arvlin01");
    expect(f1DriverCode(null, "Ayumu", "Iwasa")).toBe("ayuiwa01");
    expect(f1DriverCode(null, "Andrea Kimi", "Antonelli")).toBe("andant01");
    expect(f1DriverCode(null, "Nico", "Hülkenberg")).toBe("nichul01");
    expect(f1DriverCode(null)).toBeUndefined();
  });
});

describe("índice de pilotos", () => {
  const standing = (driverId: string, position: string, wins: string) =>
    ({
      position,
      positionText: position,
      points: "0",
      wins,
      Driver: { driverId, givenName: driverId, familyName: driverId, nationality: "Italian" },
      Constructors: [],
    }) as unknown as DriverStanding;
  const base: DriverIndexEntry[] = [
    { id: "max", given: "Max", family: "Verstappen", nationality: "Dutch", from: 2015, to: 2025, seasons: 11, wins: 71, titles: 4, best: 1 },
  ];

  it("suma la temporada en curso sin darle el título al líder", () => {
    const list = addSeason(base, 2026, [standing("antonelli", "1", "8"), standing("max", "6", "0")], false);
    const ant = list.find((d) => d.id === "antonelli")!;
    expect(ant).toMatchObject({ from: 2026, to: 2026, seasons: 1, wins: 8, titles: 0 });
    expect(list.find((d) => d.id === "max")).toMatchObject({ to: 2026, seasons: 12, wins: 71, titles: 4 });
  });

  it("cuenta el título de una temporada terminada y no repite temporadas", () => {
    const once = addSeason(base, 2026, [standing("max", "1", "10")], true);
    expect(once[0]).toMatchObject({ seasons: 12, wins: 81, titles: 5 });
    expect(addSeason(once, 2026, [standing("max", "1", "10")], true)[0]).toMatchObject({ seasons: 12, titles: 5 });
  });
});

describe("índice de equipos", () => {
  const team = (id: string, years: number[], wins = 0, titles = 0): TeamIndexEntry => ({
    id,
    name: id,
    nationality: "British",
    from: years[0],
    to: years.at(-1)!,
    years,
    wins,
    titles,
  });

  it("une los chasis-motor con su equipo", () => {
    const merged = mergeFamilies([
      team("team_lotus", [1958, 1959, 1994], 45, 4),
      team("lotus-climax", [1959, 1960], 22, 2),
      team("lotus-ford", [1967, 1968], 12, 1),
      team("lotus_f1", [2012, 2015], 2, 0),
      team("de_tomaso-ferrari", [1970]),
    ]);
    const lotus = merged.find((t) => t.id === "team_lotus")!;
    expect(lotus).toMatchObject({ from: 1958, to: 1994, wins: 79, titles: 7 });
    expect(lotus.years).toEqual([1958, 1959, 1960, 1967, 1968, 1994]);
    // Lotus F1 (2012-2015) es otro equipo y los combinados sin equipo base se quedan solos
    expect(merged.map((t) => t.id).sort()).toEqual(["de_tomaso-ferrari", "lotus_f1", "team_lotus"]);
  });

  it("suma una temporada nueva sin repetirla", () => {
    const standing = { position: "1", positionText: "1", points: "500", wins: "10", Constructor: { constructorId: "audi", name: "Audi", nationality: "German" } } as ConstructorStanding;
    const once = addTeamSeason([], 2026, [standing], false);
    expect(once[0]).toMatchObject({ id: "audi", from: 2026, to: 2026, years: [2026], wins: 10, titles: 0 });
    expect(addTeamSeason(once, 2026, [standing], false)[0].years).toEqual([2026]);
  });
});

describe("índice de circuitos", () => {
  const circuit = (id: string) => ({ circuitId: id, circuitName: id, Location: { locality: "x", country: "Italy", lat: "0", long: "0" } }) as Circuit;
  const scheduled = (id: string, date: string) =>
    ({ season: "2026", round: "1", raceName: "GP", date, time: "13:00:00Z", Circuit: circuit(id) }) as Race;

  it("cuenta las carreras disputadas y marca el calendario actual", () => {
    const index = buildCircuitIndex(
      [circuit("monza"), circuit("madring"), circuit("aintree")],
      [[1950, 7, "Italian GP", "monza", "Italy"], [2025, 16, "Italian GP", "monza", "Italy"], [1962, 1, "British GP", "aintree", "UK"]],
      [scheduled("monza", "2026-09-06"), scheduled("madring", "2026-12-01")],
      Date.parse("2026-10-01T00:00:00Z"),
    );
    expect(index.find((c) => c.id === "monza")).toMatchObject({ from: 1950, to: 2026, races: 3 });
    // Madrid aún no se ha corrido: está en el calendario pero sin carreras
    expect(index.find((c) => c.id === "madring")).toMatchObject({ from: 2026, to: 2026, races: 0 });
    expect(index.find((c) => c.id === "aintree")).toMatchObject({ from: 1962, to: 1962, races: 1 });
  });
});

describe("nombres de los GP", () => {
  it("traduce al español y deja el inglés en /en", () => {
    expect(gpName("Monaco Grand Prix", "es")).toBe("Gran Premio de Mónaco");
    expect(gpName("Monaco Grand Prix", "es", true)).toBe("GP de Mónaco");
    expect(gpName("United States Grand Prix West", "es")).toBe("Gran Premio de Estados Unidos Oeste");
    expect(gpName("Indianapolis 500", "es")).toBe("500 Millas de Indianápolis");
    expect(gpName("Monaco Grand Prix", "en", true)).toBe("Monaco GP");
    // Un nombre desconocido se queda como viene
    expect(gpName("Bahrain Grand Prix in Malaysia", "es", true)).toBe("Bahrain GP in Malaysia");
  });

  it("cubre todos los nombres de la historia", () => {
    const names = new Set((racesData.races as [number, number, string][]).map((r) => r[2]));
    const missing = [...names].filter((n) => gpName(n, "es") === n);
    expect(missing).toEqual([]);
  });
});

describe("buscador general", () => {
  const index = prepareIndex({
    current: 2026,
    drivers: [
      ["senna", "Ayrton", "Senna", 1984, 1994, 3, 41],
      ["bruno_senna", "Bruno", "Senna", 2010, 2012, 0, 0],
      ["perez", "Sergio", "Pérez", 2011, 2026, 0, 6],
    ],
    teams: [["mclaren", "McLaren", 1966, 2026, 10, 199]],
    circuits: [["monaco", "Circuit de Monaco", "Monte Carlo", "Mónaco", "mc"]],
    races: [
      [1988, 4, "Gran Premio de Mónaco", "monaco"],
      [1989, 4, "Gran Premio de Mónaco", "monaco"],
      [2026, 6, "Gran Premio de Mónaco", "monaco"],
    ],
  });

  it("encuentra un GP concreto por nombre y año", () => {
    const r = searchIndex(index, "monaco 1988");
    expect(r.races.map(hitHref)).toEqual(["/races/1988/4"]);
    // El circuito también sale: los circuitos se buscan solo por texto
    expect(r.circuits.map(hitHref)).toEqual(["/circuits/monaco"]);
  });

  it("ignora tildes y ordena por relevancia", () => {
    expect(searchIndex(index, "perez").drivers.map(hitHref)).toEqual(["/drivers/perez"]);
    // Ayrton (3 títulos) antes que Bruno
    expect(searchIndex(index, "senna").drivers.map(hitHref)).toEqual(["/drivers/senna", "/drivers/bruno_senna"]);
    // Sin año, las carreras más recientes primero
    expect(searchIndex(index, "monaco").races.map(hitHref)[0]).toBe("/races/2026/6");
  });

  it("un año solo filtra a quienes estaban en activo", () => {
    const r = searchIndex(index, "1990");
    expect(r.drivers.map(hitHref)).toEqual(["/drivers/senna"]);
    expect(r.teams.map(hitHref)).toEqual(["/teams/mclaren"]);
    expect(searchIndex(index, "  ").drivers).toEqual([]);
  });
});
