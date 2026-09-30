import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSun, Snowflake, Sun } from "lucide-react";
import { weatherKind, type DailyForecast } from "@/lib/api/weather";

const ICONS = { sun: Sun, partly: CloudSun, cloud: Cloud, fog: CloudFog, rain: CloudRain, storm: CloudLightning, snow: Snowflake };

export function WeatherIcon({ code, size = 18, className }: { code: number; size?: number; className?: string }) {
  const Icon = ICONS[weatherKind(code)];
  return <Icon size={size} className={className} aria-hidden />;
}

export function ForecastChip({ f, label, rainLabel }: { f: DailyForecast; label: string; rainLabel: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-line bg-black/30 px-3 py-2 backdrop-blur">
      <WeatherIcon code={f.code} size={22} className="text-yellow" />
      <div className="leading-tight">
        <p className="text-[10px] uppercase tracking-wider text-ink-3">{label}</p>
        <p className="num text-sm font-semibold">
          {Math.round(f.tMax)}° <span className="font-normal text-ink-3">/ {Math.round(f.tMin)}°</span>
        </p>
        <p className="text-[11px] text-ink-2">{rainLabel}</p>
      </div>
    </div>
  );
}
