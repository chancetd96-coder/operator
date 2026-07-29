export type OperatorEventType =
  | "meeting.create"
  | "meeting.update"
  | "task.create"
  | "decision.record"
  | "risk.create"
  | "reminder.create"
  | "note.record";

export type OperatorEventStatus =
  | "draft"
  | "approved"
  | "rejected"
  | "committed"
  | "completed"
  | "cancelled";

export type OperatorEventSource =
  | "capture"
  | "email"
  | "calendar"
  | "slack"
  | "meeting"
  | "voice"
  | "api";

export type OperatorEventPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type OperatorEntityRef = {
  id?: string;
  name: string;
};

export type OperatorEventTime = {
  raw?: string;
  start?: string;
  end?: string;
  timezone?: string;
};

export type OperatorEvent = {
  id: string;
 organizationId?: string;
workspaceId?: string;
missionId?: string;


  type: OperatorEventType;
  status: OperatorEventStatus;
  source: OperatorEventSource;

  title: string;
  description?: string;

  confidence: number;
  priority?: OperatorEventPriority;

  people: OperatorEntityRef[];
  organizations: OperatorEntityRef[];

  time?: OperatorEventTime;

  missingFields: string[];
  requiresApproval: boolean;

  metadata: Record<string, unknown>;

  sourceText: string;
  createdAt: string;
};
