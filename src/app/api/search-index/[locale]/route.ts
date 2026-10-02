import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { buildSearchIndex } from "@/lib/search-index";

// Se genera una vez al día por idioma y se sirve estático
export const dynamic = "force-static";
export const revalidate = 86400;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/search-index/[locale]">) {
  const { locale } = await ctx.params;
  if (!(routing.locales as readonly string[]).includes(locale)) {
    return NextResponse.json({ error: "locale" }, { status: 404 });
  }
  return NextResponse.json(await buildSearchIndex(locale));
}
