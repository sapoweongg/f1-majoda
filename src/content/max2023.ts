// Textos de la página especial "Max Verstappen 2023" (es / en).
// Los valores de la temporada se calculan con datos de Jolpica; aquí van los récords anteriores
// y los momentos, que son hechos históricos fijos.

export type RecordId = "wins" | "streak" | "winRate" | "points" | "podiums" | "lapsLed" | "margin" | "teamWins";

type Copy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  champion: string;
  intro: string;
  stats: { wins: string; points: string; podiums: string; winRate: string; poles: string; fastestLaps: string };
  recordsTitle: string;
  recordsIntro: string;
  recordBadge: string;
  previous: string;
  records: Record<RecordId, { label: string; previous: string }>;
  streakTitle: string;
  streakText: (n: number) => string;
  seasonTitle: string;
  seasonIntro: string;
  started: (grid: number) => string;
  pitLane: string;
  sprintWin: string;
  chartTitle: string;
  chartNote: string;
  momentsTitle: string;
  moments: Partial<Record<string, string>>;
  radiosTitle: string;
  radiosIntro: string;
  radios: Partial<Record<string, string>>;
  sprint: string;
  play: string;
  pause: string;
  photoCaption: string;
  galleryTitle: string;
  gallery: { parade: string; museum: string; battle: string; profile: string };
  creditsTitle: string;
  credits: string[];
  back: string;
};

export const MAX_2023: Record<"es" | "en", Copy> = {
  es: {
    eyebrow: "Mención de honor · Temporada 2023",
    title: "El año perfecto",
    subtitle: "La temporada más dominante en la historia de la Fórmula 1",
    champion: "Tricampeón del mundo",
    intro:
      "En 2023, Max Verstappen y el Red Bull RB19 convirtieron cada fin de semana en una demostración. Ganó casi todo lo que se podía ganar, rompió récords que llevaban décadas en pie y aseguró su tercer título con seis carreras por delante. Esta página es un homenaje a ese año.",
    stats: {
      wins: "Victorias",
      points: "Puntos",
      podiums: "Podios",
      winRate: "De victorias",
      poles: "Salidas desde la pole",
      fastestLaps: "Vueltas rápidas",
    },
    recordsTitle: "Récords que reescribió",
    recordsIntro: "Cada tarjeta compara la marca de 2023 con el récord que existía antes de esa temporada.",
    recordBadge: "Récord",
    previous: "Antes",
    records: {
      wins: { label: "Victorias en una temporada", previous: "15 · Max Verstappen, 2022" },
      streak: { label: "Victorias consecutivas", previous: "9 · Sebastian Vettel, 2013" },
      winRate: { label: "Porcentaje de victorias", previous: "75% · Alberto Ascari, 1952" },
      points: { label: "Puntos en una temporada", previous: "454 · Max Verstappen, 2022" },
      podiums: { label: "Podios en una temporada", previous: "18 · Max Verstappen, 2021" },
      lapsLed: { label: "Vueltas lideradas en una temporada", previous: "739 · Sebastian Vettel, 2011" },
      margin: { label: "Ventaja sobre el subcampeón", previous: "155 puntos · Sebastian Vettel, 2013" },
      teamWins: { label: "Victorias de Red Bull (de 22)", previous: "93,8% · McLaren, 1988 (15 de 16)" },
    },
    streakTitle: "La racha",
    streakText: (n) =>
      `De Miami a Monza: ${n} victorias seguidas, más que nadie en la historia de la Fórmula 1.`,
    seasonTitle: "Carrera a carrera",
    seasonIntro: "Los 22 Grandes Premios de 2023. Toca cualquiera para ver la carrera completa.",
    started: (grid) => `Salió ${grid}.º`,
    pitLane: "Salió del pit lane",
    sprintWin: "Ganó el sprint",
    chartTitle: "Un dominio que se ve",
    chartNote: "Puntos acumulados de los cuatro primeros del campeonato, ronda a ronda.",
    momentsTitle: "Momentos que quedaron para la historia",
    moments: {
      bahrain: "Empieza el año como lo terminará: pole y victoria en Bahréin.",
      jeddah: "Una avería en clasificación lo manda al 15.º puesto. Remonta hasta el 2.º.",
      miami: "Sale 9.º y gana. Una remontada que avisaba de lo que venía.",
      villeneuve: "41.ª victoria de su carrera, las mismas que Ayrton Senna, y victoria número 100 de Red Bull.",
      spa: "Una penalización lo deja 6.º en parrilla. Gana con más de 20 segundos de ventaja.",
      zandvoort: "Gana en casa bajo la lluvia e iguala las 9 victorias seguidas de Vettel.",
      monza: "10 victorias consecutivas. Nadie lo había hecho nunca.",
      marina_bay: "5.º en Singapur: la única carrera del año sin podio y el final de la racha.",
      suzuka: "Victoria aplastante y título de constructores para Red Bull.",
      losail: "Sábado 7 de octubre: se proclama tricampeón del mundo en el sprint de Qatar.",
      americas: "Victoria número 50 de su carrera.",
      rodriguez: "16.ª victoria del año: supera su propio récord de 2022.",
      vegas: "Gana la primera carrera de Las Vegas y lo celebra cantando «Viva Las Vegas» por radio.",
      yas_marina: "Cierra la temporada con su 19.ª victoria y 1.003 vueltas en cabeza.",
    },
    radiosTitle: "Radios para el recuerdo",
    radiosIntro:
      "Radios oficiales del equipo grabadas justo después de cruzar la meta en algunas de las carreras más importantes del año.",
    radios: {
      miami: "Miami · tras ganar desde el 9.º puesto",
      zandvoort: "Zandvoort · tras ganar en casa",
      monza: "Monza · tras la 10.ª victoria seguida",
      losail: "Qatar · al convertirse en tricampeón",
      americas: "Austin · tras su victoria número 50",
      rodriguez: "México · tras la 16.ª victoria del año",
      vegas: "Las Vegas · tras ganar la primera carrera nocturna",
      yas_marina: "Abu Dabi · tras cerrar la temporada",
    },
    sprint: "Sprint",
    play: "Reproducir",
    pause: "Pausa",
    photoCaption: "Red Bull RB19 · GP de Austria 2023",
    galleryTitle: "Galería",
    gallery: {
      parade: "Max saluda al público en el desfile de pilotos · GP de Austria 2023",
      museum: "El RB19 campeón, expuesto en el Petersen Automotive Museum",
      battle: "En pista · GP de Austria 2023",
      profile: "El número 1 tras la carrera · GP de Austria 2023",
    },
    creditsTitle: "Créditos",
    credits: [
      "Estadísticas de la temporada calculadas con datos de Jolpica-F1. Los récords anteriores y las 1.003 vueltas lideradas provienen del registro histórico de la Fórmula 1.",
      "Radios: grabaciones oficiales de Formula 1 Live Timing, obtenidas a través de OpenF1. © Formula 1.",
      "Fotos de Austria 2023: Lukas Raich (CC BY-SA 4.0). RB19 en el museo: TaurusEmerald (CC BY-SA 4.0). Wikimedia Commons.",
      "Retratos oficiales de Max Verstappen: © Formula 1.",
    ],
    back: "Volver a Max Verstappen",
  },
  en: {
    eyebrow: "Honourable mention · 2023 season",
    title: "The perfect year",
    subtitle: "The most dominant season in Formula 1 history",
    champion: "Three-time world champion",
    intro:
      "In 2023, Max Verstappen and the Red Bull RB19 turned every weekend into a demonstration. He won almost everything there was to win, broke records that had stood for decades and sealed his third title with six races to spare. This page is a tribute to that year.",
    stats: {
      wins: "Wins",
      points: "Points",
      podiums: "Podiums",
      winRate: "Win rate",
      poles: "Starts from pole",
      fastestLaps: "Fastest laps",
    },
    recordsTitle: "Records he rewrote",
    recordsIntro: "Each card compares the 2023 mark with the record that stood before that season.",
    recordBadge: "Record",
    previous: "Before",
    records: {
      wins: { label: "Wins in a season", previous: "15 · Max Verstappen, 2022" },
      streak: { label: "Consecutive wins", previous: "9 · Sebastian Vettel, 2013" },
      winRate: { label: "Win percentage", previous: "75% · Alberto Ascari, 1952" },
      points: { label: "Points in a season", previous: "454 · Max Verstappen, 2022" },
      podiums: { label: "Podiums in a season", previous: "18 · Max Verstappen, 2021" },
      lapsLed: { label: "Laps led in a season", previous: "739 · Sebastian Vettel, 2011" },
      margin: { label: "Margin over the runner-up", previous: "155 points · Sebastian Vettel, 2013" },
      teamWins: { label: "Red Bull wins (out of 22)", previous: "93.8% · McLaren, 1988 (15 of 16)" },
    },
    streakTitle: "The streak",
    streakText: (n) => `From Miami to Monza: ${n} wins in a row, more than anyone in Formula 1 history.`,
    seasonTitle: "Race by race",
    seasonIntro: "All 22 Grands Prix of 2023. Tap any of them to see the full race.",
    started: (grid) => `Started P${grid}`,
    pitLane: "Started from the pit lane",
    sprintWin: "Won the sprint",
    chartTitle: "Dominance you can see",
    chartNote: "Cumulative points of the top four in the championship, round by round.",
    momentsTitle: "Moments for the history books",
    moments: {
      bahrain: "He starts the year the way he will finish it: pole and victory in Bahrain.",
      jeddah: "A failure in qualifying drops him to 15th. He climbs back to 2nd.",
      miami: "From 9th on the grid to victory. A comeback that hinted at what was coming.",
      villeneuve: "41st career win, level with Ayrton Senna, and Red Bull's 100th victory.",
      spa: "A penalty leaves him 6th on the grid. He wins by more than 20 seconds.",
      zandvoort: "He wins at home in the rain and matches Vettel's 9 wins in a row.",
      monza: "10 consecutive wins. Nobody had ever done it.",
      marina_bay: "5th in Singapore: the only race of the year off the podium, and the end of the streak.",
      suzuka: "A crushing win and the constructors' title for Red Bull.",
      losail: "Saturday 7 October: he is crowned three-time world champion in the Qatar sprint.",
      americas: "The 50th win of his career.",
      rodriguez: "16th win of the year, beating his own 2022 record.",
      vegas: "He wins the first Las Vegas race and celebrates by singing \"Viva Las Vegas\" on the radio.",
      yas_marina: "He closes the season with his 19th win and 1,003 laps in the lead.",
    },
    radiosTitle: "Radios to remember",
    radiosIntro: "Official team radio recorded right after crossing the line at some of the biggest races of the year.",
    radios: {
      miami: "Miami · after winning from 9th",
      zandvoort: "Zandvoort · after winning at home",
      monza: "Monza · after the 10th win in a row",
      losail: "Qatar · becoming a three-time champion",
      americas: "Austin · after his 50th win",
      rodriguez: "Mexico · after the 16th win of the year",
      vegas: "Las Vegas · after winning the first night race",
      yas_marina: "Abu Dhabi · closing the season",
    },
    sprint: "Sprint",
    play: "Play",
    pause: "Pause",
    photoCaption: "Red Bull RB19 · 2023 Austrian GP",
    galleryTitle: "Gallery",
    gallery: {
      parade: "Max waves to the crowd at the drivers parade · 2023 Austrian GP",
      museum: "The championship-winning RB19 on display at the Petersen Automotive Museum",
      battle: "On track · 2023 Austrian GP",
      profile: "The number 1 after the race · 2023 Austrian GP",
    },
    creditsTitle: "Credits",
    credits: [
      "Season statistics computed from Jolpica-F1 data. Previous records and the 1,003 laps led come from Formula 1's historical record.",
      "Radio: official Formula 1 Live Timing recordings, obtained through OpenF1. © Formula 1.",
      "2023 Austria photos: Lukas Raich (CC BY-SA 4.0). RB19 at the museum: TaurusEmerald (CC BY-SA 4.0). Wikimedia Commons.",
      "Official portraits of Max Verstappen: © Formula 1.",
    ],
    back: "Back to Max Verstappen",
  },
};

/** Vueltas lideradas en 2023 (no se puede calcular sin descargar las 22 carreras vuelta a vuelta). */
export const LAPS_LED_2023 = 1003;

export const PHOTOS = {
  hero: "File:FIA F1 Austria 2023 Nr. 1 (1).jpg",
  sparks: "File:FIA F1 Austria 2023 Nr. 1 (3).jpg",
  profile: "File:FIA F1 Austria 2023 Nr. 1 (Post-Race).jpg",
  parade: "File:FIA F1 Austria 2023 Max Verstappen.jpg",
  museum: "File:Max Verstappen Red Bull RB19 Petersen Automotive Museum.jpg",
  battle: "File:FIA F1 Austria 2023 Race (2).jpg",
};
