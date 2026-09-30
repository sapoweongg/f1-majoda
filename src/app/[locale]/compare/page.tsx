import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  getCurrentSeason,
  getSeasonDrivers,
  getSeasonQualifying,
  getSeasonResults,
  getSeasonSprints,
  type Driver,
} from "@/lib/api/jolpica";
import { buildProgression } from "@/lib/championship";
import { distinctPair } from "@/lib/color";
import { headToHead, roundByRound, seasonStats } from "@/lib/compare";
import { nationalityToIso } from "@/lib/countries";
import { clampSeason } from "@/lib/format";
import { getDriverPhotos, type Photo } from "@/lib/photos";
import { safe } from "@/lib/safe";
import { teamColor } from "@/lib/teams";
import { H2HBar } from "@/components/compare/H2HBar";
import { LineSeriesChart } from "@/components/charts/LineSeriesChart";
import { DriverHero } from "@/components/ui/media";
import { EmptyState, Flag, GlassCard, PageTitle, SectionHeader } from "@/components/ui/primitives";
import { ParamSelect, SeasonSelect } from "@/components/ui/SeasonSelect";

function CompareHeader({
  driver: d,
  photo,
  points,
  color,
  side,
  ptsLabel,
}: {
  driver: Driver;
  photo?: Photo;
  points: number;
  color: string;
  side: "a" | "b";
  ptsLabel: string;
}) {
  return (
    <div
      className={`relative flex h-56 overflow-hidden rounded-[1.75rem] border border-white/10 sm:h-64 ${side === "b" ? "flex-row-reverse text-right" : ""}`}
      style={{ background: `radial-gradient(120% 120% at ${side === "a" ? "0% 100%" : "100% 100%"}, ${color}cc 0%, #111114 70%)` }}
    >
      <div className="relative z-10 flex flex-1 flex-col justify-end p-5 [text-shadow:0_2px_14px_rgb(0_0_0/0.65)]">
        <Flag iso={nationalityToIso(d.nationality)} className="mb-2 text-sm" />
        <p className="text-sm text-white/75">{d.givenName}</p>
        <Link href={`/drivers/${d.driverId}`} className="display text-3xl uppercase sm:text-4xl">
          {d.familyName}
        </Link>
        <p className="display mt-2 text-5xl">
          {points} <span className="text-xs uppercase tracking-widest text-white/60">{ptsLabel}</span>
        </p>
      </div>
      {photo && (
        <DriverHero
          photo={photo}
          name={`${d.givenName} ${d.familyName}`}
          className={`absolute bottom-0 h-[105%] w-auto ${side === "a" ? "right-0" : "left-0 -scale-x-100"}`}
        />
      )}
    </div>
  );
}

export async function generateMetadata({ params }: PageProps<"/[locale]/compare">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "compare" });
  return { title: t("title") };
}

export default async function ComparePage({ params, searchParams }: PageProps<"/[locale]/compare">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations("compare");
  const tc = await getTranslations("common");

  const current = await safe(getCurrentSeason(), new Date().getUTCFullYear());
  const season = clampSeason(sp.season as string | undefined, current, current);
  const [results, sprints, qualifying, drivers] = await Promise.all([
    safe(getSeasonResults(season), []),
    safe(getSeasonSprints(season), []),
    safe(getSeasonQualifying(season), []),
    safe(getSeasonDrivers(season), []),
  ]);

  const progression = buildProgression(results, sprints, "driver");
  const ranked = progression.rows.map((r) => r.id);
  // Equipo más reciente de cada piloto
  const teamOf = new Map(progression.rows.map((r) => [r.id, r.teamId]));
  const byId = new Map(drivers.map((d) => [d.driverId, d]));
  const ordered = [...ranked.filter((id) => byId.has(id)), ...drivers.map((d) => d.driverId).filter((id) => !ranked.includes(id))];

  // Por defecto: el líder contra su compañero de equipo
  const defA = ordered[0];
  const defB = ordered.find((id) => id !== defA && teamOf.get(id) === teamOf.get(defA)) ?? ordered[1];
  const aId = typeof sp.a === "string" && byId.has(sp.a) ? sp.a : defA;
  const bId = typeof sp.b === "string" && byId.has(sp.b) ? sp.b : defB;

  const options = ordered.map((id) => {
    const d = byId.get(id)!;
    return { value: id, label: `${d.givenName} ${d.familyName}` };
  });

  if (!aId || !bId) {
    return (
      <div>
        <PageTitle title={t("title")}>
          <SeasonSelect value={season} max={current} resetParams={["a", "b"]} />
        </PageTitle>
        <EmptyState>{tc("noData")}</EmptyState>
      </div>
    );
  }

  const A = byId.get(aId)!;
  const B = byId.get(bId)!;
  const same = aId === bId;
  const photos = await safe(getDriverPhotos([A, B], season), {});
  const pair = distinctPair(teamColor(teamOf.get(aId)), teamColor(teamOf.get(bId)));
  const sa = seasonStats(aId, results, sprints, qualifying);
  const sb = seasonStats(bId, results, sprints, qualifying);
  const h2h = headToHead(aId, bId, results, qualifying);
  const rbr = roundByRound([aId, bId], results);
  const rowA = progression.rows.find((r) => r.id === aId);
  const rowB = progression.rows.find((r) => r.id === bId);

  // Sugerencias de parejas de compañeros de equipo
  const teams = new Map<string, string[]>();
  for (const r of progression.rows) teams.set(r.teamId, [...(teams.get(r.teamId) ?? []), r.id]);
  const pairs = [...teams.values()].filter((ids) => ids.length >= 2).map((ids) => ids.slice(0, 2));

  return (
    <div>
      <PageTitle eyebrow={t("subtitle")} title={t("title")}>
        <SeasonSelect value={season} max={current} resetParams={["a", "b"]} />
      </PageTitle>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <ParamSelect param="a" value={aId} options={options} label={t("driverA")} />
        <ParamSelect param="b" value={bId} options={options} label={t("driverB")} />
      </div>
      {pairs.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-1">{t("teammates")}</span>
          {pairs.map(([x, y]) => (
            <Link
              key={`${x}-${y}`}
              href={`/compare?season=${season}&a=${x}&b=${y}`}
              className="chip hover:text-ink"
            >
              <span className="h-2 w-2 rounded-full" style={{ background: teamColor(teamOf.get(x)) }} />
              {byId.get(x)?.code ?? byId.get(x)?.familyName} · {byId.get(y)?.code ?? byId.get(y)?.familyName}
            </Link>
          ))}
        </div>
      )}

      {same ? (
        <EmptyState>{t("pickTwo")}</EmptyState>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <CompareHeader driver={A} photo={photos[aId]} points={sa.points} color={teamColor(teamOf.get(aId))} side="a" ptsLabel={tc("pts")} />
            <CompareHeader driver={B} photo={photos[bId]} points={sb.points} color={teamColor(teamOf.get(bId))} side="b" ptsLabel={tc("pts")} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <GlassCard className="space-y-5">
              <SectionHeader title={t("headToHead")} className="mb-0" />
              <H2HBar label={t("h2hQuali")} a={h2h.quali.a} b={h2h.quali.b} colorA={pair.a} colorB={pair.b} />
              <H2HBar label={t("h2hRace")} a={h2h.race.a} b={h2h.race.b} colorA={pair.a} colorB={pair.b} />
              <H2HBar label={tc("points")} a={sa.points} b={sb.points} colorA={pair.a} colorB={pair.b} />
              <H2HBar label={tc("wins")} a={sa.wins} b={sb.wins} colorA={pair.a} colorB={pair.b} />
              <H2HBar label={tc("podiums")} a={sa.podiums} b={sb.podiums} colorA={pair.a} colorB={pair.b} />
              <H2HBar label={tc("poles")} a={sa.poles} b={sb.poles} colorA={pair.a} colorB={pair.b} />
            </GlassCard>
            <GlassCard className="space-y-5">
              <SectionHeader title={tc("season") + " " + season} className="mb-0" />
              <H2HBar label={t("avgGrid")} a={sa.avgGrid} b={sb.avgGrid} colorA={pair.a} colorB={pair.b} lowerIsBetter format={(v) => v.toFixed(1)} />
              <H2HBar label={t("avgFinish")} a={sa.avgFinish} b={sb.avgFinish} colorA={pair.a} colorB={pair.b} lowerIsBetter format={(v) => v.toFixed(1)} />
              <H2HBar label={t("bestFinish")} a={sa.bestFinish} b={sb.bestFinish} colorA={pair.a} colorB={pair.b} lowerIsBetter />
              <H2HBar label={t("dnfs")} a={sa.dnfs} b={sb.dnfs} colorA={pair.a} colorB={pair.b} lowerIsBetter />
              <H2HBar
                label={t("gained")}
                a={Math.max(0, sa.gained)}
                b={Math.max(0, sb.gained)}
                colorA={pair.a}
                colorB={pair.b}
              />
            </GlassCard>
          </div>

          {rowA && rowB && progression.rounds.length > 1 && (
            <GlassCard>
              <SectionHeader title={tc("points")} />
              <LineSeriesChart
                labels={progression.rounds.map((r) => String(r.round))}
                fullLabels={progression.rounds.map((r) => `${r.round}. ${r.raceName}`)}
                series={[
                  { id: aId, label: `${A.givenName} ${A.familyName}`, color: pair.a, values: rowA.cumulative },
                  { id: bId, label: `${B.givenName} ${B.familyName}`, color: pair.b, dashed: pair.bDashed, values: rowB.cumulative },
                ]}
                height={320}
                tableLabel={tc("table")}
                chartLabel={tc("chart")}
              />
            </GlassCard>
          )}

          <GlassCard className="p-0">
            <div className="p-5 pb-0">
              <SectionHeader title={t("roundByRound")} />
            </div>
            <div className="scroll-x">
              <table className="data-table num">
                <thead>
                  <tr>
                    <th>{tc("round")}</th>
                    <th className="text-right">{A.code ?? A.familyName}</th>
                    <th className="text-right">{B.code ?? B.familyName}</th>
                  </tr>
                </thead>
                <tbody>
                  {rbr.map((r) => {
                    const [pa, pb] = r.positions;
                    const aAhead = pa && pb && pa.pos < pb.pos;
                    const bAhead = pa && pb && pb.pos < pa.pos;
                    return (
                      <tr key={r.round}>
                        <td>
                          <Link href={`/races/${season}/${r.round}`} className="text-ink-2 hover:text-ink">
                            {r.round}. {r.raceName}
                          </Link>
                        </td>
                        <td className={`text-right ${aAhead ? "font-semibold text-ink" : "text-ink-3"}`}>
                          {pa?.label ?? "—"}
                        </td>
                        <td className={`text-right ${bAhead ? "font-semibold text-ink" : "text-ink-3"}`}>
                          {pb?.label ?? "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
