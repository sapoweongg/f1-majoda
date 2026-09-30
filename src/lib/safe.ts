/** Devuelve `fallback` si la promesa falla, para que un fallo de una API no tumbe toda la página. */
export async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch (err) {
    console.error("[data]", err instanceof Error ? err.message : err);
    return fallback;
  }
}
