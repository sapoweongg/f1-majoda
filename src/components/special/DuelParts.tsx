import type { ReactNode } from "react";
import { Crown, Equal, Timer } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { trackShape } from "@/lib/circuits";
import { countryToIso } from "@/lib/countries";
import type { DuelRound, DuelSide } from "@/lib/duel";
import { cn } from "@/lib/format";
import { gpName, gpPlace } from "@/lib/gp-names";
import { TrackOutline } from "@/components/track/TrackOutline";
import { Flag } from "@/components/ui/primitives";
import { RadioCard } from "./RadioCard";

// Piezas de las páginas de duelos (Max y Hamilton 2021, Senna y Prost 1989). Cada página elige su
// temporada, los dos pilotos con su color de datos, su acento y su fondo; si tiene protagonista (`me`)
// se cuenta desde su lado, y si no, muestra a los dos por igual. Los colores van en hexadecimal de
// 6 cifras para poder añadirles transparencia.

export type DuelTheme = {
  season: number;
  /** Protagonista de la página (lado A o B del duelo). Sin él, la página es neutral. */
  me?: "a" | "b";
  a: { code: string; color: string };
  b: { code: string; color: string };
  accent: string;
  surface: string;
};

/** Ventaja del protagonista tras la ronda (positiva: lidera el Mundial). */
export const leadOf = (r: DuelRound, me: "a" | "b") => (me === "a" ? r.gap : -r.gap);

/** Resultado corto: P1…, abandono (R, o W si se retiró por decisión propia), DSQ o NC. */
export function resultLabel(s: DuelSide, retired: string) {
  if (s.position) return `P${s.position}`;
  if (s.positionText === "R" || s.positionText === "W") return retired;
  return s.positionText === "D" ? "DSQ" : s.positionText === "N" ? "NC" : s.positionText;
}

type GridLabels = { started: (grid: number) => string; pitLane: string; retired: string; leader: string; tie: string; sprintWin: string; fastestLap: string };

/** Trazado de fondo de una tarjeta: toma el color de acento si se resalta (el SVG pinta con currentColor). */
function CardTrack({ circuitId, season, highlight, accent }: { circuitId: string; season: number; highlight: boolean; accent: string }) {
  const shape = trackShape(circuitId, season);
  if (!shape) return null;
  return (
    <span className="absolute -right-3 -top-3 h-24 w-24" style={{ color: highlight ? `${accent}40` : "rgb(255 255 255 / 0.07)" }}>
      <TrackOutline shape={shape} variant="mini" className="h-full w-full" />
    </span>
  );
}

/** Carrera a carrera desde el lado del protagonista, con el resultado del rival en pequeño. */
export function DuelRaceGrid({ rounds, theme, locale, labels }: { rounds: DuelRound[]; theme: DuelTheme & { me: "a" | "b" }; locale: string; labels: GridLabels }) {
  const { accent, surface, me, season } = theme;
  const rival = me === "a" ? theme.b : theme.a;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {rounds.map((r) => {
        const mine = r[me];
        const theirs = r[me === "a" ? "b" : "a"];
        const win = mine.position === 1;
        const lead = leadOf(r, me);
        return (
          <Link
            key={r.round}
            href={`/races/${season}/${r.round}`}
            className="relative overflow-hidden rounded-2xl border p-4 transition-transform hover:-translate-y-0.5"
            style={{
              borderColor: win ? `${accent}66` : "rgb(255 255 255 / 0.1)",
              background: win ? `linear-gradient(160deg, ${accent}29, ${surface} 70%)` : "#111114",
            }}
          >
            <CardTrack circuitId={r.circuitId} season={season} highlight={win} accent={accent} />
            <p className="relative flex items-center gap-1.5 text-[11px] text-ink-3">
              <span className="num">R{r.round}</span>
              <Flag iso={countryToIso(r.country)} />
              {lead > 0 && <Crown size={12} style={{ color: accent }} aria-label={labels.leader} />}
              {lead === 0 && <Equal size={12} className="text-ink-2" aria-label={labels.tie} />}
            </p>
            <p className="display relative mt-5 text-4xl" style={{ color: win ? accent : undefined }}>
              {resultLabel(mine, labels.retired)}
            </p>
            <p className="relative mt-1 truncate text-xs font-semibold">{gpPlace(r.raceName, locale)}</p>
            <p className="relative text-[11px] text-ink-3">{mine.grid > 0 ? labels.started(mine.grid) : labels.pitLane}</p>
            <div className="relative mt-2 flex flex-wrap items-center gap-1.5">
              {mine.pole && <span className="rounded bg-white/10 px-1.5 text-[10px] font-bold">POLE</span>}
              {mine.fastestLap && (
                <span className="rounded bg-[#af52de]/25 px-1.5 text-[10px] font-bold text-[#d6a4f0]" title={labels.fastestLap}>
                  <Timer size={10} className="inline" aria-hidden /> VR
                </span>
              )}
              {mine.sprintWin && (
                <span className="rounded px-1.5 text-[10px] font-bold" style={{ color: accent, background: `${accent}33` }} title={labels.sprintWin}>
                  S1
                </span>
              )}
              <span className="ml-auto flex items-center gap-1 text-[10px] text-ink-3">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: rival.color }} aria-hidden />
                {rival.code} {resultLabel(theirs, labels.retired)}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/**
 * Carrera a carrera de una página neutral: los dos resultados con el mismo peso. Se resalta quién
 * terminó delante y la corona marca quién lideraba el Mundial tras la carrera.
 */
export function DuelPairGrid({
  rounds,
  theme,
  locale,
  labels,
}: {
  rounds: DuelRound[];
  theme: DuelTheme;
  locale: string;
  labels: Pick<GridLabels, "retired" | "leader" | "tie"> & { winner: (name: string) => string };
}) {
  const { accent, surface, season } = theme;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {rounds.map((r) => {
        const sides = (["a", "b"] as const).map((k) => ({ k, side: r[k], who: theme[k], leads: leadOf(r, k) > 0 }));
        // Quién terminó delante (los no clasificados quedan detrás de cualquier clasificado)
        const rank = (s: DuelSide) => s.position ?? 99;
        const ahead = rank(r.a) === rank(r.b) ? null : rank(r.a) < rank(r.b) ? "a" : "b";
        const someoneWon = r.a.position === 1 || r.b.position === 1;
        return (
          <Link
            key={r.round}
            href={`/races/${season}/${r.round}`}
            className="relative overflow-hidden rounded-2xl border p-4 transition-transform hover:-translate-y-0.5"
            style={{
              borderColor: someoneWon ? `${accent}55` : "rgb(255 255 255 / 0.1)",
              background: someoneWon ? `linear-gradient(160deg, ${accent}1f, ${surface} 70%)` : "#111114",
            }}
          >
            <CardTrack circuitId={r.circuitId} season={season} highlight={someoneWon} accent={accent} />
            <p className="relative flex items-center gap-1.5 text-[11px] text-ink-3">
              <span className="num">R{r.round}</span>
              <Flag iso={countryToIso(r.country)} />
              {r.gap === 0 && <Equal size={12} className="text-ink-2" aria-label={labels.tie} />}
            </p>
            <p className="relative mt-2 truncate text-sm font-semibold">{gpPlace(r.raceName, locale)}</p>
            <ul className="relative mt-3 space-y-1.5">
              {sides.map(({ k, side, who, leads }) => (
                <li key={k} className={cn("flex items-center gap-2", ahead && ahead !== k && "opacity-55")}>
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: who.color }} aria-hidden />
                  <span className="w-9 text-[11px] font-bold text-ink-2">{who.code}</span>
                  <span className="display num text-2xl" style={{ color: side.position === 1 ? accent : undefined }}>
                    {resultLabel(side, labels.retired)}
                  </span>
                  {side.pole && <span className="rounded bg-white/10 px-1 text-[9px] font-bold">POLE</span>}
                  {leads && <Crown size={12} className="ml-auto" style={{ color: accent }} aria-label={labels.leader} />}
                </li>
              ))}
            </ul>
            {!someoneWon && r.winner && <p className="relative mt-2 text-[11px] text-ink-3">{labels.winner(r.winner)}</p>}
          </Link>
        );
      })}
    </div>
  );
}

/**
 * Línea de tiempo de momentos: cada entrada es [ronda, texto]. Con protagonista se ve su resultado; en
 * una página neutral, los de los dos.
 */
export function DuelMoments({
  items,
  rounds,
  theme,
  locale,
  retired,
}: {
  items: [number, string][];
  rounds: DuelRound[];
  theme: DuelTheme;
  locale: string;
  retired: string;
}) {
  const { accent, surface, me, season } = theme;
  const byRound = new Map(rounds.map((r) => [r.round, r]));
  return (
    <ol className="relative max-w-3xl space-y-6 border-l pl-6 sm:pl-8" style={{ borderColor: `${accent}4d` }}>
      {items.map(([round, text]) => {
        const r = byRound.get(round);
        if (!r) return null;
        const win = me ? r[me].position === 1 : r.a.position === 1 || r.b.position === 1;
        return (
          <li key={round} className="relative">
            <span
              className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 sm:-left-[39px]"
              style={{ borderColor: accent, background: win ? accent : surface }}
              aria-hidden
            />
            <Link href={`/races/${season}/${r.round}`} className="group block">
              <p className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-3">
                <span className="num">R{r.round}</span> <Flag iso={countryToIso(r.country)} /> {gpName(r.raceName, locale)}
                {me ? (
                  <span className="display ml-1 text-sm normal-case" style={{ color: win ? accent : undefined }}>
                    {resultLabel(r[me], retired)}
                  </span>
                ) : (
                  (["a", "b"] as const).map((k) => (
                    <span key={k} className="ml-1 flex items-center gap-1 normal-case">
                      <span className="h-2 w-2 rounded-full" style={{ background: theme[k].color }} aria-hidden />
                      <span className="display text-sm" style={{ color: r[k].position === 1 ? accent : undefined }}>
                        {theme[k].code} {resultLabel(r[k], retired)}
                      </span>
                    </span>
                  ))
                )}
              </p>
              <p className="mt-1 text-lg text-ink group-hover:text-white">{text}</p>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Cara a cara: cada fila con el valor de los dos pilotos y barras que salen del centro (A a la izquierda,
 * B a la derecha). El valor mayor va en negrita; el color de datos solo lo llevan las barras.
 */
export function DuelCompare({
  rows,
  theme,
  locale,
  names,
}: {
  rows: { label: string; a: number; b: number }[];
  theme: DuelTheme;
  locale: string;
  names: { a: string; b: string };
}) {
  const nf = new Intl.NumberFormat(locale);
  return (
    <div>
      {/* Leyenda */}
      <div className="mb-5 flex justify-between text-sm font-semibold">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: theme.a.color }} aria-hidden /> {names.a}
        </span>
        <span className="flex items-center gap-2">
          {names.b} <span className="h-2.5 w-2.5 rounded-sm" style={{ background: theme.b.color }} aria-hidden />
        </span>
      </div>
      <dl className="space-y-4">
        {rows.map((r) => {
          const max = Math.max(r.a, r.b, 1);
          const strong = (mine: number, other: number) => (mine > other ? "font-bold text-ink" : "text-ink-2");
          return (
            <div key={r.label}>
              <dt className="eyebrow mb-1.5 text-center">{r.label}</dt>
              <dd className="grid grid-cols-[2.5rem_1fr_1fr_2.5rem] items-center gap-x-[2px]">
                <span className={cn("display num pr-2 text-right text-2xl", strong(r.a, r.b))}>{nf.format(r.a)}</span>
                <span className="flex h-3 justify-end" aria-hidden>
                  <span className="h-full rounded-l" style={{ width: `${(r.a / max) * 100}%`, background: theme.a.color }} />
                </span>
                <span className="flex h-3" aria-hidden>
                  <span className="h-full rounded-r" style={{ width: `${(r.b / max) * 100}%`, background: theme.b.color }} />
                </span>
                <span className={cn("display num pl-2 text-2xl", strong(r.b, r.a))}>{nf.format(r.b)}</span>
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

/** Tarjetas de texto con icono (lo que significó / lo que demostró). */
export function HonourCards({ cards, theme, icon }: { cards: { title: string; text: string }[]; theme: DuelTheme; icon: ReactNode }) {
  const { accent, surface } = theme;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-[1.5rem] border p-5"
          style={{ borderColor: `${accent}40`, background: `radial-gradient(120% 100% at 100% 0%, ${accent}24, ${surface} 60%)` }}
        >
          <span style={{ color: accent }}>{icon}</span>
          <p className="display mt-4 text-3xl">{card.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">{card.text}</p>
        </div>
      ))}
    </div>
  );
}

/** Radios oficiales (ronda y URL) agrupadas por carrera. Solo salen las rondas con título en los textos. */
export function DuelRadios({
  clips,
  titles,
  theme,
  labels,
}: {
  clips: { round: number; url: string }[];
  titles: Partial<Record<number, string>>;
  theme: DuelTheme;
  labels: { play: string; pause: string };
}) {
  const groups = Object.entries(titles)
    .map(([round, title]) => ({
      title: title ?? "",
      clips: clips.filter((x) => x.round === Number(round)).map((x) => x.url),
    }))
    .filter((g) => g.title && g.clips.length);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {groups.map((g) => (
        <RadioCard
          key={g.title}
          title={g.title}
          clips={g.clips}
          labels={labels}
          colors={{ accent: theme.accent, ink: theme.surface, iconBg: `${theme.accent}26` }}
        />
      ))}
    </div>
  );
}
