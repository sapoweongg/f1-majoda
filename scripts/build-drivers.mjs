// Genera src/data/drivers.json: todos los pilotos que aparecen en una clasificación final desde 1950,
// con sus años en activo, temporadas, victorias, títulos y mejor posición. Alimenta el buscador de
// /drivers. Las temporadas posteriores a `through` se añaden en tiempo real (src/lib/drivers.ts).
// Uso: node scripts/build-drivers.mjs [ultimoAño]   (por defecto, la última temporada terminada)
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

/** Clasificación final de pilotos de una temporada (paginada: los años 50 pasan de 100 pilotos). */
async function standings(season) {
  const rows = [];
  for (let offset = 0; ; offset += 100) {
    const data = await get(`/${season}/driverstandings.json?limit=100&offset=${offset}`);
    await sleep(450);
    rows.push(...(data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? []));
    if (offset + 100 >= Number(data.MRData.total)) return rows;
  }
}

const drivers = new Map();
for (let season = 1950; season <= last; season++) {
  for (const s of await standings(season)) {
    const d = s.Driver;
    const e = drivers.get(d.driverId) ?? {
      id: d.driverId,
      given: d.givenName,
      family: d.familyName,
      nationality: d.nationality,
      from: season,
      to: season,
      seasons: 0,
      wins: 0,
      titles: 0,
      best: 99,
    };
    e.to = season;
    e.seasons++;
    e.wins += Number(s.wins);
    const pos = Number(s.position);
    if (pos === 1) e.titles++;
    if (pos && pos < e.best) e.best = pos;
    drivers.set(d.driverId, e);
  }
  process.stdout.write(`${season} `);
}

mkdirSync("src/data", { recursive: true });
const list = [...drivers.values()].sort((a, b) => b.to - a.to || a.family.localeCompare(b.family));
writeFileSync("src/data/drivers.json", JSON.stringify({ through: last, drivers: list }));
console.log(`\n${list.length} pilotos hasta ${last}`);
