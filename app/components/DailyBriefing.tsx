type DailyBriefingProps = {
  missionCount: number;
  priorityMission: string | null;
  overallProgress: number;
  criticalMissionCount: number;
};

export default function DailyBriefing({
  missionCount,
  priorityMission,
  overallProgress,
  criticalMissionCount,
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
          🎯 Priority:{" "}
          {priorityMission ?? "No mission available"}
        </p>

        <p>⚠ Critical missions: {criticalMissionCount}</p>
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
        <p className="text-xs font-semibold tracking-[0.2em] text-white/40">
          OPERATOR ASSESSMENT
        </p>

        <p className="mt-2 text-sm leading-6 text-white/70">
          {criticalMissionCount > 0
            ? "Focus on the highest-priority critical mission before starting anything new."
            : "Mission load is stable. Continue executing the current priority mission."}
        </p>
      </div>
    </div>
  );
}