export function splitCaptureNote(note: string): string[] {
  return note
    .split(/[.;\n]+/)
    .map((statement) => statement.trim())
    .filter(Boolean);
}
