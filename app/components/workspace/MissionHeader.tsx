"use client";

import type { Mission } from "@/lib/types/mission";

interface MissionHeaderProps {
  mission: Mission;
  saveStatus: "idle" | "saving" | "saved" | "error";
  lastSavedAt: Date | null;
  onCompleteMission: () => void;
}

function formatSaveStatus(
  status: MissionHeaderProps["saveStatus"],
  lastSavedAt: Date | null,
): string {
  switch (status) {
    case "saving":
      return "Saving...";

    case "saved":
      return lastSavedAt
        ? `Saved ${lastSavedAt.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })}`
        : "Saved";

    case "error":
      return "Save Failed";

    default:
      return "Auto Save";
  }
}

function progressWidth(progress: number) {
  return Math.max(0, Math.min(progress, 100));
}

export default function MissionHeader({
  mission,
  saveStatus,
  lastSavedAt,
    onCompleteMission,
}: MissionHeaderProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <p className="text-xs tracking-[0.25em] text-cyan-300/70">
            MISSION
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-white">
            {mission.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
              {mission.status}
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
              {mission.priority}
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
              Owner: {mission.owner || "Unassigned"}
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
              {formatSaveStatus(saveStatus, lastSavedAt)}
            </span>
          </div>
        </div>

        <div className="w-full max-w-xs">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/50">
              Progress
            </span>

            <span className="font-semibold text-white">
              {mission.progress}%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-cyan-300 transition-all duration-300"
              style={{
                width: `${progressWidth(
                  mission.progress,
                )}%`,
              }}
            />
          </div>

          <div className="mt-3 flex justify-between text-xs text-white/40">
            <span>
              {mission.tasks.filter(
                (t) => t.status === "Complete",
              ).length}
              /{mission.tasks.length} Tasks
            </span>

            <span>
              Score:{" "}
              {mission.executionScore ?? "--"}
            </span>
          </div>
          {mission.status !== "complete" &&
!mission.archivedAt ? (
  <button
    type="button"
    onClick={onCompleteMission}
    className="mt-5 w-full rounded-xl border border-emerald-300/25 bg-emerald-300/[0.07] px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300/45 hover:bg-emerald-300/[0.12]"
  >
    Complete Mission
  </button>
) : null}

{mission.status === "complete" &&
!mission.archivedAt ? (
  <div className="mt-5 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.05] px-4 py-3">
    <p className="text-xs font-semibold tracking-[0.16em] text-emerald-200/80">
      MISSION COMPLETE
    </p>

    {mission.completedAt ? (
      <p className="mt-2 text-xs text-white/40">
        Completed{" "}
        {new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(new Date(mission.completedAt))}
      </p>
    ) : null}
  </div>
) : null}
        </div>
      </div>
    </section>
  );
}