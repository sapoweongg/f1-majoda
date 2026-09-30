"use client";

import { motion } from "motion/react";
import type { TowerRow } from "@/lib/live-types";
import { cn, lapTime } from "@/lib/format";
import { COMPOUND_COLORS } from "@/components/races/TyreStints";

export type TowerLabels = { pos: string; driver: string; interval: string; leaderGap: string; tyre: string; stops: string; lastLap: string };

/** Torre de tiempos: las filas se animan cuando cambian de posición. */
export function TimingTower({ rows, labels, compact }: { rows: TowerRow[]; labels: TowerLabels; compact?: boolean }) {
  return (
    <div className="glass overflow-hidden p-0">
      <div className="scroll-x">
        <table className="data-table num">
          <thead>
            <tr>
              <th className="w-10 text-center">{labels.pos}</th>
              <th>{labels.driver}</th>
              <th className="text-right">{labels.leaderGap}</th>
              <th className="text-right">{labels.interval}</th>
              {!compact && <th className="text-right">{labels.lastLap}</th>}
              <th className="text-center">{labels.tyre}</th>
              <th className="text-right">{labels.stops}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <motion.tr
                key={r.number}
                layout
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                className={cn(r.out && "opacity-40")}
              >
                <td className="display text-center text-lg">{r.position}</td>
                <td>
                  <span className="flex items-center gap-2.5">
                    <span className="h-5 w-1 rounded-full" style={{ background: r.color }} aria-hidden />
                    <span className="display w-10 text-base">{r.code}</span>
                    <span className="hidden truncate text-xs text-ink-3 sm:inline">{r.name}</span>
                  </span>
                </td>
                <td className="text-right text-ink-2">{r.position === 1 ? "—" : r.gap ?? ""}</td>
                <td className="text-right">{r.position === 1 ? "" : r.interval ?? ""}</td>
                {!compact && <td className="text-right text-ink-2">{r.lastLap ? lapTime(r.lastLap) : ""}</td>}
                <td className="text-center">
                  {r.compound && (
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 text-[9px] font-bold"
                        style={{ borderColor: COMPOUND_COLORS[r.compound] ?? COMPOUND_COLORS.UNKNOWN }}
                        title={r.compound}
                      >
                        {r.compound.charAt(0)}
                      </span>
                      <span className="text-xs text-ink-3">{r.tyreAge ?? ""}</span>
                    </span>
                  )}
                </td>
                <td className="text-right text-ink-2">{r.stops}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const STATUS_STYLE: Record<string, string> = {
  GREEN: "bg-green/15 text-green border-green/40",
  YELLOW: "bg-yellow/15 text-yellow border-yellow/40",
  SC: "bg-yellow/15 text-yellow border-yellow/40",
  VSC: "bg-yellow/15 text-yellow border-yellow/40",
  RED: "bg-accent/20 text-accent border-accent/50",
  CHEQUERED: "bg-white/10 text-ink border-white/30",
};

export function TrackStatusBadge({ status, label }: { status: string | null; label: string | null }) {
  if (!status || !label) return null;
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider", STATUS_STYLE[status] ?? "border-line")}>
      <span className="h-2 w-2 rounded-full bg-current" aria-hidden />
      {label}
    </span>
  );
}
