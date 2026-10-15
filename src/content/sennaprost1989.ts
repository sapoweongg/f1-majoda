// Textos de la página especial "Senna vs Prost 1989" (es / en). Neutral: cuenta el duelo de los dos.
// Las cifras se calculan con datos de Jolpica (src/lib/duel.ts, con los 11 mejores resultados como
// marcaba el reglamento); aquí van los textos de cada momento, hechos históricos fijos. Las claves
// numéricas son rondas.

type Card = { title: string; text: string };

type Copy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  badge: string;
  intro: string;
  finalStandings: string;
  grossNote: (gross: number) => string;
  compareTitle: string;
  compareIntro: string;
  compare: { wins: string; poles: string; podiums: string; scoring: string; ahead: string; points: string };
  photoCaptions: { senna: string; prost: string };
  scaleTitle: string;
  scaleIntro: (leadChanges: number) => string;
  scale: { aAhead: string; bAhead: string; tie: string; table: string; round: string; gp: string; gap: string };
  quote: string;
  bannerCaption: string;
  seasonTitle: string;
  seasonIntro: string;
  retired: string;
  leader: string;
  tie: string;
  winner: (name: string) => string;
  momentsTitle: string;
  moments: Partial<Record<number, string>>;
  finalEyebrow: string;
  finalTitle: string;
  finalText: string[];
  viewsTitle: string;
  views: { senna: Card; prost: Card };
  afterTitle: string;
  after: Card[];
  heroAlt: string;
  galleryTitle: string;
  gallery: Record<"imola" | "sennaCar" | "prostCar" | "start", string>;
  creditsTitle: string;
  credits: string[];
  backSenna: string;
  backProst: string;
};

export const SENNA_PROST_1989: Record<"es" | "en", Copy> = {
  es: {
    eyebrow: "Mención de honor · Temporada 1989",
    title: "Enemigos íntimos",
    subtitle: "Dos genios en el mismo coche, el mejor de la parrilla, y un título que se decidió en una chicane de Suzuka",
    badge: "McLaren-Honda · 10 victorias de 16",
    intro:
      "En 1989 Ayrton Senna y Alain Prost compartían el McLaren-Honda, el coche más rápido de la parrilla, y desde la segunda carrera ya no se hablaban. Senna fue el más rápido: 13 poles y 6 victorias. Prost, el más constante: 11 podios y puntos en 13 de las 16 carreras. El campeonato se decidió en la penúltima cita, en la chicane de Suzuka donde se tocaron. Esta página cuenta el duelo de los dos.",
    finalStandings: "Clasificación final",
    grossNote: (gross) => `Prost sumó ${gross} puntos, pero solo contaban los 11 mejores resultados.`,
    compareTitle: "Cara a cara",
    compareIntro: "El mismo coche y dos maneras de ganar: la velocidad de Senna contra la regularidad de Prost.",
    compare: {
      wins: "Victorias",
      poles: "Salidas desde la pole",
      podiums: "Podios",
      scoring: "Carreras con puntos",
      ahead: "Carreras por delante del otro",
      points: "Puntos que contaron",
    },
    photoCaptions: {
      senna: "Ayrton Senna en el podio de Spa · GP de Bélgica 1989",
      prost: "Alain Prost en el podio de Spa · GP de Bélgica 1989",
    },
    scaleTitle: "La balanza",
    scaleIntro: (changes) =>
      `Puntos de ventaja de Senna sobre Prost después de cada carrera, contando solo los 11 mejores resultados, como marcaba el reglamento: hacia arriba manda Senna; hacia abajo, Prost. El liderato solo cambió de manos ${changes} veces: Senna lideró únicamente tras México.`,
    scale: {
      aAhead: "Senna por delante",
      bAhead: "Prost por delante",
      tie: "Empate",
      table: "Ver como tabla",
      round: "Ronda",
      gp: "Gran Premio",
      gap: "Diferencia",
    },
    quote: "El mismo coche. Ninguna tregua.",
    bannerCaption: "La salida bajo la lluvia de Spa, con los dos McLaren delante · GP de Bélgica 1989",
    seasonTitle: "Carrera a carrera",
    seasonIntro:
      "Las 16 carreras de 1989 con el resultado de los dos. Se atenúa el que terminó detrás y la corona marca quién lideraba el Mundial después de cada carrera. Toca cualquiera para verla completa.",
    retired: "ABD",
    leader: "Líder del Mundial",
    tie: "Empate a puntos",
    winner: (name) => `Ganó ${name}`,
    momentsTitle: "Un año en guerra",
    moments: {
      1: "Senna sale desde la pole, pero toca a Gerhard Berger en la primera curva y termina 11.º. Prost es segundo pese a un problema de embrague.",
      2: "Habían pactado no atacarse en la primera curva. Tras la bandera roja por el accidente de Berger, Senna adelanta a Prost en la nueva salida. Prost lo vive como una traición y dejan de hablarse.",
      5: "Una avería eléctrica deja a Senna fuera y Prost gana. Se pone líder del Mundial y ya no soltará el liderato.",
      6: "Bajo la lluvia, Senna lidera hasta que su motor se rompe a tres vueltas del final. Prost había abandonado en las primeras vueltas.",
      7: "Prost gana en casa el fin de semana en que anuncia que dejará McLaren a final de año.",
      8: "Senna se sale en Becketts con la caja de cambios rota cuando iba líder. Prost gana en Silverstone.",
      9: "Prost se queda sin sexta marcha a dos vueltas del final y Senna le arrebata la victoria.",
      11: "Senna gana bajo la lluvia de Spa con Prost segundo.",
      12: "El motor de Senna se rompe cuando lideraba y Prost gana. Ya fichado por Ferrari, deja caer el trofeo a los tifosi desde el podio, para enfado de Ron Dennis.",
      13: "Nigel Mansell ignora la bandera negra y choca con Senna: los dos fuera. Prost es segundo.",
      14: "Senna gana y sigue vivo, pero las cuentas son claras: tiene que ganar las dos carreras que quedan.",
      16: "Con el título ya decidido, un diluvio en Adelaida: Prost se retira tras la primera vuelta por falta de visibilidad y Senna choca contra el Brabham de Martin Brundle.",
    },
    finalEyebrow: "Suzuka · 22 de octubre de 1989",
    finalTitle: "La chicane",
    finalText: [
      "Senna llegó a Suzuka obligado a ganar: si no lo hacía, Prost era campeón. Salió desde la pole, pero Prost le ganó la salida y lideró durante 46 vueltas con un coche preparado para correr más en las rectas.",
      "En la vuelta 47 Senna se lanzó por dentro en la chicane del final de la recta. Prost giró y los dos coches quedaron enganchados. Prost se bajó del coche; Senna pidió que lo empujaran, volvió a la pista por la vía de escape, cambió el morro en boxes y adelantó a Alessandro Nannini para ganar.",
      "Pero los comisarios lo descalificaron por no completar la chicane al reincorporarse, y Prost fue campeón del mundo por tercera vez. McLaren recurrió y perdió, y Senna recibió además una multa de 100.000 dólares y una suspensión condicional de seis meses.",
    ],
    viewsTitle: "Dos miradas",
    views: {
      senna: {
        title: "Según Senna",
        text: "Prost le cerró la puerta a propósito y la descalificación fue una decisión de despacho. Culpó directamente al presidente de la FISA, el francés Jean-Marie Balestre, y llegó a plantearse dejar la F1.",
      },
      prost: {
        title: "Según Prost",
        text: "Senna se tiró a un hueco que no existía. Antes de la carrera había avisado de que ya no le dejaría la puerta abierta como otras veces, y defendió que él solo hizo su trazada.",
      },
    },
    afterTitle: "Lo que vino después",
    after: [
      { title: "Suzuka 1990", text: "Un año después, con Prost ya en Ferrari, se tocaron en la primera curva de Suzuka. Los dos quedaron fuera y Senna fue campeón." },
      { title: "El cuarto título", text: "Prost ganó su cuarto título en 1993 con Williams y se retiró a final de temporada." },
      { title: "Adelaida 1993", text: "En la última carrera de Prost, Senna ganó y le hizo subir con él a lo más alto del podio." },
      { title: "Imola 1994", text: "Tras la muerte de Senna, Prost fue uno de los que llevaron su féretro en São Paulo." },
    ],
    heroAlt: "Los dos McLaren en cabeza en la salida de Imola 1989",
    galleryTitle: "Galería",
    gallery: {
      imola: "Senna en Imola · GP de San Marino 1989",
      sennaCar: "Senna, camino de la victoria bajo la lluvia · GP de Bélgica 1989",
      prostCar: "Prost en Spa · GP de Bélgica 1989",
      start: "Los dos McLaren al frente en la salida · GP de Bélgica 1989",
    },
    creditsTitle: "Créditos",
    credits: [
      "Estadísticas calculadas con datos de Jolpica-F1. Los puntos cuentan los 11 mejores resultados de cada piloto, como establecía el reglamento de 1989; las poles cuentan las salidas desde la primera posición.",
      "Fotos de Wikimedia Commons: madagascarica (CC BY 2.0), Gabriele (CC BY 2.0) y autor desconocido (dominio público). Cada foto enlaza a su ficha con autor y licencia.",
    ],
    backSenna: "Ayrton Senna",
    backProst: "Alain Prost",
  },
  en: {
    eyebrow: "Honourable mention · 1989 season",
    title: "Intimate enemies",
    subtitle: "Two geniuses in the same car, the best on the grid, and a title decided at a chicane in Suzuka",
    badge: "McLaren-Honda · 10 wins out of 16",
    intro:
      "In 1989 Ayrton Senna and Alain Prost shared the McLaren-Honda, the fastest car on the grid, and from the second race onwards they were no longer speaking. Senna was the faster: 13 poles and 6 wins. Prost was the more consistent: 11 podiums and points in 13 of the 16 races. The championship was decided at the penultimate round, at the Suzuka chicane where they collided. This page tells the story of their duel.",
    finalStandings: "Final standings",
    grossNote: (gross) => `Prost scored ${gross} points, but only the best 11 results counted.`,
    compareTitle: "Head to head",
    compareIntro: "The same car and two ways of winning: Senna's speed against Prost's consistency.",
    compare: {
      wins: "Wins",
      poles: "Starts from pole",
      podiums: "Podiums",
      scoring: "Races in the points",
      ahead: "Races ahead of the other",
      points: "Points that counted",
    },
    photoCaptions: {
      senna: "Ayrton Senna on the Spa podium · 1989 Belgian GP",
      prost: "Alain Prost on the Spa podium · 1989 Belgian GP",
    },
    scaleTitle: "The balance",
    scaleIntro: (changes) =>
      `Senna's points lead over Prost after every race, counting only the best 11 results as the rules required: up means Senna is ahead, down means Prost. The lead changed hands only ${changes} times: Senna led only after Mexico.`,
    scale: {
      aAhead: "Senna ahead",
      bAhead: "Prost ahead",
      tie: "Level",
      table: "View as table",
      round: "Round",
      gp: "Grand Prix",
      gap: "Gap",
    },
    quote: "Same car. No truce.",
    bannerCaption: "The start in the Spa rain, with both McLarens in front · 1989 Belgian GP",
    seasonTitle: "Race by race",
    seasonIntro:
      "All 16 races of 1989 with both results. The driver who finished behind is dimmed and the crown marks who led the championship after each race. Tap any of them to see the full race.",
    retired: "DNF",
    leader: "Championship leader",
    tie: "Level on points",
    winner: (name) => `Won by ${name}`,
    momentsTitle: "A year at war",
    moments: {
      1: "Senna starts from pole but touches Gerhard Berger at the first corner and finishes 11th. Prost is second despite a clutch problem.",
      2: "They had agreed not to attack each other into the first corner. After the red flag for Berger's crash, Senna passes Prost at the restart. Prost sees it as a betrayal and they stop speaking.",
      5: "An electrical failure puts Senna out and Prost wins. He takes the championship lead and never gives it up.",
      6: "In the rain, Senna leads until his engine fails three laps from the end. Prost had retired in the opening laps.",
      7: "Prost wins at home on the weekend he announces he will leave McLaren at the end of the year.",
      8: "Senna goes off at Becketts with a broken gearbox while leading. Prost wins at Silverstone.",
      9: "Prost loses sixth gear two laps from the end and Senna snatches the win.",
      11: "Senna wins in the Spa rain with Prost second.",
      12: "Senna's engine fails while he is leading and Prost wins. Already signed by Ferrari, he drops the trophy to the tifosi from the podium, angering Ron Dennis.",
      13: "Nigel Mansell ignores the black flag and collides with Senna: both out. Prost is second.",
      14: "Senna wins and stays alive, but the maths are clear: he has to win both remaining races.",
      16: "With the title already decided, a deluge in Adelaide: Prost withdraws after the first lap because he cannot see, and Senna crashes into Martin Brundle's Brabham.",
    },
    finalEyebrow: "Suzuka · 22 October 1989",
    finalTitle: "The chicane",
    finalText: [
      "Senna arrived at Suzuka needing to win: if he didn't, Prost was champion. He started from pole, but Prost beat him off the line and led for 46 laps with a car set up to be quicker on the straights.",
      "On lap 47 Senna dived down the inside at the chicane at the end of the straight. Prost turned in and the two cars locked together. Prost climbed out; Senna asked for a push, rejoined through the escape road, pitted for a new nose and passed Alessandro Nannini to win.",
      "But the stewards disqualified him for not completing the chicane when he rejoined, and Prost became world champion for the third time. McLaren appealed and lost, and Senna was also fined 100,000 dollars and given a six-month suspended ban.",
    ],
    viewsTitle: "Two points of view",
    views: {
      senna: {
        title: "Senna's view",
        text: "Prost shut the door on purpose and the disqualification was decided in an office. He directly blamed the FISA president, the Frenchman Jean-Marie Balestre, and even considered quitting F1.",
      },
      prost: {
        title: "Prost's view",
        text: "Senna went for a gap that wasn't there. Before the race he had warned that he would no longer leave the door open as he had in the past, and he insisted he had simply taken his line.",
      },
    },
    afterTitle: "What came next",
    after: [
      { title: "Suzuka 1990", text: "A year later, with Prost now at Ferrari, they collided at the first corner in Suzuka. Both were out and Senna was champion." },
      { title: "The fourth title", text: "Prost won his fourth title in 1993 with Williams and retired at the end of the season." },
      { title: "Adelaide 1993", text: "At Prost's last race, Senna won and brought him up onto the top step of the podium with him." },
      { title: "Imola 1994", text: "After Senna's death, Prost was one of the pallbearers at his funeral in São Paulo." },
    ],
    heroAlt: "The two McLarens leading at the start at Imola in 1989",
    galleryTitle: "Gallery",
    gallery: {
      imola: "Senna at Imola · 1989 San Marino GP",
      sennaCar: "Senna on his way to victory in the rain · 1989 Belgian GP",
      prostCar: "Prost at Spa · 1989 Belgian GP",
      start: "Both McLarens in front at the start · 1989 Belgian GP",
    },
    creditsTitle: "Credits",
    credits: [
      "Statistics computed from Jolpica-F1 data. Points count each driver's best 11 results, as the 1989 rules required; poles count starts from first place on the grid.",
      "Photos from Wikimedia Commons: madagascarica (CC BY 2.0), Gabriele (CC BY 2.0) and unknown author (public domain). Each photo links to its page with author and licence.",
    ],
    backSenna: "Ayrton Senna",
    backProst: "Alain Prost",
  },
};

export const PHOTOS = {
  hero: "File:Formula 1, GP San Marino 1989, Imola, Prost e Senna.jpg",
  rain: "File:1989 Belgian GP race start 02.jpg",
  senna: "File:Ayrton Senna 1989 Belgian GP podium.jpg",
  prost: "File:Alain Prost 1989 Belgian GP podium.jpg",
  imola: "File:Ayrton Senna Imola 1989.jpg",
  sennaCar: "File:Ayrton Senna 1989 Belgian GP.jpg",
  prostCar: "File:Alain Prost 1989 Belgian GP.jpg",
  start: "File:1989 Belgian GP race start 01.jpg",
};
