// Textos de la página especial "Lewis Hamilton 2021" (es / en), contada desde su lado.
// Las cifras de la temporada se calculan con datos de Jolpica (src/lib/duel2021.ts); aquí van los
// textos de cada momento, que son hechos históricos fijos. Las claves numéricas son rondas.

type Card = { title: string; text: string };

type Copy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  badge: string;
  finale: string;
  intro: string;
  stats: { wins: string; points: string; podiums: string; poles: string; fastestLaps: string; closed: string };
  hundredTitle: string;
  hundredIntro: string;
  hundredPole: Card;
  hundredWin: Card;
  celebrationCaption: string;
  scaleTitle: string;
  scaleIntro: (closed: number) => string;
  scale: { aAhead: string; bAhead: string; tie: string; table: string; round: string; gp: string; gap: string };
  quote: string;
  bannerCaption: string;
  comebackTitle: string;
  comebackIntro: string;
  comeback: Partial<Record<number, Card>>;
  sprintNote: (from: number, to: number) => string;
  seasonTitle: string;
  seasonIntro: string;
  started: (grid: number) => string;
  pitLane: string;
  retired: string;
  leader: string;
  tie: string;
  sprintWin: string;
  momentsTitle: string;
  moments: Partial<Record<number, string>>;
  finalEyebrow: string;
  finalTitle: string;
  finalText: string[];
  finalStandings: string;
  legacyTitle: string;
  legacy: Card[];
  heroAlt: string;
  galleryTitle: string;
  gallery: Record<"portrait" | "side" | "handshake" | "pirelli", string>;
  creditsTitle: string;
  credits: string[];
  back: string;
};

export const HAMILTON_2021: Record<"es" | "en", Copy> = {
  es: {
    eyebrow: "Mención de honor · Temporada 2021",
    title: "Hasta el final",
    subtitle: "La temporada en la que el heptacampeón se enfrentó al mayor desafío de su carrera y respondió con algunas de las mejores carreras de su vida",
    badge: "100 victorias · 100 poles",
    finale: "La remontada final",
    intro:
      "En 2021 Lewis Hamilton iba a por un octavo título que lo dejaría solo en lo más alto de la historia. Enfrente tuvo a un Red Bull capaz de ganarle y a un Max Verstappen imparable. Hamilton respondió con ocho victorias, se convirtió en el primer piloto en llegar a 100 victorias y 100 poles y, cuando el campeonato parecía escapársele, ganó tres carreras seguidas para llegar a Abu Dabi empatado a puntos. Esta página cuenta ese año desde su lado.",
    stats: {
      wins: "Victorias",
      points: "Puntos",
      podiums: "Podios",
      poles: "Salidas desde la pole",
      fastestLaps: "Vueltas rápidas",
      closed: "Puntos recortados en tres carreras",
    },
    hundredTitle: "100 y 100",
    hundredIntro: "Nadie había llegado nunca a cien victorias ni a cien poles. Hamilton alcanzó las dos cifras en la misma temporada.",
    hundredPole: { title: "100.ª pole", text: "Sábado 8 de mayo, en Barcelona. Al día siguiente la convirtió en victoria." },
    hundredWin: {
      title: "100.ª victoria",
      text: "Domingo 26 de septiembre, en Sochi. Con la lluvia de las últimas vueltas, acertó al entrar a boxes a por neumáticos de mojado.",
    },
    celebrationCaption: "Hamilton celebra el mejor tiempo de la clasificación en Silverstone · GP de Gran Bretaña 2021",
    scaleTitle: "La balanza",
    scaleIntro: (closed) =>
      `Puntos de ventaja de Hamilton sobre Max después de cada carrera: hacia arriba manda Hamilton; hacia abajo, Max. Tras México estaba ${closed} puntos por detrás; tres carreras después, empataba.`,
    scale: {
      aAhead: "Hamilton por delante",
      bAhead: "Max por delante",
      tie: "Empate",
      table: "Ver como tabla",
      round: "Ronda",
      gp: "Gran Premio",
      gap: "Diferencia",
    },
    quote: "«Still I rise». Y se levantó, una y otra vez.",
    bannerCaption: "Vuelta de honor con la bandera británica tras ganar en casa · GP de Gran Bretaña 2021",
    comebackTitle: "La remontada",
    comebackIntro:
      "Después de México, Max tenía el título casi en la mano. Hamilton respondió con el mejor final de temporada de su carrera.",
    comeback: {
      19: {
        title: "Brasil",
        text: "Descalificado de la clasificación del viernes por su alerón trasero, salió último en el sprint y remontó hasta el 5.º. Una penalización por cambiar el motor lo dejó 10.º en la parrilla del domingo, y aun así ganó adelantando a Max en la vuelta 59. Lo celebró con la bandera de Brasil, como hacía Ayrton Senna.",
      },
      20: {
        title: "Catar",
        text: "Pole y victoria de principio a fin en el primer Gran Premio de Catar de la historia.",
      },
      21: {
        title: "Arabia Saudí",
        text: "Pole, victoria y vuelta rápida en una noche caótica, con dos banderas rojas y un toque con Max. Llegaba a la última carrera empatado a puntos.",
      },
      22: {
        title: "Abu Dabi",
        text: "Ganó la salida y dominó la carrera durante más de 50 vueltas. El coche de seguridad del final lo cambió todo.",
      },
    },
    sprintNote: (from, to) => `Sprint: ${from}.º → ${to}.º`,
    seasonTitle: "Carrera a carrera",
    seasonIntro:
      "Los 22 Grandes Premios de 2021, con el resultado de Hamilton y el de Max. La corona marca las carreras tras las que Hamilton lideraba el Mundial. Toca cualquiera para ver la carrera completa.",
    started: (grid) => `Salió ${grid}.º`,
    pitLane: "Salió del pit lane",
    retired: "ABD",
    leader: "Líder del Mundial",
    tie: "Empate a puntos",
    sprintWin: "Ganó el sprint",
    momentsTitle: "Momentos de un año para la historia",
    moments: {
      1: "Abre el año resistiendo el ataque final de Max en Bahréin. Primera victoria de la temporada.",
      2: "Se sale en la grava de Tosa y cae al 9.º puesto. Remonta hasta el 2.º y se lleva la vuelta rápida.",
      3: "Adelanta a Bottas y a Max en pista para ganar en Portugal.",
      4: "Su pole número 100 y, al día siguiente, una estrategia a dos paradas y un adelantamiento a Max a seis vueltas del final para ganar.",
      6: "En la reanudación, a dos vueltas del final, ataca a Sergio Pérez por la victoria, pero un botón mal pulsado lo saca de la pista en la primera curva. Cero puntos, y aun así solo cuatro por detrás del líder.",
      10: "Gana en casa por octava vez, un récord, adelantando a Charles Leclerc a dos vueltas del final pese a una penalización de diez segundos.",
      11: "En la reanudación es el único que sale desde la parrilla y cae al último lugar. Remonta hasta el podio y recupera el liderato del Mundial.",
      14: "El Red Bull de Max acaba encima de su coche en la primera chicane. El halo le protegió la cabeza.",
      15: "Victoria número 100 de su carrera, la primera de la historia, en Sochi y bajo la lluvia.",
    },
    finalEyebrow: "Abu Dabi · 12 de diciembre de 2021",
    finalTitle: "Con la cabeza alta",
    finalText: [
      "En Abu Dabi Hamilton hizo una salida perfecta, se puso líder y fue el más rápido durante toda la tarde. A cinco vueltas del final tenía más de diez segundos de ventaja y el octavo título en la mano.",
      "Entonces salió el coche de seguridad. La dirección de carrera dejó pasar solo a los coches doblados que había entre él y Max y reanudó la carrera para una última vuelta, con Max justo detrás y con neumáticos nuevos. Hamilton perdió el título en esa vuelta. Mercedes reclamó y, semanas después, la FIA relevó al director de carrera y reconoció que se había cometido un error humano, aunque el resultado no cambió.",
      "Al bajarse del coche felicitó a Max, y su padre, Anthony, fue a felicitarlo también. Después guardó silencio durante semanas. Tres días después de la carrera fue nombrado caballero en el castillo de Windsor: desde entonces es Sir Lewis Hamilton.",
    ],
    finalStandings: "Clasificación final",
    legacyTitle: "Lo que demostró",
    legacy: [
      { title: "100 victorias", text: "El primer piloto de la historia en llegar a cien victorias, en Sochi." },
      { title: "100 poles", text: "El primero en llegar a cien poles, en Barcelona." },
      { title: "Ocho seguidos", text: "Sus puntos dieron a Mercedes su octavo título de constructores consecutivo, un récord." },
      { title: "Sir Lewis", text: "Nombrado caballero tres días después de Abu Dabi, por su trayectoria dentro y fuera de la pista." },
    ],
    heroAlt: "El Mercedes de Hamilton con la bandera británica ante la grada de Silverstone",
    galleryTitle: "Galería",
    gallery: {
      portrait: "Lewis Hamilton en Silverstone · GP de Gran Bretaña 2021",
      side: "El W12 en el Red Bull Ring · GP de Austria 2021",
      handshake: "Saludo con Valtteri Bottas tras la clasificación · GP de Gran Bretaña 2021",
      pirelli: "A fondo en Silverstone · GP de Gran Bretaña 2021",
    },
    creditsTitle: "Créditos",
    credits: [
      "Estadísticas calculadas con datos de Jolpica-F1. Las poles cuentan las salidas desde la primera posición.",
      "Fotos de Wikimedia Commons: Jen Ross (CC BY 2.0) y Lukas Raich (CC BY-SA 4.0). Cada foto enlaza a su ficha con autor y licencia.",
    ],
    back: "Volver a Lewis Hamilton",
  },
  en: {
    eyebrow: "Honourable mention · 2021 season",
    title: "To the very end",
    subtitle: "The season in which the seven-time champion faced the biggest challenge of his career and answered with some of the best races of his life",
    badge: "100 wins · 100 poles",
    finale: "The final comeback",
    intro:
      "In 2021 Lewis Hamilton was chasing an eighth title that would put him alone at the top of the sport's history. Against him stood a Red Bull able to beat him and an unstoppable Max Verstappen. Hamilton answered with eight wins, became the first driver to reach 100 wins and 100 poles and, just as the championship seemed to be slipping away, won three races in a row to arrive in Abu Dhabi level on points. This page tells that year from his side.",
    stats: {
      wins: "Wins",
      points: "Points",
      podiums: "Podiums",
      poles: "Starts from pole",
      fastestLaps: "Fastest laps",
      closed: "Points clawed back in three races",
    },
    hundredTitle: "100 and 100",
    hundredIntro: "Nobody had ever reached a hundred wins or a hundred poles. Hamilton got to both in the same season.",
    hundredPole: { title: "100th pole", text: "Saturday 8 May, in Barcelona. The next day he turned it into victory." },
    hundredWin: {
      title: "100th win",
      text: "Sunday 26 September, in Sochi. When the rain came in the closing laps, he made the right call to pit for wet tyres.",
    },
    celebrationCaption: "Hamilton celebrates the fastest time in qualifying at Silverstone · 2021 British GP",
    scaleTitle: "The balance",
    scaleIntro: (closed) =>
      `Hamilton's points lead over Max after every race: up means Hamilton is ahead, down means Max. After Mexico he was ${closed} points behind; three races later, they were level.`,
    scale: {
      aAhead: "Hamilton ahead",
      bAhead: "Max ahead",
      tie: "Level",
      table: "View as table",
      round: "Round",
      gp: "Grand Prix",
      gap: "Gap",
    },
    quote: "“Still I rise.” And rise he did, again and again.",
    bannerCaption: "Lap of honour with the Union Jack after winning at home · 2021 British GP",
    comebackTitle: "The comeback",
    comebackIntro: "After Mexico, Max had the title almost in his hands. Hamilton responded with the best end to a season of his career.",
    comeback: {
      19: {
        title: "Brazil",
        text: "Disqualified from Friday qualifying because of his rear wing, he started the sprint from last and climbed to 5th. An engine penalty left him 10th on Sunday's grid, and he still won, passing Max on lap 59. He celebrated with the Brazilian flag, as Ayrton Senna used to.",
      },
      20: {
        title: "Qatar",
        text: "Pole and a lights-to-flag victory at the first ever Qatar Grand Prix.",
      },
      21: {
        title: "Saudi Arabia",
        text: "Pole, victory and fastest lap on a chaotic night, with two red flags and contact with Max. He went into the final race level on points.",
      },
      22: {
        title: "Abu Dhabi",
        text: "He won the start and dominated the race for more than 50 laps. The late safety car changed everything.",
      },
    },
    sprintNote: (from, to) => `Sprint: P${from} → P${to}`,
    seasonTitle: "Race by race",
    seasonIntro:
      "All 22 Grands Prix of 2021, with Hamilton's result and Max's. The crown marks the races after which Hamilton led the championship. Tap any of them to see the full race.",
    started: (grid) => `Started P${grid}`,
    pitLane: "Started from the pit lane",
    retired: "DNF",
    leader: "Championship leader",
    tie: "Level on points",
    sprintWin: "Won the sprint",
    momentsTitle: "Moments from a historic year",
    moments: {
      1: "He opens the year by holding off Max's late attack in Bahrain. First win of the season.",
      2: "He slides into the gravel at Tosa and drops to 9th. He fights back to 2nd and takes the fastest lap.",
      3: "He passes Bottas and Max on track to win in Portugal.",
      4: "His 100th pole and, the next day, a two-stop strategy and a pass on Max six laps from the end to win.",
      6: "At the restart, with two laps to go, he attacks Sergio Pérez for the win, but a wrongly pressed button sends him off at the first corner. No points, and still only four behind the leader.",
      10: "He wins at home for a record eighth time, passing Charles Leclerc two laps from the end despite a ten-second penalty.",
      11: "At the restart he is the only driver to start from the grid and falls to last. He fights back to the podium and retakes the championship lead.",
      14: "Max's Red Bull ends up on top of his car at the first chicane. The halo protected his head.",
      15: "The 100th win of his career, the first in history, in Sochi and in the rain.",
    },
    finalEyebrow: "Abu Dhabi · 12 December 2021",
    finalTitle: "Head held high",
    finalText: [
      "In Abu Dhabi Hamilton made a perfect start, took the lead and was the fastest man on track all afternoon. With five laps to go he was more than ten seconds clear, with an eighth title in his hands.",
      "Then the safety car came out. Race control let only the lapped cars between him and Max through and restarted the race for one final lap, with Max right behind on fresh tyres. Hamilton lost the title on that lap. Mercedes protested and, weeks later, the FIA replaced the race director and acknowledged that human error had been made, although the result never changed.",
      "When he climbed out of the car he congratulated Max, and his father, Anthony, went to congratulate him too. He then stayed silent for weeks. Three days after the race he was knighted at Windsor Castle: since then he has been Sir Lewis Hamilton.",
    ],
    finalStandings: "Final standings",
    legacyTitle: "What he proved",
    legacy: [
      { title: "100 wins", text: "The first driver in history to reach a hundred wins, in Sochi." },
      { title: "100 poles", text: "The first to reach a hundred poles, in Barcelona." },
      { title: "Eight in a row", text: "His points gave Mercedes a record eighth consecutive constructors' title." },
      { title: "Sir Lewis", text: "Knighted three days after Abu Dhabi, for his career on and off the track." },
    ],
    heroAlt: "Hamilton's Mercedes with the Union Jack in front of the Silverstone crowd",
    galleryTitle: "Gallery",
    gallery: {
      portrait: "Lewis Hamilton at Silverstone · 2021 British GP",
      side: "The W12 at the Red Bull Ring · 2021 Austrian GP",
      handshake: "With Valtteri Bottas after qualifying · 2021 British GP",
      pirelli: "Flat out at Silverstone · 2021 British GP",
    },
    creditsTitle: "Credits",
    credits: [
      "Statistics computed from Jolpica-F1 data. Poles count starts from first place on the grid.",
      "Photos from Wikimedia Commons: Jen Ross (CC BY 2.0) and Lukas Raich (CC BY-SA 4.0). Each photo links to its page with author and licence.",
    ],
    back: "Back to Lewis Hamilton",
  },
};

export const PHOTOS = {
  hero: "File:Lewis Hamilton 2021 Silverstone Win (51349264986).jpg",
  flag: "File:Lewis Hamilton 2021 Silverstone Win (51350286770).jpg",
  celebration: "File:2021 British Grand Prix (51350048214).jpg",
  portrait: "File:Lewis Hamilton, Silverstone 2021 (51350312955).jpg",
  side: "File:FIA F1 Austria 2021 Nr. 44 Hamilton (side).jpg",
  handshake: "File:2021 British Grand Prix (51350047899).jpg",
  pirelli: "File:2021 British Grand Prix (51349542048).jpg",
};
