export type CapturedUpdateType =
  | "change"
  | "decision"
  | "risk"
  | "schedule";

export type CapturedUpdate = {
  id: string;
  type: CapturedUpdateType;
  title: string;
  detail?: string;
  createdAt: string;
};

const STORAGE_KEY = "operator-captured-updates";

export function loadCapturedUpdates(): CapturedUpdate[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CapturedUpdate[]) : [];
  } catch {
    return [];
  }
}

export function saveCapturedUpdates(
  updates: CapturedUpdate[],
): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updates),
  );
}

export function appendCapturedUpdates(
  updates: CapturedUpdate[],
): void {
  const existing = loadCapturedUpdates();
  saveCapturedUpdates([...existing, ...updates]);
}
