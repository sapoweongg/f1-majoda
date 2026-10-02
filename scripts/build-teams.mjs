// Genera src/data/teams.json: todos los equipos (constructores) que corrieron desde 1950, con las
// temporadas en que corrieron (years), victorias y títulos de constructores. Alimenta el buscador de /teams. Las
// temporadas posteriores a `through` se añaden en tiempo real (src/lib/constructors.ts).
// Uso: node scripts/build-teams.mjs [ultimoAño]   (por defecto, la última temporada terminada)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

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

/** Recorre todas las páginas de una consulta y devuelve la lista que indica `pick`. */
async function all(path, pick) {
  const rows = [];
  for (let offset = 0; ; offset += 100) {
    const data = await get(`${path}.json?limit=100&offset=${offset}`);
    await sleep(450);
    rows.push(...pick(data.MRData));
    if (offset + 100 >= Number(data.MRData.total)) return rows;
  }
}

const teams = new Map();
for (let season = 1950; season <= last; season++) {
  for (const c of await all(`/${season}/constructors`, (m) => m.ConstructorTable.Constructors)) {
    const e = teams.get(c.constructorId) ?? {
      id: c.constructorId,
      name: c.name,
      nationality: c.nationality,
      from: season,
      to: season,
      years: [],
      wins: 0,
      titles: 0,
    };
    e.to = season;
    e.years.push(season);
    e.name = c.name; // el nombre más reciente
    teams.set(c.constructorId, e);
  }
  process.stdout.write(`${season} `);
}

// Victorias: el ganador de cada carrera (una consulta paginada para toda la historia)
const winners = await all("/results/1", (m) => m.RaceTable.Races);
for (const race of winners) {
  if (Number(race.season) > last) continue;
  const id = race.Results?.[0]?.Constructor.constructorId;
  if (id && teams.has(id)) teams.get(id).wins++;
}

// Títulos de constructores (desde 1958), del archivo de campeones
const champions = JSON.parse(readFileSync("src/data/champions.json", "utf8"));
for (const c of champions) {
  const id = c.constructor?.constructorId;
  if (id && c.season <= last && teams.has(id)) teams.get(id).titles++;
}

mkdirSync("src/data", { recursive: true });
const list = [...teams.values()].sort((a, b) => b.to - a.to || b.wins - a.wins);
writeFileSync("src/data/teams.json", JSON.stringify({ through: last, teams: list }));
console.log(`\n${list.length} equipos hasta ${last}`);
