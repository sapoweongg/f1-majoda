import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeft, Crown, Equal, Timer } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MAX_2021, PHOTOS } from "@/content/max2021";
import { getCommonsFiles } from "@/lib/api/wikimedia";
import { trackShape } from "@/lib/circuits";
import { countryToIso } from "@/lib/countries";
import { getDuel2021, type DuelSide } from "@/lib/duel2021";
import { cn } from "@/lib/format";
import { gpName, gpPlace } from "@/lib/gp-names";
import { safe } from "@/lib/safe";
import { CountUp } from "@/components/special/CountUp";
import { GapChart } from "@/components/special/GapChart";
import { PhotoBanner, SectionTitle as Title } from "@/components/special/SpecialParts";
import { TrackOutline } from "@/components/track/TrackOutline";
import { EmptyState, Flag } from "@/components/ui/primitives";

// Se genera en cada visita (los datos de 2021 vienen de la caché de datos): así un fallo puntual de
// la API durante el build no deja la página vacía en caché.
export const dynamic = "force-dynamic";

const NAVY = "#0b1530";
/** Naranja neerlandés: acento de la página (títulos, cifras). */
const ORANGE = "#ff8000";
/** Colores de datos del duelo (validados contra el fondo oscuro, también para daltonismo). */
const MAX_COLOR = "#e06c00";
const HAM_COLOR = "#00a991";

export async function generateMetadata({ params }: PageProps<"/[locale]/max-2021">): Promise<Metadata> {
  const { locale } = await params;
  const c = MAX_2021[locale === "en" ? "en" : "es"];
  return { title: `Max Verstappen 2021 · ${c.title}`, description: c.subtitle };
}

const SectionTitle = (props: { eyebrow?: string; title: string; intro?: string }) => <Title {...props} accent={ORANGE} />;

export default async function Max2021Page({ params }: PageProps<"/[locale]/max-2021">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale === "en" ? "en" : "es";
  const c = MAX_2021[lang];
  const nf = new Intl.NumberFormat(lang, { maximumFractionDigits: 1 });

  const [duel, photos] = await Promise.all([
    safe(getDuel2021(), null),
    safe(getCommonsFiles(Object.values(PHOTOS), 1800), new Map()),
  ]);
  if (!duel?.rounds.length) return <EmptyState>{lang === "en" ? "Data unavailable right now." : "Datos no disponibles ahora mismo."}</EmptyState>;

  const photo = (key: keyof typeof PHOTOS) => photos.get(PHOTOS[key]);
  const hero = photo("hero");
  const duelPhoto = photo("duel");
  const closeup = photo("closeup");
  const gallery = (["wave", "austin", "side", "silverstone"] as const)
    .map((key) => ({ key, img: photo(key) }))
    .filter((g): g is { key: (typeof g)["key"]; img: NonNullable<typeof g.img> } => Boolean(g.img));

  const { rounds, ver, ham, leadChanges } = duel;
  const last = rounds.at(-1)!;
  const byRound = new Map(rounds.map((r) => [r.round, r]));
  const result = (s: DuelSide) => (s.position ? `P${s.position}` : s.positionText === "R" ? c.retired : s.positionText);
  // Cifras directas en la balanza: la mayor ventaja de cada uno, el empate y el final
  const gaps = rounds.map((r) => r.gap);
  const highlight = [
    rounds[gaps.indexOf(Math.max(...gaps))].round,
    rounds[gaps.indexOf(Math.min(...gaps))].round,
    ...rounds.filter((r) => r.gap === 0).map((r) => r.round),
    last.round,
  ];
  const yas = trackShape(last.circuitId, 2021);

  return (
    <div className="space-y-24">
      {/* ---------- PORTADA ---------- */}
      <section
        className="relative -mx-4 overflow-hidden border-y border-white/10 sm:mx-0 sm:rounded-[2rem] sm:border"
        style={{ background: NAVY }}
      >
        {hero && (
          <Image src={hero.src} alt={c.heroAlt} fill priority sizes="100vw" className="object-cover object-[70%_40%] opacity-75" />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, ${NAVY} 0%, ${NAVY}e6 38%, ${NAVY}55 72%, transparent 100%), linear-gradient(0deg, ${NAVY} 0%, transparent 50%)`,
          }}
        />
        <span
          className="display pointer-events-none absolute -top-8 right-2 select-none text-[11rem] leading-none text-transparent sm:-top-16 sm:right-8 sm:text-[24rem]"
          style={{ WebkitTextStroke: "2px rgb(255 128 0 / 0.45)" }}
          aria-hidden
        >
          33
        </span>
        <div className="relative grid min-h-[34rem] items-end gap-8 p-6 sm:p-12 lg:grid-cols-[1.3fr_1fr]">
          <div className="relative z-10 space-y-5 pb-2">
            <Link href="/drivers/max_verstappen" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
              <ArrowLeft size={16} /> {c.back}
            </Link>
            <p className="eyebrow" style={{ color: ORANGE }}>
              {c.eyebrow}
            </p>
            <div>
              <p className="text-2xl font-semibold text-white/85 sm:text-3xl">Max Verstappen</p>
              <h1 className="display text-6xl uppercase sm:text-8xl">{c.title}</h1>
            </div>
            <p className="max-w-xl text-lg text-white/80">{c.subtitle}</p>
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-wider"
              style={{ background: ORANGE, color: NAVY }}
            >
              <Crown size={16} /> {c.champion}
            </span>
          </div>
          {/* Marcador final */}
          <div className="relative z-10 w-full max-w-sm justify-self-start rounded-2xl border border-white/10 bg-black/45 p-5 backdrop-blur-md lg:justify-self-end">
            <p className="eyebrow mb-3">{c.finalStandings} · 2021</p>
            {[
              { name: "Max Verstappen", pts: ver.points, color: MAX_COLOR, pos: 1 },
              { name: "Lewis Hamilton", pts: ham.points, color: HAM_COLOR, pos: 2 },
            ].map((d) => (
              <div key={d.name} className="flex items-center gap-3 border-t border-white/10 py-2.5 first:border-t-0">
                <span className="display w-6 text-xl text-ink-3">{d.pos}</span>
                <span className="h-6 w-1.5 rounded-full" style={{ background: d.color }} aria-hidden />
                <span className="flex-1 font-semibold">{d.name}</span>
                <span className="display num text-2xl">{nf.format(d.pts)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- INTRO + CIFRAS ---------- */}
      <section>
        <p className="max-w-3xl text-xl leading-relaxed text-ink-2">{c.intro}</p>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 xl:grid-cols-6">
          {[
            { v: ver.wins, l: c.stats.wins, s: ` / ${rounds.length}` },
            { v: ver.points, l: c.stats.points, d: ver.points % 1 ? 1 : 0 },
            { v: ver.podiums, l: c.stats.podiums },
            { v: ver.poles, l: c.stats.poles },
            { v: ver.fastestLaps, l: c.stats.fastestLaps },
            { v: ver.leadRounds, l: c.stats.leadRounds, s: ` / ${rounds.length}` },
          ].map((x) => (
            <div key={x.l}>
              <p className="display text-6xl sm:text-7xl" style={{ color: ORANGE }}>
                <CountUp value={x.v} decimals={x.d ?? 0} />
                {x.s && <span className="text-2xl text-ink-3">{x.s}</span>}
              </p>
              <p className="eyebrow mt-1">{x.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- LA BALANZA ---------- */}
      <section>
        <div className="mb-8 grid items-end gap-6 lg:grid-cols-[1fr_minmax(0,26rem)]">
          <SectionTitle eyebrow="Verstappen vs Hamilton" title={c.scaleTitle} intro={c.scaleIntro(leadChanges)} />
          {duelPhoto && <PhotoBanner img={duelPhoto} caption={c.duelCaption} small className="h-56 sm:h-64" />}
        </div>
        <div className="glass p-4 sm:p-6">
          <GapChart
            locale={lang}
            points={rounds.map((r) => ({
              round: r.round,
              label: gpName(r.raceName, locale),
              href: `/races/2021/${r.round}`,
              a: r.ver.total,
              b: r.ham.total,
            }))}
            a={{ name: "Verstappen", color: MAX_COLOR }}
            b={{ name: "Hamilton", color: HAM_COLOR }}
            labels={c.scale}
            highlight={highlight}
          />
        </div>
      </section>

      {/* ---------- FOTO: RB16B ---------- */}
      {closeup && <PhotoBanner img={closeup} caption={c.bannerCaption} quote={c.quote} className="h-[22rem] sm:h-[32rem]" position="object-[40%_50%]" />}

      {/* ---------- CARRERA A CARRERA ---------- */}
      <section>
        <SectionTitle title={c.seasonTitle} intro={c.seasonIntro} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {rounds.map((r) => {
            const shape = trackShape(r.circuitId, 2021);
            const win = r.ver.position === 1;
            return (
              <Link
                key={r.round}
                href={`/races/2021/${r.round}`}
                className={cn(
                  "relative overflow-hidden rounded-2xl border p-4 transition-transform hover:-translate-y-0.5",
                  win ? "border-[#ff8000]/40" : "border-white/10",
                )}
                style={{ background: win ? `linear-gradient(160deg, rgb(255 128 0 / 0.16), ${NAVY} 70%)` : "#111114" }}
              >
                {shape && (
                  <TrackOutline
                    shape={shape}
                    variant="mini"
                    className={cn("absolute -right-3 -top-3 h-24 w-24", win ? "text-[#ff8000]/25" : "text-white/[0.07]")}
                  />
                )}
                <p className="relative flex items-center gap-1.5 text-[11px] text-ink-3">
                  <span className="num">R{r.round}</span>
                  <Flag iso={countryToIso(r.country)} />
                  {r.gap > 0 && <Crown size={12} className="text-[#ff8000]" aria-label={c.leader} />}
                  {r.gap === 0 && <Equal size={12} className="text-ink-2" aria-label={c.tie} />}
                </p>
                <p className="display relative mt-5 text-4xl" style={{ color: win ? ORANGE : undefined }}>
                  {result(r.ver)}
                </p>
                <p className="relative mt-1 truncate text-xs font-semibold">{gpPlace(r.raceName, locale)}</p>
                <p className="relative text-[11px] text-ink-3">{r.ver.grid > 0 ? c.started(r.ver.grid) : c.pitLane}</p>
                <div className="relative mt-2 flex flex-wrap items-center gap-1.5">
                  {r.ver.pole && <span className="rounded bg-white/10 px-1.5 text-[10px] font-bold">POLE</span>}
                  {r.ver.fastestLap && (
                    <span className="rounded bg-[#af52de]/25 px-1.5 text-[10px] font-bold text-[#d6a4f0]" title={c.stats.fastestLaps}>
                      <Timer size={10} className="inline" aria-hidden /> VR
                    </span>
                  )}
                  {r.ver.sprintWin && (
                    <span className="rounded bg-[#ff8000]/20 px-1.5 text-[10px] font-bold text-[#ff8000]" title={c.sprintWin}>
                      S1
                    </span>
                  )}
                  <span className="ml-auto flex items-center gap-1 text-[10px] text-ink-3">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: HAM_COLOR }} aria-hidden />
                    HAM {result(r.ham)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------- GOLPES ---------- */}
      <section>
        <SectionTitle title={c.setbacksTitle} intro={c.setbacksIntro} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(c.setbacks).map(([key, card]) => {
            const r = byRound.get(Number(key));
            if (!r || !card) return null;
            return (
              <Link
                key={key}
                href={`/races/2021/${r.round}`}
                className="group rounded-[1.5rem] border border-white/10 p-5 transition-colors hover:border-[#ff8000]/40"
                style={{ background: `radial-gradient(120% 100% at 100% 0%, rgb(255 128 0 / 0.10), ${NAVY} 60%)` }}
              >
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-3">
                  <span className="num">R{r.round}</span> <Flag iso={countryToIso(r.country)} /> {card.title}
                </p>
                <p className="display mt-3 text-3xl">
                  <span className="text-ink-3">{r.ver.grid > 0 ? `${r.ver.grid}.º` : "PL"}</span>
                  <span className="mx-2 text-ink-3">→</span>
                  <span style={{ color: r.ver.position && r.ver.position <= 3 ? ORANGE : undefined }}>{result(r.ver)}</span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-2">{card.text}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------- MOMENTOS ---------- */}
      <section>
        <SectionTitle title={c.momentsTitle} />
        <ol className="relative max-w-3xl space-y-6 border-l pl-6 sm:pl-8" style={{ borderColor: "rgb(255 128 0 / 0.3)" }}>
          {Object.entries(c.moments).map(([key, text]) => {
            const r = byRound.get(Number(key));
            if (!r || !text) return null;
            const win = r.ver.position === 1;
            return (
              <li key={key} className="relative">
                <span
                  className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 sm:-left-[39px]"
                  style={{ borderColor: ORANGE, background: win ? ORANGE : NAVY }}
                  aria-hidden
                />
                <Link href={`/races/2021/${r.round}`} className="group block">
                  <p className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-3">
                    <span className="num">R{r.round}</span> <Flag iso={countryToIso(r.country)} /> {gpName(r.raceName, locale)}
                    <span className="display ml-1 text-sm normal-case" style={{ color: win ? ORANGE : undefined }}>
                      {result(r.ver)}
                    </span>
                  </p>
                  <p className="mt-1 text-lg text-ink group-hover:text-white">{text}</p>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ---------- LA ÚLTIMA VUELTA ---------- */}
      <section
        className="relative -mx-4 overflow-hidden border-y border-[#ff8000]/30 px-6 py-12 sm:mx-0 sm:rounded-[2rem] sm:border sm:p-12"
        style={{ background: `radial-gradient(90% 120% at 100% 0%, rgb(255 128 0 / 0.18), ${NAVY} 55%)` }}
      >
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow" style={{ color: ORANGE }}>
              {c.finalEyebrow}
            </p>
            <h2 className="display mt-2 text-7xl uppercase sm:text-9xl">{c.finalTitle}</h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-2">
              {c.finalText.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <Link
              href={`/races/2021/${last.round}`}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#ff8000]/50 px-4 py-1.5 text-sm font-semibold hover:bg-[#ff8000]/10"
            >
              <Flag iso={countryToIso(last.country)} /> {gpName(last.raceName, locale)} · {result(last.ver)}
            </Link>
          </div>
          {yas && (
            <div className="mx-auto aspect-square w-full max-w-sm">
              <TrackOutline shape={yas} variant="flat" color={ORANGE} duration={14} className="h-full w-full" />
            </div>
          )}
        </div>
      </section>

      {/* ---------- LO QUE SIGNIFICÓ ---------- */}
      <section>
        <SectionTitle title={c.legacyTitle} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.legacy.map((card) => (
            <div
              key={card.title}
              className="rounded-[1.5rem] border border-[#ff8000]/25 p-5"
              style={{ background: `radial-gradient(120% 100% at 100% 0%, rgb(255 128 0 / 0.14), ${NAVY} 60%)` }}
            >
              <Crown size={18} className="text-[#ff8000]" aria-hidden />
              <p className="display mt-4 text-3xl">{card.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{card.text}</p>
            </div>
          ))}
        </div>
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
                className={cn("h-full", key === "wave" && "col-span-2 row-span-2", key === "austin" && "col-span-2")}
                position={key === "wave" ? "object-[50%_20%]" : undefined}
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
        <Link href="/drivers/max_verstappen" className="mt-4 inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink">
          <ArrowLeft size={14} /> {c.back}
        </Link>
      </section>
    </div>
  );
}
