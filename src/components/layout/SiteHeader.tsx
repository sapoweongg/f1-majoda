"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import useSWR from "swr";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/format";

type Item = { href: string; key: string; match?: string[] };

// "Carreras" agrupa resultados y calendario; "Análisis", comparativa y telemetría.
const PRIMARY: Item[] = [
  { href: "/live", key: "live" },
  { href: "/standings", key: "standings" },
  { href: "/races", key: "races", match: ["/races", "/calendar"] },
  { href: "/drivers", key: "drivers" },
  { href: "/teams", key: "teams" },
  { href: "/circuits", key: "circuits" },
];
const ANALYSIS: Item[] = [
  { href: "/compare", key: "compare" },
  { href: "/telemetry", key: "telemetry" },
];
const SECONDARY: Item[] = [{ href: "/history", key: "history" }];
const RATINGS: Item = { href: "/ratings", key: "ratings" };

function Logo() {
  return (
    <span className="flex items-center gap-2">
      <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden>
        <defs>
          <linearGradient id="logo-g" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#7a0a00" />
            <stop offset="0.55" stopColor="#ff3b1f" />
            <stop offset="1" stopColor="#ff9500" />
          </linearGradient>
        </defs>
        <path
          d="M12 46 L22 18 H30 L33 32 L42 18 H52 L42 46 H34 L39 32 L30 46 H26 L24 32 L19 46 Z"
          fill="url(#logo-g)"
        />
      </svg>
      <span className="display text-xl tracking-tight">
        F1 <span className="text-accent">Majoda</span>
      </span>
    </span>
  );
}

const fetcher = (url: string) => fetch(url).then((r) => r.json() as Promise<{ live: boolean; session: string | null }>);

export function SiteHeader({ ratingsEnabled }: { ratingsEnabled: boolean }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();
  // Los menús guardan la ruta en la que se abrieron: al navegar se cierran solos
  const [mobileAt, setMobileAt] = useState<string | null>(null);
  const [analysisAt, setAnalysisAt] = useState<string | null>(null);
  const mobileOpen = mobileAt === pathname;
  const analysisOpen = analysisAt === pathname;
  const analysisRef = useRef<HTMLDivElement>(null);

  // El punto rojo de "En vivo" solo se enciende si hay una sesión en pista
  const { data: status } = useSWR("/api/live-status", fetcher, { refreshInterval: 120_000 });
  const live = Boolean(status?.live);

  useEffect(() => {
    if (!analysisOpen) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !analysisRef.current?.contains(e.target as Node)) {
        setAnalysisAt(null);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [analysisOpen]);

  const isActive = (item: Item) =>
    item.href === "/" ? pathname === "/" : (item.match ?? [item.href]).some((m) => pathname.startsWith(m));
  const analysisActive = ANALYSIS.some(isActive);
  const secondary = ratingsEnabled ? [...SECONDARY, RATINGS] : SECONDARY;

  const linkClass = (active: boolean) =>
    cn(
      "relative flex items-center rounded-full px-3 py-1.5 text-sm font-medium text-ink-2 transition-colors hover:text-ink",
      active && "bg-white/8 text-ink",
    );

  const label = (item: Item) => (
    <>
      {item.key === "live" && live && (
        <span className="live-dot mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" aria-hidden />
      )}
      {t(item.key)}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="shrink-0" aria-label={t("home")}>
          <Logo />
        </Link>

        <nav className="ml-2 hidden flex-1 items-center gap-0.5 lg:flex" aria-label={t("menu")}>
          {PRIMARY.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(isActive(item))} title={item.key === "live" && status?.session ? status.session : undefined}>
              {label(item)}
            </Link>
          ))}
          <div ref={analysisRef} className="relative">
            <button
              type="button"
              aria-expanded={analysisOpen}
              aria-haspopup="true"
              onClick={() => setAnalysisAt(analysisOpen ? null : pathname)}
              className={cn(linkClass(analysisActive), "gap-1")}
            >
              {t("analysis")}
              <ChevronDown size={14} className={cn("transition-transform", analysisOpen && "rotate-180")} aria-hidden />
            </button>
            {analysisOpen && (
              <div className="glass absolute left-0 top-full mt-2 w-60 p-1.5 shadow-2xl shadow-black/60">
                {ANALYSIS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block rounded-xl px-3 py-2.5 transition-colors hover:bg-white/8",
                      isActive(item) && "bg-white/8",
                    )}
                  >
                    <span className="block text-sm font-semibold">{t(item.key)}</span>
                    <span className="block text-xs text-ink-3">{t(`${item.key}Hint`)}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          {secondary.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(isActive(item))}>
              {label(item)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex rounded-full border border-line p-0.5 text-xs font-semibold" aria-label={t("language")}>
            {routing.locales.map((l) => (
              <Link
                key={l}
                href={pathname}
                locale={l}
                className={cn(
                  "rounded-full px-2.5 py-1 uppercase text-ink-3 transition-colors hover:text-ink",
                  l === locale && "bg-white/10 text-ink",
                )}
              >
                {l}
              </Link>
            ))}
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-ink-2 hover:bg-white/5 lg:hidden"
            aria-label={t("menu")}
            aria-expanded={mobileOpen}
            onClick={() => setMobileAt(mobileOpen ? null : pathname)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-line px-4 pb-4 pt-2 lg:hidden" aria-label={t("menu")}>
          <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3">
            {[{ href: "/", key: "home" }, ...PRIMARY, ...ANALYSIS, ...secondary].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileAt(null)}
                  className={cn(
                    "block rounded-xl px-3 py-2.5 text-sm font-medium text-ink-2",
                    isActive(item) && "bg-white/8 text-ink",
                  )}
                >
                  {label(item)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
