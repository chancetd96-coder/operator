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
}

export type CommanderBuilder =
  (mission: Mission) => CommanderAssessment;
