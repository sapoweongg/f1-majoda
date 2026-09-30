// Genera src/data/circuits.json a partir del repo julesr0y/f1-circuits-svg (CC-BY-4.0)
// y lo cruza con los circuitos de Jolpica por coordenadas.
// Uso: git clone --depth 1 https://github.com/julesr0y/f1-circuits-svg .tmp/c && node scripts/build-circuits.mjs
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SRC = process.argv[2] ?? ".tmp/c";
const OUT = "src/data/circuits.json";

const meta = JSON.parse(readFileSync(join(SRC, "circuits.json"), "utf8"));

function paths(svg) {
  return [...svg.matchAll(/<path\b[^>]*?\sd="([^"]+)"/g)].map((m) => m[1]);
}

const minimalDir = join(SRC, "circuits/minimal/white");
const detailedDir = join(SRC, "circuits/detailed/white-outline");
const detailed = new Set(readdirSync(detailedDir));

const layouts = {};
for (const file of readdirSync(minimalDir)) {
  if (!file.endsWith(".svg")) continue;
  const id = file.replace(/\.svg$/, "");
  const [d] = paths(readFileSync(join(minimalDir, file), "utf8"));
  const entry = { d };
  if (detailed.has(file)) {
    const p = paths(readFileSync(join(detailedDir, file), "utf8"));
    // detailed: [trazado, línea de salida, flecha de sentido, trazado interior]
    if (p[1]) entry.start = p[1];
    if (p[2]) entry.arrow = p[2];
  }
  layouts[id] = entry;
}

function parseSeasons(s) {
  const out = [];
  for (const part of String(s).split(",")) {
    const [a, b] = part.split("-").map(Number);
    if (b) for (let y = a; y <= b; y++) out.push(y);
    else out.push(a);
  }
  return out;
}

async function jolpicaCircuits() {
  const res = await fetch("https://api.jolpi.ca/ergast/f1/circuits.json?limit=100");
  const json = await res.json();
  return json.MRData.CircuitTable.Circuits;
}

function distKm(a, b) {
  const R = 6371;
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Coordenadas que no coinciden bien entre ambas fuentes
const OVERRIDES = { jeddah: "jeddah", vegas: "las-vegas", caesars_palace: "caesars-palace" };

const jolpica = await jolpicaCircuits();
const circuits = {};
const unmatched = [];
for (const jc of jolpica) {
  const p = { lat: Number(jc.Location.lat), lng: Number(jc.Location.long) };
  let best = null;
  for (const c of meta) {
    const d = distKm(p, { lat: c.latitude, lng: c.longitude });
    if (!best || d < best.d) best = { c, d };
  }
  const forced = OVERRIDES[jc.circuitId] && meta.find((c) => c.id === OVERRIDES[jc.circuitId]);
  if (forced) best = { c: forced, d: 0 };
  if (!best || best.d > 8) {
    unmatched.push(`${jc.circuitId} (${best?.c.id} a ${best?.d.toFixed(1)} km)`);
    continue;
  }
  circuits[jc.circuitId] = {
    svgId: best.c.id,
    name: jc.circuitName,
    locality: jc.Location.locality,
    country: jc.Location.country,
    lat: p.lat,
    lng: p.lng,
    layouts: best.c.layouts.map((l) => ({
      id: l.layoutId,
      seasons: parseSeasons(l.seasons),
      ...(l["f1-orientation"] != null ? { rotate: l["f1-orientation"] } : {}),
    })),
  };
}

mkdirSync("src/data", { recursive: true });
writeFileSync(OUT, JSON.stringify({ circuits, layouts }));
console.log(
  `circuitos: ${Object.keys(circuits).length}, layouts: ${Object.keys(layouts).length}`,
);
if (unmatched.length) console.log("sin trazado:", unmatched.join(", "));
