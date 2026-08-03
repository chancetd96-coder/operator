type DailyBriefingProps = {
  missionCount: number;
  priorityMission: string | null;
  overallProgress: number;
  criticalMissionCount: number;
  blockedTaskCount: number;
  activeRiskCount: number;
  recommendedTask: string | null;
  executionStatus:
    | "On Track"
    | "Needs Attention"
    | "Critical";
  nextMeeting: {
    title: string;
    missionTitle: string;
    scheduledAt: string;
    hasTime: boolean;
  } | null;
};

function getExecutionStatusClasses(
  status: "On Track" | "Needs Attention" | "Critical",
): string {
  switch (status) {
    case "Critical":
      return "border-red-400/30 bg-red-400/10 text-red-200";

    case "Needs Attention":
      return "border-amber-300/30 bg-amber-300/10 text-amber-100";

    case "On Track":
      return "border-emerald-300/30 bg-emerald-300/10 text-emerald-100";
  }
}

export default function DailyBriefing({
  missionCount,
  priorityMission,
  overallProgress,
  criticalMissionCount,
  blockedTaskCount,
  activeRiskCount,
  recommendedTask,
  executionStatus,
  nextMeeting,
}: DailyBriefingProps) {
  return (
    <section className="relative mb-8 overflow-hidden rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.035]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(103,232,249,0.08),transparent_38%)]" />

      <div className="relative border-b border-white/10 px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-cyan-300/70">
              DAILY BRIEFING
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Current operational snapshot
            </h2>
          </div>

          <span
            className={`w-fit rounded-full border px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] ${getExecutionStatusClasses(
              executionStatus,
            )}`}
          >
            {executionStatus.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="relative p-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <p className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/65">
            📌 Active missions:{" "}
            <span className="font-semibold tabular-nums text-white">
              {missionCount}
            </span>
          </p>

          <p className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/65">
            📈 Overall progress:{" "}
            <span className="font-semibold tabular-nums text-white">
              {overallProgress}%
            </span>
          </p>

          <p className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/65">
            🎯 Priority mission:{" "}
            <span className="font-semibold text-white">
              {priorityMission ?? "No mission available"}
            </span>
          </p>

          <p className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/65">
            🔴 Critical missions:{" "}
            <span className="font-semibold tabular-nums text-red-200">
              {criticalMissionCount}
            </span>
          </p>

          <p className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/65">
            🚧 Active blockers:{" "}
            <span className="font-semibold tabular-nums text-red-200">
              {blockedTaskCount}
            </span>
          </p>

          <p className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/65">
            ⚠ Active risks:{" "}
            <span className="font-semibold tabular-nums text-amber-200">
              {activeRiskCount}
            </span>
          </p>
        </div>

        <div className="mt-5 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.035] p-4">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300/70">
            RECOMMENDED NEXT ACTION
          </p>

          <p className="mt-2 text-sm leading-6 text-white/75">
            {recommendedTask ??
              "No incomplete task requires attention."}
          </p>
        </div>

        <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs font-semibold tracking-[0.2em] text-white/40">
            NEXT COORDINATION EVENT
          </p>

          {nextMeeting ? (
            <>
              <p className="mt-2 text-sm font-medium text-white/80">
                {nextMeeting.title}
              </p>

              <p className="mt-1 text-xs text-white/40">
                {nextMeeting.missionTitle}
              </p>

              <p className="mt-2 text-sm text-white/55">
                {new Intl.DateTimeFormat("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: nextMeeting.hasTime
                    ? "numeric"
                    : undefined,
                  minute: nextMeeting.hasTime
                    ? "2-digit"
                    : undefined,
                }).format(
                  new Date(nextMeeting.scheduledAt),
                )}
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-white/40">
              No upcoming meetings scheduled.
            </p>
          )}
        </div>

        <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
          <p className="text-xs font-semibold tracking-[0.2em] text-white/40">
            OPERATOR ASSESSMENT
          </p>

          <p className="mt-2 text-sm leading-6 text-white/70">
            {criticalMissionCount > 0
              ? "Immediate command attention is required. Resolve blockers and stabilize the highest-priority critical mission before accepting new work."
              : blockedTaskCount > 0
                ? "Mission execution is constrained by active blockers. Clear the highest-impact blocker before shifting effort to lower-priority tasks."
                : activeRiskCount > 0
                  ? "Mission load is stable, but active risks require monitoring. Continue execution while preventing risk escalation."
                  : "Mission load is stable. Continue executing the current priority mission and recommended task."}
          </p>
        </div>
      </div>
    </section>
  );
}