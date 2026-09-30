/**
 * URL pública del sitio. En Vercel se deduce del dominio de producción que la plataforma
 * expone en VERCEL_PROJECT_PRODUCTION_URL; NEXT_PUBLIC_SITE_URL permite forzar otra (dominio propio).
 */
export function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}
