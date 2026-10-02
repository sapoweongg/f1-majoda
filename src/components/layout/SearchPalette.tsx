"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import useSWR from "swr";
import { Car, Flag as FlagIcon, Route, Search, UserRound, X } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn, yearSpan } from "@/lib/format";
import { hitHref, prepareIndex, searchIndex, type SearchGroups, type SearchHit } from "@/lib/search";
import type { SearchIndex } from "@/lib/search-index";
import { Flag } from "@/components/ui/primitives";

const fetcher = (url: string) => fetch(url).then((r) => r.json() as Promise<SearchIndex>);

const GROUPS = ["drivers", "teams", "circuits", "races"] as const;
const ICONS = { driver: UserRound, team: Car, circuit: Route, race: FlagIcon };

/** ¿El foco está en un campo de texto? (para no robar la tecla "/" mientras se escribe) */
function typing(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return Boolean(el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)));
}

/**
 * Buscador general del menú: pilotos, equipos, circuitos y Grandes Premios ("mónaco 1988").
 * Se abre con el botón, Ctrl/⌘+K o "/". El índice se descarga solo la primera vez que se abre.
 */
export function SearchPalette() {
  const t = useTranslations("search");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  // Guarda la ruta en la que se abrió: al navegar se cierra solo
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const { data, isLoading } = useSWR(openAt !== null ? `/api/search-index/${locale}` : null, fetcher, {
    revalidateOnFocus: false,
  });
  const prepared = useMemo(() => (data ? prepareIndex(data) : undefined), [data]);
  const groups: SearchGroups = useMemo(
    () => (prepared ? searchIndex(prepared, query) : { drivers: [], teams: [], circuits: [], races: [] }),
    [prepared, query],
  );
  const flat = GROUPS.flatMap((g) => groups[g]);

  const close = () => {
    setOpenAt(null);
    setQuery("");
    setActive(0);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenAt((at) => (at === pathname ? null : pathname));
      } else if (e.key === "/" && !typing(e.target)) {
        e.preventDefault();
        setOpenAt(pathname);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [pathname]);

  // Sin scroll de fondo mientras está abierto
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const go = (hit: SearchHit) => {
    router.push(hitHref(hit));
    close();
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && flat[active]) {
      e.preventDefault();
      go(flat[active]);
    }
  };

  const describe = (hit: SearchHit): { title: string; subtitle: string; iso?: string } => {
    switch (hit.kind) {
      case "driver":
        return {
          title: `${hit.given} ${hit.family}`,
          subtitle: [yearSpan(hit.from, hit.to), hit.titles ? t("titles", { n: hit.titles }) : hit.wins ? t("wins", { n: hit.wins }) : ""]
            .filter(Boolean)
            .join(" · "),
        };
      case "team":
        return {
          title: hit.name,
          subtitle: [yearSpan(hit.from, hit.to), hit.titles ? t("titles", { n: hit.titles }) : hit.wins ? t("wins", { n: hit.wins }) : ""]
            .filter(Boolean)
            .join(" · "),
        };
      case "circuit":
        return { title: hit.name, subtitle: `${hit.locality}, ${hit.country}`, iso: hit.iso };
      case "race":
        return { title: `${hit.name} ${hit.season}`, subtitle: `${t("round", { n: hit.round })} · ${hit.circuit}`, iso: hit.iso };
    }
  };

  // Posición de cada grupo en la lista completa (para moverse con las flechas)
  const start = GROUPS.reduce<Record<string, number>>((acc, g, k) => {
    acc[g] = k === 0 ? 0 : acc[GROUPS[k - 1]] + groups[GROUPS[k - 1]].length;
    return acc;
  }, {});

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenAt(pathname)}
        aria-label={t("button")}
        className="flex items-center gap-2 rounded-full border border-line p-2 text-sm text-ink-3 transition-colors hover:border-line-strong hover:text-ink sm:py-1.5 sm:pl-3 sm:pr-2"
      >
        <Search size={16} aria-hidden />
        <span className="hidden sm:inline">{t("button")}</span>
        <kbd className="hidden rounded-md border border-line px-1.5 py-0.5 font-sans text-[10px] text-ink-3 xl:inline">Ctrl K</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/65 px-4 pt-[9vh] backdrop-blur-sm" onMouseDown={close}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t("button")}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-2xl shadow-black/70"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search size={18} className="shrink-0 text-ink-3" aria-hidden />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
                placeholder={t("placeholder")}
                aria-label={t("placeholder")}
                autoComplete="off"
                spellCheck={false}
                className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-ink-3"
              />
              <button type="button" onClick={close} aria-label={t("close")} className="rounded-full p-1.5 text-ink-3 hover:bg-white/10 hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2" aria-live="polite">
              {!query.trim() ? (
                <p className="px-3 py-6 text-center text-sm text-ink-3">{t("hint")}</p>
              ) : isLoading || !prepared ? (
                <p className="px-3 py-6 text-center text-sm text-ink-3">{t("loading")}</p>
              ) : flat.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-ink-3">{t("empty", { query: query.trim() })}</p>
              ) : (
                GROUPS.filter((g) => groups[g].length).map((g) => (
                  <div key={g} className="mb-1">
                    <p className="eyebrow px-3 pb-1 pt-2">{t(g)}</p>
                    <ul>
                      {groups[g].map((hit, j) => {
                        const i = start[g] + j;
                        const { title, subtitle, iso } = describe(hit);
                        const Icon = ICONS[hit.kind];
                        return (
                          <li key={hitHref(hit)}>
                            <button
                              type="button"
                              onClick={() => go(hit)}
                              onMouseEnter={() => setActive(i)}
                              className={cn(
                                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                                i === active && "bg-white/8",
                              )}
                            >
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-ink-2">
                                {iso ? <Flag iso={iso} /> : <Icon size={16} aria-hidden />}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-semibold">{title}</span>
                                <span className="block truncate text-xs text-ink-3">{subtitle}</span>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))
              )}
            </div>

            <p className="hidden border-t border-line px-4 py-2 text-[11px] text-ink-3 sm:block">{t("keys")}</p>
          </div>
        </div>
      )}
    </>
  );
}
