import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { teamStory } from "@/content/teams";
import champions from "@/data/champions.json";
import {
  getConstructor,
  getConstructorDrivers,
  getConstructorSeasons,
  getConstructorWinCount,
  getCurrentSeason,
  type Driver,
} from "@/lib/api/jolpica";
import { serverNow } from "@/lib/clock";
import { familyExtras } from "@/lib/constructors";
import { nationalityToIso } from "@/lib/countries";
import { currentGrid } from "@/lib/grid";
import { carImage, teamLogo } from "@/lib/media";
import { getDriverPhotos } from "@/lib/photos";
import { safe } from "@/lib/safe";
import { teamFamily, teamStyle } from "@/lib/teams";
import { DriverHero, TeamCar, TeamLogo } from "@/components/ui/media";
import { BackLink, EmptyState, Flag, GlassCard, SectionHeader, StatNumber } from "@/components/ui/primitives";

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/[locale]/teams/[constructorId]">): Promise<Metadata> {
  const { constructorId } = await params;
  const c = await safe(getConstructor(constructorId), undefined);
  return { title: c?.name };
}

export default async function TeamPage({ params }: PageProps<"/[locale]/teams/[constructorId]">) {
  const { locale, constructorId } = await params;
  setRequestLocale(locale);
  const team = await safe(getConstructor(constructorId), undefined);
  if (!team) notFound();
  const t = await getTranslations("team");
  const tc = await getTranslations("common");

  const [seasons, apiWins, current] = await Promise.all([
    safe(getConstructorSeasons(constructorId), []),
    safe(getConstructorWinCount(constructorId), 0),
    safe(getCurrentSeason(), new Date().getUTCFullYear()),
  ]);
  const lastSeason = seasons.at(-1)?.season ?? current;
  // En la temporada en curso, los pilotos de la última carrera: la lista de Jolpica incluye a los
  // que solo hicieron libres
  let drivers: Driver[] = [];
  if (lastSeason === current) {
    const grid = await currentGrid(current, serverNow());
    if (grid?.season === current) drivers = grid.teams.find((x) => x.id === constructorId)?.drivers.map((r) => r.Driver) ?? [];
  }
  if (!drivers.length) drivers = await safe(getConstructorDrivers(constructorId, lastSeason), []);
  const photos = await safe(getDriverPhotos(drivers, lastSeason, Object.fromEntries(drivers.map((d) => [d.driverId, constructorId]))), {});
  const style = teamStyle(constructorId);
  const story = teamStory(constructorId, locale);
  // Los chasis-motor de los años 50-70 ("lotus-climax") cuentan como su equipo
  const family = teamFamily(constructorId);
  const titles = champions
    .filter((c) => c.constructor && teamFamily(c.constructor.constructorId) === family)
    .map((c) => c.season);
  const wins = apiWins + familyExtras(constructorId).wins;
  const iso = nationalityToIso(team.nationality);
  const country = iso ? new Intl.DisplayNames([locale], { type: "region" }).of(iso.toUpperCase()) : team.nationality;
  const best = titles.length ? 1 : Math.min(...seasons.map((s) => Number(s.standing?.position ?? 99)));
  const maxPts = Math.max(1, ...seasons.map((s) => Number(s.standing?.points ?? 0)));

  return (
    <div className="space-y-10">
      <BackLink href="/teams">{t("allTeams")}</BackLink>
      <section
        className="relative overflow-hidden rounded-[2rem] border border-white/10"
        style={{ background: `linear-gradient(120deg, #0b0b0f 25%, ${style.color} 100%)` }}
      >
        <div className="relative grid min-h-[20rem] items-center gap-6 p-6 sm:p-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="relative z-10 space-y-4">
            <TeamLogo src={teamLogo(constructorId, lastSeason, 160)} name={team.name} className="h-14 w-auto" />
            <h1 className="display text-5xl sm:text-7xl">{team.name}</h1>
            <p className="flex items-center gap-2 text-sm text-white/70">
              <Flag iso={iso} />
              {country} · {seasons[0]?.season}–{lastSeason}
            </p>
          </div>
          <TeamCar
            src={carImage(constructorId, lastSeason, 1200)}
            color={style.color}
            accent={style.accent}
            name={team.name}
            priority
            className="w-full lg:-mr-16 lg:scale-110"
          />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        <StatNumber value={titles.length} label={t("championships")} />
        <StatNumber value={seasons.length} label={tc("season") + "s"} />
        <StatNumber value={wins} label={tc("wins")} />
        <StatNumber value={Number.isFinite(best) && best < 99 ? `P${best}` : "—"} label={t("bestFinish")} />
      </div>

      <section className={story ? "grid gap-6 lg:grid-cols-[1.7fr_1fr]" : "grid gap-6"}>
        {story && (
          <GlassCard className="p-6 sm:p-8">
            <p className="eyebrow mb-2">{t("about")}</p>
            <p className="display text-2xl leading-tight sm:text-3xl">{story.tagline}</p>
            <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink-2">
              {story.text.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </GlassCard>
        )}
        <GlassCard className="p-6">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-1">
            {story?.base && (
              <div className="col-span-2 lg:col-span-1">
                <dt className="eyebrow mb-1">{t("base")}</dt>
                <dd className="font-semibold">{story.base}</dd>
              </div>
            )}
            <div>
              <dt className="eyebrow mb-1">{t("nationality")}</dt>
              <dd className="flex items-center gap-2 font-semibold">
                <Flag iso={iso} /> {country}
              </dd>
            </div>
            <div>
              <dt className="eyebrow mb-1">{t("debut")}</dt>
              <dd className="font-semibold">{seasons[0]?.season ?? "—"}</dd>
            </div>
            <div>
              <dt className="eyebrow mb-1">{t("seasonsRaced")}</dt>
              <dd className="font-semibold">{seasons.length}</dd>
            </div>
            <div>
              <dt className="eyebrow mb-1">{lastSeason >= current ? t("active") : t("lastSeason")}</dt>
              <dd className="font-semibold">{lastSeason >= current ? "✓" : lastSeason}</dd>
            </div>
          </dl>
        </GlassCard>
      </section>

      {drivers.length > 0 && (
        <section>
          <SectionHeader title={t("driversThisSeason", { season: lastSeason })} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {drivers.map((d) => {
              const photo = photos[d.driverId];
              return (
                <Link
                  key={d.driverId}
                  href={`/drivers/${d.driverId}`}
                  className="group relative block h-56 overflow-hidden rounded-[1.5rem] border border-white/10"
                  style={{ background: `radial-gradient(120% 100% at 50% 110%, ${style.color}, #111114 70%)` }}
                >
                  <span className="display absolute right-3 top-2 text-7xl text-white/10">{d.permanentNumber}</span>
                  {photo && (
                    <DriverHero
                      photo={photo}
                      name={`${d.givenName} ${d.familyName}`}
                      className={photo.cutout ? "absolute bottom-0 left-1/2 h-[92%] w-auto -translate-x-1/2 transition-transform group-hover:scale-105" : "absolute inset-0"}
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4 pt-10">
                    <p className="text-sm text-white/75">{d.givenName}</p>
                    <p className="display text-2xl uppercase">{d.familyName}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <SectionHeader title={t("history")} />
        {titles.length > 0 && (
          <p className="mb-4 flex flex-wrap gap-2">
            {titles.map((y) => (
              <span key={y} className="chip !border-yellow/40 !text-yellow">
                🏆 {y}
              </span>
            ))}
          </p>
        )}
        {seasons.length === 0 ? (
          <EmptyState>{tc("noData")}</EmptyState>
        ) : (
          <GlassCard className="p-0">
            <div className="scroll-x">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{tc("season")}</th>
                    <th className="text-right">{tc("pos")}</th>
                    <th className="text-right">{tc("wins")}</th>
                    <th className="hidden w-[40%] md:table-cell" aria-hidden />
                    <th className="text-right">{tc("points")}</th>
                  </tr>
                </thead>
                <tbody>
                  {[...seasons].reverse().filter((x) => x.standing).map(({ season, standing }) => {
                    const pts = Number(standing?.points ?? 0);
                    return (
                      <tr key={season}>
                        <td>
                          <Link href={`/standings?season=${season}&view=constructors`} className="display text-lg hover:text-accent">
                            {season}
                          </Link>
                        </td>
                        <td className="display num text-right text-lg">{standing?.positionText ?? "—"}</td>
                        <td className="num text-right text-ink-2">{standing?.wins}</td>
                        <td className="hidden md:table-cell">
                          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                            <div className="h-full rounded-full" style={{ width: `${(pts / maxPts) * 100}%`, background: style.color }} />
                          </div>
                        </td>
                        <td className="num text-right">{standing?.points}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}
      </section>
    </div>
  );
}
