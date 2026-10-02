// Genera src/data/races.json: todas las carreras del campeonato desde 1950 (temporada, ronda, nombre,
// circuito y país). Lo usan el buscador general (encontrar "Mónaco 1988") y el índice de circuitos.
// La temporada actual se añade en tiempo real desde el calendario.
// Uso: node scripts/build-races.mjs [ultimoAño]   (por defecto, la última temporada terminada)
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

const races = [];
for (let offset = 0; ; offset += 100) {
  const data = await get(`/races.json?limit=100&offset=${offset}`);
  await sleep(450);
  for (const r of data.MRData.RaceTable.Races) {
    if (Number(r.season) > last) continue;
    // Formato compacto: [temporada, ronda, nombre, circuitId, país]
    races.push([Number(r.season), Number(r.round), r.raceName, r.Circuit.circuitId, r.Circuit.Location.country]);
  }
  if (offset + 100 >= Number(data.MRData.total)) break;
}

races.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
mkdirSync("src/data", { recursive: true });
writeFileSync("src/data/races.json", JSON.stringify({ through: last, races }));
console.log(`${races.length} carreras hasta ${last}`);
