"use client";

import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/format";

export type Series = {
  id: string;
  label: string;
  color: string;
  /** Segundo piloto del mismo equipo: mismo color, línea discontinua. */
  dashed?: boolean;
  values: (number | null)[];
};

type Props = {
  labels: string[];
  /** Texto completo de cada punto del eje X para el tooltip (p. ej. nombre del GP). */
  fullLabels?: string[];
  series: Series[];
  height?: number;
  reversed?: boolean;
  yDomain?: [number | "auto", number | "auto"];
  /** Formato de valores (no se pueden pasar funciones desde el servidor). */
  format?: "int" | "laptime";
  tableLabel?: string;
  chartLabel?: string;
  xTitle?: string;
  /** Series ordenadas por valor en el tooltip (mayor primero, o menor si reversed). */
  sortTooltip?: boolean;
};

const AXIS = { stroke: "#6e6e78", fontSize: 11 };

function formatLap(v: number) {
  const m = Math.floor(v / 60);
  const sec = (v - m * 60).toFixed(1).padStart(4, "0");
  return m ? `${m}:${sec}` : sec;
}

export function LineSeriesChart({
  labels,
  fullLabels,
  series,
  height = 340,
  reversed,
  yDomain,
  format = "int",
  tableLabel = "Tabla",
  chartLabel = "Gráfico",
  sortTooltip = true,
}: Props) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const valueFormat = format === "laptime" ? formatLap : (v: number) => String(Math.round(v * 10) / 10);
  const [focus, setFocus] = useState<string | null>(null);
  const rows = labels.map((label, i) => {
    const row: Record<string, number | string | null> = { label, i };
    for (const s of series) row[s.id] = s.values[i] ?? null;
    return row;
  });

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        {/* Leyenda: siempre visible, con clave de línea (continua/discontinua) */}
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-2">
          {series.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className={cn(
                  "flex items-center gap-1.5 transition-opacity",
                  focus && focus !== s.id && "opacity-40",
                )}
                onMouseEnter={() => setFocus(s.id)}
                onMouseLeave={() => setFocus(null)}
                onFocus={() => setFocus(s.id)}
                onBlur={() => setFocus(null)}
              >
                <svg width="18" height="6" aria-hidden>
                  <line
                    x1="1"
                    y1="3"
                    x2="17"
                    y2="3"
                    stroke={s.color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={s.dashed ? "4 3" : undefined}
                  />
                </svg>
                {s.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex rounded-full border border-line p-0.5 text-xs">
          {(["chart", "table"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={cn("rounded-full px-3 py-1 text-ink-3", view === v && "bg-white/10 text-ink")}
            >
              {v === "chart" ? chartLabel : tableLabel}
            </button>
          ))}
        </div>
      </div>

      {view === "chart" ? (
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rows} margin={{ top: 8, right: 12, bottom: 4, left: -8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.12)" }} interval="preserveStartEnd" minTickGap={8} />
              <YAxis
                tick={AXIS}
                tickLine={false}
                axisLine={false}
                reversed={reversed}
                domain={yDomain ?? ["auto", "auto"]}
                allowDecimals={false}
                width={format === "laptime" ? 58 : 44}
                tickFormatter={(v: number) => valueFormat(v)}
              />
              <Tooltip
                cursor={{ stroke: "rgba(255,255,255,0.25)", strokeWidth: 1 }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const i = Number(payload[0]?.payload?.i ?? 0);
                  const items = series
                    .map((s) => ({ s, v: rows[i]?.[s.id] as number | null }))
                    .filter((x) => x.v != null);
                  if (sortTooltip) items.sort((a, b) => (reversed ? a.v! - b.v! : b.v! - a.v!));
                  return (
                    <div className="glass min-w-44 !rounded-xl p-3 text-xs shadow-2xl">
                      <p className="mb-2 font-semibold text-ink">{fullLabels?.[i] ?? label}</p>
                      <ul className="space-y-1">
                        {items.slice(0, 12).map(({ s, v }) => (
                          <li key={s.id} className="flex items-center gap-2">
                            <svg width="12" height="4" aria-hidden>
                              <line x1="0" y1="2" x2="12" y2="2" stroke={s.color} strokeWidth="2.5" strokeDasharray={s.dashed ? "3 2" : undefined} />
                            </svg>
                            <span className="display num text-sm text-ink">{valueFormat(v!)}</span>
                            <span className="truncate text-ink-2">{s.label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }}
              />
              {series.map((s) => (
                <Line
                  key={s.id}
                  type="monotone"
                  dataKey={s.id}
                  name={s.label}
                  stroke={s.color}
                  strokeWidth={focus === s.id ? 3 : 2}
                  strokeOpacity={focus && focus !== s.id ? 0.2 : 1}
                  strokeDasharray={s.dashed ? "5 4" : undefined}
                  dot={false}
                  activeDot={{ r: 4, stroke: "#111114", strokeWidth: 2 }}
                  connectNulls
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="scroll-x max-h-[420px] overflow-y-auto rounded-xl border border-line">
          <table className="data-table num">
            <thead className="sticky top-0 bg-surface">
              <tr>
                <th />
                {series.map((s) => (
                  <th key={s.id}>{s.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="text-ink-2">{fullLabels?.[i] ?? String(r.label)}</td>
                  {series.map((s) => (
                    <td key={s.id}>{r[s.id] == null ? "—" : valueFormat(r[s.id] as number)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
