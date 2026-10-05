"use client";

import useSWR from "swr";
import { useLocale, useTranslations } from "next-intl";
import type { LiveSnapshot } from "@/lib/live-types";
import { cn } from "@/lib/format";
import { translateRaceControl } from "@/lib/race-control";
import { TimingTower, TrackStatusBadge, type TowerLabels } from "./TimingTower";

const fetcher = (url: string) => fetch(url).then((r) => r.json() as Promise<LiveSnapshot>);

/** Timing en vivo: consulta /api/live cada 5 s y conserva la última foto mientras llega la siguiente. */
export function LiveTiming({ initial, labels }: { initial: LiveSnapshot; labels: TowerLabels }) {
  const t = useTranslations("live");
  const tr = useTranslations("races");
  const locale = useLocale();
  const { data, isValidating } = useSWR("/api/live", fetcher, {
    fallbackData: initial,
    refreshInterval: 5000,
    revalidateOnFocus: true,
    keepPreviousData: true,
  });
  const snap = data ?? initial;
  const flagKey = snap.trackStatus ?? "";
  const flagLabel = flagKey ? (t.has(`flags.${flagKey}`) ? t(`flags.${flagKey}`) : flagKey) : null;
  const colorOf = new Map(snap.rows.map((r) => [r.number, r.color]));
  const codeOf = new Map(snap.rows.map((r) => [r.number, r.code]));

  return (
    <div className={cn("grid gap-6 transition-opacity xl:grid-cols-[1.3fr_1fr]", isValidating && "opacity-95")}>
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
            <span className="live-dot h-2 w-2 rounded-full bg-accent" /> LIVE
          </span>
          <TrackStatusBadge status={snap.trackStatus} label={flagLabel} />
          {snap.lap && <span className="chip">{t("lap", { n: snap.lap })}</span>}
          <span className="text-xs text-ink-3">
            {t("updated", { time: new Date(snap.updatedAt).toLocaleTimeString(locale) })}
          </span>
        </div>
        <TimingTower rows={snap.rows} labels={labels} />
      </div>
      <div className="space-y-6">
        {snap.outline && (
          <div className="glass p-4">
            <svg viewBox="0 0 500 500" className="w-full" role="img" aria-label={t("tower")}>
              <polyline points={snap.outline} fill="none" stroke="#2a2a2e" strokeWidth={14} strokeLinejoin="round" strokeLinecap="round" />
              <polyline points={snap.outline} fill="none" stroke="#3a3a40" strokeWidth={4} strokeLinejoin="round" />
              {snap.cars.map((c) => (
                <g key={c.number} style={{ transition: "transform 1s linear" }} transform={`translate(${c.x} ${c.y})`}>
                  <circle r={9} fill={colorOf.get(c.number) ?? "#fff"} stroke="#0b0b0f" strokeWidth={2} />
                  <text y={-13} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f5f5f7">
                    {codeOf.get(c.number) ?? c.number}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        )}
        {snap.weather && (
          <div className="glass flex justify-around p-4 text-center">
            <div>
              <p className="eyebrow">{tr("air")}</p>
              <p className="display text-2xl">{Math.round(snap.weather.air)}°</p>
            </div>
            <div>
              <p className="eyebrow">{tr("track")}</p>
              <p className="display text-2xl">{Math.round(snap.weather.track)}°</p>
            </div>
            <div>
              <p className="eyebrow">{tr("rain")}</p>
              <p className="display text-2xl">{snap.weather.rain ? "✓" : "—"}</p>
            </div>
          </div>
        )}
        {snap.messages.length > 0 && (
          <div className="glass p-4">
            <ul className="max-h-80 space-y-2 overflow-y-auto text-sm">
              {snap.messages.map((m, i) => (
                <li key={i} className="flex gap-3 border-b border-line pb-2">
                  <span className="num w-10 shrink-0 text-xs text-ink-3">{m.lap ? `L${m.lap}` : ""}</span>
                  <span className="text-ink-2">{translateRaceControl(m.message, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
