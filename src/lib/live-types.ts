// Tipos compartidos entre el servidor (/api/live, repetición) y los componentes del timing.
export type TowerRow = {
  number: number;
  code: string;
  name: string;
  color: string;
  position: number;
  gap: string | null;
  interval: string | null;
  lastLap: number | null;
  compound: string | null;
  tyreAge: number | null;
  stops: number;
  out?: boolean;
  headshot?: string | null;
};

export type ControlMessage = {
  date: string;
  lap: number | null;
  message: string;
  flag: string | null;
  category: string;
};

export type SessionInfo = {
  key: number;
  name: string;
  type: string;
  circuit: string;
  country: string;
  countryCode: string;
  start: string;
  end: string;
};

export type LiveSnapshot = {
  mode: "live" | "idle" | "disabled";
  session: SessionInfo | null;
  lap: number | null;
  rows: TowerRow[];
  messages: ControlMessage[];
  trackStatus: string | null;
  weather: { air: number; track: number; rain: boolean } | null;
  cars: { number: number; x: number; y: number }[];
  outline: string | null;
  updatedAt: string;
};

export type ReplayFrame = { lap: number; rows: TowerRow[]; trackStatus: string | null };

export type ReplayData = {
  session: SessionInfo;
  totalLaps: number;
  frames: ReplayFrame[];
  messages: ControlMessage[];
};

/** Una sesión cuenta como "en vivo" desde 10 minutos antes de empezar hasta 15 después de acabar. */
export function isSessionLive(start: string, end: string, now: number) {
  return new Date(start).getTime() - 10 * 60 * 1000 < now && now < new Date(end).getTime() + 15 * 60 * 1000;
}
