import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // Las CDNs de origen ya sirven tamaños optimizados; así no gastamos la cuota de imágenes de Vercel.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "media.formula1.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "thumb.wikimedia.org" },
    ],
  },
  async redirects() {
    return [{ source: "/favicon.ico", destination: "/icon.svg", permanent: true }];
  },
};

export default withNextIntl(nextConfig);
