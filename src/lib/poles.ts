import type { Race } from "./api/jolpica";

// Pole = salir primero. Jolpica solo tiene clasificaciones desde 1994 (con huecos hasta 2002) y la
// parrilla coincide con las cifras oficiales (Senna 65, Schumacher 68, Hamilton 104, Moss 16)... salvo en
// estas filas: en los años 50 los pilotos se cambiaban de coche en carrera y el que se subía al del
// poleman hereda su posición de salida, y en Monza 1952 Moss aparece en la pole por error.
const NOT_POLE = new Set([
  "1951/4/fagioli",
  "1952/8/moss",
  "1953/7/villoresi",
  "1953/8/bonetto",
  "1955/1/farina",
  "1955/1/trintignant",
  "1956/2/castellotti",
  "1956/8/castellotti",
  "1957/5/brooks",
  "1964/9/spence",
]);

/** ¿Salió desde la pole en esa carrera? Mira todas sus filas (coches compartidos) y cuenta una vez. */
export function isPole(race: Race, driverId: string): boolean {
  if (NOT_POLE.has(`${race.season}/${race.round}/${driverId}`)) return false;
  return (race.Results ?? []).some((r) => r.Driver.driverId === driverId && r.grid === "1");
}
