import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeft, Trophy } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PHOTOS, SENNA_PROST_1989 } from "@/content/sennaprost1989";
import { getCommonsFiles } from "@/lib/api/wikimedia";
import { trackShape } from "@/lib/circuits";
import { countryToIso } from "@/lib/countries";
import { getDuel, type DuelSide } from "@/lib/duel";
import { cn } from "@/lib/format";
import { gpName } from "@/lib/gp-names";
import { safe } from "@/lib/safe";
import { DuelCompare, DuelMoments, DuelPairGrid, HonourCards, resultLabel, type DuelTheme } from "@/components/special/DuelParts";
import { GapChart } from "@/components/special/GapChart";
import { CommonsImg, GALLERY_NARROW, GALLERY_WIDE, PhotoBanner, SectionTitle as Title } from "@/components/special/SpecialParts";
import { TrackOutline } from "@/components/track/TrackOutline";
import { EmptyState, Flag } from "@/components/ui/primitives";

// Se genera en cada visita (los datos de 1989 vienen de la caché de datos): así un fallo puntual de
// la API durante el build no deja la página vacía en caché.
export const dynamic = "force-dynamic";

/** Fondo casi negro y el rojo del McLaren de 1989 como acento. */
const SURFACE = "#0e0c0d";
const RED = "#ff4a3d";
/** Colores de datos: el amarillo del casco de Senna y el azul de Prost (validados contra el fondo, también para daltonismo). */
const SENNA_COLOR = "#b38f00";
const PROST_COLOR = "#4f7fe4";

const THEME = {
  season: 1989,
  a: { code: "SEN", color: SENNA_COLOR },
  b: { code: "PRO", color: PROST_COLOR },
  accent: RED,
  surface: SURFACE,
} as const satisfies DuelTheme;

/** En 1989 solo contaban los 11 mejores resultados de las 16 carreras. */
const BEST_OF = 11;

export async function generateMetadata({ params }: PageProps<"/[locale]/senna-prost-1989">): Promise<Metadata> {
  const { locale } = await params;
  const c = SENNA_PROST_1989[locale === "en" ? "en" : "es"];
  return { title: `Senna vs Prost 1989 · ${c.title}`, description: c.subtitle };
}

const SectionTitle = (props: { eyebrow?: string; title: string; intro?: string }) => <Title {...props} accent={RED} />;

export default async function SennaProst1989Page({ params }: PageProps<"/[locale]/senna-prost-1989">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale === "en" ? "en" : "es";
  const c = SENNA_PROST_1989[lang];
  const nf = new Intl.NumberFormat(lang, { maximumFractionDigits: 1 });

  const [duel, photos] = await Promise.all([
    safe(getDuel(1989, "senna", "prost", { bestOf: BEST_OF }), null),
    safe(getCommonsFiles(Object.values(PHOTOS), 1800), new Map()),
  ]);
  if (!duel?.rounds.length) return <EmptyState>{lang === "en" ? "Data unavailable right now." : "Datos no disponibles ahora mismo."}</EmptyState>;

  const photo = (key: keyof typeof PHOTOS) => photos.get(PHOTOS[key]);
  const hero = photo("hero");
  const rain = photo("rain");
  const sennaPhoto = photo("senna");
  const prostPhoto = photo("prost");
  const gallery = (["imola", "sennaCar", "prostCar", "start"] as const)
    .map((key) => ({ key, img: photo(key) }))
    .filter((g): g is { key: (typeof g)["key"]; img: NonNullable<typeof g.img> } => Boolean(g.img));

  const { rounds, a: senna, b: prost, leadChanges } = duel;
  const suzuka = rounds.find((r) => r.circuitId === "suzuka");
  const result = (s: DuelSide) => resultLabel(s, c.retired);

  // Cara a cara: carreras con puntos y quién terminó delante (los no clasificados, detrás de cualquiera)
  const rank = (s: DuelSide) => s.position ?? 99;
  const scoring = (k: "a" | "b") => rounds.filter((r) => r[k].points > 0).length;
  const ahead = (k: "a" | "b") => rounds.filter((r) => rank(r[k]) < rank(r[k === "a" ? "b" : "a"])).length;
  const compareRows = [
    { label: c.compare.wins, a: senna.wins, b: prost.wins },
    { label: c.compare.poles, a: senna.poles, b: prost.poles },
    { label: c.compare.podiums, a: senna.podiums, b: prost.podiums },
    { label: c.compare.scoring, a: scoring("a"), b: scoring("b") },
    { label: c.compare.ahead, a: ahead("a"), b: ahead("b") },
    { label: c.compare.points, a: senna.points, b: prost.points },
  ];

  // Cifras directas en la balanza: la mayor ventaja de cada uno, los empates y el final
  const gaps = rounds.map((r) => r.gap);
  const highlight = [
    rounds[gaps.indexOf(Math.max(...gaps))].round,
    rounds[gaps.indexOf(Math.min(...gaps))].round,
    ...rounds.filter((r) => r.gap === 0).map((r) => r.round),
    rounds.at(-1)!.round,
  ];
  const standings = [
    { name: "Alain Prost", pts: prost.points, color: PROST_COLOR, pos: 1 },
    { name: "Ayrton Senna", pts: senna.points, color: SENNA_COLOR, pos: 2 },
  ];
  const suzukaShape = suzuka && trackShape(suzuka.circuitId, 1989);

  return (
    <div className="space-y-24">
      {/* ---------- PORTADA ---------- */}
      <section
        className="relative -mx-4 overflow-hidden border-y border-white/10 sm:mx-0 sm:rounded-[2rem] sm:border"
        style={{ background: SURFACE }}
      >
        {hero && <CommonsImg img={hero} alt={c.heroAlt} priority sizes="100vw" className="object-[60%_100%] opacity-70" />}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, ${SURFACE} 0%, ${SURFACE}e6 38%, ${SURFACE}55 72%, transparent 100%), linear-gradient(0deg, ${SURFACE} 0%, transparent 50%)`,
          }}
        />
        <span
          className="display pointer-events-none absolute -bottom-6 right-2 select-none text-[9rem] leading-none text-transparent sm:-bottom-14 sm:right-8 sm:text-[20rem]"
          style={{ WebkitTextStroke: "2px rgb(255 74 61 / 0.3)" }}
          aria-hidden
        >
          1989
        </span>
        <div className="relative grid min-h-[34rem] items-end gap-8 p-6 sm:p-12 lg:grid-cols-[1.3fr_1fr]">
          <div className="relative z-10 space-y-5 pb-2">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/70">
              <ArrowLeft size={16} aria-hidden />
              <Link href="/drivers/senna" className="hover:text-white">
                {c.backSenna}
              </Link>
              <span aria-hidden>·</span>
              <Link href="/drivers/prost" className="hover:text-white">
                {c.backProst}
              </Link>
            </p>
            <p className="eyebrow" style={{ color: RED }}>
              {c.eyebrow}
            </p>
            <div>
              <p className="flex flex-wrap items-center gap-x-3 text-2xl font-semibold text-white/85 sm:text-3xl">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: SENNA_COLOR }} aria-hidden /> Ayrton Senna
                </span>
                <span className="text-white/40">vs</span>
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: PROST_COLOR }} aria-hidden /> Alain Prost
                </span>
              </p>
              <h1 className="display mt-1 text-6xl uppercase sm:text-8xl">{c.title}</h1>
            </div>
            <p className="max-w-xl text-lg text-white/80">{c.subtitle}</p>
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-wider"
              style={{ background: RED, color: SURFACE }}
            >
              <Trophy size={16} /> {c.badge}
            </span>
          </div>
          {/* Clasificación final */}
          <div className="relative z-10 w-full max-w-sm justify-self-start rounded-2xl border border-white/10 bg-black/50 p-5 backdrop-blur-md lg:self-start lg:justify-self-end">
            <p className="eyebrow mb-3">{c.finalStandings} · 1989</p>
            {standings.map((d) => (
              <div key={d.name} className="flex items-center gap-3 border-t border-white/10 py-2.5 first:border-t-0">
                <span className="display w-6 text-xl text-ink-3">{d.pos}</span>
                <span className="h-6 w-1.5 rounded-full" style={{ background: d.color }} aria-hidden />
                <span className="flex-1 font-semibold">{d.name}</span>
                <span className="display num text-2xl">{nf.format(d.pts)}</span>
              </div>
            ))}
            {prost.gross !== prost.points && <p className="mt-2 text-xs text-ink-3">{c.grossNote(prost.gross)}</p>}
          </div>
        </div>
      </section>

      {/* ---------- INTRO + CARA A CARA ---------- */}
      <section>
        <p className="max-w-3xl text-xl leading-relaxed text-ink-2">{c.intro}</p>
        <div className="mt-12">
          <SectionTitle title={c.compareTitle} intro={c.compareIntro} />
          {/* En el móvil, los dos retratos en fila encima de la comparación */}
          {sennaPhoto && prostPhoto && (
            <div className="mb-4 grid grid-cols-2 gap-3 lg:hidden">
              <PhotoBanner img={sennaPhoto} caption={c.photoCaptions.senna} small sizes="50vw" className="h-56" position="object-[50%_20%]" />
              <PhotoBanner img={prostPhoto} caption={c.photoCaptions.prost} small sizes="50vw" className="h-56" position="object-[50%_20%]" />
            </div>
          )}
          <div className="grid items-center gap-6 lg:grid-cols-[15rem_1fr_15rem]">
            {sennaPhoto && (
              <PhotoBanner img={sennaPhoto} caption={c.photoCaptions.senna} small sizes="(min-width: 1024px) 15rem, 50vw" className="hidden h-80 lg:block" position="object-[50%_20%]" />
            )}
            <div className="glass p-5 sm:p-6">
              <DuelCompare rows={compareRows} theme={THEME} locale={lang} names={{ a: "Ayrton Senna", b: "Alain Prost" }} />
            </div>
            {prostPhoto && (
              <PhotoBanner img={prostPhoto} caption={c.photoCaptions.prost} small sizes="(min-width: 1024px) 15rem, 50vw" className="hidden h-80 lg:block" position="object-[50%_20%]" />
            )}
          </div>
        </div>
      </section>

      {/* ---------- LA BALANZA ---------- */}
      <section>
        <SectionTitle eyebrow="Senna vs Prost" title={c.scaleTitle} intro={c.scaleIntro(leadChanges)} />
        <div className="glass p-4 sm:p-6">
          <GapChart
            locale={lang}
            points={rounds.map((r) => ({
              round: r.round,
              label: gpName(r.raceName, locale),
              href: `/races/1989/${r.round}`,
              a: r.a.total,
              b: r.b.total,
            }))}
            a={{ name: "Senna", color: SENNA_COLOR }}
            b={{ name: "Prost", color: PROST_COLOR }}
            labels={c.scale}
            highlight={highlight}
            surface={SURFACE}
          />
        </div>
      </section>

      {/* ---------- FOTO: SPA BAJO LA LLUVIA ---------- */}
      {rain && <PhotoBanner img={rain} caption={c.bannerCaption} quote={c.quote} className="h-[22rem] sm:h-[32rem]" position="object-[50%_60%]" />}

      {/* ---------- CARRERA A CARRERA ---------- */}
      <section>
        <SectionTitle title={c.seasonTitle} intro={c.seasonIntro} />
        <DuelPairGrid
          rounds={rounds}
          theme={THEME}
          locale={locale}
          labels={{ retired: c.retired, leader: c.leader, tie: c.tie, winner: c.winner }}
        />
      </section>

      {/* ---------- MOMENTOS ---------- */}
      <section>
        <SectionTitle title={c.momentsTitle} />
        <DuelMoments
          items={Object.entries(c.moments).map(([k, text]) => [Number(k), text ?? ""])}
          rounds={rounds}
          theme={THEME}
          locale={locale}
          retired={c.retired}
        />
      </section>

      {/* ---------- SUZUKA ---------- */}
      <section
        className="relative -mx-4 overflow-hidden border-y px-6 py-12 sm:mx-0 sm:rounded-[2rem] sm:border sm:p-12"
        style={{ borderColor: `${RED}4d`, background: `radial-gradient(90% 120% at 100% 0%, ${RED}29, ${SURFACE} 55%)` }}
      >
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow" style={{ color: RED }}>
              {c.finalEyebrow}
            </p>
            <h2 className="display mt-2 text-7xl uppercase sm:text-9xl">{c.finalTitle}</h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-2">
              {c.finalText.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            {suzuka && (
              <Link
                href={`/races/1989/${suzuka.round}`}
                className="mt-6 inline-flex flex-wrap items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold hover:bg-white/5"
                style={{ borderColor: `${RED}80` }}
              >
                <Flag iso={countryToIso(suzuka.country)} /> {gpName(suzuka.raceName, locale)} · SEN {result(suzuka.a)} · PRO {result(suzuka.b)}
              </Link>
            )}
          </div>
          {suzukaShape && (
            <div className="mx-auto aspect-square w-full max-w-sm">
              <TrackOutline shape={suzukaShape} variant="flat" color={RED} duration={16} className="h-full w-full" />
            </div>
          )}
        </div>
      </section>

      {/* ---------- DOS MIRADAS ---------- */}
      <section>
        <SectionTitle title={c.viewsTitle} />
        <div className="grid gap-4 md:grid-cols-2">
          {(
            [
              { card: c.views.senna, color: SENNA_COLOR },
              { card: c.views.prost, color: PROST_COLOR },
            ] as const
          ).map(({ card, color }) => (
            <blockquote
              key={card.title}
              className="rounded-[1.5rem] border border-white/10 p-6"
              style={{ background: `linear-gradient(160deg, ${color}26, ${SURFACE} 65%)`, borderLeft: `4px solid ${color}` }}
            >
              <p className="display text-3xl">{card.title}</p>
              <p className="mt-3 text-lg leading-relaxed text-ink-2">{card.text}</p>
            </blockquote>
          ))}
        </div>
      </section>

      {/* ---------- LO QUE VINO DESPUÉS ---------- */}
      <section>
        <SectionTitle title={c.afterTitle} />
        <HonourCards cards={c.after} theme={THEME} icon={<Trophy size={18} aria-hidden />} />
      </section>

      {/* ---------- GALERÍA ---------- */}
      {gallery.length > 0 && (
        <section>
          <SectionTitle title={c.galleryTitle} />
          <div className="grid auto-rows-[11rem] grid-cols-2 gap-3 sm:auto-rows-[14rem] lg:grid-cols-4">
            {gallery.map(({ key, img }) => (
              <PhotoBanner
                key={key}
                img={img}
                caption={c.gallery[key]}
                small
                sizes={["imola", "sennaCar"].includes(key) ? GALLERY_WIDE : GALLERY_NARROW}
                className={cn("h-full", key === "imola" && "col-span-2 row-span-2", key === "sennaCar" && "col-span-2")}
                position={key === "imola" ? "object-[40%_30%]" : undefined}
              />
            ))}
          </div>
        </section>
      )}

      {/* ---------- CRÉDITOS ---------- */}
      <section className="border-t border-line pt-8 text-xs leading-relaxed text-ink-3">
        <p className="eyebrow mb-2">{c.creditsTitle}</p>
        {c.credits.map((line) => (
          <p key={line} className="mb-1">
            {line}
          </p>
        ))}
        <p className="mt-4 flex flex-wrap items-center gap-x-3 text-sm text-ink-2">
          <ArrowLeft size={14} aria-hidden />
          <Link href="/drivers/senna" className="hover:text-ink">
            {c.backSenna}
          </Link>
          <span aria-hidden>·</span>
          <Link href="/drivers/prost" className="hover:text-ink">
            {c.backProst}
          </Link>
        </p>
      </section>
    </div>
  );
}
