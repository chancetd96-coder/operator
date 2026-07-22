import { createClient } from "@/lib/supabase/client";
import type {
  Mission,
  MissionMeeting,
  MissionPriority,
  MissionRisk,
  MissionStatus,
  MissionTask,
  TaskStatus,
} from "@/types/mission";

type MissionRow = {
  id: string;
  legacy_id: number | null;
  title: string;
  prompt: string;
  summary: string;
  status: string;
  priority: string;
  owner: string;
  recommendation: string;
  progress: number;
  assumptions: unknown;
  schedule: unknown;
  resources: unknown;
  success_metrics: unknown;
};

type TaskRow = {
  id: string;
  legacy_id: string | null;
  title: string;
  description: string;
  status: string;
  progress: number;
  owner: string;
  due_date: string | null;
  scheduled_date: string | null;
  comments: unknown;
  risks: unknown;
  blockers: unknown;
  meeting_ids: unknown;
};

type EventRow = {
  id: string;
  legacy_id: string | null;
  title: string;
  starts_at: string | null;
  notes: string;
  task_ids: unknown;
};

type RiskRow = {
  id: string;
  legacy_id: string | null;
  title: string;
  description: string;
  mitigation: string;
  task_ids: unknown;
  resolved: boolean;
};

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function toDatabaseMissionStatus(status: MissionStatus): string {
  return status === "Built" ? "draft" : "active";
}

function fromDatabaseMissionStatus(status: string): MissionStatus {
  return status === "active" ? "Active" : "Built";
}

function toDatabasePriority(
  priority: MissionPriority | undefined,
): string {
  switch (priority) {
    case "Critical":
      return "critical";
    case "High":
      return "high";
    case "Low":
      return "low";
    case "Normal":
    default:
      return "medium";
  }
}

function fromDatabasePriority(priority: string): MissionPriority {
  switch (priority) {
    case "critical":
      return "Critical";
    case "high":
      return "High";
    case "low":
      return "Low";
    default:
      return "Normal";
  }
}

function toDatabaseTaskStatus(status: TaskStatus): string {
  switch (status) {
    case "In Progress":
      return "in_progress";
    case "Blocked":
      return "blocked";
    case "Complete":
      return "completed";
    case "Not Started":
    default:
      return "not_started";
  }
}

function fromDatabaseTaskStatus(status: string): TaskStatus {
  switch (status) {
    case "in_progress":
      return "In Progress";
    case "blocked":
      return "Blocked";
    case "completed":
      return "Complete";
    default:
      return "Not Started";
  }
}

function combineDateAndTime(
  date: string | null,
  time: string | null,
): string | null {
  if (!date) {
    return null;
  }

  if (!time) {
    return `${date}T00:00:00`;
  }

  return `${date}T${time}:00`;
}

function splitDateTime(value: string | null): {
  date: string | null;
  time: string | null;
} {
  if (!value) {
    return { date: null, time: null };
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return { date: null, time: null };
  }

  return {
    date: parsed.toISOString().slice(0, 10),
    time: parsed.toISOString().slice(11, 16),
  };
}

export async function getMissions(): Promise<Mission[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("missions")
    .select(`
      id,
      legacy_id,
      title,
      prompt,
      summary,
      status,
      priority,
      owner,
      recommendation,
      progress,
      assumptions,
      schedule,
      resources,
      success_metrics,
      tasks (
        id,
        legacy_id,
        title,
        description,
        status,
        progress,
        owner,
        due_date,
        scheduled_date,
        comments,
        risks,
        blockers,
        meeting_ids
      ),
      events (
        id,
        legacy_id,
        title,
        starts_at,
        notes,
        task_ids
      ),
      risks (
        id,
        legacy_id,
        title,
        description,
        mitigation,
        task_ids,
        resolved
      )
    `)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load missions: ${error.message}`);
  }

  return (data ?? []).map((row) => mapMissionRow(row as MissionRow & {
    tasks: TaskRow[];
    events: EventRow[];
    risks: RiskRow[];
  }));
}

export async function getMission(
  legacyId: number,
): Promise<Mission | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("missions")
    .select(`
      id,
      legacy_id,
      title,
      prompt,
      summary,
      status,
      priority,
      owner,
      recommendation,
      progress,
      assumptions,
      schedule,
      resources,
      success_metrics,
      tasks (
        id,
        legacy_id,
        title,
        description,
        status,
        progress,
        owner,
        due_date,
        scheduled_date,
        comments,
        risks,
        blockers,
        meeting_ids
      ),
      events (
        id,
        legacy_id,
        title,
        starts_at,
        notes,
        task_ids
      ),
      risks (
        id,
        legacy_id,
        title,
        description,
        mitigation,
        task_ids,
        resolved
      )
    `)
    .eq("legacy_id", legacyId)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load mission: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return mapMissionRow(data as MissionRow & {
    tasks: TaskRow[];
    events: EventRow[];
    risks: RiskRow[];
  });
}

export async function saveMissionToCloud(
  mission: Mission,
): Promise<void> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(`Unable to verify user: ${userError.message}`);
  }

  if (!user) {
    throw new Error("You must be signed in to save a mission.");
  }

  const { data: missionRow, error: missionError } = await supabase
    .from("missions")
    .upsert(
      {
        user_id: user.id,
        legacy_id: mission.id,
        title: mission.title,
        prompt: mission.prompt,
        summary: mission.summary,
        status: toDatabaseMissionStatus(mission.status),
        priority: toDatabasePriority(mission.priority),
        owner: mission.owner,
        recommendation: mission.recommendation,
        progress: mission.progress,
        assumptions: mission.assumptions,
        schedule: mission.schedule,
        resources: mission.resources,
        success_metrics: mission.successMetrics,
      },
      {
        onConflict: "user_id,legacy_id",
      },
    )
    .select("id")
    .single();

  if (missionError) {
    throw new Error(`Unable to save mission: ${missionError.message}`);
  }

  const cloudMissionId = missionRow.id as string;

  const { error: deleteTasksError } = await supabase
    .from("tasks")
    .delete()
    .eq("mission_id", cloudMissionId);

  if (deleteTasksError) {
    throw new Error(
      `Unable to replace mission tasks: ${deleteTasksError.message}`,
    );
  }

  const { error: deleteEventsError } = await supabase
    .from("events")
    .delete()
    .eq("mission_id", cloudMissionId);

  if (deleteEventsError) {
    throw new Error(
      `Unable to replace mission meetings: ${deleteEventsError.message}`,
    );
  }

  const { error: deleteRisksError } = await supabase
    .from("risks")
    .delete()
    .eq("mission_id", cloudMissionId);

  if (deleteRisksError) {
    throw new Error(
      `Unable to replace mission risks: ${deleteRisksError.message}`,
    );
  }

  if (mission.tasks.length > 0) {
    const { error } = await supabase.from("tasks").insert(
      mission.tasks.map((task, index) => ({
        mission_id: cloudMissionId,
        legacy_id: task.id,
        title: task.title,
        description: task.description,
        status: toDatabaseTaskStatus(task.status),
        progress: task.progress,
        owner: task.owner,
        due_date: task.dueDate,
        scheduled_date: task.scheduledDate,
        sort_order: index,
        comments: task.comments,
        risks: task.risks,
        blockers: task.blockers,
        meeting_ids: task.meetingIds,
      })),
    );

    if (error) {
      throw new Error(`Unable to save mission tasks: ${error.message}`);
    }
  }

  if (mission.meetings.length > 0) {
    const { error } = await supabase.from("events").insert(
      mission.meetings.map((meeting) => ({
        mission_id: cloudMissionId,
        legacy_id: meeting.id,
        title: meeting.title,
        event_type: "meeting",
        starts_at: combineDateAndTime(meeting.date, meeting.time),
        notes: meeting.notes,
        description: meeting.notes,
        task_ids: meeting.taskIds,
      })),
    );

    if (error) {
      throw new Error(`Unable to save mission meetings: ${error.message}`);
    }
  }

  if (mission.risks.length > 0) {
    const { error } = await supabase.from("risks").insert(
      mission.risks.map((risk) => ({
        mission_id: cloudMissionId,
        legacy_id: risk.id,
        title: risk.title,
        description: risk.description,
        mitigation: risk.mitigation,
        task_ids: risk.taskIds,
        resolved: risk.resolved,
        resolved_at: risk.resolved ? new Date().toISOString() : null,
      })),
    );

    if (error) {
      throw new Error(`Unable to save mission risks: ${error.message}`);
    }
  }
}

export async function deleteMissionFromCloud(
  legacyId: number,
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("missions")
    .delete()
    .eq("legacy_id", legacyId);

  if (error) {
    throw new Error(`Unable to delete mission: ${error.message}`);
  }
}

function mapMissionRow(
  row: MissionRow & {
    tasks?: TaskRow[];
    events?: EventRow[];
    risks?: RiskRow[];
  },
): Mission {
  const meetings: MissionMeeting[] = (row.events ?? []).map((event) => {
    const { date, time } = splitDateTime(event.starts_at);

    return {
      id: event.legacy_id ?? event.id,
      title: event.title,
      date,
      time,
      notes: event.notes,
      taskIds: stringArray(event.task_ids),
    };
  });

  const tasks: MissionTask[] = (row.tasks ?? []).map((task) => ({
    id: task.legacy_id ?? task.id,
    title: task.title,
    description: task.description,
    status: fromDatabaseTaskStatus(task.status),
    progress: task.progress,
    owner: task.owner,
    dueDate: task.due_date,
    scheduledDate: task.scheduled_date,
    comments: stringArray(task.comments),
    risks: stringArray(task.risks),
    blockers: stringArray(task.blockers),
    meetingIds: stringArray(task.meeting_ids),
  }));

  const risks: MissionRisk[] = (row.risks ?? []).map((risk) => ({
    id: risk.legacy_id ?? risk.id,
    title: risk.title,
    description: risk.description,
    mitigation: risk.mitigation,
    taskIds: stringArray(risk.task_ids),
    resolved: risk.resolved,
  }));

  return {
    id: row.legacy_id ?? Date.now(),
    title: row.title,
    prompt: row.prompt,
    summary: row.summary,
    assumptions: stringArray(row.assumptions),
    recommendation: row.recommendation,
    status: fromDatabaseMissionStatus(row.status),
    priority: fromDatabasePriority(row.priority),
    owner: row.owner,
    progress: row.progress,
    tasks,
    meetings,
    risks,
    schedule: stringArray(row.schedule),
    resources: stringArray(row.resources),
    successMetrics: stringArray(row.success_metrics),
  };
}
