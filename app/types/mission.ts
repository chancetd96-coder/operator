export type MissionStatus = "Active" | "Built";

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

export type MissionTask = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  progress: number;
  owner: string;
  dueDate: string | null;
  scheduledDate: string | null;
  comments: string[];
  risks: string[];
  blockers: string[];
  meetingIds: string[];
};

export type MissionMeeting = {
  id: string;
  title: string;
  date: string | null;
  time: string | null;
  notes: string;
  taskIds: string[];
};

export type MissionRisk = {
  id: string;
  title: string;
  description: string;
  mitigation: string;
  taskIds: string[];
  resolved: boolean;
};

export type Mission = {
  id: number;
  title: string;
  prompt: string;
  summary: string;
  assumptions: string[];
  recommendation: string;
  status: MissionStatus;
  priority?: MissionPriority;
  owner: string;
  progress: number;

  tasks: MissionTask[];
  meetings: MissionMeeting[];
  risks: MissionRisk[];

  schedule: string[];
  resources: string[];
  successMetrics: string[];
};