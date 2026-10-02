import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { teamStory } from "@/content/teams";
import { getCurrentSeason } from "@/lib/api/jolpica";
import { serverNow } from "@/lib/clock";
import { getTeamIndex } from "@/lib/constructors";
import { nationalityToIso } from "@/lib/countries";
import { yearSpan } from "@/lib/format";
import { currentGrid } from "@/lib/grid";
import { carImage, teamLogo } from "@/lib/media";
import { getDriverPhotos, teamsOf, type Photo } from "@/lib/photos";
import { safe } from "@/lib/safe";
import { teamColor, teamStyle } from "@/lib/teams";
import { Directory, type DirectoryItem } from "@/components/ui/Directory";
import { DriverAvatar, TeamCar, TeamLogo } from "@/components/ui/media";
import { PageTitle, SectionHeader } from "@/components/ui/primitives";

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/[locale]/teams">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "teams" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function TeamsPage({ params }: PageProps<"/[locale]/teams">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("teams");
  const tc = await getTranslations("common");

  const current = await safe(getCurrentSeason(), new Date().getUTCFullYear());
  const [grid, index] = await Promise.all([currentGrid(current, serverNow()), getTeamIndex(current)]);
  const gridSeason = grid?.season ?? current;
  const photos: Record<string, Photo> = grid
    ? await safe(getDriverPhotos(grid.results.map((r) => r.Driver), gridSeason, teamsOf(grid.results)), {})
    : {};

  const regions = new Intl.DisplayNames([locale], { type: "region" });
  const items: DirectoryItem[] = index.map((team) => {
    const iso = nationalityToIso(team.nationality);
    const meta = [
      yearSpan(team.from, team.to),
      t("seasons", { n: team.years.length }),
      team.wins > 0 && t("wins", { n: team.wins }),
    ];
    return {
      id: team.id,
      href: `/teams/${team.id}`,
      name: team.name,
      meta: meta.filter(Boolean).join(" · "),
      iso,
      color: teamStyle(team.id).color,
      search: `${team.id.replace(/[_-]/g, " ")} ${iso ? (regions.of(iso.toUpperCase()) ?? "") : ""} ${team.nationality}`,
      from: team.from,
      to: team.to,
      wins: team.wins,
      titles: team.titles,
      count: team.years.length,
    };
  });

  return (
    <div>
      <PageTitle eyebrow={t("subtitle")} title={t("title")} />
      <Directory
        items={items}
        current={current}
        namespace="teams"
        filters={["champions", "winners", "active"]}
        sorts={["recent", "titles", "wins", "count", "name"]}
      >
        {grid && grid.teams.length > 0 && (
          <section>
            <SectionHeader eyebrow={t("gridHint")} title={t("grid", { season: gridSeason })} />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {grid.teams.map((team) => {
                const style = teamStyle(team.id);
                const story = teamStory(team.id, locale);
                return (
                  <Link
                    key={team.id}
                    href={`/teams/${team.id}`}
                    className="group relative flex min-h-[19rem] flex-col overflow-hidden rounded-[1.75rem] border border-white/10 p-5"
                    style={{ background: `radial-gradient(130% 95% at 100% 100%, ${style.color}d0, ${style.color}30 48%, #111114 78%)` }}
                  >
                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        {team.pos !== undefined && (
                          <p className="eyebrow !text-white/70">
                            P{team.pos} · {team.pts} {tc("pts")}
                          </p>
                        )}
                        <h3 className="display mt-1 truncate text-3xl">{team.name}</h3>
                        {story && <p className="mt-2 max-w-sm text-sm leading-snug text-white/75">{story.tagline}</p>}
                      </div>
                      <TeamLogo src={teamLogo(team.id, gridSeason, 96)} name={team.name} className="h-8 w-auto max-w-24 shrink-0" />
                    </div>
                    <TeamCar
                      src={carImage(team.id, gridSeason, 900)}
                      color={style.color}
                      accent={style.accent}
                      name={team.name}
                      className="pointer-events-none absolute -right-8 bottom-14 w-[90%] transition-transform duration-500 group-hover:-translate-x-3"
                    />
                    <div className="relative z-10 mt-auto flex flex-wrap gap-2">
                      {team.drivers.map((r) => (
                        <span
                          key={r.Driver.driverId}
                          className="flex items-center gap-2 rounded-full bg-black/45 py-1 pl-1 pr-3 text-sm font-semibold backdrop-blur"
                        >
                          <DriverAvatar
                            photo={photos[r.Driver.driverId]}
                            name={`${r.Driver.givenName} ${r.Driver.familyName}`}
                            color={teamColor(team.id)}
                            size={28}
                          />
                          {r.Driver.familyName}
                        </span>
                      ))}
                    </div>
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
