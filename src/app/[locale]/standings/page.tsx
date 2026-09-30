import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  getConstructorStandings,
  getCurrentSeason,
  getDriverStandings,
  getSchedule,
  getSeasonResults,
  getSeasonSprints,
} from "@/lib/api/jolpica";
import { buildProgression, maxRemainingPoints, remainingEvents, titleContention } from "@/lib/championship";
import { nationalityToIso } from "@/lib/countries";
import { clampSeason } from "@/lib/format";
import { teamLogo } from "@/lib/media";
import { getDriverPhotos } from "@/lib/photos";
import { safe } from "@/lib/safe";
import { teamColor } from "@/lib/teams";
import { progressionSeries } from "@/lib/view";
import { LineSeriesChart } from "@/components/charts/LineSeriesChart";
import { ContentionPanel } from "@/components/standings/ContentionPanel";
import { StandingsTable, type StandingRow } from "@/components/standings/StandingsTable";
import { EmptyState, GlassCard, PageTitle, SectionHeader, TabLinks } from "@/components/ui/primitives";
import { SeasonSelect } from "@/components/ui/SeasonSelect";

export async function generateMetadata({ params }: PageProps<"/[locale]/standings">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("standings") };
}

export default async function StandingsPage({ params, searchParams }: PageProps<"/[locale]/standings">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations("standings");
  const tc = await getTranslations("common");

  const current = await safe(getCurrentSeason(), new Date().getUTCFullYear());
  const season = clampSeason(sp.season as string | undefined, current, current);
  const view = sp.view === "constructors" ? "constructors" : "drivers";
  const kind = view === "drivers" ? "driver" : "constructor";

  const [ds, cs, schedule, results, sprints] = await Promise.all([
    safe(getDriverStandings(season), { round: 0, standings: [] }),
    safe(getConstructorStandings(season), { round: 0, standings: [] }),
    safe(getSchedule(season), []),
    safe(getSeasonResults(season), []),
    safe(getSeasonSprints(season), []),
  ]);

  const photos = view === "drivers" ? await safe(getDriverPhotos(ds.standings.map((s) => s.Driver), season), {}) : {};

  const rows: StandingRow[] =
    view === "drivers"
      ? ds.standings.map((s) => ({
          id: s.Driver.driverId,
          href: `/drivers/${s.Driver.driverId}`,
          position: s.position ?? s.positionText,
          name: `${s.Driver.givenName} ${s.Driver.familyName}`,
          sub: s.Constructors.map((c) => c.name).join(" / "),
          color: teamColor(s.Constructors.at(-1)?.constructorId),
          points: Number(s.points),
          wins: Number(s.wins),
          iso: nationalityToIso(s.Driver.nationality),
          photo: photos[s.Driver.driverId],
          kind: "driver",
        }))
      : cs.standings.map((s) => ({
          id: s.Constructor.constructorId,
          href: `/teams/${s.Constructor.constructorId}`,
          position: s.position ?? s.positionText,
          name: s.Constructor.name,
          sub: s.Constructor.nationality ?? "",
          color: teamColor(s.Constructor.constructorId),
          points: Number(s.points),
          wins: Number(s.wins),
          logo: teamLogo(s.Constructor.constructorId, season),
          kind: "constructor",
        }));

  const progression = buildProgression(results, sprints, kind);
  const topN = 8;
  const showAll = sp.all === "1";
  const chartIds = rows.slice(0, showAll ? rows.length : topN).map((r) => r.id);
  const series = progressionSeries(progression, chartIds);

  const lastRound = view === "drivers" ? ds.round : cs.round;
  const remaining = remainingEvents(schedule, lastRound);
  const maxLeft = maxRemainingPoints(remaining, kind);
  const contention = titleContention(
    rows.map((r) => ({ id: r.id, points: r.points })),
    remaining,
    kind,
  ).slice(0, 8);
  const names = Object.fromEntries(rows.map((r) => [r.id, r.name]));
  const colors = Object.fromEntries(rows.map((r) => [r.id, r.color]));

  const q = (extra: Record<string, string>) => {
    const params = new URLSearchParams({ season: String(season), view, ...extra });
    return `/standings?${params.toString()}`;
  };

  return (
    <div>
      <PageTitle eyebrow={lastRound ? t("afterRound", { round: lastRound }) : undefined} title={t("title", { season })}>
        <SeasonSelect value={season} max={current} />
      </PageTitle>

      <TabLinks
        active={view}
        items={[
          { key: "drivers", label: t("drivers"), href: q({ view: "drivers" }) },
          { key: "constructors", label: t("constructors"), href: q({ view: "constructors" }), disabled: season < 1958 },
        ]}
      />

      {rows.length === 0 ? (
        <EmptyState>{tc("noData")}</EmptyState>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
          <StandingsTable
            rows={rows}
            labels={{
              pos: tc("pos"),
              name: view === "drivers" ? tc("driver") : tc("team"),
              points: tc("points"),
              wins: tc("wins"),
              gap: tc("gap"),
            }}
          />

          <div className="space-y-6">
            <GlassCard>
              <SectionHeader
                title={t("calculator")}
                className="mb-2"
              />
              <p className="mb-5 text-sm text-ink-2">
                {remaining.races > 0
                  ? t(view === "drivers" ? "remaining" : "remainingTeams", {
                      races: remaining.races,
                      sprints: remaining.sprints,
                      points: maxLeft,
                    })
                  : t("seasonFinished")}
              </p>
              <ContentionPanel
                rows={contention}
                names={names}
                colors={colors}
                labels={{
                  champion: t("statusChampion"),
                  leader: t("statusLeader"),
                  contender: t("statusContender"),
                  eliminated: t("statusEliminated"),
                  maxPossible: t("maxPossible"),
                  toClinch: (points) => t("toClinch", { points }),
                  clinched: t("clinched"),
                  behind: (points) => t("behind", { points }),
                }}
              />
            </GlassCard>
          </div>

          {progression.rounds.length > 1 && (
            <GlassCard className="xl:col-span-2">
              <SectionHeader
                title={t("progression")}
                action={
                  rows.length > topN
                    ? { href: q(showAll ? {} : { all: "1" }), label: showAll ? t("showTop", { n: topN }) : t("showAll") }
                    : undefined
                }
              />
              <p className="-mt-2 mb-4 text-xs text-ink-3">{t("progressionNote")}</p>
              <LineSeriesChart
                labels={progression.rounds.map((r) => String(r.round))}
                fullLabels={progression.rounds.map((r) => `${r.round}. ${r.raceName}`)}
                series={series}
                height={380}
                tableLabel={tc("table")}
                chartLabel={tc("chart")}
              />
            </GlassCard>
          )}
        </div>
      )}
    </div>
  );
}
