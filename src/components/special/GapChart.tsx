import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/format";

export type GapPoint = {
  round: number;
  /** Nombre del GP para el tooltip y la tabla. */
  label: string;
  href: string;
  /** Puntos acumulados de cada piloto tras la ronda. */
  a: number;
  b: number;
};

type Props = {
  points: GapPoint[];
  locale: string;
  /** Piloto A (barras hacia arriba) y piloto B (hacia abajo), con el color de cada uno. */
  a: { name: string; color: string };
  b: { name: string; color: string };
  labels: { aAhead: string; bAhead: string; tie: string; table: string; round: string; gp: string; gap: string };
  /** Rondas con la cifra escrita junto a la barra (los extremos y el final); el resto, en el tooltip. */
  highlight?: number[];
};

const TICK = 10;

/**
 * La balanza: ventaja en puntos de A sobre B tras cada ronda, en barras divergentes desde el cero.
 * Cada barra enlaza a su carrera y muestra el detalle al pasar por encima o al enfocarla.
 */
export function GapChart({ points, locale, a, b, labels, highlight = [] }: Props) {
  const nf = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  const signed = (n: number) => (n > 0 ? `+${nf.format(n)}` : n < 0 ? `−${nf.format(-n)}` : "0");
  const gaps = points.map((p) => p.a - p.b);
  const hi = Math.max(TICK, Math.ceil(Math.max(...gaps) / TICK) * TICK);
  const lo = Math.min(-TICK, Math.floor(Math.min(...gaps) / TICK) * TICK);
  const range = hi - lo;
  const pct = (v: number) => ((hi - v) / range) * 100; // posición vertical desde arriba
  const zero = pct(0);
  const ticks: number[] = [];
  for (let v = hi; v >= lo; v -= TICK) ticks.push(v);

  return (
    <figure>
      {/* Leyenda */}
      <div className="mb-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-2">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: a.color }} aria-hidden /> {labels.aAhead}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: b.color }} aria-hidden /> {labels.bAhead}
        </span>
      </div>

      <div className="flex gap-2">
        {/* Eje Y */}
        <div className="relative h-64 w-7 shrink-0 text-right text-[10px] text-ink-3 sm:h-80" aria-hidden>
          {ticks.map((v) => (
            <span key={v} className="num absolute right-0 -translate-y-1/2" style={{ top: `${pct(v)}%` }}>
              {signed(v)}
            </span>
          ))}
        </div>

        <div className="relative min-w-0 flex-1">
          {/* Rejilla y línea del cero */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-64 sm:h-80" aria-hidden>
            {ticks.map((v) => (
              <div
                key={v}
                className={cn("absolute inset-x-0 h-px", v === 0 ? "bg-white/40" : "bg-white/[0.07]")}
                style={{ top: `${pct(v)}%` }}
              />
            ))}
          </div>

          <ol className="relative grid h-64 sm:h-80" style={{ gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))`, columnGap: 2 }}>
            {points.map((p, i) => {
              const gap = p.a - p.b;
              const color = gap > 0 ? a.color : b.color;
              const height = (Math.abs(gap) / range) * 100;
              const align = i < 3 ? "left-0" : i > points.length - 4 ? "right-0" : "left-1/2 -translate-x-1/2";
              const label = `${labels.round} ${p.round} · ${p.label}: ${a.name} ${nf.format(p.a)}, ${b.name} ${nf.format(p.b)} (${signed(gap)})`;
              return (
                <li key={p.round} className="relative">
                  <Link href={p.href} aria-label={label} className="group absolute inset-0 block rounded-sm outline-offset-2 hover:bg-white/[0.04]">
                    {gap === 0 ? (
                      <span
                        className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-2 ring-2 ring-[#0b1530]"
                        style={{ top: `${zero}%` }}
                      />
                    ) : (
                      <span
                        className={cn("absolute inset-x-0 mx-auto block w-full max-w-6", gap > 0 ? "rounded-t" : "rounded-b")}
                        style={{
                          background: color,
                          height: `${height}%`,
                          ...(gap > 0 ? { bottom: `${100 - zero}%` } : { top: `${zero}%` }),
                        }}
                      />
                    )}
                    {/* Cifra directa solo en las rondas destacadas */}
                    {highlight.includes(p.round) && (
                      <span
                        className="num absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold text-ink"
                        style={
                          gap >= 0
                            ? { bottom: `calc(${100 - zero + height}% + 4px)` }
                            : { top: `calc(${zero + height}% + 4px)` }
                        }
                      >
                        {gap === 0 ? "=" : signed(gap)}
                      </span>
                    )}
                    {/* Tooltip: en la mitad contraria a la barra, para no taparla */}
                    <span
                      className={cn(
                        "pointer-events-none absolute z-10 hidden w-max max-w-[14rem] rounded-xl border border-white/10 bg-[#05080f]/95 px-3 py-2 text-xs shadow-xl group-hover:block group-focus-visible:block",
                        gap > 0 ? "bottom-0" : "top-0",
                        align,
                      )}
                    >
                      <span className="block font-semibold text-ink">
                        {labels.round} {p.round} · {p.label}
                      </span>
                      <span className="mt-1 flex items-center gap-1.5 text-ink-2">
                        <span className="h-2 w-2 rounded-sm" style={{ background: a.color }} /> {a.name}{" "}
                        <span className="num ml-auto pl-3 text-ink">{nf.format(p.a)}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-ink-2">
                        <span className="h-2 w-2 rounded-sm" style={{ background: b.color }} /> {b.name}{" "}
                        <span className="num ml-auto pl-3 text-ink">{nf.format(p.b)}</span>
                      </span>
                      <span className="mt-1 block border-t border-white/10 pt-1 text-ink-3">
                        {gap === 0 ? labels.tie : `${gap > 0 ? a.name : b.name} ${signed(Math.abs(gap))}`}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>

          {/* Eje X: número de ronda */}
          <div
            className="mt-2 grid text-center text-[9px] text-ink-3 sm:text-[10px]"
            style={{ gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))`, columnGap: 2 }}
            aria-hidden
          >
            {points.map((p) => (
              <span key={p.round} className="num">
                {p.round}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Vista de tabla */}
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-xs font-semibold text-ink-2 hover:text-ink">{labels.table}</summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-ink-3">
              <tr>
                <th className="py-1 pr-3 font-medium">{labels.round}</th>
                <th className="py-1 pr-3 font-medium">{labels.gp}</th>
                <th className="py-1 pr-3 text-right font-medium">{a.name}</th>
                <th className="py-1 pr-3 text-right font-medium">{b.name}</th>
                <th className="py-1 text-right font-medium">{labels.gap}</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.round} className="border-t border-white/5">
                  <td className="num py-1 pr-3">{p.round}</td>
                  <td className="py-1 pr-3">{p.label}</td>
                  <td className="num py-1 pr-3 text-right">{nf.format(p.a)}</td>
                  <td className="num py-1 pr-3 text-right">{nf.format(p.b)}</td>
                  <td className="num py-1 text-right">{signed(p.a - p.b)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
