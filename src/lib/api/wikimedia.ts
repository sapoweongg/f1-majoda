import "server-only";
import { cachedJson, createThrottle } from "./fetcher";

// Fotos libres (Wikimedia Commons) de la página de Wikipedia que enlaza Jolpica.
// Wikimedia exige un User-Agent descriptivo y pide agrupar consultas: pedimos hasta 50 títulos a la vez.
const headers = () => ({ "user-agent": "F1Majoda/1.0 (sitio de fans sin fines comerciales)" });
const throttle = createThrottle(4);
const TTL = 30 * 86400;

export type WikiImage = {
  src: string;
  /** Miniaturas estándar para `srcset` (solo en getCommonsFiles). */
  srcSet?: string;
  /** Autor y licencia para el crédito. */
  credit: string;
  filePage: string;
};

/** Anchos de miniatura que sirve Wikimedia: los demás (480, 1440, 1800…) responden 400. */
const THUMB_WIDTHS = [500, 960, 1280, 1920];

/** srcset con las miniaturas estándar de una foto, sin pasar de su ancho original. */
export function commonsSrcSet(thumbUrl: string, originalWidth: number): string | undefined {
  const url = thumbUrl.split("?")[0];
  const segment = /\/\d+px-([^/]+)$/;
  if (!segment.test(url)) return undefined;
  const widths = THUMB_WIDTHS.filter((w) => w < originalWidth);
  return widths.length ? widths.map((w) => `${url.replace(segment, `/${w}px-$1`)} ${w}w`).join(", ") : undefined;
}

type Mapping = { from: string; to: string }[];
type PageImages = {
  query?: {
    normalized?: Mapping;
    redirects?: Mapping;
    pages?: Record<string, { title: string; thumbnail?: { source: string }; pageimage?: string; missing?: string }>;
  };
};
type ImageInfo = {
  query?: {
    normalized?: Mapping;
    pages?: Record<
      string,
      { title: string; imageinfo?: { descriptionurl: string; extmetadata?: Record<string, { value: string } | undefined> }[] }
    >;
  };
};

function stripHtml(s = "") {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function parse(url: string): { host: string; title: string } | null {
  try {
    const u = new URL(url.replace(/^http:/, "https:"));
    return { host: u.host, title: decodeURIComponent(u.pathname.replace(/^\/wiki\//, "")).replace(/_/g, " ") };
  } catch {
    return null;
  }
}

function follow(title: string, ...maps: (Mapping | undefined)[]) {
  let t = title;
  for (const m of maps) t = m?.find((x) => x.from === t)?.to ?? t;
  return t;
}

function chunks<T>(list: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

/** Foto de Commons para cada URL de Wikipedia (las que no tienen foto libre no aparecen). */
export async function getWikiImages(urls: string[], size = 400): Promise<Map<string, WikiImage>> {
  const result = new Map<string, WikiImage>();
  const byHost = new Map<string, { url: string; title: string }[]>();
  for (const url of new Set(urls.filter(Boolean))) {
    const p = parse(url);
    if (p) byHost.set(p.host, [...(byHost.get(p.host) ?? []), { url, title: p.title }]);
  }

  for (const [host, items] of byHost) {
    for (const group of chunks(items, 50)) {
      const titles = [...new Set(group.map((g) => g.title))].sort();
      let pages: PageImages;
      try {
        pages = await cachedJson<PageImages>(
          `https://${host}/w/api.php?action=query&format=json&redirects=1&prop=pageimages&piprop=thumbnail|name&pithumbsize=${size}&titles=${encodeURIComponent(titles.join("|"))}`,
          { revalidate: TTL, tags: ["wiki"], headers, throttle },
        );
      } catch {
        continue;
      }
      const q = pages.query;
      const pageByTitle = new Map(Object.values(q?.pages ?? {}).map((p) => [p.title, p]));
      const files = new Map<string, string>(); // url -> nombre de archivo
      const thumbs = new Map<string, string>();
      for (const g of group) {
        const page = pageByTitle.get(follow(g.title, q?.normalized, q?.redirects));
        if (page?.pageimage && page.thumbnail) {
          files.set(g.url, page.pageimage);
          thumbs.set(g.url, page.thumbnail.source);
        }
      }
      if (!files.size) continue;

      // Metadatos de autor y licencia en Commons (si el archivo no está en Commons, no es libre)
      const fileTitles = [...new Set(files.values())].map((f) => `File:${f}`).sort();
      let info: ImageInfo;
      try {
        info = await cachedJson<ImageInfo>(
          `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata|url&titles=${encodeURIComponent(fileTitles.join("|"))}`,
          { revalidate: TTL, tags: ["wiki"], headers, throttle },
        );
      } catch {
        continue;
      }
      const iq = info.query;
      const infoByTitle = new Map(Object.values(iq?.pages ?? {}).map((p) => [p.title, p.imageinfo?.[0]]));
      for (const [url, file] of files) {
        const ii = infoByTitle.get(follow(`File:${file}`, iq?.normalized));
        if (!ii) continue;
        const meta = ii.extmetadata ?? {};
        const artist = stripHtml(meta.Artist?.value) || "Wikimedia Commons";
        const license = stripHtml(meta.LicenseShortName?.value);
        result.set(url, {
          src: thumbs.get(url)!,
          credit: license ? `${artist} · ${license}` : artist,
          filePage: ii.descriptionurl,
        });
      }
    }
  }
  return result;
}

/** Archivos concretos de Commons (p. ej. "File:Foto.jpg") a un ancho dado, con autor y licencia. */
export async function getCommonsFiles(files: string[], width = 1600): Promise<Map<string, WikiImage>> {
  const out = new Map<string, WikiImage>();
  if (!files.length) return out;
  const titles = [...new Set(files)].sort();
  let info: {
    query?: {
      normalized?: Mapping;
      pages?: Record<
        string,
        {
          title: string;
          imageinfo?: {
            thumburl?: string;
            url: string;
            width?: number;
            descriptionurl: string;
            extmetadata?: Record<string, { value: string } | undefined>;
          }[];
        }
      >;
    };
  };
  try {
    info = await cachedJson(
      `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata|url|size&iiurlwidth=${width}&titles=${encodeURIComponent(titles.join("|"))}`,
      { revalidate: TTL, tags: ["wiki"], headers, throttle },
    );
  } catch {
    return out;
  }
  const byTitle = new Map(Object.values(info.query?.pages ?? {}).map((p) => [p.title, p.imageinfo?.[0]]));
  for (const file of files) {
    const ii = byTitle.get(follow(file, info.query?.normalized));
    if (!ii) continue;
    const meta = ii.extmetadata ?? {};
    const artist = stripHtml(meta.Artist?.value) || "Wikimedia Commons";
    const license = stripHtml(meta.LicenseShortName?.value);
    out.set(file, {
      src: ii.thumburl ?? ii.url,
      srcSet: ii.thumburl && ii.width ? commonsSrcSet(ii.thumburl, ii.width) : undefined,
      credit: license ? `${artist} · ${license}` : artist,
      filePage: ii.descriptionurl,
    });
  }
  return out;
}
