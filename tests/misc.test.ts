import { describe, expect, it } from "vitest";
import { circuitInfo, trackShape } from "@/lib/circuits";
import { deltaE, distinctPair } from "@/lib/color";
import { headToHead, roundByRound, seasonStats } from "@/lib/compare";
import { activeIn, gapYears, lapTime, parseLapTime } from "@/lib/format";
import { isPole } from "@/lib/poles";
import { buildDuel } from "@/lib/duel2021";
import radios2021 from "@/data/duel2021-radios.json";
import { commonsSrcSet } from "@/lib/api/wikimedia";
import { driverFinals, teamFinals } from "@/lib/standings";
import { mergeRacePages, type Circuit, type ConstructorStanding, type DriverStanding, type Race } from "@/lib/api/jolpica";
import { addTeamSeason, mergeFamilies, type TeamIndexEntry } from "@/lib/constructors";
import { buildCircuitIndex } from "@/lib/races-index";
import { addSeason, driverYears, type DriverIndexEntry } from "@/lib/drivers";
import { matchDriver } from "@/lib/mapping";
import { f1DriverCode } from "@/lib/photos";
import { gpName } from "@/lib/gp-names";
import { driverStory } from "@/content/drivers";
import champions from "@/data/champions.json";
import { statusLabel } from "@/lib/status";
import { isKeyMessage, translateRaceControl } from "@/lib/race-control";
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

  it("sin clasificación compara la parrilla", () => {
    // Ronda 1: HAM sale 1.º y ANT 2.º; ronda 2: HAM 2.º y ANT 3.º
    expect(headToHead("hamilton", "antonelli", results, []).quali).toEqual({ a: 2, b: 0 });
    // Con clasificación manda la clasificación (ronda 2: HAM 2.º, ANT 3.º; ronda 1: HAM 1.º)
    expect(headToHead("hamilton", "antonelli", results, qualifying).quali).toEqual({ a: 2, b: 0 });
    expect(headToHead("antonelli", "russell", results, []).quali).toEqual({ a: 1, b: 1 });
  });

  it("calcula estadísticas de temporada", () => {
    const s = seasonStats("hamilton", results, sprints);
    expect(s.points).toBe(18 + 15 + 8);
    expect(s.dnfs).toBe(1);
    expect(s.poles).toBe(1);
    expect(s.avgGrid).toBe(1.5);
    const rbr = roundByRound(["hamilton"], results);
    expect(rbr[1].positions[0]?.label).toBe("DNF");
  });

  it("cuenta las poles de los coches compartidos una sola vez y sin herencias", () => {
    const race = (season: string, round: string, rows: [string, string][]) =>
      ({ season, round, Results: rows.map(([driverId, grid]) => ({ Driver: { driverId }, grid })) }) as unknown as Race;
    // Francia 1951: Fangio salió de la pole y ganó con el coche de Fagioli
    const reims = race("1951", "4", [["fangio", "7"], ["fangio", "1"], ["fagioli", "1"]]);
    expect(isPole(reims, "fangio")).toBe(true);
    expect(isPole(reims, "fagioli")).toBe(false);
    // Monza 1952: Moss aparece en la pole por error
    expect(isPole(race("1952", "8", [["moss", "1"]]), "moss")).toBe(false);
    expect(isPole(race("2026", "1", [["moss", "1"]]), "moss")).toBe(true);
  });
});

describe("fotos de Commons", () => {
  it("arma el srcset con los anchos que sirve Wikimedia, sin pasar del original", () => {
    const thumb =
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Foto_23.jpg/1920px-Foto_23.jpg?utm_source=commons.wikimedia.org";
    expect(commonsSrcSet(thumb, 8640)).toBe(
      [500, 960, 1280, 1920].map((w) => `https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Foto_23.jpg/${w}px-Foto_23.jpg ${w}w`).join(", "),
    );
    // Una foto de 1100 px de ancho no tiene miniaturas de 1280 ni de 1920
    expect(commonsSrcSet(thumb, 1100)?.split(", ").map((x) => x.split(" ")[1])).toEqual(["500w", "960w"]);
    // Sin miniatura (la URL del original) no hay srcset
    expect(commonsSrcSet("https://upload.wikimedia.org/wikipedia/commons/4/46/Foto_23.jpg", 8640)).toBeUndefined();
  });
});

describe("duelo de 2021", () => {
  const race = (round: string, rows: [string, string, string][], key: "Results" | "SprintResults" = "Results") =>
    ({
      season: "2021",
      round,
      raceName: "Test Grand Prix",
      Circuit: { circuitId: "test", Location: { country: "Spain" } },
      [key]: rows.map(([driverId, position, points]) => ({
        Driver: { driverId, code: driverId.slice(0, 3).toUpperCase() },
        position,
        positionText: position,
        points,
        grid: position === "1" ? "1" : "2",
      })),
    }) as unknown as Race;

  it("acumula puntos con sprints, cuenta cambios de líder y no cuenta el empate", () => {
    const results = [
      race("1", [["hamilton", "1", "25"], ["max_verstappen", "2", "18"]]),
      race("2", [["max_verstappen", "1", "25"], ["hamilton", "R", "0"]]),
      race("3", [["hamilton", "1", "26"], ["max_verstappen", "3", "15"]]),
      race("4", [["max_verstappen", "1", "25"], ["hamilton", "2", "18"]]),
    ];
    const sprints = [race("3", [["max_verstappen", "1", "3"], ["hamilton", "2", "2"]], "SprintResults")];
    const d = buildDuel(results, sprints);
    expect(d.rounds.map((r) => r.gap)).toEqual([-7, 18, 8, 15]);
    expect(d.rounds[2].ver.sprintWin).toBe(true);
    expect(d.rounds[2].ham.sprint).toEqual({ grid: 2, position: 2 });
    expect(d.rounds[1].ham.sprint).toBeUndefined();
    expect(d.rounds[1].ham.position).toBeNull();
    expect(d.leadChanges).toBe(1);
    expect(d.ver).toMatchObject({ wins: 2, podiums: 4, points: 86, leadRounds: 3, poles: 2 });
    expect(d.ham).toMatchObject({ wins: 2, leadRounds: 1 });
    // Un empate no es un cambio de líder
    const tie = buildDuel([results[0], race("2", [["max_verstappen", "1", "25"], ["hamilton", "3", "18"]])], []);
    expect(tie.rounds.map((r) => r.gap)).toEqual([-7, 0]);
    expect(tie.leadChanges).toBe(0);
  });

  it("cada radio es del piloto y la temporada que dice", () => {
    for (const r of radios2021) {
      expect(r.url, r.url).toMatch(/^https:\/\/livetiming\.formula1\.com\/static\/2021\/.+\.mp3$/);
      expect(r.url, r.url).toContain(r.driver === "ver" ? "/MAXVER01_33_" : "/LEWHAM01_44_");
      expect(r.round).toBeGreaterThanOrEqual(1);
      expect(r.round).toBeLessThanOrEqual(22);
    }
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
    // Un GP trasladado a otro país se traduce por partes; un nombre desconocido se queda como viene
    expect(gpName("Bahrain Grand Prix in Malaysia", "es")).toBe("Gran Premio de Baréin en Malasia");
    expect(gpName("Bahrain Grand Prix in Malaysia", "es", true)).toBe("GP de Baréin en Malasia");
    expect(gpName("Bahrain Grand Prix in Malaysia", "en", true)).toBe("Bahrain GP in Malaysia");
    expect(gpName("Atlantis Grand Prix", "es", true)).toBe("Atlantis GP");
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

  it("respeta los huecos de una trayectoria", () => {
    const withGap = prepareIndex({
      current: 2026,
      drivers: [["kubica", "Robert", "Kubica", 2006, 2021, 0, 1, driverYears({ id: "kubica", to: 2021 })]],
      teams: [],
      circuits: [],
      races: [],
    });
    expect(searchIndex(withGap, "kubica 2008").drivers).toHaveLength(1);
    expect(searchIndex(withGap, "kubica 2015").drivers).toHaveLength(0);
  });

  it("un año solo filtra a quienes estaban en activo", () => {
    const r = searchIndex(index, "1990");
    expect(r.drivers.map(hitHref)).toEqual(["/drivers/senna"]);
    expect(r.teams.map(hitHref)).toEqual(["/teams/mclaren"]);
    expect(searchIndex(index, "  ").drivers).toEqual([]);
  });
});

describe("estado final", () => {
  it("traduce y calcula las vueltas perdidas", () => {
    expect(statusLabel("Retired", "es")).toBe("Abandono");
    expect(statusLabel("+1 Lap", "es")).toBe("+1 vuelta");
    expect(statusLabel("+3 Laps", "en")).toBe("+3 laps");
    expect(statusLabel("Lapped", "es", 49, 51)).toBe("+2 vueltas");
    expect(statusLabel("Gearbox", "en")).toBe("Gearbox");
    expect(statusLabel("Estado raro", "es")).toBe("Estado raro");
  });
});

describe("clasificaciones finales del archivo", () => {
  it("tiene todas las temporadas cerradas, también las antiguas", () => {
    const alonso = driverFinals("alonso");
    expect(alonso.get(2007)).toEqual({ position: "3", points: 109, wins: undefined });
    expect(alonso.get(2005)?.position).toBe("1");
    expect(driverFinals("michael_schumacher").get(1997)?.position).toBe("D");
    expect(teamFinals("ligier").get(1980)).toEqual({ position: "2", points: 66, wins: 2 });
    expect(driverFinals("no_existe").size).toBe(0);
  });

  it("detecta los huecos de una trayectoria", () => {
    const kubica = driverYears({ id: "kubica", to: 2021 });
    expect(gapYears(kubica, 2006, 2021)).toEqual([2006, 2007, 2008, 2009, 2010, 2019, 2021]);
    // Sin huecos no hace falta la lista
    expect(gapYears([2019, 2020, 2021], 2019, 2021)).toBeUndefined();
    expect(activeIn(2015, 2006, 2021, kubica)).toBe(false);
    expect(activeIn(2015, 2006, 2021)).toBe(true);
  });
});

describe("dirección de carrera", () => {
  const es = (m: string) => translateRaceControl(m, "es");
  it("traduce los mensajes fijos y con datos", () => {
    expect(es("TRACK CLEAR")).toBe("PISTA DESPEJADA");
    expect(es("DOUBLE YELLOW IN TRACK SECTOR 7")).toBe("DOBLE AMARILLA EN EL SECTOR 7");
    expect(es("WAVED BLUE FLAG FOR CAR 11 (PER) TIMED AT 17:17:46")).toBe("BANDERA AZUL PARA EL COCHE 11 (PER) A LAS 17:17:46");
    expect(es("CAR 10 (GAS) TIME 2:21.833 DELETED - TRACK LIMITS AT TURN 12 LAP 3 16:41:19")).toBe(
      "COCHE 10 (GAS): TIEMPO 2:21.833 ANULADO POR LÍMITES DE PISTA EN LA CURVA 12 · VUELTA 3 · 16:41:19",
    );
    expect(es("RISK OF RAIN FOR THE F1 RACE IS 90%")).toBe("RIESGO DE LLUVIA PARA LA CARRERA DE F1: 90%");
  });

  it("traduce los avisos de los comisarios por frases", () => {
    expect(es("TURN 9 INCIDENT INVOLVING CARS 16 (LEC) AND 27 (HUL) NOTED - CAUSING A COLLISION (16:40:50)")).toBe(
      "INCIDENTE EN LA CURVA 9 ENTRE LOS COCHES 16 (LEC) Y 27 (HUL) ANOTADO - PROVOCAR UNA COLISIÓN (16:40:50)",
    );
    expect(es("FIA STEWARDS: 10 SECOND TIME PENALTY FOR CAR 5 (BOR) - CAUSING A COLLISION (17:01:01)")).toBe(
      "COMISARIOS DE LA FIA: 10 SEGUNDOS DE PENALIZACIÓN PARA EL COCHE 5 (BOR) - PROVOCAR UNA COLISIÓN (17:01:01)",
    );
  });

  it("deja igual lo desconocido y el inglés", () => {
    expect(es("SOMETHING NEW")).toBe("SOMETHING NEW");
    expect(translateRaceControl("TRACK CLEAR", "en")).toBe("TRACK CLEAR");
  });

  it("se queda con lo importante y descarta el ruido", () => {
    const m = (category: string, message: string, flag: string | null = null, scope: string | null = null) => ({ category, message, flag, scope });
    expect(isKeyMessage(m("SafetyCar", "SAFETY CAR DEPLOYED"))).toBe(true);
    expect(isKeyMessage(m("Flag", "RED FLAG", "RED", "Track"))).toBe(true);
    expect(isKeyMessage(m("Flag", "TRACK CLEAR", "CLEAR", "Track"))).toBe(true);
    expect(isKeyMessage(m("Flag", "BLACK AND WHITE FLAG FOR CAR 87 (BEA) - TRACK LIMITS", "BLACK AND WHITE", "Driver"))).toBe(true);
    expect(isKeyMessage(m("Other", "FIA STEWARDS: 10 SECOND TIME PENALTY FOR CAR 5 (BOR) - CAUSING A COLLISION (17:01:01)"))).toBe(true);
    expect(isKeyMessage(m("Flag", "YELLOW IN TRACK SECTOR 9", "YELLOW", "Sector"))).toBe(false);
    expect(isKeyMessage(m("Flag", "CLEAR IN TRACK SECTOR 9", "CLEAR", "Sector"))).toBe(false);
    expect(isKeyMessage(m("Flag", "WAVED BLUE FLAG FOR CAR 11 (PER)", "BLUE", "Driver"))).toBe(false);
    expect(isKeyMessage(m("Other", "CAR 10 (GAS) TIME 2:21.833 DELETED - TRACK LIMITS AT TURN 12 LAP 3 16:41:19"))).toBe(false);
    expect(isKeyMessage(m("Other", "MARSHALS ON TRACK AT TURN 11"))).toBe(false);
  });
});

describe("perfiles de pilotos", () => {
  const grid2026 = [
    "max_verstappen", "hadjar", "lawson", "arvid_lindblad", "leclerc", "hamilton", "russell", "antonelli",
    "norris", "piastri", "alonso", "stroll", "albon", "sainz", "gasly", "colapinto",
    "ocon", "bearman", "hulkenberg", "bortoleto", "perez", "bottas",
  ];

  it("toda la parrilla de 2026 tiene perfil en los dos idiomas", () => {
    for (const id of grid2026) {
      const es = driverStory(id, "es");
      const en = driverStory(id, "en");
      expect(es?.text.length, id).toBeGreaterThan(0);
      expect(en?.text.length, id).toBe(es?.text.length);
      expect(en?.born === undefined, id).toBe(es?.born === undefined);
    }
    expect(driverStory("fangio", "es")?.born).toBe("Balcarce, Argentina");
    // Todos los campeones del mundo tienen perfil
    for (const c of champions) if (c.driver) expect(driverStory(c.driver.driverId, "en")?.text.length, c.driver.driverId).toBeGreaterThan(0);
  });

  it("los pilotos destacados sin título tienen perfil completo", () => {
    const notable = [
      "moss", "collins", "brooks", "gurney", "mclaren", "amon", "ickx", "regazzoni", "peterson", "cevert", "reutemann",
      "gilles_villeneuve", "laffite", "pironi", "patrese", "alboreto", "berger", "alesi", "coulthard", "irvine", "frentzen",
      "barrichello", "montoya", "ralf_schumacher", "webber", "massa", "kubica", "ricciardo", "grosjean", "kevin_magnussen",
      "tsunoda", "zhou", "mick_schumacher",
      "gonzalez", "trips", "ginther", "bandini", "siffert", "rodriguez", "beltoise", "depailler", "watson", "jabouille",
      "tambay", "arnoux", "angelis", "cesaris", "boutsen", "bellof", "brundle", "nannini", "herbert", "verstappen", "panis",
      "ratzenberger", "fisichella", "trulli", "heidfeld", "sato", "kovalainen", "kobayashi", "maldonado", "jules_bianchi",
      "kvyat", "de_vries",
    ];
    for (const id of notable) {
      const es = driverStory(id, "es");
      const en = driverStory(id, "en");
      expect(es?.born, id).toBeTruthy();
      expect(en?.born, id).toBeTruthy();
      expect(en?.text.length, id).toBe(es?.text.length);
    }
    expect(driverStory("gilles_villeneuve", "en")?.born).toBe("Saint-Jean-sur-Richelieu, Canada");
  });
});
