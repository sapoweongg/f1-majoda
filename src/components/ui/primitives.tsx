import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/format";

export function GlassCard({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("glass p-5", className)}>{children}</div>;
}

export function SectionHeader({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  action?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-end justify-between gap-4", className)}>
      <div>
        {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
        <h2 className="display text-2xl sm:text-3xl">{title}</h2>
      </div>
      {action && (
        <Link href={action.href} className="shrink-0 text-sm font-medium text-ink-2 hover:text-ink">
          {action.label} →
        </Link>
      )}
    </div>
  );
}

export function PageTitle({ eyebrow, title, children }: { eyebrow?: ReactNode; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="display text-4xl sm:text-6xl">{title}</h1>
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

export function Flag({ iso, className }: { iso?: string; className?: string }) {
  if (!iso) return null;
  return <span className={cn(`fi fi-${iso} rounded-[2px]`, className)} aria-hidden />;
}

export function StatNumber({
  value,
  label,
  className,
  size = "lg",
}: {
  value: ReactNode;
  label: ReactNode;
  className?: string;
  size?: "md" | "lg" | "xl";
}) {
  const sizes = { md: "text-3xl", lg: "text-5xl", xl: "text-7xl sm:text-8xl" };
  return (
    <div className={className}>
      <div className={cn("display", sizes[size])}>{value}</div>
      <div className="eyebrow mt-1">{label}</div>
    </div>
  );
}

export function TabLinks({
  items,
  active,
}: {
  items: { key: string; label: string; href: string; disabled?: boolean }[];
  active: string;
}) {
  return (
    <div className="scroll-x -mx-4 mb-6 px-4">
      <div className="inline-flex gap-1 rounded-full border border-line bg-surface p-1">
        {items.map((it) =>
          it.disabled ? (
            <span key={it.key} className="cursor-not-allowed rounded-full px-4 py-1.5 text-sm text-ink-3/50">
              {it.label}
            </span>
          ) : (
            <Link
              key={it.key}
              href={it.href}
              scroll={false}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium text-ink-2 transition-colors hover:text-ink",
                it.key === active && "bg-white/10 text-ink",
              )}
            >
              {it.label}
            </Link>
          ),
        )}
      </div>
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="glass flex min-h-40 items-center justify-center p-8 text-center text-sm text-ink-2">
      {children}
    </div>
  );
}

export function TeamStripe({ color, className }: { color: string; className?: string }) {
  return <span className={cn("inline-block w-1 self-stretch rounded-full", className)} style={{ background: color }} />;
}

/** Enlace de vuelta al índice (p. ej. "← Todos los pilotos") encima de una ficha. */
export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="-mb-6 inline-flex items-center gap-1.5 text-sm text-ink-3 transition-colors hover:text-ink">
      <ArrowLeft size={14} aria-hidden /> {children}
    </Link>
  );
}
