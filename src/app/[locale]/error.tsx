"use client";

import { useTranslations } from "next-intl";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("common");
  return (
    <div className="glass flex min-h-[40vh] flex-col items-center justify-center gap-4 p-10 text-center">
      <p className="display text-3xl">⚠︎</p>
      <p className="max-w-md text-ink-2">{t("error")}</p>
      <button type="button" onClick={reset} className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white">
        {t("retry")}
      </button>
    </div>
  );
}
