// Nacionalidades (Jolpica) y países (circuitos) → código ISO para flag-icons.
const NATIONALITY: Record<string, string> = {
  American: "us", Argentine: "ar", "Argentinian": "ar", Australian: "au", Austrian: "at",
  Belgian: "be", Brazilian: "br", British: "gb", Canadian: "ca", Chilean: "cl", Chinese: "cn",
  Colombian: "co", Czech: "cz", Danish: "dk", Dutch: "nl", "East German": "de", Finnish: "fi",
  French: "fr", German: "de", Hungarian: "hu", Indian: "in", Indonesian: "id", Irish: "ie",
  Italian: "it", Japanese: "jp", Liechtensteiner: "li", Malaysian: "my", Mexican: "mx",
  Monegasque: "mc", "New Zealander": "nz", Polish: "pl", Portuguese: "pt", Rhodesian: "zw",
  Russian: "ru", "South African": "za", Spanish: "es", Swedish: "se", Swiss: "ch", Thai: "th",
  Uruguayan: "uy", Venezuelan: "ve", Emirati: "ae", Moroccan: "ma", Estonian: "ee",
  Israeli: "il", Korean: "kr", Norwegian: "no", Hong: "hk",
};

const COUNTRY: Record<string, string> = {
  Australia: "au", Austria: "at", Azerbaijan: "az", Bahrain: "bh", Belgium: "be", Brazil: "br",
  Canada: "ca", China: "cn", France: "fr", Germany: "de", Hungary: "hu", India: "in", Italy: "it",
  Japan: "jp", Korea: "kr", Malaysia: "my", Mexico: "mx", Monaco: "mc", Morocco: "ma",
  Netherlands: "nl", Portugal: "pt", Qatar: "qa", Russia: "ru", "Saudi Arabia": "sa",
  Singapore: "sg", "South Africa": "za", Spain: "es", Sweden: "se", Switzerland: "ch",
  Turkey: "tr", UAE: "ae", "United Arab Emirates": "ae", UK: "gb", "United Kingdom": "gb",
  USA: "us", "United States": "us", Argentina: "ar", Vietnam: "vn",
};

export function nationalityToIso(nationality?: string) {
  return nationality ? NATIONALITY[nationality] : undefined;
}

export function countryToIso(country?: string) {
  return country ? COUNTRY[country] : undefined;
}

/** Nombre del país en el idioma de la página ("UK" → "Reino Unido"); si no se conoce, el original. */
export function countryName(country: string, locale: string) {
  const iso = countryToIso(country);
  return (iso && new Intl.DisplayNames([locale], { type: "region" }).of(iso.toUpperCase())) || country;
}
