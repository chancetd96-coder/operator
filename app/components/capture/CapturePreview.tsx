"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CaptureItem from "./CaptureItem";
import {
  approveEvents,
  rejectEvent,
} from "@/lib/repositories/operatorEventRepository";
import type { OperatorEvent } from "@/lib/types/operator-event";

type CapturePreviewProps = {
  events: OperatorEvent[];
};

function labelForEvent(event: OperatorEvent): string {
  const labels: Record<OperatorEvent["type"], string> = {
    "meeting.create": "Meeting Request",
    "meeting.update": "Meeting Update",
    "task.create": "Task",
    "decision.record": "Decision",
    "risk.create": "Risk",
    "reminder.create": "Reminder",
    "note.record": "Note",
  };

  return labels[event.type];
}

function detailForEvent(event: OperatorEvent): string {
  const details: string[] = [];

  if (event.time?.raw) {
    details.push(`Time: ${event.time.raw}`);
  }

  if (event.people.length > 0) {
    details.push(
      `People: ${event.people.map((person) => person.name).join(", ")}`,
    );
  }

  if (event.missingFields.length > 0) {
    details.push(`Missing: ${event.missingFields.join(", ")}`);
  }

  details.push(`Confidence: ${Math.round(event.confidence * 100)}%`);

  return details.join(" • ");
}

export default function CapturePreview({
  events,
}: CapturePreviewProps) {
  const router = useRouter();
  const [visibleEvents, setVisibleEvents] = useState(events);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (visibleEvents !== events && visibleEvents.length === 0 && events.length > 0) {
    setVisibleEvents(events);
  }

  async function approveAll() {
    const unresolved = visibleEvents.some(
      (event) => event.missingFields.length > 0,
    );

    if (unresolved || isSaving) return;

    setIsSaving(true);
    setError(null);

    try {
      await approveEvents(
        visibleEvents.map((event) => event.id),
      );

      router.push("/today");
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Operator could not approve these events.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function rejectOne(eventId: string) {
    if (isSaving) return;

    setIsSaving(true);
    setError(null);

    try {
      await rejectEvent(eventId);
      setVisibleEvents((current) =>
        current.filter((event) => event.id !== eventId),
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Operator could not reject this event.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (events.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center">
        <p className="text-zinc-500">
          Structured events will appear here after processing.
        </p>
      </section>
    );
  }

  const unresolvedCount = visibleEvents.filter(
    (event) => event.missingFields.length > 0,
  ).length;

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            Review Queue
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Operator found {visibleEvents.length}{" "}
            {visibleEvents.length === 1 ? "event" : "events"}
          </h2>

          {unresolvedCount > 0 ? (
            <p className="mt-2 text-sm text-amber-400">
              {unresolvedCount}{" "}
              {unresolvedCount === 1 ? "event needs" : "events need"} more detail.
            </p>
          ) : null}
        </div>

        <span className="rounded-full bg-violet-500/20 px-3 py-1 text-sm text-violet-300">
          Supabase Drafts
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {visibleEvents.map((event) => (
          <div key={event.id}>
            <CaptureItem
              type={labelForEvent(event)}
              title={event.sourceText}
              detail={detailForEvent(event)}
              status={
                event.missingFields.length > 0
                  ? "Needs detail"
                  : "Ready"
              }
            />

            <div className="mt-2 flex justify-end">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => rejectOne(event.id)}
                className="text-sm text-zinc-500 transition hover:text-red-300 disabled:opacity-40"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {error ? (
        <p className="mt-5 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          disabled={isSaving}
          onClick={() => router.push("/today")}
          className="rounded-lg border border-zinc-700 px-4 py-2 font-medium text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-40"
        >
          Leave Review
        </button>

        <button
          type="button"
          disabled={
            unresolvedCount > 0 ||
            visibleEvents.length === 0 ||
            isSaving
          }
          onClick={approveAll}
          className="rounded-lg bg-white px-4 py-2 font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSaving ? "Saving..." : "Approve All"}
        </button>
      </div>
    </section>
  );
}
