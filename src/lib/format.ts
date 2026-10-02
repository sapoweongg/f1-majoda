import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 83.456 → "1:23.456" */
export function lapTime(seconds: number | null | undefined) {
  if (seconds == null || !Number.isFinite(seconds)) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds - m * 60;
  return m > 0 ? `${m}:${s.toFixed(3).padStart(6, "0")}` : s.toFixed(3);
}

/** "1:23.456" → 83.456 */
export function parseLapTime(text: string | undefined): number | null {
  if (!text) return null;
  const parts = text.split(":").map(Number);
  if (parts.some((p) => Number.isNaN(p))) return null;
  return parts.reduce((acc, p) => acc * 60 + p, 0);
}

export function gap(value: number | string | null | undefined) {
  if (value == null) return "—";
  if (typeof value === "string") return value;
  return `+${value.toFixed(3)}`;
}

export function signed(n: number, digits = 0) {
  const s = n.toFixed(digits);
  return n > 0 ? `+${s}` : s;
}

export function points(n: number | string) {
  const v = Number(n);
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

export function driverName(d: { givenName: string; familyName: string }) {
  return `${d.givenName} ${d.familyName}`;
}

export function age(dateOfBirth?: string, at = new Date()) {
  if (!dateOfBirth) return undefined;
  const b = new Date(dateOfBirth);
  let a = at.getFullYear() - b.getFullYear();
  const m = at.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && at.getDate() < b.getDate())) a--;
  return a;
}

export function clampSeason(value: string | undefined, fallback: number, max: number) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1950 || n > max) return fallback;
  return n;
}

/** 2015, 2026 → "2015–2026"; un solo año → "2015" */
export function yearSpan(from: number, to: number) {
  return from === to ? String(from) : `${from}–${to}`;
}
