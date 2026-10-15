// Formato de los valores de las gráficas, compartido por la leyenda/tabla y el dibujo de Recharts.

export type ChartFormat = "int" | "laptime";

function formatLap(v: number) {
  const m = Math.floor(v / 60);
  const sec = (v - m * 60).toFixed(1).padStart(4, "0");
  return m ? `${m}:${sec}` : sec;
}

export function chartValueFormat(format: ChartFormat): (v: number) => string {
  return format === "laptime" ? formatLap : (v) => String(Math.round(v * 10) / 10);
}
