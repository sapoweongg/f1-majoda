/** Barra enfrentada: la parte de cada piloto es proporcional a su valor. */
export function H2HBar({
  label,
  a,
  b,
  colorA,
  colorB,
  format = (v) => String(v),
  lowerIsBetter,
}: {
  label: string;
  a: number | null;
  b: number | null;
  colorA: string;
  colorB: string;
  format?: (v: number) => string;
  lowerIsBetter?: boolean;
}) {
  let shareA = 50;
  let aBetter = false;
  let bBetter = false;
  if (a != null && b != null) {
    const total = a + b;
    // Para "menor es mejor" (medias de posición) invertimos para que la barra grande sea la buena
    if (total > 0) shareA = lowerIsBetter ? (b / total) * 100 : (a / total) * 100;
    aBetter = lowerIsBetter ? a < b : a > b;
    bBetter = lowerIsBetter ? b < a : b > a;
  } else if (a != null || b != null) {
    // Sin dato (p. ej. ninguna llegada a meta) no puede ser lo mejor: la barra es entera del otro
    shareA = a != null ? 100 : 0;
    aBetter = a != null;
    bBetter = b != null;
  }
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-sm">
        <span className={`display num text-2xl ${aBetter ? "text-ink" : "text-ink-3"}`}>{a == null ? "—" : format(a)}</span>
        <span className="eyebrow">{label}</span>
        <span className={`display num text-2xl ${bBetter ? "text-ink" : "text-ink-3"}`}>{b == null ? "—" : format(b)}</span>
      </div>
      <div className="flex h-2 gap-[2px] overflow-hidden rounded-full">
        <div className="h-full rounded-l-full" style={{ width: `${shareA}%`, background: colorA }} />
        <div className="h-full flex-1 rounded-r-full" style={{ background: colorB }} />
      </div>
    </div>
  );
}
