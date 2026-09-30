// Genera src/data/champions.json con los campeones de pilotos (1950+) y constructores (1958+).
// Jolpica no permite consultar todos los campeones de una vez, así que se pide temporada por
// temporada respetando su límite (4 req/s, 500 req/h). Uso: node scripts/build-champions.mjs [ultimoAño]
import { writeFileSync, mkdirSync } from "node:fs";

const BASE = "https://api.jolpi.ca/ergast/f1";
const last = Number(process.argv[2] ?? new Date().getFullYear() - 1);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(path) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(`${BASE}${path}`);
    if (res.ok) return res.json();
    await sleep(2000 * (attempt + 1));
  }
  throw new Error(`fallo ${path}`);
}

const out = [];
for (let season = 1950; season <= last; season++) {
  const ds = await get(`/${season}/driverstandings/1.json`);
  await sleep(450);
  const d = ds.MRData.StandingsTable.StandingsLists[0]?.DriverStandings[0];
  const row = {
    season,
    driver: d && {
      driverId: d.Driver.driverId,
      givenName: d.Driver.givenName,
      familyName: d.Driver.familyName,
      nationality: d.Driver.nationality,
      code: d.Driver.code ?? null,
      url: d.Driver.url,
      constructorId: d.Constructors.at(-1)?.constructorId,
      constructorName: d.Constructors.at(-1)?.name,
      points: Number(d.points),
      wins: Number(d.wins),
    },
    constructor: null,
  };
  if (season >= 1958) {
    const cs = await get(`/${season}/constructorstandings/1.json`);
    await sleep(450);
    const c = cs.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings[0];
    if (c)
      row.constructor = {
        constructorId: c.Constructor.constructorId,
        name: c.Constructor.name,
        nationality: c.Constructor.nationality,
        points: Number(c.points),
        wins: Number(c.wins),
      };
  }
  out.push(row);
  process.stdout.write(`${season} `);
}

mkdirSync("src/data", { recursive: true });
writeFileSync("src/data/champions.json", JSON.stringify(out, null, 1));
console.log(`\n${out.length} temporadas`);
