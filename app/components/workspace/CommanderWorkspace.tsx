"use client";

import type { CommanderAssessment } from "@/lib/commander/types";

interface CommanderWorkspaceProps {
  assessment: CommanderAssessment;
}

function healthColor(health: CommanderAssessment["health"]) {
  switch (health) {
    case "Healthy":
      return "text-emerald-300";
    case "At Risk":
      return "text-amber-300";
    case "Critical":
      return "text-red-300";
  }
}

export default function CommanderWorkspace({
  assessment,
}: CommanderWorkspaceProps) {
  return (
    <section className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.04] p-8">

      <p className="text-xs tracking-[0.3em] text-cyan-300/70">
        COMMANDER&aposS ASSESSMENT
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <Card
          label="Mission Health"
          value={assessment.health}
          valueClass={healthColor(assessment.health)}
        />

        <Card
          label="Confidence"
          value={`${assessment.confidence}%`}
        />

        <Card
          label="Operational Tempo"
          value={assessment.tempo}
        />

        <Card
          label="Forecast"
          value={assessment.forecast}
        />

      </div>

      <section className="mt-10 rounded-xl border border-white/10 bg-black/20 p-6">
        <p className="text-xs tracking-[0.2em] text-cyan-300/70">
          COMMANDER RECOMMENDATION
        </p>

        <p className="mt-4 text-lg leading-8 text-white/85">
          {assessment.recommendation}
        </p>
      </section>

      <section className="mt-8 rounded-xl border border-white/10 bg-black/20 p-6">
        <p className="text-xs tracking-[0.2em] text-white/40">
          WHY
        </p>

        <ul className="mt-4 space-y-3">
          {assessment.reasons.length === 0 ? (
            <li className="text-white/40">
              No operational concerns detected.
            </li>
          ) : (
            assessment.reasons.map((reason) => (
              <li
                key={reason}
                className="text-white/75"
              >
                • {reason}
              </li>
            ))
          )}
        </ul>
      </section>

    </section>
  );
}

interface CardProps {
  label: string;
  value: string | number;
  valueClass?: string;
}

function Card({
  label,
  value,
  valueClass,
}: CardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-5">
      <p className="text-xs tracking-[0.2em] text-white/40">
        {label}
      </p>

      <p
        className={`mt-3 text-3xl font-semibold ${
          valueClass ?? "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
