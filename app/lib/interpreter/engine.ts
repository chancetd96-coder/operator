import type { OperatorEvent } from "@/lib/types/operator-event";
import { classifyStatement } from "./classifier";
import { normalizeEvent } from "./normalizer";
import { splitCaptureNote } from "./parser";

export function interpretNote(
  note: string,
): OperatorEvent[] {
  return splitCaptureNote(note).map((statement) => {
    const classification = classifyStatement(statement);

    return normalizeEvent({
      statement,
      type: classification.type,
      confidence: classification.confidence,
    });
  });
}
