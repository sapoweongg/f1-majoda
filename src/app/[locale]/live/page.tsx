import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Radio } from "lucide-react";
import { hasLiveCredentials } from "@/lib/api/openf1";
import { countryToIso } from "@/lib/countries";
import { buildLiveSnapshot, buildReplay, getLiveSession, isLiveWindow, latestFinishedRace } from "@/lib/live";
import { SESSION_MESSAGE_KEY } from "@/lib/mapping";
import { safe } from "@/lib/safe";
import { LiveTiming } from "@/components/live/LiveTiming";
import { ReplayPlayer } from "@/components/live/ReplayPlayer";
import type { TowerLabels } from "@/components/live/TimingTower";
import { EmptyState, PageTitle, SectionHeader } from "@/components/ui/primitives";
import { LocalTime } from "@/components/ui/time";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/[locale]/live">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "live" });
  return { title: t("title") };
}

export default async function LivePage({ params }: PageProps<"/[locale]/live">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("live");
  const tc = await getTranslations("common");
  const tr = await getTranslations("races");
  const ts = await getTranslations("sessions");
  const sessionLabel = (name: string) => (SESSION_MESSAGE_KEY[name] ? ts(SESSION_MESSAGE_KEY[name]) : name);

  const labels: TowerLabels = {
    pos: tc("pos"),
    driver: tc("driver"),
    interval: t("interval"),
    leaderGap: t("leaderGap"),
    tyre: t("tyre"),
    stops: t("stops"),
    lastLap: tr("lap"),
  };

  const session = await safe(getLiveSession(), undefined);
  const forced = Boolean(process.env.OPENF1_LIVE_SESSION_KEY);
  const live = session && (forced || isLiveWindow(session));

  if (live && (forced || hasLiveCredentials())) {
    const initial = await safe(buildLiveSnapshot(), null);
    if (initial && initial.mode === "live") {
      return (
        <div>
          <PageTitle
            eyebrow={`${session.country_name} · ${session.circuit_short_name}`}
            title={
              <span className="flex items-center gap-3">
                <Radio className="text-accent" size={40} /> {sessionLabel(session.session_name)}
              </span>
            }
          />
          <LiveTiming initial={initial} labels={labels} />
        </div>
      );
    }
  }

  const race = await safe(latestFinishedRace(), undefined);
  const replay = race ? await safe(buildReplay(race), null) : null;

  return (
    <div className="space-y-8">
      <PageTitle title={t("title")} />
      <div className="glass flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">{live ? t("notEnabled") : t("noLive")}</p>
          {session && !live && (
            <p className="mt-1 text-sm text-ink-3">
              {session.country_name} · {sessionLabel(session.session_name)} ·{" "}
              <LocalTime iso={session.date_start} options={{ dateStyle: "medium", timeStyle: "short" }} />
            </p>
          )}
        </div>
        {!live && <p className="text-sm text-ink-2">{t("notEnabled")}</p>}
      </div>

      {replay ? (
        <section>
          <SectionHeader
            eyebrow={
              <span className="flex items-center gap-2">
                <span className={`fi fi-${countryToIso(replay.session.country) ?? "xx"} rounded-[2px]`} aria-hidden />
                {replay.session.country} · {replay.session.circuit}
              </span>
            }
            title={t("replay")}
          />
          <p className="-mt-2 mb-4 text-sm text-ink-3">{t("replayHelp")}</p>
          <ReplayPlayer data={replay} labels={labels} />
        </section>
      ) : (
        <EmptyState>{tc("noData")}</EmptyState>
      )}
    </div>
  );
}
