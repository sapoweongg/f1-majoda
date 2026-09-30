import { Crown, Flag as FlagIcon, Swords, X } from "lucide-react";
import type { Contention } from "@/lib/championship";
import { cn } from "@/lib/format";

export type ContentionLabels = {
  champion: string;
  leader: string;
  contender: string;
  eliminated: string;
  maxPossible: string;
  toClinch: (points: number) => string;
  clinched: string;
  behind: (points: number) => string;
};

const ICON = { champion: Crown, leader: FlagIcon, contender: Swords, eliminated: X };

/**
 * Barras horizontales: puntos actuales (sólido) + puntos que aún puede sumar (trama translúcida),
 * con una línea vertical en los puntos del líder. Si la barra no alcanza la línea, está eliminado.
 */
export function ContentionPanel({
  rows,
  names,
  colors,
  labels,
}: {
  rows: Contention[];
  names: Record<string, string>;
  colors: Record<string, string>;
  labels: ContentionLabels;
}) {
  const scale = Math.max(...rows.map((r) => r.maxPossible), 1);
  const leader = rows[0];
  const statusLabel = {
    champion: labels.champion,
    leader: labels.leader,
    contender: labels.contender,
    eliminated: labels.eliminated,
  };
  return (
    <ul className="space-y-3">
      {rows.map((r) => {
        const Icon = ICON[r.status];
        const out = r.status === "eliminated";
        return (
          <li key={r.id} className={cn("grid grid-cols-[minmax(7rem,11rem)_1fr] items-center gap-3", out && "opacity-45")}>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{names[r.id] ?? r.id}</p>
              <p
                className={cn(
                  "flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider",
                  r.status === "champion" && "text-yellow",
                  r.status === "leader" && "text-ink",
                  r.status === "contender" && "text-green",
                  out && "text-ink-3",
                )}
              >
                <Icon size={12} aria-hidden /> {statusLabel[r.status]}
              </p>
            </div>
            <div>
              <div className="relative h-5 overflow-hidden rounded-md bg-white/[0.04]">
                <div
                  className="absolute inset-y-0 left-0 rounded-l-md"
                  style={{
                    width: `${(r.maxPossible / scale) * 100}%`,
                    background: `repeating-linear-gradient(135deg, ${colors[r.id]}40 0 4px, ${colors[r.id]}14 4px 8px)`,
                  }}
                  title={`${labels.maxPossible}: ${r.maxPossible}`}
                />
                <div
                  className="absolute inset-y-0 left-0 rounded-md"
                  style={{ width: `${(r.points / scale) * 100}%`, background: colors[r.id] }}
                />
                {leader && (
                  <div
                    className="absolute inset-y-[-2px] w-0.5 bg-white"
                    style={{ left: `${(leader.points / scale) * 100}%` }}
                    aria-hidden
                  />
                )}
              </div>
              <p className="num mt-1 text-[11px] text-ink-3">
                {r.points} → {labels.maxPossible.toLowerCase()} {r.maxPossible}
                {r.status === "leader" && r.toClinch ? ` · ${labels.toClinch(r.toClinch)}` : ""}
                {r.status === "champion" ? ` · ${labels.clinched}` : ""}
                {r.gap > 0 ? ` · ${labels.behind(r.gap)}` : ""}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
