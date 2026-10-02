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

- **Jolpica-F1** (`jolpica.ts`): calendario, resultados y clasificaciones desde 1950. Límite 4 req/s y 500 req/h. Las clasificaciones históricas exigen la temporada en la URL (no hay "todas a la vez"); los campeones 1950–2025 están en `src/data/champions.json` (`scripts/build-champions.mjs`) y el índice de pilotos del buscador de `/drivers` en `src/data/drivers.json` (`scripts/build-drivers.mjs`; las temporadas posteriores a `through` se suman en tiempo real en `src/lib/drivers.ts`).
- **OpenF1** (`openf1.ts`): datos desde 2023 (telemetría, neumáticos, clima, radios, fotos de pilotos). Responde **404 cuando no hay resultados** → se trata como lista vacía. El tiempo real es de pago: se activa con `OPENF1_USERNAME/PASSWORD`; sin eso `/live` muestra la repetición de la última carrera.
- **Wikimedia** (`wikimedia.ts`): fotos libres con autor y licencia. Exige User-Agent y consultas agrupadas (si no, 429).
- **Open-Meteo** (`weather.ts`): pronóstico.
- Trazados: `src/data/circuits.json` (julesr0y/f1-circuits-svg, CC BY 4.0). Mapa: `public/world.svg`.

## Imágenes

Todo pasa por `src/lib/media.ts`: fotos, coches, logos y retratos de cuerpo entero del CDN oficial de F1 (el usuario aceptó usarlos; se apagan con `NEXT_PUBLIC_OFFICIAL_MEDIA=false`). Ojo: cuando un recorte no existe, el CDN responde 200 con una imagen en blanco y la cabecera `X-Cld-Error`; `src/lib/photos.ts` lo comprueba (`imageExists`, caché de una semana) y prueba el formato nuevo (`driverHeadshot`). Fotos de Commons siempre con crédito. No usar fotos de agencias (Getty, Red Bull Content Pool).

## Páginas especiales

- **`/max-2023`**: homenaje a la temporada 2023 de Max Verstappen (récords, racha, 22 carreras, momentos, galería y 14 radios oficiales postcarrera en `src/data/max2023-radios.json`). Textos en `src/content/max2023.ts`. Se entra desde el 2023 de la ficha de Max (etiqueta "★ Histórico"). Se genera en cada visita (`force-dynamic`) para que un fallo de la API en el build no quede guardado.
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

### Revisión de navegación y UX (2 oct 2026)

Plan acordado con el usuario, en orden:
1. Los tres errores visibles. **Hecho.**
2. Página de Pilotos. **Hecho.** Faltan los índices de Equipos y Circuitos.
3. Buscador global en el menú.
4. Reordenar el menú.
5. Mejoras de la página de carrera y enlaces entre fichas.

**Hecho el 2 oct 2026:**
- `allRaces` ordenaba solo por ronda. Ahora usa `mergeRacePages` y ordena por temporada y ronda.
- El inicio decide "pretemporada" con el calendario, no porque la clasificación llegue vacía.
- Fotos de pilotos nuevos (Lindblad, Iwasa).
- `/drivers`: parrilla actual por equipos, sacada de la última carrera, más un buscador de los 817 pilotos desde 1950. El buscador ignora tildes y acepta país y año ("brasil 1988").
- El menú completo se muestra desde `xl` (1280 px); en 1024 px desbordaba.

**Pendiente:**

1. **Índices de equipos y circuitos.** Siguen sin existir: `/teams` y `/circuits` dan 404.
2. **Móvil, resultados de carrera.** La tabla mide 819 px dentro de 341 px: solo se ven la posición y el piloto. El tiempo, los puntos y el motivo de abandono quedan fuera, sin aviso de que se puede deslizar.
3. **Callejones sin salida.**
   - Carrera: sin enlace al equipo, sin GP anterior/siguiente, sin volver a la temporada, sin enlace a su telemetría.
   - Piloto: sin enlace al equipo ni a "comparar", y las filas de cada temporada llevan al campeonato general en vez de a sus carreras.
   - Circuito: solo se llega desde la ficha de una carrera; el calendario no enlaza circuitos.
4. **Menú.**
   - 10 entradas al mismo nivel (con "Pilotos").
   - "Carreras" y "Calendario" muestran casi lo mismo.
   - "Valoraciones" lleva a una página vacía (Supabase sin configurar).
   - "En vivo" tiene el punto rojo latiendo siempre, aunque no haya sesión.
5. **GP futuro.** Solo dice "Aún no se ha disputado": sin horarios, cuenta atrás, clima ni ganadores anteriores.
6. **Fotos en `/live`.** `live.ts` sigue usando el recorte de OpenF1 sin comprobarlo; Lindblad saldría vacío en la torre.
7. **Idioma y formato.**
   - "3.337 km" y "260.3" usan punto decimal, que en español se lee como miles.
   - "3607.5 puntos" sin formato.
   - "Retired" sin traducir.
   - Nombres de GP en inglés.
   - "1 sprints".
8. **Telemetría.** Las gráficas salen vacías unos segundos, sin indicador de carga.
