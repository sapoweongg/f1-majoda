import { Timer } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { QualifyingResult, Result } from "@/lib/api/jolpica";
import { nationalityToIso } from "@/lib/countries";
import { cn, points as fmtPoints } from "@/lib/format";
import { statusLabel } from "@/lib/status";
import { teamColor } from "@/lib/teams";
import { DriverAvatar, type PhotoProp } from "@/components/ui/media";
import { Flag } from "@/components/ui/primitives";

// En el móvil las celdas van más juntas para que quepan posición, piloto, tiempo y puntos
const TABLE =
  "data-table [&_td]:px-2 [&_th]:px-2 [&_td:first-child]:px-1 [&_th:first-child]:px-1 sm:[&_td]:px-3 sm:[&_th]:px-3 sm:[&_td:first-child]:px-3 sm:[&_th:first-child]:px-3";
const WIDE = "hidden sm:table-cell";

function DriverCell({ r, photo }: { r: Pick<Result, "Driver" | "Constructor">; photo?: PhotoProp }) {
  const color = teamColor(r.Constructor.constructorId);
  const name = `${r.Driver.givenName} ${r.Driver.familyName}`;
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link href={`/drivers/${r.Driver.driverId}`} tabIndex={-1} aria-hidden className="shrink-0">
        <DriverAvatar photo={photo} name={name} color={color} size={32} />
      </Link>
      <span className="min-w-0">
        <Link href={`/drivers/${r.Driver.driverId}`} className="flex items-center gap-1.5 font-semibold transition-colors hover:text-accent">
          <span className="hidden sm:inline">{r.Driver.givenName}</span>
          <span className="sm:hidden">{r.Driver.givenName[0]}.</span>
          <span className="uppercase">{r.Driver.familyName}</span>
          {/* La bandera ocupa sitio en el móvil; ahí se omite */}
          <span className="hidden sm:inline">
            <Flag iso={nationalityToIso(r.Driver.nationality)} className="text-[11px]" />
          </span>
        </Link>
        <Link
          href={`/teams/${r.Constructor.constructorId}`}
          className="flex items-center gap-1.5 text-xs text-ink-3 transition-colors hover:text-ink"
        >
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} aria-hidden />
          <span className="truncate">{r.Constructor.name}</span>
        </Link>
      </span>
    </div>
  );
}

export function ResultsTable({
  results,
  photos,
  labels,
  locale,
}: {
  results: Result[];
  photos: Record<string, PhotoProp>;
  labels: { pos: string; driver: string; grid: string; laps: string; time: string; points: string; fastest: string };
  locale: string;
}) {
  const winnerLaps = Number(results[0]?.laps ?? 0);
  return (
    <div className="glass overflow-hidden p-0">
      <div className="scroll-x">
        <table className={TABLE}>
          <thead>
            <tr>
              <th className="w-9 text-center sm:w-12">{labels.pos}</th>
              <th>{labels.driver}</th>
              <th className={cn(WIDE, "text-right")}>{labels.grid}</th>
              <th className={cn(WIDE, "text-right")}>+/-</th>
              <th className={cn(WIDE, "text-right")}>{labels.laps}</th>
              <th>{labels.time}</th>
              <th className="text-right">{labels.points}</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => {
              const grid = Number(r.grid);
              const pos = Number(r.position);
              const classified = /^\d+$/.test(r.positionText);
              const gained = grid > 0 && classified ? grid - pos : null;
              const fastest = r.FastestLap?.rank === "1";
              return (
                <tr key={r.Driver.driverId}>
                  <td className="display text-center text-lg">{classified ? r.positionText : "—"}</td>
                  <td>
                    <DriverCell r={r} photo={photos[r.Driver.driverId]} />
                  </td>
                  <td className={cn(WIDE, "num text-right text-ink-2")}>{grid > 0 ? grid : "PL"}</td>
                  <td
                    className={cn(
                      WIDE,
                      "num text-right text-xs font-semibold",
                      gained && gained > 0 && "text-green",
                      gained && gained < 0 && "text-accent",
                      !gained && "text-ink-3",
                    )}
                  >
                    {gained === null ? "" : gained > 0 ? `▲${gained}` : gained < 0 ? `▼${-gained}` : "="}
                  </td>
                  <td className={cn(WIDE, "num text-right text-ink-2")}>{r.laps}</td>
                  <td className="num">
                    {/* En el móvil la vuelta rápida va debajo del tiempo */}
                    <span className="flex flex-col items-start gap-1 sm:block">
                      <span className={r.Time?.time ? "" : "text-ink-3"}>
                        {/* Clasificado con menos vueltas que el ganador = doblado, aunque Jolpica diga "Retired" */}
                        {r.Time?.time ||
                          statusLabel(classified && Number(r.laps) < winnerLaps ? "Lapped" : r.status, locale, Number(r.laps), winnerLaps)}
                      </span>
                      {fastest && (
                        <span
                          className="inline-flex items-center gap-1 rounded-full bg-purple/20 px-2 py-0.5 text-[10px] font-semibold text-purple sm:ml-2"
                          title={`${labels.fastest} ${r.FastestLap?.Time?.time ?? ""}`}
                        >
                          <Timer size={10} aria-hidden />
                          <span className="hidden sm:inline">
                            {labels.fastest} {r.FastestLap?.Time?.time}
                          </span>
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="display num text-right text-lg">{Number(r.points) ? fmtPoints(r.points) : ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function QualifyingTable({
  results,
  photos,
  labels,
}: {
  results: QualifyingResult[];
  photos: Record<string, PhotoProp>;
  labels: { pos: string; driver: string; time: string };
}) {
  // Mejor tiempo de cada fase para marcarlo en morado
  const best = (k: "Q1" | "Q2" | "Q3") =>
    results.map((r) => r[k]).filter(Boolean).sort()[0];
  const bests = { Q1: best("Q1"), Q2: best("Q2"), Q3: best("Q3") };
  return (
    <div className="glass overflow-hidden p-0">
      <div className="scroll-x">
        <table className={TABLE}>
          <thead>
            <tr>
              <th className="w-9 text-center sm:w-12">{labels.pos}</th>
              <th>{labels.driver}</th>
              {/* En el móvil, una sola columna con el tiempo de la última fase que disputó */}
              <th className="sm:hidden">{labels.time}</th>
              <th className={WIDE}>Q1</th>
              <th className={WIDE}>Q2</th>
              <th className={WIDE}>Q3</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => {
              const phase = (["Q3", "Q2", "Q1"] as const).find((k) => r[k]);
              return (
                <tr key={r.Driver.driverId}>
                  <td className="display text-center text-lg">{r.position}</td>
                  <td>
                    <DriverCell r={r} photo={photos[r.Driver.driverId]} />
                  </td>
                  <td className="num sm:hidden">
                    {phase ? (
                      <>
                        <span className={r[phase] === bests[phase] ? "font-semibold text-purple" : ""}>{r[phase]}</span>
                        <span className="ml-1.5 text-[10px] text-ink-3">{phase}</span>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  {(["Q1", "Q2", "Q3"] as const).map((k) => (
                    <td key={k} className={cn(WIDE, "num", r[k] && r[k] === bests[k] ? "font-semibold text-purple" : "text-ink-2")}>
                      {r[k] || "—"}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
