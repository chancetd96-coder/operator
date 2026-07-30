export type TimelineEventType =
  | "mission"
  | "task"
  | "meeting"
  | "risk"
  | "decision"
  | "memory"
  | "status";

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description?: string;
  timestamp: string;
  actor?: string;
}
