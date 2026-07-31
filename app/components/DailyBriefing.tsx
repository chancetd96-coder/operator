type DailyBriefingProps = {
  missionCount: number;
  priorityMission: string | null;
  overallProgress: number;
  criticalMissionCount: number;
  blockedTaskCount: number;
  activeRiskCount: number;
  recommendedTask: string | null;
};

export default function DailyBriefing({
  missionCount,
  priorityMission,
  overallProgress,
  criticalMissionCount,
  blockedTaskCount,
  activeRiskCount,
  recommendedTask,
}: DailyBriefingProps) {
  return (
    <div className="mb-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
      <p className="text-xs font-semibold tracking-[0.25em] text-cyan-300">
        DAILY BRIEFING
      </p>

<div className="mt-4 grid gap-3 text-white/80 md:grid-cols-2">
  <p>📌 Active missions: {missionCount}</p>

  <p>📈 Overall progress: {overallProgress}%</p>

  <p>
    🎯 Priority mission:{" "}
    {priorityMission ?? "No mission available"}
  </p>

  <p>🔴 Critical missions: {criticalMissionCount}</p>

  <p>🚧 Active blockers: {blockedTaskCount}</p>

  <p>⚠ Active risks: {activeRiskCount}</p>
</div>
<div className="mt-5 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.035] p-4">
  <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300/70">
    RECOMMENDED NEXT ACTION
  </p>

  <p className="mt-2 text-sm leading-6 text-white/75">
    {recommendedTask ?? "No incomplete task requires attention."}
  </p>
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
      : "Mission load is stable. Continue executing the current priority mission and recommended task."}        </p>
      </div>
    </div>
  );
}