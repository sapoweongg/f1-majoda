import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import championsData from "@/data/champions.json";
import { Link } from "@/i18n/navigation";
import { getConstructorStandings, getCurrentSeason, getDriverStandings, type Driver } from "@/lib/api/jolpica";
import { nationalityToIso } from "@/lib/countries";
import { getDriverPhotos } from "@/lib/photos";
import { safe } from "@/lib/safe";
import { teamColor } from "@/lib/teams";
import { DriverAvatar, DriverHero } from "@/components/ui/media";
import { Flag, GlassCard, PageTitle, SectionHeader } from "@/components/ui/primitives";

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/[locale]/history">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "history" });
  return { title: t("title") };
}

type Champ = {
  season: number;
  driver: {
    driverId: string;
    givenName: string;
    familyName: string;
    nationality: string;
    code: string | null;
    url: string;
    constructorId: string;
    constructorName: string;
    points: number;
    wins: number;
  } | null;
  constructor: { constructorId: string; name: string; nationality: string; points: number; wins: number } | null;
};
const champions = championsData as Champ[];

export default async function HistoryPage({ params }: PageProps<"/[locale]/history">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("history");
  const tc = await getTranslations("common");

  const current = await safe(getCurrentSeason(), new Date().getUTCFullYear());
  const lastStatic = champions.at(-1)?.season ?? 2025;
  // Temporadas posteriores al archivo estático: líder actual "en curso"
  const extra: (Champ & { live: true })[] = [];
  for (let season = lastStatic + 1; season <= current; season++) {
    const [ds, cs] = await Promise.all([
      safe(getDriverStandings(season), { round: 0, standings: [] }),
      safe(getConstructorStandings(season), { round: 0, standings: [] }),
    ]);
    const d = ds.standings[0];
    const c = cs.standings[0];
    if (!d) continue;
    extra.push({
      season,
      live: true,
      driver: {
        driverId: d.Driver.driverId,
        givenName: d.Driver.givenName,
        familyName: d.Driver.familyName,
        nationality: d.Driver.nationality ?? "",
        code: d.Driver.code ?? null,
        url: d.Driver.url ?? "",
        constructorId: d.Constructors.at(-1)?.constructorId ?? "",
        constructorName: d.Constructors.at(-1)?.name ?? "",
        points: Number(d.points),
        wins: Number(d.wins),
      },
      constructor: c
        ? {
            constructorId: c.Constructor.constructorId,
            name: c.Constructor.name,
            nationality: c.Constructor.nationality ?? "",
            points: Number(c.points),
            wins: Number(c.wins),
          }
        : null,
    });
  }
  const rows: (Champ & { live?: boolean })[] = [...extra.reverse(), ...[...champions].reverse()];

  // Ranking de títulos (solo temporadas cerradas)
  const titles = new Map<string, { driver: NonNullable<Champ["driver"]>; seasons: number[] }>();
  for (const c of champions) {
    if (!c.driver) continue;
    const e = titles.get(c.driver.driverId) ?? { driver: c.driver, seasons: [] };
    e.seasons.push(c.season);
    titles.set(c.driver.driverId, e);
  }
  const top = [...titles.values()].sort((a, b) => b.seasons.length - a.seasons.length || a.seasons[0] - b.seasons[0]).slice(0, 8);

  const unique = new Map<string, Driver>();
  for (const r of rows) {
    if (r.driver && !unique.has(r.driver.driverId)) {
      unique.set(r.driver.driverId, {
        driverId: r.driver.driverId,
        givenName: r.driver.givenName,
        familyName: r.driver.familyName,
        code: r.driver.code ?? undefined,
        url: r.driver.url,
      });
    }
  }
  // Fotos de la temporada más reciente de cada piloto (recorte oficial si corrió desde 2023)
  const photos = await safe(getDriverPhotos([...unique.values()], current), {});

  return (
    <div className="space-y-12">
      <PageTitle eyebrow={t("subtitle")} title={t("title")} />

      <section>
        <SectionHeader title={t("mostTitles")} />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {top.map(({ driver, seasons }) => {
            const color = teamColor(driver.constructorId);
            const photo = photos[driver.driverId];
            return (
              <Link
                key={driver.driverId}
                href={`/drivers/${driver.driverId}`}
                className="group relative block h-60 overflow-hidden rounded-[1.5rem] border border-white/10"
                style={{ background: `radial-gradient(120% 90% at 50% 110%, ${color}cc, #111114 70%)` }}
              >
                {photo && (
                  <DriverHero
                    photo={photo}
                    name={`${driver.givenName} ${driver.familyName}`}
                    className={photo.cutout ? "absolute bottom-0 left-1/2 h-[88%] w-auto -translate-x-1/2" : "absolute inset-0"}
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-12">
                  <p className="display text-5xl text-yellow">{seasons.length}</p>
                  <p className="font-semibold">
                    {driver.givenName} <span className="uppercase">{driver.familyName}</span>
                  </p>
                  <p className="truncate text-[11px] text-ink-2">{seasons.join(" · ")}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <GlassCard className="p-0">
          <div className="scroll-x">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{tc("season")}</th>
                  <th>{t("driversChampion")}</th>
                  <th className="text-right">{tc("points")}</th>
                  <th className="text-right">{tc("wins")}</th>
                  <th>{t("constructorsChampion")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.season}>
                    <td>
                      <Link href={`/standings?season=${r.season}`} className="display text-lg hover:text-accent">
                        {r.season}
                      </Link>
                      {r.live && <span className="chip ml-2 !py-0 !text-[10px] !text-accent">{t("inProgress")}</span>}
                    </td>
                    <td>
                      {r.driver && (
                        <Link href={`/drivers/${r.driver.driverId}`} className="flex items-center gap-3">
                          <DriverAvatar
                            photo={photos[r.driver.driverId]}
                            name={`${r.driver.givenName} ${r.driver.familyName}`}
                            color={teamColor(r.driver.constructorId)}
                            size={36}
                          />
                          <span>
                            <span className="flex items-center gap-2 font-semibold">
                              {r.driver.givenName} {r.driver.familyName}
                              <Flag iso={nationalityToIso(r.driver.nationality)} className="text-[11px]" />
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-ink-3">
                              <span className="h-2 w-2 rounded-full" style={{ background: teamColor(r.driver.constructorId) }} />
                              {r.driver.constructorName}
                            </span>
                          </span>
                        </Link>
                      )}
                    </td>
                    <td className="num text-right">{r.driver?.points}</td>
                    <td className="num text-right text-ink-2">{r.driver?.wins}</td>
                    <td>
                      {r.constructor ? (
                        <Link href={`/teams/${r.constructor.constructorId}`} className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: teamColor(r.constructor.constructorId) }} />
                          {r.constructor.name}
                          <span className="num text-xs text-ink-3">{r.constructor.points}</span>
                        </Link>
                      ) : (
                        <span className="text-xs text-ink-3">{t("noConstructors")}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
