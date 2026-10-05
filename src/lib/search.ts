import { activeIn } from "./format";
import type { SearchIndex } from "./search-index";

export type SearchHit =
  | { kind: "driver"; id: string; given: string; family: string; from: number; to: number; titles: number; wins: number; years?: number[] }
  | { kind: "team"; id: string; name: string; from: number; to: number; titles: number; wins: number; years?: number[] }
  | { kind: "circuit"; id: string; name: string; locality: string; country: string; iso: string }
  | { kind: "race"; season: number; round: number; name: string; circuit: string; iso: string };

export type SearchGroups = { drivers: SearchHit[]; teams: SearchHit[]; circuits: SearchHit[]; races: SearchHit[] };

/** Minúsculas y sin tildes: "Mónaco" se encuentra escribiendo "monaco". */
export function normalize(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** Índice con los textos ya normalizados (se prepara una vez al abrir el buscador). */
export function prepareIndex(index: SearchIndex) {
  const circuits = new Map(index.circuits.map(([id, name, locality, country, iso]) => [id, { name, locality, country, iso }]));
  return {
    drivers: index.drivers.map(([id, given, family, from, to, titles, wins, years]) => ({
      hit: { kind: "driver" as const, id, given, family, from, to, titles, wins, years },
      hay: normalize(`${given} ${family}`),
      starts: [normalize(given), normalize(family)],
    })),
    teams: index.teams.map(([id, name, from, to, titles, wins, years]) => ({
      hit: { kind: "team" as const, id, name, from, to, titles, wins, years },
      hay: normalize(`${name} ${id.replace(/[_-]/g, " ")}`),
      starts: [normalize(name)],
    })),
    circuits: index.circuits.map(([id, name, locality, country, iso]) => ({
      hit: { kind: "circuit" as const, id, name, locality, country, iso },
      hay: normalize(`${name} ${locality} ${country} ${id.replace(/_/g, " ")}`),
      starts: [normalize(name), normalize(locality)],
    })),
    races: index.races.map(([season, round, name, circuitId]) => {
      const c = circuits.get(circuitId);
      return {
        hit: { kind: "race" as const, season, round, name, circuit: c?.name ?? circuitId, iso: c?.iso ?? "" },
        hay: normalize(`${name} ${c?.name ?? ""} ${c?.locality ?? ""} ${c?.country ?? ""}`),
      };
    }),
  };
}

export type PreparedIndex = ReturnType<typeof prepareIndex>;

const LIMITS = { drivers: 5, teams: 4, circuits: 4, races: 6 };

/**
 * Busca en pilotos, equipos, circuitos y carreras. Cada palabra debe aparecer; un año (p. ej. 1988)
 * filtra pilotos y equipos en activo ese año y carreras de esa temporada: "monaco 1988".
 */
export function searchIndex(index: PreparedIndex, query: string): SearchGroups {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  const years = tokens.filter((t) => /^\d{4}$/.test(t)).map(Number);
  const words = tokens.filter((t) => !/^\d{4}$/.test(t));
  const empty: SearchGroups = { drivers: [], teams: [], circuits: [], races: [] };
  if (!tokens.length) return empty;

  const hasWords = (hay: string) => words.every((w) => hay.includes(w));
  const active = (h: { from: number; to: number; years?: number[] }) => years.every((y) => activeIn(y, h.from, h.to, h.years));
  // Primero los que empiezan por lo escrito
  const startScore = (starts: string[]) => (words[0] && starts.some((s) => s.startsWith(words[0])) ? 0 : 1);

  const drivers = index.drivers
    .filter((d) => hasWords(d.hay) && active(d.hit))
    .sort((a, b) => startScore(a.starts) - startScore(b.starts) || b.hit.titles - a.hit.titles || b.hit.wins - a.hit.wins || b.hit.to - a.hit.to);
  const teams = index.teams
    .filter((t) => hasWords(t.hay) && active(t.hit))
    .sort((a, b) => startScore(a.starts) - startScore(b.starts) || b.hit.titles - a.hit.titles || b.hit.wins - a.hit.wins || b.hit.to - a.hit.to);
  // Los circuitos no tienen años en el índice: solo se buscan por texto
  const circuits = words.length
    ? index.circuits.filter((c) => hasWords(c.hay)).sort((a, b) => startScore(a.starts) - startScore(b.starts))
    : [];
  const races = index.races
    .filter((r) => (words.length || years.length) && hasWords(r.hay) && (!years.length || years.includes(r.hit.season)))
    // Con año, en orden de calendario; sin año, las más recientes primero
    .sort((a, b) => (years.length ? a.hit.season - b.hit.season || a.hit.round - b.hit.round : b.hit.season - a.hit.season || b.hit.round - a.hit.round));

  return {
    drivers: drivers.slice(0, LIMITS.drivers).map((d) => d.hit),
    teams: teams.slice(0, LIMITS.teams).map((t) => t.hit),
    circuits: circuits.slice(0, LIMITS.circuits).map((c) => c.hit),
    races: races.slice(0, LIMITS.races).map((r) => r.hit),
  };
}

export function hitHref(hit: SearchHit): string {
  switch (hit.kind) {
    case "driver":
      return `/drivers/${hit.id}`;
    case "team":
      return `/teams/${hit.id}`;
    case "circuit":
      return `/circuits/${hit.id}`;
    case "race":
      return `/races/${hit.season}/${hit.round}`;
  }
}
