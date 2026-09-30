import { Timer } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { QualifyingResult, Result } from "@/lib/api/jolpica";
import { nationalityToIso } from "@/lib/countries";
import { cn, points as fmtPoints } from "@/lib/format";
import { teamColor } from "@/lib/teams";
import { DriverAvatar, type PhotoProp } from "@/components/ui/media";
import { Flag } from "@/components/ui/primitives";

function DriverCell({ r, photo }: { r: Pick<Result, "Driver" | "Constructor">; photo?: PhotoProp }) {
  const color = teamColor(r.Constructor.constructorId);
  return (
    <Link href={`/drivers/${r.Driver.driverId}`} className="flex items-center gap-3">
      <DriverAvatar photo={photo} name={`${r.Driver.givenName} ${r.Driver.familyName}`} color={color} size={34} />
      <span className="min-w-0">
        <span className="flex items-center gap-2 font-semibold">
          {r.Driver.givenName} <span className="uppercase">{r.Driver.familyName}</span>
          <Flag iso={nationalityToIso(r.Driver.nationality)} className="text-[11px]" />
        </span>
        <span className="flex items-center gap-1.5 text-xs text-ink-3">
          <span className="h-2 w-2 rounded-full" style={{ background: color }} aria-hidden />
          {r.Constructor.name}
        </span>
      </span>
    </Link>
  );
}

export function ResultsTable({
  results,
  photos,
  labels,
}: {
  results: Result[];
  photos: Record<string, PhotoProp>;
  labels: { pos: string; driver: string; grid: string; laps: string; time: string; points: string; fastest: string };
}) {
  return (
    <div className="glass overflow-hidden p-0">
      <div className="scroll-x">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-12 text-center">{labels.pos}</th>
              <th>{labels.driver}</th>
              <th className="text-right">{labels.grid}</th>
              <th className="text-right">+/-</th>
              <th className="text-right">{labels.laps}</th>
              <th>{labels.time}</th>
              <th className="text-right">{labels.points}</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => {
              const grid = Number(r.grid);
              const pos = Number(r.position);
              const gained = grid > 0 && /^\d+$/.test(r.positionText) ? grid - pos : null;
              const fastest = r.FastestLap?.rank === "1";
              return (
                <tr key={r.Driver.driverId}>
                  <td className="display text-center text-lg">{/^\d+$/.test(r.positionText) ? r.positionText : "—"}</td>
                  <td>
                    <DriverCell r={r} photo={photos[r.Driver.driverId]} />
                  </td>
                  <td className="num text-right text-ink-2">{grid > 0 ? grid : "PL"}</td>
                  <td
                    className={cn(
                      "num text-right text-xs font-semibold",
                      gained && gained > 0 && "text-green",
                      gained && gained < 0 && "text-accent",
                      !gained && "text-ink-3",
                    )}
                  >
                    {gained === null ? "" : gained > 0 ? `▲${gained}` : gained < 0 ? `▼${-gained}` : "="}
                  </td>
                  <td className="num text-right text-ink-2">{r.laps}</td>
                  <td className="num">
                    <span className={r.Time ? "" : "text-ink-3"}>{r.Time?.time ?? r.status}</span>
                    {fastest && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-purple/20 px-2 py-0.5 text-[10px] font-semibold text-purple">
                        <Timer size={10} aria-hidden /> {labels.fastest} {r.FastestLap?.Time?.time}
                      </span>
                    )}
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
  labels: { pos: string; driver: string };
}) {
  // Mejor tiempo de cada fase para marcarlo en morado
  const best = (k: "Q1" | "Q2" | "Q3") =>
    results.map((r) => r[k]).filter(Boolean).sort()[0];
  const bests = { Q1: best("Q1"), Q2: best("Q2"), Q3: best("Q3") };
  return (
    <div className="glass overflow-hidden p-0">
      <div className="scroll-x">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-12 text-center">{labels.pos}</th>
              <th>{labels.driver}</th>
              <th>Q1</th>
              <th>Q2</th>
              <th>Q3</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.Driver.driverId}>
                <td className="display text-center text-lg">{r.position}</td>
                <td>
                  <DriverCell r={r} photo={photos[r.Driver.driverId]} />
                </td>
                {(["Q1", "Q2", "Q3"] as const).map((k) => (
                  <td key={k} className={cn("num", r[k] && r[k] === bests[k] ? "font-semibold text-purple" : "text-ink-2")}>
                    {r[k] || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
