import { describe, expect, it } from "vitest";
import { circuitInfo, trackShape } from "@/lib/circuits";
import { deltaE, distinctPair } from "@/lib/color";
import { headToHead, roundByRound, seasonStats } from "@/lib/compare";
import { lapTime, parseLapTime } from "@/lib/format";
import { matchDriver } from "@/lib/mapping";
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
