// Genera src/data/standings.json: la clasificación final de cada temporada cerrada, por piloto (desde
// 1950) y por equipo (desde 1958, cuando empezó el campeonato de constructores). Las fichas de piloto y
// de equipo leen de aquí las temporadas cerradas y solo piden a la API las posteriores a `through`.
// Formato: drivers = [[driverId, [[temporada, posición, puntos], …]], …];
// teams = [[constructorId, [[temporada, posición, puntos, victorias], …]], …].
// Uso: node scripts/build-standings.mjs [ultimoAño]   (por defecto, la última temporada terminada)
import { writeFileSync, mkdirSync } from "node:fs";

const BASE = "https://api.jolpi.ca/ergast/f1";
const last = Number(process.argv[2] ?? new Date().getFullYear() - 1);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(path) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(`${BASE}${path}`);
    if (res.ok) return res.json();
    await sleep(3000 * (attempt + 1));
  }
  throw new Error(`fallo ${path}`);
}

/** Clasificación final de una temporada, paginada (en los años 50 pasan de 100 pilotos). */
async function standings(season, kind) {
  const rows = [];
  for (let offset = 0; ; offset += 100) {
    const data = await get(`/${season}/${kind}standings.json?limit=100&offset=${offset}`);
    await sleep(450);
    const list = data.MRData.StandingsTable.StandingsLists[0];
    rows.push(...(list?.[kind === "driver" ? "DriverStandings" : "ConstructorStandings"] ?? []));
    if (offset + 100 >= Number(data.MRData.total)) return rows;
  }
}

const drivers = {};
const teams = {};
for (let season = 1950; season <= last; season++) {
  for (const s of await standings(season, "driver")) {
    (drivers[s.Driver.driverId] ??= {})[season] = [s.positionText, Number(s.points)];
  }
  if (season >= 1958) {
    for (const s of await standings(season, "constructor")) {
      (teams[s.Constructor.constructorId] ??= {})[season] = [s.positionText, Number(s.points), Number(s.wins)];
    }
  }
  process.stdout.write(`${season} `);
}

// En listas y no en objetos: así TypeScript no genera un tipo con cientos de claves al importarlo
const rows = (byId) => Object.entries(byId).map(([id, seasons]) => [id, Object.entries(seasons).map(([s, v]) => [Number(s), ...v])]);
mkdirSync("src/data", { recursive: true });
writeFileSync("src/data/standings.json", JSON.stringify({ through: last, drivers: rows(drivers), teams: rows(teams) }));
console.log(`\n${Object.keys(drivers).length} pilotos y ${Object.keys(teams).length} equipos hasta ${last}`);
