"use client";

import { useDeferredValue, useMemo, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search, Trophy, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { DriverIndexEntry } from "@/lib/drivers";
import { cn } from "@/lib/format";
import { EmptyState, Flag } from "@/components/ui/primitives";

/** Piloto del índice con el país ya traducido en el servidor (evita diferencias al hidratar). */
export type DirectoryEntry = DriverIndexEntry & { iso?: string; country: string };

const FILTERS = ["all", "champions", "winners", "active"] as const;
const SORTS = ["recent", "wins", "titles", "name"] as const;
type Filter = (typeof FILTERS)[number];
type Sort = (typeof SORTS)[number];

const PAGE = 60;

/** Minúsculas y sin tildes: "Pérez" se encuentra escribiendo "perez". */
function norm(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

const label = {
  all: "filterAll",
  champions: "filterChampions",
  winners: "filterWinners",
  active: "filterActive",
  recent: "sortRecent",
  wins: "sortWins",
  titles: "sortTitles",
  name: "sortName",
} as const;

/**
 * Buscador de todos los pilotos desde 1950. Mientras no hay búsqueda muestra `children` (la parrilla
 * actual); al escribir, la parrilla se oculta y los resultados quedan justo debajo del campo.
 */
export function DriverDirectory({
  drivers,
  current,
  children,
}: {
  drivers: DirectoryEntry[];
  current: number;
  children: ReactNode;
}) {
  const t = useTranslations("drivers");
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("recent");
  const [limit, setLimit] = useState(PAGE);
  const deferred = useDeferredValue(query);

  const indexed = useMemo(
    () =>
      drivers.map((d) => ({
        ...d,
        given_: norm(d.given),
        family_: norm(d.family),
        hay: norm(`${d.given} ${d.family} ${d.country} ${d.nationality}`),
      })),
    [drivers],
  );

  const tokens = useMemo(() => norm(deferred).split(/\s+/).filter(Boolean), [deferred]);

  const results = useMemo(() => {
    const words = tokens.filter((tok) => !/^\d{4}$/.test(tok));
    const list = indexed.filter((d) => {
      if (filter === "champions" && !d.titles) return false;
      if (filter === "winners" && !d.wins) return false;
      if (filter === "active" && d.to < current) return false;
      // Un año (p. ej. "1988") busca a los pilotos que corrían esa temporada
      return tokens.every((tok) => (/^\d{4}$/.test(tok) ? d.from <= +tok && +tok <= d.to : d.hay.includes(tok)));
    });
    const order = (a: (typeof list)[number], b: (typeof list)[number]) => {
      if (sort === "wins") return b.wins - a.wins || b.titles - a.titles || b.to - a.to;
      if (sort === "titles") return b.titles - a.titles || b.wins - a.wins || b.to - a.to;
      if (sort === "name") return a.family.localeCompare(b.family, locale) || a.given.localeCompare(b.given, locale);
      return b.to - a.to || b.wins - a.wins || a.family.localeCompare(b.family, locale);
    };
    // Con búsqueda, primero los que empiezan por lo escrito (apellido o nombre)
    const first = words[0];
    const starts = (d: (typeof list)[number]) => (first && (d.family_.startsWith(first) || d.given_.startsWith(first)) ? 0 : 1);
    return list.sort((a, b) => starts(a) - starts(b) || order(a, b));
  }, [indexed, tokens, filter, sort, current, locale]);

  const searching = tokens.length > 0;
  const update = (value: string) => {
    setQuery(value);
    setLimit(PAGE);
  };

  return (
    <div className="space-y-12">
      <div className="relative">
        <Search size={20} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-ink-3" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => update(e.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label={t("search")}
          autoComplete="off"
          spellCheck={false}
          className="w-full rounded-2xl border border-line-strong bg-surface-2/80 py-4 pl-14 pr-12 text-base outline-none transition-colors placeholder:text-ink-3 focus:border-accent/60 focus:ring-2 focus:ring-accent/25 sm:text-lg [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => update("")}
            aria-label={t("clear")}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink-3 hover:bg-white/10 hover:text-ink"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {!searching && children}

      <section aria-live="polite">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow mb-1">{searching ? t("resultsFor", { query: deferred.trim() }) : t("since1950")}</p>
            <h2 className="display text-2xl sm:text-3xl">{searching ? t("results", { n: results.length }) : t("allDrivers", { n: results.length })}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => {
                  setFilter(f);
                  setLimit(PAGE);
                }}
                className={cn("chip cursor-pointer transition-colors hover:text-ink", filter === f && "!border-white/25 !bg-white/15 !text-ink")}
              >
                {t(label[f])}
              </button>
            ))}
            <label className="chip cursor-pointer">
              <span className="sr-only">{t("sort")}</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as Sort);
                  setLimit(PAGE);
                }}
                className="cursor-pointer bg-transparent text-ink outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s} value={s} className="bg-surface-2">
                    {t(label[s])}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {results.length ? (
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {results.slice(0, limit).map((d) => (
              <li key={d.id}>
                <Link
                  href={`/drivers/${d.id}`}
                  className="flex items-center gap-3 rounded-2xl border border-line bg-white/[0.025] px-4 py-3 transition-colors hover:border-line-strong hover:bg-white/[0.06]"
                >
                  <Flag iso={d.iso} className="shrink-0 text-base" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 truncate font-semibold">
                      {d.to >= current && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green" title={t("active")} />}
                      <span className="truncate">
                        {d.given} <span className="uppercase">{d.family}</span>
                      </span>
                    </span>
                    <span className="block truncate text-xs text-ink-3">
                      {d.from === d.to ? d.from : `${d.from}–${d.to}`} · {t("seasons", { n: d.seasons })}
                      {d.wins > 0 && ` · ${t("wins", { n: d.wins })}`}
                    </span>
                  </span>
                  {d.titles > 0 && (
                    <span className="chip shrink-0 !text-yellow" title={t("titles", { n: d.titles })}>
                      <Trophy size={12} aria-hidden /> {d.titles}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState>{t("noResults")}</EmptyState>
        )}

        {results.length > limit && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setLimit((l) => l + PAGE)}
              className="rounded-full border border-line-strong px-5 py-2 text-sm font-semibold text-ink-2 transition-colors hover:bg-white/5 hover:text-ink"
            >
              {t("showMore", { n: results.length - limit })}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
