"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/format";
import { chartValueFormat, type ChartFormat } from "./chart-format";

// Recharts pesa unos 100 KB comprimidos. Solo puede dibujar en el navegador (necesita medir el ancho),
// así que se carga aparte, sin bloquear el resto de la página: leyenda y tabla salen del servidor.
const LinePlot = dynamic(() => import("./LinePlot").then((m) => m.LinePlot), { ssr: false });

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
  format?: ChartFormat;
  tableLabel?: string;
  chartLabel?: string;
  xTitle?: string;
  /** Series ordenadas por valor en el tooltip (mayor primero, o menor si reversed). */
  sortTooltip?: boolean;
};

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
  const valueFormat = chartValueFormat(format);
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
        // El servidor manda el hueco con el esqueleto; se oculta en cuanto Recharts dibuja el SVG
        <div className="chart-panel relative" style={{ height }}>
          <div className="chart-skeleton pointer-events-none absolute inset-0 animate-pulse rounded-lg bg-white/[0.04]" aria-hidden />
          <LinePlot
            rows={rows}
            series={series}
            fullLabels={fullLabels}
            reversed={reversed}
            yDomain={yDomain}
            format={format}
            sortTooltip={sortTooltip}
            focus={focus}
          />
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
