"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  MissionMemoryService,
  type MissionMemoryEntry,
  type MissionMemoryRole,
} from "@/lib/services/memory";

type MissionMemoryPanelProps = {
  missionId: number;
};

const ROLE_LABELS: Record<MissionMemoryRole, string> = {
  user: "You",
  assistant: "Commander",
  system: "System",
  decision: "Decision",
  lesson: "Lesson Learned",
};

export default function MissionMemoryPanel({
  missionId,
}: MissionMemoryPanelProps) {
  const [entries, setEntries] = useState<MissionMemoryEntry[]>([]);
  const [content, setContent] = useState("");
  const [role, setRole] =
    useState<MissionMemoryRole>("decision");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadHistory() {
      setLoading(true);
      setError("");

      try {
        const history =
          await MissionMemoryService.getHistory(missionId);

        if (active) {
          setEntries(history);
        }
      } catch (loadError) {
        console.error("Unable to load mission memory:", loadError);

        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load mission memory.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadHistory();

    return () => {
      active = false;
    };
  }, [missionId]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent || saving) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const entry = await MissionMemoryService.append(
        missionId,
        {
          role,
          content: trimmedContent,
        },
      );

      setEntries((current) => [...current, entry]);
      setContent("");
    } catch (saveError) {
      console.error("Unable to save mission memory:", saveError);

      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save mission memory.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteEntry(entryId: string) {
    try {
      await MissionMemoryService.delete(entryId);

      setEntries((current) =>
        current.filter((entry) => entry.id !== entryId),
      );
    } catch (deleteError) {
      console.error(
        "Unable to delete mission memory:",
        deleteError,
      );

      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete memory entry.",
      );
    }
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03]">
      <header className="border-b border-white/10 px-5 py-4">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
          Mission Memory
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white">
          Decisions, lessons, and Commander context
        </h2>
      </header>

      <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="max-h-[560px] space-y-3 overflow-y-auto pr-1">
          {loading ? (
            <p className="text-sm text-white/40">
              Loading mission memory...
            </p>
          ) : entries.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 p-6 text-sm text-white/40">
              No memory entries yet. Record the first decision,
              lesson, or operational note.
            </div>
          ) : (
            entries.map((entry) => (
              <article
                className="rounded-xl border border-white/10 bg-black/30 p-4"
                key={entry.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-cyan-400">
                      {ROLE_LABELS[entry.role]}
                    </p>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white/75">
                      {entry.content}
                    </p>

                    <p className="mt-3 text-xs text-white/30">
                      {new Date(entry.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <button
                    className="text-xs text-white/30 hover:text-red-300"
                    type="button"
                    onClick={() => void deleteEntry(entry.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        <form
          className="h-fit rounded-xl border border-white/10 bg-black/30 p-4"
          onSubmit={handleSubmit}
        >
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-white/40">
              Entry type
            </span>

            <select
              className="mt-2 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white"
              value={role}
              onChange={(event) =>
                setRole(
                  event.target.value as MissionMemoryRole,
                )
              }
            >
              <option value="decision">Decision</option>
              <option value="lesson">Lesson Learned</option>
              <option value="user">Operational Note</option>
              <option value="assistant">
                Commander Assessment
              </option>
              <option value="system">System Record</option>
            </select>
          </label>

          <label className="mt-4 block">
            <span className="text-xs uppercase tracking-wider text-white/40">
              Memory
            </span>

            <textarea
              className="mt-2 min-h-40 w-full resize-y rounded-lg border border-white/10 bg-black px-3 py-3 text-sm text-white outline-none focus:border-cyan-400"
              placeholder="Record a decision, lesson learned, change in intent, or context Commander should retain..."
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
            />
          </label>

          <button
            className="mt-4 w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black disabled:opacity-50"
            type="submit"
            disabled={saving || !content.trim()}
          >
            {saving ? "Saving..." : "Add to mission memory"}
          </button>

          {error ? (
            <p className="mt-3 text-sm text-red-300">
              {error}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}