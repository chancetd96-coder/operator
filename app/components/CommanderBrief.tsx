"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { generateCommanderBrief } from "@/lib/commander";
import type { Mission } from "@/types/mission";

type CommanderBriefProps = {
  missions: Mission[];
};

function formatGeneratedAt(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function CommanderBrief({
  missions,
}: CommanderBriefProps) {
  const router = useRouter();

  const brief = useMemo(
    () => generateCommanderBrief(missions),
    [missions],
  );

  const healthCounts = brief.missionHealth.reduce(
    (counts, mission) => {
      counts[mission.status] += 1;
      return counts;
    },
    {
      Healthy: 0,
      "At Risk": 0,
      Critical: 0,
    },
  );

  if (missions.length === 0) {
    return (
      <section className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-xs tracking-[0.3em] text-cyan-300/70">
          COMMANDER MODE
        </p>

        <h3 className="mt-3 text-2xl font-semibold">
          No active missions
        </h3>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
          Build your first mission and Operator will begin
          ranking tasks, identifying risks, and recommending
          the next action.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-8 overflow-hidden rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.035]">
      <div className="border-b border-white/10 px-6 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs tracking-[0.3em] text-cyan-300/70">
              COMMANDER BRIEF
            </p>

            <h3 className="mt-3 text-3xl font-semibold">
              Operational picture
            </h3>
          </div>

          <p className="text-xs tracking-[0.2em] text-white/30">
            UPDATED {formatGeneratedAt(brief.generatedAt)}
          </p>
        </div>
      </div>

      <div className="grid gap-px bg-white/10 md:grid-cols-5">
        <Stat
          label="Active Missions"
          value={brief.activeMissionCount}
        />
        <Stat
          label="Total Tasks"
          value={brief.totalTaskCount}
        />
        <Stat
          label="Blocked"
          value={brief.blockedTaskCount}
        />
        <Stat
          label="Overdue"
          value={brief.overdueTaskCount}
        />
        <Stat
          label="Overall Progress"
          value={`${brief.overallProgress}%`}
        />
      </div>

      <div className="grid gap-6 p-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <section>
            <p className="text-xs tracking-[0.25em] text-white/40">
              RECOMMENDED NEXT ACTION
            </p>

            {brief.recommendedTask ? (
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/missions/${brief.recommendedTask?.missionId}`,
                  )
                }
                className="mt-4 w-full rounded-2xl border border-cyan-300/20 bg-black/20 p-5 text-left transition hover:bg-white/[0.05]"
              >
                <p className="text-xs text-cyan-300/70">
                  {brief.recommendedTask.missionTitle}
                </p>

                <h4 className="mt-2 text-xl font-semibold">
                  {brief.recommendedTask.task.title}
                </h4>

                <div className="mt-4 flex flex-wrap gap-2">
                  {brief.recommendedTask.reasons.map(
                    (reason) => (
                      <span
                        key={reason}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50"
                      >
                        {reason}
                      </span>
                    ),
                  )}
                </div>
              </button>
            ) : (
              <p className="mt-4 text-sm text-white/40">
                All current tasks are complete.
              </p>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between">
              <p className="text-xs tracking-[0.25em] text-white/40">
                TODAY&apos;S FOCUS
              </p>

              <span className="text-xs text-white/30">
                Top {brief.focusTasks.length}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {brief.focusTasks.map((rankedTask, index) => (
                <button
                  key={rankedTask.task.id}
                  type="button"
                  onClick={() =>
                    router.push(
                      `/missions/${rankedTask.missionId}`,
                    )
                  }
                  className="flex w-full items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-left transition hover:bg-white/[0.07]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                    {index + 1}
                  </span>

                  <span className="min-w-0">
                    <span className="block text-xs text-white/35">
                      {rankedTask.missionTitle}
                    </span>

                    <span className="mt-1 block text-sm font-medium">
                      {rankedTask.task.title}
                    </span>
                  </span>

                  <span className="ml-auto text-xs text-white/30">
                    {rankedTask.score}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <p className="text-xs tracking-[0.25em] text-white/40">
              MISSION HEALTH
            </p>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <HealthCount
                label="Healthy"
                value={healthCounts.Healthy}
              />
              <HealthCount
                label="At Risk"
                value={healthCounts["At Risk"]}
              />
              <HealthCount
                label="Critical"
                value={healthCounts.Critical}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs tracking-[0.25em] text-white/40">
                ALERTS
              </p>

              <span className="text-xs text-white/30">
                {brief.alerts.length}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {brief.alerts.length === 0 && (
                <p className="text-sm text-white/35">
                  No immediate alerts.
                </p>
              )}

              {brief.alerts.map((alert) => (
                <button
                  key={alert.id}
                  type="button"
                  onClick={() =>
                    router.push(
                      `/missions/${alert.missionId}`,
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/20 p-4 text-left transition hover:bg-white/[0.05]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-white/35">
                      {alert.type}
                    </span>

                    <span className="text-xs text-white/25">
                      {alert.missionTitle}
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-medium">
                    {alert.title}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/40">
                    {alert.detail}
                  </p>
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="bg-black/60 px-5 py-4">
      <p className="text-xs text-white/35">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function HealthCount({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-center">
      <p className="text-xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-white/35">{label}</p>
    </div>
  );
}