import "server-only";
import { cachedJson } from "./fetcher";

// Open-Meteo: pronóstico gratuito sin API key (hasta 16 días).
export type DailyForecast = {
  date: string;
  code: number;
  tMax: number;
  tMin: number;
  rainProb: number;
  wind: number;
};

type OpenMeteo = {
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
  };
};

export async function getForecast(lat: number, lng: number): Promise<DailyForecast[]> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(3)}&longitude=${lng.toFixed(3)}` +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max" +
    "&timezone=auto&forecast_days=16";
  try {
    const data = await cachedJson<OpenMeteo>(url, { revalidate: 3 * 3600, tags: ["weather"] });
    const d = data.daily;
    return d.time.map((date, i) => ({
      date,
      code: d.weather_code[i],
      tMax: d.temperature_2m_max[i],
      tMin: d.temperature_2m_min[i],
      rainProb: d.precipitation_probability_max[i] ?? 0,
      wind: d.wind_speed_10m_max[i],
    }));
  } catch {
    return [];
  }
}

/** Códigos WMO agrupados en los iconos que mostramos. */
export function weatherKind(code: number): "sun" | "partly" | "cloud" | "fog" | "rain" | "storm" | "snow" {
  if (code === 0) return "sun";
  if (code <= 2) return "partly";
  if (code === 3) return "cloud";
  if (code <= 48) return "fog";
  if (code <= 67 || (code >= 80 && code <= 82)) return "rain";
  if (code <= 77 || code === 85 || code === 86) return "snow";
  return "storm";
}
