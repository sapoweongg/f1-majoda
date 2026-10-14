import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeft, Crown, Flag as FlagIcon, Timer, Trophy, Zap } from "lucide-react";
import radios from "@/data/max2023-radios.json";
import { Link } from "@/i18n/navigation";
import { LAPS_LED_2023, MAX_2023, PHOTOS, type RecordId } from "@/content/max2023";
import { getCommonsFiles } from "@/lib/api/wikimedia";
import { gpName, gpPlace } from "@/lib/gp-names";
import { trackShape } from "@/lib/circuits";
import { countryToIso } from "@/lib/countries";
import { cn } from "@/lib/format";
import { getMax2023 } from "@/lib/max2023";
import { driverBodyImage } from "@/lib/media";
import { getOfficialHeadshots } from "@/lib/photos";
import { safe } from "@/lib/safe";
import { progressionSeries } from "@/lib/view";
import { LineSeriesChart } from "@/components/charts/LineSeriesChart";
import { CountUp } from "@/components/special/CountUp";
import { RadioCard } from "@/components/special/RadioCard";
import { RevealOnView } from "@/components/special/RevealOnView";
import { PhotoBanner, SectionTitle as Title } from "@/components/special/SpecialParts";
import { TrackOutline } from "@/components/track/TrackOutline";
import { EmptyState, Flag } from "@/components/ui/primitives";

// Se genera en cada visita (los datos vienen de la caché de datos, 30 días para 2023): así un fallo
// puntual de la API durante el build no deja la página vacía en caché.
export const dynamic = "force-dynamic";

const YELLOW = "#ffcc00";
const NAVY = "#0b1530";

const SectionTitle = (props: { eyebrow?: string; title: string; intro?: string }) => <Title {...props} accent={`${YELLOW}cc`} />;

export async function generateMetadata({ params }: PageProps<"/[locale]/max-2023">): Promise<Metadata> {
  const { locale } = await params;
  const c = MAX_2023[locale === "en" ? "en" : "es"];
  return { title: `Max Verstappen 2023 · ${c.title}`, description: c.subtitle };
}

export default async function Max2023Page({ params }: PageProps<"/[locale]/max-2023">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale === "en" ? "en" : "es";
  const c = MAX_2023[lang];
  // "always": en español 1003 también lleva punto de millar (1.003)
  const nf = new Intl.NumberFormat(lang, { useGrouping: "always" });

  const [data, photos, headshots] = await Promise.all([
    safe(getMax2023(), null),
    safe(getCommonsFiles(Object.values(PHOTOS), 1800), new Map()),
    safe(getOfficialHeadshots(2023), new Map<string, string>()),
  ]);
  if (!data) return <EmptyState>{lang === "en" ? "Data unavailable right now." : "Datos no disponibles ahora mismo."}</EmptyState>;

  const hero = photos.get(PHOTOS.hero);
  const headshot = headshots.get("VER");
  // Retratos oficiales de cuerpo entero (fondo transparente)
  const bodySide = driverBodyImage("redbullracing", "maxver01", 2024, "right");
  const bodyFront = driverBodyImage("redbullracing", "maxver01", 2024, "front");
  const photo = (key: keyof typeof PHOTOS) => photos.get(PHOTOS[key]);
  const sparks = photo("sparks");
  const parade = photo("parade");
  const museum = photo("museum");
  // Galería final: las fotos que no aparecen repartidas por la página
  const gallery = (["side", "battle", "pack", "profile"] as const)
    .map((key) => ({ key, img: photo(key) }))
    .filter((g): g is { key: (typeof g)["key"]; img: NonNullable<typeof g.img> } => Boolean(g.img));

  const recordValues: Record<RecordId, string> = {
    wins: String(data.wins),
    streak: String(data.streak.length),
    winRate: `${nf.format(Math.round(data.winRate * 10) / 10)}%`,
    points: nf.format(data.points),
    podiums: String(data.podiums),
    lapsLed: nf.format(LAPS_LED_2023),
    margin: nf.format(data.margin),
    teamWins: String(data.teamWins),
  };
  const recordIcons: Record<RecordId, typeof Trophy> = {
    wins: Trophy,
    streak: Zap,
    winRate: Crown,
    points: Trophy,
    podiums: Trophy,
    lapsLed: FlagIcon,
    margin: Crown,
    teamWins: Trophy,
  };

  const moments = data.rows.filter((r) => c.moments[r.circuitId]);
  const radioGroups = data.rows
    .map((r) => ({ row: r, clips: radios.filter((x) => x.circuit === r.circuitId) }))
    .filter((g) => g.clips.length && c.radios[g.row.circuitId]);

  const top4 = data.progression.rows.slice(0, 4).map((r) => r.id);
  const series = progressionSeries(data.progression, top4);

  return (
    <div className="space-y-24">
      {/* ---------- PORTADA ---------- */}
      <section
        className="relative -mx-4 overflow-hidden border-y border-white/10 sm:mx-0 sm:rounded-[2rem] sm:border"
        style={{ background: NAVY }}
      >
        {hero && (
          <Image
            src={hero.src}
            alt="Red Bull RB19"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[60%_50%] opacity-70"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, ${NAVY} 0%, ${NAVY}e6 35%, ${NAVY}66 70%, transparent 100%), linear-gradient(0deg, ${NAVY} 0%, transparent 45%)`,
          }}
        />
        <span
          className="display pointer-events-none absolute -bottom-8 right-0 select-none text-[11rem] leading-none text-transparent sm:-bottom-16 sm:text-[22rem]"
          style={{ WebkitTextStroke: "2px rgb(255 204 0 / 0.35)" }}
          aria-hidden
        >
          2023
        </span>
        <div className="relative grid min-h-[34rem] items-end gap-6 p-6 sm:p-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="relative z-10 space-y-5 pb-4">
            <Link href="/drivers/max_verstappen" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
              <ArrowLeft size={16} /> {c.back}
            </Link>
            <p className="eyebrow !text-[#ffcc00]">{c.eyebrow}</p>
            <div>
              <p className="text-2xl font-semibold text-white/85 sm:text-3xl">Max Verstappen</p>
              <h1 className="display text-6xl uppercase sm:text-8xl">{c.title}</h1>
            </div>
            <p className="max-w-xl text-lg text-white/80">{c.subtitle}</p>
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-wider"
              style={{ background: YELLOW, color: NAVY }}
            >
              <Crown size={16} /> {c.champion}
            </span>
          </div>
          {headshot && (
            <Image
              src={headshot}
              alt="Max Verstappen"
              width={520}
              height={520}
              priority
              className="relative z-10 -mb-12 hidden h-[30rem] w-auto justify-self-end object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] lg:block"
            />
          )}
        </div>
      </section>

      {/* ---------- INTRO + CIFRAS ---------- */}
      <section className="grid items-center gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="max-w-3xl text-xl leading-relaxed text-ink-2">{c.intro}</p>
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
            {[
              { v: data.wins, l: c.stats.wins, s: ` / ${data.races}` },
              { v: data.points, l: c.stats.points },
              { v: data.podiums, l: c.stats.podiums },
              { v: Math.round(data.winRate * 10) / 10, l: c.stats.winRate, s: "%", d: 1 },
              { v: data.poles, l: c.stats.poles },
              { v: data.fastestLaps, l: c.stats.fastestLaps },
            ].map((x) => (
              <div key={x.l}>
                <p className="display text-6xl sm:text-7xl" style={{ color: YELLOW }}>
                  <CountUp value={x.v} decimals={x.d ?? 0} />
                  {x.s && <span className="text-2xl text-ink-3">{x.s}</span>}
                </p>
                <p className="eyebrow mt-1">{x.l}</p>
              </div>
            ))}
          </div>
        </div>
        {bodySide && (
          <figure className="relative mx-auto h-[26rem] w-56 lg:h-[32rem] lg:w-full">
            <div className="absolute inset-x-6 bottom-6 top-16 rounded-full opacity-30 blur-3xl" style={{ background: YELLOW }} aria-hidden />
            <Image
              src={bodySide}
              alt="Max Verstappen"
              fill
              sizes="320px"
              className="relative object-contain object-bottom drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)]"
            />
          </figure>
        )}
      </section>

      {/* ---------- RÉCORDS ---------- */}
      <section>
        <SectionTitle eyebrow="2023" title={c.recordsTitle} intro={c.recordsIntro} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(c.records) as RecordId[]).map((id) => {
            const Icon = recordIcons[id];
            return (
              <div
                key={id}
                className="relative overflow-hidden rounded-[1.5rem] border border-[#ffcc00]/25 p-5"
                style={{ background: `radial-gradient(120% 100% at 100% 0%, rgb(255 204 0 / 0.14), ${NAVY} 60%)` }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <Icon size={18} className="text-[#ffcc00]" aria-hidden />
                  <span className="rounded-full border border-[#ffcc00]/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#ffcc00]">
                    {c.recordBadge}
                  </span>
                </div>
                <p className="display text-5xl">{recordValues[id]}</p>
                <p className="mt-1 font-semibold">{c.records[id].label}</p>
                <p className="mt-3 border-t border-white/10 pt-3 text-xs text-ink-3">
                  {c.previous}: {c.records[id].previous}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- LA RACHA ---------- */}
      {data.streak.length > 1 && (
        <section>
          <SectionTitle title={c.streakTitle} intro={c.streakText(data.streak.length)} />
          <RevealOnView className="grid grid-cols-5 gap-3 sm:gap-5 lg:grid-cols-10">
            {data.streak.map((r, i) => {
              const shape = trackShape(r.circuitId, 2023);
              return (
                <Link key={r.round} href={`/races/2023/${r.round}`} className="group text-center">
                  <div className="glass aspect-square p-2 sm:p-3">
                    <div className="streak-track h-full w-full" style={{ animationDelay: `${0.2 + i * 0.22}s` }}>
                      {shape && <TrackOutline shape={shape} variant="mini" className="h-full w-full" />}
                    </div>
                  </div>
                  <p className="display mt-2 text-2xl" style={{ color: YELLOW }}>
                    {i + 1}
                  </p>
                  <p className="flex items-center justify-center gap-1 text-[11px] text-ink-3">
                    <Flag iso={countryToIso(r.country)} /> {gpPlace(r.raceName, locale)}
                  </p>
                </Link>
              );
            })}
          </RevealOnView>
        </section>
      )}

      {/* ---------- FOTO: RB19 CON CHISPAS ---------- */}
      {sparks && <PhotoBanner img={sparks} caption={c.photoCaption} className="h-[22rem] sm:h-[32rem]" />}

      {/* ---------- CARRERA A CARRERA ---------- */}
      <section>
        <div className="mb-8 grid items-end gap-6 lg:grid-cols-[1fr_minmax(0,26rem)]">
          <SectionTitle title={c.seasonTitle} intro={c.seasonIntro} />
          {museum && <PhotoBanner img={museum} caption={c.gallery.museum} small className="h-56 sm:h-64" />}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {data.rows.map((r) => {
            const shape = trackShape(r.circuitId, 2023);
            const win = r.position === 1;
            return (
              <Link
                key={r.round}
                href={`/races/2023/${r.round}`}
                className={cn(
                  "relative overflow-hidden rounded-2xl border p-4 transition-transform hover:-translate-y-0.5",
                  win ? "border-[#ffcc00]/40" : "border-white/10",
                )}
                style={{ background: win ? `linear-gradient(160deg, rgb(255 204 0 / 0.16), ${NAVY} 70%)` : "#111114" }}
              >
                {shape && (
                  <TrackOutline
                    shape={shape}
                    variant="mini"
                    className={cn("absolute -right-3 -top-3 h-24 w-24", win ? "text-[#ffcc00]/25" : "text-white/[0.07]")}
                  />
                )}
                <p className="relative flex items-center gap-1.5 text-[11px] text-ink-3">
                  <span className="num">R{r.round}</span>
                  <Flag iso={countryToIso(r.country)} />
                </p>
                <p className="display relative mt-6 text-4xl" style={{ color: win ? YELLOW : undefined }}>
                  {r.position ? `P${r.position}` : r.positionText}
                </p>
                <p className="relative mt-1 truncate text-xs font-semibold">{gpPlace(r.raceName, locale)}</p>
                <p className="relative text-[11px] text-ink-3">{r.grid > 0 ? c.started(r.grid) : c.pitLane}</p>
                <div className="relative mt-2 flex gap-1.5">
                  {r.pole && (
                    <span className="rounded bg-white/10 px-1.5 text-[10px] font-bold" title={c.stats.poles}>
                      POLE
                    </span>
                  )}
                  {r.fastestLap && (
                    <span className="rounded bg-[#af52de]/25 px-1.5 text-[10px] font-bold text-[#d6a4f0]" title={c.stats.fastestLaps}>
                      <Timer size={10} className="inline" aria-hidden /> VR
                    </span>
                  )}
                  {r.sprintWin && (
                    <span className="rounded bg-[#ffcc00]/20 px-1.5 text-[10px] font-bold text-[#ffcc00]" title={c.sprintWin}>
                      S1
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------- GRÁFICO ---------- */}
      {series.length > 1 && (
        <section>
          <SectionTitle title={c.chartTitle} intro={c.chartNote} />
          <div className="glass p-5">
            <LineSeriesChart
              labels={data.progression.rounds.map((r) => String(r.round))}
              fullLabels={data.progression.rounds.map((r) => `${r.round}. ${gpName(r.raceName, locale)}`)}
              series={series}
              height={380}
              tableLabel={lang === "en" ? "Table" : "Tabla"}
              chartLabel={lang === "en" ? "Chart" : "Gráfico"}
            />
          </div>
        </section>
      )}

      {/* ---------- MOMENTOS ---------- */}
      <section className="grid gap-10 lg:grid-cols-[1fr_300px]">
        <div>
        <SectionTitle title={c.momentsTitle} />
        <ol className="relative space-y-6 border-l border-[#ffcc00]/30 pl-6 sm:pl-8">
          {moments.map((r) => (
            <li key={r.round} className="relative">
              <span
                className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 sm:-left-[39px]"
                style={{ borderColor: YELLOW, background: r.position === 1 ? YELLOW : NAVY }}
                aria-hidden
              />
              <Link href={`/races/2023/${r.round}`} className="group block">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-3">
                  <span className="num">R{r.round}</span> <Flag iso={countryToIso(r.country)} /> {gpName(r.raceName, locale)}
                  <span className="display ml-1 text-sm normal-case" style={{ color: r.position === 1 ? YELLOW : undefined }}>
                    {r.position ? `P${r.position}` : r.positionText}
                  </span>
                </p>
                <p className="mt-1 text-lg text-ink group-hover:text-white">{c.moments[r.circuitId]}</p>
              </Link>
            </li>
          ))}
        </ol>
        </div>
        {bodyFront && (
          <figure className="relative hidden lg:block">
            <div className="sticky top-24 h-[34rem]">
              <div className="absolute inset-x-4 bottom-10 top-24 rounded-full opacity-25 blur-3xl" style={{ background: YELLOW }} aria-hidden />
              <Image src={bodyFront} alt="Max Verstappen" fill sizes="300px" className="object-contain object-bottom drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)]" />
            </div>
          </figure>
        )}
      </section>

      {/* ---------- FOTO: MAX SALUDANDO ---------- */}
      {parade && (
        <PhotoBanner img={parade} caption={c.gallery.parade} quote={c.paradeQuote} className="h-[24rem] sm:h-[34rem]" position="object-[30%_40%]" />
      )}

      {/* ---------- RADIOS ---------- */}
      {radioGroups.length > 0 && (
        <section>
          <SectionTitle title={c.radiosTitle} intro={c.radiosIntro} />
          <div className="grid gap-4 md:grid-cols-2">
            {radioGroups.map(({ row, clips }) => (
              <RadioCard
                key={row.circuitId}
                title={c.radios[row.circuitId]!}
                tag={clips.some((x) => x.session === "sprint") ? c.sprint : undefined}
                clips={clips.map((x) => x.url)}
                labels={{ play: c.play, pause: c.pause }}
              />
            ))}
          </div>
        </section>
      )}

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
                className={cn(
                  "h-full",
                  key === "side" && "col-span-2 row-span-2",
                  key === "battle" && "col-span-2",
                )}
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
