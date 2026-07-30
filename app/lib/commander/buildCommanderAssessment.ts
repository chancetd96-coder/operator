import type {
  Mission,
  MissionMeeting,
  MissionTask,
} from "@/lib/types/mission";

import type {
  CommanderAssessment,
  CommanderPriorityAction,
  MissionHealth,
  OperationalTempo,
} from "./types";

function parseMissionDate(
  value?: string | null,
): number | null {
  if (!value) {
    return null;
  }

  const timestamp = Date.parse(value);

  return Number.isNaN(timestamp)
    ? null
    : timestamp;
}

function startOfToday(): number {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return today.getTime();
}

function compareTasksByDueDate(
  first: MissionTask,
  second: MissionTask,
): number {
  const firstDate =
    parseMissionDate(first.dueDate) ??
    Number.POSITIVE_INFINITY;

  const secondDate =
    parseMissionDate(second.dueDate) ??
    Number.POSITIVE_INFINITY;

  if (firstDate !== secondDate) {
    return firstDate - secondDate;
  }

  return first.title.localeCompare(second.title);
}

function compareMeetingsByDate(
  first: MissionMeeting,
  second: MissionMeeting,
): number {
  const firstDate =
    parseMissionDate(first.date) ??
    Number.POSITIVE_INFINITY;

  const secondDate =
    parseMissionDate(second.date) ??
    Number.POSITIVE_INFINITY;

  if (firstDate !== secondDate) {
    return firstDate - secondDate;
  }

  return first.title.localeCompare(second.title);
}

function buildPriorityActions(
  mission: Mission,
): CommanderPriorityAction[] {
  const actions: CommanderPriorityAction[] = [];
  const today = startOfToday();

  const blockedTasks = [...mission.tasks]
    .filter(
      task =>
        task.status !== "Complete" &&
        (task.blockers?.length ?? 0) > 0,
    )
    .sort(compareTasksByDueDate);

  for (const task of blockedTasks) {
    const taskBlockers =
      task.blockers?.filter(
        blocker => blocker.trim().length > 0,
      ) ?? [];

    taskBlockers.forEach((blocker, index) => {
      actions.push({
        id: `blocker:${task.id}:${index}`,
        type: "blocker",
        title: `Remove blocker: ${blocker}`,
        reason: `Blocking task: ${task.title}`,
        urgency: "immediate",
        targetId: task.id,
      });
    });
  }

  const unresolvedRisks = mission.risks
    .filter(risk => !risk.resolved)
    .sort((first, second) =>
      first.title.localeCompare(second.title),
    );

  for (const risk of unresolvedRisks) {
    actions.push({
      id: `risk:${risk.id}`,
      type: "risk",
      title: `Mitigate risk: ${risk.title}`,
      reason:
        risk.mitigation?.trim() ||
        risk.description?.trim() ||
        "Unresolved mission risk",
      urgency: "high",
      targetId: risk.id,
    });
  }

  const overdueTasks = [...mission.tasks]
    .filter(task => {
      if (
        task.status === "Complete" ||
        !task.dueDate
      ) {
        return false;
      }

      const dueDate =
        parseMissionDate(task.dueDate);

      return dueDate !== null && dueDate < today;
    })
    .sort(compareTasksByDueDate);

  for (const task of overdueTasks) {
    actions.push({
      id: `overdue-task:${task.id}`,
      type: "task",
      title: `Complete overdue task: ${task.title}`,
      reason: `Due date passed: ${task.dueDate}`,
      urgency:
        task.status === "Blocked"
          ? "immediate"
          : "high",
      targetId: task.id,
    });
  }

  const upcomingMeeting = [...mission.meetings]
    .filter(meeting => {
      const meetingDate =
        parseMissionDate(meeting.date);

      return (
        meetingDate !== null &&
        meetingDate >= today
      );
    })
    .sort(compareMeetingsByDate)
    .at(0);

  if (upcomingMeeting) {
    actions.push({
      id: `meeting:${upcomingMeeting.id}`,
      type: "meeting",
      title: `Prepare for: ${upcomingMeeting.title}`,
      reason: upcomingMeeting.date
        ? `Upcoming meeting on ${upcomingMeeting.date}`
        : "Upcoming mission meeting",
      urgency: "normal",
      targetId: upcomingMeeting.id,
    });
  }

  const highestPriorityIncompleteTask =
    [...mission.tasks]
      .filter(
        task => task.status !== "Complete",
      )
      .sort((first, second) => {
        const statusRank = {
          Blocked: 0,
          "In Progress": 1,
          "Not Started": 2,
          Complete: 3,
        };

        const statusDifference =
          statusRank[first.status] -
          statusRank[second.status];

        if (statusDifference !== 0) {
          return statusDifference;
        }

        const dueDateDifference =
          compareTasksByDueDate(first, second);

        if (dueDateDifference !== 0) {
          return dueDateDifference;
        }

        return second.progress - first.progress;
      })
      .at(0);

  if (highestPriorityIncompleteTask) {
    actions.push({
      id:
        `priority-task:` +
        highestPriorityIncompleteTask.id,
      type: "task",
      title:
        `Advance task: ` +
        highestPriorityIncompleteTask.title,
      reason:
        highestPriorityIncompleteTask.status ===
        "In Progress"
          ? "Highest-priority active task"
          : "Highest-priority incomplete task",
      urgency:
        highestPriorityIncompleteTask.status ===
        "Blocked"
          ? "high"
          : "normal",
      targetId:
        highestPriorityIncompleteTask.id,
    });
  }

  const uniqueActions =
    actions.filter((action, index) => {
      const duplicateIndex =
        actions.findIndex(
          candidate =>
            candidate.type === action.type &&
            candidate.targetId ===
              action.targetId &&
            candidate.title === action.title,
        );

      return duplicateIndex === index;
    });

  return uniqueActions.slice(0, 3);
}

export function buildCommanderAssessment(
  mission: Mission,
): CommanderAssessment {
  const totalTasks = mission.tasks.length;

  const completedTasks =
    mission.tasks.filter(
      task => task.status === "Complete",
    ).length;

  const unresolvedRisks =
    mission.risks.filter(
      risk => !risk.resolved,
    ).length;

  const completedRisks =
    mission.risks.length -
    unresolvedRisks;

  const blockers =
    mission.tasks.reduce(
      (count, task) =>
        count +
        (task.blockers?.length ?? 0),
      0,
    );

  let confidence = Math.round(
    mission.progress * 0.7 +
      (
        completedTasks /
        Math.max(totalTasks, 1)
      ) *
        30,
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

  if (mission.progress >= 80) {
    tempo = "High";
  }

  if (mission.progress < 25) {
    tempo = "Low";
  }

  if (
    blockers >= 5 ||
    unresolvedRisks >= 5
  ) {
    tempo = "Unsustainable";
  }

  const reasons: string[] = [];

  if (unresolvedRisks) {
    reasons.push(
      `${unresolvedRisks} unresolved risk(s)`,
    );
  }

  if (blockers) {
    reasons.push(
      `${blockers} active blocker(s)`,
    );
  }

  if (completedTasks < totalTasks) {
    reasons.push(
      `${
        totalTasks - completedTasks
      } task(s) remaining`,
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

    priorityActions:
      buildPriorityActions(mission),
  };
}
