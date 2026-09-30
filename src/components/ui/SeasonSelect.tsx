"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

/**
 * Selector de temporada. Por defecto cambia el parámetro ?season= de la URL;
 * con `basePath` navega a `${basePath}/${season}`.
 */
export function SeasonSelect({
  value,
  min = 1950,
  max,
  basePath,
  param = "season",
  resetParams = [],
}: {
  value: number;
  min?: number;
  max: number;
  basePath?: string;
  param?: string;
  /** Parámetros a borrar al cambiar de temporada (p. ej. pilotos elegidos). */
  resetParams?: string[];
}) {
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const years = Array.from({ length: max - min + 1 }, (_, i) => max - i);

  return (
    <label className="flex items-center gap-2 text-sm text-ink-2">
      <span className="eyebrow">{t("season")}</span>
      <select
        value={value}
        onChange={(e) => {
          const season = e.target.value;
          if (basePath) {
            router.push(`${basePath}/${season}`);
            return;
          }
          const q = new URLSearchParams(search.toString());
          q.set(param, season);
          for (const p of resetParams) q.delete(p);
          router.push(`${pathname}?${q.toString()}`);
        }}
        className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-semibold text-ink outline-none focus:border-line-strong"
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ParamSelect({
  param,
  value,
  options,
  label,
  resetParams = [],
}: {
  param: string;
  value: string;
  options: { value: string; label: string }[];
  label: string;
  resetParams?: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  return (
    <label className="flex min-w-0 items-center gap-2 text-sm text-ink-2">
      <span className="eyebrow shrink-0">{label}</span>
      <select
        value={value}
        onChange={(e) => {
          const q = new URLSearchParams(search.toString());
          q.set(param, e.target.value);
          for (const p of resetParams) q.delete(p);
          router.push(`${pathname}?${q.toString()}`);
        }}
        className="min-w-0 max-w-full rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-semibold text-ink outline-none focus:border-line-strong"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
