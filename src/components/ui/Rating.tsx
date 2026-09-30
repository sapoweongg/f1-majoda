"use client";

import { useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import useSWR from "swr";
import { Star } from "lucide-react";
import { cn } from "@/lib/format";

export type Summary = { votes: number; average: number; distribution: number[] };

export function Stars({ value, size = 16, className }: { value: number; size?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${value.toFixed(1)} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - (i - 1)));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="absolute inset-0 text-white/15" fill="currentColor" strokeWidth={0} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star size={size} className="text-yellow" fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

const EMPTY: Summary = { votes: 0, average: 0, distribution: [0, 0, 0, 0, 0] };

const noop = () => () => {};

function storageKey(season: number, round: number) {
  return `f1majoda:rated:${season}-${round}`;
}

export function RatingWidget({
  season,
  round,
  open,
}: {
  season: number;
  round: number;
  /** false si la carrera todavía no terminó */
  open: boolean;
}) {
  const t = useTranslations("ratings");
  const { data, mutate, error } = useSWR<{ summary: Summary | null }>(
    `/api/ratings?season=${season}&round=${round}`,
    (url: string) => fetch(url).then((r) => r.json()),
    { revalidateOnFocus: false },
  );
  const summary = data?.summary ?? EMPTY;
  const enabled = data ? data.summary !== null : !error;
  const [justVoted, setVoted] = useState(false);
  // Recordamos en este navegador que ya votó (el servidor además rechaza votos repetidos)
  const storedVote = useSyncExternalStore(
    noop,
    () => {
      try {
        return Boolean(localStorage.getItem(storageKey(season, round)));
      } catch {
        return false;
      }
    },
    () => false,
  );
  const voted = justVoted || storedVote;
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);


  function remember() {
    setVoted(true);
    try {
      localStorage.setItem(storageKey(season, round), "1");
    } catch {}
  }

  async function vote(rating: number) {
    if (busy || voted || !open) return;
    setBusy(true);
    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ season, round, rating }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        await mutate({ summary: json.summary }, { revalidate: false });
        remember();
        setMessage(t("thanks"));
      } else if (json.error === "duplicate") {
        remember();
        setMessage(t("already"));
      } else if (json.error === "not-finished") setMessage(t("notFinished"));
      else if (res.status === 429) setMessage(t("tooMany"));
      else setMessage(t("unavailable"));
    } catch {
      setMessage(t("unavailable"));
    } finally {
      setBusy(false);
    }
  }

  if (!enabled) return <p className="text-sm text-ink-3">{t("unavailable")}</p>;

  const max = Math.max(1, ...summary.distribution);

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <span className="display text-6xl">{summary.votes ? summary.average.toFixed(1) : "—"}</span>
        <div className="pb-1.5">
          <Stars value={summary.average} size={18} />
          <p className="mt-1 text-xs text-ink-3">{t("votes", { n: summary.votes })}</p>
        </div>
      </div>

      <ul className="space-y-1" aria-label={t("votes", { n: summary.votes })}>
        {[5, 4, 3, 2, 1].map((s) => (
          <li key={s} className="flex items-center gap-2 text-xs text-ink-3">
            <span className="num w-3 text-right">{s}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/8">
              <span
                className="block h-full rounded-full bg-yellow"
                style={{ width: `${(summary.distribution[s - 1] / max) * 100}%` }}
              />
            </span>
            <span className="num w-6 text-right">{summary.distribution[s - 1]}</span>
          </li>
        ))}
      </ul>

      {open && !voted ? (
        <div>
          <p className="mb-2 text-sm text-ink-2">{t("rate")}</p>
          <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                disabled={busy}
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onClick={() => vote(i)}
                aria-label={t("stars", { n: i })}
                className="rounded-md p-1 transition-transform hover:scale-110 disabled:opacity-50"
              >
                <Star
                  size={28}
                  strokeWidth={1.5}
                  className={i <= hover ? "text-yellow" : "text-white/25"}
                  fill={i <= hover ? "currentColor" : "none"}
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {!open && <p className="text-sm text-ink-3">{t("notFinished")}</p>}
      {message && <p className="text-sm text-ink-2">{message}</p>}
    </div>
  );
}
