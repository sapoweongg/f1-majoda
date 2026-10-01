import type { Metadata } from "next";
import { Cormorant_Garamond, Dancing_Script } from "next/font/google";
import { setRequestLocale } from "next-intl/server";
import { Letter } from "@/components/parc-ferme/Letter";

const script = Dancing_Script({ variable: "--font-script", subsets: ["latin"], weight: ["500", "700"] });
const serif = Cormorant_Garamond({
  variable: "--font-letter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Mi campeonato más importante",
  robots: { index: false, follow: false },
};

export default async function ParcFermePage({ params }: PageProps<"/[locale]/parc-ferme">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className={`${script.variable} ${serif.variable}`}>
      <Letter />
    </div>
  );
}
