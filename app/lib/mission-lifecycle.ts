import type { Mission } from "@/lib/types/mission";

const ARCHIVE_RETENTION_YEARS = 1;

function addYears(
  value: Date,
  years: number,
): Date {
  const result = new Date(value);

  result.setFullYear(
    result.getFullYear() + years,
  );

  return result;
}

export function completeMission(
  mission: Mission,
  completedAt = new Date(),
): Mission {
  const timestamp = completedAt.toISOString();

  return {
    ...mission,
    status: "complete",
    progress: 100,
    completedAt: timestamp,
    archivedAt: undefined,
    archiveExpiresAt: undefined,
  };
}

export function archiveMission(
  mission: Mission,
  archivedAt = new Date(),
): Mission {
  const archiveTimestamp =
    archivedAt.toISOString();

  const expiresAt = addYears(
    archivedAt,
    ARCHIVE_RETENTION_YEARS,
  ).toISOString();

  return {
    ...mission,
    status: "complete",
    completedAt:
      mission.completedAt ??
      archiveTimestamp,
    archivedAt: archiveTimestamp,
    archiveExpiresAt: expiresAt,
  };
}

export function restoreMission(
  mission: Mission,
): Mission {
  return {
    ...mission,
    archivedAt: undefined,
    archiveExpiresAt: undefined,
  };
}

export function isMissionArchived(
  mission: Mission,
): boolean {
  return Boolean(mission.archivedAt);
}

export function isArchiveExpired(
  mission: Mission,
  now = new Date(),
): boolean {
  if (!mission.archiveExpiresAt) {
    return false;
  }

  const expirationDate = new Date(
    mission.archiveExpiresAt,
  );

  if (
    Number.isNaN(
      expirationDate.getTime(),
    )
  ) {
    return false;
  }

  return expirationDate <= now;
}