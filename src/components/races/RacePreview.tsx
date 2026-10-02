import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCircuitWinners, type Race } from "@/lib/api/jolpica";
import { getForecast } from "@/lib/api/weather";
import { cn } from "@/lib/format";
import { raceStart } from "@/lib/mapping";
import { safe } from "@/lib/safe";
import { teamColor } from "@/lib/teams";
import { weekendSessions } from "@/lib/view";
import { GlassCard, SectionHeader } from "@/components/ui/primitives";
import { Countdown, LocalTime, TimeZoneName } from "@/components/ui/time";
import { ForecastChip } from "@/components/ui/Weather";

/**
 * Lo que se muestra de un GP que aún no se ha corrido: horarios del fin de semana en la hora local
 * del visitante, cuenta atrás a la próxima sesión, pronóstico y quién ganó antes en este circuito.
 */
export async function RacePreview({ race, now }: { race: Race; now: number }) {
  const t = await getTranslations("races");
  const ts = await getTranslations("sessions");
  const tcal = await getTranslations("calendar");

  const sessions = weekendSessions(race);
  const upcoming = sessions.find((s) => new Date(s.iso).getTime() > now);
  const days = (raceStart(race).getTime() - now) / 86400000;
  const [forecasts, winners] = await Promise.all([
    days < 15 ? safe(getForecast(Number(race.Circuit.Location.lat), Number(race.Circuit.Location.long)), []) : [],
    safe(getCircuitWinners(race.Circuit.circuitId), []),
  ]);
  const dates = new Set(sessions.map((s) => s.iso.slice(0, 10)));
  const weekendForecast = forecasts.filter((f) => dates.has(f.date));
  const previous = [...winners].reverse().slice(0, 6);

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <SectionHeader
          eyebrow={
            <span>
              {tcal("localTime")} · <TimeZoneName />
            </span>
          }
          title={t("schedule")}
        />
        {upcoming && (
          <div className="mb-6">
            <p className="eyebrow mb-2">
              {t("nextSession")}: {ts(upcoming.key)}
            </p>
            <Countdown target={upcoming.iso} />
          </div>
        )}
        <ul className="divide-y divide-line">
          {sessions.map((s) => {
            const past = new Date(s.iso).getTime() < now;
            return (
              <li key={s.key} className={cn("flex items-center justify-between gap-4 py-2.5", past && "text-ink-3")}>
                <span className={cn("font-medium", s.key === upcoming?.key && "text-accent")}>{ts(s.key)}</span>
                <span className="num text-sm">
                  <LocalTime iso={s.iso} options={{ weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }} />
                </span>
              </li>
            );
          })}
        </ul>
        {weekendForecast.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {weekendForecast.map((f) => (
              <ForecastChip key={f.date} f={f} label={f.date.slice(5).split("-").reverse().join("/")} rainLabel={tcal("rainChance", { p: f.rainProb })} />
            ))}
          </div>
        )}
      </GlassCard>

      {previous.length > 0 && (
        <GlassCard className="p-0">
          <div className="p-5 pb-2">
            <SectionHeader title={t("pastWinners")} className="mb-0" />
          </div>
          <ul className="px-2 pb-2">
            {previous.map((r) => {
              const w = r.Results?.[0];
              if (!w) return null;
              return (
                <li key={`${r.season}-${r.round}`}>
                  <Link
                    href={`/races/${r.season}/${r.round}`}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/5"
                  >
                    <span className="display w-14 text-lg text-ink-2">{r.season}</span>
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: teamColor(w.Constructor.constructorId) }} aria-hidden />
                    <span className="min-w-0 flex-1 truncate font-semibold">
                      {w.Driver.givenName} <span className="uppercase">{w.Driver.familyName}</span>
                    </span>
                    <span className="truncate text-xs text-ink-3">{w.Constructor.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </GlassCard>
      )}
    </div>
  );
}
