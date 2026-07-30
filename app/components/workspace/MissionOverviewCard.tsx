import type {
  Mission,
  MissionStatus,
} from "@/lib/types/mission";

interface MissionOverviewCardProps {
  mission: Mission;
}

function formatDate(value?: string): string {
  if (!value) {
    return "Not set";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getStatusClasses(
  status: MissionStatus,
): string {
  switch (status) {
    case "active":
      return "border-cyan-300/25 bg-cyan-300/10 text-cyan-200";
    case "blocked":
      return "border-red-300/25 bg-red-300/10 text-red-200";
    case "complete":
      return "border-emerald-300/25 bg-emerald-300/10 text-emerald-200";
    case "planning":
    default:
      return "border-white/15 bg-white/[0.06] text-white/60";
  }
}

function getPriorityClasses(
  priority: Mission["priority"],
): string {
  switch (priority) {
    case "Critical":
      return "border-red-300/25 bg-red-300/10 text-red-200";
    case "High":
      return "border-amber-300/25 bg-amber-300/10 text-amber-200";
    case "Normal":
      return "border-cyan-300/25 bg-cyan-300/10 text-cyan-200";
    case "Low":
    default:
      return "border-white/15 bg-white/[0.06] text-white/60";
  }
}

function formatStatus(
  status: MissionStatus,
): string {
  return status.charAt(0).toUpperCase() +
    status.slice(1);
}

function clampProgress(progress: number): number {
  return Math.min(100, Math.max(0, progress));
}

export default function MissionOverviewCard({
  mission,
}: MissionOverviewCardProps) {
  const progress = clampProgress(mission.progress);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:p-8">
      <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-4xl">
          <p className="text-xs font-medium tracking-[0.28em] text-cyan-300/70">
            CURRENT MISSION
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
            {mission.title}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-white/55 md:text-lg">
            {mission.objective ||
              "No mission objective has been defined."}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span
              className={[
                "inline-flex rounded-full border px-3 py-1.5",
                "text-xs font-medium tracking-[0.16em]",
                getStatusClasses(mission.status),
              ].join(" ")}
            >
              {formatStatus(mission.status)}
            </span>

            <span
              className={[
                "inline-flex rounded-full border px-3 py-1.5",
                "text-xs font-medium tracking-[0.16em]",
                getPriorityClasses(mission.priority),
              ].join(" ")}
            >
              {mission.priority.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="w-full rounded-2xl border border-white/10 bg-black/30 p-5 xl:max-w-sm">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.2em] text-white/35">
                MISSION PROGRESS
              </p>

              <p className="mt-2 text-4xl font-semibold text-white">
                {progress}%
              </p>
            </div>

            <p className="text-sm text-white/35">
              {mission.tasks.filter(
                (task) =>
                  task.status === "Complete",
              ).length}
              /{mission.tasks.length} tasks
            </p>
          </div>

          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-cyan-300 transition-[width] duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-2 xl:grid-cols-5">
        <div>
          <p className="text-xs tracking-[0.18em] text-white/30">
            OWNER
          </p>

          <p className="mt-2 text-sm font-medium text-white/75">
            {mission.owner || "Unassigned"}
          </p>
        </div>

        <div>
          <p className="text-xs tracking-[0.18em] text-white/30">
            CREATED
          </p>

          <p className="mt-2 text-sm font-medium text-white/75">
            {formatDate(mission.createdAt)}
          </p>
        </div>

        <div>
          <p className="text-xs tracking-[0.18em] text-white/30">
            UPDATED
          </p>

          <p className="mt-2 text-sm font-medium text-white/75">
            {formatDate(mission.updatedAt)}
          </p>
        </div>

        <div>
          <p className="text-xs tracking-[0.18em] text-white/30">
            DUE
          </p>

          <p className="mt-2 text-sm font-medium text-white/75">
            {formatDate(mission.dueDate)}
          </p>
        </div>

        <div>
          <p className="text-xs tracking-[0.18em] text-white/30">
            EXECUTION SCORE
          </p>

          <p className="mt-2 text-sm font-medium text-white/75">
            {mission.executionScore ??
              "Not scored"}
          </p>
        </div>
      </div>
    </section>
  );
}
