# 🏎️ F1 Majoda

**Dashboard de Fórmula 1 en español e inglés**, con datos desde 1950 hasta la temporada actual.

[![Ver en línea](https://img.shields.io/badge/Ver_en_línea-f1--majoda.vercel.app-e10600?style=for-the-badge&logo=vercel&logoColor=white)](https://f1-majoda.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white)

## ✨ Qué incluye

- **Resultados y campeonatos** de pilotos y constructores, con calculadora del título
- **Telemetría** y **estrategia de neumáticos** carrera a carrera
- **Comparativa de pilotos** cara a cara (carreras, clasificación y poles)
- **Timing en vivo**: torre de tiempos, mapa con los coches, estado de pista y dirección de carrera (o repetición vuelta a vuelta de la última carrera)
- **Calendario** con pronóstico del clima del fin de semana
- **Historia desde 1950**: fichas de pilotos, equipos y circuitos con buscador general (Ctrl+K)
- **Valoraciones de los fans** por carrera
- **Páginas especiales**: la temporada 2023 de Max Verstappen, el duelo Max vs. Hamilton 2021 contado desde cada lado y Senna vs. Prost 1989

## 🧱 Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Recharts, motion, SWR, next-intl, Supabase (opcional) y Vitest. Desplegado en Vercel: cada push a `main` se publica solo.

## 🚀 Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # pruebas de la lógica (Vitest)
npm run lint
npm run typecheck
npm run build
```

Copia `.env.example` a `.env.local` para activar las funciones opcionales (en vivo y valoraciones). Sin variables, el sitio funciona igual con datos gratuitos.

### Timing en vivo (OpenF1, opcional)

El tiempo real de [OpenF1](https://openf1.org) requiere su plan de pago. Con `OPENF1_USERNAME` y `OPENF1_PASSWORD` configuradas, `/live` muestra la torre de tiempos, el mapa con los coches, el estado de pista y la dirección de carrera durante cada sesión. Sin credenciales, muestra la repetición vuelta a vuelta de la última carrera.

Para probar la interfaz en vivo sin pagar, pon `OPENF1_LIVE_SESSION_KEY` con una sesión pasada (p. ej. `11377`).

## 📊 Datos y límites

| Fuente | Uso | Límite |
| --- | --- | --- |
| [Jolpica-F1](https://github.com/jolpica/jolpica-f1) | calendario, resultados, clasificaciones, historia | 4 req/s, 500 req/h |
| [OpenF1](https://openf1.org) | telemetría, neumáticos, clima, dirección de carrera, fotos | 3 req/s, 30 req/min (gratis) |
| [Open-Meteo](https://open-meteo.com) | pronóstico del fin de semana | sin clave |
| Wikimedia Commons | fotos de pilotos históricos (con autor y licencia) | consultas agrupadas |

Todas las respuestas se guardan en la caché de datos de Next.js (compartida entre visitantes en Vercel): temporadas cerradas 30 días, temporada actual 5 minutos, datos en vivo unos segundos.

### Datos estáticos

- `src/data/circuits.json`: trazados adaptados de [julesr0y/f1-circuits-svg](https://github.com/julesr0y/f1-circuits-svg) (CC BY 4.0, © ROY Jules), cruzados con los circuitos de Jolpica. Regenerar: `git clone --depth 1 https://github.com/julesr0y/f1-circuits-svg .tmp/c && npm run data:circuits`.
- `src/data/champions.json`: campeones 1950–2025. Regenerar: `npm run data:champions -- 2025`.
- `public/world.svg`: continentes de Natural Earth (dominio público) vía `world-atlas`. Regenerar: `npm run data:world`.

## ⚖️ Imágenes y aviso legal

Sitio de fans no oficial y sin fines comerciales, sin relación con Formula 1, la FIA ni los equipos. Las fotos de pilotos actuales, coches y logos se cargan desde el CDN oficial de formula1.com y pertenecen a sus dueños. Con `NEXT_PUBLIC_OFFICIAL_MEDIA=false` se dejan de usar y se muestran fotos de Wikimedia y siluetas propias.

---

Hecho por [Daniel Barrera](https://github.com/sapoweongg).
