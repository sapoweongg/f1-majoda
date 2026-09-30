import { NextResponse } from "next/server";
import { buildLiveSnapshot } from "@/lib/live";

export const dynamic = "force-dynamic";

/**
 * Foto agregada del timing en vivo. Cada recurso de OpenF1 tiene su propia caché corta, así que
 * el número de peticiones a OpenF1 no depende de cuántos visitantes estén mirando.
 */
export async function GET() {
  try {
    const snapshot = await buildLiveSnapshot();
    return NextResponse.json(snapshot, {
      headers: { "cache-control": "public, s-maxage=3, stale-while-revalidate=5" },
    });
  } catch (err) {
    console.error("[live]", err);
    return NextResponse.json({ mode: "idle", error: "unavailable" }, { status: 503 });
  }
}
