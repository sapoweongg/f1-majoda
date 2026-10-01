"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Link } from "@/i18n/navigation";

const HEART = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

const PARAGRAPHS = [
  "María José, si lees esto, lo primero que tengo por decir es que te amo.",
  "La razón por la que el 2025 es mi campeonato más importante es porque es el año en el que conocí al amor de mi vida. María José, eres lo más importante que me ha pasado y no sabes lo agradecido que estoy con la vida por haberte traído a mí.",
  "No sabes lo feliz que me haces y lo inspirado que me siento día tras día. Todos los días me levanto y pienso que tengo que ser mejor hombre, mejor estudiante, mejor desarrollador y mejor persona para hacerte feliz, pollito míooo.",
  "Yo sé que dices que no volverás conmigo, pero todos los días de mi vida trataré de buscar la manera de sanar tu corazón y de enamorarte poquito a poquito.",
  "Gracias por existir, vida mía.",
];

// Posiciones "aleatorias" fijas para que servidor y navegador pinten lo mismo
const FLOATERS = Array.from({ length: 18 }, (_, i) => {
  // hash entero (sin Math.sin, que puede variar entre motores de JS)
  const r = (n: number) => (((i + 1) * 2654435761 + n * 7919 * (i + 3)) % 1000) / 1000;
  return { left: r(1) * 100, size: 10 + r(2) * 22, duration: 12 + r(3) * 14, delay: -r(4) * 20, drift: (r(5) - 0.5) * 80 };
});

function Heart({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden>
      <path d={HEART} fill="currentColor" />
    </svg>
  );
}

function FloatingHearts() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {FLOATERS.map((f, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0 text-rose-300/25"
          style={{ left: `${f.left}%`, width: f.size, height: f.size }}
          initial={{ y: "10vh", x: 0, opacity: 0 }}
          animate={{ y: "-110vh", x: f.drift, opacity: [0, 1, 1, 0] }}
          transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: "linear" }}
        >
          <Heart className="h-full w-full" />
        </motion.span>
      ))}
    </div>
  );
}

function Envelope({ opening, onOpen }: { opening: boolean; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      disabled={opening}
      className="group relative mx-auto block w-[min(88vw,420px)] cursor-pointer [perspective:1200px]"
      aria-label="Abrir la carta"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.9, transition: { duration: 0.5 } }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* cuerpo del sobre */}
      <div className="relative aspect-[3/2] rounded-md bg-gradient-to-br from-[#f6e3d3] to-[#e9c9b5] shadow-[0_30px_60px_rgba(0,0,0,0.45)]">
        <div
          className="absolute inset-0 rounded-md bg-gradient-to-t from-[#ecd0bd] to-[#f3dccb]"
          style={{ clipPath: "polygon(0 100%, 50% 45%, 100% 100%)" }}
        />
        <div
          className="absolute inset-0 rounded-md bg-[#efd6c4]"
          style={{ clipPath: "polygon(0 0, 50% 55%, 0 100%)" }}
        />
        <div
          className="absolute inset-0 rounded-md bg-[#efd6c4]"
          style={{ clipPath: "polygon(100% 0, 50% 55%, 100% 100%)" }}
        />
        <p className="absolute inset-x-0 bottom-[14%] text-center font-[family-name:var(--font-script)] text-2xl text-[#7a2335] sm:text-3xl">
          Para María José
        </p>
      </div>
      {/* solapa */}
      <motion.div
        className="absolute inset-x-0 top-0 aspect-[3/1.1] origin-top"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateX: opening ? 180 : 0 }}
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
      >
        <div
          className="h-full w-full rounded-t-md bg-gradient-to-b from-[#f8e8da] to-[#e8c7b1] [backface-visibility:hidden]"
          style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
        />
      </motion.div>
      {/* sello de cera */}
      <motion.span
        className="absolute left-1/2 top-[36%] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-[family-name:var(--font-script)] text-2xl font-bold text-[#f8d9c4] shadow-[0_6px_14px_rgba(0,0,0,0.35)] transition-transform group-hover:scale-110 sm:h-20 sm:w-20 sm:text-3xl"
        style={{ background: "radial-gradient(circle at 35% 30%, #c0394f, #8b1a2e 60%, #5e0f1e)" }}
        animate={{ opacity: opening ? 0 : 1, scale: opening ? 0.6 : 1 }}
        transition={{ duration: 0.4 }}
      >
        MJ
      </motion.span>
      <p className="mt-6 text-center text-sm tracking-wide text-rose-100/70">Toca el sello para abrirla</p>
    </motion.button>
  );
}

function Paper() {
  const reduce = useReducedMotion();
  const appear = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.6 + i * 0.45, duration: 0.8, ease: "easeOut" as const },
        };
  return (
    <motion.article
      className="relative mx-auto w-[min(92vw,680px)] rounded-[6px] px-7 pb-14 pt-12 text-[#3b2117] shadow-[0_40px_80px_rgba(0,0,0,0.5)] sm:px-14 sm:pt-16"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 0%, #fffaf0 0%, #fbf1e1 55%, #f2e1c8 100%)",
      }}
      initial={reduce ? false : { opacity: 0, y: 80, rotate: -1.5, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, rotate: -0.6, scale: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* cinta a cuadros, guiño a la bandera de meta */}
      <div
        className="absolute inset-x-0 top-0 h-2 rounded-t-[6px] opacity-80"
        style={{ background: "repeating-conic-gradient(#3b2117 0 25%, #fbf1e1 0 50%) 0 0 / 8px 8px" }}
        aria-hidden
      />
      {/* sello postal */}
      <div
        className="absolute right-5 top-6 hidden rotate-6 flex-col items-center border-2 border-dashed border-[#b4485a]/60 px-2.5 py-1.5 text-[#b4485a] sm:flex"
        aria-hidden
      >
        <Heart className="h-5 w-5" />
        <span className="mt-0.5 font-[family-name:var(--font-letter)] text-[10px] font-semibold tracking-[0.2em]">2025 · P1</span>
      </div>

      <motion.p
        {...appear(0)}
        className="mb-2 font-[family-name:var(--font-letter)] text-xs font-semibold uppercase tracking-[0.3em] text-[#b4485a]"
      >
        Temporada 2025
      </motion.p>
      <motion.h1
        {...appear(0)}
        className="mb-8 font-[family-name:var(--font-script)] text-4xl font-bold leading-tight text-[#7a2335] sm:text-5xl"
      >
        Mi campeonato más importante
      </motion.h1>

      <div className="space-y-5 font-[family-name:var(--font-letter)] text-[1.2rem] leading-[1.85] sm:text-[1.32rem]">
        {PARAGRAPHS.map((p, i) => (
          <motion.p key={i} {...appear(i + 1)} className={i === 0 ? "italic" : undefined}>
            {p}
          </motion.p>
        ))}
      </div>

      <motion.div {...appear(PARAGRAPHS.length + 1)} className="mt-10 flex items-center justify-end gap-3">
        <span className="font-[family-name:var(--font-script)] text-5xl font-bold text-[#a52a3f] sm:text-6xl">Te amo</span>
        <svg viewBox="0 0 24 24" className="h-12 w-12 text-[#c0394f] sm:h-14 sm:w-14" aria-hidden>
          <motion.path
            d={HEART}
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={0.8}
            initial={reduce ? false : { pathLength: 0, fillOpacity: 0 }}
            animate={{ pathLength: 1, fillOpacity: 1 }}
            transition={{ delay: 0.9 + (PARAGRAPHS.length + 1) * 0.45, duration: 1.6, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
    </motion.article>
  );
}

export function Letter() {
  const [stage, setStage] = useState<"closed" | "opening" | "open">("closed");

  function open() {
    if (stage !== "closed") return;
    setStage("opening");
    setTimeout(() => setStage("open"), 1100);
  }

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto"
      style={{
        background:
          "radial-gradient(90% 70% at 50% 0%, #5a1426 0%, #2a0812 55%, #12040a 100%)",
      }}
    >
      <FloatingHearts />
      <Link
        href="/drivers/max_verstappen"
        className="absolute left-4 top-4 z-10 rounded-full border border-white/15 bg-black/25 px-4 py-1.5 text-sm text-rose-100/80 backdrop-blur hover:text-white"
      >
        ← Volver
      </Link>
      <div className="relative flex min-h-full items-center justify-center px-2 py-20">
        <AnimatePresence mode="wait">
          {stage === "open" ? <Paper key="paper" /> : <Envelope key="envelope" opening={stage === "opening"} onOpen={open} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
