// Textos de la página especial "Max Verstappen 2021" (es / en), contada desde su lado.
// Las cifras de la temporada se calculan con datos de Jolpica (src/lib/duel2021.ts); aquí van los
// textos de cada momento, que son hechos históricos fijos. Las claves numéricas son rondas.

type Card = { title: string; text: string };

type Copy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  champion: string;
  intro: string;
  stats: { wins: string; points: string; podiums: string; poles: string; fastestLaps: string; leadRounds: string };
  scaleTitle: string;
  scaleIntro: (changes: number) => string;
  scale: { aAhead: string; bAhead: string; tie: string; table: string; round: string; gp: string; gap: string };
  duelCaption: string;
  seasonTitle: string;
  seasonIntro: string;
  started: (grid: number) => string;
  pitLane: string;
  retired: string;
  leader: string;
  tie: string;
  sprintWin: string;
  setbacksTitle: string;
  setbacksIntro: string;
  setbacks: Partial<Record<number, Card>>;
  momentsTitle: string;
  moments: Partial<Record<number, string>>;
  finalEyebrow: string;
  finalTitle: string;
  finalText: string[];
  finalStandings: string;
  legacyTitle: string;
  legacy: Card[];
  quote: string;
  bannerCaption: string;
  heroAlt: string;
  galleryTitle: string;
  gallery: Record<"wave" | "austin" | "side" | "silverstone", string>;
  creditsTitle: string;
  credits: string[];
  back: string;
};

export const MAX_2021: Record<"es" | "en", Copy> = {
  es: {
    eyebrow: "Mención de honor · Temporada 2021",
    title: "El primer título",
    subtitle: "El año en que Max Verstappen, con 24 años, derribó a la dinastía más larga de la Fórmula 1",
    champion: "Campeón del mundo",
    intro:
      "En 2021, Max Verstappen se enfrentó a Lewis Hamilton y a Mercedes, que habían ganado todos los títulos desde 2014, en el duelo más intenso que había visto la F1 en décadas. Ganó diez carreras, subió 18 veces al podio, un récord, y llegó a la última carrera empatado a puntos con el heptacampeón. En la última vuelta lo adelantó y se convirtió en el primer neerlandés campeón del mundo. Esta página cuenta ese año desde su lado.",
    stats: {
      wins: "Victorias",
      points: "Puntos",
      podiums: "Podios",
      poles: "Salidas desde la pole",
      fastestLaps: "Vueltas rápidas",
      leadRounds: "Carreras como líder del Mundial",
    },
    scaleTitle: "La balanza",
    scaleIntro: (changes) =>
      `Puntos de ventaja de Max sobre Hamilton después de cada carrera: hacia arriba manda Max; hacia abajo, Hamilton. El liderato cambió de manos ${changes} veces y los dos llegaron empatados a la última carrera.`,
    scale: {
      aAhead: "Max por delante",
      bAhead: "Hamilton por delante",
      tie: "Empate",
      table: "Ver como tabla",
      round: "Ronda",
      gp: "Gran Premio",
      gap: "Diferencia",
    },
    duelCaption: "Max por delante de Hamilton en Austin, camino de una de sus diez victorias · GP de Estados Unidos 2021",
    seasonTitle: "Carrera a carrera",
    seasonIntro:
      "Los 22 Grandes Premios de 2021, con el resultado de Max y el de Hamilton. La corona marca las carreras tras las que Max lideraba el Mundial. Toca cualquiera para ver la carrera completa.",
    started: (grid) => `Salió ${grid}.º`,
    pitLane: "Salió del pit lane",
    retired: "ABD",
    leader: "Líder del Mundial",
    tie: "Empate a puntos",
    sprintWin: "Ganó el sprint",
    setbacksTitle: "Golpes que no lo frenaron",
    setbacksIntro: "Un campeonato también se gana en los peores días. Estos fueron los de Max en 2021, y así respondió.",
    setbacks: {
      6: {
        title: "Bakú",
        text: "Lideraba con autoridad cuando, a cinco vueltas del final, el neumático trasero izquierdo reventó en plena recta. Se bajó del coche, le dio una patada a la rueda y pasó página: dos semanas después ganó en Francia.",
      },
      10: {
        title: "Silverstone",
        text: "Ganó la primera carrera al sprint de la historia, pero en la primera vuelta del domingo un toque con Hamilton lo mandó contra las barreras de Copse con un impacto de 51 G. Los comisarios penalizaron a Hamilton, que ganó la carrera mientras Max pasaba revisiones en el hospital.",
      },
      11: {
        title: "Hungría",
        text: "En la primera curva, con la pista mojada, Valtteri Bottas provocó una carambola que golpeó a los dos Red Bull. Con el coche dañado, Max rescató dos puntos.",
      },
      14: {
        title: "Monza",
        text: "En la primera chicane tocó a Hamilton y su Red Bull acabó encima del Mercedes: los dos fuera, y el halo protegió a Lewis. Los comisarios culparon a Max y le impusieron tres puestos de penalización para la carrera siguiente.",
      },
      15: {
        title: "Sochi",
        text: "Un motor nuevo y la penalización por el choque de Monza lo mandaron al fondo de la parrilla. Remontó con paciencia y, cuando llegó la lluvia, acertó al entrar a boxes: terminó segundo.",
      },
      20: {
        title: "Catar",
        text: "Una sanción de cinco puestos por no levantar el pie ante unas banderas amarillas lo dejó 7.º en la parrilla. Remontó hasta el segundo puesto y se llevó también la vuelta rápida.",
      },
    },
    momentsTitle: "Momentos de un año inolvidable",
    moments: {
      1: "Pole en la primera carrera y un adelantamiento a Hamilton que tuvo que devolver por salirse de los límites de pista. Segundo, a menos de un segundo: esta vez había pelea.",
      2: "Sale 3.º y en la primera curva, con la pista mojada, se mete por dentro de Hamilton. Lidera y gana en Imola.",
      5: "Su primera victoria en Mónaco y, por primera vez en su carrera, líder del Mundial.",
      7: "Red Bull se la juega con dos paradas y Max caza a Hamilton en la penúltima vuelta para ganar en Francia.",
      9: "El fin de semana perfecto en el Red Bull Ring: pole, victoria, vuelta rápida y todas las vueltas en cabeza. Tercera victoria seguida.",
      12: "Un diluvio impide correr: la carrera solo se disputa detrás del coche de seguridad. Su vuelta de pole del sábado, en pista mojada, le da la victoria.",
      13: "La F1 vuelve a Países Bajos 36 años después y Max gana en casa desde la pole, ante una marea naranja, para recuperar el liderato.",
      17: "Pole y victoria en Austin, aguantando la presión de Hamilton hasta la última vuelta.",
      18: "En la salida pasa por fuera a los dos Mercedes en la primera curva y gana con autoridad en México.",
      21: "Una carrera caótica, con dos banderas rojas. Los dos llegan a la última cita empatados a puntos, algo que no pasaba desde 1974.",
    },
    finalEyebrow: "Abu Dabi · 12 de diciembre de 2021",
    finalTitle: "Vuelta 58",
    finalText: [
      "Max salió desde la pole, pero Hamilton lo superó en la salida y controló la carrera durante más de 50 vueltas. Red Bull lo intentó todo, y Sergio Pérez retuvo a Hamilton un par de vueltas en una defensa memorable, pero a falta de cinco vueltas la diferencia superaba los diez segundos.",
      "Entonces Nicholas Latifi se estrelló y salió el coche de seguridad. Red Bull llamó a Max a boxes para montar neumáticos blandos nuevos; Hamilton se quedó en pista con unos duros muy gastados. Tras una decisión de la dirección de carrera que todavía se discute, la carrera se reanudó para una sola vuelta, con los dos uno detrás del otro.",
      "En la curva 5 Max se lanzó por dentro, aguantó el contraataque de Hamilton en las rectas siguientes y cruzó la meta primero. Era campeón del mundo.",
    ],
    finalStandings: "Clasificación final",
    legacyTitle: "Lo que significó",
    legacy: [
      { title: "Primer neerlandés", text: "Ningún piloto de Países Bajos había sido nunca campeón del mundo de F1." },
      { title: "Fin de una era", text: "Mercedes había ganado los siete títulos de pilotos anteriores, de 2014 a 2020." },
      {
        title: "Red Bull y Honda",
        text: "El primer título de pilotos de Red Bull desde 2013 y de un motor Honda desde Ayrton Senna en 1991, en la temporada de despedida oficial de Honda.",
      },
      { title: "El primero de cuatro", text: "Abrió una racha de cuatro títulos seguidos, de 2021 a 2024." },
    ],
    quote: "Siempre al ataque, hasta la última curva de la última vuelta.",
    bannerCaption: "Red Bull RB16B · GP de Estados Unidos 2021",
    heroAlt: "Bengalas naranjas de la afición neerlandesa y el Red Bull de Max en el Red Bull Ring",
    galleryTitle: "Galería",
    gallery: {
      wave: "Max saluda tras la clasificación, junto a Sergio Pérez · GP de Austria 2021",
      austin: "El número 33 en Austin · GP de Estados Unidos 2021",
      side: "A fondo en el Red Bull Ring · GP de Austria 2021",
      silverstone: "En la parrilla de Silverstone · GP de Gran Bretaña 2021",
    },
    creditsTitle: "Créditos",
    credits: [
      "Estadísticas calculadas con datos de Jolpica-F1. Las poles cuentan las salidas desde la primera posición.",
      "Fotos de Wikimedia Commons: Lukas Raich (CC BY-SA 4.0), rsyphotography (CC BY 2.0), Grahampurse (CC BY-SA 4.0) y Jen Ross (CC BY 2.0). Cada foto enlaza a su ficha con autor y licencia.",
    ],
    back: "Volver a Max Verstappen",
  },
  en: {
    eyebrow: "Honourable mention · 2021 season",
    title: "The first title",
    subtitle: "The year Max Verstappen, aged 24, brought down the longest dynasty in Formula 1",
    champion: "World champion",
    intro:
      "In 2021 Max Verstappen took on Lewis Hamilton and Mercedes, who had won every title since 2014, in the most intense duel F1 had seen in decades. He won ten races, stood on the podium a record 18 times and went into the final race level on points with the seven-time champion. On the last lap he passed him to become the first Dutch world champion. This page tells that year from his side.",
    stats: {
      wins: "Wins",
      points: "Points",
      podiums: "Podiums",
      poles: "Starts from pole",
      fastestLaps: "Fastest laps",
      leadRounds: "Races as championship leader",
    },
    scaleTitle: "The balance",
    scaleIntro: (changes) =>
      `Max's points lead over Hamilton after every race: up means Max is ahead, down means Hamilton. The lead changed hands ${changes} times and they arrived at the final race level on points.`,
    scale: {
      aAhead: "Max ahead",
      bAhead: "Hamilton ahead",
      tie: "Level",
      table: "View as table",
      round: "Round",
      gp: "Grand Prix",
      gap: "Gap",
    },
    duelCaption: "Max ahead of Hamilton in Austin, on his way to one of his ten wins · 2021 United States GP",
    seasonTitle: "Race by race",
    seasonIntro:
      "All 22 Grands Prix of 2021, with Max's result and Hamilton's. The crown marks the races after which Max led the championship. Tap any of them to see the full race.",
    started: (grid) => `Started P${grid}`,
    pitLane: "Started from the pit lane",
    retired: "DNF",
    leader: "Championship leader",
    tie: "Level on points",
    sprintWin: "Won the sprint",
    setbacksTitle: "Blows that didn't stop him",
    setbacksIntro: "Championships are also won on the worst days. These were Max's in 2021, and this is how he answered.",
    setbacks: {
      6: {
        title: "Baku",
        text: "He was leading comfortably when, five laps from the end, his left-rear tyre exploded on the main straight. He climbed out, kicked the tyre and moved on: two weeks later he won in France.",
      },
      10: {
        title: "Silverstone",
        text: "He won the first sprint race in history, but on the opening lap on Sunday contact with Hamilton sent him into the barriers at Copse with a 51 G impact. The stewards penalised Hamilton, who won the race while Max was being checked in hospital.",
      },
      11: {
        title: "Hungary",
        text: "At the first corner, on a wet track, Valtteri Bottas triggered a pile-up that hit both Red Bulls. In a damaged car, Max salvaged two points.",
      },
      14: {
        title: "Monza",
        text: "At the first chicane he touched Hamilton and his Red Bull ended up on top of the Mercedes: both out, with the halo protecting Lewis. The stewards blamed Max and gave him a three-place grid penalty for the next race.",
      },
      15: {
        title: "Sochi",
        text: "A new engine and the penalty for the Monza crash sent him to the back of the grid. He climbed through patiently and, when the rain came, pitted at the right moment: he finished second.",
      },
      20: {
        title: "Qatar",
        text: "A five-place penalty for not slowing for yellow flags left him 7th on the grid. He fought back to second and took the fastest lap as well.",
      },
    },
    momentsTitle: "Moments from an unforgettable year",
    moments: {
      1: "Pole at the first race and a pass on Hamilton he had to hand back for exceeding track limits. Second, by less than a second: this time there was a fight.",
      2: "He starts 3rd and, on a wet track, dives down the inside of Hamilton at the first corner. He leads and wins at Imola.",
      5: "His first Monaco win and, for the first time in his career, the championship lead.",
      7: "Red Bull gambles on two stops and Max hunts Hamilton down on the penultimate lap to win in France.",
      9: "The perfect weekend at the Red Bull Ring: pole, victory, fastest lap and every lap in the lead. Three wins in a row.",
      12: "A deluge makes racing impossible: the race runs only behind the safety car. His wet pole lap on Saturday hands him the win.",
      13: "F1 returns to the Netherlands after 36 years and Max wins at home from pole, in front of a sea of orange, to retake the lead.",
      17: "Pole and victory in Austin, holding off Hamilton's pressure to the very last lap.",
      18: "At the start he goes around the outside of both Mercedes at the first corner and wins commandingly in Mexico.",
      21: "A chaotic race with two red flags. The two arrive at the final round level on points, something that had not happened since 1974.",
    },
    finalEyebrow: "Abu Dhabi · 12 December 2021",
    finalTitle: "Lap 58",
    finalText: [
      "Max started from pole, but Hamilton passed him at the start and controlled the race for more than 50 laps. Red Bull tried everything, and Sergio Pérez held Hamilton up for a couple of laps in a memorable defence, but with five laps to go the gap was more than ten seconds.",
      "Then Nicholas Latifi crashed and the safety car came out. Red Bull called Max in for fresh soft tyres; Hamilton stayed out on heavily worn hards. After a race control decision that is still debated, the race restarted for a single lap, with the two of them nose to tail.",
      "At Turn 5 Max dived down the inside, held off Hamilton's counter-attack on the straights that followed and crossed the line first. He was world champion.",
    ],
    finalStandings: "Final standings",
    legacyTitle: "What it meant",
    legacy: [
      { title: "First Dutchman", text: "No driver from the Netherlands had ever been Formula 1 world champion." },
      { title: "End of an era", text: "Mercedes had won the previous seven drivers' titles, from 2014 to 2020." },
      {
        title: "Red Bull and Honda",
        text: "Red Bull's first drivers' title since 2013 and the first for a Honda engine since Ayrton Senna in 1991, in Honda's official farewell season.",
      },
      { title: "The first of four", text: "It began a run of four consecutive titles, from 2021 to 2024." },
    ],
    quote: "Always attacking, right to the last corner of the last lap.",
    bannerCaption: "Red Bull RB16B · 2021 United States GP",
    heroAlt: "Orange flares from Dutch fans and Max's Red Bull at the Red Bull Ring",
    galleryTitle: "Gallery",
    gallery: {
      wave: "Max waves after qualifying, alongside Sergio Pérez · 2021 Austrian GP",
      austin: "The number 33 in Austin · 2021 United States GP",
      side: "Flat out at the Red Bull Ring · 2021 Austrian GP",
      silverstone: "On the grid at Silverstone · 2021 British GP",
    },
    creditsTitle: "Credits",
    credits: [
      "Statistics computed from Jolpica-F1 data. Poles count starts from first place on the grid.",
      "Photos from Wikimedia Commons: Lukas Raich (CC BY-SA 4.0), rsyphotography (CC BY 2.0), Grahampurse (CC BY-SA 4.0) and Jen Ross (CC BY 2.0). Each photo links to its page with author and licence.",
    ],
    back: "Back to Max Verstappen",
  },
};

export const PHOTOS = {
  hero: "File:FIA F1 Austria 2021 Post-Race Scene.jpg",
  duel: "File:2021 United States Grand Prix 23.jpg",
  closeup: "File:2021 United States Grand Prix 16.jpg",
  wave: "File:FIA F1 Austria 2021 Post Qualifying Scene Red Bull Drivers 2.jpg",
  austin: "File:Max Verstappen (Austin 2021).jpg",
  side: "File:FIA F1 Austria 2021 Nr. 33 Verstappen.jpg",
  silverstone: "File:2021 British Grand Prix (51349534458).jpg",
};
