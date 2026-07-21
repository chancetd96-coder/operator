import type {
  Mission,
  MissionPriority,
  MissionTask,
} from "@/types/mission";

export type MissionHealthStatus =
  | "Healthy"
  | "At Risk"
  | "Critical";

export type CommanderAlertType =
  | "Overdue"
  | "Blocked"
  | "Upcoming"
  | "Risk";

export type CommanderAlert = {
  id: string;
  type: CommanderAlertType;
  title: string;
  detail: string;
  missionId: number;
  missionTitle: string;
  taskId?: string;
};

export type RankedTask = {
  missionId: number;
  missionTitle: string;
  task: MissionTask;
  score: number;
  reasons: string[];
};

export type MissionHealth = {
  missionId: number;
  missionTitle: string;
  score: number;
  status: MissionHealthStatus;
  completedTasks: number;
  blockedTasks: number;
  overdueTasks: number;
  unresolvedRisks: number;
};

export type CommanderBrief = {
  generatedAt: string;
  activeMissionCount: number;
  totalTaskCount: number;
  completedTaskCount: number;
  blockedTaskCount: number;
  overdueTaskCount: number;
  overallProgress: number;
  priorityMission: Mission | null;
  recommendedTask: RankedTask | null;
  focusTasks: RankedTask[];
  alerts: CommanderAlert[];
  missionHealth: MissionHealth[];
};

const PRIORITY_SCORES: Record<MissionPriority, number> = {
  Critical: 20,
  High: 12,
  Normal: 5,
  Low: 1,
};

function startOfToday(): Date {
  const now = new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
}

function parseDate(value: string | null): Date | null {
  if (!value) return null;

  const parsed = new Date(`${value}T00:00:00`);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function isTaskOverdue(task: MissionTask): boolean {
  if (task.status === "Complete") return false;

  const dueDate = parseDate(task.dueDate);

  if (!dueDate) return false;

  return dueDate < startOfToday();
}

export function isTaskDueSoon(
  task: MissionTask,
  days = 3,
): boolean {
  if (task.status === "Complete") return false;

  const dueDate = parseDate(task.dueDate);

  if (!dueDate) return false;

  const today = startOfToday();
  const cutoff = new Date(today);

  cutoff.setDate(cutoff.getDate() + days);

  return dueDate >= today && dueDate <= cutoff;
}

export function getBlockedTasks(
  missions: Mission[],
): RankedTask[] {
  return rankTasks(missions).filter(
    ({ task }) => task.status === "Blocked",
  );
}

export function getOverdueTasks(
  missions: Mission[],
): RankedTask[] {
  return rankTasks(missions).filter(({ task }) =>
    isTaskOverdue(task),
  );
}

export function getUpcomingDeadlines(
  missions: Mission[],
  days = 3,
): RankedTask[] {
  return rankTasks(missions).filter(({ task }) =>
    isTaskDueSoon(task, days),
  );
}

export function scoreTask(
  task: MissionTask,
  mission: Mission,
): RankedTask {
  let score = 0;
  const reasons: string[] = [];

  const priority =
    mission.priority ?? "Normal";

  score += PRIORITY_SCORES[priority];

  if (priority === "Critical") {
    reasons.push("Critical mission");
  } else if (priority === "High") {
    reasons.push("High-priority mission");
  }

  if (isTaskOverdue(task)) {
    score += 30;
    reasons.push("Overdue");
  } else if (isTaskDueSoon(task, 1)) {
    score += 18;
    reasons.push("Due within 24 hours");
  } else if (isTaskDueSoon(task, 3)) {
    score += 10;
    reasons.push("Due soon");
  }

  if (task.status === "Blocked") {
    score += 22;
    reasons.push("Blocked");
  }

  if (task.status === "In Progress") {
    score += 8;
    reasons.push("Already in progress");
  }

  if (
    task.status !== "Complete" &&
    task.progress >= 75
  ) {
    score += 6;
    reasons.push("Near completion");
  }

  if (task.blockers.length > 0) {
    score += 6;
    reasons.push("Has recorded blockers");
  }

  if (task.risks.length > 0) {
    score += 4;
    reasons.push("Has task risks");
  }

  if (task.status === "Complete") {
    score -= 100;
  }

  return {
    missionId: mission.id,
    missionTitle: mission.title,
    task,
    score,
    reasons,
  };
}

export function rankTasks(
  missions: Mission[],
): RankedTask[] {
  return missions
    .flatMap((mission) =>
      mission.tasks.map((task) =>
        scoreTask(task, mission),
      ),
    )
    .filter(({ task }) => task.status !== "Complete")
    .sort((a, b) => b.score - a.score);
}

export function scoreMission(
  mission: Mission,
): number {
  let score =
    PRIORITY_SCORES[mission.priority ?? "Normal"];

  const incompleteTasks = mission.tasks.filter(
    (task) => task.status !== "Complete",
  );

  const blockedTasks = mission.tasks.filter(
    (task) => task.status === "Blocked",
  );

  const overdueTasks = mission.tasks.filter(
    isTaskOverdue,
  );

  const unresolvedRisks = mission.risks.filter(
    (risk) => !risk.resolved,
  );

  score += incompleteTasks.length * 2;
  score += blockedTasks.length * 8;
  score += overdueTasks.length * 12;
  score += unresolvedRisks.length * 5;

  if (mission.progress === 0) {
    score += 3;
  }

  if (mission.progress >= 100) {
    score -= 100;
  }

  return score;
}

export function getCommanderRecommendation(
  missions: Mission[],
): Mission | null {
  const incompleteMissions = missions.filter(
    (mission) => mission.progress < 100,
  );

  if (incompleteMissions.length === 0) {
    return null;
  }

  return [...incompleteMissions].sort(
    (a, b) => scoreMission(b) - scoreMission(a),
  )[0];
}

export function calculateMissionHealth(
  mission: Mission,
): MissionHealth {
  const taskCount = mission.tasks.length;

  const completedTasks = mission.tasks.filter(
    (task) => task.status === "Complete",
  ).length;

  const blockedTasks = mission.tasks.filter(
    (task) => task.status === "Blocked",
  ).length;

  const overdueTasks = mission.tasks.filter(
    isTaskOverdue,
  ).length;

  const unresolvedRisks = mission.risks.filter(
    (risk) => !risk.resolved,
  ).length;

  const completionRate =
    taskCount === 0
      ? mission.progress
      : (completedTasks / taskCount) * 100;

  let score = completionRate;

  score -= blockedTasks * 12;
  score -= overdueTasks * 15;
  score -= unresolvedRisks * 6;

  score = Math.max(0, Math.min(100, Math.round(score)));

  let status: MissionHealthStatus = "Healthy";

  if (score < 40 || overdueTasks >= 2) {
    status = "Critical";
  } else if (
    score < 70 ||
    blockedTasks > 0 ||
    unresolvedRisks > 1
  ) {
    status = "At Risk";
  }

  return {
    missionId: mission.id,
    missionTitle: mission.title,
    score,
    status,
    completedTasks,
    blockedTasks,
    overdueTasks,
    unresolvedRisks,
  };
}

export function getCommanderAlerts(
  missions: Mission[],
): CommanderAlert[] {
  const alerts: CommanderAlert[] = [];

  for (const mission of missions) {
    for (const task of mission.tasks) {
      if (isTaskOverdue(task)) {
        alerts.push({
          id: `overdue-${mission.id}-${task.id}`,
          type: "Overdue",
          title: task.title,
          detail: `Task was due ${task.dueDate}.`,
          missionId: mission.id,
          missionTitle: mission.title,
          taskId: task.id,
        });
      }

      if (task.status === "Blocked") {
        alerts.push({
          id: `blocked-${mission.id}-${task.id}`,
          type: "Blocked",
          title: task.title,
          detail:
            task.blockers[0] ??
            "Task is marked blocked.",
          missionId: mission.id,
          missionTitle: mission.title,
          taskId: task.id,
        });
      }

      if (
        !isTaskOverdue(task) &&
        isTaskDueSoon(task, 2)
      ) {
        alerts.push({
          id: `upcoming-${mission.id}-${task.id}`,
          type: "Upcoming",
          title: task.title,
          detail: `Task is due ${task.dueDate}.`,
          missionId: mission.id,
          missionTitle: mission.title,
          taskId: task.id,
        });
      }
    }

    for (const risk of mission.risks) {
      if (!risk.resolved) {
        alerts.push({
          id: `risk-${mission.id}-${risk.id}`,
          type: "Risk",
          title: risk.title,
          detail:
            risk.mitigation ||
            risk.description ||
            "No mitigation recorded.",
          missionId: mission.id,
          missionTitle: mission.title,
        });
      }
    }
  }

  const alertPriority: Record<
    CommanderAlertType,
    number
  > = {
    Overdue: 4,
    Blocked: 3,
    Upcoming: 2,
    Risk: 1,
  };

  return alerts.sort(
    (a, b) =>
      alertPriority[b.type] -
      alertPriority[a.type],
  );
}

export function generateCommanderBrief(
  missions: Mission[],
): CommanderBrief {
  const allTasks = missions.flatMap(
    (mission) => mission.tasks,
  );

  const completedTaskCount = allTasks.filter(
    (task) => task.status === "Complete",
  ).length;

  const blockedTaskCount = allTasks.filter(
    (task) => task.status === "Blocked",
  ).length;

  const overdueTaskCount = allTasks.filter(
    isTaskOverdue,
  ).length;

  const overallProgress =
    missions.length === 0
      ? 0
      : Math.round(
          missions.reduce(
            (total, mission) =>
              total + mission.progress,
            0,
          ) / missions.length,
        );

  const rankedTasks = rankTasks(missions);

  return {
    generatedAt: new Date().toISOString(),
    activeMissionCount: missions.filter(
      (mission) => mission.progress < 100,
    ).length,
    totalTaskCount: allTasks.length,
    completedTaskCount,
    blockedTaskCount,
    overdueTaskCount,
    overallProgress,
    priorityMission:
      getCommanderRecommendation(missions),
    recommendedTask: rankedTasks[0] ?? null,
    focusTasks: rankedTasks.slice(0, 3),
    alerts: getCommanderAlerts(missions).slice(0, 6),
    missionHealth: missions
      .map(calculateMissionHealth)
      .sort((a, b) => a.score - b.score),
  };
}