"use client";

import type { Mission } from "@/types/mission";

type Props = {
  mission: Mission;
  completedTaskCount: number;
};

export default function OverviewTab({
  mission,
  completedTaskCount,
}: Props) {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 p-6">
        <p className="text-xs tracking-[0.2em] text-white/40">
          SUMMARY
        </p>

        <p className="mt-4 text-white/80">
          {mission.summary}
        </p>
      </section>

      <section className="rounded-2xl border border-white/10 p-6">
        <p className="text-xs tracking-[0.2em] text-white/40">
          COMMANDER RECOMMENDATION
        </p>

        <p className="mt-4 text-white">
          {mission.recommendation}
        </p>
      </section>

      <section className="rounded-2xl border border-white/10 p-6">
        <div className="flex justify-between">
          <span>Tasks Complete</span>

          <strong>
            {completedTaskCount}/{mission.tasks.length}
          </strong>
        </div>
      </section>
    </div>
  );
}
