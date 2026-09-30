import "server-only";
import { createHash } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type RatingSummary = {
  season: number;
  round: number;
  votes: number;
  average: number;
  /** votos por estrella: índice 0 = 1 estrella */
  distribution: number[];
};

export function ratingsEnabled() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

let admin: SupabaseClient | null = null;
function db() {
  if (!ratingsEnabled()) throw new Error("Supabase no configurado");
  admin ??= createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
  return admin;
}

/** Identificador anónimo del votante: no guardamos la IP, solo un hash con sal secreta. */
export function voterHash(ip: string, userAgent: string, salt = process.env.RATINGS_SALT ?? "") {
  return createHash("sha256").update(`${salt}|${ip}|${userAgent}`).digest("hex");
}

export type VoteInput = { season: number; round: number; rating: number };

export function validateVote(input: unknown, raceStartedAt: Date | null, now = new Date()): VoteInput | string {
  if (typeof input !== "object" || input === null) return "invalid";
  const { season, round, rating } = input as Record<string, unknown>;
  if (!Number.isInteger(season) || !Number.isInteger(round) || !Number.isInteger(rating)) return "invalid";
  if ((rating as number) < 1 || (rating as number) > 5) return "invalid";
  if (!raceStartedAt) return "unknown-race";
  // Se puede votar a partir de 2 h después de la salida (la carrera ya terminó)
  if (now.getTime() < raceStartedAt.getTime() + 2 * 3600 * 1000) return "not-finished";
  return { season: season as number, round: round as number, rating: rating as number };
}

export async function saveVote(vote: VoteInput, hash: string): Promise<"ok" | "duplicate"> {
  const { error } = await db().from("race_ratings").insert({ ...vote, voter_hash: hash });
  if (error?.code === "23505") return "duplicate";
  if (error) throw error;
  return "ok";
}

type SummaryRow = {
  season: number;
  round: number;
  votes: number;
  average: number;
  s1: number;
  s2: number;
  s3: number;
  s4: number;
  s5: number;
};

function toSummary(r: SummaryRow): RatingSummary {
  return {
    season: r.season,
    round: r.round,
    votes: r.votes,
    average: Number(r.average),
    distribution: [r.s1, r.s2, r.s3, r.s4, r.s5],
  };
}

export async function getSummary(season: number, round: number): Promise<RatingSummary | null> {
  if (!ratingsEnabled()) return null;
  const { data } = await db()
    .from("race_rating_summary")
    .select("*")
    .eq("season", season)
    .eq("round", round)
    .maybeSingle<SummaryRow>();
  return data ? toSummary(data) : { season, round, votes: 0, average: 0, distribution: [0, 0, 0, 0, 0] };
}

export async function getSeasonSummaries(season: number): Promise<RatingSummary[]> {
  if (!ratingsEnabled()) return [];
  const { data } = await db().from("race_rating_summary").select("*").eq("season", season);
  return ((data as SummaryRow[] | null) ?? []).map(toSummary);
}

export async function hasVoted(season: number, round: number, hash: string) {
  if (!ratingsEnabled()) return false;
  const { count } = await db()
    .from("race_ratings")
    .select("id", { count: "exact", head: true })
    .eq("season", season)
    .eq("round", round)
    .eq("voter_hash", hash);
  return (count ?? 0) > 0;
}
