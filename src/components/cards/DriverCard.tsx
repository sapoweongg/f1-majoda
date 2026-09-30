import { Link } from "@/i18n/navigation";
import { DriverHero, TeamLogo, type PhotoProp } from "@/components/ui/media";
import { Flag } from "@/components/ui/primitives";
import { cn } from "@/lib/format";

export type DriverCardData = {
  driverId: string;
  givenName: string;
  familyName: string;
  number?: string;
  teamName: string;
  color: string;
  accent: string;
  logo: string | null;
  points: string;
  position: string;
  iso?: string;
  photo?: PhotoProp;
};

/** Tarjeta de piloto estilo Box Box: foto que sobresale, número gigante y color del equipo. */
export function DriverCard({
  d,
  ptsLabel,
  size = "md",
  priority,
}: {
  d: DriverCardData;
  ptsLabel: string;
  size?: "md" | "lg";
  priority?: boolean;
}) {
  const tall = size === "lg";
  const height = tall ? "h-64 sm:h-72" : "h-52";
  return (
    <Link href={`/drivers/${d.driverId}`} className="group relative block pt-10">
      {/* Fondo de la tarjeta */}
      <div
        className={cn(
          "relative overflow-hidden rounded-[1.75rem] border border-white/10 transition-transform duration-300 group-hover:-translate-y-1",
          height,
        )}
        style={{
          background: `radial-gradient(120% 100% at 100% 100%, ${d.color} 0%, ${d.color}99 30%, #111114 75%)`,
        }}
      >
        <span
          className="display pointer-events-none absolute -bottom-6 right-2 select-none text-white/10"
          style={{ fontSize: tall ? 200 : 160 }}
          aria-hidden
        >
          {d.number}
        </span>
        {d.photo && !d.photo.cutout && (
          <DriverHero photo={d.photo} name={`${d.givenName} ${d.familyName}`} className="absolute inset-y-0 right-0 w-1/2" />
        )}
      </div>

      {/* Foto recortada que sobresale por arriba */}
      {d.photo?.cutout && (
        <DriverHero
          photo={d.photo}
          name={`${d.givenName} ${d.familyName}`}
          priority={priority}
          className={cn(
            "absolute bottom-0 right-0 z-20 w-auto max-w-[62%] transition-transform duration-300 group-hover:-translate-y-2",
            tall ? "h-[19rem] sm:h-[21rem]" : "h-[15.5rem]",
          )}
        />
      )}

      {/* Texto por encima de la foto */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-col justify-between p-5 transition-transform duration-300 [text-shadow:0_2px_14px_rgb(0_0_0/0.65)] group-hover:-translate-y-1",
          height,
        )}
      >
        <div className="flex items-center gap-2">
          <span className="display text-3xl">{d.position}</span>
          <Flag iso={d.iso} className="text-sm" />
          <TeamLogo src={d.logo} name={d.teamName} className="h-5 w-auto max-w-16 opacity-90" />
        </div>
        <div>
          <p className="text-sm text-white/80">{d.givenName}</p>
          <p className={cn("display uppercase", tall ? "text-4xl" : "text-3xl")}>{d.familyName}</p>
          <p className="mt-0.5 max-w-[50%] truncate text-xs text-white/70">{d.teamName}</p>
          <p className="mt-3">
            <span className={cn("display", tall ? "text-5xl" : "text-4xl")}>{d.points}</span>{" "}
            <span className="text-xs uppercase tracking-widest text-white/70">{ptsLabel}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
