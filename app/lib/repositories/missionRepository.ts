import type { Mission } from "@/lib/types/mission";

const MISSIONS_STORAGE_KEY = "operator-missions";
const ACTIVE_MISSION_STORAGE_KEY =
  "operator-active-mission-id";

function createDefaultMission(): Mission {
  const now = new Date().toISOString();

  return {
    id: "defense-unicorns-interview",
    title: "Defense Unicorns Interview",
    objective: "Secure a Mission Manager offer.",
    summary:
      "Prepare for and successfully complete the Defense Unicorns interview process.",
    status: "active",
    priority: "High",
    progress: 6,
    executionScore: 0,
    owner: "Chance",
    recommendation:
      "Complete the highest-impact interview preparation tasks first.",
    prompt: "",
    assumptions: [],
    schedule: [],
    resources: [],
    successMetrics: [],
    tasks: [
      {
        id: "review-company-role",
        title: "Review company and role",
        description:
          "Review Defense Unicorns, the Mission Manager role, and first-year outcomes.",
        status: "In Progress",
        owner: "Chance",
        dueDate: null,
        progress: 25,
      },
      {
        id: "practice-interview-stories",
        title: "Practice interview stories",
        description:
          "Prepare concise stories covering leadership, failure, conflict, rapid learning, and execution.",
        status: "Not Started",
        owner: "Chance",
        dueDate: null,
        progress: 0,
      },
      {
        id: "prepare-questions",
        title: "Prepare questions",
        description:
          "Prepare thoughtful questions about mission delivery, team structure, and growth.",
        status: "Not Started",
        owner: "Chance",
        dueDate: null,
        progress: 0,
      },
      {
        id: "confirm-compensation-position",
        title: "Confirm compensation position",
        description:
          "Define the target compensation range and supporting rationale.",
        status: "Not Started",
        owner: "Chance",
        dueDate: null,
        progress: 0,
      },
    ],
    risks: [],
    meetings: [],
    createdAt: now,
    updatedAt: now,
    startedAt: now,
    color: "emerald",
    icon: "target",
  };
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function seedDefaultMission(): Mission[] {
  const missions = [createDefaultMission()];

  if (isBrowser()) {
    window.localStorage.setItem(
      MISSIONS_STORAGE_KEY,
      JSON.stringify(missions),
    );

    window.localStorage.setItem(
      ACTIVE_MISSION_STORAGE_KEY,
      missions[0].id,
    );
  }

  return missions;
}

function normalizeMission(
  mission: Partial<Mission>,
): Mission {
  const now = new Date().toISOString();
  const fallback = createDefaultMission();

  return {
    ...fallback,
    ...mission,
    id: String(mission.id ?? fallback.id),
    title: mission.title ?? fallback.title,
    objective:
      mission.objective ??
      mission.summary ??
      fallback.objective,
    summary:
      mission.summary ??
      mission.objective ??
      fallback.summary,
    status: mission.status ?? fallback.status,
    priority:
      typeof mission.priority === "string"
        ? mission.priority
        : fallback.priority,
    progress:
      typeof mission.progress === "number"
        ? mission.progress
        : 0,
    owner: mission.owner ?? fallback.owner,
    recommendation:
      mission.recommendation ??
      fallback.recommendation,
    prompt: mission.prompt ?? "",
    assumptions: Array.isArray(mission.assumptions)
      ? mission.assumptions
      : [],
    schedule: Array.isArray(mission.schedule)
      ? mission.schedule
      : [],
    resources: Array.isArray(mission.resources)
      ? mission.resources
      : [],
    successMetrics: Array.isArray(
      mission.successMetrics,
    )
      ? mission.successMetrics
      : [],
    tasks: Array.isArray(mission.tasks)
      ? mission.tasks
      : [],
    risks: Array.isArray(mission.risks)
      ? mission.risks
      : [],
    meetings: Array.isArray(mission.meetings)
      ? mission.meetings
      : [],
   createdAt: mission.createdAt ?? now,
updatedAt: mission.updatedAt ?? now,
startedAt: mission.startedAt,
completedAt: mission.completedAt,
archivedAt: mission.archivedAt,
archiveExpiresAt: mission.archiveExpiresAt,
  };
}

function readMissions(): Mission[] {
  if (!isBrowser()) {
    return [createDefaultMission()];
  }

  try {
    const stored = window.localStorage.getItem(
      MISSIONS_STORAGE_KEY,
    );

    if (!stored) {
      return seedDefaultMission();
    }

    const parsed = JSON.parse(stored) as unknown;

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return seedDefaultMission();
    }

    const missions = parsed.map((mission) =>
      normalizeMission(mission as Partial<Mission>),
    );

    writeMissions(missions);

    return missions;
  } catch {
    return seedDefaultMission();
  }
}

function writeMissions(missions: Mission[]): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(
    MISSIONS_STORAGE_KEY,
    JSON.stringify(missions),
  );
}

function listMissions(): Mission[] {
  const priorityRank: Record<
    Mission["priority"],
    number
  > = {
    Critical: 1,
    High: 2,
    Normal: 3,
    Low: 4,
  };

  return [...readMissions()].sort(
    (a, b) =>
      priorityRank[a.priority] -
      priorityRank[b.priority],
  );
}

function getMission(id: string): Mission | null {
  return (
    readMissions().find(
      (mission) => mission.id === id,
    ) ?? null
  );
}

function createMission(
  input: Omit<
    Mission,
    "id" | "createdAt" | "updatedAt"
  > &
    Partial<Pick<Mission, "id">>,
): Mission {
  const now = new Date().toISOString();

  const mission: Mission = {
    ...input,
    id: input.id ?? crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  writeMissions([...readMissions(), mission]);

  return mission;
}

function updateMission(
  id: string,
  updates: Partial<
    Omit<Mission, "id" | "createdAt">
  >,
): Mission | null {
  const missions = readMissions();

  const existing = missions.find(
    (mission) => mission.id === id,
  );

  if (!existing) {
    return null;
  }

  const updatedMission: Mission = {
    ...existing,
    ...updates,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };

  writeMissions(
    missions.map((mission) =>
      mission.id === id ? updatedMission : mission,
    ),
  );

  return updatedMission;
}

function saveMission(mission: Mission): Mission {
  const missions = readMissions();

  const existing = missions.find(
    (current) => current.id === mission.id,
  );

  const savedMission: Mission = normalizeMission({
    ...mission,
    createdAt:
      existing?.createdAt ?? mission.createdAt,
    updatedAt: new Date().toISOString(),
  });

  if (existing) {
    writeMissions(
      missions.map((current) =>
        current.id === savedMission.id
          ? savedMission
          : current,
      ),
    );
  } else {
    writeMissions([...missions, savedMission]);
  }

  return savedMission;
}

function deleteMission(id: string): boolean {
  const missions = readMissions();

  const remaining = missions.filter(
    (mission) => mission.id !== id,
  );

  if (remaining.length === missions.length) {
    return false;
  }

  writeMissions(remaining);

  if (
    isBrowser() &&
    window.localStorage.getItem(
      ACTIVE_MISSION_STORAGE_KEY,
    ) === id
  ) {
    const nextMission = remaining[0];

    if (nextMission) {
      window.localStorage.setItem(
        ACTIVE_MISSION_STORAGE_KEY,
        nextMission.id,
      );
    } else {
      window.localStorage.removeItem(
        ACTIVE_MISSION_STORAGE_KEY,
      );
    }
  }

  return true;
}

function getActiveMission(): Mission | null {
  const missions = readMissions();

  if (!isBrowser()) {
    return (
      missions.find(
        (mission) => mission.status === "active",
      ) ??
      missions[0] ??
      null
    );
  }

  const activeMissionId =
    window.localStorage.getItem(
      ACTIVE_MISSION_STORAGE_KEY,
    );

  const selectedMission = missions.find(
    (mission) => mission.id === activeMissionId,
  );

  if (selectedMission) {
    return selectedMission;
  }

  const activeMission =
    missions.find(
      (mission) => mission.status === "active",
    ) ??
    missions[0] ??
    null;

  if (activeMission) {
    window.localStorage.setItem(
      ACTIVE_MISSION_STORAGE_KEY,
      activeMission.id,
    );
  }

  return activeMission;
}

function setActiveMission(
  id: string,
): Mission | null {
  const mission = getMission(id);

  if (!mission) {
    return null;
  }

  if (isBrowser()) {
    window.localStorage.setItem(
      ACTIVE_MISSION_STORAGE_KEY,
      mission.id,
    );
  }

  return mission;
}

export const MissionRepository = {
  listMissions,
  getMission,
  createMission,
  updateMission,
  save: saveMission,
  deleteMission,
  getActiveMission,
  setActiveMission,

  // Compatibility aliases used by existing pages.
  getAll: listMissions,
  getById: getMission,
};
