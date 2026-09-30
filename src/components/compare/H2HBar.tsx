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
  const va = a ?? 0;
  const vb = b ?? 0;
  const total = va + vb;
  // Para "menor es mejor" (medias de posición) invertimos para que la barra grande sea la buena
  const shareA = total === 0 ? 50 : lowerIsBetter ? (vb / total) * 100 : (va / total) * 100;
  const aBetter = lowerIsBetter ? va < vb : va > vb;
  const bBetter = lowerIsBetter ? vb < va : vb > va;
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
