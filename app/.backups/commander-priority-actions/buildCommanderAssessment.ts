import type { Mission } from "@/lib/types/mission";
import type {
  CommanderAssessment,
  MissionHealth,
  OperationalTempo,
} from "./types";

export function buildCommanderAssessment(
  mission: Mission,
): CommanderAssessment {

  const totalTasks = mission.tasks.length;

  const completedTasks =
    mission.tasks.filter(
      t => t.status === "Complete",
    ).length;

  const unresolvedRisks =
    mission.risks.filter(
      r => !r.resolved,
    ).length;

  const completedRisks =
    mission.risks.length - unresolvedRisks;

  const blockers =
  mission.tasks.reduce(
    (count, task) => {
      return (
        count +
        (task.blockers?.length ?? 0)
      );
    },
    0,
  );

  let confidence =
    Math.round(
      (mission.progress * 0.7)
      + ((completedTasks / Math.max(totalTasks,1))*30),
    );

  confidence -= unresolvedRisks * 5;
  confidence -= blockers * 3;

  confidence = Math.max(
    0,
    Math.min(100, confidence),
  );

  let health: MissionHealth = "Healthy";

  if (
    unresolvedRisks >= 3 ||
    blockers >= 3 ||
    confidence < 40
  ) {
    health = "Critical";
  } else if (
    unresolvedRisks > 0 ||
    blockers > 0 ||
    confidence < 70
  ) {
    health = "At Risk";
  }

  let tempo: OperationalTempo =
    "Moderate";

  if (mission.progress >= 80)
    tempo = "High";

  if (mission.progress < 25)
    tempo = "Low";

  if (
    blockers >= 5 ||
    unresolvedRisks >= 5
  ) {
    tempo = "Unsustainable";
  }

  const reasons: string[] = [];

  if (unresolvedRisks)
    reasons.push(
      `${unresolvedRisks} unresolved risk(s)`
    );

  if (blockers)
    reasons.push(
      `${blockers} active blocker(s)`
    );

  if (
    completedTasks < totalTasks
  ) {
    reasons.push(
      `${totalTasks-completedTasks} task(s) remaining`
    );
  }

  return {
    missionId: mission.id,

    health,

    confidence,

    tempo,

    forecast:
      confidence > 80
        ? "On Track"
        : confidence > 60
          ? "Monitor Closely"
          : "Needs Intervention",

    recommendation:
      unresolvedRisks
        ? "Resolve active risks before expanding scope."
        : blockers
          ? "Remove operational blockers."
          : "Continue executing highest-priority tasks.",

    completedTasks,
    totalTasks,

    unresolvedRisks,
    completedRisks,

    blockers,

    reasons,
  };
}
