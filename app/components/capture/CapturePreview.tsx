"use client";

import { useRouter } from "next/navigation";
import CaptureItem from "./CaptureItem";
import {
  appendCapturedUpdates,
  type CapturedUpdate,
} from "@/lib/capture-storage";
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

function toCapturedUpdate(event: OperatorEvent): CapturedUpdate {
  const type =
    event.type === "decision.record"
      ? "decision"
      : event.type === "risk.create"
        ? "risk"
        : event.type === "meeting.create" ||
            event.type === "meeting.update" ||
            event.type === "reminder.create" ||
            event.type === "task.create"
          ? "schedule"
          : "change";

  return {
    id: event.id,
    type,
    title: event.title,
    detail: event.description ?? event.sourceText,
    createdAt: event.createdAt,
  };
}

export default function CapturePreview({
  events,
}: CapturePreviewProps) {
  const router = useRouter();

  function approveAll() {
    appendCapturedUpdates(events.map(toCapturedUpdate));
    router.push("/today");
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

  const unresolvedCount = events.filter(
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
            Operator found {events.length}{" "}
            {events.length === 1 ? "event" : "events"}
          </h2>

          {unresolvedCount > 0 ? (
            <p className="mt-2 text-sm text-amber-400">
              {unresolvedCount}{" "}
              {unresolvedCount === 1 ? "event needs" : "events need"} more detail.
            </p>
          ) : null}
        </div>

        <span className="rounded-full bg-violet-500/20 px-3 py-1 text-sm text-violet-300">
          Interpreter v1
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {events.map((event) => (
          <CaptureItem
            key={event.id}
            type={labelForEvent(event)}
            title={event.sourceText}
            detail={detailForEvent(event)}
            status={
              event.missingFields.length > 0
                ? "Needs detail"
                : "Ready"
            }
          />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/today")}
          className="rounded-lg border border-zinc-700 px-4 py-2 font-medium text-zinc-300 transition hover:bg-zinc-800"
        >
          Discard
        </button>

        <button
          type="button"
          disabled={unresolvedCount > 0}
          onClick={approveAll}
          className="rounded-lg bg-white px-4 py-2 font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Approve All
        </button>
      </div>
    </section>
  );
}
