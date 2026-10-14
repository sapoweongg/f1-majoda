@AGENTS.md

# F1 Majoda — contexto del proyecto

Dashboard de Fórmula 1 en español e inglés. Web pública: https://f1-majoda.vercel.app · Repo privado: `sapoweongg/f1-majoda` (GitHub). Cada push a `main` se publica solo en Vercel (cuenta `sapoweongg`, plan Hobby). El usuario habla español: responde en español.

## Trabajo en dos PCs (sincronización por GitHub)

El usuario trabaja en este proyecto desde dos computadores. Para que los avances se vean en ambos:

1. **Al empezar cada sesión**, antes de tocar nada: `git pull --rebase origin main` (si hay cambios locales sin subir, súbelos o pregúntale primero).
2. **Al terminar cada cambio que funcione** (tipos, lint y pruebas en verde): commit + `git push origin main`, sin esperar a que lo pida. Eso también lo publica en Vercel.
3. Si el push es rechazado porque el otro PC subió algo: `git pull --rebase origin main`, resolver conflictos si los hay y volver a subir.
4. **La memoria compartida es este archivo.** El historial de chat y la memoria local de Claude no viajan entre PCs: cuando se tome una decisión importante o quede algo pendiente, anótalo aquí (sección "Pendiente / ideas" o la que corresponda) en el mismo commit.

## Antes de commitear en un PC nuevo

Vercel Hobby **bloquea** los despliegues de commits cuyo autor no sea el dueño (repo privado). En cada PC, configura la identidad solo para este repo:

```bash
git config user.name "sapoweongg"
git config user.email "286494681+sapoweongg@users.noreply.github.com"
```

## Stack

Next.js 16 (App Router, Turbopack, `src/proxy.ts` en lugar de middleware), React 19, TypeScript, Tailwind CSS 4, next-intl 4 (`/es` por defecto y `/en`; textos en `messages/*.json`), Recharts 3, motion, SWR, Supabase (opcional), Vitest. **No** se usa `cacheComponents`: la caché va con `unstable_cache` en `src/lib/api/fetcher.ts` (`cachedJson`, con throttle solo cuando no hay caché).

Comandos: `npm run dev`, `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`.

## Datos (src/lib/api)

- **Jolpica-F1** (`jolpica.ts`): calendario, resultados y clasificaciones desde 1950. Límite 4 req/s y 500 req/h. Las clasificaciones históricas exigen la temporada en la URL (no hay "todas a la vez"); los campeones 1950–2025 están en `src/data/champions.json` (`scripts/build-champions.mjs`) y el índice de pilotos del buscador de `/drivers` en `src/data/drivers.json` (`scripts/build-drivers.mjs`; las temporadas posteriores a `through` se suman en tiempo real en `src/lib/drivers.ts`). Las clasificaciones finales de todas las temporadas cerradas, por piloto y por equipo, están en `src/data/standings.json` (`scripts/build-standings.mjs`, leído con `src/lib/standings.ts`): las fichas solo piden a la API las posteriores.
  - Las clasificaciones (qualifying) solo existen desde 1994, con huecos hasta 2002, y el filtro `/qualifying/1` devuelve filas que no son P1. Por eso las **poles se cuentan con la parrilla** (`isPole` en `src/lib/poles.ts`), que coincide con las cifras oficiales, y el cara a cara en clasificación usa la parrilla cuando falta la clasificación.
  - En 9 carreras de 1951–1964 hay dos pilotos con `grid` 1: en los años 50 se cambiaban de coche en carrera y el que se subía al del poleman hereda su salida (más un error en Monza 1952 con Moss). `isPole` mira todas las filas del piloto (cuenta la pole aunque ganara con otro coche, como Fangio) y descarta esas herencias: Fangio 29, Moss 16, Castellotti 1.
- **OpenF1** (`openf1.ts`): datos desde 2023 (telemetría, neumáticos, clima, radios, fotos de pilotos). Responde **404 cuando no hay resultados** → se trata como lista vacía. Los datos de una sesión se piden con la sesión (`SessionRef`, clave y hora de fin): hasta 3 h después del final se guardan 2 minutos en una entrada "provisional" y luego un día en otra "final". Tienen que ser entradas distintas porque Next decide si una entrada caducó con el tiempo de quien la pide. El tiempo real es de pago: se activa con `OPENF1_USERNAME/PASSWORD`; sin eso `/live` muestra la repetición de la última carrera.
- **Wikimedia** (`wikimedia.ts`): fotos libres con autor y licencia. Exige User-Agent y consultas agrupadas (si no, 429).
- **Open-Meteo** (`weather.ts`): pronóstico.
- Trazados: `src/data/circuits.json` (julesr0y/f1-circuits-svg, CC BY 4.0). Mapa: `public/world.svg`.

## Imágenes

Todo pasa por `src/lib/media.ts`: fotos, coches, logos y retratos de cuerpo entero del CDN oficial de F1 (el usuario aceptó usarlos; se apagan con `NEXT_PUBLIC_OFFICIAL_MEDIA=false`). Ojo: cuando un recorte no existe, el CDN responde 200 con una imagen en blanco y la cabecera `X-Cld-Error`; `src/lib/photos.ts` lo comprueba (`imageExists`, caché de una semana) y prueba el formato nuevo (`driverHeadshot`). Fotos de Commons siempre con crédito. No usar fotos de agencias (Getty, Red Bull Content Pool).

## Páginas especiales

- **`/max-2023`**: homenaje a la temporada 2023 de Max Verstappen (récords, racha, 22 carreras, momentos, galería y 14 radios oficiales postcarrera en `src/data/max2023-radios.json`). Textos en `src/content/max2023.ts`. Se entra desde el 2023 de la ficha de Max (etiqueta "★ Histórico"). Se genera en cada visita (`force-dynamic`) para que un fallo de la API en el build no quede guardado.
- **`/max-2021`**: el primer título de Max, contado desde su lado (14 oct 2026).
  - Secciones: marcador final, cifras, "La balanza" (ventaja en puntos sobre Hamilton tras cada carrera), carrera a carrera con el resultado de los dos, "Golpes que no lo frenaron", momentos, "Vuelta 58" (Abu Dabi), radios (siempre después del final de Abu Dabi, que es lo más importante; igual en la de Hamilton), lo que significó y galería.
  - Textos en `src/content/max2021.ts`; datos del duelo en `src/lib/duel2021.ts` (compartidos con la futura página de Hamilton).
  - Gráfico: `src/components/special/GapChart.tsx`. Colores de datos validados con el validador de dataviz sobre el fondo oscuro: Max `#e06c00` y Hamilton `#00a991`. El acento de la página es el naranja `#ff8000`.
  - Fotos libres de 2021 de Commons (Lukas Raich, rsyphotography, Grahampurse, Jen Ross). No hay retratos oficiales de 2021 en el CDN de F1.
- **`/hamilton-2021`**: la misma temporada contada desde el lado de Hamilton (14 oct 2026).
  - Negro de Mercedes y turquesa `#00d7b6`, con un 44 gigante.
  - Secciones propias: "100 y 100" (su pole y su victoria número 100), "La remontada" (de Brasil a Abu Dabi) y "Con la cabeza alta" (Abu Dabi desde su lado, el relevo del director de carrera y su nombramiento como caballero).
  - En la balanza, hacia arriba es Hamilton. Los colores de datos son los mismos que en la de Max: el color sigue al piloto.
  - Textos en `src/content/hamilton2021.ts`.
- Radios de 2021 en `src/data/duel2021-radios.json`: 10 de Max y 8 de Hamilton, del archivo oficial de live timing (`livetiming.formula1.com/static/2021/...`).
  - Se eligieron por hora: la primera radio tras la bandera a cuadros de cada carrera clave, y la de Max justo después del reventón de Bakú. No se escucharon, por eso los títulos describen el momento y no lo que dicen.
  - Ojo: la hora del nombre del archivo va en hora de Reino Unido (verano, de abril a octubre, = UTC+1). La fiable es el campo `Utc` del stream, unos 40 s posterior a la grabación.
  - En Brasil y Catar el archivo se corta antes del final de carrera: no hay radios de después de la meta.
- Las dos páginas de 2021 comparten `src/components/special/Duel2021Parts.tsx`: parrilla carrera a carrera, momentos, tarjetas y radios. Cada página elige su lado (`me`), su acento y su fondo.
- Las páginas especiales se enlazan desde la ficha del piloto con `SPECIAL_SEASONS` (`src/lib/special-pages.ts`), que pone la etiqueta "Histórico" en ese año.
- Piezas comunes de las páginas especiales en `src/components/special/` (`SectionTitle`, `PhotoBanner`, `CountUp`, `RevealOnView`, `RadioCard`, `GapChart`).
- **`/parc-ferme`**: easter egg **secreto**. Carta romántica para María José ("Mi campeonato más importante"), solo enlazada desde el **2025** de la ficha de Max, que se ve igual que los demás años. Incluye el recuerdo del martes 29 de septiembre en el noveno piso, la firma "Tu foquita 🦭 / tu corazón, siempre" (así le dice ella) y una posdata de F1. Ella le dice a él "mi corazón" o "foquita"; él a ella "pollito". Reglas: no aparece en el sitemap, `noindex`, y **los commits que la toquen llevan mensajes neutros** (p. ej. "Pequeñas mejoras de estilo").
- El footer dice, en texto pequeño: "proyecto dedicado a ti mj".

## Convenciones

- Componentes de servidor por defecto; los cliente llevan `"use client"`. No pasar funciones a componentes cliente (p. ej. `LineSeriesChart` recibe `format="laptime"`, no una función).
- La hora actual en el servidor se toma con `serverNow()` (`src/lib/clock.ts`); las horas locales del visitante con `<LocalTime>`.
- Colores de equipo en `src/lib/teams.ts`; compañeros de equipo en discontinua en los gráficos.

## Pendiente / ideas

- Valoraciones: crear proyecto en Supabase, ejecutar `supabase/schema.sql` y cargar `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` y `RATINGS_SALT` en Vercel.
- Timing en tiempo real: suscripción de OpenF1 + credenciales en Vercel.
- Foto de las 10 victorias seguidas en Monza: solo si el usuario aporta una imagen con permiso de uso.
- Perfiles de pilotos (`src/content/drivers.ts`, es/en):
  - Hechos: los 22 de la parrilla de 2026, los 31 campeones históricos (9 oct 2026) y 65 pilotos destacados sin título (14 oct 2026), de Froilán González a Nyck de Vries. Son 118 perfiles en total.
  - Los lugares de nacimiento se comprobaron con Wikidata.
  - En 2026 Hadjar se perdió tres carreras (rondas 12–14) por lesión: Lawson subió a Red Bull y Tsunoda corrió con Racing Bulls. Está en los perfiles de Lawson y Tsunoda.
  - Siguiente paso posible: pilotos recientes con menos recorrido (Sargeant, Doohan, Mazepin, Latifi, Giovinazzi, Vandoorne…) o perfiles de los equipos que aún no tienen historia.
  - La ficha muestra el perfil y una tarjeta de hitos (lugar de nacimiento, debut, primer podio, primera victoria y primera pole). Los hitos se calculan de los resultados, así que salen para cualquier piloto aunque no tenga perfil.
  - Como en los equipos, solo hechos cerrados, comprobados con la API: nada de cifras que caduquen.
- Cuando termine 2026, regenerar los archivos de `src/data` con ese año:
  - `node scripts/build-champions.mjs`
  - `build-drivers.mjs 2026`, `build-teams.mjs 2026`, `build-races.mjs 2026` y `build-standings.mjs 2026`
  - Mientras tanto, las temporadas posteriores al archivo se piden a la API.

### Revisión de navegación y UX (2 oct 2026)

**Hecho:**
- Errores corregidos: orden de carreras, campeonato del inicio y fotos.
- Índices con buscador: `/drivers`, `/teams` (con historia de cada equipo en `src/content/teams.ts`) y `/circuits`.
- Buscador general del menú (Ctrl+K, `/api/search-index/[locale]`).
- Menú reorganizado: Carreras con pestaña Calendario, desplegable Análisis, Valoraciones oculta sin Supabase y punto de En vivo real (`/api/live-status`).
- Página de carrera:
  - GP anterior/siguiente y tabla compacta en el móvil.
  - Estados traducidos (`src/lib/status.ts`).
  - Vista previa de GPs futuros.
- Nombres de GP en español (`src/lib/gp-names.ts`) y números y países con el formato del idioma.
- Enlaces entre fichas (piloto → equipo y comparar).

- Telemetría: esqueleto "Cargando…" hasta que Recharts dibuja (regla `.chart-panel` en `globals.css`, fuera de las capas para ganar a las utilidades).
- Mensajes de dirección de carrera traducidos (`src/lib/race-control.ts`): patrones para los fijos y frases para los de comisarios; lo desconocido queda en inglés.

**Notas:**
- La torre de `/live` no muestra fotos (el campo `headshot` existe pero no se pinta), así que no hace falta comprobar recortes ahí.
- Criterio único de "sesión en vivo": `isLiveWindow` de `src/lib/live.ts`.

### Auditoría de errores (5 oct 2026)

**Arreglado:**
- Poles (ficha y Comparar) contados con la parrilla.
- Cara a cara en clasificación: usa la parrilla cuando falta la clasificación.
- Fichas de piloto y equipo con todas las temporadas y la mejor posición real (`standings.json`).
- Caché de OpenF1 separada en provisional y final.
- "Bahrain Grand Prix in Malaysia" → "Gran Premio de Baréin en Malasia" (`gp-names.ts` traduce "X Grand Prix in Y").
- Sin Supabase:
  - el inicio ya no muestra "Valora esta carrera";
  - el pie ya no lleva el aviso de privacidad;
  - `/ratings` da 404.
- Página de carrera:
  - "Sin datos" se distingue de "aún no se ha disputado" y de "se publicarán en breve".
  - Las paradas con bandera roja salen en minutos y bien ordenadas.
  - Dirección de carrera solo con lo importante (`isKeyMessage`): safety car, banderas de toda la pista y comisarios. Quedan fuera las amarillas de sector, las azules y los tiempos anulados.
- Repetición de `/live`: usa el mismo filtro y ya no marca la pista en verde cuando se despeja un solo sector con el safety car en pista.
- Comparar: un valor que falta ya no cuenta como el mejor.
- Índices y buscador:
  - "En activo" usa la última temporada con datos, así que no queda vacío en pretemporada.
  - La búsqueda por año respeta los huecos de una trayectoria (`gapYears`).
- Traducciones: la sesión en el aviso de En vivo y el estado en el podio del inicio.

**Queda (decidido no tocar por ahora):**
- Las rutas inexistentes responden 200 con `noindex`, no 404, por el `loading.tsx` global. Google no las indexa, y quitarlo dejaría todas las páginas sin animación de carga.
- `/max-2023` se genera en cada visita (unos 3,6 s).
