import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCurrentSeason, getSchedule } from "@/lib/api/jolpica";
import { trackShape } from "@/lib/circuits";
import { serverNow } from "@/lib/clock";
import { countryToIso } from "@/lib/countries";
import { cn, yearSpan } from "@/lib/format";
import { raceStart } from "@/lib/mapping";
import { getCircuitIndex } from "@/lib/races-index";
import { safe } from "@/lib/safe";
import { nextRace } from "@/lib/view";
import { TrackOutline } from "@/components/track/TrackOutline";
import { Directory, type DirectoryItem } from "@/components/ui/Directory";
import { Flag, PageTitle, SectionHeader } from "@/components/ui/primitives";

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/[locale]/circuits">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "circuits" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function CircuitsPage({ params }: PageProps<"/[locale]/circuits">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("circuits");
  const tcal = await getTranslations("calendar");

  const now = serverNow();
  const current = await safe(getCurrentSeason(), new Date().getUTCFullYear());
  const [schedule, index] = await Promise.all([safe(getSchedule(current), []), getCircuitIndex(current, now)]);
  const next = nextRace(schedule, new Date(now));

  const regions = new Intl.DisplayNames([locale], { type: "region" });
  const countryName = (country: string) => {
    const iso = countryToIso(country);
    return (iso && regions.of(iso.toUpperCase())) || country;
  };
  const day = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", timeZone: "UTC" });

  const items: DirectoryItem[] = index.map((c) => ({
    id: c.id,
    href: `/circuits/${c.id}`,
    name: c.name,
    meta: [c.locality, yearSpan(c.from, c.to), t("races", { n: c.races })].join(" · "),
    iso: countryToIso(c.country),
    search: `${c.locality} ${c.country} ${countryName(c.country)} ${c.id.replace(/_/g, " ")}`,
    from: c.from,
    to: c.to,
    wins: 0,
    titles: 0,
    count: c.races,
  }));

  return (
    <div>
      <PageTitle eyebrow={t("subtitle")} title={t("title")} />
      <Directory items={items} current={current} namespace="circuits" filters={["active"]} sorts={["recent", "count", "name"]}>
        {schedule.length > 0 && (
          <section>
            <SectionHeader eyebrow={t("gridHint")} title={t("grid", { season: current })} />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {schedule.map((race) => {
                const shape = trackShape(race.Circuit.circuitId, current);
                const done = raceStart(race).getTime() < now;
                const isNext = next?.round === race.round;
                return (
                  <Link
                    key={race.round}
                    href={`/circuits/${race.Circuit.circuitId}`}
                    className={cn(
                      "glass group flex items-center gap-4 p-4 transition-colors hover:border-line-strong",
                      isNext && "!border-accent/50",
                    )}
                  >
                    <span
                      className={cn(
                        "h-16 w-16 shrink-0 transition-colors group-hover:text-accent",
                        done ? "text-ink-3" : "text-ink-2",
                        isNext && "text-accent",
                      )}
                    >
                      {shape && <TrackOutline shape={shape} variant="mini" className="h-full w-full" />}
                    </span>
                    <span className="min-w-0">
                      <span className="eyebrow flex items-center gap-2">
                        {t("round", { n: race.round })} · {day.format(new Date(`${race.date}T00:00:00Z`))}
                        {isNext && <span className="text-accent">{tcal("next")}</span>}
                      </span>
                      <span className="mt-0.5 block truncate font-semibold">{race.Circuit.circuitName}</span>
                      <span className="flex items-center gap-1.5 truncate text-xs text-ink-3">
                        <Flag iso={countryToIso(race.Circuit.Location.country)} />
                        {race.Circuit.Location.locality}, {countryName(race.Circuit.Location.country)}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </Directory>
    </div>
  );
}
