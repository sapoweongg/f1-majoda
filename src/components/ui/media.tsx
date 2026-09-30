"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/format";

export type PhotoProp = { src: string; cutout: boolean; credit?: string; creditUrl?: string } | undefined;

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.at(-1)?.[0] ?? "")).toUpperCase();
}

/** Foto redonda del piloto sobre el color de su equipo; iniciales si no hay foto. */
export function DriverAvatar({
  photo,
  name,
  color,
  size = 40,
  className,
}: {
  photo?: PhotoProp;
  name: string;
  color: string;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const show = photo && !failed;
  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full", className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 50% 120%, ${color} 0%, ${color}55 45%, #1c1c1e 100%)`,
      }}
      title={photo?.credit ? `${name} — ${photo.credit}` : name}
    >
      {show ? (
        <Image
          src={photo.src}
          alt={name}
          width={size * 2}
          height={size * 2}
          onError={() => setFailed(true)}
          className={cn(
            "h-full w-full",
            photo.cutout ? "translate-y-[8%] scale-[1.35] object-cover object-top" : "object-cover object-[50%_25%]",
          )}
        />
      ) : (
        <span className="display text-white/90" style={{ fontSize: size * 0.38 }}>
          {initials(name)}
        </span>
      )}
    </span>
  );
}

/** Foto grande para tarjetas: recorte que sobresale o foto con fundido lateral. */
export function DriverHero({
  photo,
  name,
  className,
  priority,
  linkCredit,
}: {
  photo?: PhotoProp;
  name: string;
  className?: string;
  priority?: boolean;
  /** Enlazar el crédito a Commons (solo si la foto no está dentro de otro enlace). */
  linkCredit?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (!photo || failed) return null;
  if (photo.cutout) {
    return (
      <Image
        src={photo.src}
        alt={name}
        width={440}
        height={440}
        priority={priority}
        onError={() => setFailed(true)}
        className={cn("pointer-events-none select-none object-contain object-bottom drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]", className)}
      />
    );
  }
  return (
    <figure className={cn("pointer-events-none select-none", className)}>
      <Image
        src={photo.src}
        alt={name}
        width={400}
        height={500}
        priority={priority}
        onError={() => setFailed(true)}
        className="h-full w-full object-cover object-[50%_20%] [mask-image:linear-gradient(to_left,black_55%,transparent)]"
      />
      {photo.credit && (
        <figcaption className="pointer-events-auto absolute bottom-1 right-2 max-w-[90%] truncate text-[9px] text-white/50">
          {linkCredit && photo.creditUrl ? (
            <a href={photo.creditUrl} target="_blank" rel="noreferrer">
              {photo.credit}
            </a>
          ) : (
            <span title={photo.creditUrl}>{photo.credit}</span>
          )}
        </figcaption>
      )}
    </figure>
  );
}

/** Coche oficial del equipo o, si no existe, silueta SVG con los colores de la librea. */
export function TeamCar({
  src,
  color,
  accent,
  name,
  className,
  priority,
}: {
  src: string | null;
  color: string;
  accent: string;
  name: string;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    return (
      <Image
        src={src}
        alt={name}
        width={900}
        height={280}
        priority={priority}
        onError={() => setFailed(true)}
        className={cn("pointer-events-none select-none object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.55)]", className)}
      />
    );
  }
  return <CarSilhouette color={color} accent={accent} className={className} label={name} />;
}

export function CarSilhouette({
  color,
  accent,
  className,
  label,
}: {
  color: string;
  accent: string;
  className?: string;
  label?: string;
}) {
  return (
    <svg viewBox="0 0 400 110" className={className} role="img" aria-label={label}>
      {/* sombra */}
      <ellipse cx="200" cy="98" rx="185" ry="6" fill="black" opacity="0.45" />
      {/* alerón trasero */}
      <path d="M10 22 h34 v10 h-34 z" fill={accent} />
      <path d="M14 32 h6 v34 h-6 z" fill="#222" />
      {/* carrocería */}
      <path
        d="M22 70 C22 58 40 52 70 50 L120 40 C150 34 170 34 186 40 L200 46 C230 48 280 54 330 62 L382 70 C388 72 388 78 380 80 L60 82 C36 82 22 78 22 70 Z"
        fill={color}
      />
      {/* franja */}
      <path d="M90 58 L200 50 C250 54 300 60 360 70 L360 74 C300 66 250 60 200 56 L90 64 Z" fill={accent} opacity="0.9" />
      {/* halo y cockpit */}
      <path d="M170 42 C176 28 196 26 212 34 L214 40 C200 34 184 34 176 44 Z" fill="#1a1a1a" />
      <circle cx="186" cy="40" r="6" fill="#ffd60a" opacity="0.9" />
      {/* alerón delantero */}
      <path d="M340 80 h52 v6 h-52 z" fill={accent} />
      {/* ruedas */}
      <circle cx="80" cy="74" r="22" fill="#0d0d0d" />
      <circle cx="80" cy="74" r="9" fill="#2e2e2e" />
      <circle cx="312" cy="76" r="19" fill="#0d0d0d" />
      <circle cx="312" cy="76" r="8" fill="#2e2e2e" />
    </svg>
  );
}

export function TeamLogo({ src, name, className }: { src: string | null; name: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;
  return (
    <Image
      src={src}
      alt={name}
      width={96}
      height={96}
      onError={() => setFailed(true)}
      className={cn("object-contain", className)}
    />
  );
}
