import type { Mission } from "@/lib/types/mission";

export type MissionHealth =
  | "Healthy"
  | "At Risk"
  | "Critical";

export type OperationalTempo =
  | "Low"
  | "Moderate"
  | "High"
  | "Unsustainable";

export type CommanderPriorityActionType =
  | "risk"
  | "blocker"
  | "task"
  | "meeting";

export type CommanderPriorityActionUrgency =
  | "immediate"
  | "high"
  | "normal";

export interface CommanderPriorityAction {
  id: string;
  type: CommanderPriorityActionType;
  title: string;
  reason: string;
  urgency: CommanderPriorityActionUrgency;
  targetId?: string;
}

export interface CommanderAssessment {
  missionId: string;

  health: MissionHealth;
  confidence: number;
  tempo: OperationalTempo;

  forecast: string;
  recommendation: string;

  completedTasks: number;
  totalTasks: number;

  unresolvedRisks: number;
  completedRisks: number;

  blockers: number;

  reasons: string[];
  priorityActions: CommanderPriorityAction[];
}

export type CommanderBuilder =
  (mission: Mission) => CommanderAssessment;
