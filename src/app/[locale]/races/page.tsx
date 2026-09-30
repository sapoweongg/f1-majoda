import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getCurrentSeason } from "@/lib/api/jolpica";
import { safe } from "@/lib/safe";

export const revalidate = 3600;

export default async function RacesIndex({ params }: PageProps<"/[locale]/races">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const season = await safe(getCurrentSeason(), new Date().getUTCFullYear());
  redirect({ href: `/races/${season}`, locale });
}
