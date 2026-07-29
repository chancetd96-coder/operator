import { createClient } from "@/lib/supabase/client";
import type {
  OperatorEntityRef,
  OperatorEvent,
  OperatorEventPriority,
  OperatorEventSource,
  OperatorEventStatus,
  OperatorEventTime,
  OperatorEventType,
} from "@/lib/types/operator-event";

type OperatorEventRow = {
  id: string;
  user_id: string;
  organization_id: string | null;
  workspace_id: string | null;
  mission_id: string | null;

  event_type: OperatorEventType;
  status: OperatorEventStatus;
  source: OperatorEventSource;

  title: string;
  description: string | null;

  confidence: number;
  priority: OperatorEventPriority | null;

  starts_at: string | null;
  ends_at: string | null;
  timezone: string | null;
  raw_time_text: string | null;

  source_text: string;

  people: OperatorEntityRef[];
  organizations: OperatorEntityRef[];
  missing_fields: string[];
  metadata: Record<string, unknown>;

  requires_approval: boolean;

  approved_at: string | null;
  committed_at: string | null;
  completed_at: string | null;

  dedupe_key: string | null;

  created_at: string;
  updated_at: string;
};

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.,;:!?]+$/g, "")
    .trim();
}

function createDedupeKey(event: OperatorEvent): string {
  return [
    event.type,
    normalizeText(event.sourceText),
    event.time?.raw ?? "",
  ].join("|");
}

function rowToEvent(row: OperatorEventRow): OperatorEvent {
  const time: OperatorEventTime | undefined =
    row.starts_at ||
    row.ends_at ||
    row.timezone ||
    row.raw_time_text
      ? {
          start: row.starts_at ?? undefined,
          end: row.ends_at ?? undefined,
          timezone: row.timezone ?? undefined,
          raw: row.raw_time_text ?? undefined,
        }
      : undefined;

  return {
    id: row.id,
    organizationId: row.organization_id ?? undefined,
    workspaceId: row.workspace_id ?? undefined,
    missionId: row.mission_id ?? undefined,

    type: row.event_type,
    status: row.status,
    source: row.source,

    title: row.title,
    description: row.description ?? undefined,

    confidence: Number(row.confidence),
    priority: row.priority ?? undefined,

    people: row.people ?? [],
    organizations: row.organizations ?? [],

    time,

    missingFields: row.missing_fields ?? [],
    requiresApproval: row.requires_approval,

    metadata: row.metadata ?? {},

    sourceText: row.source_text,
    createdAt: row.created_at,
  };
}

async function getAuthenticatedUserId(): Promise<string> {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error("You must be signed in to manage Operator events.");
  }

  return user.id;
}

export async function createDraftEvents(
  events: OperatorEvent[],
): Promise<OperatorEvent[]> {
  if (events.length === 0) {
    return [];
  }

  const supabase = createClient();
  const userId = await getAuthenticatedUserId();

  const rows = events.map((event) => ({
    id: event.id,
    user_id: userId,

    organization_id: event.organizationId ?? null,
    workspace_id: event.workspaceId ?? null,
    mission_id: event.missionId ?? null,

    event_type: event.type,
    status: "draft" as const,
    source: event.source,

    title: event.title,
    description: event.description ?? null,

    confidence: event.confidence,
    priority: event.priority ?? null,

    starts_at: event.time?.start ?? null,
    ends_at: event.time?.end ?? null,
    timezone: event.time?.timezone ?? null,
    raw_time_text: event.time?.raw ?? null,

    source_text: event.sourceText,

    people: event.people,
    organizations: event.organizations,
    missing_fields: event.missingFields,
    metadata: event.metadata,

    requires_approval: event.requiresApproval,
    dedupe_key: createDedupeKey(event),
  }));

  const { data, error } = await supabase
    .from("operator_events")
    .upsert(rows, {
      onConflict: "user_id,dedupe_key",
      ignoreDuplicates: true,
    })
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as OperatorEventRow[]).map(rowToEvent);
}

export async function listEvents(
  statuses?: OperatorEventStatus[],
): Promise<OperatorEvent[]> {
  const supabase = createClient();
  const userId = await getAuthenticatedUserId();

  let query = supabase
    .from("operator_events")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (statuses && statuses.length > 0) {
    query = query.in("status", statuses);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as OperatorEventRow[]).map(rowToEvent);
}

export async function approveEvents(
  eventIds: string[],
): Promise<void> {
  if (eventIds.length === 0) {
    return;
  }

  const supabase = createClient();
  const userId = await getAuthenticatedUserId();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("operator_events")
    .update({
      status: "approved",
      approved_at: now,
    })
    .eq("user_id", userId)
    .in("id", eventIds);

  if (error) {
    throw new Error(error.message);
  }
}

export async function rejectEvent(
  eventId: string,
): Promise<void> {
  const supabase = createClient();
  const userId = await getAuthenticatedUserId();

  const { error } = await supabase
    .from("operator_events")
    .update({
      status: "rejected",
    })
    .eq("user_id", userId)
    .eq("id", eventId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function completeEvent(
  eventId: string,
): Promise<void> {
  const supabase = createClient();
  const userId = await getAuthenticatedUserId();

  const { error } = await supabase
    .from("operator_events")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("id", eventId);

  if (error) {
    throw new Error(error.message);
  }
}
