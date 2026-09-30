import { ImageResponse } from "next/og";

export const alt = "F1 Majoda";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagen para compartir en redes: degradado "final de carrera" y el nombre del sitio.
export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const subtitle =
    locale === "en"
      ? "Results · Standings · Telemetry · Live timing"
      : "Resultados · Campeonatos · Telemetría · En vivo";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 80,
          color: "white",
          background:
            "radial-gradient(120% 90% at 85% 110%, rgba(255,149,0,0.85) 0%, rgba(122,10,0,0.9) 35%, #060608 70%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 150, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>
          F1&nbsp;<span style={{ color: "#ff3b1f" }}>Majoda</span>
        </div>
        <div style={{ display: "flex", fontSize: 40, marginTop: 24, color: "rgba(255,255,255,0.8)" }}>{subtitle}</div>
      </div>
    ),
    size,
  );
}
