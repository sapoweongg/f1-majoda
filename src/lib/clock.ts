/**
 * Hora actual para componentes de servidor. Estas páginas se regeneran cada pocos minutos (ISR),
 * así que "ahora" es el momento de esa regeneración; los relojes en vivo están en componentes cliente.
 */
export function serverNow(): number {
  return Date.now();
}
