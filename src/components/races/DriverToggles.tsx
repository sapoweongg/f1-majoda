import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/format";

/** Chips para elegir qué pilotos aparecen en un gráfico (estado en la URL: ?d=ver,nor). */
export function DriverToggles({
  drivers,
  selected,
  hrefFor,
}: {
  drivers: { id: string; label: string; color: string }[];
  selected: string[];
  hrefFor: (ids: string[]) => string;
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-1.5">
      {drivers.map((d) => {
        const on = selected.includes(d.id);
        const next = on ? selected.filter((x) => x !== d.id) : [...selected, d.id];
        return (
          <Link
            key={d.id}
            href={hrefFor(next.length ? next : selected)}
            scroll={false}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors",
              on ? "border-line-strong bg-white/10 text-ink" : "border-line text-ink-3 hover:text-ink-2",
            )}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: on ? d.color : "#3a3a3e" }} aria-hidden />
            {d.label}
          </Link>
        );
      })}
    </div>
  );
}
