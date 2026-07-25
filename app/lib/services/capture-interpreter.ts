export type InterpretedCaptureType =
  | "change"
  | "decision"
  | "risk"
  | "schedule"
  | "task";

export type InterpretedCaptureItem = {
  id: string;
  type: InterpretedCaptureType;
  label: string;
  title: string;
  detail: string;
  status: "ready" | "needs-detail";
};

function splitNote(note: string): string[] {
  return note
    .split(/[.;\n]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function includesAny(value: string, terms: string[]): boolean {
  return terms.some((term) => value.includes(term));
}

function createItem(
  type: InterpretedCaptureType,
  label: string,
  title: string,
  detail: string,
  status: "ready" | "needs-detail" = "ready",
): InterpretedCaptureItem {
  return {
    id: crypto.randomUUID(),
    type,
    label,
    title,
    detail,
    status,
  };
}

export function interpretCaptureNote(
  note: string,
): InterpretedCaptureItem[] {
  const statements = splitNote(note);

  return statements.map((statement) => {
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
      return createItem(
        "change",
        "Meeting Update",
        statement,
        "Operator detected a change to an existing meeting.",
      );
    }

    if (
      includesAny(normalized, [
        "call ",
        "follow up",
        "follow-up",
        "email ",
        "text ",
        "contact ",
      ])
    ) {
      return createItem(
        "schedule",
        "Follow-Up",
        statement,
        "Operator detected a follow-up action.",
      );
    }

    if (
      includesAny(normalized, [
        "schedule meeting",
        "set up meeting",
        "book meeting",
        "meet with",
      ])
    ) {
      const hasDateOrTime =
        /\b(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{1,2}:\d{2}|\d{3,4})\b/i.test(
          statement,
        );

      return createItem(
        "schedule",
        "Meeting Request",
        statement,
        hasDateOrTime
          ? "Operator detected a new meeting request."
          : "A date or time is still required.",
        hasDateOrTime ? "ready" : "needs-detail",
      );
    }

    if (
      includesAny(normalized, [
        "approved",
        "decided",
        "decision",
        "authorized",
        "selected",
      ])
    ) {
      return createItem(
        "decision",
        "Decision",
        statement,
        "Operator detected a decision that should be recorded.",
      );
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
      return createItem(
        "risk",
        "Risk",
        statement,
        "Operator detected a potential execution risk.",
      );
    }

    return createItem(
      "task",
      "Task",
      statement,
      "Operator detected a general action item.",
    );
  });
}
