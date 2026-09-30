import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const PAGES = ["", "/live", "/standings", "/races", "/compare", "/telemetry", "/calendar", "/history", "/ratings"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return PAGES.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${base}/${locale}${path}`,
      changeFrequency: path === "/live" ? ("always" as const) : ("daily" as const),
      priority: path === "" ? 1 : 0.7,
      alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, `${base}/${l}${path}`])) },
    })),
  );
}
