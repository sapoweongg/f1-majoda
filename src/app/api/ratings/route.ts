import { NextResponse, type NextRequest } from "next/server";
import { getSchedule } from "@/lib/api/jolpica";
import { raceStart } from "@/lib/mapping";
import { getSummary, ratingsEnabled, saveVote, validateVote, voterHash } from "@/lib/ratings";

export const dynamic = "force-dynamic";

// Límite sencillo por instancia: 10 intentos cada 10 minutos por IP.
const attempts = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const list = (attempts.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  list.push(now);
  attempts.set(ip, list);
  if (attempts.size > 5000) attempts.clear();
  return list.length > 10;
}

function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "0.0.0.0";
}

export async function GET(req: NextRequest) {
  const season = Number(req.nextUrl.searchParams.get("season"));
  const round = Number(req.nextUrl.searchParams.get("round"));
  if (!Number.isInteger(season) || !Number.isInteger(round)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  if (!ratingsEnabled()) return NextResponse.json({ summary: null });
  try {
    const summary = await getSummary(season, round);
    return NextResponse.json(
      { summary },
      { headers: { "cache-control": "public, s-maxage=30, stale-while-revalidate=60" } },
    );
  } catch {
    return NextResponse.json({ summary: null });
  }
}

export async function POST(req: NextRequest) {
  if (!ratingsEnabled()) return NextResponse.json({ error: "disabled" }, { status: 503 });
  const ip = clientIp(req);
  if (limited(ip)) return NextResponse.json({ error: "rate-limited" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const season = Number(body?.season);
  const round = Number(body?.round);
  let start: Date | null = null;
  if (Number.isInteger(season) && Number.isInteger(round)) {
    try {
      const race = (await getSchedule(season)).find((r) => Number(r.round) === round);
      start = race ? raceStart(race) : null;
    } catch {
      return NextResponse.json({ error: "unavailable" }, { status: 503 });
    }
  }
  const vote = validateVote(body, start);
  if (typeof vote === "string") return NextResponse.json({ error: vote }, { status: 400 });

  try {
    const hash = voterHash(ip, req.headers.get("user-agent") ?? "");
    const result = await saveVote(vote, hash);
    if (result === "duplicate") return NextResponse.json({ error: "duplicate" }, { status: 409 });
    return NextResponse.json({ ok: true, summary: await getSummary(vote.season, vote.round) });
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
