import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <div className="ember-glow flex min-h-[60vh] flex-col items-center justify-center rounded-[2rem] border border-line p-10 text-center">
      <div className="mb-6 flex gap-2" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="live-dot h-5 w-5 rounded-full bg-accent" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
      <h1 className="display text-6xl uppercase">{t("title")}</h1>
      <p className="mt-3 text-ink-2">{t("text")}</p>
      <Link href="/" className="mt-8 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white">
        {t("back")}
      </Link>
    </div>
  );
}
