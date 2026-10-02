import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCurrentSeason } from "@/lib/api/jolpica";
import { serverNow } from "@/lib/clock";
import { nationalityToIso } from "@/lib/countries";
import { getDriverIndex } from "@/lib/drivers";
import { yearSpan } from "@/lib/format";
import { currentGrid } from "@/lib/grid";
import { teamLogo } from "@/lib/media";
import { getDriverPhotos, teamsOf, type Photo } from "@/lib/photos";
import { safe } from "@/lib/safe";
import { teamColor } from "@/lib/teams";
import { Directory, type DirectoryItem } from "@/components/ui/Directory";
import { DriverHero, TeamLogo } from "@/components/ui/media";
import { Flag, PageTitle, SectionHeader } from "@/components/ui/primitives";

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/[locale]/drivers">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "drivers" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function DriversPage({ params }: PageProps<"/[locale]/drivers">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("drivers");
  const tc = await getTranslations("common");

  const current = await safe(getCurrentSeason(), new Date().getUTCFullYear());
  const [grid, index] = await Promise.all([currentGrid(current, serverNow()), getDriverIndex(current)]);
  const gridSeason = grid?.season ?? current;
  const photos: Record<string, Photo> = grid
    ? await safe(getDriverPhotos(grid.results.map((r) => r.Driver), gridSeason, teamsOf(grid.results)), {})
    : {};

  // País traducido en el servidor para que el buscador también encuentre "Colombia" o "Reino Unido"
  const regions = new Intl.DisplayNames([locale], { type: "region" });
  const items: DirectoryItem[] = index.map((d) => {
    const iso = nationalityToIso(d.nationality);
    const meta = [yearSpan(d.from, d.to), t("seasons", { n: d.seasons }), d.wins > 0 && t("wins", { n: d.wins })];
    return {
      id: d.id,
      href: `/drivers/${d.id}`,
      given: d.given,
      name: d.family,
      meta: meta.filter(Boolean).join(" · "),
      iso,
      search: `${iso ? (regions.of(iso.toUpperCase()) ?? "") : ""} ${d.nationality}`,
      from: d.from,
      to: d.to,
      wins: d.wins,
      titles: d.titles,
      count: d.seasons,
    };
  });

  return (
    <div>
      <PageTitle eyebrow={t("subtitle")} title={t("title")} />
      <Directory
        items={items}
        current={current}
        namespace="drivers"
        filters={["champions", "winners", "active"]}
        sorts={["recent", "wins", "titles", "name"]}
        upperName
      >
        {grid && grid.teams.length > 0 && (
          <section>
            <SectionHeader eyebrow={t("gridHint")} title={t("grid", { season: gridSeason })} />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {grid.teams.map((team) => {
                const color = teamColor(team.id);
                return (
                  <div
                    key={team.id}
                    className="overflow-hidden rounded-[1.5rem] border border-white/10"
                    style={{ background: `linear-gradient(160deg, ${color}40, #111114 55%)` }}
                  >
                    <Link
                      href={`/teams/${team.id}`}
                      className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-white/5"
                    >
                      <span className="display truncate text-lg">{team.name}</span>
                      <TeamLogo src={teamLogo(team.id, gridSeason, 64)} name={team.name} className="h-6 w-auto max-w-20" />
                    </Link>
                    <div className="grid grid-cols-2 gap-px">
                      {team.drivers.map((r) => {
                        const d = r.Driver;
                        const photo = photos[d.driverId];
                        return (
                          <Link
                            key={d.driverId}
                            href={`/drivers/${d.driverId}`}
                            className="group relative block h-44 overflow-hidden sm:h-48"
                            style={{ background: `radial-gradient(120% 100% at 50% 115%, ${color}, #111114 72%)` }}
                          >
                            <span className="display absolute right-2 top-1 text-6xl text-white/10">{d.permanentNumber ?? r.number}</span>
                            {r.pos !== undefined && (
                              <span className="chip absolute left-2 top-2 z-10 !bg-black/45 !text-[0.65rem] backdrop-blur">
                                P{r.pos} · {r.pts} {tc("pts")}
                              </span>
                            )}
                            {photo && (
                              <DriverHero
                                photo={photo}
                                name={`${d.givenName} ${d.familyName}`}
                                className={
                                  photo.cutout
                                    ? "absolute bottom-0 left-1/2 h-[88%] w-auto -translate-x-1/2 transition-transform duration-300 group-hover:scale-105"
                                    : "absolute inset-0"
                                }
                              />
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-10">
                              <p className="flex items-center gap-1.5 text-xs text-white/75">
                                <Flag iso={nationalityToIso(d.nationality)} />
                                <span className="truncate">{d.givenName}</span>
                              </p>
                              <p className="display truncate text-xl uppercase">{d.familyName}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </Directory>
    </div>
  );
}
