import type { ReactNode } from "react";
import { Crown, Equal, Timer } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { trackShape } from "@/lib/circuits";
import { countryToIso } from "@/lib/countries";
import type { DuelRound, DuelSide } from "@/lib/duel2021";
import { gpName, gpPlace } from "@/lib/gp-names";
import { TrackOutline } from "@/components/track/TrackOutline";
import { Flag } from "@/components/ui/primitives";
import radios from "@/data/duel2021-radios.json";
import { RadioCard } from "./RadioCard";

// Piezas de las páginas del duelo de 2021 (Max y Hamilton). Cada página elige su lado (`me`), su color
// de acento y su fondo; los colores van en hexadecimal de 6 cifras para poder añadirles transparencia.

export type DuelTheme = {
  /** Piloto protagonista de la página. */
  me: "ver" | "ham";
  /** Código y color de datos del rival. */
  rival: { code: string; color: string };
  accent: string;
  surface: string;
};

/** Ventaja del protagonista tras la ronda (positiva: lidera el Mundial). */
export const leadOf = (r: DuelRound, me: DuelTheme["me"]) => (me === "ver" ? r.gap : -r.gap);

export function resultLabel(s: DuelSide, retired: string) {
  return s.position ? `P${s.position}` : s.positionText === "R" ? retired : s.positionText;
}

export function DuelRaceGrid({
  rounds,
  theme,
  locale,
  labels,
}: {
  rounds: DuelRound[];
  theme: DuelTheme;
  locale: string;
  labels: { started: (grid: number) => string; pitLane: string; retired: string; leader: string; tie: string; sprintWin: string; fastestLap: string };
}) {
  const { accent, surface, me, rival } = theme;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {rounds.map((r) => {
        const mine = r[me];
        const theirs = me === "ver" ? r.ham : r.ver;
        const shape = trackShape(r.circuitId, 2021);
        const win = mine.position === 1;
        const lead = leadOf(r, me);
        return (
          <Link
            key={r.round}
            href={`/races/2021/${r.round}`}
            className="relative overflow-hidden rounded-2xl border p-4 transition-transform hover:-translate-y-0.5"
            style={{
              borderColor: win ? `${accent}66` : "rgb(255 255 255 / 0.1)",
              background: win ? `linear-gradient(160deg, ${accent}29, ${surface} 70%)` : "#111114",
            }}
          >
            {shape && (
              // El trazado toma el color de acento en las victorias (el SVG pinta con currentColor)
              <span className="absolute -right-3 -top-3 h-24 w-24" style={{ color: win ? `${accent}40` : "rgb(255 255 255 / 0.07)" }}>
                <TrackOutline shape={shape} variant="mini" className="h-full w-full" />
              </span>
            )}
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

/** Línea de tiempo de momentos: cada entrada es [ronda, texto]. */
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
  const { accent, surface, me } = theme;
  const byRound = new Map(rounds.map((r) => [r.round, r]));
  return (
    <ol className="relative max-w-3xl space-y-6 border-l pl-6 sm:pl-8" style={{ borderColor: `${accent}4d` }}>
      {items.map(([round, text]) => {
        const r = byRound.get(round);
        if (!r) return null;
        const win = r[me].position === 1;
        return (
          <li key={round} className="relative">
            <span
              className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 sm:-left-[39px]"
              style={{ borderColor: accent, background: win ? accent : surface }}
              aria-hidden
            />
            <Link href={`/races/2021/${r.round}`} className="group block">
              <p className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-3">
                <span className="num">R{r.round}</span> <Flag iso={countryToIso(r.country)} /> {gpName(r.raceName, locale)}
                <span className="display ml-1 text-sm normal-case" style={{ color: win ? accent : undefined }}>
                  {resultLabel(r[me], retired)}
                </span>
              </p>
              <p className="mt-1 text-lg text-ink group-hover:text-white">{text}</p>
            </Link>
          </li>
        );
      })}
    </ol>
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

/**
 * Radios oficiales del protagonista (src/data/duel2021-radios.json), agrupadas por carrera. Solo salen
 * las rondas con título en los textos de la página.
 */
export function DuelRadios({
  titles,
  theme,
  labels,
}: {
  titles: Partial<Record<number, string>>;
  theme: DuelTheme;
  labels: { play: string; pause: string };
}) {
  const groups = Object.entries(titles)
    .map(([round, title]) => ({
      title: title ?? "",
      clips: radios.filter((x) => x.driver === theme.me && x.round === Number(round)).map((x) => x.url),
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
