import { countryName } from "./countries";

// Nombres de los Grandes Premios en español. Jolpica los da en inglés ("Monaco Grand Prix");
// aquí está el complemento para cada uno de los 54 nombres que ha habido desde 1950.
const ES: Record<string, string> = {
  "70th Anniversary": "del 70.º Aniversario",
  "Abu Dhabi": "de Abu Dabi",
  Argentine: "de Argentina",
  Australian: "de Australia",
  Austrian: "de Austria",
  Azerbaijan: "de Azerbaiyán",
  Bahrain: "de Baréin",
  Barcelona: "de Barcelona",
  Belgian: "de Bélgica",
  Brazilian: "de Brasil",
  British: "de Gran Bretaña",
  "Caesars Palace": "de Caesars Palace",
  Canadian: "de Canadá",
  Chinese: "de China",
  Dallas: "de Dallas",
  Detroit: "de Detroit",
  Dutch: "de los Países Bajos",
  Eifel: "de Eifel",
  "Emilia Romagna": "de Emilia-Romaña",
  European: "de Europa",
  French: "de Francia",
  German: "de Alemania",
  Hungarian: "de Hungría",
  Indian: "de la India",
  Italian: "de Italia",
  Japanese: "de Japón",
  Korean: "de Corea",
  "Las Vegas": "de Las Vegas",
  Luxembourg: "de Luxemburgo",
  Malaysian: "de Malasia",
  Mexican: "de México",
  "Mexico City": "de la Ciudad de México",
  Miami: "de Miami",
  Monaco: "de Mónaco",
  Moroccan: "de Marruecos",
  Pacific: "del Pacífico",
  Pescara: "de Pescara",
  Portuguese: "de Portugal",
  Qatar: "de Catar",
  Russian: "de Rusia",
  Sakhir: "de Sakhir",
  "San Marino": "de San Marino",
  "São Paulo": "de São Paulo",
  "Saudi Arabian": "de Arabia Saudí",
  Singapore: "de Singapur",
  "South African": "de Sudáfrica",
  Spanish: "de España",
  Styrian: "de Estiria",
  Swedish: "de Suecia",
  Swiss: "de Suiza",
  Turkish: "de Turquía",
  Tuscan: "de la Toscana",
  "United States": "de Estados Unidos",
  "United States Grand Prix West": "de Estados Unidos Oeste",
};

/**
 * Nombre del GP en el idioma de la página. `short` usa "GP" en lugar de "Gran Premio"/"Grand Prix".
 * Si un nombre no está en la tabla (un GP nuevo), se deja en inglés. Un GP trasladado a otro país
 * ("Bahrain Grand Prix in Malaysia") se traduce por partes.
 */
export function gpName(raceName: string, locale: string, short = false): string {
  const shorten = (name: string) => (short ? name.replace(/Grand Prix/, "GP") : name);
  if (locale !== "es") return shorten(raceName);
  if (raceName === "Indianapolis 500") return "500 Millas de Indianápolis";
  const prefix = short ? "GP" : "Gran Premio";
  const moved = raceName.match(/^(.+) Grand Prix in (.+)$/);
  if (moved && ES[moved[1]]) return `${prefix} ${ES[moved[1]]} en ${countryName(moved[2], "es")}`;
  const suffix = " Grand Prix";
  const place = ES[raceName] ?? (raceName.endsWith(suffix) ? ES[raceName.slice(0, -suffix.length)] : undefined);
  if (!place) return shorten(raceName);
  return `${prefix} ${place}`;
}

/** Solo el lugar ("Mónaco", "Bahrain"): para tarjetas pequeñas. */
export function gpPlace(raceName: string, locale: string): string {
  if (locale === "es") {
    const full = gpName(raceName, locale);
    return full.startsWith("Gran Premio ") ? full.slice("Gran Premio ".length).replace(/^del? /, "") : full;
  }
  return raceName.replace(/ Grand Prix/i, "");
}
