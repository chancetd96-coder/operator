export type CapturedUpdateType =
  | "change"
  | "decision"
  | "risk"
  | "schedule";

export type CapturedUpdate = {
  id: string;
  type: CapturedUpdateType;
  title: string;
  detail: string;
  createdAt: string;
};

const STORAGE_KEY = "operator-captured-updates";

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.,;:!?]+$/g, "")
    .trim();
}

function fingerprint(update: CapturedUpdate): string {
  return [
    update.type,
    normalizeText(update.title),
    normalizeText(update.detail),
  ].join("|");
}

function deduplicateUpdates(
  updates: CapturedUpdate[],
): CapturedUpdate[] {
  const seen = new Set<string>();
  const unique: CapturedUpdate[] = [];

  for (const update of updates) {
    const key = fingerprint(update);

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(update);
  }

  return unique;
}

export function loadCapturedUpdates(): CapturedUpdate[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    const updates = deduplicateUpdates(
      parsed as CapturedUpdate[],
    );

    // Automatically clean previously stored duplicates.
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updates),
    );

    return updates;
  } catch {
    return [];
  }
}

export function saveCapturedUpdates(
  updates: CapturedUpdate[],
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(deduplicateUpdates(updates)),
  );
}

export function appendCapturedUpdates(
  newUpdates: CapturedUpdate[],
): void {
  const existingUpdates = loadCapturedUpdates();

  saveCapturedUpdates([
    ...newUpdates,
    ...existingUpdates,
  ]);
}

export function clearCapturedUpdates(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
