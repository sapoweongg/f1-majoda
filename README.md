# F1 Majoda

Dashboard de Fórmula 1 en español e inglés: resultados, campeonatos de pilotos y constructores, calculadora del título, comparativa de pilotos, telemetría, estrategia de neumáticos, calendario con pronóstico, historia desde 1950, timing en vivo (o repetición de la última carrera) y valoraciones de los fans.

Hecho con Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Recharts, motion y next-intl.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # pruebas de la lógica (Vitest)
npm run lint
npm run typecheck
npm run build
```

Copia `.env.example` a `.env.local` para activar las funciones opcionales (en vivo y valoraciones). Sin variables, el sitio funciona igual con datos gratuitos.

## Publicar en Vercel

1. Sube el repositorio a GitHub.
2. En [vercel.com](https://vercel.com) → **Add New… → Project** → importa el repositorio (Vercel detecta Next.js solo).
3. En **Settings → Environment Variables** carga las que quieras de `.env.example` (como mínimo `NEXT_PUBLIC_SITE_URL`).
4. Cada `git push` a `main` vuelve a publicar el sitio.

### Valoraciones (Supabase, opcional)

1. Crea un proyecto gratis en [supabase.com](https://supabase.com).
2. En **SQL Editor** pega y ejecuta [`supabase/schema.sql`](supabase/schema.sql).
3. Copia `Project URL` y la `service_role` key (Project Settings → API) en `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`, y define un `RATINGS_SALT` aleatorio.

El navegador nunca habla con Supabase: todo pasa por `/api/ratings`. No se guarda la IP, solo un hash con sal.

### Timing en vivo (OpenF1, opcional)

El tiempo real de [OpenF1](https://openf1.org) requiere su plan de pago. Con `OPENF1_USERNAME` y `OPENF1_PASSWORD` configuradas, `/live` muestra la torre de tiempos, el mapa con los coches, el estado de pista y la dirección de carrera durante cada sesión. Sin credenciales, muestra la repetición vuelta a vuelta de la última carrera.

Para probar la interfaz en vivo sin pagar, pon `OPENF1_LIVE_SESSION_KEY` con una sesión pasada (p. ej. `11377`).

## Datos y límites

| Fuente | Uso | Límite |
| --- | --- | --- |
| [Jolpica-F1](https://github.com/jolpica/jolpica-f1) | calendario, resultados, clasificaciones, historia | 4 req/s, 500 req/h |
| [OpenF1](https://openf1.org) | telemetría, neumáticos, clima, dirección de carrera, fotos | 3 req/s, 30 req/min (gratis) |
| [Open-Meteo](https://open-meteo.com) | pronóstico del fin de semana | sin clave |
| Wikimedia Commons | fotos de pilotos históricos (con autor y licencia) | consultas agrupadas |

Todas las respuestas se guardan en la caché de datos de Next.js (compartida entre visitantes en Vercel): temporadas cerradas 30 días, temporada actual 5 minutos, datos en vivo unos segundos.

## Datos estáticos

- `src/data/circuits.json`: trazados adaptados de [julesr0y/f1-circuits-svg](https://github.com/julesr0y/f1-circuits-svg) (CC BY 4.0, © ROY Jules), cruzados con los circuitos de Jolpica. Regenerar: `git clone --depth 1 https://github.com/julesr0y/f1-circuits-svg .tmp/c && npm run data:circuits`.
- `src/data/champions.json`: campeones 1950–2025. Regenerar: `npm run data:champions -- 2025`.
- `public/world.svg`: continentes de Natural Earth (dominio público) vía `world-atlas`. Regenerar: `npm run data:world`.

## Imágenes y aviso legal

Sitio de fans no oficial y sin fines comerciales, sin relación con Formula 1, la FIA ni los equipos. Las fotos de pilotos actuales, coches y logos se cargan desde el CDN oficial de formula1.com y pertenecen a sus dueños. Con `NEXT_PUBLIC_OFFICIAL_MEDIA=false` se dejan de usar y se muestran fotos de Wikimedia y siluetas propias.

---

proyecto dedicado a ti mj
