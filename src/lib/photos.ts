import "server-only";
import { unstable_cache } from "next/cache";
import type { Driver } from "./api/jolpica";
import { getDrivers, getSessions, type OFDriver, type Session } from "./api/openf1";
import { getWikiImages } from "./api/wikimedia";
import { driverHeadshot, largeHeadshot, OFFICIAL_MEDIA } from "./media";
import { OPENF1_FIRST_SEASON } from "./mapping";
import { constructorIdFromOpenF1, teamStyle } from "./teams";

export type Photo = {
  src: string;
  /** true = recorte oficial con fondo transparente; false = foto de Wikimedia. */
  cutout: boolean;
  credit?: string;
  creditUrl?: string;
};

/** Pilotos de OpenF1 de la primera y la última carrera de la temporada (incluye cambios de equipo). */
async function openf1Drivers(season: number): Promise<OFDriver[]> {
  if (season < OPENF1_FIRST_SEASON) return [];
  try {
    const races = (await getSessions({ year: season, session_name: "Race" }))
      .filter((s) => new Date(s.date_start) < new Date())
      .sort((a, b) => a.date_start.localeCompare(b.date_start));
    const pick = [races[0], races.at(-1)].filter((s): s is Session => Boolean(s));
    const unique = [...new Map(pick.map((s) => [s.session_key, s])).values()];
    const lists = await Promise.all(unique.map((s) => getDrivers(s)));
    // La última sesión manda (equipo y foto más recientes)
    return lists.flat().reverse();
  } catch {
    return [];
  }
}

/**
 * El CDN de F1 responde 200 con una imagen de reserva en blanco cuando un recorte no existe; solo lo
 * delata la cabecera X-Cld-Error. Se comprueba una vez por semana por URL.
 */
const imageExists = unstable_cache(
  async (url: string) => {
    const res = await fetch(url, { method: "HEAD", cache: "no-store" });
    // Un fallo del CDN no es un "no existe": lanzamos para no guardarlo en caché
    if (res.status >= 500) throw new Error(`HTTP ${res.status} en ${url}`);
    return res.ok && !res.headers.get("x-cld-error");
  },
  ["image-exists"],
  { revalidate: 7 * 86400 },
);

/** Primera URL que existe de verdad. Si no se puede comprobar, se da por buena: mejor foto que hueco. */
async function firstExisting(urls: (string | null | undefined)[]): Promise<string | undefined> {
  for (const url of urls) {
    if (url && (await imageExists(url).catch(() => true))) return url;
  }
  return undefined;
}

/** Código del piloto en el CDN de F1 (p. ej. "arvlin01"): sale de la URL de OpenF1 o de nombre + apellido. */
export function f1DriverCode(headshotUrl: string | null | undefined, givenName?: string, familyName?: string) {
  const fromUrl = headshotUrl?.match(/\/([a-z]{6}\d{2})\.png/)?.[1];
  if (fromUrl) return fromUrl;
  if (!givenName || !familyName) return undefined;
  const clean = (s: string) => s.normalize("NFD").replace(/[^a-zA-Z]/g, "").toLowerCase();
  return `${clean(givenName).slice(0, 3)}${clean(familyName).slice(0, 3)}01`;
}

/** Recorte del formato nuevo del CDN (2024+) con el equipo de esa temporada. */
function newHeadshot(constructorId: string | undefined, code: string | undefined, season: number) {
  const slug = constructorId ? teamStyle(constructorId).cdn?.[season] : undefined;
  return slug && code ? driverHeadshot(slug, code, season) : null;
}

export async function getOfficialHeadshots(season: number): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (!OFFICIAL_MEDIA) return map;
  const seen = new Set<string>();
  const drivers = (await openf1Drivers(season)).filter((d) => {
    if (seen.has(d.name_acronym)) return false;
    seen.add(d.name_acronym);
    return true;
  });
  // Los pilotos nuevos ya no tienen el recorte antiguo que enlaza OpenF1: probamos también el nuevo
  const srcs = await Promise.all(
    drivers.map((d) =>
      firstExisting([
        largeHeadshot(d.headshot_url),
        newHeadshot(constructorIdFromOpenF1(d.team_name), f1DriverCode(d.headshot_url, d.first_name, d.last_name), season),
      ]),
    ),
  );
  drivers.forEach((d, i) => {
    const src = srcs[i];
    if (!src) return;
    map.set(d.name_acronym, src);
    const last = d.last_name?.toLowerCase();
    if (last && !map.has(last)) map.set(last, src);
  });
  return map;
}

/**
 * Foto de cada piloto: recorte oficial si existe; si no, Wikimedia; si tampoco, nada (avatar).
 * `teams` (driverId → constructorId) permite buscar el recorte de pilotos que no salen en OpenF1,
 * como los suplentes que corrieron alguna carrera suelta.
 */
export async function getDriverPhotos(
  drivers: Driver[],
  season: number,
  teams: Record<string, string> = {},
): Promise<Record<string, Photo>> {
  const official = await getOfficialHeadshots(season);
  const out: Record<string, Photo> = {};
  let missing: Driver[] = [];
  for (const d of drivers) {
    const off = (d.code && official.get(d.code)) || official.get(d.familyName.toLowerCase());
    if (off) out[d.driverId] = { src: off, cutout: true };
    else missing.push(d);
  }
  if (OFFICIAL_MEDIA && missing.length) {
    const srcs = await Promise.all(
      missing.map((d) => firstExisting([newHeadshot(teams[d.driverId], f1DriverCode(null, d.givenName, d.familyName), season)])),
    );
    missing.forEach((d, i) => {
      const src = srcs[i];
      if (src) out[d.driverId] = { src, cutout: true };
    });
    missing = missing.filter((d) => !out[d.driverId]);
  }
  // Los que siguen sin foto: Wikimedia en una sola consulta agrupada
  if (missing.length) {
    const wiki = await getWikiImages(missing.map((d) => d.url ?? ""));
    for (const d of missing) {
      const w = d.url ? wiki.get(d.url) : undefined;
      if (w) out[d.driverId] = { src: w.src, cutout: false, credit: w.credit, creditUrl: w.filePage };
    }
  }
  return out;
}

/** driverId → constructorId a partir de filas de resultados, para `getDriverPhotos`. */
export function teamsOf(rows: { Driver: Driver; Constructor: { constructorId: string } }[]): Record<string, string> {
  return Object.fromEntries(rows.map((r) => [r.Driver.driverId, r.Constructor.constructorId]));
}
