/** Temporadas con página especial: en la ficha del piloto, ese año enlaza a ella con la etiqueta "Histórico". */
export const SPECIAL_SEASONS: Partial<Record<string, Record<number, { href: string; color: string }>>> = {
  max_verstappen: {
    2021: { href: "/max-2021", color: "#ff8000" },
    2023: { href: "/max-2023", color: "#ffcc00" },
  },
  hamilton: {
    2021: { href: "/hamilton-2021", color: "#00d7b6" },
  },
};
