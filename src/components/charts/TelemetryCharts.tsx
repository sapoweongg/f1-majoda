"use client";

import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ComparedPoint } from "@/lib/telemetry";

type Driver = { label: string; color: string; dashed?: boolean };

const AXIS = { stroke: "#6e6e78", fontSize: 11 };

type Panel = {
  key: string;
  title: string;
  a: keyof ComparedPoint;
  b?: keyof ComparedPoint;
  height: number;
  domain?: [number, number];
  step?: boolean;
  unit?: string;
};

/**
 * Pequeños múltiplos que comparten el eje de distancia y el cursor (syncId):
 * velocidad, acelerador, freno, marcha y diferencia de tiempo.
 */
export function TelemetryCharts({
  data,
  a,
  b,
  labels,
}: {
  data: ComparedPoint[];
  a: Driver;
  b: Driver;
  labels: { speed: string; throttle: string; brake: string; gear: string; delta: string; distance: string; deltaHelp: string };
}) {
  const panels: Panel[] = [
    { key: "speed", title: labels.speed, a: "aSpeed", b: "bSpeed", height: 220, unit: " km/h" },
    { key: "throttle", title: labels.throttle, a: "aThrottle", b: "bThrottle", height: 120, domain: [0, 100], unit: "%" },
    { key: "brake", title: labels.brake, a: "aBrake", b: "bBrake", height: 80, domain: [0, 100], step: true },
    { key: "gear", title: labels.gear, a: "aGear", b: "bGear", height: 110, domain: [1, 8], step: true },
    { key: "delta", title: labels.delta, a: "delta", height: 150, unit: " s" },
  ];

  return (
    <div className="space-y-5">
      <ul className="flex flex-wrap gap-4 text-xs text-ink-2">
        {[a, b].map((d) => (
          <li key={d.label} className="flex items-center gap-1.5">
            <svg width="18" height="6" aria-hidden>
              <line x1="1" y1="3" x2="17" y2="3" stroke={d.color} strokeWidth="2.5" strokeDasharray={d.dashed ? "4 3" : undefined} />
            </svg>
            {d.label}
          </li>
        ))}
      </ul>
      {panels.map((p, i) => (
        <div key={p.key}>
          <p className="eyebrow mb-1">
            {p.title}
            {p.key === "delta" && <span className="ml-2 normal-case tracking-normal text-ink-3">{labels.deltaHelp}</span>}
          </p>
          <div style={{ height: p.height }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} syncId="telemetry" margin={{ top: 4, right: 12, bottom: 0, left: -8 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                  dataKey="d"
                  type="number"
                  domain={["dataMin", "dataMax"]}
                  tick={i === panels.length - 1 ? AXIS : false}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
                  height={i === panels.length - 1 ? 24 : 4}
                  tickFormatter={(v: number) => `${Math.round(v)}`}
                />
                <YAxis
                  tick={AXIS}
                  tickLine={false}
                  axisLine={false}
                  width={44}
                  domain={p.domain ?? ["auto", "auto"]}
                  allowDecimals={p.key === "delta"}
                  tickCount={p.key === "brake" ? 2 : undefined}
                />
                {p.key === "delta" && <ReferenceLine y={0} stroke="rgba(255,255,255,0.3)" />}
                <Tooltip
                  cursor={{ stroke: "rgba(255,255,255,0.3)", strokeWidth: 1 }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0].payload as ComparedPoint;
                    return (
                      <div className="glass !rounded-xl p-2.5 text-xs shadow-2xl">
                        <p className="mb-1 text-ink-3">
                          {labels.distance}: <span className="num text-ink">{row.d}</span>
                        </p>
                        {p.b ? (
                          <>
                            <p className="flex items-center gap-2">
                              <span className="inline-block h-0.5 w-3" style={{ background: a.color }} />
                              <span className="display num text-sm">{String(row[p.a])}{p.unit ?? ""}</span>
                              <span className="text-ink-2">{a.label}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="inline-block h-0.5 w-3" style={{ background: b.color }} />
                              <span className="display num text-sm">{String(row[p.b])}{p.unit ?? ""}</span>
                              <span className="text-ink-2">{b.label}</span>
                            </p>
                          </>
                        ) : (
                          <p className="display num text-sm">
                            {row.delta > 0 ? "+" : ""}
                            {row.delta.toFixed(3)} s
                          </p>
                        )}
                      </div>
                    );
                  }}
                />
                <Line
                  dataKey={p.a}
                  type={p.step ? "stepAfter" : "monotone"}
                  stroke={p.key === "delta" ? "#f5f5f7" : a.color}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                {p.b && (
                  <Line
                    dataKey={p.b}
                    type={p.step ? "stepAfter" : "monotone"}
                    stroke={b.color}
                    strokeWidth={2}
                    strokeDasharray={b.dashed ? "5 4" : undefined}
                    dot={false}
                    isAnimationActive={false}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
}
