import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { routing } from "@/i18n/routing";
import { ratingsEnabled } from "@/lib/ratings";

const PAGES = ["", "/live", "/standings", "/races", "/drivers", "/teams", "/circuits", "/compare", "/telemetry", "/calendar", "/history"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  // Valoraciones solo cuando Supabase está configurado (si no, la página está vacía)
  const pages = ratingsEnabled() ? [...PAGES, "/ratings"] : PAGES;
  return pages.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${base}/${locale}${path}`,
      changeFrequency: path === "/live" ? ("always" as const) : ("daily" as const),
      priority: path === "" ? 1 : 0.7,
      alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, `${base}/${l}${path}`])) },
    })),
  );
}
