import type {
  OperatorEventTime,
  OperatorEventType,
} from "@/lib/types/operator-event";

export function findMissingFields(
  type: OperatorEventType,
  time?: OperatorEventTime,
): string[] {
  const missingFields: string[] = [];

  if (
    type === "meeting.create" &&
    !time?.raw
  ) {
    missingFields.push("date", "time");
  }

  if (
    type === "meeting.update" &&
    !time?.raw
  ) {
    missingFields.push("new date or time");
  }

  return missingFields;
}
