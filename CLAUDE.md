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

### Auditoría de errores (5 oct 2026) — pendiente de arreglar

Comprobado en la web publicada. Por prioridad:

1. **Poles mal contados.** Ficha de piloto (Senna 3 en vez de 65, Hamilton 118 en vez de 104) y Comparar (0 antes de 2003).
   - Causa: Jolpica solo tiene clasificaciones desde 1994, con huecos en 1996–2002, y `/qualifying/1` devuelve filas que no son P1.
   - Arreglo: contar `grid === "1"` de los resultados y, para el duelo de clasificación, usar la parrilla cuando falte la clasificación.
2. **Ficha de piloto:** posición final "—" en temporadas antiguas (solo se piden las 15 últimas; Alonso 2001–2009).
3. **Ficha de equipo:** la historia muestra solo 12 temporadas y "Mejor posición" sale de ellas (Ligier P5; fue 2.º en 1980).
   - Arreglo para 2 y 3: archivo estático con todas las clasificaciones finales 1950–2025, como `drivers.json`.
4. **Caché de OpenF1 de 24 h para cualquier sesión** (`ttlForSession` nunca recibe "terminada"). Lo que se vea durante o justo después de una sesión (estrategia, telemetría, repetición) queda incompleto un día.
5. **"Bahrain Grand Prix in Malaysia" en inglés** (`gp-names.ts` no conoce "X Grand Prix in Y").
6. **El inicio muestra "Valora esta carrera"** aunque las valoraciones están apagadas.
7. **La clasificación de carreras sin datos dice "Aún no se ha disputado"** (Detroit 1988).
8. **Paradas con bandera roja:** "23:44.659s" y orden roto (Brasil 2024; hay que usar `parseLapTime`).
9. **Dirección de carrera:** solo los últimos 40 mensajes, casi todos amarillas de sector; se pierden SC, banderas rojas y sanciones.
10. **Comparar:** un valor `null` cuenta como 0 en "menor es mejor" (un piloto sin llegadas sale como el mejor).
11. **Las rutas inexistentes responden 200 con `noindex` en vez de 404.** Lo causa el `loading.tsx` global.
12. **Menores:**
    - Filtro "En activo" vacío en pretemporada.
    - La búsqueda por año ignora los huecos de carrera.
    - El último GP del inicio no usa `statusLabel`.
    - La sesión del banner En vivo sale en inglés.
    - El footer menciona las valoraciones aunque estén apagadas.
    - `/max-2023` tarda unos 3,6 s.

Sin desbordes a 375 px en las 11 páginas revisadas y sin errores de consola.
