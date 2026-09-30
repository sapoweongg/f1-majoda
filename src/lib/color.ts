// Distancia perceptual entre colores (OKLab ×100) para evitar pares indistinguibles.
function toLinear(c: number) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

function oklab(hex: string) {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => toLinear(parseInt(h.slice(i, i + 2), 16)));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

export function deltaE(a: string, b: string) {
  const [l1, a1, b1] = oklab(a);
  const [l2, a2, b2] = oklab(b);
  return Math.hypot(l1 - l2, a1 - a2, b1 - b2) * 100;
}

/**
 * Colores para comparar dos pilotos. Si son casi iguales (compañeros de equipo o equipos de
 * colores parecidos) el segundo pasa a un gris claro y se marca para dibujarse discontinuo.
 */
export function distinctPair(a: string, b: string) {
  if (deltaE(a, b) >= 12) return { a, b, bDashed: false };
  const alt = deltaE(a, "#E5E5EA") >= 12 ? "#E5E5EA" : "#8E8E93";
  return { a, b: alt, bDashed: true };
}
