import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { circuitFacts, trackShape } from "@/lib/circuits";
import { countryName, countryToIso } from "@/lib/countries";
import { num } from "@/lib/format";
import type { Circuit } from "@/lib/api/jolpica";
import { Flag, GlassCard } from "@/components/ui/primitives";
import { TrackOutline } from "./TrackOutline";

export async function CircuitCard({ circuit, season }: { circuit: Circuit; season: number }) {
  const t = await getTranslations("circuit");
  const locale = await getLocale();
  const shape = trackShape(circuit.circuitId, season);
  const facts = circuitFacts(circuit.circuitId);
  return (
    <GlassCard className="overflow-hidden p-0">
      <Link href={`/circuits/${circuit.circuitId}`} className="block">
        <div className="ember-glow relative aspect-[4/3]">
          {shape && <TrackOutline shape={shape} variant="flat" className="absolute inset-6" duration={11} />}
        </div>
        <div className="p-5">
          <p className="flex items-center gap-2 font-semibold">
            <Flag iso={countryToIso(circuit.Location.country)} />
            {circuit.circuitName}
          </p>
          <p className="text-xs text-ink-3">
            {circuit.Location.locality}, {countryName(circuit.Location.country, locale)}
          </p>
          {facts && (
            <dl className="mt-4 grid grid-cols-3 gap-3">
              <div>
                <dt className="eyebrow">{t("length")}</dt>
                <dd className="display text-2xl">
                  {num(facts.km, locale, 3, true)} <span className="text-xs text-ink-3">km</span>
                </dd>
              </div>
              <div>
                <dt className="eyebrow">{t("laps")}</dt>
                <dd className="display text-2xl">{facts.laps}</dd>
              </div>
              <div>
                <dt className="eyebrow">{t("turns")}</dt>
                <dd className="display text-2xl">{facts.turns}</dd>
              </div>
            </dl>
          )}
        </div>
      </Link>
    </GlassCard>
  );
}
