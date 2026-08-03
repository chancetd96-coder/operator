"use client";

import { useRouter } from "next/navigation";

import type { Mission } from "@/lib/types/mission";

type MissionDashboardCardProps = {
  mission: Mission;
};

function getRecordedCount(
  values: string[] | undefined,
): number {
  return (values ?? []).filter(
    (value) => value.trim().length > 0,
  ).length;
}

function formatUpdatedAt(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function MissionDashboardCard({
  mission,
}: MissionDashboardCardProps) {
  const router = useRouter();

  const incompleteTaskCount = mission.tasks.filter(
    (task) => task.status !== "Complete",
  ).length;

  const blockerCount = mission.tasks.filter(
    (task) =>
      task.status === "Blocked" ||
      getRecordedCount(task.blockers) > 0,
  ).length;

  const activeRiskCount =
    mission.risks.filter((risk) => !risk.resolved)
      .length +
    mission.tasks.reduce(
      (total, task) =>
        total + getRecordedCount(task.risks),
      0,
    );

  const nextMeeting = [...mission.meetings]
    .filter((meeting) => Boolean(meeting.date))
    .sort((a, b) =>
      (a.date ?? "").localeCompare(b.date ?? ""),
    )[0];

  const progress = Math.min(
    100,
    Math.max(0, mission.progress),
  );

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-white/[0.045] sm:p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-white/45">
              {mission.status}
            </span>

            <span className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.045] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-cyan-100/65">
              {mission.priority}
            </span>
          </div>

          <h3 className="mt-5 truncate text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {mission.title}
          </h3>

          <p className="mt-2 text-sm text-white/35">
            Owner: {mission.owner || "Unassigned"}
          </p>
        </div>

        <span className="shrink-0 text-2xl font-semibold tabular-nums text-white/80">
          {progress}%
        </span>
      </div>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-cyan-300/70 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
        <Metric
          label="Tasks Left"
          value={incompleteTaskCount}
        />

        <Metric
          label="Blockers"
          value={blockerCount}
        />

        <Metric
          label="Risks"
          value={activeRiskCount}
        />
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
        <p className="text-[9px] font-semibold tracking-[0.18em] text-cyan-300/55">
          OPERATOR RECOMMENDATION
        </p>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/62">
          {mission.recommendation ||
            "Continue execution against the highest-priority incomplete task."}
        </p>
      </div>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[9px] font-semibold tracking-[0.16em] text-white/25">
            NEXT COORDINATION
          </p>

          <p className="mt-2 truncate text-xs text-white/45">
            {nextMeeting
              ? nextMeeting.title
              : "No meeting scheduled"}
          </p>

          <p className="mt-2 text-[10px] text-white/25">
            Updated {formatUpdatedAt(mission.updatedAt)}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            router.push(`/missions/${mission.id}`)
          }
          className="shrink-0 rounded-full border border-cyan-300/20 bg-cyan-300/[0.055] px-4 py-2 text-xs font-semibold text-cyan-100 transition hover:border-cyan-300/40 hover:bg-cyan-300/[0.1]"
        >
          Open Mission →
        </button>
      </div>
    </article>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-[#070909] px-3 py-4 text-center">
      <p className="text-lg font-semibold tabular-nums text-white/80">
        {value}
      </p>

      <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-white/25">
        {label}
      </p>
    </div>
  );
}