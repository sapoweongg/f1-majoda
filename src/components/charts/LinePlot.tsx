"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { chartValueFormat, type ChartFormat } from "./chart-format";
import type { Series } from "./LineSeriesChart";

// El dibujo de Recharts, separado de LineSeriesChart para cargarlo aparte (ver allí).

const AXIS = { stroke: "#6e6e78", fontSize: 11 };

export type LinePlotProps = {
  rows: Record<string, number | string | null>[];
  series: Series[];
  fullLabels?: string[];
  reversed?: boolean;
  yDomain?: [number | "auto", number | "auto"];
  format: ChartFormat;
  sortTooltip: boolean;
  /** Serie resaltada desde la leyenda. */
  focus: string | null;
};

export function LinePlot({ rows, series, fullLabels, reversed, yDomain, format, sortTooltip, focus }: LinePlotProps) {
  const valueFormat = chartValueFormat(format);
  return (
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
  );
}
