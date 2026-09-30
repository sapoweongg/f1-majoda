import { Link } from "@/i18n/navigation";
import { DriverAvatar, TeamCar, TeamLogo, type PhotoProp } from "@/components/ui/media";
import { cn } from "@/lib/format";

export type TeamCardData = {
  constructorId: string;
  name: string;
  color: string;
  accent: string;
  car: string | null;
  logo: string | null;
  points: string;
  position: string;
  drivers: { name: string; photo?: PhotoProp }[];
};

/** Tarjeta de equipo con el coche saliéndose por el borde. */
export function TeamCard({ t, ptsLabel, priority }: { t: TeamCardData; ptsLabel: string; priority?: boolean }) {
  return (
    <Link href={`/teams/${t.constructorId}`} className="group relative block">
      <div
        className="relative h-44 overflow-hidden rounded-[1.75rem] border border-white/10 transition-transform duration-300 group-hover:-translate-y-1"
        style={{ background: `linear-gradient(120deg, #111114 20%, ${t.color}cc 100%)` }}
      >
        <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: t.color }} aria-hidden />
        <div className="relative z-10 flex h-full flex-col justify-between p-5 pl-6">
          <div className="flex items-center gap-3">
            <span className="display text-3xl">{t.position}</span>
            <TeamLogo src={t.logo} name={t.name} className="h-6 w-auto max-w-20" />
          </div>
          <div>
            <p className="display max-w-[55%] text-2xl leading-tight">{t.name}</p>
            <div className="mt-2 flex items-center gap-3">
              <p>
                <span className="display text-4xl">{t.points}</span>{" "}
                <span className="text-xs uppercase tracking-widest text-white/60">{ptsLabel}</span>
              </p>
              <div className="flex -space-x-2">
                {t.drivers.map((d) => (
                  <DriverAvatar key={d.name} photo={d.photo} name={d.name} color={t.color} size={30} className="ring-2 ring-black/60" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <TeamCar
        src={t.car}
        color={t.color}
        accent={t.accent}
        name={t.name}
        priority={priority}
        className={cn(
          "pointer-events-none absolute -right-4 top-2 z-20 w-[62%] transition-transform duration-500 group-hover:translate-x-2",
        )}
      />
    </Link>
  );
}
