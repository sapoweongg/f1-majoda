import { cn } from "@/lib/format";

// Piezas comunes de las páginas especiales (Max 2023, Max 2021…): cada una pasa su color de acento.

export function SectionTitle({ eyebrow, title, intro, accent }: { eyebrow?: string; title: string; intro?: string; accent: string }) {
  return (
    <div className="mb-8 max-w-3xl">
      {eyebrow && (
        <p className="eyebrow mb-2" style={{ color: accent }}>
          {eyebrow}
        </p>
      )}
      <h2 className="display text-4xl sm:text-5xl">{title}</h2>
      {intro && <p className="mt-3 text-ink-2">{intro}</p>}
    </div>
  );
}

type CommonsPhoto = { src: string; srcSet?: string; credit: string; filePage: string };

/** Galerías de las páginas especiales: 2 columnas en el móvil y 4 en escritorio. Fotos que ocupan dos columnas: */
export const GALLERY_WIDE = "(min-width: 1024px) 50vw, 100vw";
/** …y las que ocupan una. */
export const GALLERY_NARROW = "(min-width: 1024px) 25vw, 50vw";

/**
 * Foto de Commons a pantalla del contenedor, con las miniaturas estándar en `srcset`: el navegador baja
 * solo el ancho que necesita (en el móvil, la de 960 en vez de la de 1920). next/image no sirve aquí:
 * con `unoptimized` descarta el srcSet propio.
 */
export function CommonsImg({
  img,
  alt,
  sizes,
  priority,
  className,
}: {
  img: Pick<CommonsPhoto, "src" | "srcSet">;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- ver arriba
    <img
      src={img.src}
      srcSet={img.srcSet}
      sizes={img.srcSet ? sizes : undefined}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
    />
  );
}

/** Foto con degradado, pie y crédito (autor y licencia enlazados a Commons). */
export function PhotoBanner({
  img,
  caption,
  quote,
  small,
  className,
  position = "object-center",
  sizes,
}: {
  img: CommonsPhoto;
  caption: string;
  quote?: string;
  small?: boolean;
  className?: string;
  position?: string;
  /** Ancho que ocupa en pantalla, para elegir la miniatura (por defecto según `small`). */
  sizes?: string;
}) {
  return (
    <figure
      className={cn(
        "group relative overflow-hidden border border-white/10",
        small ? "rounded-2xl" : "-mx-4 rounded-none sm:mx-0 sm:rounded-[2rem]",
        className,
      )}
    >
      <CommonsImg
        img={img}
        alt={caption}
        sizes={sizes ?? (small ? "(min-width: 1024px) 40vw, 100vw" : "100vw")}
        className={cn("transition-transform duration-700 group-hover:scale-[1.03]", position)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
      {quote && (
        <p className="display absolute right-5 top-5 max-w-[55%] text-right text-2xl leading-tight [text-shadow:0_4px_24px_rgb(0_0_0/0.8)] sm:right-10 sm:top-10 sm:max-w-md sm:text-5xl">
          {quote}
        </p>
      )}
      <figcaption className={cn("absolute", small ? "inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4" : "inset-x-6 bottom-5 sm:inset-x-8")}>
        <p className={cn("font-semibold leading-snug", small ? "text-sm" : "display text-xl sm:text-2xl")}>{caption}</p>
        <a href={img.filePage} target="_blank" rel="noreferrer" className="mt-0.5 block truncate text-[10px] text-white/55 hover:text-white">
          {img.credit}
        </a>
      </figcaption>
    </figure>
  );
}
