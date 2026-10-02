import { getTranslations } from "next-intl/server";
import { TabLinks } from "@/components/ui/primitives";

/** Pestañas que unen "Carreras" (resultados de la temporada) y el calendario, que en el menú van juntos. */
export async function RacesTabs({ season, current, active }: { season: number; current: number; active: "results" | "calendar" }) {
  const tr = await getTranslations("races");
  const tn = await getTranslations("nav");
  return (
    <TabLinks
      active={active}
      items={[
        { key: "results", label: tr("results"), href: `/races/${Math.min(season, current)}` },
        { key: "calendar", label: tn("calendar"), href: `/calendar?season=${season}` },
      ]}
    />
  );
}
