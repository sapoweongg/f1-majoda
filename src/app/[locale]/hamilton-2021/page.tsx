import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeft, Award, Medal } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { HAMILTON_2021, PHOTOS } from "@/content/hamilton2021";
import { getCommonsFiles } from "@/lib/api/wikimedia";
import { trackShape } from "@/lib/circuits";
import { countryToIso } from "@/lib/countries";
import { getDuel2021 } from "@/lib/duel2021";
import { cn } from "@/lib/format";
import { gpName, gpPlace } from "@/lib/gp-names";
import { safe } from "@/lib/safe";
import { CountUp } from "@/components/special/CountUp";
import { DuelMoments, DuelRadios, DuelRaceGrid, HonourCards, resultLabel, type DuelTheme } from "@/components/special/Duel2021Parts";
import { GapChart } from "@/components/special/GapChart";
import { PhotoBanner, SectionTitle as Title } from "@/components/special/SpecialParts";
import { TrackOutline } from "@/components/track/TrackOutline";
import { EmptyState, Flag } from "@/components/ui/primitives";

// Se genera en cada visita (los datos de 2021 vienen de la caché de datos): así un fallo puntual de
// la API durante el build no deja la página vacía en caché.
export const dynamic = "force-dynamic";

/** Negro del Mercedes de 2021 y turquesa Petronas como acento. */
const BLACK = "#0a0d10";
const TEAL = "#00d7b6";
/** Colores de datos del duelo: los mismos que en la página de Max (el color sigue al piloto). */
const HAM_COLOR = "#00a991";
const MAX_COLOR = "#e06c00";

const THEME: DuelTheme = { me: "ham", rival: { code: "VER", color: MAX_COLOR }, accent: TEAL, surface: BLACK };

export async function generateMetadata({ params }: PageProps<"/[locale]/hamilton-2021">): Promise<Metadata> {
  const { locale } = await params;
  const c = HAMILTON_2021[locale === "en" ? "en" : "es"];
  return { title: `Lewis Hamilton 2021 · ${c.title}`, description: c.subtitle };
}

const SectionTitle = (props: { eyebrow?: string; title: string; intro?: string }) => <Title {...props} accent={TEAL} />;

export default async function Hamilton2021Page({ params }: PageProps<"/[locale]/hamilton-2021">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale === "en" ? "en" : "es";
  const c = HAMILTON_2021[lang];
  const nf = new Intl.NumberFormat(lang, { maximumFractionDigits: 1 });

  const [duel, photos] = await Promise.all([
    safe(getDuel2021(), null),
    safe(getCommonsFiles(Object.values(PHOTOS), 1800), new Map()),
  ]);
  if (!duel?.rounds.length) return <EmptyState>{lang === "en" ? "Data unavailable right now." : "Datos no disponibles ahora mismo."}</EmptyState>;

  const photo = (key: keyof typeof PHOTOS) => photos.get(PHOTOS[key]);
  const hero = photo("hero");
  const flag = photo("flag");
  const celebration = photo("celebration");
  const gallery = (["portrait", "side", "handshake", "pirelli"] as const)
    .map((key) => ({ key, img: photo(key) }))
    .filter((g): g is { key: (typeof g)["key"]; img: NonNullable<typeof g.img> } => Boolean(g.img));

  const { rounds, ver, ham } = duel;
  const last = rounds.at(-1)!;
  const byCircuit = (id: string) => rounds.find((r) => r.circuitId === id);
  // La remontada: de México (ventaja de Max) a Arabia Saudí (empate)
  const mexico = byCircuit("rodriguez");
  const jeddah = byCircuit("jeddah");
  const closed = mexico && jeddah ? mexico.gap - jeddah.gap : 0;
  const comeback = Object.entries(c.comeback)
    .map(([k, card]) => ({ r: rounds.find((x) => x.round === Number(k)), card }))
    .filter((x): x is { r: NonNullable<typeof x.r>; card: NonNullable<typeof x.card> } => Boolean(x.r && x.card));
  const spain = byCircuit("catalunya");
  const sochi = byCircuit("sochi");
  // Cifras directas en la balanza (vista desde Hamilton: la ventaja es -gap)
  const leads = rounds.map((r) => -r.gap);
  const highlight = [
    rounds[leads.indexOf(Math.max(...leads))].round,
    rounds[leads.indexOf(Math.min(...leads))].round,
    ...rounds.filter((r) => r.gap === 0).map((r) => r.round),
    last.round,
  ];
  const yas = trackShape(last.circuitId, 2021);

  return (
    <div className="space-y-24">
      {/* ---------- PORTADA ---------- */}
      <section
        className="relative -mx-4 overflow-hidden border-y border-white/10 sm:mx-0 sm:rounded-[2rem] sm:border"
        style={{ background: BLACK }}
      >
        {hero && <Image src={hero.src} alt={c.heroAlt} fill priority sizes="100vw" className="object-cover object-[65%_60%] opacity-70" />}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, ${BLACK} 0%, ${BLACK}e6 38%, ${BLACK}55 72%, transparent 100%), linear-gradient(0deg, ${BLACK} 0%, transparent 50%)`,
          }}
        />
        <span
          className="display pointer-events-none absolute -bottom-8 right-2 select-none text-[11rem] leading-none text-transparent sm:-bottom-20 sm:right-8 sm:text-[24rem]"
          style={{ WebkitTextStroke: "2px rgb(0 215 182 / 0.3)" }}
          aria-hidden
        >
          44
        </span>
        <div className="relative grid min-h-[34rem] items-end gap-8 p-6 sm:p-12 lg:grid-cols-[1.3fr_1fr]">
          <div className="relative z-10 space-y-5 pb-2">
            <Link href="/drivers/hamilton" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
              <ArrowLeft size={16} /> {c.back}
            </Link>
            <p className="eyebrow" style={{ color: TEAL }}>
              {c.eyebrow}
            </p>
            <div>
              <p className="text-2xl font-semibold text-white/85 sm:text-3xl">Lewis Hamilton</p>
              <h1 className="display text-6xl uppercase sm:text-8xl">{c.title}</h1>
            </div>
            <p className="max-w-xl text-lg text-white/80">{c.subtitle}</p>
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-wider"
              style={{ background: TEAL, color: BLACK }}
            >
              <Award size={16} /> {c.badge}
            </span>
          </div>
          {/* La remontada final, en el marcador */}
          <div className="relative z-10 w-full max-w-sm justify-self-start rounded-2xl border border-white/10 bg-black/50 p-5 backdrop-blur-md lg:self-start lg:justify-self-end">
            <p className="eyebrow mb-3">{c.finale}</p>
            {comeback.map(({ r }) => (
              <div key={r.round} className="flex items-center gap-3 border-t border-white/10 py-2 first:border-t-0">
                <Flag iso={countryToIso(r.country)} />
                <span className="flex-1 truncate font-semibold">{gpPlace(r.raceName, locale)}</span>
                <span className="text-xs text-ink-3">{c.started(r.ham.grid)}</span>
                <span className="display num w-12 text-right text-2xl" style={{ color: r.ham.position === 1 ? TEAL : undefined }}>
                  {resultLabel(r.ham, c.retired)}
                </span>
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
            { v: ham.wins, l: c.stats.wins, s: ` / ${rounds.length}` },
            { v: ham.points, l: c.stats.points, d: ham.points % 1 ? 1 : 0 },
            { v: ham.podiums, l: c.stats.podiums },
            { v: ham.poles, l: c.stats.poles },
            { v: ham.fastestLaps, l: c.stats.fastestLaps },
            { v: closed, l: c.stats.closed },
          ].map((x) => (
            <div key={x.l}>
              <p className="display text-6xl sm:text-7xl" style={{ color: TEAL }}>
                <CountUp value={x.v} decimals={x.d ?? 0} />
                {x.s && <span className="text-2xl text-ink-3">{x.s}</span>}
              </p>
              <p className="eyebrow mt-1">{x.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 100 Y 100 ---------- */}
      <section>
        <SectionTitle eyebrow="2021" title={c.hundredTitle} intro={c.hundredIntro} />
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_minmax(0,1.1fr)]">
          {[
            { card: c.hundredPole, r: spain },
            { card: c.hundredWin, r: sochi },
          ].map(({ card, r }) => (
            <Link
              key={card.title}
              href={r ? `/races/2021/${r.round}` : "/races"}
              className="group relative overflow-hidden rounded-[1.5rem] border p-6 transition-colors"
              style={{ borderColor: `${TEAL}40`, background: `radial-gradient(120% 100% at 100% 0%, ${TEAL}24, ${BLACK} 60%)` }}
            >
              <p className="display text-8xl leading-none sm:text-9xl" style={{ color: TEAL }}>
                100
              </p>
              <p className="display mt-3 text-3xl">{card.title}</p>
              {r && (
                <p className="mt-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-3">
                  <Flag iso={countryToIso(r.country)} /> {gpName(r.raceName, locale)}
                </p>
              )}
              <p className="mt-3 text-sm leading-relaxed text-ink-2">{card.text}</p>
            </Link>
          ))}
          {celebration && <PhotoBanner img={celebration} caption={c.celebrationCaption} small className="min-h-64" position="object-[45%_30%]" />}
        </div>
      </section>

      {/* ---------- LA BALANZA ---------- */}
      <section>
        <SectionTitle eyebrow="Hamilton vs Verstappen" title={c.scaleTitle} intro={c.scaleIntro(closed)} />
        <div className="glass p-4 sm:p-6">
          <GapChart
            locale={lang}
            points={rounds.map((r) => ({
              round: r.round,
              label: gpName(r.raceName, locale),
              href: `/races/2021/${r.round}`,
              a: r.ham.total,
              b: r.ver.total,
            }))}
            a={{ name: "Hamilton", color: HAM_COLOR }}
            b={{ name: "Verstappen", color: MAX_COLOR }}
            labels={c.scale}
            highlight={highlight}
            surface={BLACK}
          />
        </div>
      </section>

      {/* ---------- FOTO: LA BANDERA EN SILVERSTONE ---------- */}
      {flag && <PhotoBanner img={flag} caption={c.bannerCaption} quote={c.quote} className="h-[22rem] sm:h-[32rem]" position="object-[60%_50%]" />}

      {/* ---------- LA REMONTADA ---------- */}
      <section>
        <SectionTitle title={c.comebackTitle} intro={c.comebackIntro} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {comeback.map(({ r, card }) => {
            const s = r.ham;
            const win = s.position === 1;
            return (
              <Link
                key={r.round}
                href={`/races/2021/${r.round}`}
                className="group flex flex-col rounded-[1.5rem] border p-5 transition-colors"
                style={{
                  borderColor: win ? `${TEAL}66` : "rgb(255 255 255 / 0.1)",
                  background: `radial-gradient(120% 100% at 100% 0%, ${TEAL}${win ? "24" : "10"}, ${BLACK} 60%)`,
                }}
              >
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-3">
                  <span className="num">R{r.round}</span> <Flag iso={countryToIso(r.country)} /> {card.title}
                </p>
                <p className="display mt-3 text-4xl">
                  <span className="text-ink-3">{s.grid > 0 ? `${s.grid}.º` : "PL"}</span>
                  <span className="mx-2 text-ink-3">→</span>
                  <span style={{ color: win ? TEAL : undefined }}>{resultLabel(s, c.retired)}</span>
                </p>
                {s.sprint && s.sprint.position !== null && s.sprint.grid !== s.sprint.position && (
                  <p className="mt-1 text-xs text-ink-3">{c.sprintNote(s.sprint.grid, s.sprint.position)}</p>
                )}
                <p className="mt-3 text-sm leading-relaxed text-ink-2">{card.text}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------- CARRERA A CARRERA ---------- */}
      <section>
        <SectionTitle title={c.seasonTitle} intro={c.seasonIntro} />
        <DuelRaceGrid
          rounds={rounds}
          theme={THEME}
          locale={locale}
          labels={{ started: c.started, pitLane: c.pitLane, retired: c.retired, leader: c.leader, tie: c.tie, sprintWin: c.sprintWin, fastestLap: c.stats.fastestLaps }}
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

      {/* ---------- RADIOS ---------- */}
      <section>
        <SectionTitle title={c.radiosTitle} intro={c.radiosIntro} />
        <DuelRadios titles={c.radios} theme={THEME} labels={{ play: c.play, pause: c.pause }} />
      </section>

      {/* ---------- CON LA CABEZA ALTA ---------- */}
      <section
        className="relative -mx-4 overflow-hidden border-y px-6 py-12 sm:mx-0 sm:rounded-[2rem] sm:border sm:p-12"
        style={{ borderColor: `${TEAL}4d`, background: `radial-gradient(90% 120% at 100% 0%, ${TEAL}24, ${BLACK} 55%)` }}
      >
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow" style={{ color: TEAL }}>
              {c.finalEyebrow}
            </p>
            <h2 className="display mt-2 text-6xl uppercase sm:text-8xl">{c.finalTitle}</h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-2">
              {c.finalText.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            {yas && (
              <div className="mx-auto aspect-square w-full max-w-xs">
                <TrackOutline shape={yas} variant="flat" color={TEAL} animate={false} className="h-full w-full" />
              </div>
            )}
            <div className="mx-auto w-full max-w-sm rounded-2xl border border-white/10 bg-black/40 p-5">
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
        </div>
      </section>

      {/* ---------- LO QUE DEMOSTRÓ ---------- */}
      <section>
        <SectionTitle title={c.legacyTitle} />
        <HonourCards cards={c.legacy} theme={THEME} icon={<Medal size={18} aria-hidden />} />
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
                className={cn("h-full", key === "portrait" && "col-span-2 row-span-2", key === "side" && "col-span-2")}
                position={key === "portrait" ? "object-[50%_25%]" : undefined}
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
        <Link href="/drivers/hamilton" className="mt-4 inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink">
          <ArrowLeft size={14} /> {c.back}
        </Link>
      </section>
    </div>
  );
}
