import "server-only";
import { unstable_cache } from "next/cache";

/** Separa el inicio de peticiones para respetar el límite por segundo de cada API. */
export function createThrottle(perSecond: number) {
  const gap = 1000 / perSecond;
  let next = 0;
  return async function wait() {
    const now = Date.now();
    const at = Math.max(now, next);
    next = at + gap;
    if (at > now) await new Promise((r) => setTimeout(r, at - now));
  };
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public url: string,
  ) {
    super(`HTTP ${status} en ${url}`);
  }
}

type Options = {
  /** Segundos que dura la respuesta en caché (false = para siempre). */
  revalidate: number | false;
  tags?: string[];
  throttle?: () => Promise<void>;
  headers?: () => Promise<Record<string, string>> | Record<string, string>;
};

async function rawJson<T>(url: string, opts: Options): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    await opts.throttle?.();
    const res = await fetch(url, {
      cache: "no-store",
      headers: { accept: "application/json", ...(await opts.headers?.()) },
    });
    if (res.ok) return (await res.json()) as T;
    // 429 = límite alcanzado; 5xx = fallo temporal. Reintentamos con espera creciente.
    if ((res.status === 429 || res.status >= 500) && attempt < 3) {
      await new Promise((r) => setTimeout(r, 800 * 2 ** attempt));
      continue;
    }
    throw new ApiError(res.status, url);
  }
}

/**
 * Pide JSON y lo guarda en la caché de datos de Next (compartida entre visitantes en Vercel).
 * El throttle solo se aplica cuando la respuesta no está en caché.
 */
export function cachedJson<T>(url: string, opts: Options): Promise<T> {
  return unstable_cache(() => rawJson<T>(url, opts), ["json", url], {
    revalidate: opts.revalidate,
    tags: opts.tags,
  })();
}

/** Sin caché: para datos en vivo que ya se agregan en /api/live. */
export function freshJson<T>(url: string, opts: Omit<Options, "revalidate">): Promise<T> {
  return rawJson<T>(url, { ...opts, revalidate: 0 });
}
