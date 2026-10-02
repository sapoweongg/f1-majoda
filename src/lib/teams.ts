// Colores de equipo por constructorId de Jolpica. Los de 2026 vienen de OpenF1 (team_colour).
export type TeamStyle = {
  color: string;
  /** Segundo color de la librea, para degradados. */
  accent: string;
  /** Slug del CDN de formula1.com por año (solo existen imágenes 2024+). */
  cdn?: Partial<Record<number, string>>;
};

const TEAMS: Record<string, TeamStyle> = {
  mercedes: { color: "#00D7B6", accent: "#0B0B0F", cdn: { 2024: "mercedes", 2025: "mercedes", 2026: "mercedes" } },
  ferrari: { color: "#ED1131", accent: "#FFD600", cdn: { 2024: "ferrari", 2025: "ferrari", 2026: "ferrari" } },
  mclaren: { color: "#F47600", accent: "#1B1B1B", cdn: { 2024: "mclaren", 2025: "mclaren", 2026: "mclaren" } },
  red_bull: { color: "#4781D7", accent: "#FFC906", cdn: { 2024: "redbullracing", 2025: "redbullracing", 2026: "redbullracing" } },
  aston_martin: { color: "#229971", accent: "#CEDC00", cdn: { 2024: "astonmartin", 2025: "astonmartin", 2026: "astonmartin" } },
  alpine: { color: "#00A1E8", accent: "#FF87BC", cdn: { 2024: "alpine", 2025: "alpine", 2026: "alpine" } },
  williams: { color: "#1868DB", accent: "#00A3E0", cdn: { 2024: "williams", 2025: "williams", 2026: "williams" } },
  rb: { color: "#6C98FF", accent: "#E8E8E8", cdn: { 2024: "rb", 2025: "racingbulls", 2026: "racingbulls" } },
  haas: { color: "#9C9FA2", accent: "#E10600", cdn: { 2024: "haas", 2025: "haas", 2026: "haas" } },
  audi: { color: "#F50537", accent: "#BBBBBB", cdn: { 2026: "audi" } },
  cadillac: { color: "#C9CBCC", accent: "#1E1E1E", cdn: { 2026: "cadillac" } },
  sauber: { color: "#52E252", accent: "#1E1E1E", cdn: { 2024: "kicksauber", 2025: "kicksauber" } },
  // Históricos
  alfa: { color: "#A42134", accent: "#FFFFFF" },
  alphatauri: { color: "#4E7C9B", accent: "#FFFFFF" },
  toro_rosso: { color: "#469BFF", accent: "#E30118" },
  racing_point: { color: "#F596C8", accent: "#1E5BC6" },
  force_india: { color: "#F596C8", accent: "#FF8000" },
  renault: { color: "#FFF500", accent: "#000000" },
  lotus_f1: { color: "#FFB800", accent: "#000000" },
  team_lotus: { color: "#1C6E3C", accent: "#FFD500" },
  lotus: { color: "#1C6E3C", accent: "#FFD500" },
  brawn: { color: "#D5FF00", accent: "#FFFFFF" },
  toyota: { color: "#E0E0E0", accent: "#CC0000" },
  honda: { color: "#E8E8E8", accent: "#CC0000" },
  bar: { color: "#E8E8E8", accent: "#CC0000" },
  jaguar: { color: "#0B5E2B", accent: "#FFFFFF" },
  jordan: { color: "#F9D71C", accent: "#000000" },
  benetton: { color: "#00A3E0", accent: "#43B02A" },
  minardi: { color: "#1A1A1A", accent: "#FFD200" },
  prost: { color: "#1F4E9B", accent: "#FFFFFF" },
  stewart: { color: "#FFFFFF", accent: "#0B3C8A" },
  tyrrell: { color: "#0B3C8A", accent: "#FFFFFF" },
  brabham: { color: "#1F5CA8", accent: "#FFFFFF" },
  ligier: { color: "#1F5CA8", accent: "#FFFFFF" },
  arrows: { color: "#FF8C00", accent: "#000000" },
  march: { color: "#E8E8E8", accent: "#D00000" },
  matra: { color: "#1C4FA0", accent: "#FFFFFF" },
  cooper: { color: "#1B5E20", accent: "#FFFFFF" },
  brm: { color: "#3E5A3A", accent: "#FF8800" },
  vanwall: { color: "#0E4D2E", accent: "#FFFFFF" },
  maserati: { color: "#C8102E", accent: "#FFFFFF" },
  manor: { color: "#E10600", accent: "#1E1E1E" },
  marussia: { color: "#E10600", accent: "#1E1E1E" },
  caterham: { color: "#005030", accent: "#FFD500" },
  hrt: { color: "#B7A369", accent: "#1E1E1E" },
  virgin: { color: "#C80815", accent: "#1E1E1E" },
  spyker: { color: "#FF6600", accent: "#1E1E1E" },
  super_aguri: { color: "#E10600", accent: "#FFFFFF" },
  wolf: { color: "#1A1A1A", accent: "#D4AF37" },
  shadow: { color: "#1A1A1A", accent: "#FFFFFF" },
  hesketh: { color: "#FFFFFF", accent: "#D00000" },
  surtees: { color: "#E8E8E8", accent: "#D00000" },
};

// Paleta de respaldo para equipos sin color definido (asignación estable por id).
const FALLBACK = ["#8E8E93", "#A2845E", "#5E8C6A", "#8C6A9E", "#6A8CA8", "#B07A5A"];

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

export function teamStyle(constructorId: string | undefined): TeamStyle {
  if (!constructorId) return { color: FALLBACK[0], accent: "#1E1E1E" };
  // Jolpica usa ids compuestos para chasis-motor antiguos, p. ej. "cooper-climax".
  const base = constructorId.split("-")[0];
  return (
    TEAMS[constructorId] ??
    TEAMS[base] ?? { color: FALLBACK[hash(constructorId) % FALLBACK.length], accent: "#1E1E1E" }
  );
}

export const teamColor = (constructorId?: string) => teamStyle(constructorId).color;

/** Relación nombre de equipo en OpenF1 → constructorId de Jolpica. */
const OPENF1_TEAM: Record<string, string> = {
  mercedes: "mercedes",
  ferrari: "ferrari",
  mclaren: "mclaren",
  "red bull racing": "red_bull",
  "aston martin": "aston_martin",
  alpine: "alpine",
  williams: "williams",
  "racing bulls": "rb",
  rb: "rb",
  "haas f1 team": "haas",
  audi: "audi",
  cadillac: "cadillac",
  "kick sauber": "sauber",
  sauber: "sauber",
  alphatauri: "alphatauri",
  "alfa romeo": "alfa",
};

export function constructorIdFromOpenF1(teamName: string | null | undefined) {
  return teamName ? OPENF1_TEAM[teamName.toLowerCase()] : undefined;
}

/**
 * Equipo al que pertenece un id de Jolpica. En los años 50-70 Jolpica separa chasis y motor
 * ("lotus-climax", "brabham-repco", "cooper-climax"): cuentan como su equipo.
 */
const FAMILY: Record<string, string> = { lotus: "team_lotus" };

export function teamFamily(constructorId: string) {
  const base = constructorId.split("-")[0];
  return FAMILY[base] ?? base;
}
