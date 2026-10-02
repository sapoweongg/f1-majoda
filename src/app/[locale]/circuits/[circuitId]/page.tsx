import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCircuit, getCircuitWinners } from "@/lib/api/jolpica";
import { circuitFacts, trackShape } from "@/lib/circuits";
import { countryToIso } from "@/lib/countries";
import { safe } from "@/lib/safe";
import { teamColor } from "@/lib/teams";
import { TrackOutline } from "@/components/track/TrackOutline";
import { BackLink, Flag, GlassCard, SectionHeader, StatNumber } from "@/components/ui/primitives";

export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps<"/[locale]/circuits/[circuitId]">): Promise<Metadata> {
  const { circuitId } = await params;
  const c = await safe(getCircuit(circuitId), undefined);
  return { title: c?.circuitName };
}

export default async function CircuitPage({ params }: PageProps<"/[locale]/circuits/[circuitId]">) {
  const { locale, circuitId } = await params;
  setRequestLocale(locale);
  const circuit = await safe(getCircuit(circuitId), undefined);
  if (!circuit) notFound();
  const t = await getTranslations("circuit");
  const tc = await getTranslations("common");

  const winners = await safe(getCircuitWinners(circuitId), []);
  const shape = trackShape(circuitId);
  const facts = circuitFacts(circuitId);

  const counts = new Map<string, { name: string; team: string; n: number }>();
  for (const race of winners) {
    const w = race.Results?.[0];
    if (!w) continue;
    const e = counts.get(w.Driver.driverId) ?? { name: `${w.Driver.givenName} ${w.Driver.familyName}`, team: w.Constructor.constructorId, n: 0 };
    e.n++;
    counts.set(w.Driver.driverId, e);
  }
  const most = [...counts.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, 5);

  return (
    <div className="space-y-10">
      <BackLink href="/circuits">{t("allCircuits")}</BackLink>
      <section className="ember-glow relative overflow-hidden rounded-[2rem] border border-line">
        <div className="grid items-center gap-6 p-6 sm:p-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-4">
            <p className="flex items-center gap-2 text-ink-2">
              <Flag iso={countryToIso(circuit.Location.country)} />
              {circuit.Location.locality}, {circuit.Location.country}
            </p>
            <h1 className="display text-5xl sm:text-6xl">{circuit.circuitName}</h1>
            {facts && (
              <div className="grid grid-cols-2 gap-6 pt-4 sm:grid-cols-4">
                <StatNumber value={facts.km.toFixed(3)} label={`${t("length")} (km)`} size="md" />
                <StatNumber value={facts.laps} label={t("laps")} size="md" />
                <StatNumber value={facts.turns} label={t("turns")} size="md" />
                <StatNumber value={facts.distance} label={`${t("distance")} (km)`} size="md" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-6 pt-2 sm:grid-cols-4">
              {winners[0] && <StatNumber value={winners[0].season} label={t("firstGp")} size="md" />}
              <StatNumber value={winners.length} label={t("races")} size="md" />
            </div>
          </div>
          {shape && (
            <div className="relative mx-auto aspect-square w-full max-w-lg">
              <TrackOutline shape={shape} className="h-full w-full" duration={10} />
            </div>
          )}
        </div>
        <p className="px-6 pb-4 text-[10px] text-ink-3 sm:px-10">{t("layoutCredit")}</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <GlassCard>
          <SectionHeader title={t("mostWins")} />
          <ol className="space-y-3">
            {most.map(([id, e], i) => (
              <li key={id} className="flex items-center gap-3">
                <span className="display w-6 text-2xl text-ink-3">{i + 1}</span>
                <span className="h-8 w-1 rounded-full" style={{ background: teamColor(e.team) }} />
                <Link href={`/drivers/${id}`} className="flex-1 font-semibold hover:text-accent">
                  {e.name}
                </Link>
                <span className="display text-3xl">{e.n}</span>
              </li>
            ))}
          </ol>
        </GlassCard>
        <GlassCard className="p-0">
          <div className="p-5 pb-0">
            <SectionHeader title={t("winners")} />
          </div>
          <div className="scroll-x max-h-[520px] overflow-y-auto">
            <table className="data-table">
              <thead className="sticky top-0 bg-surface">
                <tr>
                  <th>{tc("season")}</th>
                  <th>{tc("driver")}</th>
                  <th>{tc("team")}</th>
                </tr>
              </thead>
              <tbody>
                {[...winners].reverse().map((race) => {
                  const w = race.Results?.[0];
                  return (
                    <tr key={`${race.season}-${race.round}`}>
                      <td>
                        <Link href={`/races/${race.season}/${race.round}`} className="display text-lg hover:text-accent">
                          {race.season}
                        </Link>
                      </td>
                      <td>{w && `${w.Driver.givenName} ${w.Driver.familyName}`}</td>
                      <td>
                        {w && (
                          <span className="flex items-center gap-2 text-ink-2">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ background: teamColor(w.Constructor.constructorId) }} />
                            {w.Constructor.name}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
