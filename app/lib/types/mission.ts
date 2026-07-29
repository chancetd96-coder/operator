export type MissionStatus =
  | "planning"
  | "active"
  | "blocked"
  | "complete";

export type MissionPriority =
  | "Critical"
  | "High"
  | "Normal"
  | "Low";

export type TaskStatus =
  | "Not Started"
  | "In Progress"
  | "Blocked"
  | "Complete";

export interface MissionTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  owner: string;
  dueDate?: string | null;
  scheduledDate?: string | null;
  progress: number;
  comments?: string[];
  meetingIds?: string[];
  blockers?: string[];
  risks?: string[];
}

export interface MissionRisk {
  id: string;
  title: string;
  description?: string;
  mitigation?: string;
  taskIds?: string[];
  resolved: boolean;
}

export interface MissionMeeting {
  id: string;
  title: string;
  date?: string | null;
  time?: string | null;
  notes?: string;
  taskIds?: string[];
}

export interface Mission {
  id: string;

  title: string;

  objective: string;

  summary: string;

  prompt?: string;

  assumptions: string[];

  schedule: string[];

  resources: string[];

  successMetrics: string[];

  status: MissionStatus;

  priority: MissionPriority;

  progress: number;

  executionScore?: number;

  owner: string;

  recommendation: string;

  tasks: MissionTask[];

  risks: MissionRisk[];

  meetings: MissionMeeting[];

  organizationId?: string;

  workspaceId?: string;

  createdAt: string;

  updatedAt: string;

  startedAt?: string;

  completedAt?: string;

  dueDate?: string;

  color?: string;

  icon?: string;
}
