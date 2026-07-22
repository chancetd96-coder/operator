import { createClient } from "@/lib/supabase/client";

export type MissionMemoryRole =
  | "user"
  | "assistant"
  | "system"
  | "decision"
  | "lesson";

export type MissionMemoryEntry = {
  id: string;
  missionId: string;
  role: MissionMemoryRole;
  content: string;
  metadata: Record<string, unknown>;
  createdAt: string;
};

type MissionMemoryRow = {
  id: string;
  mission_id: string;
  role: string;
  content: string;
  metadata: unknown;
  created_at: string;
};

function normalizeMetadata(
  value: unknown,
): Record<string, unknown> {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    return value as Record<string, unknown>;
  }

  return {};
}

function normalizeRole(role: string): MissionMemoryRole {
  switch (role) {
    case "assistant":
    case "system":
    case "decision":
    case "lesson":
      return role;
    default:
      return "user";
  }
}

function mapMemoryRow(
  row: MissionMemoryRow,
): MissionMemoryEntry {
  return {
    id: row.id,
    missionId: row.mission_id,
    role: normalizeRole(row.role),
    content: row.content,
    metadata: normalizeMetadata(row.metadata),
    createdAt: row.created_at,
  };
}

async function getCloudMissionId(
  legacyMissionId: number,
): Promise<string> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("missions")
    .select("id")
    .eq("legacy_id", legacyMissionId)
    .single();

  if (error) {
    throw new Error(
      `Unable to locate mission memory: ${error.message}`,
    );
  }

  return data.id as string;
}

export const MissionMemoryService = {
  async getHistory(
    legacyMissionId: number,
    limit = 100,
  ): Promise<MissionMemoryEntry[]> {
    const supabase = createClient();
    const cloudMissionId =
      await getCloudMissionId(legacyMissionId);

    const { data, error } = await supabase
      .from("mission_memory")
      .select(
        "id, mission_id, role, content, metadata, created_at",
      )
      .eq("mission_id", cloudMissionId)
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) {
      throw new Error(
        `Unable to load mission memory: ${error.message}`,
      );
    }

    return (data ?? []).map((row) =>
      mapMemoryRow(row as MissionMemoryRow),
    );
  },

  async append(
    legacyMissionId: number,
    entry: {
      role: MissionMemoryRole;
      content: string;
      metadata?: Record<string, unknown>;
    },
  ): Promise<MissionMemoryEntry> {
    const content = entry.content.trim();

    if (!content) {
      throw new Error("Mission memory cannot be empty.");
    }

    const supabase = createClient();
    const cloudMissionId =
      await getCloudMissionId(legacyMissionId);

    const { data, error } = await supabase
      .from("mission_memory")
      .insert({
        mission_id: cloudMissionId,
        role: entry.role,
        content,
        metadata: entry.metadata ?? {},
      })
      .select(
        "id, mission_id, role, content, metadata, created_at",
      )
      .single();

    if (error) {
      throw new Error(
        `Unable to save mission memory: ${error.message}`,
      );
    }

    return mapMemoryRow(data as MissionMemoryRow);
  },

  async delete(entryId: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
      .from("mission_memory")
      .delete()
      .eq("id", entryId);

    if (error) {
      throw new Error(
        `Unable to delete mission memory: ${error.message}`,
      );
    }
  },

  async clear(legacyMissionId: number): Promise<void> {
    const supabase = createClient();
    const cloudMissionId =
      await getCloudMissionId(legacyMissionId);

    const { error } = await supabase
      .from("mission_memory")
      .delete()
      .eq("mission_id", cloudMissionId);

    if (error) {
      throw new Error(
        `Unable to clear mission memory: ${error.message}`,
      );
    }
  },

  async search(
    legacyMissionId: number,
    query: string,
    limit = 25,
  ): Promise<MissionMemoryEntry[]> {
    const searchTerm = query.trim();

    if (!searchTerm) {
      return [];
    }

    const supabase = createClient();
    const cloudMissionId =
      await getCloudMissionId(legacyMissionId);

    const { data, error } = await supabase
      .from("mission_memory")
      .select(
        "id, mission_id, role, content, metadata, created_at",
      )
      .eq("mission_id", cloudMissionId)
      .ilike("content", `%${searchTerm}%`)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(
        `Unable to search mission memory: ${error.message}`,
      );
    }

    return (data ?? []).map((row) =>
      mapMemoryRow(row as MissionMemoryRow),
    );
  },
};