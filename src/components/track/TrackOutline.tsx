import { useId } from "react";
import type { TrackShape } from "@/lib/circuits";
import { cn } from "@/lib/format";

/**
 * Trazado del circuito (SVG 500×500) con efecto 3D extruido y un coche animado que lo recorre.
 * Sin JavaScript: la animación usa <animateMotion>.
 */
export function TrackOutline({
  shape,
  className,
  variant = "3d",
  color = "#ff3b1f",
  animate = true,
  duration = 9,
}: {
  shape: TrackShape;
  className?: string;
  variant?: "3d" | "flat" | "mini";
  color?: string;
  animate?: boolean;
  duration?: number;
}) {
  const id = useId().replace(/:/g, "");
  const pathId = `track-${id}`;
  const glowId = `glow-${id}`;
  const gradId = `grad-${id}`;
  const rotate = shape.rotate ? `rotate(${shape.rotate} 250 250)` : undefined;

  if (variant === "mini") {
    return (
      <svg viewBox="0 0 500 500" className={className} aria-hidden>
        <g transform={rotate}>
          <path d={shape.d} fill="none" stroke="currentColor" strokeWidth={22} strokeLinejoin="round" />
        </g>
      </svg>
    );
  }

  const layers = variant === "3d" ? [18, 14, 10, 6] : [];

  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox="-20 -20 540 540"
        className={cn("h-full w-full overflow-visible", variant === "3d" && "track-3d")}
        aria-hidden
      >
        <defs>
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={gradId} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#7a0a00" />
            <stop offset="0.5" stopColor={color} />
            <stop offset="1" stopColor="#ff9500" />
          </linearGradient>
        </defs>
        <g transform={rotate}>
          {/* Capas desplazadas hacia abajo = grosor del "bloque" */}
          {layers.map((dy, i) => (
            <path
              key={dy}
              d={shape.d}
              transform={`translate(0 ${dy})`}
              fill="none"
              stroke={i === 0 ? "#000" : "#3a0600"}
              strokeOpacity={i === 0 ? 0.7 : 0.5 + i * 0.1}
              strokeWidth={24}
              strokeLinejoin="round"
            />
          ))}
          <path id={pathId} d={shape.d} fill="none" stroke="#2a2a2e" strokeWidth={24} strokeLinejoin="round" />
          <path
            d={shape.d}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={8}
            strokeLinejoin="round"
            filter={`url(#${glowId})`}
          />
          {shape.start && <path d={shape.start} fill="#ffffff" transform="scale(1)" />}
          {animate && (
            <g>
              <circle r="11" fill="#ffffff" opacity="0.25">
                <animateMotion dur={`${duration}s`} repeatCount="indefinite" rotate="auto">
                  <mpath href={`#${pathId}`} />
                </animateMotion>
              </circle>
              <circle r="6" fill="#ffffff">
                <animateMotion dur={`${duration}s`} repeatCount="indefinite" rotate="auto">
                  <mpath href={`#${pathId}`} />
                </animateMotion>
              </circle>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
