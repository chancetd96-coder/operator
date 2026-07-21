import type {
  Mission,
  MissionMeeting,
  MissionRisk,
  MissionTask,
} from "@/types/mission";

const MISSIONS_KEY = "operator-missions";
const SELECTED_MISSION_KEY = "operator-selected-mission-id";

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

function normalizeTask(
  task: MissionTask | string,
  missionId: number,
  index: number,
): MissionTask {
  if (typeof task !== "string") {
    return {
      ...task,
      description: task.description ?? "",
      status: task.status ?? "Not Started",
      progress: task.progress ?? 0,
      owner: task.owner ?? "Chance",
      dueDate: task.dueDate ?? null,
      scheduledDate: task.scheduledDate ?? null,
      comments: task.comments ?? [],
      risks: task.risks ?? [],
      blockers: task.blockers ?? [],
      meetingIds: task.meetingIds ?? [],
    };
  }

  return {
    id: `mission-${missionId}-task-${index}`,
    title: task,
    description: "",
    status: "Not Started",
    progress: 0,
    owner: "Chance",
    dueDate: null,
    scheduledDate: null,
    comments: [],
    risks: [],
    blockers: [],
    meetingIds: [],
  };
}

function normalizeMeeting(
  meeting: MissionMeeting | string,
  missionId: number,
  index: number,
): MissionMeeting {
  if (typeof meeting !== "string") {
    return {
      ...meeting,
      date: meeting.date ?? null,
      time: meeting.time ?? null,
      notes: meeting.notes ?? "",
      taskIds: meeting.taskIds ?? [],
    };
  }

  return {
    id: `mission-${missionId}-meeting-${index}`,
    title: meeting,
    date: null,
    time: null,
    notes: "",
    taskIds: [],
  };
}

function normalizeRisk(
  risk: MissionRisk | string,
  missionId: number,
  index: number,
): MissionRisk {
  if (typeof risk !== "string") {
    return {
      ...risk,
      description: risk.description ?? "",
      mitigation: risk.mitigation ?? "",
      taskIds: risk.taskIds ?? [],
      resolved: risk.resolved ?? false,
    };
  }

  return {
    id: `mission-${missionId}-risk-${index}`,
    title: risk,
    description: "",
    mitigation: "",
    taskIds: [],
    resolved: false,
  };
}

function normalizeMission(mission: Mission): Mission {
  return {
    ...mission,
    summary: mission.summary ?? "",
    assumptions: mission.assumptions ?? [],
    recommendation:
      mission.recommendation ??
      "Review this mission and select the next highest-leverage action.",
    priority: mission.priority ?? "Normal",
    owner: mission.owner ?? "Chance",
    progress: mission.progress ?? 0,

    tasks: (mission.tasks ?? []).map((task, index) =>
      normalizeTask(task, mission.id, index),
    ),

    meetings: (mission.meetings ?? []).map((meeting, index) =>
      normalizeMeeting(meeting, mission.id, index),
    ),

    risks: (mission.risks ?? []).map((risk, index) =>
      normalizeRisk(risk, mission.id, index),
    ),

    schedule: mission.schedule ?? [],
    resources: mission.resources ?? [],
    successMetrics: mission.successMetrics ?? [],
  };
}

export function loadMissions(): Mission[] {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(MISSIONS_KEY);

    if (!raw) return [];

    const storedMissions = JSON.parse(raw) as Mission[];
    const normalizedMissions = storedMissions.map(normalizeMission);

    window.localStorage.setItem(
      MISSIONS_KEY,
      JSON.stringify(normalizedMissions),
    );

    return normalizedMissions;
  } catch (error) {
    console.error("Failed to load Operator missions:", error);
    window.localStorage.removeItem(MISSIONS_KEY);
    return [];
  }
}

export function saveMissions(missions: Mission[]): void {
  if (!canUseStorage()) return;

  window.localStorage.setItem(
    MISSIONS_KEY,
    JSON.stringify(missions),
  );
}

export function loadSelectedMissionId(): number | null {
  if (!canUseStorage()) return null;

  const raw = window.localStorage.getItem(
    SELECTED_MISSION_KEY,
  );

  if (!raw) return null;

  const id = Number(raw);

  return Number.isNaN(id) ? null : id;
}

export function saveSelectedMissionId(
  id: number | null,
): void {
  if (!canUseStorage()) return;

  if (id === null) {
    window.localStorage.removeItem(SELECTED_MISSION_KEY);
    return;
  }

  window.localStorage.setItem(
    SELECTED_MISSION_KEY,
    String(id),
  );
}