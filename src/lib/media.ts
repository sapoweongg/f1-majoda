import { teamStyle } from "./teams";

// Punto único para imágenes de terceros. Con NEXT_PUBLIC_OFFICIAL_MEDIA=false se dejan de usar
// las imágenes oficiales de F1 (con copyright) y los componentes caen en sus alternativas
// (Wikimedia para pilotos, silueta SVG pintada con los colores del equipo para coches).
export const OFFICIAL_MEDIA = process.env.NEXT_PUBLIC_OFFICIAL_MEDIA !== "false";

const CDN = "https://media.formula1.com/image/upload";
const VERSION = "v1740000001";

export function carImage(constructorId: string, season: number, width = 900): string | null {
  if (!OFFICIAL_MEDIA) return null;
  const year = Math.min(season, 2026);
  const slug = teamStyle(constructorId).cdn?.[year];
  if (!slug) return null;
  return `${CDN}/c_lfill,w_${width}/q_auto/${VERSION}/common/f1/${year}/${slug}/${year}${slug}carright.webp`;
}

export function teamLogo(constructorId: string, season: number, height = 96): string | null {
  if (!OFFICIAL_MEDIA) return null;
  const year = Math.min(season, 2026);
  const slug = teamStyle(constructorId).cdn?.[year];
  if (!slug) return null;
  return `${CDN}/c_fit,h_${height}/q_auto/${VERSION}/common/f1/${year}/${slug}/${year}${slug}logowhite.webp`;
}

/** OpenF1 da el recorte en tamaño "1col"; pedimos uno mayor al mismo CDN. */
export function largeHeadshot(url: string | null | undefined): string | null {
  if (!OFFICIAL_MEDIA || !url) return null;
  return url.replace("/1col/", "/4col/");
}

/** Retrato oficial de cuerpo entero (fondo transparente). Existe desde 2024 en el CDN de F1. */
export function driverBodyImage(teamSlug: string, driverCode: string, year: number, pose: "right" | "front", width = 700) {
  if (!OFFICIAL_MEDIA) return null;
  return `${CDN}/c_lfill,w_${width}/q_auto/${VERSION}/common/f1/${year}/${teamSlug}/${driverCode}/${year}${teamSlug}${driverCode}${pose}.webp`;
}
