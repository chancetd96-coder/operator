"use client";

import type {
  CommanderAssessment,
  CommanderPriorityAction,
} from "@/lib/commander/types";

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

function urgencyBadge(
  urgency: CommanderPriorityAction["urgency"],
) {
  switch (urgency) {
    case "immediate":
      return {
        label: "Immediate",
        className:
          "border-red-400/30 bg-red-400/10 text-red-300",
      };

    case "high":
      return {
        label: "High",
        className:
          "border-amber-400/30 bg-amber-400/10 text-amber-300",
      };

    case "normal":
      return {
        label: "Normal",
        className:
          "border-cyan-300/30 bg-cyan-300/10 text-cyan-300",
      };
  }
}

export default function CommanderWorkspace({
  assessment,
}: CommanderWorkspaceProps) {
  return (
    <section className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.04] p-8">
      <p className="text-xs tracking-[0.3em] text-cyan-300/70">
        COMMANDER&apos;S ASSESSMENT
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

      {assessment.priorityActions.length > 0 && (
        <section className="mt-8 rounded-xl border border-white/10 bg-black/20 p-6">
          <p className="text-xs tracking-[0.2em] text-cyan-300/70">
            PRIORITY ACTIONS
          </p>

          <div className="mt-5 space-y-4">
            {assessment.priorityActions.map((action) => {
              const badge = urgencyBadge(action.urgency);

              return (
                <div
                  key={action.id}
                  className="rounded-lg border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">
                      {action.title}
                    </p>

                    <span
                      className={`rounded-full border px-2 py-1 text-xs ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-white/60">
                    {action.reason}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

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