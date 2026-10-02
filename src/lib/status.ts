// Estado final de un piloto en una carrera ("Retired", "+2 Laps", "Engine"…) en el idioma de la página.
// Cubre los estados más frecuentes de Jolpica; los raros se dejan como vienen.
const ES: Record<string, string> = {
  Finished: "Terminó",
  Retired: "Abandono",
  Lapped: "Doblado",
  Accident: "Accidente",
  Collision: "Colisión",
  "Collision damage": "Daños por colisión",
  "Spun off": "Trompo",
  Engine: "Motor",
  "Power Unit": "Unidad de potencia",
  "Power loss": "Pérdida de potencia",
  Gearbox: "Caja de cambios",
  Transmission: "Transmisión",
  Clutch: "Embrague",
  Suspension: "Suspensión",
  Electrical: "Fallo eléctrico",
  Electronics: "Electrónica",
  Brakes: "Frenos",
  Withdrew: "Retirado",
  "Not classified": "No clasificado",
  Disqualified: "Descalificado",
  Excluded: "Excluido",
  "Did not start": "No tomó la salida",
  "Did not qualify": "No se clasificó",
  "Did not prequalify": "No precalificó",
  "Fuel system": "Sistema de combustible",
  "Fuel pump": "Bomba de combustible",
  "Fuel pressure": "Presión de combustible",
  "Fuel leak": "Fuga de combustible",
  "Out of fuel": "Sin combustible",
  Turbo: "Turbo",
  Hydraulics: "Hidráulica",
  Overheating: "Sobrecalentamiento",
  Ignition: "Encendido",
  "Oil leak": "Fuga de aceite",
  "Oil pressure": "Presión de aceite",
  "Water leak": "Fuga de agua",
  "Water pressure": "Presión de agua",
  Throttle: "Acelerador",
  Halfshaft: "Palier",
  Driveshaft: "Palier",
  Wheel: "Rueda",
  "Wheel nut": "Tuerca de rueda",
  "Wheel bearing": "Rodamiento de rueda",
  Differential: "Diferencial",
  Tyre: "Neumático",
  Puncture: "Pinchazo",
  Handling: "Manejo",
  Steering: "Dirección",
  Radiator: "Radiador",
  Exhaust: "Escape",
  Chassis: "Chasis",
  Mechanical: "Avería mecánica",
  Battery: "Batería",
  Physical: "Problema físico",
  Injury: "Lesión",
  "Driver unwell": "Piloto indispuesto",
  "Broken wing": "Alerón roto",
  "Rear wing": "Alerón trasero",
  "Front wing": "Alerón delantero",
  Vibrations: "Vibraciones",
  "Heat shield fire": "Incendio",
  Fire: "Incendio",
  Damage: "Daños",
  Debris: "Restos en pista",
};

/**
 * Texto para la columna de tiempo cuando no hay tiempo. Los doblados se muestran como "+2 vueltas",
 * calculado con las vueltas del ganador si Jolpica solo dice "Lapped".
 */
export function statusLabel(status: string | undefined, locale: string, laps?: number, winnerLaps?: number): string {
  if (!status) return "—";
  const lapsDown = /^\+(\d+) Laps?$/.exec(status)?.[1];
  const down = lapsDown ? Number(lapsDown) : status === "Lapped" && laps && winnerLaps && winnerLaps > laps ? winnerLaps - laps : 0;
  if (down) {
    if (locale === "es") return down === 1 ? "+1 vuelta" : `+${down} vueltas`;
    return down === 1 ? "+1 lap" : `+${down} laps`;
  }
  return locale === "es" ? (ES[status] ?? status) : status;
}
