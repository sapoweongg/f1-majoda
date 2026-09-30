import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCurrentSeason, getSchedule } from "@/lib/api/jolpica";
import { countryToIso } from "@/lib/countries";
import { clampSeason } from "@/lib/format";
import { getSeasonSummaries, ratingsEnabled } from "@/lib/ratings";
import { safe } from "@/lib/safe";
import { EmptyState, Flag, GlassCard, PageTitle } from "@/components/ui/primitives";
import { Stars } from "@/components/ui/Rating";
import { SeasonSelect } from "@/components/ui/SeasonSelect";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/[locale]/ratings">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ratings" });
  return { title: t("title") };
}

export default async function RatingsPage({ params, searchParams }: PageProps<"/[locale]/ratings">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations("ratings");

  const current = await safe(getCurrentSeason(), new Date().getUTCFullYear());
  const season = clampSeason(sp.season as string | undefined, current, current);
  const [schedule, summaries] = await Promise.all([safe(getSchedule(season), []), safe(getSeasonSummaries(season), [])]);
  const byRound = new Map(summaries.map((s) => [s.round, s]));
  const rated = schedule
    .map((r) => ({ race: r, s: byRound.get(Number(r.round)) }))
    .filter((x) => x.s && x.s.votes > 0)
    .sort((a, b) => b.s!.average - a.s!.average || b.s!.votes - a.s!.votes);

  return (
    <div>
      <PageTitle eyebrow={t("subtitle", { season })} title={t("title")}>
        <SeasonSelect value={season} min={2024} max={current} />
      </PageTitle>
      {!ratingsEnabled() ? (
        <EmptyState>{t("unavailable")}</EmptyState>
      ) : rated.length === 0 ? (
        <EmptyState>{t("noVotes")}</EmptyState>
      ) : (
        <ol className="space-y-3">
          {rated.map(({ race, s }, i) => (
            <li key={race.round}>
              <Link href={`/races/${season}/${race.round}`}>
                <GlassCard className="flex items-center gap-4 p-4 transition-colors hover:border-line-strong">
                  <span className="display w-10 text-center text-3xl text-ink-3">{i + 1}</span>
                  <Flag iso={countryToIso(race.Circuit.Location.country)} className="text-2xl" />
                  <div className="min-w-0 flex-1">
                    <p className="display truncate text-xl">{race.raceName}</p>
                    <p className="text-xs text-ink-3">{t("votes", { n: s!.votes })}</p>
                  </div>
                  <div className="text-right">
                    <p className="display text-4xl">{s!.average.toFixed(1)}</p>
                    <Stars value={s!.average} size={14} />
                  </div>
                </GlassCard>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
