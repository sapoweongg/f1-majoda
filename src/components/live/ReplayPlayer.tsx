"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Pause, Play } from "lucide-react";
import type { ReplayData } from "@/lib/live-types";
import { TimingTower, TrackStatusBadge, type TowerLabels } from "./TimingTower";

/** Repetición vuelta a vuelta de una carrera terminada, con barra de tiempo y reproducción. */
export function ReplayPlayer({ data, labels }: { data: ReplayData; labels: TowerLabels }) {
  const t = useTranslations("live");
  const [lap, setLap] = useState(1);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setLap((l) => {
        if (l >= data.totalLaps) {
          setPlaying(false);
          return l;
        }
        return l + 1;
      });
    }, 900);
    return () => clearInterval(id);
  }, [playing, data.totalLaps]);

  const frame = data.frames[lap - 1] ?? data.frames.at(-1)!;
  const messages = data.messages.filter((m) => m.lap != null && m.lap <= lap).slice(-12).reverse();
  const flagLabel = frame.trackStatus && t.has(`flags.${frame.trackStatus}`) ? t(`flags.${frame.trackStatus}`) : frame.trackStatus;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
      <div className="min-w-0 space-y-4">
        <div className="glass flex flex-wrap items-center gap-4 p-4">
          <button
            type="button"
            onClick={() => {
              if (lap >= data.totalLaps) setLap(1);
              setPlaying((p) => !p);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white"
            aria-label={playing ? t("pause") : t("play")}
          >
            {playing ? <Pause size={18} /> : <Play size={18} className="translate-x-px" />}
          </button>
          <div className="min-w-48 flex-1">
            <input
              type="range"
              min={1}
              max={data.totalLaps}
              value={lap}
              onChange={(e) => {
                setPlaying(false);
                setLap(Number(e.target.value));
              }}
              className="w-full accent-[#ff3b1f]"
              aria-label={t("lap", { n: lap })}
            />
          </div>
          <span className="display num text-2xl">
            {lap}
            <span className="text-sm text-ink-3">/{data.totalLaps}</span>
          </span>
          <TrackStatusBadge status={frame.trackStatus} label={flagLabel} />
        </div>
        <TimingTower rows={frame.rows} labels={labels} />
      </div>
      <div className="glass h-fit p-4">
        <p className="eyebrow mb-3">{t("trackStatus")}</p>
        <ul className="max-h-[36rem] space-y-2 overflow-y-auto text-sm">
          {messages.map((m, i) => (
            <li key={`${m.date}-${i}`} className="flex gap-3 border-b border-line pb-2">
              <span className="num w-10 shrink-0 text-xs text-ink-3">L{m.lap}</span>
              <span className="text-ink-2">{m.message}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
