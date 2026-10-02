"use client";

import { useDeferredValue, useMemo, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search, Trophy, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/format";
import { EmptyState, Flag } from "@/components/ui/primitives";

/** Una fila del buscador. Los textos llegan ya formateados desde el servidor. */
export type DirectoryItem = {
  id: string;
  href: string;
  /** Parte secundaria del nombre (p. ej. el nombre de pila). */
  given?: string;
  name: string;
  /** Línea de detalle: años, temporadas, victorias… */
  meta: string;
  iso?: string;
  /** Color (equipos): se muestra como punto en lugar de la bandera. */
  color?: string;
  /** Texto extra para buscar (país traducido, ciudad…). */
  search: string;
  from: number;
  to: number;
  wins: number;
  titles: number;
  /** Cantidad propia de cada índice (carreras de un circuito). */
  count: number;
};

export type DirectoryFilter = "champions" | "winners" | "active";
export type DirectorySort = "recent" | "wins" | "titles" | "count" | "name";

const PAGE = 60;

/** Minúsculas y sin tildes: "Pérez" se encuentra escribiendo "perez". */
function norm(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

const KEY = {
  all: "filterAll",
  champions: "filterChampions",
  winners: "filterWinners",
  active: "filterActive",
  recent: "sortRecent",
  wins: "sortWins",
  titles: "sortTitles",
  count: "sortCount",
  name: "sortName",
} as const;

/**
 * Buscador de un índice (pilotos, equipos, circuitos). Mientras no hay búsqueda muestra `children`
 * (la parrilla o el calendario actual); al escribir, `children` se oculta y los resultados quedan
 * justo debajo del campo. Los textos salen del espacio de nombres `namespace` de los mensajes.
 */
export function Directory({
  items,
  current,
  namespace,
  filters,
  sorts,
  upperName,
  children,
}: {
  items: DirectoryItem[];
  current: number;
  namespace: "drivers" | "teams" | "circuits";
  filters: DirectoryFilter[];
  sorts: DirectorySort[];
  /** Apellido en mayúsculas (pilotos). */
  upperName?: boolean;
  children?: ReactNode;
}) {
  const t = useTranslations(namespace);
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<DirectoryFilter | "all">("all");
  const [sort, setSort] = useState<DirectorySort>(sorts[0]);
  const [limit, setLimit] = useState(PAGE);
  const deferred = useDeferredValue(query);

  const indexed = useMemo(
    () =>
      items.map((d) => ({
        ...d,
        given_: norm(d.given ?? ""),
        name_: norm(d.name),
        hay: norm(`${d.given ?? ""} ${d.name} ${d.search}`),
      })),
    [items],
  );

  const tokens = useMemo(() => norm(deferred).split(/\s+/).filter(Boolean), [deferred]);

  const results = useMemo(() => {
    const isYear = (tok: string) => /^\d{4}$/.test(tok);
    const list = indexed.filter((d) => {
      if (filter === "champions" && !d.titles) return false;
      if (filter === "winners" && !d.wins) return false;
      if (filter === "active" && d.to < current) return false;
      // Un año (p. ej. "1988") busca a quienes estaban en activo esa temporada
      return tokens.every((tok) => (isYear(tok) ? d.from <= +tok && +tok <= d.to : d.hay.includes(tok)));
    });
    type Row = (typeof list)[number];
    const order = (a: Row, b: Row) => {
      if (sort === "wins") return b.wins - a.wins || b.titles - a.titles || b.to - a.to;
      if (sort === "titles") return b.titles - a.titles || b.wins - a.wins || b.to - a.to;
      if (sort === "count") return b.count - a.count || b.to - a.to;
      if (sort === "name") return a.name.localeCompare(b.name, locale) || (a.given ?? "").localeCompare(b.given ?? "", locale);
      return b.to - a.to || b.wins - a.wins || b.count - a.count || a.name.localeCompare(b.name, locale);
    };
    // Con búsqueda, primero los que empiezan por lo escrito
    const first = tokens.find((tok) => !isYear(tok));
    const starts = (d: Row) => (first && (d.name_.startsWith(first) || d.given_.startsWith(first)) ? 0 : 1);
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
            <h2 className="display text-2xl sm:text-3xl">{searching ? t("results", { n: results.length }) : t("all", { n: results.length })}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(["all", ...filters] as const).map((f) => (
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
                {t(KEY[f])}
              </button>
            ))}
            <label className="chip cursor-pointer">
              <span className="sr-only">{t("sort")}</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as DirectorySort);
                  setLimit(PAGE);
                }}
                className="cursor-pointer bg-transparent text-ink outline-none"
              >
                {sorts.map((s) => (
                  <option key={s} value={s} className="bg-surface-2">
                    {t(KEY[s])}
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
                  href={d.href}
                  className="flex items-center gap-3 rounded-2xl border border-line bg-white/[0.025] px-4 py-3 transition-colors hover:border-line-strong hover:bg-white/[0.06]"
                >
                  {d.color ? (
                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: d.color }} aria-hidden />
                  ) : (
                    <Flag iso={d.iso} className="shrink-0 text-base" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 font-semibold">
                      {d.to >= current && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green" title={t("filterActive")} />}
                      <span className="truncate">
                        {d.given && `${d.given} `}
                        <span className={cn(upperName && "uppercase")}>{d.name}</span>
                      </span>
                    </span>
                    <span className="block truncate text-xs text-ink-3">{d.meta}</span>
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
