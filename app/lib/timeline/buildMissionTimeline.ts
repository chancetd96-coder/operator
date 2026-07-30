import type { Mission } from "@/lib/types/mission";
import type {
  TimelineEvent,
  TimelineEventType,
} from "@/lib/timeline/types";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function asRecord(value: unknown): UnknownRecord {
  return isRecord(value) ? value : {};
}

function readString(
  record: UnknownRecord,
  ...keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = record[key];

    if (
      typeof value === "string" &&
      value.trim().length > 0
    ) {
      return value.trim();
    }
  }

  return undefined;
}

function readArray(
  record: UnknownRecord,
  ...keys: string[]
): unknown[] {
  for (const key of keys) {
    const value = record[key];

    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
}

function normalizeTimestamp(
  value: unknown,
  fallback: string,
): string {
  if (typeof value !== "string") {
    return fallback;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return fallback;
  }

  return parsed.toISOString();
}

function getTimestamp(
  record: UnknownRecord,
  fallback: string,
  ...keys: string[]
): string {
  for (const key of keys) {
    const value = record[key];

    if (typeof value !== "string") {
      continue;
    }

    const parsed = new Date(value);

    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return fallback;
}

function createId(
  prefix: TimelineEventType,
  record: UnknownRecord,
  index: number,
  suffix?: string,
): string {
  const sourceId =
    readString(record, "id", "legacyId", "legacy_id") ??
    String(index);

  return [
    prefix,
    sourceId,
    suffix,
  ]
    .filter(Boolean)
    .join("-");
}

function addCollectionEvents(
  events: TimelineEvent[],
  collection: unknown[],
  options: {
    type: TimelineEventType;
    defaultTitle: string;
    titleKeys: string[];
    descriptionKeys: string[];
    actorKeys?: string[];
    timestampKeys?: string[];
    fallbackTimestamp: string;
  },
): void {
  collection.forEach((item, index) => {
    const record = asRecord(item);

    events.push({
      id: createId(options.type, record, index),
      type: options.type,
      title:
        readString(record, ...options.titleKeys) ??
        options.defaultTitle,
      description: readString(
        record,
        ...options.descriptionKeys,
      ),
      timestamp: getTimestamp(
        record,
        options.fallbackTimestamp,
        ...(
          options.timestampKeys ?? [
            "createdAt",
            "created_at",
            "timestamp",
            "date",
            "scheduledAt",
            "scheduled_at",
            "updatedAt",
            "updated_at",
          ]
        ),
      ),
      actor: readString(
        record,
        ...(
          options.actorKeys ?? [
            "actor",
            "owner",
            "createdBy",
            "created_by",
          ]
        ),
      ),
    });
  });
}

export function buildMissionTimeline(
  mission: Mission,
): TimelineEvent[] {
  const source = asRecord(mission);

  const createdAt = normalizeTimestamp(
    source.createdAt ?? source.created_at,
    new Date(0).toISOString(),
  );

  const events: TimelineEvent[] = [
    {
      id: `mission-${String(
        source.id ?? "unknown",
      )}-created`,
      type: "mission",
      title: "Mission Created",
      description:
        readString(source, "objective", "summary") ??
        readString(source, "title"),
      timestamp: createdAt,
      actor: readString(
        source,
        "owner",
        "createdBy",
        "created_by",
      ),
    },
  ];

  const tasks = readArray(source, "tasks");

  addCollectionEvents(events, tasks, {
    type: "task",
    defaultTitle: "Task Added",
    titleKeys: ["title", "name"],
    descriptionKeys: ["description", "summary"],
    actorKeys: ["owner", "actor", "assignee"],
    timestampKeys: [
      "createdAt",
      "created_at",
      "updatedAt",
      "updated_at",
    ],
    fallbackTimestamp: createdAt,
  });

  tasks.forEach((item, index) => {
    const task = asRecord(item);
    const status = readString(task, "status")?.toLowerCase();
    const progress = task.progress;

    const isComplete =
      status === "complete" ||
      status === "completed" ||
      progress === 100;

    if (!isComplete) {
      return;
    }

    const taskTitle =
      readString(task, "title", "name") ??
      "Task";

    events.push({
      id: createId(
        "status",
        task,
        index,
        "complete",
      ),
      type: "status",
      title: `${taskTitle} completed`,
      description: readString(
        task,
        "description",
        "summary",
      ),
      timestamp: getTimestamp(
        task,
        createdAt,
        "completedAt",
        "completed_at",
        "updatedAt",
        "updated_at",
        "createdAt",
        "created_at",
      ),
      actor: readString(
        task,
        "owner",
        "actor",
        "assignee",
      ),
    });
  });

  addCollectionEvents(
    events,
    readArray(source, "meetings"),
    {
      type: "meeting",
      defaultTitle: "Meeting Scheduled",
      titleKeys: ["title", "name", "subject"],
      descriptionKeys: [
        "description",
        "notes",
        "summary",
      ],
      fallbackTimestamp: createdAt,
    },
  );

  addCollectionEvents(
    events,
    readArray(source, "risks"),
    {
      type: "risk",
      defaultTitle: "Risk Identified",
      titleKeys: ["title", "name"],
      descriptionKeys: [
        "description",
        "mitigation",
        "summary",
      ],
      fallbackTimestamp: createdAt,
    },
  );

  addCollectionEvents(
    events,
    readArray(source, "decisions"),
    {
      type: "decision",
      defaultTitle: "Decision Recorded",
      titleKeys: ["title", "decision", "name"],
      descriptionKeys: [
        "description",
        "rationale",
        "summary",
      ],
      fallbackTimestamp: createdAt,
    },
  );

  addCollectionEvents(
    events,
    readArray(
      source,
      "memory",
      "memories",
      "memoryEntries",
      "memory_entries",
    ),
    {
      type: "memory",
      defaultTitle: "Memory Added",
      titleKeys: ["title", "name", "type"],
      descriptionKeys: [
        "content",
        "description",
        "summary",
        "text",
      ],
      fallbackTimestamp: createdAt,
    },
  );

  return events.sort((left, right) => {
    return (
      new Date(right.timestamp).getTime() -
      new Date(left.timestamp).getTime()
    );
  });
}
