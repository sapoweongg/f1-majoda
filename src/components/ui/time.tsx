"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/format";

const noop = () => () => {};
/** true solo en el navegador tras hidratar: evita desajustes de zona horaria con el servidor. */
function useHydrated() {
  return useSyncExternalStore(noop, () => true, () => false);
}

/** Fecha/hora en la zona horaria del visitante. */
export function LocalTime({
  iso,
  options,
  className,
}: {
  iso: string;
  options: Intl.DateTimeFormatOptions;
  className?: string;
}) {
  const locale = useLocale();
  const hydrated = useHydrated();
  const fmt = new Intl.DateTimeFormat(locale, { ...options, timeZone: hydrated ? undefined : "UTC" });
  return (
    <time dateTime={iso} className={className} suppressHydrationWarning>
      {fmt.format(new Date(iso))}
      {!hydrated && options.hour ? " UTC" : ""}
    </time>
  );
}

export function TimeZoneName({ className }: { className?: string }) {
  const hydrated = useHydrated();
  if (!hydrated) return null;
  return <span className={className}>{Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, " ")}</span>;
}

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

export function Countdown({ target, className, compact }: { target: string; className?: string; compact?: boolean }) {
  const t = useTranslations("countdown");
  const hydrated = useHydrated();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = new Date(target).getTime() - now;
  if (hydrated && diff <= 0) {
    return <span className={cn("display text-3xl text-accent", className)}>{t("started")}</span>;
  }
  const p = parts(diff);
  const cells: [number, string][] = [
    [p.d, t("days")],
    [p.h, t("hours")],
    [p.m, t("minutes")],
    [p.s, t("seconds")],
  ];
  return (
    <div className={cn("flex gap-2 sm:gap-3", className)} role="timer" suppressHydrationWarning>
      {cells.map(([v, label]) => (
        <div
          key={label}
          className={cn(
            "flex flex-col items-center rounded-2xl border border-line bg-black/35 backdrop-blur",
            compact ? "min-w-12 px-2 py-1.5" : "min-w-16 px-3 py-2.5 sm:min-w-20",
          )}
        >
          <span className={cn("display num", compact ? "text-2xl" : "text-4xl sm:text-5xl")} suppressHydrationWarning>
            {hydrated ? String(v).padStart(2, "0") : "--"}
          </span>
          <span className="eyebrow mt-0.5 !text-[10px]">{label}</span>
        </div>
      ))}
    </div>
  );
}
