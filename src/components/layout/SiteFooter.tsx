import { getTranslations } from "next-intl/server";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const link = "underline decoration-line-strong underline-offset-2 hover:text-ink";
  return (
    <footer className="border-t border-line bg-surface/40">
      <div className="mx-auto max-w-7xl space-y-3 px-4 py-8 text-xs leading-relaxed text-ink-3 sm:px-6">
        <p className="display text-base text-ink-2">
          F1 <span className="text-accent">Majoda</span>
        </p>
        <p>{t("unofficial")}</p>
        <p>{t("rights")}</p>
        <p>
          {t("data")}:{" "}
          <a className={link} href="https://github.com/jolpica/jolpica-f1" target="_blank" rel="noreferrer">
            Jolpica-F1
          </a>
          ,{" "}
          <a className={link} href="https://openf1.org" target="_blank" rel="noreferrer">
            OpenF1
          </a>
          ,{" "}
          <a className={link} href="https://open-meteo.com" target="_blank" rel="noreferrer">
            Open-Meteo
          </a>
          . {t("tracks")}:{" "}
          <a className={link} href="https://github.com/julesr0y/f1-circuits-svg" target="_blank" rel="noreferrer">
            julesr0y/f1-circuits-svg
          </a>{" "}
          (CC BY 4.0). {t("photos")}
        </p>
        <p>{t("privacy")}</p>
        <p className="pt-2 text-[11px] italic text-ink-3/80">{t("dedication")}</p>
      </div>
    </footer>
  );
}
