"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Radio } from "lucide-react";
import { cn } from "@/lib/format";

// Solo suena una radio a la vez: al empezar una, las demás se pausan.
const STOP_OTHERS = "max2023:radio-play";

function fmt(s: number) {
  if (!Number.isFinite(s)) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

export function RadioCard({
  title,
  clips,
  tag,
  labels,
}: {
  title: string;
  clips: string[];
  tag?: string;
  labels: { play: string; pause: string };
}) {
  return (
    <div className="glass relative overflow-hidden p-5">
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-30 blur-2xl"
        style={{ background: "radial-gradient(circle, #ffcc00, transparent 70%)" }}
        aria-hidden
      />
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1e3a8a]/60 text-[#ffcc00]">
          <Radio size={18} aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="font-semibold leading-snug">{title}</p>
          {tag && <span className="chip mt-1 !py-0 !text-[10px]">{tag}</span>}
        </div>
      </div>
      <div className="space-y-2">
        {clips.map((src, i) => (
          <Clip key={src} src={src} index={clips.length > 1 ? i + 1 : undefined} labels={labels} />
        ))}
      </div>
    </div>
  );
}

function Clip({ src, index, labels }: { src: string; index?: number; labels: { play: string; pause: string } }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const stop = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== src) audio.current?.pause();
    };
    window.addEventListener(STOP_OTHERS, stop);
    return () => window.removeEventListener(STOP_OTHERS, stop);
  }, [src]);

  function toggle() {
    const el = audio.current;
    if (!el) return;
    if (el.paused) {
      window.dispatchEvent(new CustomEvent(STOP_OTHERS, { detail: src }));
      void el.play();
    } else {
      el.pause();
    }
  }

  const progress = duration ? (time / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 rounded-xl bg-black/25 p-2 pr-3">
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? labels.pause : labels.play}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffcc00] text-[#0b1530] transition-transform hover:scale-105"
      >
        {playing ? <Pause size={18} /> : <Play size={18} className="translate-x-px" />}
      </button>
      {index && <span className="num text-xs text-ink-3">{index}</span>}
      {/* ecualizador decorativo */}
      <div className="flex h-6 items-end gap-[3px]" aria-hidden>
        {[0, 1, 2, 3, 4].map((b) => (
          <span
            key={b}
            className={cn("w-[3px] rounded-full bg-[#ffcc00]/80", playing ? "eq-bar" : "h-1.5")}
            style={playing ? { animationDelay: `${b * 0.12}s` } : undefined}
          />
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <input
          type="range"
          min={0}
          max={duration || 1}
          step={0.1}
          value={time}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (audio.current) audio.current.currentTime = v;
            setTime(v);
          }}
          className="h-1 w-full accent-[#ffcc00]"
          style={{ background: `linear-gradient(to right, #ffcc00 ${progress}%, rgba(255,255,255,0.15) ${progress}%)` }}
          aria-label={labels.play}
        />
      </div>
      <span className="num w-20 text-right text-xs text-ink-3">
        {fmt(time)} / {fmt(duration)}
      </span>
      <audio
        ref={audio}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setTime(0);
        }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
    </div>
  );
}
