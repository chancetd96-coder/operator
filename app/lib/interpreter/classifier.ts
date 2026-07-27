import type { OperatorEventType } from "@/lib/types/operator-event";

type Classification = {
  type: OperatorEventType;
  confidence: number;
};

function includesAny(value: string, terms: string[]): boolean {
  return terms.some((term) => value.includes(term));
}

export function classifyStatement(statement: string): Classification {
  const normalized = statement.toLowerCase();

  if (
    includesAny(normalized, [
      "meeting changed",
      "meeting moved",
      "rescheduled",
      "changed from",
      "moved from",
    ])
  ) {
    return {
      type: "meeting.update",
      confidence: 0.96,
    };
  }

  if (
    includesAny(normalized, [
      "schedule meeting",
      "set up meeting",
      "book meeting",
      "meet with",
    ])
  ) {
    return {
      type: "meeting.create",
      confidence: 0.92,
    };
  }

  if (
    includesAny(normalized, [
      "approved",
      "decided",
      "authorized",
      "selected",
    ])
  ) {
    return {
      type: "decision.record",
      confidence: 0.94,
    };
  }

  if (
    includesAny(normalized, [
      "risk",
      "blocked",
      "delay",
      "delayed",
      "slipped",
      "issue",
      "problem",
    ])
  ) {
    return {
      type: "risk.create",
      confidence: 0.9,
    };
  }

  if (
    includesAny(normalized, [
      "remind me",
      "reminder",
    ])
  ) {
    return {
      type: "reminder.create",
      confidence: 0.95,
    };
  }

  if (
    includesAny(normalized, [
      "call ",
      "email ",
      "text ",
      "contact ",
      "follow up",
      "follow-up",
      "need to",
      "must ",
    ])
  ) {
    return {
      type: "task.create",
      confidence: 0.9,
    };
  }

  return {
    type: "note.record",
    confidence: 0.65,
  };
}
