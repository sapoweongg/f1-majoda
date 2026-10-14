// Descripciones de los pilotos (es / en) para sus fichas. Como las de los equipos, son textos de
// historia: las cifras que cambian (victorias, poles, puntos) y los hitos (debut, primer podio, primera
// victoria) los calcula la ficha con datos de Jolpica, así que aquí solo van hechos cerrados.
// Por ahora: la parrilla de 2026, todos los campeones del mundo y 65 pilotos destacados sin título.

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
        "A finales de 2024 volvió a ocupar el coche de Ricciardo y en 2025 Red Bull lo ascendió al equipo principal, pero tras solo dos carreras lo devolvió a Racing Bulls. Lejos de hundirse, siguió puntuando, y en 2026 es el piloto con más experiencia del equipo de Faenza. Ese año volvió a subir a Red Bull durante tres carreras para cubrir la lesión de Isack Hadjar.",
      ],
    },
    en: {
      tagline: "The New Zealander who earned his seat as a stand-in.",
      born: "Hastings, New Zealand",
      text: [
        "Champion of his home Toyota Racing Series in 2019, he took an unusual route: Formula 3, Formula 2, the German DTM with Ferrari (runner-up in 2021) and Japan's Super Formula. He made his debut in 2023 at Zandvoort, standing in for Daniel Ricciardo, who had broken his hand, and scored points in Singapore in only his third race.",
        "In late 2024 he took over Ricciardo's car again and in 2025 Red Bull promoted him to the senior team, only to send him back to Racing Bulls after two races. Far from sinking, he kept scoring, and in 2026 he is the more experienced driver at the Faenza team. That year he stepped up to Red Bull again for three races while Isack Hadjar was injured.",
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

Object.assign(STORIES, {
  // ---------- Campeones del mundo (por orden de su primer título) ----------
  farina: {
    es: {
      tagline: "El primer campeón del mundo de la historia de la F1.",
      born: "Turín, Italia",
      text: [
        "Doctor universitario y sobrino de Battista «Pinin» Farina, el fundador de la carrocera Pininfarina, aprendió el oficio junto a Tazio Nuvolari en los años 30. En 1950, con 43 años, ganó la primera carrera del Mundial, en Silverstone, y se llevó el primer título de la historia con el Alfa Romeo 158, por delante de su compañero Juan Manuel Fangio.",
        "Conducía con los brazos estirados, un estilo que imitarían muchos después, y siguió en la F1 con Ferrari hasta 1955. Murió en 1966 en un accidente de carretera cuando iba a ver el Gran Premio de Francia.",
      ],
    },
    en: {
      tagline: "The first world champion in F1 history.",
      born: "Turin, Italy",
      text: [
        "A university doctor and nephew of Battista “Pinin” Farina, founder of the Pininfarina coachbuilder, he learned his craft alongside Tazio Nuvolari in the 1930s. In 1950, aged 43, he won the first ever world championship race at Silverstone and took the first title in history in the Alfa Romeo 158, ahead of team-mate Juan Manuel Fangio.",
        "He drove with his arms outstretched, a style many would later copy, and raced on in F1 with Ferrari until 1955. He died in 1966 in a road accident on his way to the French Grand Prix.",
      ],
    },
  },
  fangio: {
    es: {
      tagline: "«El Maestro»: cinco títulos con cuatro equipos distintos.",
      born: "Balcarce, Argentina",
      text: [
        "Mecánico de oficio, se hizo un nombre en las carreras de turismo de carretera por los caminos de Sudamérica y debutó en el Mundial en 1950, con 38 años. Ganó su primer título con Alfa Romeo en 1951 y, entre 1954 y 1957, cuatro más seguidos con Maserati, Mercedes y Ferrari: cinco campeonatos, un récord que duró casi medio siglo.",
        "Ganó 24 de las 51 carreras del Mundial que disputó, una proporción que nadie ha igualado. Su obra maestra fue Nürburgring 1957: tras una parada lenta salió casi un minuto por detrás de los Ferrari y los alcanzó batiendo una y otra vez el récord de la vuelta. Se retiró en 1958 y sigue siendo una leyenda en Argentina.",
      ],
    },
    en: {
      tagline: "“El Maestro”: five titles with four different teams.",
      born: "Balcarce, Argentina",
      text: [
        "A mechanic by trade, he made his name in long-distance road races across South America and made his world championship debut in 1950, aged 38. He won his first title with Alfa Romeo in 1951 and, between 1954 and 1957, four more in a row with Maserati, Mercedes and Ferrari: five championships, a record that stood for almost half a century.",
        "He won 24 of the 51 world championship races he started, a strike rate nobody has matched. His masterpiece was the Nürburgring in 1957: after a slow pit stop he rejoined almost a minute behind the Ferraris and caught them by breaking the lap record again and again. He retired in 1958 and remains a legend in Argentina.",
      ],
    },
  },
  ascari: {
    es: {
      tagline: "El primer gran campeón de Ferrari y el último italiano en ganar el título.",
      born: "Milán, Italia",
      text: [
        "Hijo de Antonio Ascari, piloto de Alfa Romeo que murió en carrera cuando Alberto tenía siete años, fue el primer gran campeón de Ferrari: ganó los títulos de 1952 y 1953 y nueve carreras del Mundial seguidas, una racha que nadie superó hasta 2023.",
        "En 1955 cayó al mar del puerto de Mónaco con su Lancia y salió nadando; cuatro días después murió probando un Ferrari deportivo en Monza. Sigue siendo el último italiano campeón del mundo de F1.",
      ],
    },
    en: {
      tagline: "Ferrari's first great champion and the last Italian to win the title.",
      born: "Milan, Italy",
      text: [
        "The son of Antonio Ascari, an Alfa Romeo driver killed in a race when Alberto was seven, he was Ferrari's first great champion: he won the 1952 and 1953 titles and nine world championship races in a row, a streak nobody beat until 2023.",
        "In 1955 he crashed his Lancia into Monaco harbour and swam to safety; four days later he was killed testing a Ferrari sports car at Monza. He is still the last Italian Formula 1 world champion.",
      ],
    },
  },
  hawthorn: {
    es: {
      tagline: "El primer británico campeón del mundo.",
      born: "Mexborough, Inglaterra",
      text: [
        "Inconfundible por su pajarita y su estilo despreocupado, ganó su primer Gran Premio en Francia en 1953 tras un duelo rueda a rueda con Fangio que se recuerda como una de las grandes carreras de los años 50.",
        "En 1958 se proclamó campeón con Ferrari por un solo punto sobre Stirling Moss, que incluso había declarado a su favor ante los comisarios en Portugal. Afectado por la muerte de su compañero y amigo Peter Collins, se retiró a final de año, y murió en un accidente de tráfico en enero de 1959.",
      ],
    },
    en: {
      tagline: "Britain's first world champion.",
      born: "Mexborough, England",
      text: [
        "Unmistakable with his bow tie and carefree style, he won his first Grand Prix in France in 1953 after a wheel-to-wheel duel with Fangio remembered as one of the great races of the 1950s.",
        "In 1958 he was crowned champion with Ferrari by a single point from Stirling Moss, who had even spoken up for him in front of the stewards in Portugal. Shaken by the death of his team-mate and friend Peter Collins, he retired at the end of the year, and died in a road accident in January 1959.",
      ],
    },
  },
  jack_brabham: {
    es: {
      tagline: "El único campeón del mundo con un coche de su propia marca.",
      born: "Hurstville, Australia",
      text: [
        "Mecánico de aviones durante la guerra, llegó a Europa en los años 50 y con Cooper encabezó la revolución del motor trasero: campeón en 1959 y 1960. En la última carrera de 1959, en Sebring, se quedó sin gasolina y empujó su coche hasta la meta.",
        "En 1962 empezó a correr con su propio equipo, creado con Ron Tauranac, y en 1966 ganó su tercer título con un Brabham-Repco: sigue siendo el único campeón al volante de un coche que lleva su nombre. Fue nombrado sir en 1979.",
      ],
    },
    en: {
      tagline: "The only world champion in a car bearing his own name.",
      born: "Hurstville, Australia",
      text: [
        "An aircraft mechanic during the war, he came to Europe in the 1950s and led the rear-engine revolution with Cooper: champion in 1959 and 1960. At the final race of 1959, at Sebring, he ran out of fuel and pushed his car to the finish.",
        "In 1962 he began racing his own team, set up with Ron Tauranac, and in 1966 won his third title in a Brabham-Repco: he remains the only champion to win in a car bearing his own name. He was knighted in 1979.",
      ],
    },
  },
  phil_hill: {
    es: {
      tagline: "El primer estadounidense campeón del mundo.",
      born: "Miami, Estados Unidos",
      text: [
        "Gran especialista en resistencia, ganó tres veces las 24 Horas de Le Mans. Debutó en la F1 en 1958 y en 1960 ganó con Ferrari en Monza, la última victoria en el Mundial de un coche con el motor delante.",
        "En 1961 se proclamó campeón con el Ferrari «nariz de tiburón» en el peor día posible: el Gran Premio de Italia en el que murió su compañero y rival por el título, Wolfgang von Trips. Tras retirarse se dedicó a restaurar coches clásicos y a escribir sobre automovilismo.",
      ],
    },
    en: {
      tagline: "America's first world champion.",
      born: "Miami, United States",
      text: [
        "A great endurance specialist, he won the 24 Hours of Le Mans three times. He made his F1 debut in 1958 and in 1960 won with Ferrari at Monza, the last world championship victory for a front-engined car.",
        "In 1961 he clinched the title in the “sharknose” Ferrari on the worst possible day: the Italian Grand Prix in which his team-mate and title rival, Wolfgang von Trips, was killed. After retiring he devoted himself to restoring classic cars and writing about motorsport.",
      ],
    },
  },
  hill: {
    es: {
      tagline: "El único piloto que ha ganado en Mónaco, en Indianápolis y en Le Mans.",
      born: "Londres, Inglaterra",
      text: [
        "No se sacó el carné de conducir hasta los 24 años y entró en el automovilismo como mecánico de Lotus. Fue campeón en 1962 con BRM y en 1968 con Lotus, cuando sacó adelante al equipo tras la muerte de Jim Clark. Ganó cinco veces en Mónaco, lo que le valió el apodo de «Mr. Monaco».",
        "Además ganó las 500 Millas de Indianápolis en 1966 y las 24 Horas de Le Mans en 1972. Fundó su propio equipo, Embassy Hill, y murió en 1975 al estrellarse la avioneta que pilotaba. Su hijo Damon fue campeón en 1996: son el primer padre e hijo campeones del mundo.",
      ],
    },
    en: {
      tagline: "The only driver to have won at Monaco, Indianapolis and Le Mans.",
      born: "London, England",
      text: [
        "He didn't pass his driving test until he was 24 and got into motorsport as a Lotus mechanic. He was champion in 1962 with BRM and in 1968 with Lotus, when he held the team together after Jim Clark's death. He won five times at Monaco, earning the nickname “Mr. Monaco”.",
        "He also won the Indianapolis 500 in 1966 and the 24 Hours of Le Mans in 1972. He founded his own team, Embassy Hill, and died in 1975 when the light aircraft he was flying crashed. His son Damon became champion in 1996: they were the first father and son to both win the world title.",
      ],
    },
  },
  clark: {
    es: {
      tagline: "Para muchos, el piloto con más talento natural de la historia.",
      born: "Kilmany, Escocia",
      text: [
        "Hijo de granjeros escoceses, formó con Colin Chapman y Lotus una de las parejas más exitosas de la F1: campeón en 1963, con siete victorias en diez carreras, y en 1965, el año en que además ganó las 500 Millas de Indianápolis.",
        "Ganaba con una suavidad que parecía no costarle esfuerzo, muchas veces desde la pole y liderando de principio a fin. Murió en abril de 1968 en una carrera de Fórmula 2 en Hockenheim; en ese momento tenía los récords de victorias y de poles.",
      ],
    },
    en: {
      tagline: "For many, the most naturally gifted driver in history.",
      born: "Kilmany, Scotland",
      text: [
        "The son of Scottish farmers, he formed one of F1's most successful partnerships with Colin Chapman and Lotus: champion in 1963, with seven wins from ten races, and in 1965, the year he also won the Indianapolis 500.",
        "He won with a smoothness that looked effortless, often from pole and leading from start to finish. He was killed in April 1968 in a Formula 2 race at Hockenheim; at the time he held the records for wins and pole positions.",
      ],
    },
  },
  surtees: {
    es: {
      tagline: "El único campeón del mundo sobre dos y cuatro ruedas.",
      born: "Tatsfield, Inglaterra",
      text: [
        "Antes de pasarse a los coches ganó siete títulos mundiales de motociclismo con MV Agusta, en 350 y 500 cc. Debutó en la F1 en 1960 y en 1964 se proclamó campeón con Ferrari en la última carrera, en México.",
        "Su etapa en Ferrari terminó de golpe en 1966, tras un enfrentamiento con el director del equipo. Después corrió con Cooper, Honda y BRM y en los años 70 fundó su propio equipo, Surtees.",
      ],
    },
    en: {
      tagline: "The only world champion on two wheels and four.",
      born: "Tatsfield, England",
      text: [
        "Before switching to cars he won seven motorcycle world titles with MV Agusta, in the 350 and 500 cc classes. He made his F1 debut in 1960 and in 1964 was crowned champion with Ferrari at the final race in Mexico.",
        "His time at Ferrari ended abruptly in 1966 after a clash with the team manager. He went on to drive for Cooper, Honda and BRM and in the 1970s set up his own team, Surtees.",
      ],
    },
  },
  hulme: {
    es: {
      tagline: "«El Oso», el neozelandés campeón de 1967.",
      born: "Motueka, Nueva Zelanda",
      text: [
        "Llegó a Europa gracias al programa «Driver to Europe» de Nueva Zelanda y empezó trabajando como mecánico en el taller de Jack Brabham. En 1967 se proclamó campeón con el equipo de su jefe, por delante del propio Brabham.",
        "Después se unió a su compatriota Bruce McLaren, con quien dominó la Can-Am norteamericana, y siguió en la F1 con McLaren hasta 1974. Murió en 1992 de un ataque al corazón mientras corría los 1000 km de Bathurst, en Australia.",
      ],
    },
    en: {
      tagline: "“The Bear”, the New Zealander who won the 1967 title.",
      born: "Motueka, New Zealand",
      text: [
        "He reached Europe through New Zealand's “Driver to Europe” scheme and started out as a mechanic in Jack Brabham's workshop. In 1967 he was crowned champion with his boss's team, ahead of Brabham himself.",
        "He then joined compatriot Bruce McLaren, with whom he dominated the North American Can-Am series, and raced in F1 for McLaren until 1974. He died in 1992 of a heart attack while racing in the Bathurst 1000 in Australia.",
      ],
    },
  },
  stewart: {
    es: {
      tagline: "El «Escocés Volador», que cambió para siempre la seguridad de la F1.",
      born: "Milton, Escocia",
      text: [
        "Disléxico —no lo supo hasta los 41 años— y gran tirador al plato en su juventud, debutó en la F1 con BRM en 1965 y ganó en Monza en su primera temporada. Con Ken Tyrrell fue campeón en 1969, 1971 y 1973, y se retiró ese mismo año con el récord de victorias.",
        "Su accidente en Spa en 1966, en el que quedó atrapado en el coche empapado de gasolina, lo convirtió en el gran defensor de la seguridad: impulsó barreras, cinturones, cascos integrales y servicios médicos en los circuitos. Años después fundó el equipo Stewart, que acabaría convirtiéndose en Red Bull.",
      ],
    },
    en: {
      tagline: "The “Flying Scot”, who changed F1 safety forever.",
      born: "Milton, Scotland",
      text: [
        "Dyslexic —he only found out at 41— and a fine clay pigeon shot in his youth, he made his F1 debut with BRM in 1965 and won at Monza in his first season. With Ken Tyrrell he was champion in 1969, 1971 and 1973, retiring that same year with the record for most wins.",
        "His 1966 crash at Spa, where he was trapped in a car soaked in fuel, made him the great champion of safety: he pushed for barriers, seat belts, full-face helmets and proper medical services at circuits. Years later he founded the Stewart team, which would eventually become Red Bull.",
      ],
    },
  },
  rindt: {
    es: {
      tagline: "El único campeón a título póstumo de la historia.",
      born: "Maguncia, Alemania",
      text: [
        "Nació en Alemania, pero tras la muerte de sus padres en un bombardeo durante la guerra se crio con sus abuelos en Graz y corrió con licencia austriaca. Famoso por llevar el coche siempre al límite, ganó su primera carrera con Lotus en Watkins Glen en 1969.",
        "En 1970, con el revolucionario Lotus 72, ganó cinco carreras, cuatro de ellas seguidas. Murió en los entrenamientos de Monza en septiembre de ese año y nadie superó sus puntos en las carreras que quedaban: es el único campeón póstumo de la F1.",
      ],
    },
    en: {
      tagline: "The only posthumous world champion in history.",
      born: "Mainz, Germany",
      text: [
        "Born in Germany, he was raised by his grandparents in Graz after his parents were killed in a wartime bombing raid, and raced under an Austrian licence. Famous for driving on the very limit, he won his first race with Lotus at Watkins Glen in 1969.",
        "In 1970, with the revolutionary Lotus 72, he won five races, four of them in a row. He was killed in practice at Monza that September and nobody overtook his points total in the remaining races: he is F1's only posthumous champion.",
      ],
    },
  },
  emerson_fittipaldi: {
    es: {
      tagline: "El primer brasileño campeón del mundo, y durante 33 años el más joven.",
      born: "São Paulo, Brasil",
      text: [
        "Llegó a Europa en 1969 y al año siguiente ya debutaba con Lotus; a los pocos meses ganó en Watkins Glen. En 1972, con 25 años, se convirtió en el campeón más joven de la historia, un récord que duró hasta 2005.",
        "Ganó su segundo título en 1974 con McLaren y después se embarcó con su hermano Wilson en el equipo brasileño Fittipaldi, sin éxito. Lejos de la F1 triunfó en Estados Unidos: campeón de la CART en 1989 y dos veces ganador de las 500 Millas de Indianápolis.",
      ],
    },
    en: {
      tagline: "Brazil's first world champion, and for 33 years the youngest.",
      born: "São Paulo, Brazil",
      text: [
        "He arrived in Europe in 1969 and was making his debut with Lotus the following year; within months he had won at Watkins Glen. In 1972, aged 25, he became the youngest champion in history, a record that stood until 2005.",
        "He won his second title in 1974 with McLaren and then embarked on the Brazilian Fittipaldi team with his brother Wilson, without success. Away from F1 he triumphed in the United States: CART champion in 1989 and a two-time Indianapolis 500 winner.",
      ],
    },
  },
  lauda: {
    es: {
      tagline: "Tres veces campeón y protagonista de una de las grandes remontadas del deporte.",
      born: "Viena, Austria",
      text: [
        "Hijo de una familia acomodada que no quería que corriera, pidió un préstamo para pagarse un asiento en March y en BRM. Ferrari lo fichó en 1974 y en 1975 le dio al equipo su primer título en once años.",
        "En agosto de 1976 sufrió en Nürburgring un accidente terrible: quedó atrapado en el coche en llamas y llegó a recibir la extremaunción. Solo 42 días después volvió a correr en Monza, y perdió el título por un punto frente a James Hunt. Fue campeón de nuevo en 1977 con Ferrari y en 1984 con McLaren, medio punto por delante de su compañero Alain Prost.",
      ],
    },
    en: {
      tagline: "Three-time champion and the hero of one of sport's great comebacks.",
      born: "Vienna, Austria",
      text: [
        "From a wealthy family that didn't want him to race, he took out a loan to buy drives at March and BRM. Ferrari signed him in 1974 and in 1975 he gave the team its first title in eleven years.",
        "In August 1976 he suffered a horrific crash at the Nürburgring: trapped in his burning car, he was even given the last rites. Just 42 days later he was racing again at Monza, and lost the title to James Hunt by a single point. He was champion again in 1977 with Ferrari and in 1984 with McLaren, half a point ahead of team-mate Alain Prost.",
      ],
    },
  },
  hunt: {
    es: {
      tagline: "El carismático campeón de 1976, rival y amigo de Niki Lauda.",
      born: "Belmont, Inglaterra",
      text: [
        "Le apodaban «Hunt the Shunt» por sus accidentes en las categorías inferiores. Llegó a la F1 con Hesketh, el pequeño equipo del excéntrico lord Hesketh, y con él ganó en Zandvoort en 1975.",
        "En 1976 sustituyó a Emerson Fittipaldi en McLaren y ganó el título en la última carrera, bajo el diluvio de Fuji, por un punto sobre Lauda. Se retiró en 1979, se convirtió en un comentarista muy querido de la BBC y murió de un infarto en 1993, con 45 años.",
      ],
    },
    en: {
      tagline: "The charismatic 1976 champion, rival and friend of Niki Lauda.",
      born: "Belmont, England",
      text: [
        "Nicknamed “Hunt the Shunt” for his accidents in the junior categories, he reached F1 with Hesketh, the small team run by the eccentric Lord Hesketh, and won with them at Zandvoort in 1975.",
        "In 1976 he replaced Emerson Fittipaldi at McLaren and won the title at the final race, in the Fuji downpour, by one point from Lauda. He retired in 1979, became a much-loved BBC commentator and died of a heart attack in 1993, aged 45.",
      ],
    },
  },
  mario_andretti: {
    es: {
      tagline: "Campeón de F1 y ganador de Indianápolis y de Daytona: el más versátil de su época.",
      born: "Montona, Italia (hoy Motovun, Croacia)",
      text: [
        "Nació en Istria, que tras la guerra pasó a Yugoslavia; su familia vivió en un campo de refugiados y emigró a Estados Unidos cuando él tenía 15 años. En su primera carrera de F1, en Watkins Glen 1968, ya salió desde la pole.",
        "Ganó la Daytona 500 en 1967 y las 500 Millas de Indianápolis en 1969, y en 1978 se proclamó campeón de F1 con el Lotus 79 de efecto suelo, en un año marcado por la muerte de su compañero Ronnie Peterson en Monza. Sigue siendo el último estadounidense campeón del mundo; su hijo Michael y su nieto Marco también fueron pilotos.",
      ],
    },
    en: {
      tagline: "F1 champion and winner at Indianapolis and Daytona: the most versatile driver of his era.",
      born: "Montona, Italy (now Motovun, Croatia)",
      text: [
        "He was born in Istria, which became part of Yugoslavia after the war; his family lived in a refugee camp and emigrated to the United States when he was 15. In his very first F1 race, at Watkins Glen in 1968, he started from pole.",
        "He won the Daytona 500 in 1967 and the Indianapolis 500 in 1969, and in 1978 he was crowned F1 champion in the ground-effect Lotus 79, in a year overshadowed by the death of team-mate Ronnie Peterson at Monza. He is still the last American world champion; his son Michael and grandson Marco also became racing drivers.",
      ],
    },
  },
  scheckter: {
    es: {
      tagline: "El campeón de 1979 con Ferrari, el último de Maranello en 21 años.",
      born: "East London, Sudáfrica",
      text: [
        "Agresivo en sus inicios —provocó una enorme colisión múltiple en Silverstone en 1973—, maduró en Tyrrell, con el que ganó en Suecia en 1976 al volante del revolucionario coche de seis ruedas, y en Wolf, con el que ganó en la primera carrera del equipo, en 1977.",
        "En 1979 se proclamó campeón con Ferrari, con Gilles Villeneuve como fiel compañero: Maranello no volvería a tener un campeón de pilotos hasta 2000. Se retiró en 1980 y años después se dedicó a la agricultura ecológica en Inglaterra.",
      ],
    },
    en: {
      tagline: "The 1979 champion with Ferrari, Maranello's last for 21 years.",
      born: "East London, South Africa",
      text: [
        "Wild in his early days —he triggered a huge multi-car pile-up at Silverstone in 1973—, he matured at Tyrrell, winning in Sweden in 1976 in the revolutionary six-wheeled car, and at Wolf, with whom he won the team's very first race in 1977.",
        "In 1979 he was crowned champion with Ferrari, with Gilles Villeneuve as his loyal team-mate: Maranello would not have another drivers' champion until 2000. He retired in 1980 and later turned to organic farming in England.",
      ],
    },
  },
  jones: {
    es: {
      tagline: "El australiano que dio a Williams su primer título.",
      born: "Melbourne, Australia",
      text: [
        "Hijo de Stan Jones, ganador del Gran Premio de Australia en los años 50, ganó su primera carrera de F1 con Shadow en Austria 1977 y al año siguiente fichó por el joven equipo de Frank Williams y Patrick Head.",
        "Duro y directo como el propio equipo, en 1980 le dio a Williams su primer título de pilotos con cinco victorias. Se retiró a final de 1981, aunque volvió brevemente con Arrows en 1983 y con el equipo Haas Lola en 1985 y 1986.",
      ],
    },
    en: {
      tagline: "The Australian who gave Williams its first title.",
      born: "Melbourne, Australia",
      text: [
        "The son of Stan Jones, winner of the Australian Grand Prix in the 1950s, he took his first F1 win with Shadow in Austria in 1977 and the following year joined the young team of Frank Williams and Patrick Head.",
        "As tough and straightforward as the team itself, he gave Williams its first drivers' title in 1980 with five wins. He retired at the end of 1981, though he made brief comebacks with Arrows in 1983 and with the Haas Lola team in 1985 and 1986.",
      ],
    },
  },
  piquet: {
    es: {
      tagline: "Tres veces campeón, con Brabham y con Williams.",
      born: "Río de Janeiro, Brasil",
      text: [
        "Usaba el apellido de soltera de su madre para que su padre, ministro en Brasil, no supiera que corría. Tras ganar la Fórmula 3 británica en 1978, Bernie Ecclestone lo fichó para Brabham, con el que fue campeón en 1981 y en 1983, el primer título con un motor turbo.",
        "En 1987 ganó su tercer campeonato con Williams tras un duro duelo con su compañero Nigel Mansell. Era conocido por su ingenio técnico y por su lengua afilada; su hijo Nelson Piquet Jr. también corrió en la F1.",
      ],
    },
    en: {
      tagline: "Three-time champion, with Brabham and with Williams.",
      born: "Rio de Janeiro, Brazil",
      text: [
        "He raced under his mother's maiden name so that his father, a Brazilian government minister, wouldn't find out. After winning British Formula 3 in 1978 he was signed by Bernie Ecclestone for Brabham, with whom he was champion in 1981 and in 1983, the first title won with a turbo engine.",
        "In 1987 he won his third championship with Williams after a bitter duel with team-mate Nigel Mansell. He was known for his technical flair and his sharp tongue; his son Nelson Piquet Jr. also raced in F1.",
      ],
    },
  },
  keke_rosberg: {
    es: {
      tagline: "El campeón de 1982 con una sola victoria.",
      born: "Solna, Suecia",
      text: [
        "Nacido en Suecia y criado en Finlandia, pasó años en equipos pequeños antes de llegar a Williams en 1982, cuando Alan Jones se retiró de forma inesperada.",
        "En una temporada caótica, con once ganadores distintos, fue el más regular y se llevó el título con una sola victoria, en el Gran Premio de Suiza. En 1985 firmó en Silverstone la vuelta más rápida de la historia hasta entonces, a casi 260 km/h de media. Su hijo Nico fue campeón en 2016.",
      ],
    },
    en: {
      tagline: "The 1982 champion with a single win.",
      born: "Solna, Sweden",
      text: [
        "Born in Sweden and raised in Finland, he spent years with small teams before joining Williams in 1982, when Alan Jones unexpectedly retired.",
        "In a chaotic season with eleven different winners, he was the most consistent and took the title with a single victory, at the Swiss Grand Prix. In 1985 he set the fastest lap in history at the time at Silverstone, averaging almost 260 km/h. His son Nico became champion in 2016.",
      ],
    },
  },
  prost: {
    es: {
      tagline: "«El Profesor»: cuatro títulos a base de inteligencia y cálculo.",
      born: "Lorette, Francia",
      text: [
        "Debutó con McLaren en 1980, ganó sus primeras carreras con Renault y en 1984 volvió a McLaren, con el que fue campeón en 1985, 1986 y 1989. Su forma de pilotar, suave y calculadora, le valió el apodo de «El Profesor».",
        "Su rivalidad con Ayrton Senna, su compañero en McLaren en 1988 y 1989, es la más famosa de la F1, con dos títulos decididos en choques en Suzuka. Tras pasar por Ferrari y tomarse un año sabático, ganó su cuarto título con Williams en 1993 y se retiró. Después dirigió su propio equipo, Prost Grand Prix.",
      ],
    },
    en: {
      tagline: "“The Professor”: four titles built on intelligence and calculation.",
      born: "Lorette, France",
      text: [
        "He made his debut with McLaren in 1980, won his first races with Renault and returned to McLaren in 1984, becoming champion in 1985, 1986 and 1989. His smooth, calculating driving style earned him the nickname “The Professor”.",
        "His rivalry with Ayrton Senna, his McLaren team-mate in 1988 and 1989, is the most famous in F1, with two titles settled by collisions at Suzuka. After a spell at Ferrari and a sabbatical year, he won his fourth title with Williams in 1993 and retired. He later ran his own team, Prost Grand Prix.",
      ],
    },
  },
  senna: {
    es: {
      tagline: "Tres títulos, un talento único bajo la lluvia y un mito que sigue vivo.",
      born: "São Paulo, Brasil",
      text: [
        "Debutó en 1984 con Toleman y ese mismo año estuvo a punto de ganar bajo el diluvio de Mónaco. Ganó por primera vez con Lotus en Estoril en 1985, otra vez con lluvia, y en 1988 fichó por McLaren, con el que fue campeón en 1988, 1990 y 1991.",
        "Su rivalidad con Alain Prost marcó una época y fue el gran especialista a una vuelta de su tiempo. Murió el 1 de mayo de 1994 en el Gran Premio de San Marino, en Imola, y su muerte transformó la seguridad de la F1. En Brasil es un ídolo nacional, y el instituto que lleva su nombre ayuda a millones de niños.",
      ],
    },
    en: {
      tagline: "Three titles, a unique gift in the wet and a legend that lives on.",
      born: "São Paulo, Brazil",
      text: [
        "He made his debut in 1984 with Toleman and that same year came close to winning in the Monaco downpour. He won for the first time with Lotus at Estoril in 1985, again in the rain, and in 1988 joined McLaren, winning the title in 1988, 1990 and 1991.",
        "His rivalry with Alain Prost defined an era and he was the great one-lap specialist of his time. He was killed on 1 May 1994 at the San Marino Grand Prix at Imola, and his death transformed safety in F1. In Brazil he is a national hero, and the institute bearing his name helps millions of children.",
      ],
    },
  },
  mansell: {
    es: {
      tagline: "«Il Leone», el campeón de 1992 que lo daba todo en cada vuelta.",
      born: "Upton-upon-Severn, Inglaterra",
      text: [
        "Vendió casi todo lo que tenía para seguir corriendo y Colin Chapman le dio su oportunidad en Lotus. La primera victoria tardó en llegar, en Brands Hatch en 1985 ya con Williams, pero después se convirtió en uno de los pilotos más rápidos y espectaculares de su época; los tifosi le bautizaron «Il Leone» en su etapa en Ferrari.",
        "Perdió el título de 1986 al reventar un neumático en Adelaida, y en 1992, con el Williams FW14B, arrasó: nueve victorias y campeón en agosto. Al año siguiente ganó la IndyCar en su temporada de debut, el único que ha tenido a la vez los títulos de F1 y de IndyCar.",
      ],
    },
    en: {
      tagline: "“Il Leone”, the 1992 champion who gave everything on every lap.",
      born: "Upton-upon-Severn, England",
      text: [
        "He sold almost everything he owned to keep racing and Colin Chapman gave him his chance at Lotus. His first win was a long time coming, at Brands Hatch in 1985 with Williams, but he then became one of the fastest and most spectacular drivers of his era; the tifosi dubbed him “Il Leone” during his Ferrari years.",
        "He lost the 1986 title when a tyre exploded in Adelaide, and in 1992, in the Williams FW14B, he swept all before him: nine wins and champion by August. The following year he won IndyCar in his debut season, the only driver to hold the F1 and IndyCar titles at the same time.",
      ],
    },
  },
  michael_schumacher: {
    es: {
      tagline: "Siete títulos y la era más dominante de Ferrari.",
      born: "Hürth, Alemania",
      text: [
        "Hijo de un albañil que llevaba un kartódromo, debutó con Jordan en Spa en 1991 y enseguida lo fichó Benetton, con el que ganó su primera carrera, en Spa justo un año después, y los títulos de 1994 y 1995.",
        "En 1996 fichó por una Ferrari que llevaba casi dos décadas sin campeón de pilotos y, junto a Jean Todt y Ross Brawn, la llevó a cinco títulos seguidos entre 2000 y 2004. Se retiró en 2006 con los récords de títulos, victorias y poles, volvió con Mercedes entre 2010 y 2012, y en diciembre de 2013 sufrió un grave accidente de esquí.",
      ],
    },
    en: {
      tagline: "Seven titles and Ferrari's most dominant era.",
      born: "Hürth, Germany",
      text: [
        "The son of a bricklayer who ran a karting track, he made his debut with Jordan at Spa in 1991 and was immediately snapped up by Benetton, with whom he won his first race —at Spa, exactly a year later— and the 1994 and 1995 titles.",
        "In 1996 he joined a Ferrari team that had gone almost two decades without a drivers' champion and, together with Jean Todt and Ross Brawn, led it to five straight titles from 2000 to 2004. He retired in 2006 holding the records for titles, wins and poles, returned with Mercedes from 2010 to 2012, and in December 2013 suffered a serious skiing accident.",
      ],
    },
  },
  damon_hill: {
    es: {
      tagline: "El hijo de Graham Hill que también fue campeón del mundo.",
      born: "Londres, Inglaterra",
      text: [
        "Tenía 15 años cuando su padre murió en un accidente de avioneta, y la familia pasó apuros económicos. Llegó tarde a la F1: fue piloto de pruebas de Williams y debutó con Brabham en 1992.",
        "Ascendido a titular de Williams en 1993, peleó el título de 1994 con Michael Schumacher hasta su polémico choque en Adelaida, y en 1996 se proclamó campeón: con Graham forman la primera pareja de padre e hijo campeones. En 1998 le dio a Jordan su primera victoria, en Spa.",
      ],
    },
    en: {
      tagline: "Graham Hill's son, who also became world champion.",
      born: "London, England",
      text: [
        "He was 15 when his father died in a plane crash, and the family went through financial hardship. He reached F1 late: he was a Williams test driver and made his race debut with Brabham in 1992.",
        "Promoted to a Williams race seat in 1993, he fought Michael Schumacher for the 1994 title until their controversial collision in Adelaide, and in 1996 he was crowned champion: with Graham they were the first father and son to both win the title. In 1998 he gave Jordan its first victory, at Spa.",
      ],
    },
  },
  villeneuve: {
    es: {
      tagline: "Ganó Indianápolis, la IndyCar y el Mundial de F1 en solo tres años.",
      born: "Saint-Jean-sur-Richelieu, Canadá",
      text: [
        "Hijo del legendario Gilles Villeneuve, que murió en Zolder cuando él tenía 11 años, se formó como piloto en Italia y Japón y triunfó en Estados Unidos: en 1995 ganó las 500 Millas de Indianápolis y el campeonato de IndyCar.",
        "Williams lo fichó para 1996 y en su primera carrera hizo la pole y terminó segundo. En 1997 se proclamó campeón tras su choque con Michael Schumacher en Jerez, que le costó al alemán la descalificación de todo el campeonato. Después fue uno de los fundadores del equipo BAR.",
      ],
    },
    en: {
      tagline: "Won Indianapolis, IndyCar and the F1 world title in just three years.",
      born: "Saint-Jean-sur-Richelieu, Canada",
      text: [
        "The son of the legendary Gilles Villeneuve, who was killed at Zolder when Jacques was 11, he learned his craft in Italy and Japan and made his name in the United States: in 1995 he won the Indianapolis 500 and the IndyCar championship.",
        "Williams signed him for 1996 and in his very first race he took pole and finished second. In 1997 he was crowned champion after his collision with Michael Schumacher at Jerez, which saw the German disqualified from the whole championship. He later co-founded the BAR team.",
      ],
    },
  },
  hakkinen: {
    es: {
      tagline: "El «finlandés volador», bicampeón con McLaren.",
      born: "Vantaa, Finlandia",
      text: [
        "Debutó con Lotus en 1991 y fichó por McLaren en 1993. En Adelaida 1995 sufrió un accidente gravísimo en los entrenamientos y los médicos tuvieron que hacerle una traqueotomía en la propia pista; volvió a correr al año siguiente.",
        "Su primera victoria llegó en Jerez en 1997 y abrió dos años brillantes: campeón en 1998 y 1999 con McLaren-Mercedes, en una rivalidad llena de respeto con Michael Schumacher, al que adelantó en Spa 2000 en una de las maniobras más famosas de la F1. Se retiró a finales de 2001.",
      ],
    },
    en: {
      tagline: "The “Flying Finn”, two-time champion with McLaren.",
      born: "Vantaa, Finland",
      text: [
        "He made his debut with Lotus in 1991 and joined McLaren in 1993. In practice at Adelaide in 1995 he suffered a near-fatal crash and doctors had to perform a tracheotomy at the trackside; he was back racing the following year.",
        "His first win came at Jerez in 1997 and opened two brilliant years: champion in 1998 and 1999 with McLaren-Mercedes, in a rivalry full of respect with Michael Schumacher, whom he overtook at Spa in 2000 in one of F1's most famous moves. He retired at the end of 2001.",
      ],
    },
  },
  raikkonen: {
    es: {
      tagline: "«Iceman», campeón con Ferrari en 2007.",
      born: "Espoo, Finlandia",
      text: [
        "Con solo 23 carreras en monoplazas, Sauber lo hizo debutar en 2001 y puntuó en su primera carrera. Al año siguiente fichó por McLaren, con el que fue subcampeón en 2003 y 2005, por detrás de Michael Schumacher y Fernando Alonso.",
        "En 2007, en su primer año con Ferrari, remontó 17 puntos en las dos últimas carreras y se llevó el título por uno sobre Hamilton y Alonso. Famoso por su laconismo y su humor seco («leave me alone, I know what I'm doing»), corrió hasta 2021 y se retiró como el piloto con más carreras disputadas hasta entonces.",
      ],
    },
    en: {
      tagline: "“Iceman”, champion with Ferrari in 2007.",
      born: "Espoo, Finland",
      text: [
        "With just 23 car races behind him, Sauber gave him his debut in 2001 and he scored points first time out. The following year he joined McLaren, finishing runner-up in 2003 and 2005 behind Michael Schumacher and Fernando Alonso.",
        "In 2007, his first year with Ferrari, he overturned a 17-point deficit in the last two races to win the title by one point from Hamilton and Alonso. Famous for his few words and dry humour (“leave me alone, I know what I'm doing”), he raced until 2021 and retired with the most starts of anyone at the time.",
      ],
    },
  },
  button: {
    es: {
      tagline: "El campeón de 2009 con el sorprendente Brawn GP.",
      born: "Frome, Inglaterra",
      text: [
        "Debutó con Williams en 2000, con solo 20 años, y tardó seis temporadas en ganar: lo logró en Hungría 2006 con Honda, bajo la lluvia.",
        "Cuando Honda se retiró a finales de 2008, el equipo renació como Brawn GP y Button ganó seis de las siete primeras carreras de 2009 camino del título. Después pasó siete temporadas en McLaren, donde ganó en Canadá 2011 tras pasar seis veces por boxes y llegar a ir último.",
      ],
    },
    en: {
      tagline: "The 2009 champion with the surprise Brawn GP team.",
      born: "Frome, England",
      text: [
        "He made his debut with Williams in 2000, aged just 20, and took six seasons to win: he finally did so in Hungary in 2006 with Honda, in the rain.",
        "When Honda pulled out at the end of 2008, the team was reborn as Brawn GP and Button won six of the first seven races of 2009 on his way to the title. He then spent seven seasons at McLaren, where he won in Canada in 2011 after six pit stops and running last.",
      ],
    },
  },
  vettel: {
    es: {
      tagline: "Cuatro títulos seguidos con Red Bull, de 2010 a 2013.",
      born: "Heppenheim, Alemania",
      text: [
        "Debutó en 2007 sustituyendo a Robert Kubica en BMW Sauber y puntuó en su primera carrera. En 2008 ganó bajo la lluvia de Monza con Toro Rosso, entonces el ganador más joven de la historia, y en 2009 subió a Red Bull.",
        "Con Red Bull fue campeón cuatro años seguidos, de 2010 a 2013, el último con nueve victorias consecutivas para cerrar la temporada. Después corrió con Ferrari y Aston Martin y se retiró en 2022. Fuera de la pista es conocido por su compromiso con el medio ambiente y por su sentido del humor.",
      ],
    },
    en: {
      tagline: "Four straight titles with Red Bull, from 2010 to 2013.",
      born: "Heppenheim, Germany",
      text: [
        "He made his debut in 2007 standing in for Robert Kubica at BMW Sauber and scored points first time out. In 2008 he won in the wet at Monza with Toro Rosso, the youngest winner in history at the time, and in 2009 moved up to Red Bull.",
        "With Red Bull he was champion four years in a row, from 2010 to 2013, ending the last of them with nine consecutive wins. He then drove for Ferrari and Aston Martin and retired in 2022. Off track he is known for his environmental commitment and his sense of humour.",
      ],
    },
  },
  rosberg: {
    es: {
      tagline: "Campeón en 2016 y retirado cinco días después.",
      born: "Wiesbaden, Alemania",
      text: [
        "Hijo de Keke Rosberg, ganó la GP2 en 2005, su primer año, y debutó con Williams en 2006 marcando la vuelta rápida en su primera carrera. En 2010 fichó por Mercedes y en 2012 le dio a la marca su primera victoria en el Mundial desde 1955, en China.",
        "Su rivalidad con Lewis Hamilton, amigo suyo desde el karting, marcó los años de dominio de Mercedes. En 2016 lo batió por el título y, cinco días después, anunció por sorpresa su retirada. Con Keke forman la segunda pareja de padre e hijo campeones del mundo.",
      ],
    },
    en: {
      tagline: "Champion in 2016 and retired five days later.",
      born: "Wiesbaden, Germany",
      text: [
        "The son of Keke Rosberg, he won GP2 in 2005, his first year, and made his debut with Williams in 2006, setting the fastest lap in his first race. He joined Mercedes in 2010 and in 2012 gave the marque its first world championship win since 1955, in China.",
        "His rivalry with Lewis Hamilton, a friend since their karting days, defined Mercedes' years of dominance. In 2016 he beat him to the title and, five days later, stunned everyone by announcing his retirement. With Keke they are the second father and son to both become world champion.",
      ],
    },
  },
} satisfies Record<string, Record<"es" | "en", DriverStory>>);

Object.assign(STORIES, {
  // ---------- Otros pilotos destacados sin título (por orden de debut) ----------
  moss: {
    es: {
      tagline: "El mejor piloto que nunca fue campeón del mundo.",
      born: "Londres, Inglaterra",
      text: [
        "Debutó en el Mundial en 1951 y durante años prefirió correr con coches británicos antes que con Ferrari. Ganó su primera carrera en 1955, el Gran Premio de Gran Bretaña en Aintree, como compañero de Fangio en Mercedes, y ese mismo año ganó la Mille Miglia con un récord que nunca se batió. En 1957 le dio a Vanwall, compartiendo coche con Tony Brooks, la primera victoria de un coche británico en el Mundial.",
        "Fue subcampeón cuatro años seguidos, de 1955 a 1958, y tercero los tres siguientes. En 1958 perdió el título por un punto frente a Mike Hawthorn después de declarar a su favor cuando iban a descalificarlo en Portugal. En 1961 ganó en Mónaco y en el Nürburgring con un Lotus privado ante los Ferrari, mucho más potentes. Un accidente en Goodwood, en una carrera fuera del campeonato de 1962, puso fin a su carrera en la F1. Murió en 2020.",
      ],
    },
    en: {
      tagline: "The greatest driver never to become world champion.",
      born: "London, England",
      text: [
        "He made his world championship debut in 1951 and for years chose British cars over Ferrari. He won his first race in 1955, the British Grand Prix at Aintree, as Fangio's team-mate at Mercedes, and that same year won the Mille Miglia in a record time that was never beaten. In 1957, sharing the car with Tony Brooks, he gave Vanwall the first world championship win for a British car.",
        "He was runner-up four years in a row, from 1955 to 1958, and third in each of the next three. In 1958 he lost the title by one point to Mike Hawthorn after speaking up for him when Hawthorn faced disqualification in Portugal. In 1961 he won at Monaco and the Nürburgring in a privately entered Lotus, beating the far more powerful Ferraris. A crash at Goodwood, in a non-championship race in 1962, ended his F1 career. He died in 2020.",
      ],
    },
  },
  collins: {
    es: {
      tagline: "El compañero que le cedió su coche, y el título, a Fangio.",
      born: "Kidderminster, Inglaterra",
      text: [
        "Llegó a Ferrari en 1956 y ese año ganó en Bélgica y en Francia. En la última carrera, en Monza, todavía tenía opciones de ser campeón, pero cuando se rompió el coche de su jefe de filas, Juan Manuel Fangio, Collins paró en boxes y se lo entregó. Fangio terminó segundo con él y se aseguró su cuarto título.",
        "Gran amigo de Mike Hawthorn, su compañero en Ferrari, ganó el Gran Premio de Gran Bretaña de 1958 en Silverstone. Dos semanas después murió en un accidente en el Nürburgring, durante el Gran Premio de Alemania.",
      ],
    },
    en: {
      tagline: "The team-mate who handed his car, and the title, to Fangio.",
      born: "Kidderminster, England",
      text: [
        "He joined Ferrari in 1956 and won in Belgium and France that year. At the final race, at Monza, he could still have been champion, but when team leader Juan Manuel Fangio's car broke down, Collins pitted and handed his over. Fangio finished second in it and sealed his fourth title.",
        "A close friend of Ferrari team-mate Mike Hawthorn, he won the 1958 British Grand Prix at Silverstone. Two weeks later he was killed in a crash at the Nürburgring during the German Grand Prix.",
      ],
    },
  },
  brooks: {
    es: {
      tagline: "«El dentista de las carreras», uno de los grandes olvidados.",
      born: "Dukinfield, Inglaterra",
      text: [
        "Estudiaba odontología cuando, en 1955, ganó con un Connaught el Gran Premio de Siracusa, fuera del campeonato: la primera victoria de un coche y un piloto británicos en un gran premio desde 1923. En 1957 compartió con Stirling Moss el Vanwall que ganó en Aintree, la primera victoria de un coche británico en el Mundial, y en 1958 ganó tres carreras más con Vanwall.",
        "En 1959 fichó por Ferrari y llegó a la última carrera con opciones de ganar el título, que se llevó Jack Brabham. Se retiró a finales de 1961, con solo 29 años, para dedicarse a su consulta y a su negocio de coches. Murió en 2022, como el último ganador de grandes premios de los años 50 que seguía vivo.",
      ],
    },
    en: {
      tagline: "“The racing dentist”, one of the sport's great unsung drivers.",
      born: "Dukinfield, England",
      text: [
        "He was a dental student when, in 1955, he won the non-championship Syracuse Grand Prix in a Connaught: the first Grand Prix win for a British car and driver since 1923. In 1957 he shared with Stirling Moss the Vanwall that won at Aintree, the first world championship win for a British car, and in 1958 he won three more races with Vanwall.",
        "In 1959 he joined Ferrari and went into the final race with a chance of the title, which went to Jack Brabham. He retired at the end of 1961, aged just 29, to focus on his dental practice and his car business. He died in 2022, the last surviving Grand Prix winner of the 1950s.",
      ],
    },
  },
  gurney: {
    es: {
      tagline: "El estadounidense que ganó con un coche de su propio equipo.",
      born: "Port Jefferson, Estados Unidos",
      text: [
        "Debutó con Ferrari en 1959 y ganó con tres marcas, siempre dejando huella: la única victoria de Porsche como constructor, en Francia 1962; la primera del equipo Brabham, en Francia 1964, y la única de su propio equipo, Eagle, en Bélgica 1967. Junto con Jack Brabham y Bruce McLaren es uno de los tres pilotos que han ganado un gran premio con un coche de su propia marca.",
        "Una semana antes de Spa 1967 había ganado las 24 Horas de Le Mans con A. J. Foyt, y en aquel podio empezó la costumbre de rociar champán. También inventó el «Gurney flap», un pequeño alerón que se sigue usando en coches de carreras y en aviones. Murió en 2018.",
      ],
    },
    en: {
      tagline: "The American who won in a car built by his own team.",
      born: "Port Jefferson, United States",
      text: [
        "He made his debut with Ferrari in 1959 and won for three makes, leaving his mark each time: Porsche's only win as a constructor, in France in 1962; the Brabham team's first, in France in 1964; and the only one for his own team, Eagle, in Belgium in 1967. Along with Jack Brabham and Bruce McLaren, he is one of only three drivers to win a Grand Prix in a car of his own make.",
        "A week before Spa in 1967 he had won the Le Mans 24 Hours with A. J. Foyt, and on that podium he started the tradition of spraying champagne. He also invented the “Gurney flap”, a small wing still used on racing cars and aircraft. He died in 2018.",
      ],
    },
  },
  mclaren: {
    es: {
      tagline: "El fundador del equipo que lleva su nombre.",
      born: "Auckland, Nueva Zelanda",
      text: [
        "De niño, una enfermedad de cadera le dejó una pierna más corta que la otra. Llegó a Europa con Cooper y en 1959, con 22 años, ganó el Gran Premio de Estados Unidos en Sebring: entonces el ganador más joven de la historia. En 1963 fundó su propio equipo, McLaren.",
        "En 1966 ganó las 24 Horas de Le Mans con Chris Amon y en 1968 le dio a su equipo su primera victoria en la F1, en Spa. Sus coches también dominaron la Can-Am estadounidense. Murió en 1970 en Goodwood, probando uno de ellos, con 32 años. Su equipo siguió adelante y es hoy uno de los más laureados de la historia.",
      ],
    },
    en: {
      tagline: "The founder of the team that bears his name.",
      born: "Auckland, New Zealand",
      text: [
        "A childhood hip disease left him with one leg shorter than the other. He came to Europe with Cooper and in 1959, aged 22, won the United States Grand Prix at Sebring: the youngest winner in history at the time. In 1963 he founded his own team, McLaren.",
        "In 1966 he won the Le Mans 24 Hours with Chris Amon and in 1968 gave his team its first F1 win, at Spa. His cars also dominated the North American Can-Am series. He was killed in 1970 at Goodwood, testing one of them, aged 32. His team carried on and is now one of the most successful in history.",
      ],
    },
  },
  amon: {
    es: {
      tagline: "El gran talento al que la suerte le negó una victoria en el Mundial.",
      born: "Bulls, Nueva Zelanda",
      text: [
        "Debutó en 1963 con 19 años y en 1966 ganó las 24 Horas de Le Mans con Bruce McLaren. De 1967 a 1969 corrió con Ferrari y lideró muchas carreras, pero averías, pinchazos y accidentes le negaron siempre una victoria en el Mundial, aunque sí ganó carreras fuera del campeonato.",
        "Su mala suerte se hizo legendaria: Mario Andretti bromeaba con que, si Amon se hiciera enterrador, la gente dejaría de morir. El ejemplo más cruel fue Clermont-Ferrand 1972, donde dominaba con su Matra hasta que un pinchazo lo relegó al tercer puesto. Murió en 2016 y sigue considerado uno de los mejores pilotos que nunca ganaron un gran premio.",
      ],
    },
    en: {
      tagline: "The great talent whom luck denied a world championship win.",
      born: "Bulls, New Zealand",
      text: [
        "He made his debut in 1963 aged 19 and in 1966 won the Le Mans 24 Hours with Bruce McLaren. From 1967 to 1969 he drove for Ferrari and led many races, but failures, punctures and accidents always denied him a world championship win, although he did win non-championship races.",
        "His bad luck became legendary: Mario Andretti joked that if Amon became an undertaker, people would stop dying. The cruellest example was Clermont-Ferrand in 1972, which he was dominating in his Matra until a puncture dropped him to third. He died in 2016 and is still regarded as one of the best drivers never to win a Grand Prix.",
      ],
    },
  },
  ickx: {
    es: {
      tagline: "Dos veces subcampeón de F1 y seis veces ganador de Le Mans.",
      born: "Bruselas, Bélgica",
      text: [
        "Ganó su primera carrera con Ferrari bajo la lluvia de Rouen en 1968, con 23 años, y se convirtió en un especialista en mojado. Fue subcampeón del mundo en 1969 con Brabham y en 1970 con Ferrari, cuando su remontada final no le alcanzó para superar a Jochen Rindt, que había muerto en Monza y fue campeón a título póstumo.",
        "Fuera de la F1 es una leyenda de la resistencia: ganó seis veces las 24 Horas de Le Mans. En la de 1969, en protesta por la salida corriendo hacia los coches, cruzó la pista andando y se abrochó el cinturón con calma antes de arrancar; ganó, y esa salida desapareció al año siguiente. En 1983 también ganó el Dakar.",
      ],
    },
    en: {
      tagline: "Twice F1 runner-up and six-time Le Mans winner.",
      born: "Brussels, Belgium",
      text: [
        "He won his first race for Ferrari in the rain at Rouen in 1968, aged 23, and became a wet-weather specialist. He was world championship runner-up in 1969 with Brabham and in 1970 with Ferrari, when his late charge fell short of Jochen Rindt, who had been killed at Monza and became the sport's only posthumous champion.",
        "Outside F1 he is an endurance racing legend: he won the Le Mans 24 Hours six times. In 1969, in protest at the running start, he walked across the track and calmly fastened his belts before setting off; he won, and the running start was dropped the following year. In 1983 he also won the Dakar.",
      ],
    },
  },
  regazzoni: {
    es: {
      tagline: "El suizo que le dio a Williams su primera victoria.",
      born: "Lugano, Suiza",
      text: [
        "Debutó con Ferrari en 1970 y en su quinta carrera ganó en Monza, ante los tifosi. En 1974 llegó a la última carrera empatado a puntos con Emerson Fittipaldi y terminó subcampeón. En 1979, ya con 39 años, ganó en Silverstone la primera carrera de la historia de Williams.",
        "En Long Beach 1980 un fallo de frenos lo estrelló a gran velocidad y quedó parapléjico. Siguió compitiendo con coches adaptados, incluido el Dakar, y luchó para que las personas con discapacidad pudieran conducir. Murió en 2006 en un accidente de tráfico.",
      ],
    },
    en: {
      tagline: "The Swiss driver who gave Williams its first win.",
      born: "Lugano, Switzerland",
      text: [
        "He made his debut with Ferrari in 1970 and won at Monza in his fifth race, in front of the tifosi. In 1974 he went into the final race level on points with Emerson Fittipaldi and finished runner-up. In 1979, aged 39, he won at Silverstone the first race in Williams' history.",
        "At Long Beach in 1980 a brake failure sent him into a high-speed crash that left him paraplegic. He kept racing in adapted cars, including the Dakar, and campaigned for disabled people to be able to drive. He died in a road accident in 2006.",
      ],
    },
  },
  peterson: {
    es: {
      tagline: "«SuperSwede», el piloto más espectacular de los años 70.",
      born: "Örebro, Suecia",
      text: [
        "Famoso por llevar sus coches de lado como nadie, fue subcampeón en 1971 con March sin ganar ninguna carrera. Su primera victoria llegó con Lotus en Francia 1973, la primera de las cuatro de esa temporada, y en 1977 llegó a conducir el Tyrrell de seis ruedas.",
        "En 1978 volvió a Lotus como escudero de Mario Andretti, con el coche de efecto suelo que dominó el año: ganó dos carreras y respetó las órdenes de equipo terminando varias veces segundo detrás de él. En la salida de Monza sufrió un accidente múltiple y murió al día siguiente. Fue subcampeón a título póstumo.",
      ],
    },
    en: {
      tagline: "“SuperSwede”, the most spectacular driver of the 1970s.",
      born: "Örebro, Sweden",
      text: [
        "Famous for driving his cars sideways like no one else, he was runner-up in 1971 with March without winning a race. His first win came with Lotus in France in 1973, the first of four that season, and in 1977 he even raced the six-wheeled Tyrrell.",
        "In 1978 he returned to Lotus as Mario Andretti's number two, in the ground-effect car that dominated the year: he won two races and obeyed team orders by finishing second behind him several times. He was caught in a multiple crash at the start at Monza and died the next day. He was classified runner-up posthumously.",
      ],
    },
  },
  cevert: {
    es: {
      tagline: "El elegante heredero de Jackie Stewart en Tyrrell.",
      born: "París, Francia",
      text: [
        "Jackie Stewart lo eligió como compañero en Tyrrell en 1970 y se convirtió en su alumno. En 1971 ganó el Gran Premio de Estados Unidos en Watkins Glen y terminó tercero en el campeonato, y en 1973 sumó seis segundos puestos, varios de ellos pegado a su maestro.",
        "Todo apuntaba a que sería el líder de Tyrrell cuando Stewart se retirara al final de 1973. Murió en un accidente durante la clasificación del último gran premio de ese año, en Watkins Glen; Tyrrell se retiró de la carrera, que iba a ser la número 100 de Stewart, y Stewart no volvió a correr.",
      ],
    },
    en: {
      tagline: "Jackie Stewart's elegant heir at Tyrrell.",
      born: "Paris, France",
      text: [
        "Jackie Stewart picked him as his Tyrrell team-mate in 1970 and he became his pupil. In 1971 he won the United States Grand Prix at Watkins Glen and finished third in the championship, and in 1973 he took six second places, several of them right behind his mentor.",
        "Everything pointed to him leading Tyrrell once Stewart retired at the end of 1973. He was killed in a crash during qualifying for that year's final race, at Watkins Glen; Tyrrell withdrew from the race, which would have been Stewart's 100th, and Stewart never raced again.",
      ],
    },
  },
  reutemann: {
    es: {
      tagline: "Pole en su debut y subcampeón por un punto en 1981.",
      born: "Santa Fe, Argentina",
      text: [
        "Hizo la pole en su primera carrera, el Gran Premio de Argentina de 1972 con Brabham, algo que muy pocos han logrado. Ganó carreras con Brabham, Ferrari y Williams y fue uno de los pilotos más rápidos de su época, conocido también por su carácter reservado.",
        "En Brasil 1981 desobedeció la orden de Williams de dejar pasar a su compañero Alan Jones y ganó, y llegó a la última carrera como líder del campeonato, pero lo perdió por un punto frente a Nelson Piquet. Se retiró a principios de 1982 y después fue gobernador de la provincia de Santa Fe y senador. Murió en 2021.",
      ],
    },
    en: {
      tagline: "Pole on debut and runner-up by a single point in 1981.",
      born: "Santa Fe, Argentina",
      text: [
        "He took pole in his very first race, the 1972 Argentine Grand Prix with Brabham, something very few have managed. He won races with Brabham, Ferrari and Williams and was one of the fastest drivers of his era, also known for his reserved character.",
        "In Brazil in 1981 he ignored Williams' order to let team-mate Alan Jones past and won, and he went into the final race leading the championship, only to lose it by one point to Nelson Piquet. He retired early in 1982 and later served as governor of Santa Fe province and as a senator. He died in 2021.",
      ],
    },
  },
  gilles_villeneuve: {
    es: {
      tagline: "El piloto más espectacular de Ferrari y padre de un campeón.",
      born: "Saint-Jean-sur-Richelieu, Canadá",
      text: [
        "Campeón de motos de nieve en Canadá, debutó con McLaren en Silverstone 1977 y a final de ese año Enzo Ferrari lo fichó. En 1978 ganó su primera carrera en casa, en Montreal, en el circuito que hoy lleva su nombre. En 1979 fue subcampeón detrás de su compañero Jody Scheckter, respetando las órdenes de equipo, y en Dijon protagonizó con René Arnoux un duelo rueda a rueda que se recuerda como uno de los mejores de la historia.",
        "En 1981, con un Ferrari poco competitivo, ganó en Mónaco y en Jarama, donde aguantó detrás a cuatro coches más rápidos durante casi toda la carrera. En 1982 murió en la clasificación de Zolder, dos semanas después de sentirse traicionado por su compañero Didier Pironi, que lo adelantó en la última vuelta de Imola. Su hijo Jacques fue campeón del mundo en 1997.",
      ],
    },
    en: {
      tagline: "Ferrari's most spectacular driver and father of a champion.",
      born: "Saint-Jean-sur-Richelieu, Canada",
      text: [
        "A Canadian snowmobile champion, he made his debut with McLaren at Silverstone in 1977 and Enzo Ferrari signed him at the end of that year. In 1978 he won his first race at home in Montreal, at the circuit that now bears his name. In 1979 he was runner-up to team-mate Jody Scheckter, respecting team orders, and at Dijon he fought a wheel-to-wheel duel with René Arnoux that is remembered as one of the greatest ever.",
        "In 1981, in an uncompetitive Ferrari, he won at Monaco and at Jarama, where he held off four faster cars for almost the entire race. In 1982 he was killed in qualifying at Zolder, two weeks after feeling betrayed by team-mate Didier Pironi, who passed him on the last lap at Imola. His son Jacques became world champion in 1997.",
      ],
    },
  },
  laffite: {
    es: {
      tagline: "El piloto de Ligier y de la sonrisa permanente.",
      born: "París, Francia",
      text: [
        "Debutó en 1974 con el equipo de Frank Williams y en 1976 se unió a Ligier, con el que ganó en Suecia 1977 la primera carrera del Mundial con coche, motor y piloto franceses. Sus seis victorias llegaron con Ligier, y en 1979, 1980 y 1981 terminó cuarto en el campeonato.",
        "Pasó dos años en Williams y volvió a Ligier en 1985. En el Gran Premio de Gran Bretaña de 1986, con el que igualaba el récord de grandes premios disputados de Graham Hill, un accidente en la salida le rompió las piernas y puso fin a su carrera en la F1. Su buen humor lo convirtió después en un comentarista muy querido en Francia.",
      ],
    },
    en: {
      tagline: "The Ligier driver with the permanent smile.",
      born: "Paris, France",
      text: [
        "He made his debut in 1974 with Frank Williams' team and joined Ligier in 1976, winning in Sweden in 1977 the first world championship race for an all-French car, engine and driver. All six of his wins came with Ligier, and he finished fourth in the championship in 1979, 1980 and 1981.",
        "He spent two years at Williams and returned to Ligier in 1985. At the 1986 British Grand Prix, the race in which he equalled Graham Hill's record for Grand Prix starts, a crash at the start broke his legs and ended his F1 career. His good humour later made him a much-loved commentator in France.",
      ],
    },
  },
  pironi: {
    es: {
      tagline: "Líder del Mundial de 1982 hasta que un accidente lo apartó de la F1.",
      born: "Villecresnes, Francia",
      text: [
        "Ganó las 24 Horas de Le Mans de 1978 con Renault y en 1980 su primera carrera de F1 con Ligier, en Zolder. En 1981 fichó por Ferrari, donde fue compañero de Gilles Villeneuve.",
        "En Imola 1982 adelantó a Villeneuve en la última vuelta cuando este creía que el equipo les había ordenado mantener posiciones; la relación se rompió y dos semanas después Villeneuve murió en Zolder. Pironi lideraba el campeonato cuando, en los entrenamientos de Hockenheim, chocó bajo la lluvia contra el coche de Alain Prost y se destrozó las piernas. No volvió a correr en la F1 y fue subcampeón por cinco puntos. Murió en 1987 en una carrera de lanchas.",
      ],
    },
    en: {
      tagline: "Leader of the 1982 championship until a crash ended his F1 career.",
      born: "Villecresnes, France",
      text: [
        "He won the 1978 Le Mans 24 Hours with Renault and, in 1980, his first F1 race with Ligier, at Zolder. In 1981 he joined Ferrari as Gilles Villeneuve's team-mate.",
        "At Imola in 1982 he passed Villeneuve on the last lap when Villeneuve believed the team had told them to hold position; their relationship broke down and two weeks later Villeneuve was killed at Zolder. Pironi was leading the championship when, in practice at Hockenheim, he hit Alain Prost's car in the rain and suffered severe leg injuries. He never raced in F1 again and finished runner-up by five points. He died in a powerboat race in 1987.",
      ],
    },
  },
  patrese: {
    es: {
      tagline: "El primer piloto en llegar a 200 grandes premios.",
      born: "Padua, Italia",
      text: [
        "Campeón del mundo de karting en 1974, debutó en Mónaco 1977 con Shadow y corrió en la F1 durante 17 temporadas seguidas. Su primera victoria llegó también en Mónaco, en 1982, en un final caótico en el que varios de los que iban por delante se quedaron parados en las últimas vueltas.",
        "En 1990 se convirtió en el primer piloto en llegar a 200 grandes premios y durante años tuvo el récord de participaciones. Con Williams fue subcampeón en 1992, detrás de su compañero Nigel Mansell, y en 1993 cerró su carrera en Benetton junto a un joven Michael Schumacher.",
      ],
    },
    en: {
      tagline: "The first driver to reach 200 Grands Prix.",
      born: "Padua, Italy",
      text: [
        "World karting champion in 1974, he made his debut at Monaco in 1977 with Shadow and raced in F1 for 17 consecutive seasons. His first win also came at Monaco, in 1982, in a chaotic finish in which several of the cars ahead of him stopped on track in the final laps.",
        "In 1990 he became the first driver to reach 200 Grands Prix and for years held the record for starts. With Williams he was runner-up in 1992, behind team-mate Nigel Mansell, and in 1993 he ended his career at Benetton alongside a young Michael Schumacher.",
      ],
    },
  },
  alboreto: {
    es: {
      tagline: "Subcampeón con Ferrari en 1985 y ganador de Le Mans.",
      born: "Milán, Italia",
      text: [
        "Debutó en 1981 con Tyrrell y con ese equipo ganó en Las Vegas 1982 y en Detroit 1983, la última de las 155 victorias del legendario motor Ford Cosworth DFV. Enzo Ferrari lo fichó para 1984.",
        "En 1985 lideró el campeonato con Ferrari buena parte del año, pero las averías de las últimas carreras lo dejaron subcampeón detrás de Alain Prost. Tras la F1 ganó las 24 Horas de Le Mans de 1997, y en 2001 murió en un accidente mientras probaba un Audi en el circuito alemán de Lausitz.",
      ],
    },
    en: {
      tagline: "Ferrari runner-up in 1985 and a Le Mans winner.",
      born: "Milan, Italy",
      text: [
        "He made his debut in 1981 with Tyrrell and won for them in Las Vegas in 1982 and in Detroit in 1983, the last of the legendary Ford Cosworth DFV engine's 155 victories. Enzo Ferrari signed him for 1984.",
        "In 1985 he led the championship for Ferrari for much of the year, but failures in the closing races left him runner-up behind Alain Prost. After F1 he won the 1997 Le Mans 24 Hours, and in 2001 he was killed in a crash while testing an Audi at the Lausitzring in Germany.",
      ],
    },
  },
  berger: {
    es: {
      tagline: "Diez victorias, gran amigo de Senna y rey de las bromas.",
      born: "Wörgl, Austria",
      text: [
        "Le dio a Benetton su primera victoria, en México 1986, y con Ferrari ganó en Monza 1988, semanas después de la muerte de Enzo Ferrari: la única carrera de ese año que no ganó McLaren. En 1989 sobrevivió a un incendio tras chocar en la curva Tamburello de Imola.",
        "De 1990 a 1992 fue compañero de Ayrton Senna en McLaren, con quien forjó una gran amistad y una larga lista de bromas. Volvió a Ferrari y terminó en Benetton, donde en 1997 ganó en Hockenheim desde la pole tras perderse tres carreras por una sinusitis. Después fue director deportivo de BMW y copropietario de Toro Rosso cuando el equipo ganó con Sebastian Vettel en Monza 2008.",
      ],
    },
    en: {
      tagline: "Ten wins, Senna's close friend and the king of practical jokes.",
      born: "Wörgl, Austria",
      text: [
        "He gave Benetton its first win, in Mexico in 1986, and for Ferrari he won at Monza in 1988, weeks after Enzo Ferrari's death: the only race that year not won by McLaren. In 1989 he survived a fire after crashing at Tamburello at Imola.",
        "From 1990 to 1992 he was Ayrton Senna's team-mate at McLaren, forging a close friendship and a long list of pranks. He returned to Ferrari and finished his career at Benetton, where in 1997 he won at Hockenheim from pole after missing three races with sinusitis. He later became BMW's motorsport director and co-owned Toro Rosso when the team won with Sebastian Vettel at Monza in 2008.",
      ],
    },
  },
  alesi: {
    es: {
      tagline: "Corazón de Ferrari y una sola victoria, el día de su cumpleaños.",
      born: "Aviñón, Francia",
      text: [
        "Hijo de inmigrantes sicilianos, debutó con Tyrrell en Francia 1989 terminando cuarto. En Phoenix 1990 lideró la carrera y le plantó cara a Ayrton Senna antes de terminar segundo, y para 1991 eligió Ferrari antes que Williams.",
        "Su pilotaje apasionado lo convirtió en ídolo de los tifosi, pero solo ganó una vez: en Canadá 1995, el día de su 31.º cumpleaños, con el Ferrari número 27 que había llevado Gilles Villeneuve. Después corrió con Benetton, Sauber, Prost y Jordan, y se retiró en 2001 tras más de 200 grandes premios.",
      ],
    },
    en: {
      tagline: "Ferrari at heart, with a single win on his birthday.",
      born: "Avignon, France",
      text: [
        "The son of Sicilian immigrants, he made his debut with Tyrrell in France in 1989 and finished fourth. At Phoenix in 1990 he led the race and stood up to Ayrton Senna before finishing second, and for 1991 he chose Ferrari over Williams.",
        "His passionate driving made him a hero to the tifosi, but he won only once: in Canada in 1995, on his 31st birthday, in the number 27 Ferrari once driven by Gilles Villeneuve. He then raced for Benetton, Sauber, Prost and Jordan, retiring in 2001 after more than 200 Grands Prix.",
      ],
    },
  },
  coulthard: {
    es: {
      tagline: "Trece victorias y el primer podio de Red Bull.",
      born: "Twynholm, Escocia",
      text: [
        "Era piloto de pruebas de Williams cuando, tras la muerte de Ayrton Senna, debutó en el Gran Premio de España de 1994. Ganó su primera carrera en Portugal 1995 y al año siguiente pasó a McLaren, a la que dio en Australia 1997 la primera victoria de la era McLaren-Mercedes.",
        "Con McLaren ganó dos veces en Mónaco y fue subcampeón en 2001, detrás de Michael Schumacher. En 2000 sobrevivió a un accidente de avión privado en el que murieron los dos pilotos. En 2005 se unió a Red Bull, al que dio su primer podio en Mónaco 2006, y tras retirarse en 2008 se convirtió en comentarista de televisión.",
      ],
    },
    en: {
      tagline: "Thirteen wins and Red Bull's first podium.",
      born: "Twynholm, Scotland",
      text: [
        "He was Williams' test driver when, after Ayrton Senna's death, he made his debut at the 1994 Spanish Grand Prix. He won his first race in Portugal in 1995 and the following year moved to McLaren, giving the team its first win of the McLaren-Mercedes era in Australia in 1997.",
        "With McLaren he won twice at Monaco and was runner-up in 2001, behind Michael Schumacher. In 2000 he survived a private plane crash in which both pilots were killed. In 2005 he joined Red Bull, giving the team its first podium at Monaco in 2006, and after retiring in 2008 he became a TV commentator.",
      ],
    },
  },
  irvine: {
    es: {
      tagline: "El escudero de Schumacher que rozó el título en 1999.",
      born: "Newtownards, Irlanda del Norte",
      text: [
        "Debutó con Jordan en Japón 1993 y se hizo famoso al instante: recuperó una vuelta adelantando a Ayrton Senna, que iba líder, y después de la carrera Senna fue a pedirle explicaciones y acabó dándole un puñetazo.",
        "De 1996 a 1999 fue compañero de Michael Schumacher en Ferrari. En 1999 ganó su primera carrera en Australia y, cuando Schumacher se rompió una pierna en Silverstone, pasó a luchar por el título: lo perdió por dos puntos frente a Mika Häkkinen. Terminó su carrera en Jaguar, en 2002.",
      ],
    },
    en: {
      tagline: "Schumacher's wingman who came within a whisker of the 1999 title.",
      born: "Newtownards, Northern Ireland",
      text: [
        "He made his debut with Jordan in Japan in 1993 and became famous instantly: he unlapped himself by passing race leader Ayrton Senna, and after the race Senna came to confront him and ended up punching him.",
        "From 1996 to 1999 he was Michael Schumacher's team-mate at Ferrari. In 1999 he won his first race in Australia and, when Schumacher broke his leg at Silverstone, took up the title fight: he lost it by two points to Mika Häkkinen. He ended his career at Jaguar in 2002.",
      ],
    },
  },
  frentzen: {
    es: {
      tagline: "Subcampeón en 1997 y aspirante al título con Jordan en 1999.",
      born: "Mönchengladbach, Alemania",
      text: [
        "Compartió con Michael Schumacher el programa de jóvenes de Mercedes y debutó en 1994 con Sauber. En 1997 sustituyó al campeón Damon Hill en Williams, ganó su primera carrera en Imola y terminó subcampeón.",
        "Su mejor temporada fue la de 1999 con Jordan: ganó en Magny-Cours y en Monza, llegó a las últimas carreras con opciones de título y terminó tercero. Después corrió con Prost, Arrows y de nuevo Sauber, y se retiró en 2003.",
      ],
    },
    en: {
      tagline: "Runner-up in 1997 and a title contender with Jordan in 1999.",
      born: "Mönchengladbach, Germany",
      text: [
        "He came through Mercedes' young driver programme alongside Michael Schumacher and made his debut in 1994 with Sauber. In 1997 he replaced champion Damon Hill at Williams, won his first race at Imola and finished runner-up.",
        "His best season was 1999 with Jordan: he won at Magny-Cours and Monza, was still in the title fight in the closing races and finished third. He then raced for Prost, Arrows and Sauber again, retiring in 2003.",
      ],
    },
  },
  barrichello: {
    es: {
      tagline: "El primero en llegar a 300 grandes premios.",
      born: "São Paulo, Brasil",
      text: [
        "Debutó con Jordan en 1993 y en 1994 sobrevivió a un grave accidente en Imola, el fin de semana en que murió su ídolo Ayrton Senna. Ese mismo año logró en Spa la primera pole de Jordan, y en 1997 el primer podio de Stewart, en Mónaco.",
        "En 2000 llegó a Ferrari como compañero de Michael Schumacher y ganó su primera carrera en Hockenheim saliendo desde el puesto 18. Fue subcampeón en 2002 y 2004 y en 2009 ganó dos carreras con Brawn GP. En 2010 se convirtió en el primer piloto en llegar a 300 grandes premios.",
      ],
    },
    en: {
      tagline: "The first driver to reach 300 Grands Prix.",
      born: "São Paulo, Brazil",
      text: [
        "He made his debut with Jordan in 1993 and in 1994 survived a heavy crash at Imola, the weekend his idol Ayrton Senna was killed. That same year he took Jordan's first pole at Spa, and in 1997 Stewart's first podium, at Monaco.",
        "In 2000 he joined Ferrari as Michael Schumacher's team-mate and won his first race at Hockenheim from 18th on the grid. He was runner-up in 2002 and 2004 and in 2009 won two races with Brawn GP. In 2010 he became the first driver to reach 300 Grands Prix.",
      ],
    },
  },
  montoya: {
    es: {
      tagline: "El colombiano que desafió a Schumacher desde su tercera carrera.",
      born: "Bogotá, Colombia",
      text: [
        "Llegó a la F1 en 2001 como campeón de la CART y ganador de las 500 Millas de Indianápolis. En su tercera carrera, en Brasil, adelantó a Michael Schumacher para ponerse líder, y ese mismo año ganó en Monza su primer gran premio.",
        "Con Williams fue tercero en 2002 y en 2003, año en que ganó en Mónaco. En 2005 pasó a McLaren y a mitad de 2006 dejó la F1 por la NASCAR. Más tarde volvió a ganar las 500 Millas de Indianápolis, en 2015.",
      ],
    },
    en: {
      tagline: "The Colombian who took on Schumacher from his third race.",
      born: "Bogotá, Colombia",
      text: [
        "He arrived in F1 in 2001 as CART champion and Indianapolis 500 winner. In his third race, in Brazil, he passed Michael Schumacher for the lead, and that same year he won his first Grand Prix at Monza.",
        "With Williams he was third in 2002 and in 2003, the year he won at Monaco. He moved to McLaren in 2005 and left F1 for NASCAR midway through 2006. He later won the Indianapolis 500 again, in 2015.",
      ],
    },
  },
  ralf_schumacher: {
    es: {
      tagline: "El hermano de Michael, con seis victorias propias.",
      born: "Hürth, Alemania",
      text: [
        "Campeón de la Fórmula Nippon japonesa en 1996, debutó en 1997 con Jordan y en su tercera carrera ya subió al podio en Argentina. En 1999 fichó por Williams.",
        "Con Williams ganó seis carreras, la primera en Imola 2001. En Canadá, ese mismo año, él y Michael firmaron el primer doblete de dos hermanos en la historia de la F1. Terminó su carrera con Toyota en 2007.",
      ],
    },
    en: {
      tagline: "Michael's brother, with six wins of his own.",
      born: "Hürth, Germany",
      text: [
        "Champion of Japan's Formula Nippon in 1996, he made his debut in 1997 with Jordan and was on the podium by his third race, in Argentina. In 1999 he joined Williams.",
        "With Williams he won six races, the first at Imola in 2001. In Canada that same year he and Michael scored the first one-two by brothers in F1 history. He ended his career with Toyota in 2007.",
      ],
    },
  },
  webber: {
    es: {
      tagline: "Nueve victorias con Red Bull y un carácter sin filtros.",
      born: "Queanbeyan, Australia",
      text: [
        "Debutó en casa, en Melbourne 2002, con un Minardi, y terminó quinto. Pasó por Jaguar y Williams antes de llegar a Red Bull en 2007, y en 2009 ganó su primera carrera en el Nürburgring pese a cumplir una penalización.",
        "En 2010 llegó a liderar el campeonato a falta de tres carreras, pero terminó tercero en el año del primer título de su compañero Sebastian Vettel. Su relación con él se tensó, sobre todo cuando Vettel ignoró la orden «Multi 21» en Malasia 2013. Tras dejar la F1 fue campeón del mundo de resistencia con Porsche en 2015.",
      ],
    },
    en: {
      tagline: "Nine wins with Red Bull and no filter.",
      born: "Queanbeyan, Australia",
      text: [
        "He made his debut at home in Melbourne in 2002 in a Minardi and finished fifth. He drove for Jaguar and Williams before joining Red Bull in 2007, and in 2009 won his first race at the Nürburgring despite serving a penalty.",
        "In 2010 he led the championship with three races to go, but finished third in the year team-mate Sebastian Vettel won his first title. Their relationship grew tense, above all when Vettel ignored the “Multi 21” order in Malaysia in 2013. After leaving F1 he became world endurance champion with Porsche in 2015.",
      ],
    },
  },
  massa: {
    es: {
      tagline: "Campeón durante unos segundos en Interlagos 2008.",
      born: "São Paulo, Brasil",
      text: [
        "Debutó con Sauber en 2002 y en 2006 llegó a Ferrari como compañero de Michael Schumacher. Ese año ganó por primera vez en Turquía y después en casa, en Interlagos.",
        "En 2008 ganó la última carrera en Interlagos y fue campeón durante unos segundos, hasta que Lewis Hamilton adelantó a Timo Glock en las últimas curvas y le quitó el título por un punto. En Hungría 2009 un muelle desprendido del coche de Rubens Barrichello lo golpeó en el casco y lo dejó fuera el resto del año. Terminó su carrera en Williams en 2017.",
      ],
    },
    en: {
      tagline: "Champion for a few seconds at Interlagos in 2008.",
      born: "São Paulo, Brazil",
      text: [
        "He made his debut with Sauber in 2002 and joined Ferrari in 2006 as Michael Schumacher's team-mate. That year he won for the first time in Turkey and then at home, at Interlagos.",
        "In 2008 he won the final race at Interlagos and was champion for a few seconds, until Lewis Hamilton passed Timo Glock in the last corners and beat him to the title by one point. In Hungary in 2009 a spring that had come off Rubens Barrichello's car struck his helmet and ruled him out for the rest of the year. He ended his career at Williams in 2017.",
      ],
    },
  },
  kubica: {
    es: {
      tagline: "El primer polaco en la F1, ganador en Canadá 2008.",
      born: "Cracovia, Polonia",
      text: [
        "Debutó con BMW Sauber en Hungría 2006 y en su tercera carrera ya subió al podio en Monza. En Canadá 2007 sobrevivió a un terrible accidente y, un año después, ganó en ese mismo circuito con un doblete de BMW que lo convirtió en líder del Mundial.",
        "En febrero de 2011, antes de empezar su segunda temporada con Renault, un accidente de rally le dañó gravemente el brazo derecho. Volvió a la F1 en 2019 con Williams, más de ocho años después, y en 2025 ganó las 24 Horas de Le Mans con Ferrari.",
      ],
    },
    en: {
      tagline: "Poland's first F1 driver and winner in Canada in 2008.",
      born: "Kraków, Poland",
      text: [
        "He made his debut with BMW Sauber in Hungary in 2006 and was on the podium by his third race, at Monza. In Canada in 2007 he survived a terrifying crash and, a year later, won at the same circuit in a BMW one-two that put him top of the championship.",
        "In February 2011, before his second season with Renault, a rally crash severely injured his right arm. He returned to F1 in 2019 with Williams, more than eight years later, and in 2025 won the Le Mans 24 Hours with Ferrari.",
      ],
    },
  },
  ricciardo: {
    es: {
      tagline: "Ocho victorias, adelantamientos imposibles y la sonrisa del paddock.",
      born: "Perth, Australia",
      text: [
        "Debutó con HRT en 2011 y en 2014 llegó a Red Bull, donde superó a su compañero, el tetracampeón Sebastian Vettel, y ganó tres carreras, la primera en Canadá. Sus adelantamientos en las frenadas y su costumbre de celebrar bebiendo champán de su bota se hicieron famosos.",
        "En Mónaco 2018 ganó pese a perder potencia durante buena parte de la carrera. Después pasó por Renault y McLaren, con la que ganó en Monza 2021 en un doblete con Lando Norris, la primera victoria del equipo desde 2012. Se despidió de la F1 en Singapur 2024, con RB, marcando la vuelta rápida.",
      ],
    },
    en: {
      tagline: "Eight wins, impossible overtakes and the paddock's biggest smile.",
      born: "Perth, Australia",
      text: [
        "He made his debut with HRT in 2011 and joined Red Bull in 2014, where he outscored four-time champion team-mate Sebastian Vettel and won three races, the first in Canada. His late-braking overtakes and his habit of drinking champagne from his shoe became famous.",
        "At Monaco in 2018 he won despite losing power for much of the race. He then drove for Renault and McLaren, winning at Monza in 2021 in a one-two with Lando Norris, the team's first win since 2012. He said goodbye to F1 in Singapore in 2024, with RB, by setting the fastest lap.",
      ],
    },
  },
  grosjean: {
    es: {
      tagline: "Diez podios y un milagro en Bahréin 2020.",
      born: "Ginebra, Suiza",
      text: [
        "Suizo de nacimiento y francés de licencia, debutó con Renault en 2009 y volvió en 2012 con Lotus tras ganar la GP2; ese año logró su primer podio, en Bahréin. En 2016 fue el primer piloto del nuevo equipo Haas, con el que sumó puntos en su primera carrera.",
        "En la primera vuelta de Bahréin 2020 su coche se partió en dos contra las barreras y se incendió; salió por su propio pie de entre las llamas, protegido por el halo. Fue su última carrera en la F1; después corrió en la IndyCar.",
      ],
    },
    en: {
      tagline: "Ten podiums and a miracle in Bahrain in 2020.",
      born: "Geneva, Switzerland",
      text: [
        "Swiss-born and racing under a French licence, he made his debut with Renault in 2009 and returned in 2012 with Lotus after winning GP2; that year he took his first podium, in Bahrain. In 2016 he was the lead driver of the new Haas team, scoring points in its very first race.",
        "On the first lap in Bahrain in 2020 his car split in two against the barriers and caught fire; he climbed out of the flames on his own, protected by the halo. It was his last F1 race; he then raced in IndyCar.",
      ],
    },
  },
  kevin_magnussen: {
    es: {
      tagline: "Podio en su debut y la primera pole de Haas.",
      born: "Roskilde, Dinamarca",
      text: [
        "Hijo del expiloto de F1 Jan Magnussen, debutó con McLaren en Australia 2014 y terminó segundo: podio en su primera carrera. Tras un año sin volante corrió con Renault y en 2017 llegó a Haas, el equipo con el que más se le identifica.",
        "En 2022 volvió a Haas por sorpresa y fue quinto en su primera carrera. Ese año, en Brasil, hizo el mejor tiempo de la clasificación con la pista mojada, la primera pole de la historia del equipo, aunque la parrilla del domingo la decidió la carrera al sprint. Dejó la F1 a finales de 2024.",
      ],
    },
    en: {
      tagline: "A podium on debut and Haas's first pole.",
      born: "Roskilde, Denmark",
      text: [
        "The son of former F1 driver Jan Magnussen, he made his debut with McLaren in Australia in 2014 and finished second: a podium first time out. After a year without a race seat he drove for Renault and in 2017 joined Haas, the team he is most associated with.",
        "In 2022 he made a surprise return to Haas and finished fifth in his first race back. That year, in Brazil, he set the fastest time in qualifying on a wet track, the team's first ever pole, although Sunday's grid was decided by the sprint. He left F1 at the end of 2024.",
      ],
    },
  },
  tsunoda: {
    es: {
      tagline: "El japonés de Red Bull, rápido y sin pelos en la lengua.",
      born: "Sagamihara, Japón",
      text: [
        "Formado en los programas de jóvenes de Honda y Red Bull, debutó en 2021 con AlphaTauri y sumó puntos en su primera carrera. Pasó cuatro temporadas en el equipo de Faenza, donde también se hizo famoso por sus mensajes de radio.",
        "En 2025, tras dos carreras, Red Bull lo subió al equipo principal junto a Max Verstappen, y debutó con ellos en casa, en Suzuka. En 2026 se quedó sin asiento de titular, pero a mitad de temporada volvió a correr con Racing Bulls mientras Isack Hadjar estaba lesionado.",
      ],
    },
    en: {
      tagline: "Red Bull's Japanese driver: fast and outspoken.",
      born: "Sagamihara, Japan",
      text: [
        "A product of the Honda and Red Bull junior programmes, he made his debut in 2021 with AlphaTauri and scored points in his first race. He spent four seasons with the Faenza team, where he also became famous for his radio messages.",
        "In 2025, after two races, Red Bull promoted him to the senior team alongside Max Verstappen, and his first race with them was at home, at Suzuka. In 2026 he was left without a race seat, but midway through the season he raced again for Racing Bulls while Isack Hadjar was injured.",
      ],
    },
  },
  zhou: {
    es: {
      tagline: "El primer piloto chino titular de la F1.",
      born: "Shanghái, China",
      text: [
        "Se formó en las academias de Ferrari y Renault y en 2022 debutó con Alfa Romeo, sumando un punto en su primera carrera: fue el primer piloto chino titular en la historia de la F1.",
        "En la salida de Silverstone 2022 su coche volcó y saltó las barreras de neumáticos; el halo lo protegió y salió sin lesiones graves. En 2024 se convirtió en el primer piloto chino en correr el Gran Premio de China, y tras tres temporadas en el equipo de Hinwil pasó a ser reserva de Ferrari en 2025.",
      ],
    },
    en: {
      tagline: "F1's first full-time Chinese driver.",
      born: "Shanghai, China",
      text: [
        "He came through the Ferrari and Renault academies and made his debut in 2022 with Alfa Romeo, scoring a point in his first race: he was the first full-time Chinese driver in F1 history.",
        "At the start at Silverstone in 2022 his car flipped and cleared the tyre barriers; the halo protected him and he escaped without serious injury. In 2024 he became the first Chinese driver to race in the Chinese Grand Prix, and after three seasons with the Hinwil team he became Ferrari's reserve driver in 2025.",
      ],
    },
  },
  mick_schumacher: {
    es: {
      tagline: "Campeón de F3 y F2 con el apellido más famoso de la F1.",
      born: "Vufflens-le-Château, Suiza",
      text: [
        "Hijo de Michael Schumacher, empezó en el karting con el apellido de su madre para pasar desapercibido. Fue campeón de la Fórmula 3 europea en 2018 y de la Fórmula 2 en 2020.",
        "Debutó con Haas en 2021 y en 2022 sumó sus primeros puntos en Silverstone. Al perder el asiento a finales de ese año fue piloto reserva de Mercedes y después pasó a la resistencia con Alpine.",
      ],
    },
    en: {
      tagline: "F3 and F2 champion with the most famous name in F1.",
      born: "Vufflens-le-Château, Switzerland",
      text: [
        "The son of Michael Schumacher, he started karting under his mother's maiden name to keep a low profile. He was European Formula 3 champion in 2018 and Formula 2 champion in 2020.",
        "He made his debut with Haas in 2021 and scored his first points at Silverstone in 2022. After losing his seat at the end of that year he became Mercedes' reserve driver and then moved to endurance racing with Alpine.",
      ],
    },
  },
} satisfies Record<string, Record<"es" | "en", DriverStory>>);

Object.assign(STORIES, {
  // ---------- Más pilotos destacados sin título (por orden de debut) ----------
  gonzalez: {
    es: {
      tagline: "«El Cabezón», autor de la primera victoria de Ferrari en el Mundial.",
      born: "Arrecifes, Argentina",
      text: [
        "Compatriota y amigo de Juan Manuel Fangio, debutó en el Mundial en 1950. En Silverstone 1951 hizo la pole y ganó con Ferrari por delante del Alfa Romeo de Fangio: la primera victoria de la Scuderia en el Mundial.",
        "En 1954 volvió a ganar en Silverstone, se llevó las 24 Horas de Le Mans con Maurice Trintignant y fue subcampeón detrás de Fangio. Después solo corrió de vez en cuando, sobre todo en Argentina. Murió en 2013.",
      ],
    },
    en: {
      tagline: "“The Pampas Bull”, who gave Ferrari its first world championship win.",
      born: "Arrecifes, Argentina",
      text: [
        "A compatriot and friend of Juan Manuel Fangio, he made his world championship debut in 1950. At Silverstone in 1951 he took pole and won for Ferrari ahead of Fangio's Alfa Romeo: the Scuderia's first world championship win.",
        "In 1954 he won at Silverstone again, took the Le Mans 24 Hours with Maurice Trintignant and was runner-up to Fangio. After that he raced only occasionally, mostly in Argentina. He died in 2013.",
      ],
    },
  },
  trips: {
    es: {
      tagline: "El conde alemán que estuvo a un paso del título de 1961.",
      born: "Colonia, Alemania",
      text: [
        "Aristócrata alemán, debutó con Ferrari en 1956. En 1961, con el nuevo Ferrari de morro de tiburón, ganó en Zandvoort y en Aintree: fue el primer alemán en ganar una carrera del Mundial.",
        "Llegó a Monza como líder del campeonato y salió desde la pole, pero en la segunda vuelta chocó con Jim Clark y su coche salió despedido hacia el público: murieron él y quince espectadores. Su compañero Phil Hill se proclamó campeón y Von Trips terminó subcampeón por un punto.",
      ],
    },
    en: {
      tagline: "The German count who came within a step of the 1961 title.",
      born: "Cologne, Germany",
      text: [
        "A German aristocrat, he made his debut with Ferrari in 1956. In 1961, in the new “sharknose” Ferrari, he won at Zandvoort and Aintree: the first German to win a world championship race.",
        "He arrived at Monza leading the championship and started from pole, but on the second lap he collided with Jim Clark and his car was launched into the crowd, killing him and fifteen spectators. Team-mate Phil Hill became champion and von Trips was runner-up by one point.",
      ],
    },
  },
  ginther: {
    es: {
      tagline: "El piloto que le dio a Honda su primera victoria en la F1.",
      born: "Hollywood, Estados Unidos",
      text: [
        "Mecánico e ingeniero además de piloto, en Ferrari ayudó a introducir el alerón trasero, una idea que se extendió después por todo el automovilismo. Corrió con Ferrari, BRM y Honda y fue tercero en el campeonato de 1963 con BRM.",
        "En México 1965, la última carrera de la época de los motores de 1,5 litros, ganó con Honda: la primera victoria del fabricante japonés y también de los neumáticos Goodyear. Se retiró en 1967 y murió en 1989.",
      ],
    },
    en: {
      tagline: "The driver who gave Honda its first F1 win.",
      born: "Hollywood, United States",
      text: [
        "A mechanic and engineer as well as a driver, at Ferrari he helped introduce the rear spoiler, an idea that later spread throughout motor racing. He drove for Ferrari, BRM and Honda and was third in the 1963 championship with BRM.",
        "In Mexico in 1965, the last race of the 1.5-litre era, he won with Honda: the first victory for the Japanese manufacturer and also for Goodyear tyres. He retired in 1967 and died in 1989.",
      ],
    },
  },
  bandini: {
    es: {
      tagline: "El italiano de Ferrari que ganó en Austria 1964.",
      born: "Al Marj, Libia",
      text: [
        "Nació en la Libia italiana y creció en Italia, donde trabajó como mecánico antes de empezar a correr. Con Ferrari ganó su única carrera en Austria 1964, el año en que su compañero John Surtees fue campeón.",
        "En 1967 era el primer piloto de Ferrari. En Mónaco, cuando iba segundo, chocó en la chicana del puerto y su coche se incendió; murió tres días después. Su accidente aceleró las mejoras de seguridad en los circuitos.",
      ],
    },
    en: {
      tagline: "The Ferrari Italian who won in Austria in 1964.",
      born: "Al Marj, Libya",
      text: [
        "Born in Italian Libya, he grew up in Italy, where he worked as a mechanic before he started racing. With Ferrari he won his only race in Austria in 1964, the year team-mate John Surtees became champion.",
        "In 1967 he was Ferrari's lead driver. At Monaco, while running second, he crashed at the harbour chicane and his car caught fire; he died three days later. His accident sped up safety improvements at circuits.",
      ],
    },
  },
  siffert: {
    es: {
      tagline: "El suizo que ganó con un equipo privado en Brands Hatch 1968.",
      born: "Friburgo, Suiza",
      text: [
        "Empezó en las motos y llegó a la F1 en 1962. En 1968 ganó el Gran Premio de Gran Bretaña con el Lotus privado de Rob Walker, una de las últimas victorias de un equipo privado en el Mundial, y en 1971 volvió a ganar en Austria con BRM, desde la pole.",
        "Fue también una estrella de los coches deportivos con Porsche. Murió en octubre de 1971 en Brands Hatch, en una carrera fuera del campeonato, cuando su BRM se salió y se incendió.",
      ],
    },
    en: {
      tagline: "The Swiss driver who won with a private team at Brands Hatch in 1968.",
      born: "Fribourg, Switzerland",
      text: [
        "He started out on motorcycles and reached F1 in 1962. In 1968 he won the British Grand Prix in Rob Walker's privately entered Lotus, one of the last world championship wins for a private team, and in 1971 he won again in Austria with BRM, from pole.",
        "He was also a sports car star with Porsche. He was killed in October 1971 at Brands Hatch, in a non-championship race, when his BRM went off and caught fire.",
      ],
    },
  },
  rodriguez: {
    es: {
      tagline: "El mexicano que, con su hermano, da nombre al circuito de su país.",
      born: "Ciudad de México, México",
      text: [
        "Él y su hermano Ricardo, que murió en 1962 en una carrera fuera del campeonato en México, fueron los pioneros mexicanos de la F1. Pedro ganó en Sudáfrica 1967 con Cooper y en Spa 1970 con BRM, en una de las carreras más rápidas de su época.",
        "Ganó las 24 Horas de Le Mans de 1968 y fue un maestro bajo la lluvia y al volante del Porsche 917. Murió en 1971 en una carrera de coches deportivos en el Norisring, en Alemania. El autódromo de Ciudad de México se llama Hermanos Rodríguez en su honor.",
      ],
    },
    en: {
      tagline: "The Mexican who, with his brother, gave his name to his country's circuit.",
      born: "Mexico City, Mexico",
      text: [
        "He and his brother Ricardo, who was killed in 1962 in a non-championship race in Mexico, were Mexico's F1 pioneers. Pedro won in South Africa in 1967 with Cooper and at Spa in 1970 with BRM, in one of the fastest races of the era.",
        "He won the 1968 Le Mans 24 Hours and was a master in the wet and at the wheel of the Porsche 917. He was killed in 1971 in a sports car race at the Norisring in Germany. The Mexico City circuit is named Hermanos Rodríguez in honour of the brothers.",
      ],
    },
  },
  beltoise: {
    es: {
      tagline: "El ganador bajo el diluvio de Mónaco 1972.",
      born: "París, Francia",
      text: [
        "Campeón de Francia de motociclismo, en 1964 sufrió un grave accidente en Reims que le dejó el brazo izquierdo con poca movilidad, y aun así llegó a la F1. Con Matra fue segundo en Zandvoort 1968 y quinto en el campeonato de 1969.",
        "Su gran día llegó en Mónaco 1972: con un BRM, lideró de principio a fin bajo una lluvia torrencial. Fue su única victoria y la última de BRM. Estaba casado con la hermana de François Cevert y murió en 2015.",
      ],
    },
    en: {
      tagline: "The winner in the deluge at Monaco in 1972.",
      born: "Paris, France",
      text: [
        "A French motorcycle champion, in 1964 he suffered a serious crash at Reims that left his left arm with limited movement, and he still made it to F1. With Matra he was second at Zandvoort in 1968 and fifth in the 1969 championship.",
        "His great day came at Monaco in 1972: in a BRM, he led from start to finish in torrential rain. It was his only win and BRM's last. He was married to François Cevert's sister and died in 2015.",
      ],
    },
  },
  depailler: {
    es: {
      tagline: "El piloto del Tyrrell de seis ruedas, ganador en Mónaco 1978.",
      born: "Clermont-Ferrand, Francia",
      text: [
        "Llegó a Tyrrell en 1972 y fue uno de los pilotos del famoso P34 de seis ruedas, con el que terminó segundo en Suecia 1976 detrás de su compañero Jody Scheckter. En 1978 ganó por fin, en Mónaco.",
        "En 1979 ganó en España con Ligier, pero a mitad de temporada un accidente de ala delta le rompió las piernas. Volvió en 1980 con Alfa Romeo y murió en agosto de ese año en unos entrenamientos privados en Hockenheim.",
      ],
    },
    en: {
      tagline: "The six-wheeled Tyrrell driver who won at Monaco in 1978.",
      born: "Clermont-Ferrand, France",
      text: [
        "He joined Tyrrell in 1972 and was one of the drivers of the famous six-wheeled P34, finishing second in it in Sweden in 1976 behind team-mate Jody Scheckter. In 1978 he finally won, at Monaco.",
        "In 1979 he won in Spain with Ligier, but midway through the season a hang-gliding accident broke his legs. He returned in 1980 with Alfa Romeo and was killed that August during a private test at Hockenheim.",
      ],
    },
  },
  watson: {
    es: {
      tagline: "Ganó saliendo 22.º en Long Beach 1983.",
      born: "Belfast, Irlanda del Norte",
      text: [
        "Le dio a Penske su única victoria en el Mundial, en Austria 1976, y por una apuesta se afeitó la barba después. En 1979 llegó a McLaren, con la que en 1981 ganó en Silverstone la primera carrera de un coche con chasis de fibra de carbono.",
        "Era un especialista en remontadas: en Detroit 1982 ganó saliendo 17.º y en Long Beach 1983 lo hizo desde el puesto 22, la victoria desde más atrás en la parrilla de la historia de la F1. En 1982 fue tercero en el campeonato. Después fue comentarista de televisión.",
      ],
    },
    en: {
      tagline: "He won from 22nd on the grid at Long Beach in 1983.",
      born: "Belfast, Northern Ireland",
      text: [
        "He gave Penske its only world championship win, in Austria in 1976, and shaved off his beard afterwards to settle a bet. In 1979 he joined McLaren, and at Silverstone in 1981 he took the first win for a car with a carbon-fibre chassis.",
        "He was a master of comebacks: in Detroit in 1982 he won from 17th on the grid and at Long Beach in 1983 from 22nd, the furthest back any winner has started in F1 history. In 1982 he was third in the championship. He later became a TV commentator.",
      ],
    },
  },
  jabouille: {
    es: {
      tagline: "El ingeniero y piloto que ganó la primera carrera con motor turbo.",
      born: "París, Francia",
      text: [
        "Ingeniero además de piloto, fue clave en el desarrollo del motor turbo de Renault, del que muchos se reían al principio por sus averías. En 1979 logró en Sudáfrica la primera pole de un turbo y, en Dijon, la primera victoria de un motor turbo en la F1, en el Gran Premio de su país.",
        "Ganó otra vez en Austria 1980, pero ese mismo año un accidente en Canadá le rompió las piernas y apenas volvió a correr. Murió en 2023.",
      ],
    },
    en: {
      tagline: "The engineer-driver who won the first race with a turbo engine.",
      born: "Paris, France",
      text: [
        "An engineer as well as a driver, he was key to developing Renault's turbo engine, which many laughed at in the early days for its failures. In 1979 he took the first pole for a turbo in South Africa and, at Dijon, the first win for a turbo engine in F1, at his home Grand Prix.",
        "He won again in Austria in 1980, but later that year a crash in Canada broke his legs and he barely raced again. He died in 2023.",
      ],
    },
  },
  tambay: {
    es: {
      tagline: "El amigo de Gilles Villeneuve que ganó con su número en Ferrari.",
      born: "París, Francia",
      text: [
        "Pasó por varios equipos, entre ellos McLaren y Ligier, sin grandes resultados hasta que en 1982 Ferrari lo llamó para sustituir a su amigo Gilles Villeneuve. Ganó en Hockenheim un día después del grave accidente de su compañero Didier Pironi.",
        "En 1983 ganó en Imola con el número 27 que había llevado Villeneuve y terminó cuarto en el campeonato. Después corrió con Renault y Lola, y murió en 2022.",
      ],
    },
    en: {
      tagline: "Gilles Villeneuve's friend who won in his number at Ferrari.",
      born: "Paris, France",
      text: [
        "He drove for several teams, including McLaren and Ligier, without much success until in 1982 Ferrari called him up to replace his friend Gilles Villeneuve. He won at Hockenheim the day after team-mate Didier Pironi's serious crash.",
        "In 1983 he won at Imola in the number 27 that Villeneuve had carried and finished fourth in the championship. He then drove for Renault and Lola, and died in 2022.",
      ],
    },
  },
  arnoux: {
    es: {
      tagline: "Siete victorias y el duelo de Dijon 1979.",
      born: "Pontcharra, Francia",
      text: [
        "Con Renault vivió los años del turbo: en Dijon 1979 protagonizó con Gilles Villeneuve un duelo rueda a rueda por el segundo puesto que es de los más recordados de la F1, y en 1980 ganó sus dos primeras carreras, en Brasil y Sudáfrica. En Francia 1982 ganó desoyendo el acuerdo de dejar pasar a su compañero Alain Prost.",
        "En 1983 fichó por Ferrari, ganó tres carreras y terminó tercero en el campeonato. Después corrió con Ligier hasta 1989.",
      ],
    },
    en: {
      tagline: "Seven wins and the duel at Dijon in 1979.",
      born: "Pontcharra, France",
      text: [
        "With Renault he lived through the turbo years: at Dijon in 1979 he fought a wheel-to-wheel duel with Gilles Villeneuve for second place that is among the most famous in F1, and in 1980 he won his first two races, in Brazil and South Africa. In France in 1982 he won after ignoring an agreement to let team-mate Alain Prost through.",
        "In 1983 he joined Ferrari, won three races and finished third in the championship. He then raced for Ligier until 1989.",
      ],
    },
  },
  angelis: {
    es: {
      tagline: "El elegante romano de Lotus, ganador por cinco centésimas.",
      born: "Roma, Italia",
      text: [
        "Debutó en 1979 con Shadow y con 21 años ya subió al podio en Brasil 1980 con Lotus. En Austria 1982 ganó su primera carrera por cinco centésimas sobre Keke Rosberg, uno de los finales más ajustados de la historia.",
        "Fue tercero en 1984 y en 1985 ganó en Imola, tras la descalificación de Alain Prost, como compañero de un joven Ayrton Senna. En 1986 fichó por Brabham y murió en mayo de ese año en unos entrenamientos privados en Paul Ricard. También era un gran pianista.",
      ],
    },
    en: {
      tagline: "Lotus's elegant Roman, winner by five hundredths of a second.",
      born: "Rome, Italy",
      text: [
        "He made his debut in 1979 with Shadow and was on the podium at 21, in Brazil in 1980 with Lotus. In Austria in 1982 he won his first race by five hundredths of a second from Keke Rosberg, one of the closest finishes in history.",
        "He was third in 1984 and in 1985 won at Imola, after Alain Prost's disqualification, as a young Ayrton Senna's team-mate. In 1986 he joined Brabham and was killed that May during a private test at Paul Ricard. He was also an accomplished pianist.",
      ],
    },
  },
  cesaris: {
    es: {
      tagline: "Más de 200 grandes premios sin ganar ninguno.",
      born: "Roma, Italia",
      text: [
        "Debutó en 1980 y en Long Beach 1982, con Alfa Romeo, se convirtió en el poleman más joven de la historia hasta entonces. Rapidísimo pero propenso a los accidentes, rozó la victoria varias veces, con dos segundos puestos en 1983.",
        "Corrió 15 temporadas con diez equipos distintos, entre ellos McLaren, Ligier, Jordan y Sauber, y en Spa 1991 fue el compañero de Michael Schumacher en su debut con Jordan. Murió en 2014 en un accidente de moto en Roma.",
      ],
    },
    en: {
      tagline: "More than 200 Grands Prix without a single win.",
      born: "Rome, Italy",
      text: [
        "He made his debut in 1980 and at Long Beach in 1982, with Alfa Romeo, became the youngest pole-sitter in history at the time. Very fast but accident-prone, he came close to winning several times, with two second places in 1983.",
        "He raced for 15 seasons with ten different teams, including McLaren, Ligier, Jordan and Sauber, and at Spa in 1991 he was Michael Schumacher's team-mate on his debut with Jordan. He died in a motorcycle accident in Rome in 2014.",
      ],
    },
  },
  boutsen: {
    es: {
      tagline: "El belga que ganó tres carreras con Williams.",
      born: "Bruselas, Bélgica",
      text: [
        "Debutó con Arrows en su carrera de casa, Spa 1983, y con Benetton subió varias veces al podio. En 1989 llegó a Williams y ganó bajo la lluvia en Canadá y en Australia.",
        "Su mejor día fue Hungría 1990: salió desde la pole y aguantó toda la carrera a Ayrton Senna para ganar por menos de tres décimas. Tras la F1 corrió en resistencia y fundó una empresa de venta de aviones.",
      ],
    },
    en: {
      tagline: "The Belgian who won three races with Williams.",
      born: "Brussels, Belgium",
      text: [
        "He made his debut with Arrows at his home race, Spa in 1983, and with Benetton he finished on the podium several times. In 1989 he joined Williams and won in the rain in Canada and Australia.",
        "His best day was Hungary in 1990: he started from pole and held off Ayrton Senna for the whole race to win by less than three tenths. After F1 he raced in endurance events and founded an aircraft sales company.",
      ],
    },
  },
  bellof: {
    es: {
      tagline: "El talento alemán que batió el récord del Nürburgring.",
      born: "Gießen, Alemania",
      text: [
        "En 1983 dio con un Porsche la vuelta más rápida de la historia al Nordschleife del Nürburgring, un récord que aguantó 35 años, y en 1984 fue campeón del mundo de resistencia. Ese mismo año debutó en la F1 con Tyrrell.",
        "En Mónaco 1984, bajo la lluvia, remontó desde el último puesto hasta el tercero antes de que se detuviera la carrera, pero el resultado se borró cuando Tyrrell fue descalificado de toda la temporada. Murió en septiembre de 1985 en los 1000 km de Spa, con un Porsche.",
      ],
    },
    en: {
      tagline: "The German talent who set the Nürburgring lap record.",
      born: "Giessen, Germany",
      text: [
        "In 1983 he lapped the Nürburgring Nordschleife in a Porsche faster than anyone ever had, a record that stood for 35 years, and in 1984 he was world endurance champion. That same year he made his F1 debut with Tyrrell.",
        "At Monaco in 1984, in the rain, he climbed from last on the grid to third before the race was stopped, but the result was erased when Tyrrell was disqualified from the whole season. He was killed in September 1985 in the Spa 1000 km, driving a Porsche.",
      ],
    },
  },
  brundle: {
    es: {
      tagline: "De rival de Senna a la voz más conocida de la F1.",
      born: "King's Lynn, Inglaterra",
      text: [
        "En 1983 le disputó a Ayrton Senna el campeonato británico de F3 hasta la última carrera. En la F1 corrió de 1984 a 1996 y en 1992 fue compañero de Michael Schumacher en Benetton, el año en que más veces subió al podio. En 1990 ganó las 24 Horas de Le Mans con Jaguar.",
        "En Australia 1996 su Jordan dio varias vueltas de campana; salió por su propio pie y volvió corriendo a boxes para tomar la nueva salida con el coche de reserva. Tras retirarse se convirtió en comentarista de televisión, famoso por sus entrevistas por la parrilla antes de cada carrera.",
      ],
    },
    en: {
      tagline: "From Senna's rival to the best-known voice in F1.",
      born: "King's Lynn, England",
      text: [
        "In 1983 he took Ayrton Senna all the way to the final round of the British F3 championship. In F1 he raced from 1984 to 1996 and in 1992 he was Michael Schumacher's team-mate at Benetton, his best year for podiums. In 1990 he won the Le Mans 24 Hours with Jaguar.",
        "In Australia in 1996 his Jordan barrel-rolled several times; he climbed out unaided and ran back to the pits to take the restart in the spare car. After retiring he became a TV commentator, famous for his pre-race grid walks.",
      ],
    },
  },
  nannini: {
    es: {
      tagline: "Ganador con Benetton, apartado de la F1 por un accidente.",
      born: "Siena, Italia",
      text: [
        "De una familia de pasteleros de Siena y hermano de la cantante Gianna Nannini, debutó con Minardi en 1986. Con Benetton subió a su primer podio en Silverstone 1988 y ganó en Japón 1989, tras la descalificación de Ayrton Senna.",
        "En octubre de 1990, dos semanas después del Gran Premio de España, un accidente de helicóptero le seccionó el antebrazo derecho. Se lo reimplantaron y volvió a competir con éxito en turismos con Alfa Romeo, pero nunca regresó a la F1.",
      ],
    },
    en: {
      tagline: "A Benetton winner whose F1 career was cut short by an accident.",
      born: "Siena, Italy",
      text: [
        "From a family of Siena confectioners and the brother of singer Gianna Nannini, he made his debut with Minardi in 1986. With Benetton he took his first podium at Silverstone in 1988 and won in Japan in 1989, after Ayrton Senna's disqualification.",
        "In October 1990, two weeks after the Spanish Grand Prix, a helicopter crash severed his right forearm. It was surgically reattached and he went on to race successfully in touring cars with Alfa Romeo, but he never returned to F1.",
      ],
    },
  },
  herbert: {
    es: {
      tagline: "Tres victorias después de un accidente que casi le cuesta los pies.",
      born: "Brentwood, Inglaterra",
      text: [
        "En 1988, cuando era la gran promesa británica, un accidente en la Fórmula 3000 en Brands Hatch le destrozó los pies. Pocos meses después debutó en Brasil 1989 con Benetton, todavía sin poder caminar bien, y terminó cuarto.",
        "Con Benetton ganó en 1995 en Silverstone y en Monza, como compañero de Michael Schumacher, y en 1999 le dio a Stewart su única victoria, bajo la lluvia del Nürburgring. Después fue comentarista de televisión.",
      ],
    },
    en: {
      tagline: "Three wins after a crash that nearly cost him his feet.",
      born: "Brentwood, England",
      text: [
        "In 1988, when he was Britain's brightest prospect, a Formula 3000 crash at Brands Hatch shattered his feet. A few months later he made his debut in Brazil in 1989 with Benetton, still unable to walk properly, and finished fourth.",
        "With Benetton he won at Silverstone and Monza in 1995, as Michael Schumacher's team-mate, and in 1999 he gave Stewart its only win, in the rain at the Nürburgring. He later became a TV commentator.",
      ],
    },
  },
  verstappen: {
    es: {
      tagline: "El padre y mentor de Max Verstappen.",
      born: "Montfort, Países Bajos",
      text: [
        "Debutó en 1994 con Benetton como compañero de Michael Schumacher y ese año subió dos veces al podio, en Hungría y en Bélgica; también salió casi ileso de un incendio durante una parada en Hockenheim. Después corrió con equipos más modestos, como Arrows o Minardi, hasta 2003.",
        "En 2008 ganó la categoría LMP2 de las 24 Horas de Le Mans. Su mayor legado es su hijo Max, al que formó desde el karting y que se convirtió en campeón del mundo en 2021.",
      ],
    },
    en: {
      tagline: "Max Verstappen's father and mentor.",
      born: "Montfort, Netherlands",
      text: [
        "He made his debut in 1994 with Benetton as Michael Schumacher's team-mate and finished on the podium twice that year, in Hungary and Belgium; he also escaped almost unhurt from a pit-stop fire at Hockenheim. He then drove for smaller teams such as Arrows and Minardi until 2003.",
        "In 2008 he won the LMP2 class at the Le Mans 24 Hours. His greatest legacy is his son Max, whom he coached from karting onwards and who became world champion in 2021.",
      ],
    },
  },
  panis: {
    es: {
      tagline: "El ganador sorpresa de Mónaco 1996.",
      born: "Lyon, Francia",
      text: [
        "Campeón de la Fórmula 3000 en 1993, debutó con Ligier en 1994 y en su primera temporada fue segundo en Hockenheim. En Mónaco 1996, bajo la lluvia, ganó saliendo 14.º en una carrera en la que solo llegaron tres coches a la meta; fue la última victoria de Ligier.",
        "En 1997, con el equipo Prost, iba tercero en el campeonato cuando un accidente en Canadá le rompió las piernas. Volvió ese mismo año, corrió después con BAR y Toyota y se retiró en 2004.",
      ],
    },
    en: {
      tagline: "The surprise winner of Monaco 1996.",
      born: "Lyon, France",
      text: [
        "Formula 3000 champion in 1993, he made his debut with Ligier in 1994 and was second at Hockenheim in his first season. At Monaco in 1996, in the rain, he won from 14th on the grid in a race in which only three cars reached the finish; it was Ligier's last win.",
        "In 1997, with the Prost team, he was third in the championship when a crash in Canada broke his legs. He returned later that year, went on to drive for BAR and Toyota and retired in 2004.",
      ],
    },
  },
  ratzenberger: {
    es: {
      tagline: "Murió en Imola 1994, en su primera temporada en la F1.",
      born: "Salzburgo, Austria",
      text: [
        "Tras años en la Fórmula 3000 japonesa y en los coches deportivos, en los que fue un habitual de Le Mans, llegó a la F1 en 1994, con 33 años, en el modesto equipo Simtek. Disputó una sola carrera, el Gran Premio del Pacífico en Aida, y terminó 11.º.",
        "En la clasificación de Imola su coche perdió el alerón delantero a más de 300 km/h y se estrelló. Murió el sábado 30 de abril de 1994, un día antes que Ayrton Senna. Era el primer piloto que moría en un fin de semana de gran premio desde 1982.",
      ],
    },
    en: {
      tagline: "Killed at Imola in 1994, in his first F1 season.",
      born: "Salzburg, Austria",
      text: [
        "After years in Japanese Formula 3000 and sports cars, including regular Le Mans outings, he reached F1 in 1994, aged 33, with the small Simtek team. He started just one race, the Pacific Grand Prix at Aida, and finished 11th.",
        "In qualifying at Imola his car lost its front wing at more than 300 km/h and crashed. He died on Saturday 30 April 1994, a day before Ayrton Senna. He was the first driver to die at a Grand Prix weekend since 1982.",
      ],
    },
  },
  fisichella: {
    es: {
      tagline: "Tres victorias y la pole histórica de Force India.",
      born: "Roma, Italia",
      text: [
        "Debutó con Minardi en 1996 y con Jordan y Benetton subió varias veces al podio. Su primera victoria, en Brasil 2003 con Jordan, se la dieron días después: la carrera se detuvo por un accidente y, al revisar los datos, la FIA le dio el triunfo que había recibido Kimi Räikkönen.",
        "Con Renault ganó la primera carrera de 2005, en Australia, y otra en Malasia 2006, como compañero de Fernando Alonso. En 2009 logró en Spa la única pole de Force India y terminó segundo, y ese mismo año corrió con Ferrari las últimas carreras de la temporada.",
      ],
    },
    en: {
      tagline: "Three wins and Force India's historic pole.",
      born: "Rome, Italy",
      text: [
        "He made his debut with Minardi in 1996 and finished on the podium several times with Jordan and Benetton. His first win, in Brazil in 2003 with Jordan, was awarded days later: the race had been stopped after a crash and, on reviewing the data, the FIA gave him the victory that had gone to Kimi Räikkönen.",
        "With Renault he won the opening race of 2005, in Australia, and another in Malaysia in 2006, as Fernando Alonso's team-mate. In 2009 he took Force India's only pole at Spa and finished second, and that same year he drove for Ferrari in the final races of the season.",
      ],
    },
  },
  trulli: {
    es: {
      tagline: "El rey de la clasificación que ganó en Mónaco 2004.",
      born: "Pescara, Italia",
      text: [
        "Campeón del mundo de karting, debutó con Minardi en 1997 y ese mismo año llegó a liderar en Austria con Prost. Era tan rápido a una vuelta como difícil de adelantar: la fila de coches atascados detrás de él se conocía como el «tren Trulli».",
        "Su gran día llegó con Renault en Mónaco 2004: pole y victoria. Después le dio a Toyota su primera pole, en 2005, y se retiró en 2011 tras más de 250 grandes premios. También produce vino en los Abruzos, su región.",
      ],
    },
    en: {
      tagline: "The qualifying king who won at Monaco in 2004.",
      born: "Pescara, Italy",
      text: [
        "A world karting champion, he made his debut with Minardi in 1997 and that same year led in Austria with Prost. He was as quick over one lap as he was hard to pass: the queue of cars stuck behind him became known as the “Trulli train”.",
        "His great day came with Renault at Monaco in 2004: pole and victory. He then gave Toyota its first pole, in 2005, and retired in 2011 after more than 250 Grands Prix. He also makes wine in his home region of Abruzzo.",
      ],
    },
  },
  heidfeld: {
    es: {
      tagline: "Trece podios sin ninguna victoria.",
      born: "Mönchengladbach, Alemania",
      text: [
        "Campeón de la Fórmula 3000 en 1999, debutó con Prost en 2000 y se asentó en Sauber, con la que subió a su primer podio en Brasil 2001. En 2005 consiguió con Williams su única pole, en el Nürburgring.",
        "Con BMW Sauber vivió sus mejores años: en Canadá 2008 fue segundo detrás de su compañero Robert Kubica en el doblete del equipo. Terminó con 13 podios sin ganar ninguna carrera y se retiró en 2011, después de sustituir a Kubica en Renault.",
      ],
    },
    en: {
      tagline: "Thirteen podiums without a single win.",
      born: "Mönchengladbach, Germany",
      text: [
        "Formula 3000 champion in 1999, he made his debut with Prost in 2000 and settled in at Sauber, taking his first podium in Brazil in 2001. In 2005 he took his only pole, with Williams, at the Nürburgring.",
        "His best years came with BMW Sauber: in Canada in 2008 he was second behind team-mate Robert Kubica in the team's one-two. He finished with 13 podiums but no wins and retired in 2011, after standing in for Kubica at Renault.",
      ],
    },
  },
  sato: {
    es: {
      tagline: "Podio en la F1 y dos veces ganador de las 500 Millas de Indianápolis.",
      born: "Tokio, Japón",
      text: [
        "Campeón británico de F3 en 2001, debutó con Jordan en 2002 y en 2004, con BAR, fue tercero en Indianápolis: el primer podio de un japonés desde 1990. Después corrió con Super Aguri, con el que adelantó al McLaren de Fernando Alonso en Canadá 2007.",
        "Cuando Super Aguri cerró en 2008 se pasó a la IndyCar, donde ganó las 500 Millas de Indianápolis en 2017 y en 2020: fue el primer japonés en lograrlo.",
      ],
    },
    en: {
      tagline: "An F1 podium and two Indianapolis 500 wins.",
      born: "Tokyo, Japan",
      text: [
        "British F3 champion in 2001, he made his debut with Jordan in 2002 and in 2004, with BAR, finished third at Indianapolis: the first podium for a Japanese driver since 1990. He then drove for Super Aguri, passing Fernando Alonso's McLaren in Canada in 2007.",
        "When Super Aguri folded in 2008 he moved to IndyCar, where he won the Indianapolis 500 in 2017 and 2020: the first Japanese driver to do so.",
      ],
    },
  },
  kovalainen: {
    es: {
      tagline: "El piloto número 100 en ganar una carrera de F1.",
      born: "Suomussalmi, Finlandia",
      text: [
        "Debutó con Renault en 2007, como compañero de Giancarlo Fisichella, y subió al podio bajo la lluvia de Japón. En 2008 sustituyó a Fernando Alonso en McLaren y ganó en Hungría: fue el piloto número 100 en ganar una carrera del Mundial.",
        "Después pasó por los equipos nuevos de Lotus y Caterham, y en 2013 volvió para las dos últimas carreras con el Lotus de Kimi Räikkönen. En Japón ganó el campeonato Super GT en 2016.",
      ],
    },
    en: {
      tagline: "The 100th driver to win an F1 race.",
      born: "Suomussalmi, Finland",
      text: [
        "He made his debut with Renault in 2007, as Giancarlo Fisichella's team-mate, and finished on the podium in the rain in Japan. In 2008 he replaced Fernando Alonso at McLaren and won in Hungary: the 100th driver to win a world championship race.",
        "He then drove for the new Lotus and Caterham teams, and in 2013 came back for the final two races in Kimi Räikkönen's Lotus. In Japan he won the Super GT championship in 2016.",
      ],
    },
  },
  kobayashi: {
    es: {
      tagline: "Podio en casa en Suzuka 2012 y ganador de Le Mans.",
      born: "Amagasaki, Japón",
      text: [
        "Debutó con Toyota a final de 2009 sustituyendo a Timo Glock y llamó la atención enseguida por sus adelantamientos agresivos. Con Sauber fue uno de los pilotos más espectaculares de la parrilla y en 2012 fue tercero en su carrera de casa, en Suzuka.",
        "Tras un último año con Caterham en 2014 se pasó a la resistencia con Toyota: ganó las 24 Horas de Le Mans en 2021 y después pasó a dirigir el equipo.",
      ],
    },
    en: {
      tagline: "A home podium at Suzuka in 2012 and a Le Mans winner.",
      born: "Amagasaki, Japan",
      text: [
        "He made his debut with Toyota at the end of 2009, standing in for Timo Glock, and immediately caught the eye with his aggressive overtaking. At Sauber he was one of the most spectacular drivers on the grid and in 2012 he finished third at his home race, Suzuka.",
        "After a final year with Caterham in 2014 he switched to endurance racing with Toyota: he won the Le Mans 24 Hours in 2021 and then became the team's principal.",
      ],
    },
  },
  maldonado: {
    es: {
      tagline: "El venezolano que ganó en Barcelona 2012.",
      born: "Maracay, Venezuela",
      text: [
        "Campeón de la GP2 en 2010, debutó con Williams en 2011. En el Gran Premio de España de 2012 heredó la pole tras la descalificación de Lewis Hamilton y aguantó a Fernando Alonso para ganar: la primera victoria de Williams desde 2004 y la primera de un venezolano.",
        "Esa misma tarde un incendio en el garaje de Williams obligó a evacuar el box en plena celebración. Su fama de piloto rápido pero propenso a los accidentes lo acompañó hasta su última temporada, 2015, con Lotus.",
      ],
    },
    en: {
      tagline: "The Venezuelan who won in Barcelona in 2012.",
      born: "Maracay, Venezuela",
      text: [
        "GP2 champion in 2010, he made his debut with Williams in 2011. At the 2012 Spanish Grand Prix he inherited pole after Lewis Hamilton's exclusion and held off Fernando Alonso to win: Williams' first victory since 2004 and the first for a Venezuelan.",
        "That same afternoon a fire in the Williams garage forced the team to evacuate in the middle of the celebrations. His reputation as fast but accident-prone stayed with him until his final season, 2015, with Lotus.",
      ],
    },
  },
  jules_bianchi: {
    es: {
      tagline: "El talento de Ferrari que dio a Marussia sus primeros puntos.",
      born: "Niza, Francia",
      text: [
        "Nieto de Mauro Bianchi y sobrino nieto de Lucien Bianchi, ambos pilotos, se formó en la academia de Ferrari y debutó en 2013 con Marussia. En Mónaco 2014 terminó noveno y logró los primeros puntos del equipo.",
        "En Japón 2014, bajo la lluvia, se salió de la pista y chocó contra una grúa que retiraba otro coche. Murió en julio de 2015. Su accidente llevó a crear el coche de seguridad virtual y aceleró la llegada del halo. Era el padrino de Charles Leclerc.",
      ],
    },
    en: {
      tagline: "The Ferrari prospect who scored Marussia's first points.",
      born: "Nice, France",
      text: [
        "The grandson of Mauro Bianchi and great-nephew of Lucien Bianchi, both racing drivers, he came through the Ferrari academy and made his debut in 2013 with Marussia. At Monaco in 2014 he finished ninth to score the team's first points.",
        "In Japan in 2014, in the rain, he slid off the track and hit a recovery vehicle that was removing another car. He died in July 2015. His accident led to the virtual safety car and hastened the arrival of the halo. He was Charles Leclerc's godfather.",
      ],
    },
  },
  kvyat: {
    es: {
      tagline: "Podio con Red Bull antes de cederle su sitio a Verstappen.",
      born: "Ufá, Rusia",
      text: [
        "Debutó con Toro Rosso en 2014 y sumó puntos en su primera carrera, con 19 años. En 2015 subió a Red Bull, terminó el campeonato por delante de su compañero Daniel Ricciardo y fue segundo en Hungría.",
        "Tras chocar dos veces con Sebastian Vettel en Rusia 2016, Red Bull lo devolvió a Toro Rosso y le dio su sitio a Max Verstappen, que ganó en su primera carrera con el equipo. Kvyat volvió a la F1 en 2019 y fue tercero bajo la lluvia de Hockenheim.",
      ],
    },
    en: {
      tagline: "A Red Bull podium before giving up his seat to Verstappen.",
      born: "Ufa, Russia",
      text: [
        "He made his debut with Toro Rosso in 2014 and scored points in his first race, aged 19. In 2015 he moved up to Red Bull, finished the championship ahead of team-mate Daniel Ricciardo and was second in Hungary.",
        "After hitting Sebastian Vettel twice in Russia in 2016, Red Bull sent him back to Toro Rosso and gave his seat to Max Verstappen, who won on his first outing for the team. Kvyat returned to F1 in 2019 and finished third in the rain at Hockenheim.",
      ],
    },
  },
  de_vries: {
    es: {
      tagline: "Campeón de F2 y de Fórmula E, con puntos en su debut en Monza.",
      born: "Uitwellingerga, Países Bajos",
      text: [
        "Campeón de la Fórmula 2 en 2019 y de la Fórmula E en 2021 con Mercedes, debutó en la F1 de un día para otro en Monza 2022, sustituyendo en Williams a Alexander Albon, que tenía apendicitis: terminó noveno y sumó puntos.",
        "Esa actuación le valió un asiento en AlphaTauri para 2023, pero tras diez carreras sin puntuar el equipo lo sustituyó por Daniel Ricciardo. Después volvió a la Fórmula E y a la resistencia.",
      ],
    },
    en: {
      tagline: "F2 and Formula E champion, with points on his debut at Monza.",
      born: "Uitwellingerga, Netherlands",
      text: [
        "Formula 2 champion in 2019 and Formula E champion in 2021 with Mercedes, he made his F1 debut at a day's notice at Monza in 2022, standing in at Williams for Alexander Albon, who had appendicitis: he finished ninth and scored points.",
        "That performance earned him an AlphaTauri seat for 2023, but after ten races without points the team replaced him with Daniel Ricciardo. He then returned to Formula E and endurance racing.",
      ],
    },
  },
} satisfies Record<string, Record<"es" | "en", DriverStory>>);

export function driverStory(driverId: string, locale: string): DriverStory | undefined {
  return STORIES[driverId]?.[locale === "en" ? "en" : "es"];
}
