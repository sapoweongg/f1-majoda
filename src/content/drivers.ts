// Descripciones de los pilotos (es / en) para sus fichas. Como las de los equipos, son textos de
// historia: las cifras que cambian (victorias, poles, puntos) y los hitos (debut, primer podio, primera
// victoria) los calcula la ficha con datos de Jolpica, así que aquí solo van hechos cerrados.
// Por ahora, los pilotos de la parrilla de 2026.

export type DriverStory = {
  /** Una línea que resume al piloto. */
  tagline: string;
  /** Ciudad y país de nacimiento. */
  born?: string;
  /** Párrafos para la ficha. */
  text: string[];
};

const STORIES: Record<string, Record<"es" | "en", DriverStory>> = {
  // ---------- Red Bull ----------
  max_verstappen: {
    es: {
      tagline: "Campeón de 2021 a 2024 y el ganador más joven de la historia de la F1.",
      born: "Hasselt, Bélgica",
      text: [
        "Hijo del expiloto de F1 Jos Verstappen y de la campeona de karting Sophie Kumpen, creció entre circuitos. Solo hizo una temporada completa en monoplazas, la Fórmula 3 europea de 2014, antes de debutar con Toro Rosso en Australia 2015 con 17 años: el debutante más joven de la historia. En 2016 Red Bull lo subió al equipo principal a mitad de temporada y ganó en Barcelona en su primera carrera con ellos, con 18 años.",
        "Su primer título llegó en 2021, en la última vuelta de Abu Dabi y tras un duelo de todo el año con Lewis Hamilton. Después dominó la era del efecto suelo: campeón en 2022, en 2023 (con 19 victorias en 22 carreras, un récord) y en 2024. En 2025 perdió el campeonato por solo dos puntos frente a Lando Norris.",
      ],
    },
    en: {
      tagline: "Champion from 2021 to 2024 and the youngest race winner in F1 history.",
      born: "Hasselt, Belgium",
      text: [
        "The son of former F1 driver Jos Verstappen and karting champion Sophie Kumpen, he grew up at race tracks. He spent just one full season in single-seaters, the 2014 European Formula 3, before making his debut with Toro Rosso in Australia 2015 aged 17: the youngest debutant in history. Red Bull promoted him mid-2016 and he won in Barcelona on his first outing for the team, aged 18.",
        "His first title came in 2021, on the final lap in Abu Dhabi after a season-long duel with Lewis Hamilton. He then dominated the ground-effect era: champion in 2022, in 2023 (with a record 19 wins from 22 races) and in 2024. In 2025 he lost the championship to Lando Norris by just two points.",
      ],
    },
  },
  hadjar: {
    es: {
      tagline: "El francés de Red Bull al que apodan «le petit Prost».",
      born: "París, Francia",
      text: [
        "Miembro del programa de jóvenes de Red Bull, fue subcampeón de Fórmula 2 en 2024, en su segunda temporada en la categoría. Debutó en 2025 con Racing Bulls y su primera carrera duró menos de una vuelta: se salió en la vuelta de formación de Melbourne, bajo la lluvia, y fue Anthony Hamilton, el padre de Lewis, quien se acercó a consolarlo.",
        "Se rehízo con una temporada muy sólida, con su primer podio en Zandvoort, y en 2026 Red Bull lo ascendió al equipo principal como compañero de Max Verstappen.",
      ],
    },
    en: {
      tagline: "Red Bull's Frenchman, nicknamed “le petit Prost”.",
      born: "Paris, France",
      text: [
        "A member of Red Bull's junior programme, he was Formula 2 runner-up in 2024, his second season in the category. He made his debut in 2025 with Racing Bulls and his first race lasted less than a lap: he crashed on the formation lap in a wet Melbourne, and it was Anthony Hamilton, Lewis's father, who came over to console him.",
        "He bounced back with a very solid season, including his first podium at Zandvoort, and in 2026 Red Bull promoted him to the senior team alongside Max Verstappen.",
      ],
    },
  },

  // ---------- Racing Bulls ----------
  lawson: {
    es: {
      tagline: "El neozelandés que se ganó su sitio a base de sustituciones.",
      born: "Hastings, Nueva Zelanda",
      text: [
        "Campeón de la Toyota Racing Series de su país en 2019, recorrió un camino poco habitual: Fórmula 3, Fórmula 2, el DTM alemán con Ferrari (subcampeón en 2021) y la Super Fórmula japonesa. Debutó en 2023 en Zandvoort para sustituir a Daniel Ricciardo, que se había roto una mano, y en su tercera carrera ya sumó puntos en Singapur.",
        "A finales de 2024 volvió a ocupar el coche de Ricciardo y en 2025 Red Bull lo ascendió al equipo principal, pero tras solo dos carreras lo devolvió a Racing Bulls. Lejos de hundirse, siguió puntuando, y en 2026 es el piloto con más experiencia del equipo de Faenza.",
      ],
    },
    en: {
      tagline: "The New Zealander who earned his seat as a stand-in.",
      born: "Hastings, New Zealand",
      text: [
        "Champion of his home Toyota Racing Series in 2019, he took an unusual route: Formula 3, Formula 2, the German DTM with Ferrari (runner-up in 2021) and Japan's Super Formula. He made his debut in 2023 at Zandvoort, standing in for Daniel Ricciardo, who had broken his hand, and scored points in Singapore in only his third race.",
        "In late 2024 he took over Ricciardo's car again and in 2025 Red Bull promoted him to the senior team, only to send him back to Racing Bulls after two races. Far from sinking, he kept scoring, and in 2026 he is the more experienced driver at the Faenza team.",
      ],
    },
  },
  arvid_lindblad: {
    es: {
      tagline: "El único debutante de 2026, con 18 años.",
      text: [
        "Entró muy joven en el programa de pilotos de Red Bull y subió a toda velocidad por las categorías de formación: Fórmula 4, Fórmula 3 y, en 2025, Fórmula 2. Red Bull le dio una de sus plazas para 2026 y debutó en Australia con Racing Bulls, como único novato de la temporada.",
        "Su llegada continúa la tradición del equipo de Faenza, la cantera en la que se formaron Sebastian Vettel, Max Verstappen y Pierre Gasly.",
      ],
    },
    en: {
      tagline: "The only rookie of 2026, aged 18.",
      text: [
        "He joined Red Bull's driver programme at a young age and rose through the junior categories at full speed: Formula 4, Formula 3 and, in 2025, Formula 2. Red Bull handed him one of its 2026 seats and he made his debut in Australia with Racing Bulls, as the season's only rookie.",
        "His arrival continues the tradition of the Faenza team, the academy where Sebastian Vettel, Max Verstappen and Pierre Gasly cut their teeth.",
      ],
    },
  },

  // ---------- Ferrari ----------
  leclerc: {
    es: {
      tagline: "El niño de Montecarlo que creció soñando con pilotar para Ferrari.",
      born: "Montecarlo, Mónaco",
      text: [
        "Ahijado de Jules Bianchi, ganó la GP3 en 2016 y la Fórmula 2 en 2017, las dos en su primer intento. En junio de 2017 ganó en Bakú pocos días después de la muerte de su padre, Hervé, que le había transmitido su pasión por las carreras.",
        "Debutó con Sauber en 2018 y en 2019 Ferrari lo fichó con 21 años: ese mismo año ganó en Spa y en Monza, ante los tifosi. Es uno de los grandes especialistas a una vuelta de su generación y en 2024 cumplió por fin el sueño de ganar en casa, en Mónaco, tras años de mala suerte en las calles del Principado.",
      ],
    },
    en: {
      tagline: "The Monte Carlo kid who grew up dreaming of driving for Ferrari.",
      born: "Monte Carlo, Monaco",
      text: [
        "A godson of Jules Bianchi, he won GP3 in 2016 and Formula 2 in 2017, both at the first attempt. In June 2017 he won in Baku just days after the death of his father, Hervé, who had passed on his love of racing.",
        "He made his debut with Sauber in 2018 and Ferrari signed him in 2019, aged 21: that year he won at Spa and at Monza, in front of the tifosi. He is one of the finest one-lap specialists of his generation, and in 2024 he finally fulfilled his dream of winning at home in Monaco after years of bad luck in the Principality's streets.",
      ],
    },
  },
  hamilton: {
    es: {
      tagline: "El piloto con más victorias y poles de la historia, ahora de rojo.",
      born: "Stevenage, Inglaterra",
      text: [
        "Con 10 años se presentó ante Ron Dennis y le dijo que algún día correría para McLaren; con 13 ya estaba en su programa de jóvenes. Campeón de GP2 en 2006, debutó en 2007 con un podio en su primera carrera y perdió el título por un solo punto como novato. Al año siguiente se coronó en la última curva de la última carrera, en Interlagos.",
        "En 2013 se marchó a Mercedes y con los motores híbridos ganó seis títulos más (2014, 2015, 2017, 2018, 2019 y 2020) hasta igualar los siete de Michael Schumacher. Tiene los récords de victorias y de poles, fue nombrado sir en 2021 y usa su voz para defender la diversidad en el automovilismo. En 2025 cumplió otro sueño de infancia al fichar por Ferrari.",
      ],
    },
    en: {
      tagline: "The driver with the most wins and poles in history, now in red.",
      born: "Stevenage, England",
      text: [
        "Aged 10, he walked up to Ron Dennis and told him he would race for McLaren one day; by 13 he was in their junior programme. GP2 champion in 2006, he made his debut in 2007 with a podium in his first race and lost the title by a single point as a rookie. The following year he was crowned at the last corner of the last race, at Interlagos.",
        "In 2013 he moved to Mercedes and in the hybrid era won six more titles (2014, 2015, 2017, 2018, 2019 and 2020) to match Michael Schumacher's seven. He holds the records for wins and pole positions, was knighted in 2021 and uses his voice to push for diversity in motorsport. In 2025 he fulfilled another childhood dream by joining Ferrari.",
      ],
    },
  },

  // ---------- Mercedes ----------
  russell: {
    es: {
      tagline: "El líder sereno de Mercedes, curtido en tres años con Williams.",
      born: "King's Lynn, Inglaterra",
      text: [
        "Campeón de GP3 en 2017 y de Fórmula 2 en 2018, debutó en 2019 con Williams, entonces el coche más lento de la parrilla, y se ganó el apodo de «Mr. Saturday» por meterlo en la Q2 una y otra vez. En Sakhir 2020 sustituyó a Hamilton, enfermo de covid, y estuvo a punto de ganar con Mercedes hasta que un error en boxes y un pinchazo se lo impidieron.",
        "Su primer podio llegó con Williams en la Spa pasada por agua de 2021 y en 2022 pasó a Mercedes, con el que ganó por primera vez ese mismo año en Interlagos. Desde la marcha de Hamilton es el líder del equipo, y fuera de la pista es uno de los directores de la asociación de pilotos (GPDA).",
      ],
    },
    en: {
      tagline: "Mercedes' composed team leader, toughened by three years at Williams.",
      born: "King's Lynn, England",
      text: [
        "GP3 champion in 2017 and Formula 2 champion in 2018, he made his debut in 2019 with Williams, then the slowest car on the grid, and earned the nickname “Mr. Saturday” for dragging it into Q2 time and again. At Sakhir 2020 he stood in for a Covid-stricken Hamilton and was on course to win for Mercedes until a pit-stop mix-up and a puncture denied him.",
        "His first podium came with Williams at a rain-soaked Spa in 2021 and in 2022 he moved to Mercedes, winning for the first time that same year at Interlagos. Since Hamilton's departure he has led the team, and off track he is one of the directors of the drivers' association (GPDA).",
      ],
    },
  },
  antonelli: {
    es: {
      tagline: "El elegido de Mercedes para tomar el relevo de Hamilton.",
      born: "Bolonia, Italia",
      text: [
        "Hijo de Marco Antonelli, dueño de un equipo de carreras, entró de niño en el programa de jóvenes de Mercedes. Arrasó en las categorías inferiores —campeón de la Fórmula 4 italiana y alemana en 2022 y de la Fórmula Regional europea en 2023— y Mercedes le hizo saltarse la Fórmula 3 para correr la Fórmula 2 en 2024.",
        "Con 18 años heredó el asiento de Lewis Hamilton en 2025. Ese año fue el piloto más joven en salir desde la pole en una sesión de F1 (el sprint de Miami) y subió a su primer podio en Canadá. En 2026 llegó su primera victoria, en China.",
      ],
    },
    en: {
      tagline: "The driver Mercedes chose to succeed Hamilton.",
      born: "Bologna, Italy",
      text: [
        "The son of Marco Antonelli, who runs a racing team, he joined the Mercedes junior programme as a child. He swept through the junior ranks —Italian and German Formula 4 champion in 2022 and Formula Regional European champion in 2023— and Mercedes had him skip Formula 3 to race in Formula 2 in 2024.",
        "Aged 18, he inherited Lewis Hamilton's seat in 2025. That year he became the youngest driver to start from pole in an F1 session (the Miami sprint) and took his first podium in Canada. His first win came in China in 2026.",
      ],
    },
  },

  // ---------- McLaren ----------
  norris: {
    es: {
      tagline: "Campeón del mundo en 2025 con McLaren, el único equipo que ha conocido en la F1.",
      born: "Bristol, Inglaterra",
      text: [
        "De madre belga y padre británico, fue campeón de la Fórmula 3 europea en 2017 y subcampeón de Fórmula 2 en 2018 antes de debutar con McLaren en 2019, con 19 años. Su primer podio llegó en Austria 2020 gracias a una última vuelta espectacular, y su primera pole, en Sochi 2021, acabó en lágrimas cuando la lluvia le quitó la victoria a pocas vueltas del final.",
        "La primera victoria tardó, pero llegó en Miami 2024 y abrió la mejor etapa de McLaren en décadas. En 2025 se proclamó campeón del mundo en la última carrera, en Abu Dabi, dos puntos por delante de Max Verstappen y tras pelear todo el año con su compañero Oscar Piastri. Fuera de la pista es conocido por sus directos y por su colectivo de gaming, Quadrant.",
      ],
    },
    en: {
      tagline: "2025 world champion with McLaren, the only team he has driven for in F1.",
      born: "Bristol, England",
      text: [
        "Born to a Belgian mother and a British father, he was European Formula 3 champion in 2017 and Formula 2 runner-up in 2018 before making his debut with McLaren in 2019, aged 19. His first podium came in Austria 2020 thanks to a sensational final lap, and his first pole, at Sochi 2021, ended in tears when rain robbed him of victory a few laps from the end.",
        "The first win took its time, but it came in Miami 2024 and opened McLaren's best spell in decades. In 2025 he was crowned world champion at the final race in Abu Dhabi, two points ahead of Max Verstappen, after a season-long fight with team-mate Oscar Piastri. Off track he is known for his streams and for his gaming collective, Quadrant.",
      ],
    },
  },
  piastri: {
    es: {
      tagline: "Campeón en cada categoría por la que pasó camino de la F1.",
      born: "Melbourne, Australia",
      text: [
        "Ganó la Fórmula Renault Eurocup en 2019, la Fórmula 3 en 2020 y la Fórmula 2 en 2021, siempre a la primera. Aun así se pasó 2022 sin asiento, como reserva de Alpine, y ese verano protagonizó un culebrón: Alpine anunció su fichaje sin su permiso y el organismo de contratos de la FIA les dio la razón a él y a McLaren.",
        "Debutó en 2023 y ese mismo año ganó el sprint de Catar; su primera victoria en un Gran Premio llegó en Hungría 2024. En 2025 lideró el campeonato durante buena parte del año y peleó por el título con Norris hasta la última carrera, aunque terminó tercero.",
      ],
    },
    en: {
      tagline: "Champion in every series he raced on his way to F1.",
      born: "Melbourne, Australia",
      text: [
        "He won the Formula Renault Eurocup in 2019, Formula 3 in 2020 and Formula 2 in 2021, each at the first attempt. Even so he spent 2022 without a seat, as Alpine's reserve, and that summer found himself in a saga: Alpine announced him without his consent and the FIA's contract board ruled in favour of him and McLaren.",
        "He made his debut in 2023 and won the Qatar sprint that same year; his first Grand Prix victory came in Hungary 2024. In 2025 he led the championship for much of the year and fought Norris for the title until the final race, eventually finishing third.",
      ],
    },
  },

  // ---------- Aston Martin ----------
  alonso: {
    es: {
      tagline: "Bicampeón del mundo y el piloto con más carreras de la historia.",
      born: "Oviedo, España",
      text: [
        "Campeón del mundo de karting en categoría júnior, debutó con Minardi en 2001 con 19 años y en 2003, en Hungría, se convirtió en el ganador más joven de la historia hasta entonces. Con Renault acabó con el reinado de Michael Schumacher y se proclamó campeón en 2005 y 2006.",
        "Después pasó por McLaren, por Ferrari —con el que rozó el título en 2010 y 2012— y otra vez por McLaren. En su pausa de la F1 ganó dos veces las 24 Horas de Le Mans con Toyota y corrió las 500 Millas de Indianápolis y el Dakar. Volvió en 2021 con Alpine y desde 2023 pilota para Aston Martin, con el que sumó ocho podios en su primer año, pasados los 40.",
      ],
    },
    en: {
      tagline: "Two-time world champion and the driver with the most starts in history.",
      born: "Oviedo, Spain",
      text: [
        "A junior world karting champion, he made his debut with Minardi in 2001 aged 19 and in 2003, in Hungary, became the youngest race winner in history at the time. With Renault he ended Michael Schumacher's reign and was crowned champion in 2005 and 2006.",
        "He then drove for McLaren, for Ferrari —coming close to the title in 2010 and 2012— and McLaren again. During his break from F1 he won the 24 Hours of Le Mans twice with Toyota and raced the Indianapolis 500 and the Dakar. He returned in 2021 with Alpine and has driven for Aston Martin since 2023, scoring eight podiums in his first year there, past the age of 40.",
      ],
    },
  },
  stroll: {
    es: {
      tagline: "El canadiense del podio de Bakú y la pole bajo el diluvio de Estambul.",
      born: "Montreal, Canadá",
      text: [
        "Campeón de la Fórmula 4 italiana en 2014 y de la Fórmula 3 europea en 2016, debutó con Williams en 2017 y ese mismo año subió al podio en Bakú con 18 años, el novato más joven en lograrlo.",
        "Su padre, Lawrence Stroll, compró Force India en 2018 y la convirtió en Racing Point y después en Aston Martin, el equipo en el que corre desde entonces. En 2020 logró la pole en el Gran Premio de Turquía bajo un diluvio, y en 2023 se presentó a la primera carrera con las muñecas todavía lesionadas por un accidente en bicicleta.",
      ],
    },
    en: {
      tagline: "The Canadian of the Baku podium and the pole in the Istanbul downpour.",
      born: "Montreal, Canada",
      text: [
        "Italian Formula 4 champion in 2014 and European Formula 3 champion in 2016, he made his debut with Williams in 2017 and reached the podium in Baku that same year aged 18, the youngest rookie to do so.",
        "His father, Lawrence Stroll, bought Force India in 2018 and turned it into Racing Point and later Aston Martin, the team he has raced for ever since. In 2020 he took pole for the Turkish Grand Prix in a downpour, and in 2023 he lined up for the opening race with both wrists still injured from a cycling accident.",
      ],
    },
  },

  // ---------- Williams ----------
  albon: {
    es: {
      tagline: "El tailandés que reconstruyó su carrera en Williams.",
      born: "Londres, Inglaterra",
      text: [
        "Nació en Londres, hijo del expiloto de turismos Nigel Albon y de madre tailandesa, y compite con licencia de Tailandia. Fue tercero en la Fórmula 2 de 2018 y debutó en 2019 con Toro Rosso; a mitad de ese año Red Bull lo subió al equipo principal, con el que logró dos podios en 2020.",
        "Se quedó sin asiento en 2021 y lo aprovechó como reserva de Red Bull y piloto del DTM. Williams le dio una segunda oportunidad en 2022 y desde entonces es uno de sus pilares: sus actuaciones con un coche limitado le valieron fama de ser uno de los pilotos más completos de la parrilla.",
      ],
    },
    en: {
      tagline: "The Thai driver who rebuilt his career at Williams.",
      born: "London, England",
      text: [
        "Born in London to former touring car driver Nigel Albon and a Thai mother, he races under a Thai licence. He was third in the 2018 Formula 2 championship and made his debut in 2019 with Toro Rosso; mid-season Red Bull promoted him to the senior team, where he scored two podiums in 2020.",
        "Left without a seat in 2021, he spent the year as Red Bull's reserve and racing in the DTM. Williams gave him a second chance in 2022 and he has been one of the team's pillars ever since: his performances in a limited car earned him a reputation as one of the most complete drivers on the grid.",
      ],
    },
  },
  sainz: {
    es: {
      tagline: "El «Smooth Operator», hijo de una leyenda de los rallies.",
      born: "Madrid, España",
      text: [
        "Hijo de Carlos Sainz, bicampeón del mundo de rallies y ganador del Dakar, se proclamó campeón de la Fórmula Renault 3.5 en 2014 y debutó con Toro Rosso en 2015, con Max Verstappen de compañero. Pasó por Renault y por McLaren, donde logró su primer podio en Brasil 2019, antes de fichar por Ferrari en 2021.",
        "Con Ferrari ganó en Silverstone 2022, en Singapur 2023 —la única carrera de ese año que no ganó Red Bull—, en Australia 2024, dos semanas después de ser operado de apendicitis, y en México ese mismo año. En 2025 fichó por Williams y devolvió al equipo al podio en Bakú.",
      ],
    },
    en: {
      tagline: "The “Smooth Operator”, son of a rally legend.",
      born: "Madrid, Spain",
      text: [
        "The son of Carlos Sainz, two-time world rally champion and Dakar winner, he won Formula Renault 3.5 in 2014 and made his debut with Toro Rosso in 2015, with Max Verstappen as his team-mate. He drove for Renault and McLaren, where he took his first podium in Brazil 2019, before joining Ferrari in 2021.",
        "With Ferrari he won at Silverstone in 2022, in Singapore in 2023 —the only race that year not won by Red Bull—, in Australia in 2024, two weeks after appendix surgery, and in Mexico that same year. In 2025 he moved to Williams and brought the team back to the podium in Baku.",
      ],
    },
  },

  // ---------- Alpine ----------
  gasly: {
    es: {
      tagline: "El ganador inesperado de Monza 2020.",
      born: "Ruan, Francia",
      text: [
        "Campeón de GP2 en 2016, esperó su oportunidad en la Super Fórmula japonesa y debutó con Toro Rosso en Malasia 2017. En 2019 subió a Red Bull, pero tras doce carreras lo devolvieron al equipo filial; meses después respondió con un segundo puesto en Brasil.",
        "En 2020 ganó con AlphaTauri en Monza, una de las victorias más inesperadas de los últimos tiempos. Desde 2023 corre con Alpine, el equipo de su país.",
      ],
    },
    en: {
      tagline: "The surprise winner of Monza 2020.",
      born: "Rouen, France",
      text: [
        "GP2 champion in 2016, he bided his time in Japan's Super Formula and made his debut with Toro Rosso in Malaysia 2017. In 2019 he was promoted to Red Bull, but after twelve races he was sent back to the junior team; months later he answered with second place in Brazil.",
        "In 2020 he won with AlphaTauri at Monza, one of the most unexpected victories in recent memory. Since 2023 he has raced for Alpine, his home team.",
      ],
    },
  },
  colapinto: {
    es: {
      tagline: "El argentino que devolvió a su país a la Fórmula 1.",
      text: [
        "Se fue a Europa siendo un adolescente para correr en monoplazas y llegó a la Fórmula 2 en 2024 como piloto de la academia de Williams. A mitad de ese año Williams lo subió a la F1 en lugar de Logan Sargeant: debutó en Monza y en su segunda carrera, en Bakú, ya sumó puntos.",
        "Fue el primer argentino en la F1 desde Gastón Mazzacane en 2001 y desató una pasión enorme en su país. En 2025 pasó a Alpine, primero como reserva y desde Imola como titular.",
      ],
    },
    en: {
      tagline: "The Argentine who brought his country back to Formula 1.",
      text: [
        "He moved to Europe as a teenager to race single-seaters and reached Formula 2 in 2024 as a Williams academy driver. Mid-season Williams promoted him to F1 in place of Logan Sargeant: he made his debut at Monza and scored points in Baku in only his second race.",
        "He was the first Argentine in F1 since Gastón Mazzacane in 2001 and sparked huge enthusiasm back home. In 2025 he moved to Alpine, first as reserve and from Imola onwards as a race driver.",
      ],
    },
  },

  // ---------- Haas ----------
  ocon: {
    es: {
      tagline: "El francés que llegó a la F1 gracias al sacrificio de su familia.",
      born: "Évreux, Francia",
      text: [
        "Su familia vendió su casa y vivió en una caravana para pagar sus inicios en el karting. Campeón de la Fórmula 3 europea en 2014 —por delante de Max Verstappen— y de GP3 en 2015, debutó con Manor a mitad de 2016 y después corrió con Force India.",
        "Tras un año fuera como reserva de Mercedes, volvió en 2020 con Renault, que se convertiría en Alpine, y en 2021 ganó el caótico Gran Premio de Hungría. Desde 2025 corre con Haas.",
      ],
    },
    en: {
      tagline: "The Frenchman who reached F1 thanks to his family's sacrifices.",
      born: "Évreux, France",
      text: [
        "His family sold their house and lived in a caravan to fund his early karting. European Formula 3 champion in 2014 —ahead of Max Verstappen— and GP3 champion in 2015, he made his debut with Manor midway through 2016 and went on to race for Force India.",
        "After a year out as Mercedes' reserve, he returned in 2020 with Renault, which became Alpine, and in 2021 won a chaotic Hungarian Grand Prix. He has raced for Haas since 2025.",
      ],
    },
  },
  bearman: {
    es: {
      tagline: "Debutó con Ferrari a los 18 años, sin previo aviso.",
      born: "Chelmsford, Inglaterra",
      text: [
        "Miembro de la Academia de Pilotos de Ferrari, fue campeón de la Fórmula 4 italiana y alemana en 2021. En 2024, mientras corría la Fórmula 2, Ferrari lo llamó en Yeda para sustituir a Carlos Sainz, operado de apendicitis: con 18 años y casi sin preparación terminó séptimo y sumó puntos.",
        "Ese mismo año sustituyó dos veces a Kevin Magnussen en Haas, y en 2025 se convirtió en titular del equipo estadounidense.",
      ],
    },
    en: {
      tagline: "Made his debut for Ferrari at 18, with no warning.",
      born: "Chelmsford, England",
      text: [
        "A member of the Ferrari Driver Academy, he won both the Italian and German Formula 4 titles in 2021. In 2024, while racing in Formula 2, Ferrari called him up in Jeddah to replace Carlos Sainz, who needed appendix surgery: aged 18 and with almost no preparation, he finished seventh and scored points.",
        "That same year he stood in twice for Kevin Magnussen at Haas, and in 2025 he became a full-time driver for the American team.",
      ],
    },
  },

  // ---------- Audi ----------
  hulkenberg: {
    es: {
      tagline: "«Hulk», el veterano que esperó más de 230 carreras para subir al podio.",
      born: "Emmerich am Rhein, Alemania",
      text: [
        "Campeón de GP2 en 2009 en su primer año, debutó con Williams en 2010 y ese mismo año logró la pole bajo la lluvia en Brasil. Pasó por Force India, Sauber, Renault y Haas y, como sustituto, por Racing Point y Aston Martin, siempre con fama de piloto rápido y fiable.",
        "En 2015 ganó las 24 Horas de Le Mans con Porsche en su primer intento. En la F1, en cambio, el podio se le resistió durante años —tenía el récord de más carreras sin pisarlo— hasta que en 2025 terminó tercero en Silverstone con Sauber. En 2026 sigue en el equipo, ya convertido en Audi.",
      ],
    },
    en: {
      tagline: "“Hulk”, the veteran who waited more than 230 races for a podium.",
      born: "Emmerich am Rhein, Germany",
      text: [
        "GP2 champion at his first attempt in 2009, he made his debut with Williams in 2010 and took pole in the wet in Brazil that same year. He went on to drive for Force India, Sauber, Renault and Haas and, as a stand-in, for Racing Point and Aston Martin, always rated as fast and dependable.",
        "In 2015 he won the 24 Hours of Le Mans with Porsche at the first attempt. In F1, though, a podium eluded him for years —he held the record for most starts without one— until he finished third at Silverstone with Sauber in 2025. In 2026 he remains with the team, now Audi.",
      ],
    },
  },
  bortoleto: {
    es: {
      tagline: "Campeón de Fórmula 3 y de Fórmula 2 en años seguidos, las dos como novato.",
      text: [
        "El brasileño ganó la Fórmula 3 en 2023 y la Fórmula 2 en 2024, en ambos casos en su temporada de debut, algo que antes solo habían logrado pilotos como Charles Leclerc, George Russell u Oscar Piastri. Lo representa la empresa de Fernando Alonso.",
        "Debutó en 2025 con Sauber, como el primer brasileño titular en la F1 desde Felipe Massa en 2017. En 2026 sigue en el equipo, que pasó a ser Audi.",
      ],
    },
    en: {
      tagline: "Formula 3 and Formula 2 champion in consecutive years, both as a rookie.",
      text: [
        "The Brazilian won Formula 3 in 2023 and Formula 2 in 2024, each in his debut season, a feat previously achieved by the likes of Charles Leclerc, George Russell and Oscar Piastri. He is managed by Fernando Alonso's company.",
        "He made his debut in 2025 with Sauber, the first full-time Brazilian driver in F1 since Felipe Massa in 2017. In 2026 he remains with the team, now Audi.",
      ],
    },
  },

  // ---------- Cadillac ----------
  perez: {
    es: {
      tagline: "«Checo», el piloto mexicano con más éxitos de la historia.",
      born: "Guadalajara, México",
      text: [
        "Debutó con Sauber en 2011 y en 2012 ya rozó la victoria en Malasia. Tras un año en McLaren, en Force India —después Racing Point— se ganó fama de maestro en cuidar los neumáticos, y en Sakhir 2020 logró su primera victoria tras caer al último puesto en la primera vuelta.",
        "Aquel triunfo le valió el fichaje por Red Bull, con el que ganó cinco carreras —entre ellas Mónaco 2022— y fue clave en el título de Max Verstappen en Abu Dabi 2021, cuando contuvo a Hamilton y se ganó el apodo de «ministro de Defensa». Tras un año fuera de la parrilla, volvió en 2026 con Cadillac, el nuevo equipo estadounidense.",
      ],
    },
    en: {
      tagline: "“Checo”, the most successful Mexican driver in history.",
      born: "Guadalajara, Mexico",
      text: [
        "He made his debut with Sauber in 2011 and came close to winning in Malaysia in 2012. After a year at McLaren, at Force India —later Racing Point— he became known as a master of tyre management, and at Sakhir 2020 he took his first win after dropping to last on the opening lap.",
        "That victory earned him a Red Bull seat, where he won five races —Monaco 2022 among them— and played a key part in Max Verstappen's title at Abu Dhabi 2021, holding up Hamilton and earning the nickname “Minister of Defence”. After a year off the grid, he returned in 2026 with Cadillac, the new American team.",
      ],
    },
  },
  bottas: {
    es: {
      tagline: "El finlandés que acompañó a Hamilton en los años dorados de Mercedes.",
      born: "Nastola, Finlandia",
      text: [
        "Campeón de GP3 en 2011, debutó con Williams en 2013 y en 2014 subió seis veces al podio. En 2017 sustituyó al recién retirado Nico Rosberg en Mercedes y ese mismo año ganó en Rusia.",
        "En cinco temporadas con Mercedes sumó diez victorias y dos subcampeonatos mientras el equipo ganaba todos los títulos de constructores. Después corrió tres años con Alfa Romeo y Sauber, pasó 2025 como reserva de Mercedes y en 2026 volvió a la parrilla con Cadillac.",
      ],
    },
    en: {
      tagline: "The Finn who partnered Hamilton through Mercedes' golden years.",
      born: "Nastola, Finland",
      text: [
        "GP3 champion in 2011, he made his debut with Williams in 2013 and stood on the podium six times in 2014. In 2017 he replaced the newly retired Nico Rosberg at Mercedes and won in Russia that same year.",
        "In five seasons with Mercedes he took ten wins and two runner-up finishes while the team won every constructors' title. He then spent three years with Alfa Romeo and Sauber, 2025 as Mercedes' reserve, and in 2026 returned to the grid with Cadillac.",
      ],
    },
  },
};

export function driverStory(driverId: string, locale: string): DriverStory | undefined {
  return STORIES[driverId]?.[locale === "en" ? "en" : "es"];
}
