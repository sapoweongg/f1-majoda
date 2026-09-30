import "server-only";
import type { Driver } from "./api/jolpica";
import { getDrivers, getSessions, type OFDriver } from "./api/openf1";
import { getWikiImages } from "./api/wikimedia";
import { largeHeadshot, OFFICIAL_MEDIA } from "./media";
import { OPENF1_FIRST_SEASON } from "./mapping";

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
    const keys = [...new Set([races[0]?.session_key, races.at(-1)?.session_key].filter(Boolean))] as number[];
    const lists = await Promise.all(keys.map((k) => getDrivers(k)));
    // La última sesión manda (equipo y foto más recientes)
    return lists.flat().reverse();
  } catch {
    return [];
  }
}

export async function getOfficialHeadshots(season: number): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (!OFFICIAL_MEDIA) return map;
  for (const d of await openf1Drivers(season)) {
    const src = largeHeadshot(d.headshot_url);
    if (!src) continue;
    if (!map.has(d.name_acronym)) map.set(d.name_acronym, src);
    const last = d.last_name?.toLowerCase();
    if (last && !map.has(last)) map.set(last, src);
  }
  return map;
}

/** Foto de cada piloto: recorte oficial si existe; si no, Wikimedia; si tampoco, nada (avatar). */
export async function getDriverPhotos(drivers: Driver[], season: number): Promise<Record<string, Photo>> {
  const official = await getOfficialHeadshots(season);
  const out: Record<string, Photo> = {};
  const missing: Driver[] = [];
  for (const d of drivers) {
    const off = (d.code && official.get(d.code)) || official.get(d.familyName.toLowerCase());
    if (off) out[d.driverId] = { src: off, cutout: true };
    else missing.push(d);
  }
  // Los que no tienen recorte oficial: Wikimedia en una sola consulta agrupada
  if (missing.length) {
    const wiki = await getWikiImages(missing.map((d) => d.url ?? ""));
    for (const d of missing) {
      const w = d.url ? wiki.get(d.url) : undefined;
      if (w) out[d.driverId] = { src: w.src, cutout: false, credit: w.credit, creditUrl: w.filePage };
    }
  }
  return out;
}
