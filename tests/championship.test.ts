import { describe, expect, it } from "vitest";
import { buildProgression, maxRemainingPoints, remainingEvents, titleContention } from "@/lib/championship";
import { racePoints, sprintPoints } from "@/lib/points";
import { results, schedule, sprints } from "./fixtures";

describe("puntos", () => {
  it("usa el sistema vigente sin punto por vuelta rápida", () => {
    expect([1, 2, 3, 10, 11].map(racePoints)).toEqual([25, 18, 15, 1, 0]);
    expect([1, 8, 9].map(sprintPoints)).toEqual([8, 1, 0]);
  });
});

describe("buildProgression", () => {
  it("acumula carrera + sprint ronda a ronda y ordena por total", () => {
    const p = buildProgression(results, sprints, "driver");
    expect(p.rounds.map((r) => r.round)).toEqual([1, 2]);
    const ant = p.rows.find((r) => r.id === "antonelli")!;
    // 25 en R1; 18 + 7 (sprint) en R2
    expect(ant.cumulative).toEqual([25, 50]);
    expect(p.rows[0].id).toBe("antonelli");
    expect(p.rows.find((r) => r.id === "hamilton")!.cumulative).toEqual([18, 41]);
  });

  it("suma ambos coches para constructores", () => {
    const p = buildProgression(results, sprints, "constructor");
    const merc = p.rows.find((r) => r.id === "mercedes")!;
    // R1: 25 + 15; R2: 25 + 18 + 7 del sprint
    expect(merc.cumulative).toEqual([40, 90]);
    expect(merc.total).toBe(90);
  });
});

describe("remainingEvents / maxRemainingPoints", () => {
  it("cuenta carreras y sprints tras la última ronda", () => {
    const rem = remainingEvents(schedule, 2);
    expect(rem).toEqual({ races: 3, sprints: 1 });
    expect(maxRemainingPoints(rem, "driver")).toBe(3 * 25 + 8);
    expect(maxRemainingPoints(rem, "constructor")).toBe(3 * 43 + 15);
  });
});

describe("titleContention", () => {
  const rem = { races: 2, sprints: 0 }; // 50 pts en juego

  it("marca líder, aspirantes y eliminados", () => {
    const rows = titleContention(
      [
        { id: "a", points: 300 },
        { id: "b", points: 260 },
        { id: "c", points: 250 },
        { id: "d", points: 249 },
      ],
      rem,
      "driver",
    );
    expect(rows.map((r) => r.status)).toEqual(["leader", "contender", "contender", "eliminated"]);
    // Igualar al líder (250 + 50 = 300) cuenta como "puede ganar" por desempate
    expect(rows[2].maxPossible).toBe(300);
    // Ventaja actual 40; necesita más de 50
    expect(rows[0].toClinch).toBe(11);
  });

  it("declara campeón cuando la ventaja supera lo que queda", () => {
    const rows = titleContention(
      [
        { id: "a", points: 351 },
        { id: "b", points: 300 },
      ],
      rem,
      "driver",
    );
    expect(rows[0].status).toBe("champion");
    expect(rows[1].status).toBe("eliminated");
  });

  it("con temporada terminada solo el líder es campeón", () => {
    const rows = titleContention(
      [
        { id: "a", points: 100 },
        { id: "b", points: 99 },
      ],
      { races: 0, sprints: 0 },
      "driver",
    );
    expect(rows.map((r) => r.status)).toEqual(["champion", "eliminated"]);
  });
});
