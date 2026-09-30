import { Link } from "@/i18n/navigation";
import { DriverAvatar, TeamLogo, type PhotoProp } from "@/components/ui/media";
import { Flag } from "@/components/ui/primitives";
import { points as fmtPoints } from "@/lib/format";

export type StandingRow = {
  id: string;
  href: string;
  position: string;
  name: string;
  sub: string;
  color: string;
  points: number;
  wins: number;
  iso?: string;
  photo?: PhotoProp;
  logo?: string | null;
  kind: "driver" | "constructor";
};

/** Tabla de clasificación con barra de puntos del color del equipo (longitud proporcional al líder). */
export function StandingsTable({
  rows,
  labels,
}: {
  rows: StandingRow[];
  labels: { pos: string; name: string; points: string; wins: string; gap: string };
}) {
  const leader = rows[0]?.points || 1;
  return (
    <div className="glass overflow-hidden p-0">
      <div className="scroll-x">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-12 text-center">{labels.pos}</th>
              <th>{labels.name}</th>
              <th className="hidden w-[34%] md:table-cell" aria-hidden />
              <th className="text-right">{labels.wins}</th>
              <th className="text-right">{labels.gap}</th>
              <th className="text-right">{labels.points}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id}>
                <td className="display text-center text-lg">{r.position}</td>
                <td>
                  <Link href={r.href} className="flex items-center gap-3">
                    {r.kind === "driver" ? (
                      <DriverAvatar photo={r.photo} name={r.name} color={r.color} size={36} />
                    ) : (
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                        style={{ background: `${r.color}33`, boxShadow: `inset 0 0 0 1px ${r.color}66` }}
                      >
                        {r.logo ? (
                          <TeamLogo src={r.logo} name={r.name} className="h-5 w-5" />
                        ) : (
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color }} />
                        )}
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 font-semibold">
                        {r.name}
                        <Flag iso={r.iso} className="text-[11px]" />
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-ink-3">
                        <span className="h-2 w-2 rounded-full" style={{ background: r.color }} aria-hidden />
                        {r.sub}
                      </span>
                    </span>
                  </Link>
                </td>
                <td className="hidden md:table-cell">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.max(1.5, (r.points / leader) * 100)}%`, background: r.color }}
                    />
                  </div>
                </td>
                <td className="num text-right text-ink-2">{r.wins}</td>
                <td className="num text-right text-ink-3">{i === 0 ? "—" : `-${fmtPoints(leader - r.points)}`}</td>
                <td className="display num text-right text-lg">{fmtPoints(r.points)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
