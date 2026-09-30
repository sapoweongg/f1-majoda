export const COMPOUND_COLORS: Record<string, string> = {
  SOFT: "#FF3B30",
  MEDIUM: "#FFD60A",
  HARD: "#F2F2F7",
  INTERMEDIATE: "#30D158",
  WET: "#0A84FF",
  UNKNOWN: "#6E6E78",
};

export type StintRow = {
  id: string;
  label: string;
  teamColor: string;
  stints: { compound: string; from: number; to: number; age: number | null }[];
};

/** Estrategia de neumáticos: una barra por piloto, un tramo por stint coloreado por compuesto. */
export function TyreStints({
  rows,
  totalLaps,
  compoundLabels,
  lapLabel,
}: {
  rows: StintRow[];
  totalLaps: number;
  compoundLabels: Record<string, string>;
  lapLabel: string;
}) {
  const used = [...new Set(rows.flatMap((r) => r.stints.map((s) => s.compound)))];
  const ticks = Array.from({ length: Math.floor(totalLaps / 10) + 1 }, (_, i) => i * 10).filter((x) => x <= totalLaps);
  return (
    <div>
      <ul className="mb-4 flex flex-wrap gap-4 text-xs text-ink-2">
        {used.map((c) => (
          <li key={c} className="flex items-center gap-1.5">
            <span className="h-2.5 w-4 rounded-sm" style={{ background: COMPOUND_COLORS[c] ?? COMPOUND_COLORS.UNKNOWN }} />
            {compoundLabels[c] ?? c}
          </li>
        ))}
      </ul>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.id} className="grid grid-cols-[3.25rem_1fr] items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold">
              <span className="h-3 w-1 rounded-full" style={{ background: r.teamColor }} aria-hidden />
              {r.label}
            </span>
            <div className="relative flex h-5 gap-[2px]">
              {r.stints.map((s, i) => {
                const width = ((s.to - s.from + 1) / totalLaps) * 100;
                const color = COMPOUND_COLORS[s.compound] ?? COMPOUND_COLORS.UNKNOWN;
                const text = `${r.label} · ${compoundLabels[s.compound] ?? s.compound} · ${lapLabel} ${s.from}–${s.to}${
                  s.age ? ` (+${s.age})` : ""
                }`;
                return (
                  <span
                    key={i}
                    title={text}
                    aria-label={text}
                    className="flex h-full items-center justify-center overflow-hidden rounded-[4px] text-[10px] font-bold text-black/70"
                    style={{ width: `${width}%`, background: color, marginLeft: i === 0 ? `${((s.from - 1) / totalLaps) * 100}%` : 0 }}
                  >
                    {width > 6 ? (compoundLabels[s.compound] ?? s.compound).charAt(0) : ""}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-[3.25rem_1fr] gap-2">
        <span className="text-[10px] uppercase tracking-wider text-ink-3">{lapLabel}</span>
        <div className="relative h-4">
          {ticks.map((t) => (
            <span
              key={t}
              className="num absolute -translate-x-1/2 text-[10px] text-ink-3"
              style={{ left: `${(t / totalLaps) * 100}%` }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
