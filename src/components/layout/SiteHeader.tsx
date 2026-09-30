"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/format";

const ITEMS = [
  { href: "/", key: "home" },
  { href: "/live", key: "live" },
  { href: "/standings", key: "standings" },
  { href: "/races", key: "races" },
  { href: "/compare", key: "compare" },
  { href: "/telemetry", key: "telemetry" },
  { href: "/calendar", key: "calendar" },
  { href: "/history", key: "history" },
  { href: "/ratings", key: "ratings" },
] as const;

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

export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="ml-4 hidden flex-1 items-center gap-1 lg:flex" aria-label="Principal">
          {ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative rounded-full px-3 py-1.5 text-sm font-medium text-ink-2 transition-colors hover:text-ink",
                isActive(item.href) && "bg-white/8 text-ink",
              )}
            >
              {item.key === "live" && (
                <span className="live-dot mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
              )}
              {t(item.key)}
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
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line px-4 pb-4 pt-2 lg:hidden" aria-label="Principal">
          <ul className="grid grid-cols-2 gap-1">
            {ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-xl px-3 py-2.5 text-sm font-medium text-ink-2",
                    isActive(item.href) && "bg-white/8 text-ink",
                  )}
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
