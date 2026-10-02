import { NextResponse } from "next/server";
import { getLatestSession } from "@/lib/api/openf1";
import { isSessionLive } from "@/lib/live-types";

export const dynamic = "force-dynamic";

/**
 * ¿Hay una sesión en pista ahora mismo? Lo consulta el menú para encender el punto de "En vivo".
 * La sesión más reciente está en caché 60 s y la respuesta también se cachea en la CDN.
 */
export async function GET() {
  try {
    const session = await getLatestSession();
    const live = session ? isSessionLive(session.date_start, session.date_end, Date.now()) : false;
    return NextResponse.json(
      { live, session: live && session ? `${session.country_name} · ${session.session_name}` : null },
      { headers: { "cache-control": "public, s-maxage=60, stale-while-revalidate=60" } },
    );
  } catch {
    return NextResponse.json({ live: false, session: null });
  }
}
