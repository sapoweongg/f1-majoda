// Genera public/world.svg: contorno de los continentes (Natural Earth 110m vía world-atlas)
// como un path SVG en proyección equirectangular de 1000×500. Uso: node scripts/build-world.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { feature } from "topojson-client";
import { geoEquirectangular, geoPath } from "d3-geo";

const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve("world-atlas/land-110m.json"), "utf8"));
const land = feature(topo, topo.objects.land);

const width = 1000;
const height = 500;
const projection = geoEquirectangular().scale(width / (2 * Math.PI)).translate([width / 2, height / 2]).precision(0.5);
const d = geoPath(projection).digits(1)(land);

writeFileSync(
  "public/world.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><path d="${d}" fill="#3a3a41"/></svg>`,
);
console.log(`world.svg: ${(d.length / 1024).toFixed(0)} KB`);
