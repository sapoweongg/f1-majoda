// Descripciones de los equipos (es / en) para sus fichas y el índice de /teams.
// Son textos de historia: las cifras que cambian (títulos, victorias, pilotos actuales) las calcula
// cada página con datos de Jolpica, así que aquí solo van hechos cerrados para que no envejezcan.

export type TeamStory = {
  /** Una línea que resume el equipo (tarjetas del índice). */
  tagline: string;
  /** Sede o fábrica. */
  base?: string;
  /** Párrafos para la ficha del equipo. */
  text: string[];
};

const STORIES: Record<string, Record<"es" | "en", TeamStory>> = {
  // ---------- Parrilla actual ----------
  ferrari: {
    es: {
      tagline: "La única escudería presente en todas las temporadas desde 1950.",
      base: "Maranello, Italia",
      text: [
        "Enzo Ferrari fundó la Scuderia en 1929 para correr con Alfa Romeo y en 1947 empezó a construir sus propios coches. Desde el primer Mundial, en 1950, no se ha perdido ni una temporada: es el equipo más antiguo, el más laureado y el que despierta más pasión, con la marea roja de los tifosi en Monza como símbolo.",
        "Por Maranello pasaron Alberto Ascari, Juan Manuel Fangio, Niki Lauda y Jody Scheckter, pero su época dorada llegó con Michael Schumacher, Jean Todt y Ross Brawn: cinco títulos de pilotos seguidos entre 2000 y 2004. Kimi Räikkönen se coronó en 2007 y, en 2025, Lewis Hamilton se puso el mono rojo para perseguir su octavo campeonato.",
      ],
    },
    en: {
      tagline: "The only team to have raced in every season since 1950.",
      base: "Maranello, Italy",
      text: [
        "Enzo Ferrari founded the Scuderia in 1929 to race Alfa Romeos and began building his own cars in 1947. Since the first world championship in 1950 it has never missed a season: it is the oldest team, the most successful and the most passionate, with the red tide of tifosi at Monza as its emblem.",
        "Alberto Ascari, Juan Manuel Fangio, Niki Lauda and Jody Scheckter all won with Maranello, but its golden era came with Michael Schumacher, Jean Todt and Ross Brawn: five straight drivers' titles from 2000 to 2004. Kimi Räikkönen was crowned in 2007 and, in 2025, Lewis Hamilton pulled on the red overalls to chase an eighth title.",
      ],
    },
  },
  mercedes: {
    es: {
      tagline: "Las Flechas de Plata que dominaron la era híbrida.",
      base: "Brackley, Reino Unido",
      text: [
        "Mercedes-Benz debutó en 1954 con el mítico W196 y Juan Manuel Fangio ganó los títulos de 1954 y 1955 (el primero, tras empezar el año con Maserati). Después de la tragedia de Le Mans de 1955 la marca se retiró de la competición, y volvió a la Fórmula 1 como proveedor de motores en los años 90.",
        "En 2010 compró el equipo campeón, Brawn GP, con sede en Brackley. Con la llegada de los motores híbridos en 2014 firmó la racha más larga de la historia: ocho títulos de constructores seguidos hasta 2021, seis de pilotos para Lewis Hamilton y uno para Nico Rosberg.",
      ],
    },
    en: {
      tagline: "The Silver Arrows that dominated the hybrid era.",
      base: "Brackley, United Kingdom",
      text: [
        "Mercedes-Benz debuted in 1954 with the legendary W196, and Juan Manuel Fangio won the 1954 and 1955 titles (the first after starting the year with Maserati). After the 1955 Le Mans tragedy the brand withdrew from racing, returning to Formula 1 as an engine supplier in the 1990s.",
        "In 2010 it bought the reigning champions, Brawn GP, based in Brackley. When hybrid engines arrived in 2014 it put together the longest streak in history: eight consecutive constructors' titles up to 2021, six drivers' titles for Lewis Hamilton and one for Nico Rosberg.",
      ],
    },
  },
  mclaren: {
    es: {
      tagline: "El equipo de Bruce McLaren, del MP4/4 al papaya.",
      base: "Woking, Reino Unido",
      text: [
        "El neozelandés Bruce McLaren fundó el equipo en 1963 y debutó en Mónaco en 1966. Murió en 1970 probando un coche en Goodwood, pero el equipo siguió adelante y ganó sus primeros títulos con Emerson Fittipaldi (1974) y James Hunt (1976).",
        "Con Ron Dennis llegó la época dorada: Lauda, Prost, Senna y el McLaren-Honda MP4/4 de 1988, que ganó 15 de las 16 carreras. Mika Häkkinen (1998 y 1999) y Lewis Hamilton (2008) sumaron más coronas y, tras años difíciles, el equipo resurgió con su color papaya: campeón de constructores en 2024 y 2025, con Lando Norris campeón del mundo en 2025.",
      ],
    },
    en: {
      tagline: "Bruce McLaren's team, from the MP4/4 to papaya.",
      base: "Woking, United Kingdom",
      text: [
        "New Zealander Bruce McLaren founded the team in 1963 and debuted at Monaco in 1966. He died in 1970 while testing at Goodwood, but the team carried on and won its first titles with Emerson Fittipaldi (1974) and James Hunt (1976).",
        "Ron Dennis ushered in the golden era: Lauda, Prost, Senna and the 1988 McLaren-Honda MP4/4, which won 15 of 16 races. Mika Häkkinen (1998 and 1999) and Lewis Hamilton (2008) added more crowns and, after lean years, the team bounced back in papaya: constructors' champions in 2024 and 2025, with Lando Norris world champion in 2025.",
      ],
    },
  },
  red_bull: {
    es: {
      tagline: "De bebida energética a dinastía de campeones.",
      base: "Milton Keynes, Reino Unido",
      text: [
        "Red Bull compró el equipo Jaguar a finales de 2004 y debutó en 2005. Con Adrian Newey como diseñador ganó su primera carrera en China 2009, y entre 2010 y 2013 Sebastian Vettel encadenó cuatro títulos, todos acompañados del de constructores.",
        "La segunda era llegó con Max Verstappen, campeón de 2021 a 2024. En 2023 el RB19 ganó 21 de las 22 carreras, la temporada más dominante de la historia. Desde 2026 usa motores propios de Red Bull Powertrains, desarrollados junto a Ford.",
      ],
    },
    en: {
      tagline: "From energy drink to a dynasty of champions.",
      base: "Milton Keynes, United Kingdom",
      text: [
        "Red Bull bought the Jaguar team at the end of 2004 and debuted in 2005. With Adrian Newey as designer it won its first race in China in 2009, and from 2010 to 2013 Sebastian Vettel strung together four titles, each one paired with the constructors' crown.",
        "The second era came with Max Verstappen, champion from 2021 to 2024. In 2023 the RB19 won 21 of 22 races, the most dominant season in history. Since 2026 it has used its own Red Bull Powertrains engines, developed with Ford.",
      ],
    },
  },
  aston_martin: {
    es: {
      tagline: "Una marca de leyenda con raíces en Jordan.",
      base: "Silverstone, Reino Unido",
      text: [
        "Aston Martin ya había corrido en 1959 y 1960 sin éxito, pero su etapa actual empezó en 2021, cuando Lawrence Stroll rebautizó al equipo Racing Point. Detrás hay una larga historia en la misma fábrica frente a Silverstone: Jordan (1991), Midland, Spyker, Force India y Racing Point.",
        "Fernando Alonso llegó en 2023 y subió varias veces al podio. Desde entonces el proyecto creció con una fábrica nueva, el fichaje de Adrian Newey en 2025 y la alianza con Honda como motorista oficial desde 2026.",
      ],
    },
    en: {
      tagline: "A legendary marque with roots in Jordan.",
      base: "Silverstone, United Kingdom",
      text: [
        "Aston Martin had raced without success in 1959 and 1960, but its current era began in 2021, when Lawrence Stroll renamed the Racing Point team. Behind it lies a long history at the same factory opposite Silverstone: Jordan (1991), Midland, Spyker, Force India and Racing Point.",
        "Fernando Alonso arrived in 2023 and scored several podiums. The project has since grown with a new factory, the signing of Adrian Newey in 2025 and a works partnership with Honda from 2026.",
      ],
    },
  },
  alpine: {
    es: {
      tagline: "La marca deportiva de Renault en la fábrica de Enstone.",
      base: "Enstone, Reino Unido",
      text: [
        "La fábrica de Enstone ha cambiado de nombre muchas veces: Toleman (1981), Benetton (1986), Renault (2002), Lotus (2012), de nuevo Renault (2016) y Alpine desde 2021. Desde allí Michael Schumacher fue campeón en 1994 y 1995, y Fernando Alonso en 2005 y 2006.",
        "Como Alpine ganó el GP de Hungría de 2021 con Esteban Ocon. Renault cerró su programa de motores de Fórmula 1 a finales de 2025, así que desde 2026 el equipo usa unidades de potencia Mercedes.",
      ],
    },
    en: {
      tagline: "Renault's sports brand at the Enstone factory.",
      base: "Enstone, United Kingdom",
      text: [
        "The Enstone factory has changed names many times: Toleman (1981), Benetton (1986), Renault (2002), Lotus (2012), Renault again (2016) and Alpine since 2021. From there Michael Schumacher became champion in 1994 and 1995, and Fernando Alonso in 2005 and 2006.",
        "As Alpine it won the 2021 Hungarian GP with Esteban Ocon. Renault closed its Formula 1 engine programme at the end of 2025, so since 2026 the team has used Mercedes power units.",
      ],
    },
  },
  williams: {
    es: {
      tagline: "La escudería de Frank Williams, nueve veces campeona.",
      base: "Grove, Reino Unido",
      text: [
        "Frank Williams y el ingeniero Patrick Head fundaron Williams Grand Prix Engineering en 1977. En 1979 llegó la primera victoria, con Clay Regazzoni en Silverstone, y en 1980 Alan Jones le dio al equipo su primer título.",
        "Entre 1980 y 1997 sumó nueve títulos de constructores y siete de pilotos —Jones, Keke Rosberg, Nelson Piquet, Nigel Mansell, Alain Prost, Damon Hill y Jacques Villeneuve—, con coches tan avanzados como el FW14B de suspensión activa. La familia Williams vendió el equipo en 2020 y desde entonces trabaja para volver arriba.",
      ],
    },
    en: {
      tagline: "Frank Williams' team, nine-time champions.",
      base: "Grove, United Kingdom",
      text: [
        "Frank Williams and engineer Patrick Head founded Williams Grand Prix Engineering in 1977. The first win came in 1979, with Clay Regazzoni at Silverstone, and in 1980 Alan Jones gave the team its first title.",
        "Between 1980 and 1997 it won nine constructors' titles and seven drivers' titles —Jones, Keke Rosberg, Nelson Piquet, Nigel Mansell, Alain Prost, Damon Hill and Jacques Villeneuve— with cars as advanced as the active-suspension FW14B. The Williams family sold the team in 2020 and it has been working its way back ever since.",
      ],
    },
  },
  rb: {
    es: {
      tagline: "La cantera de Red Bull, heredera de Minardi.",
      base: "Faenza, Italia",
      text: [
        "En Faenza nació Minardi, el pequeño equipo italiano que llegó a la Fórmula 1 en 1985 y donde debutaron Fernando Alonso y Mark Webber. Red Bull lo compró en 2006 y lo convirtió en Toro Rosso, su escuela de pilotos: allí Sebastian Vettel ganó en Monza 2008 y Max Verstappen debutó con 17 años.",
        "Pasó a llamarse AlphaTauri en 2020 —Pierre Gasly ganó en Monza ese año—, RB en 2024 y Racing Bulls desde 2025. Sigue siendo el paso previo al equipo principal de Red Bull.",
      ],
    },
    en: {
      tagline: "Red Bull's academy team, heir to Minardi.",
      base: "Faenza, Italy",
      text: [
        "Faenza was home to Minardi, the small Italian team that reached Formula 1 in 1985 and gave debuts to Fernando Alonso and Mark Webber. Red Bull bought it in 2006 and turned it into Toro Rosso, its driver school: Sebastian Vettel won at Monza in 2008 and Max Verstappen debuted there aged 17.",
        "It became AlphaTauri in 2020 —Pierre Gasly won at Monza that year—, RB in 2024 and Racing Bulls from 2025. It remains the stepping stone to Red Bull's senior team.",
      ],
    },
  },
  haas: {
    es: {
      tagline: "El equipo estadounidense de Gene Haas.",
      base: "Kannapolis (EE. UU.) y Banbury (Reino Unido)",
      text: [
        "El empresario Gene Haas, dueño de un equipo de NASCAR, llevó a Estados Unidos de vuelta a la parrilla en 2016 con un modelo nuevo: comprar a Ferrari todas las piezas permitidas y concentrarse en el resto. Romain Grosjean sumó puntos en su primera carrera, en Australia.",
        "Su mejor año fue 2018, quinto en el campeonato de constructores, y en 2022 Kevin Magnussen logró la primera pole del equipo en Brasil. Desde 2024 tiene además una alianza técnica con Toyota.",
      ],
    },
    en: {
      tagline: "Gene Haas' American team.",
      base: "Kannapolis (USA) and Banbury (United Kingdom)",
      text: [
        "Businessman Gene Haas, owner of a NASCAR team, brought the United States back to the grid in 2016 with a new model: buy every permitted part from Ferrari and focus on the rest. Romain Grosjean scored points in its very first race, in Australia.",
        "Its best year was 2018, fifth in the constructors' championship, and in 2022 Kevin Magnussen took the team's first pole in Brazil. Since 2024 it has also had a technical partnership with Toyota.",
      ],
    },
  },
  audi: {
    es: {
      tagline: "El gigante alemán llega como equipo oficial.",
      base: "Hinwil, Suiza (motores en Neuburg, Alemania)",
      text: [
        "Audi debutó en 2026 tras comprar Sauber, el equipo suizo que Peter Sauber llevó a la Fórmula 1 en 1993. En Hinwil se formaron pilotos como Kimi Räikkönen y Charles Leclerc, y entre 2006 y 2009 el equipo fue BMW Sauber, con la victoria de Robert Kubica en Canadá 2008.",
        "Después corrió como Alfa Romeo (2019-2023) y Kick Sauber (2024-2025). Audi fabrica su propia unidad de potencia en Neuburg (Alemania), un proyecto pensado para el nuevo reglamento de motores de 2026.",
      ],
    },
    en: {
      tagline: "The German giant arrives as a works team.",
      base: "Hinwil, Switzerland (engines in Neuburg, Germany)",
      text: [
        "Audi debuted in 2026 after buying Sauber, the Swiss team Peter Sauber brought to Formula 1 in 1993. Hinwil was the proving ground for drivers such as Kimi Räikkönen and Charles Leclerc, and from 2006 to 2009 the team ran as BMW Sauber, winning in Canada in 2008 with Robert Kubica.",
        "It later raced as Alfa Romeo (2019-2023) and Kick Sauber (2024-2025). Audi builds its own power unit in Neuburg (Germany), a project designed around the new 2026 engine rules.",
      ],
    },
  },
  cadillac: {
    es: {
      tagline: "El undécimo equipo, con el respaldo de General Motors.",
      base: "Fishers (EE. UU.) y Silverstone (Reino Unido)",
      text: [
        "Cadillac llegó en 2026 como undécimo equipo de la parrilla, el primero nuevo desde Haas en 2016. Detrás están General Motors y TWG, tras años de negociaciones con la Fórmula 1 y la FIA.",
        "Para su debut apostó por la experiencia de Valtteri Bottas y Sergio Pérez, con motores Ferrari mientras General Motors desarrolla su propia unidad de potencia.",
      ],
    },
    en: {
      tagline: "The eleventh team, backed by General Motors.",
      base: "Fishers (USA) and Silverstone (United Kingdom)",
      text: [
        "Cadillac arrived in 2026 as the grid's eleventh team, the first new entry since Haas in 2016. It is backed by General Motors and TWG, after years of negotiations with Formula 1 and the FIA.",
        "For its debut it bet on the experience of Valtteri Bottas and Sergio Pérez, using Ferrari engines while General Motors develops its own power unit.",
      ],
    },
  },

  // ---------- Históricos ----------
  team_lotus: {
    es: {
      tagline: "La revolución técnica de Colin Chapman.",
      base: "Hethel, Reino Unido",
      text: [
        "Colin Chapman convirtió Lotus en el laboratorio de la Fórmula 1: el chasis monocasco del Lotus 25 (1962), el motor como parte del chasis en el Lotus 49 y el efecto suelo del Lotus 79 (1978). Ganó siete títulos de constructores entre 1963 y 1978 con Jim Clark, Graham Hill, Jochen Rindt, Emerson Fittipaldi y Mario Andretti, y allí logró Ayrton Senna sus primeras victorias.",
      ],
    },
    en: {
      tagline: "Colin Chapman's technical revolution.",
      base: "Hethel, United Kingdom",
      text: [
        "Colin Chapman turned Lotus into Formula 1's laboratory: the monocoque chassis of the Lotus 25 (1962), the engine as a stressed member in the Lotus 49 and the ground effect of the Lotus 79 (1978). It won seven constructors' titles between 1963 and 1978 with Jim Clark, Graham Hill, Jochen Rindt, Emerson Fittipaldi and Mario Andretti, and Ayrton Senna took his first wins there.",
      ],
    },
  },
  brabham: {
    es: {
      tagline: "El único piloto campeón con su propio coche.",
      text: [
        "Jack Brabham y Ron Tauranac fundaron el equipo en 1962, y en 1966 Brabham se convirtió en el único piloto campeón con un coche de su nombre; Denny Hulme repitió en 1967. Ya con Bernie Ecclestone como dueño y Gordon Murray como diseñador, Nelson Piquet fue campeón en 1981 y 1983. Corrió hasta 1992.",
      ],
    },
    en: {
      tagline: "The only driver to win the title in his own car.",
      text: [
        "Jack Brabham and Ron Tauranac founded the team in 1962, and in 1966 Brabham became the only driver to win the title in a car bearing his own name; Denny Hulme repeated in 1967. With Bernie Ecclestone as owner and Gordon Murray as designer, Nelson Piquet was champion in 1981 and 1983. It raced until 1992.",
      ],
    },
  },
  tyrrell: {
    es: {
      tagline: "El «tío Ken» y Jackie Stewart.",
      text: [
        "Ken Tyrrell pasó de vender madera a dirigir uno de los equipos más queridos del paddock. Con Jackie Stewart ganó los títulos de 1969 (con chasis Matra), 1971 y 1973, y en 1976 sorprendió con el P34 de seis ruedas. En 1998 lo compró British American Racing, el origen del actual Mercedes.",
      ],
    },
    en: {
      tagline: "'Uncle Ken' and Jackie Stewart.",
      text: [
        "Ken Tyrrell went from timber merchant to running one of the paddock's best-loved teams. With Jackie Stewart he won the 1969 (with a Matra chassis), 1971 and 1973 titles, and in 1976 he surprised everyone with the six-wheeled P34. In 1998 it was bought by British American Racing, the origin of today's Mercedes.",
      ],
    },
  },
  benetton: {
    es: {
      tagline: "Colores atrevidos y los primeros títulos de Schumacher.",
      text: [
        "La marca italiana de ropa compró Toleman en 1986. Con Flavio Briatore y Ross Brawn, Michael Schumacher ganó allí sus dos primeros títulos (1994 y 1995) y el equipo se llevó el de constructores en 1995. En 2002 se convirtió en Renault.",
      ],
    },
    en: {
      tagline: "Bold colours and Schumacher's first titles.",
      text: [
        "The Italian clothing brand bought Toleman in 1986. With Flavio Briatore and Ross Brawn, Michael Schumacher won his first two titles there (1994 and 1995) and the team took the 1995 constructors' crown. In 2002 it became Renault.",
      ],
    },
  },
  renault: {
    es: {
      tagline: "Pionera del turbo y campeona con Alonso.",
      text: [
        "Renault llevó el motor turbo a la Fórmula 1 en 1977 y ganó su primera carrera en 1979, en casa, con Jean-Pierre Jabouille. Como equipo oficial volvió en 2002 desde Enstone y Fernando Alonso le dio los títulos de pilotos y constructores de 2005 y 2006. Sus motores también impulsaron campeonatos de Williams, Benetton y Red Bull.",
      ],
    },
    en: {
      tagline: "Turbo pioneer and champion with Alonso.",
      text: [
        "Renault brought the turbo engine to Formula 1 in 1977 and won its first race in 1979, at home, with Jean-Pierre Jabouille. It returned as a works team in 2002 from Enstone and Fernando Alonso delivered the 2005 and 2006 drivers' and constructors' titles. Its engines also powered championships for Williams, Benetton and Red Bull.",
      ],
    },
  },
  brawn: {
    es: {
      tagline: "Un año, dos títulos.",
      text: [
        "Cuando Honda abandonó la Fórmula 1 a finales de 2008, Ross Brawn se quedó con el equipo por una libra y, con el famoso doble difusor, ganó en 2009 los títulos de pilotos (Jenson Button) y constructores. Fue su única temporada: al año siguiente se convirtió en Mercedes.",
      ],
    },
    en: {
      tagline: "One season, two titles.",
      text: [
        "When Honda pulled out of Formula 1 at the end of 2008, Ross Brawn took over the team for a pound and, with its famous double diffuser, won both the 2009 drivers' (Jenson Button) and constructors' titles. It was its only season: the following year it became Mercedes.",
      ],
    },
  },
  jordan: {
    es: {
      tagline: "El equipo irlandés de Eddie Jordan.",
      text: [
        "Eddie Jordan debutó en 1991 con un precioso coche verde y una sorpresa: el debut de Michael Schumacher en Spa. Su gran día llegó en Spa 1998, con doblete de Damon Hill y Ralf Schumacher, y en 1999 Heinz-Harald Frentzen peleó por el título. Es el origen del actual Aston Martin.",
      ],
    },
    en: {
      tagline: "Eddie Jordan's Irish team.",
      text: [
        "Eddie Jordan debuted in 1991 with a beautiful green car and a surprise: Michael Schumacher's debut at Spa. Its greatest day came at Spa in 1998, with a one-two for Damon Hill and Ralf Schumacher, and in 1999 Heinz-Harald Frentzen fought for the title. It is the origin of today's Aston Martin.",
      ],
    },
  },
  sauber: {
    es: {
      tagline: "El equipo suizo de Peter Sauber.",
      base: "Hinwil, Suiza",
      text: [
        "Peter Sauber llevó su equipo de Hinwil a la Fórmula 1 en 1993. Fue una gran escuela de pilotos —Kimi Räikkönen, Felipe Massa, Sergio Pérez y Charles Leclerc pasaron por allí— y, tras sus etapas como BMW Sauber, Alfa Romeo y Kick Sauber, se convirtió en Audi en 2026.",
      ],
    },
    en: {
      tagline: "Peter Sauber's Swiss team.",
      base: "Hinwil, Switzerland",
      text: [
        "Peter Sauber brought his Hinwil team to Formula 1 in 1993. It was a great driver school —Kimi Räikkönen, Felipe Massa, Sergio Pérez and Charles Leclerc all came through it— and, after spells as BMW Sauber, Alfa Romeo and Kick Sauber, it became Audi in 2026.",
      ],
    },
  },
  bmw_sauber: {
    es: {
      tagline: "La etapa alemana de Hinwil.",
      text: [
        "BMW compró Sauber en 2006 y en 2008 logró su única victoria con un doblete en Canadá: Robert Kubica por delante de Nick Heidfeld. La marca se retiró a finales de 2009.",
      ],
    },
    en: {
      tagline: "Hinwil's German chapter.",
      text: [
        "BMW bought Sauber in 2006 and in 2008 took its only win with a one-two in Canada: Robert Kubica ahead of Nick Heidfeld. The brand withdrew at the end of 2009.",
      ],
    },
  },
  toro_rosso: {
    es: {
      tagline: "La escuela de pilotos de Red Bull.",
      text: [
        "Red Bull compró Minardi en 2006 y lo rebautizó Toro Rosso. Allí Sebastian Vettel ganó bajo la lluvia de Monza 2008, entonces el ganador más joven de la historia, y Max Verstappen debutó en 2015 con 17 años. En 2020 pasó a llamarse AlphaTauri.",
      ],
    },
    en: {
      tagline: "Red Bull's driver school.",
      text: [
        "Red Bull bought Minardi in 2006 and renamed it Toro Rosso. Sebastian Vettel won there in the rain at Monza in 2008, then the youngest winner in history, and Max Verstappen debuted in 2015 aged 17. In 2020 it became AlphaTauri.",
      ],
    },
  },
  alphatauri: {
    es: {
      tagline: "Toro Rosso con nombre de marca de moda.",
      text: [
        "Entre 2020 y 2023 el equipo de Faenza llevó el nombre de la marca de ropa de Red Bull. Su gran momento fue la victoria de Pierre Gasly en Monza 2020. Después se llamó RB y Racing Bulls.",
      ],
    },
    en: {
      tagline: "Toro Rosso under a fashion label.",
      text: [
        "From 2020 to 2023 the Faenza team carried the name of Red Bull's clothing brand. Its finest hour was Pierre Gasly's win at Monza in 2020. It later became RB and Racing Bulls.",
      ],
    },
  },
  minardi: {
    es: {
      tagline: "El pequeño gran equipo de Faenza.",
      text: [
        "Giancarlo Minardi compitió con pocos medios entre 1985 y 2005 y se ganó el cariño de la afición. Allí debutaron Giancarlo Fisichella, Fernando Alonso y Mark Webber, que sumó puntos en su primera carrera, en Australia 2002. Red Bull lo compró y lo convirtió en Toro Rosso.",
      ],
    },
    en: {
      tagline: "Faenza's little big team.",
      text: [
        "Giancarlo Minardi raced on a shoestring from 1985 to 2005 and won the fans' hearts. Giancarlo Fisichella, Fernando Alonso and Mark Webber all debuted there, Webber scoring points in his first race in Australia in 2002. Red Bull bought it and turned it into Toro Rosso.",
      ],
    },
  },
  force_india: {
    es: {
      tagline: "El equipo indio de Vijay Mallya.",
      text: [
        "Nació en 2008 a partir de Spyker y destacó por sacar mucho de poco: Giancarlo Fisichella fue segundo en Spa 2009 y el equipo terminó cuarto en los campeonatos de 2016 y 2017. Los problemas económicos lo llevaron a la administración en 2018, de donde salió como Racing Point.",
      ],
    },
    en: {
      tagline: "Vijay Mallya's Indian team.",
      text: [
        "Born in 2008 out of Spyker, it was known for doing a lot with a little: Giancarlo Fisichella finished second at Spa in 2009 and the team was fourth in the 2016 and 2017 championships. Financial trouble took it into administration in 2018, from which it emerged as Racing Point.",
      ],
    },
  },
  racing_point: {
    es: {
      tagline: "El puente entre Force India y Aston Martin.",
      text: [
        "Lawrence Stroll rescató Force India en 2018 y el equipo corrió como Racing Point en 2019 y 2020. En 2020 Lance Stroll logró la pole en Turquía y Sergio Pérez ganó en Sakhir. En 2021 pasó a llamarse Aston Martin.",
      ],
    },
    en: {
      tagline: "The bridge between Force India and Aston Martin.",
      text: [
        "Lawrence Stroll rescued Force India in 2018 and the team raced as Racing Point in 2019 and 2020. In 2020 Lance Stroll took pole in Turkey and Sergio Pérez won in Sakhir. In 2021 it became Aston Martin.",
      ],
    },
  },
  alfa: {
    es: {
      tagline: "Las primeras campeonas del Mundial.",
      text: [
        "Alfa Romeo dominó los dos primeros campeonatos con su Alfetta: Nino Farina fue campeón en 1950 y Juan Manuel Fangio en 1951. Volvió como equipo oficial entre 1979 y 1985, y su nombre regresó a la parrilla de 2019 a 2023 en los coches de Sauber.",
      ],
    },
    en: {
      tagline: "The first world champions.",
      text: [
        "Alfa Romeo dominated the first two championships with its Alfetta: Nino Farina was champion in 1950 and Juan Manuel Fangio in 1951. It returned as a works team from 1979 to 1985, and its name came back to the grid from 2019 to 2023 on Sauber's cars.",
      ],
    },
  },
  cooper: {
    es: {
      tagline: "Los que pusieron el motor detrás del piloto.",
      text: [
        "Cooper demostró que el motor debía ir detrás del piloto: Stirling Moss logró en Argentina 1958 la primera victoria de un coche con motor trasero y Jack Brabham ganó los títulos de 1959 y 1960. Pronto toda la parrilla copió la idea.",
      ],
    },
    en: {
      tagline: "The team that put the engine behind the driver.",
      text: [
        "Cooper proved the engine belonged behind the driver: Stirling Moss took the first win for a rear-engined car in Argentina in 1958 and Jack Brabham won the 1959 and 1960 titles. Soon the whole grid copied the idea.",
      ],
    },
  },
  vanwall: {
    es: {
      tagline: "El primer campeón de constructores.",
      text: [
        "Tony Vandervell quería vencer a los coches italianos con uno británico y lo consiguió: en 1958 Vanwall ganó el primer campeonato de constructores de la historia, con Stirling Moss y Tony Brooks.",
      ],
    },
    en: {
      tagline: "The first constructors' champion.",
      text: [
        "Tony Vandervell wanted to beat the Italian cars with a British one, and he did: in 1958 Vanwall won the first constructors' championship in history, with Stirling Moss and Tony Brooks.",
      ],
    },
  },
  maserati: {
    es: {
      tagline: "El 250F de Fangio.",
      text: [
        "Maserati fue una de las grandes de los años 50. Con el elegante 250F, Juan Manuel Fangio ganó su quinto título en 1957, incluida su legendaria remontada en el Nürburgring. El equipo oficial se retiró a finales de ese año.",
      ],
    },
    en: {
      tagline: "Fangio's 250F.",
      text: [
        "Maserati was one of the powerhouses of the 1950s. With the elegant 250F, Juan Manuel Fangio won his fifth title in 1957, including his legendary comeback drive at the Nürburgring. The works team withdrew at the end of that year.",
      ],
    },
  },
  matra: {
    es: {
      tagline: "La aeronáutica francesa en la Fórmula 1.",
      text: [
        "La empresa aeroespacial Matra ganó el título de constructores de 1969 con el MS80, que Ken Tyrrell hacía correr para Jackie Stewart, campeón ese año. Fue el primer título de un constructor francés.",
      ],
    },
    en: {
      tagline: "French aerospace in Formula 1.",
      text: [
        "Aerospace company Matra won the 1969 constructors' title with the MS80, run by Ken Tyrrell for Jackie Stewart, champion that year. It was the first title for a French constructor.",
      ],
    },
  },
  march: {
    es: {
      tagline: "Un constructor nacido para vender coches.",
      text: [
        "March Engineering nació en 1969 —su nombre une las iniciales de sus fundadores, entre ellos Max Mosley y Robin Herd— y vendía chasis a muchos equipos. Ronnie Peterson ganó con un March en Monza 1976.",
      ],
    },
    en: {
      tagline: "A constructor built to sell cars.",
      text: [
        "March Engineering was founded in 1969 —its name combines its founders' initials, among them Max Mosley and Robin Herd— and sold chassis to many teams. Ronnie Peterson won in a March at Monza in 1976.",
      ],
    },
  },
  ligier: {
    es: {
      tagline: "El equipo azul de Francia.",
      text: [
        "Guy Ligier, exjugador de rugby y piloto, dirigió el equipo francés entre 1976 y 1996. Ganó nueve carreras, la última con Olivier Panis en el caótico Mónaco de 1996, y después se convirtió en Prost Grand Prix.",
      ],
    },
    en: {
      tagline: "France's blue team.",
      text: [
        "Guy Ligier, a former rugby player and racing driver, ran the French team from 1976 to 1996. It won nine races, the last with Olivier Panis in the chaotic 1996 Monaco GP, and then became Prost Grand Prix.",
      ],
    },
  },
  brm: {
    es: {
      tagline: "British Racing Motors.",
      text: [
        "BRM nació para demostrar el talento técnico británico y alcanzó su cima en 1962, cuando Graham Hill ganó los títulos de pilotos y constructores. Compitió hasta finales de los años 70.",
      ],
    },
    en: {
      tagline: "British Racing Motors.",
      text: [
        "BRM was created to showcase British engineering and reached its peak in 1962, when Graham Hill won the drivers' and constructors' titles. It raced until the late 1970s.",
      ],
    },
  },
  stewart: {
    es: {
      tagline: "La aventura de Jackie Stewart como dueño.",
      text: [
        "El tricampeón Jackie Stewart y su hijo Paul fundaron el equipo en 1997, con motores Ford. En solo tres temporadas ganó una carrera, con Johnny Herbert en el Nürburgring en 1999, antes de convertirse en Jaguar.",
      ],
    },
    en: {
      tagline: "Jackie Stewart's adventure as a team owner.",
      text: [
        "Three-time champion Jackie Stewart and his son Paul founded the team in 1997, with Ford engines. In just three seasons it won a race, with Johnny Herbert at the Nürburgring in 1999, before becoming Jaguar.",
      ],
    },
  },
  jaguar: {
    es: {
      tagline: "La etapa de Ford antes de Red Bull.",
      text: [
        "Ford compró Stewart y lo rebautizó Jaguar en 2000. Pese al prestigio de la marca solo logró dos podios, ambos con Eddie Irvine, y a finales de 2004 lo vendió a Red Bull.",
      ],
    },
    en: {
      tagline: "Ford's chapter before Red Bull.",
      text: [
        "Ford bought Stewart and renamed it Jaguar in 2000. Despite the brand's prestige it took only two podiums, both with Eddie Irvine, and at the end of 2004 it was sold to Red Bull.",
      ],
    },
  },
  toyota: {
    es: {
      tagline: "Mucho presupuesto, ninguna victoria.",
      text: [
        "Toyota llegó en 2002 con uno de los mayores presupuestos de la parrilla y su base en Colonia (Alemania). Logró varias poles y segundos puestos, pero se marchó a finales de 2009 sin ganar una carrera.",
      ],
    },
    en: {
      tagline: "Huge budget, no wins.",
      text: [
        "Toyota arrived in 2002 with one of the biggest budgets on the grid and a base in Cologne (Germany). It took several poles and second places, but left at the end of 2009 without winning a race.",
      ],
    },
  },
  honda: {
    es: {
      tagline: "El fabricante japonés como equipo propio.",
      text: [
        "Honda tuvo equipo propio en los años 60: Richie Ginther le dio su primera victoria en México 1965 y John Surtees ganó en Monza 1967. Volvió en 2006 al comprar BAR y Jenson Button ganó en Hungría ese año. Al retirarse en 2008, su equipo se convirtió en Brawn.",
      ],
    },
    en: {
      tagline: "The Japanese manufacturer as a works team.",
      text: [
        "Honda ran its own team in the 1960s: Richie Ginther gave it its first win in Mexico in 1965 and John Surtees won at Monza in 1967. It returned in 2006 by buying BAR, and Jenson Button won in Hungary that year. When it withdrew in 2008, its team became Brawn.",
      ],
    },
  },
  bar: {
    es: {
      tagline: "British American Racing.",
      text: [
        "BAR compró Tyrrell y debutó en 1999. Con motores Honda y Jenson Button fue segundo en el campeonato de constructores de 2004, aunque nunca llegó a ganar. Honda se quedó con el equipo en 2006.",
      ],
    },
    en: {
      tagline: "British American Racing.",
      text: [
        "BAR bought Tyrrell and debuted in 1999. With Honda engines and Jenson Button it finished second in the 2004 constructors' championship, though it never won a race. Honda took over the team in 2006.",
      ],
    },
  },
  prost: {
    es: {
      tagline: "El sueño de Alain Prost.",
      text: [
        "El tetracampeón compró Ligier y lo convirtió en Prost Grand Prix en 1997. Olivier Panis y Jarno Trulli lograron algunos podios, pero los problemas económicos cerraron el equipo a principios de 2002.",
      ],
    },
    en: {
      tagline: "Alain Prost's dream.",
      text: [
        "The four-time champion bought Ligier and turned it into Prost Grand Prix in 1997. Olivier Panis and Jarno Trulli scored a few podiums, but financial problems closed the team in early 2002.",
      ],
    },
  },
  arrows: {
    es: {
      tagline: "Récord de constancia sin victorias.",
      text: [
        "Arrows compitió 25 temporadas (1978-2002, de 1991 a 1996 como Footwork) sin ganar nunca una carrera. Estuvo a punto en Hungría 1997: Damon Hill lideraba y un fallo hidráulico lo relegó al segundo puesto en la última vuelta.",
      ],
    },
    en: {
      tagline: "A record of persistence without a win.",
      text: [
        "Arrows raced for 25 seasons (1978-2002, as Footwork from 1991 to 1996) without ever winning a race. It came close in Hungary in 1997: Damon Hill was leading when a hydraulic problem dropped him to second on the final lap.",
      ],
    },
  },
  wolf: {
    es: {
      tagline: "Ganó en su primera carrera.",
      text: [
        "El empresario Walter Wolf creó su equipo en 1977 y Jody Scheckter ganó la primera carrera, en Argentina. Ese año sumó tres victorias, pero el equipo solo duró hasta 1979.",
      ],
    },
    en: {
      tagline: "Won on its debut.",
      text: [
        "Businessman Walter Wolf created his team in 1977 and Jody Scheckter won its first race, in Argentina. It won three times that year, but the team only lasted until 1979.",
      ],
    },
  },
  shadow: {
    es: {
      tagline: "El equipo de negro.",
      text: [
        "El equipo estadounidense de Don Nichols corrió de 1973 a 1980 con sus coches negros. Su única victoria llegó en Austria 1977, con Alan Jones.",
      ],
    },
    en: {
      tagline: "The team in black.",
      text: [
        "Don Nichols' American team raced its black cars from 1973 to 1980. Its only win came in Austria in 1977, with Alan Jones.",
      ],
    },
  },
  hesketh: {
    es: {
      tagline: "Champán, osos de peluche y James Hunt.",
      text: [
        "Lord Alexander Hesketh montó un equipo tan festivo como rápido: con James Hunt ganó el GP de los Países Bajos de 1975, por delante del Ferrari de Niki Lauda.",
      ],
    },
    en: {
      tagline: "Champagne, teddy bears and James Hunt.",
      text: [
        "Lord Alexander Hesketh built a team as fun as it was fast: with James Hunt it won the 1975 Dutch GP, ahead of Niki Lauda's Ferrari.",
      ],
    },
  },
  penske: {
    es: {
      tagline: "El equipo de Roger Penske.",
      text: [
        "El gigante estadounidense de las carreras compitió en la Fórmula 1 a mediados de los años 70 y ganó una vez: John Watson, en Austria 1976.",
      ],
    },
    en: {
      tagline: "Roger Penske's team.",
      text: [
        "The American racing giant competed in Formula 1 in the mid-1970s and won once: John Watson, in Austria in 1976.",
      ],
    },
  },
  toleman: {
    es: {
      tagline: "Donde debutó Ayrton Senna.",
      text: [
        "Toleman corrió entre 1981 y 1985 y se le recuerda por el debut de Ayrton Senna en 1984, con su segundo puesto bajo la lluvia de Mónaco. En 1986 se convirtió en Benetton.",
      ],
    },
    en: {
      tagline: "Where Ayrton Senna debuted.",
      text: [
        "Toleman raced from 1981 to 1985 and is remembered for Ayrton Senna's 1984 debut season, including his second place in the rain at Monaco. In 1986 it became Benetton.",
      ],
    },
  },
  porsche: {
    es: {
      tagline: "Una victoria como constructor.",
      text: [
        "Porsche corrió como equipo oficial en 1961 y 1962 y ganó una carrera, con Dan Gurney en Francia 1962. Años después volvió como motorista y sus motores TAG dieron a McLaren los títulos de mediados de los 80.",
      ],
    },
    en: {
      tagline: "One win as a constructor.",
      text: [
        "Porsche raced as a works team in 1961 and 1962 and won one race, with Dan Gurney in France in 1962. Years later it returned as an engine supplier, and its TAG-badged engines powered McLaren's mid-1980s titles.",
      ],
    },
  },
  lancia: {
    es: {
      tagline: "El D50 que acabó en Ferrari.",
      text: [
        "Lancia llegó en 1954 con el innovador D50, pero tras la muerte de Alberto Ascari en 1955 cedió sus coches a Ferrari. Con ellos, Fangio ganó el título de 1956.",
      ],
    },
    en: {
      tagline: "The D50 that ended up at Ferrari.",
      text: [
        "Lancia arrived in 1954 with the innovative D50, but after Alberto Ascari's death in 1955 it handed its cars to Ferrari. Fangio won the 1956 title with them.",
      ],
    },
  },
  eagle: {
    es: {
      tagline: "Dan Gurney y su propio coche.",
      text: [
        "Dan Gurney creó Anglo American Racers y en 1967 ganó el GP de Bélgica con su Eagle, uno de los coches más bonitos de la historia. Una semana antes había ganado las 24 Horas de Le Mans.",
      ],
    },
    en: {
      tagline: "Dan Gurney and his own car.",
      text: [
        "Dan Gurney founded Anglo American Racers and in 1967 won the Belgian GP in his Eagle, one of the most beautiful cars ever built. A week earlier he had won the Le Mans 24 Hours.",
      ],
    },
  },
  fittipaldi: {
    es: {
      tagline: "El equipo brasileño de los hermanos Fittipaldi.",
      text: [
        "Wilson y Emerson Fittipaldi crearon el único equipo brasileño de la historia, con el patrocinio de Copersucar. Corrió de 1975 a 1982 y su mejor resultado fue el segundo puesto de Emerson en Brasil 1978.",
      ],
    },
    en: {
      tagline: "The Fittipaldi brothers' Brazilian team.",
      text: [
        "Wilson and Emerson Fittipaldi created the only Brazilian team in history, sponsored by Copersucar. It raced from 1975 to 1982 and its best result was Emerson's second place in Brazil in 1978.",
      ],
    },
  },
  super_aguri: {
    es: {
      tagline: "El equipo satélite de Honda.",
      text: [
        "Aguri Suzuki creó el equipo en 2006 con el apoyo de Honda. Takuma Sato emocionó en Canadá 2007 adelantando a Fernando Alonso para terminar sexto. Cerró en 2008 por falta de dinero.",
      ],
    },
    en: {
      tagline: "Honda's satellite team.",
      text: [
        "Aguri Suzuki founded the team in 2006 with Honda's backing. Takuma Sato thrilled fans in Canada in 2007 by passing Fernando Alonso to finish sixth. It closed in 2008 after running out of money.",
      ],
    },
  },
  spyker: {
    es: {
      tagline: "Una temporada con bandera neerlandesa.",
      text: ["El fabricante neerlandés de deportivos compró Midland y corrió en 2007. Al año siguiente el equipo se convirtió en Force India."],
    },
    en: {
      tagline: "One season under the Dutch flag.",
      text: ["The Dutch sports car maker bought Midland and raced in 2007. The following year the team became Force India."],
    },
  },
  mf1: {
    es: {
      tagline: "El sucesor de Jordan.",
      text: ["Midland compró Jordan y corrió en 2006 antes de venderse a Spyker. Es un eslabón más de la historia que hoy continúa Aston Martin."],
    },
    en: {
      tagline: "Jordan's successor.",
      text: ["Midland bought Jordan and raced in 2006 before selling to Spyker. It is one more link in the story that Aston Martin continues today."],
    },
  },
  virgin: {
    es: {
      tagline: "Diseñado en el ordenador.",
      text: ["Virgin Racing debutó en 2010 con un coche diseñado solo con simulación por ordenador, sin túnel de viento. En 2012 pasó a llamarse Marussia."],
    },
    en: {
      tagline: "Designed on a computer.",
      text: ["Virgin Racing debuted in 2010 with a car designed entirely through computer simulation, without a wind tunnel. In 2012 it became Marussia."],
    },
  },
  marussia: {
    es: {
      tagline: "Los puntos de Jules Bianchi en Mónaco.",
      text: [
        "Marussia (2012-2015) vivió su mejor día en Mónaco 2014, cuando Jules Bianchi sumó los primeros puntos del equipo. Tras el grave accidente de Bianchi en Japón ese mismo año, el equipo resistió y en 2016 corrió como Manor.",
      ],
    },
    en: {
      tagline: "Jules Bianchi's points at Monaco.",
      text: [
        "Marussia (2012-2015) had its best day at Monaco in 2014, when Jules Bianchi scored the team's first points. After Bianchi's serious accident in Japan that same year, the team survived and raced as Manor in 2016.",
      ],
    },
  },
  manor: {
    es: {
      tagline: "La última temporada.",
      text: ["Manor corrió en 2016, su última temporada, con Pascal Wehrlein sumando un punto en Austria."],
    },
    en: {
      tagline: "The final season.",
      text: ["Manor raced in 2016, its final season, with Pascal Wehrlein scoring a point in Austria."],
    },
  },
  hrt: {
    es: {
      tagline: "Hispania Racing, el equipo español.",
      text: [
        "Nacido del proyecto de Adrián Campos, el equipo español debutó en 2010 con Karun Chandhok y Bruno Senna. Corrió tres temporadas y cerró en 2012 sin sumar puntos.",
      ],
    },
    en: {
      tagline: "Hispania Racing, the Spanish team.",
      text: [
        "Born from Adrián Campos' project, the Spanish team debuted in 2010 with Karun Chandhok and Bruno Senna. It raced for three seasons and closed in 2012 without scoring a point.",
      ],
    },
  },
  lotus_racing: {
    es: {
      tagline: "El regreso del nombre Lotus.",
      text: ["El equipo malasio de Tony Fernandes recuperó el nombre de Lotus en 2010 y 2011. En 2012 pasó a llamarse Caterham."],
    },
    en: {
      tagline: "The return of the Lotus name.",
      text: ["Tony Fernandes' Malaysian team revived the Lotus name in 2010 and 2011. In 2012 it became Caterham."],
    },
  },
  caterham: {
    es: {
      tagline: "El equipo de Tony Fernandes.",
      text: ["Caterham (2012-2014), antes Lotus Racing, era el equipo del empresario malasio Tony Fernandes. No logró sumar puntos y cerró a finales de 2014."],
    },
    en: {
      tagline: "Tony Fernandes' team.",
      text: ["Caterham (2012-2014), formerly Lotus Racing, was Malaysian businessman Tony Fernandes' team. It never scored a point and closed at the end of 2014."],
    },
  },
  lotus_f1: {
    es: {
      tagline: "Enstone vestido de negro y oro.",
      text: [
        "Entre 2012 y 2015 el equipo de Enstone corrió como Lotus, con su librea negra y dorada. Kimi Räikkönen ganó en Abu Dabi 2012 y en Australia 2013.",
      ],
    },
    en: {
      tagline: "Enstone in black and gold.",
      text: ["From 2012 to 2015 the Enstone team raced as Lotus, in black and gold. Kimi Räikkönen won in Abu Dhabi in 2012 and in Australia in 2013."],
    },
  },
};

/** Ids de Jolpica que comparten historia (los chasis-motor como "lotus-climax" usan la parte base). */
const ALIAS: Record<string, string> = {
  lotus: "team_lotus",
  footwork: "arrows",
  spyker_mf1: "spyker",
};

export function teamStory(constructorId: string, locale: string): TeamStory | undefined {
  const lang = locale === "en" ? "en" : "es";
  const base = constructorId.split("-")[0];
  const key = [constructorId, base, ALIAS[constructorId], ALIAS[base]].find((k) => k && STORIES[k]);
  return key ? STORIES[key][lang] : undefined;
}
