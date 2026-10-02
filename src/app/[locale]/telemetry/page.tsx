import { serverNow } from "@/lib/clock";
import { gpName } from "@/lib/gp-names";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCurrentSeason, getSchedule } from "@/lib/api/jolpica";
import { getCarData, getDrivers, getLaps, getLocation, type OFDriver, type OFLap } from "@/lib/api/openf1";
import { distinctPair } from "@/lib/color";
import { lapTime } from "@/lib/format";
import { findWeekendSessions, OPENF1_FIRST_SEASON, raceStart } from "@/lib/mapping";
import { safe } from "@/lib/safe";
import { buildTrace, compareLaps, fitToBox, miniSectorWinners, trackWithFraction } from "@/lib/telemetry";
import { constructorIdFromOpenF1, teamColor } from "@/lib/teams";
import { TelemetryCharts } from "@/components/charts/TelemetryCharts";
import { DriverAvatar } from "@/components/ui/media";
import { EmptyState, GlassCard, PageTitle, SectionHeader } from "@/components/ui/primitives";
import { ParamSelect, SeasonSelect } from "@/components/ui/SeasonSelect";
import { largeHeadshot } from "@/lib/media";
import { getOfficialHeadshots } from "@/lib/photos";

export async function generateMetadata({ params }: PageProps<"/[locale]/telemetry">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "telemetry" });
  return { title: t("title") };
}

function fastest(laps: OFLap[]) {
  return laps
    .filter((l) => l.lap_duration && l.date_start && !l.is_pit_out_lap)
    .sort((a, b) => a.lap_duration! - b.lap_duration!)[0];
}

export default async function TelemetryPage({ params, searchParams }: PageProps<"/[locale]/telemetry">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations("telemetry");
  const tc = await getTranslations("common");
  const ts = await getTranslations("sessions");

  const current = await safe(getCurrentSeason(), new Date().getUTCFullYear());
  const seasonRaw = Number(sp.season);
  const season = Number.isInteger(seasonRaw) && seasonRaw >= OPENF1_FIRST_SEASON && seasonRaw <= current ? seasonRaw : current;
  const schedule = (await safe(getSchedule(season), [])).filter((r) => raceStart(r).getTime() < serverNow());
  const race = schedule.find((r) => r.round === sp.round) ?? schedule.at(-1);

  const header = (extra?: React.ReactNode) => (
    <>
      <PageTitle eyebrow={t("subtitle")} title={t("title")}>
        <SeasonSelect value={season} min={OPENF1_FIRST_SEASON} max={current} resetParams={["round", "session", "a", "b"]} />
      </PageTitle>
      {extra}
    </>
  );

  if (!race) return header(<EmptyState>{t("pick")}</EmptyState>);

  const weekend = await safe(findWeekendSessions(race), null);
  const sessions = (weekend?.all ?? []).filter((s) => ["Race", "Qualifying"].includes(s.session_type) || s.session_name.startsWith("Sprint"));
  const session =
    sessions.find((s) => String(s.session_key) === sp.session) ??
    sessions.find((s) => s.session_name === "Qualifying") ??
    sessions.at(-1);

  const raceOptions = [...schedule].reverse().map((r) => ({ value: r.round, label: `${r.round}. ${gpName(r.raceName, locale)}` }));
  const sessionLabel = (name: string) => {
    const key = { Race: "Race", Qualifying: "Qualifying", Sprint: "Sprint", "Sprint Qualifying": "SprintQualifying", "Sprint Shootout": "SprintShootout" }[name];
    return key ? ts(key) : name;
  };

  if (!session) {
    return header(
      <>
        <div className="mb-6 flex flex-wrap gap-3">
          <ParamSelect param="round" value={race.round} options={raceOptions} label={tc("race")} resetParams={["session", "a", "b"]} />
        </div>
        <EmptyState>{tc("noData")}</EmptyState>
      </>,
    );
  }

  const [drivers, official] = await Promise.all([
    safe(getDrivers(session.session_key), []),
    safe(getOfficialHeadshots(season), new Map<string, string>()),
  ]);
  // Recorte comprobado: el que enlaza OpenF1 puede ser la imagen de reserva en blanco del CDN
  const photoOf = (d: OFDriver) => {
    const src = official.get(d.name_acronym) ?? largeHeadshot(d.headshot_url);
    return src ? { src, cutout: true } : undefined;
  };
  const allLaps = await safe(getLaps(session.session_key), []);
  // Pilotos ordenados por su vuelta más rápida
  const best = drivers
    .map((d) => ({ d, lap: fastest(allLaps.filter((l) => l.driver_number === d.driver_number)) }))
    .filter((x) => x.lap)
    .sort((x, y) => x.lap!.lap_duration! - y.lap!.lap_duration!);

  const aNum = Number(sp.a) || best[0]?.d.driver_number;
  const bNum = Number(sp.b) || best.find((x) => x.d.driver_number !== aNum)?.d.driver_number;
  const A = best.find((x) => x.d.driver_number === aNum);
  const B = best.find((x) => x.d.driver_number === bNum);

  const driverOptions = best.map((x) => ({
    value: String(x.d.driver_number),
    label: `${x.d.name_acronym} · ${lapTime(x.lap!.lap_duration)}`,
  }));

  const selectors = (
    <div className="mb-6 flex flex-wrap gap-3">
      <ParamSelect param="round" value={race.round} options={raceOptions} label={tc("race")} resetParams={["session", "a", "b"]} />
      <ParamSelect
        param="session"
        value={String(session.session_key)}
        options={sessions.map((s) => ({ value: String(s.session_key), label: sessionLabel(s.session_name) }))}
        label={t("session")}
        resetParams={["a", "b"]}
      />
      {best.length > 1 && (
        <>
          <ParamSelect param="a" value={String(aNum)} options={driverOptions} label="A" />
          <ParamSelect param="b" value={String(bNum)} options={driverOptions} label="B" />
        </>
      )}
    </div>
  );

  if (!A || !B || A === B) return header(<>{selectors}<EmptyState>{t("noLap")}</EmptyState></>);

  const lapWindow = (lap: OFLap) => {
    const start = new Date(lap.date_start!);
    const end = new Date(start.getTime() + lap.lap_duration! * 1000);
    return [start.toISOString(), end.toISOString()] as const;
  };
  const [wa, wb] = [lapWindow(A.lap!), lapWindow(B.lap!)];
  const [carA, carB, locA] = await Promise.all([
    safe(getCarData(session.session_key, A.d.driver_number, wa[0], wa[1]), []),
    safe(getCarData(session.session_key, B.d.driver_number, wb[0], wb[1]), []),
    safe(getLocation(session.session_key, A.d.driver_number, wa[0], wa[1]), []),
  ]);
  const traceA = buildTrace(carA, A.lap!.date_start!);
  const traceB = buildTrace(carB, B.lap!.date_start!);
  const compared = compareLaps(traceA, traceB, 450);
  const winners = miniSectorWinners(traceA, traceB, 25);

  const colorOf = (team: string | null) => teamColor(constructorIdFromOpenF1(team));
  const pair = distinctPair(
    A.d.team_colour ? `#${A.d.team_colour}` : colorOf(A.d.team_name),
    B.d.team_colour ? `#${B.d.team_colour}` : colorOf(B.d.team_name),
  );

  // Mapa: trazado del piloto A coloreado por quién fue más rápido en cada mini-sector
  const pts = fitToBox(trackWithFraction(locA, traceA, A.lap!.date_start!), 500, 24);
  const segments: { color: string; points: string }[] = [];
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.min(winners.length - 1, Math.floor(pts[i].f * winners.length));
    const color = winners[seg] === "a" ? pair.a : pair.b;
    const last = segments.at(-1);
    const piece = `${pts[i - 1].x},${pts[i - 1].y} ${pts[i].x},${pts[i].y}`;
    if (last && last.color === color) last.points += ` ${pts[i].x},${pts[i].y}`;
    else segments.push({ color, points: piece });
  }
  const aWins = winners.filter((w) => w === "a").length;

  const gap = B.lap!.lap_duration! - A.lap!.lap_duration!;

  return (
    <div>
      {header(selectors)}
      {compared.length === 0 ? (
        <EmptyState>{t("noLap")}</EmptyState>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <GlassCard className="min-w-0">
            <TelemetryCharts
              data={compared}
              a={{ label: A.d.name_acronym, color: pair.a }}
              b={{ label: B.d.name_acronym, color: pair.b, dashed: pair.bDashed }}
              labels={{
                speed: t("speed"),
                throttle: t("throttle"),
                brake: t("brake"),
                gear: t("gear"),
                delta: t("delta"),
                distance: t("distance"),
                deltaHelp: t("deltaHelp", { a: A.d.name_acronym }),
              }}
            />
          </GlassCard>
          <aside className="space-y-6">
            <GlassCard>
              <SectionHeader title={t("fastestLap")} className="mb-3" />
              {[A, B].map((x, i) => (
                <div key={x.d.driver_number} className="flex items-center gap-3 border-b border-line py-3 last:border-0">
                  <DriverAvatar
                    photo={photoOf(x.d)}
                    name={x.d.full_name}
                    color={i === 0 ? pair.a : pair.b}
                    size={44}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{x.d.full_name}</p>
                    <p className="text-xs text-ink-3">{x.d.team_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="display num text-2xl">{lapTime(x.lap!.lap_duration)}</p>
                    {i === 1 && <p className="num text-xs text-ink-3">{gap >= 0 ? "+" : ""}{gap.toFixed(3)}</p>}
                  </div>
                </div>
              ))}
            </GlassCard>
            {segments.length > 0 && (
              <GlassCard>
                <SectionHeader title={t("fasterIn")} className="mb-3" />
                <svg viewBox="0 0 500 500" className="w-full" role="img" aria-label={t("fasterIn")}>
                  {segments.map((s, i) => (
                    <polyline key={i} points={s.points} fill="none" stroke={s.color} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
                  ))}
                </svg>
                <div className="mt-3 flex justify-between text-xs text-ink-2">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-4 rounded-sm" style={{ background: pair.a }} /> {A.d.name_acronym}: {aWins}/{winners.length}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-4 rounded-sm" style={{ background: pair.b }} /> {B.d.name_acronym}: {winners.length - aWins}/{winners.length}
                  </span>
                </div>
              </GlassCard>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
