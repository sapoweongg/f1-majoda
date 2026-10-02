import { serverNow } from "@/lib/clock";
import { gpName } from "@/lib/gp-names";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCurrentSeason, getSchedule, getSeasonWinners } from "@/lib/api/jolpica";
import { trackShape } from "@/lib/circuits";
import { countryToIso } from "@/lib/countries";
import { cn } from "@/lib/format";
import { raceStart } from "@/lib/mapping";
import { getDriverPhotos } from "@/lib/photos";
import { safe } from "@/lib/safe";
import { teamColor } from "@/lib/teams";
import { TrackOutline } from "@/components/track/TrackOutline";
import { DriverAvatar } from "@/components/ui/media";
import { EmptyState, Flag, PageTitle } from "@/components/ui/primitives";
import { SeasonSelect } from "@/components/ui/SeasonSelect";
import { RacesTabs } from "@/components/races/RacesTabs";
import { LocalTime } from "@/components/ui/time";

export async function generateMetadata({ params }: PageProps<"/[locale]/races/[season]">): Promise<Metadata> {
  const { locale, season } = await params;
  const t = await getTranslations({ locale, namespace: "races" });
  return { title: t("title", { season }) };
}

export default async function SeasonRacesPage({ params }: PageProps<"/[locale]/races/[season]">) {
  const { locale, season: raw } = await params;
  setRequestLocale(locale);
  const season = Number(raw);
  const current = await safe(getCurrentSeason(), new Date().getUTCFullYear());
  if (!Number.isInteger(season) || season < 1950 || season > current) notFound();
  const t = await getTranslations("races");
  const tc = await getTranslations("common");
  const tcal = await getTranslations("calendar");

  const [schedule, winners] = await Promise.all([safe(getSchedule(season), []), safe(getSeasonWinners(season), [])]);
  const winnerByRound = new Map(winners.map((w) => [w.round, w.Results?.[0]]));
  const photos = await safe(
    getDriverPhotos(
      [...new Map(winners.flatMap((w) => (w.Results?.[0] ? [[w.Results[0].Driver.driverId, w.Results[0].Driver]] : []))).values()],
      season,
    ),
    {},
  );
  const now = serverNow();
  const nextRound = schedule.find((r) => raceStart(r).getTime() > now)?.round;

  return (
    <div>
      <PageTitle title={t("title", { season })}>
        <SeasonSelect value={season} max={current} basePath="/races" />
      </PageTitle>
      <RacesTabs season={season} current={current} active="results" />
      {schedule.length === 0 ? (
        <EmptyState>{tc("noData")}</EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {schedule.map((race) => {
            const w = winnerByRound.get(race.round);
            const shape = trackShape(race.Circuit.circuitId, season);
            const isNext = race.round === nextRound;
            return (
              <Link
                key={race.round}
                href={`/races/${season}/${race.round}`}
                className={cn(
                  "glass group relative flex min-h-44 flex-col justify-between overflow-hidden p-5 transition-colors hover:border-line-strong",
                  isNext && "border-accent/50",
                )}
              >
                {shape && (
                  <TrackOutline
                    shape={shape}
                    variant="mini"
                    className="absolute -right-4 -top-2 h-40 w-40 text-white/[0.07] transition-colors group-hover:text-accent/25"
                  />
                )}
                <div className="relative">
                  <p className="eyebrow flex items-center gap-2">
                    {tc("round")} {race.round}
                    {race.Sprint && <span className="chip !py-0 !text-[10px]">{tc("sprint")}</span>}
                    {isNext && <span className="chip !border-accent/40 !py-0 !text-[10px] !text-accent">{tcal("next")}</span>}
                  </p>
                  <h3 className="display mt-2 flex items-center gap-2 text-2xl">
                    <Flag iso={countryToIso(race.Circuit.Location.country)} />
                    {gpName(race.raceName, locale, true)}
                  </h3>
                  <p className="mt-1 text-xs text-ink-3">
                    {race.Circuit.Location.locality} ·{" "}
                    <LocalTime iso={raceStart(race).toISOString()} options={{ day: "numeric", month: "short" }} />
                  </p>
                </div>
                {w && (
                  <div className="relative mt-4 flex items-center gap-2">
                    <DriverAvatar
                      photo={photos[w.Driver.driverId]}
                      name={`${w.Driver.givenName} ${w.Driver.familyName}`}
                      color={teamColor(w.Constructor.constructorId)}
                      size={30}
                    />
                    <div className="text-xs leading-tight">
                      <p className="text-ink-3">{t("winner")}</p>
                      <p className="font-semibold">
                        {w.Driver.givenName} {w.Driver.familyName}
                      </p>
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
