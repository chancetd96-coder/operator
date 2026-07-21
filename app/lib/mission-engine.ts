import type { Mission, MissionPriority } from "@/types/mission";

export function getMissionHealth(mission: Mission) {
  if (mission.progress >= 80) return "Excellent";
  if (mission.progress >= 50) return "Good";
  if (mission.progress >= 25) return "Needs Attention";
  return "Critical";
}

const priorityRank: Record<MissionPriority, number> = {
  Critical: 4,
  High: 3,
  Normal: 2,
  Low: 1,
};

export function getHighestPriorityMission(
  missions: Mission[],
): Mission | null {
  if (missions.length === 0) return null;

  return [...missions].sort((a, b) => {
    const aPriority = a.priority ?? "Normal";
    const bPriority = b.priority ?? "Normal";

    return priorityRank[bPriority] - priorityRank[aPriority];
  })[0];
}

export function getMissionCount(
  missions: Mission[],
): number {
  return missions.length;
}

export function getOverallProgress(
  missions: Mission[],
): number {
  if (missions.length === 0) return 0;

  const total = missions.reduce(
    (sum, mission) => sum + mission.progress,
    0,
  );

  return Math.round(total / missions.length);
}

export function getCriticalMissions(
  missions: Mission[],
): Mission[] {
  return missions.filter((m) => m.progress < 25);
}

export function getCompletedMissions(
  missions: Mission[],
): Mission[] {
  return missions.filter((m) => m.progress >= 100);
}