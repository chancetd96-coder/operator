import type {
  OperatorEvent,
  OperatorEventType,
} from "@/lib/types/operator-event";
import { extractEntities } from "./extractor";
import { findMissingFields } from "./validator";

function titleForEvent(
  type: OperatorEventType,
  statement: string,
): string {
  const titles: Record<OperatorEventType, string> = {
    "meeting.create": "Create meeting",
    "meeting.update": "Update meeting",
    "task.create": "Create task",
    "decision.record": "Record decision",
    "risk.create": "Create risk",
    "reminder.create": "Create reminder",
    "note.record": "Record note",
  };

  return `${titles[type]}: ${statement}`;
}

export function normalizeEvent({
  statement,
  type,
  confidence,
}: {
  statement: string;
  type: OperatorEventType;
  confidence: number;
}): OperatorEvent {
  const entities = extractEntities(statement);
  const missingFields = findMissingFields(
    type,
    entities.time,
  );

  return {
    id: crypto.randomUUID(),
    type,
    status: "draft",
    source: "capture",

    title: titleForEvent(type, statement),
    description: statement,

    confidence,
    people: entities.people,
    organizations: entities.organizations,
    time: entities.time,

    missingFields,
    requiresApproval: true,

    metadata: {},
    sourceText: statement,
    createdAt: new Date().toISOString(),
  };
}
