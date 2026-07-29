"use client";

import Link from "next/link";
import Page from "@/components/layout/Page";

const SESSION_STORAGE_KEY = "operator-last-focus-session";

type FocusSessionSummary = {
  title: string;
  elapsedSeconds: number;
  elapsed: string;
  notes: string;
  blockers: string;
  completedItems: string[];
  completedAt: string;
};

const CHECKLIST_TOTAL = 4;

function loadSessionSummary(): FocusSessionSummary | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as FocusSessionSummary;
  } catch {
    return null;
  }
}

function calculateExecutionScore(
  summary: FocusSessionSummary,
): number {
  const completionPoints =
    (summary.completedItems.length / CHECKLIST_TOTAL) * 70;

  const blockerPoints =
    summary.blockers.trim().length === 0 ? 20 : 5;

  const capturePoints =
    summary.notes.trim().length > 0 ? 10 : 5;

  return Math.min(
    100,
    Math.round(
      completionPoints +
        blockerPoints +
        capturePoints,
    ),
  );
}

function formatCompletionTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently completed";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function FocusDebriefPage() {
  const summary = loadSessionSummary();

  if (!summary) {
    return (
      <Page>
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            Session Debrief
          </p>

          <h1 className="mt-3 text-3xl font-semibold">
            No completed session found
          </h1>

          <p className="mt-3 text-zinc-400">
            Complete a focus session to generate a debrief.
          </p>

          <Link
            href="/focus"
            className="mt-6 inline-flex rounded-lg bg-white px-5 py-3 font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            Start Focus Session
          </Link>
        </section>
      </Page>
    );
  }

  const executionScore =
    calculateExecutionScore(summary);

  const checklistProgress = `${summary.completedItems.length}/${CHECKLIST_TOTAL}`;

  return (
    <Page>
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">
              Session Complete
            </p>

            <h1 className="mt-3 text-3xl font-semibold">
              {summary.title}
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              {formatCompletionTime(summary.completedAt)}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-6 py-5 text-center">
            <p className="text-sm text-zinc-500">
              Execution Score
            </p>

            <p className="mt-1 text-4xl font-semibold">
              {executionScore}%
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
            <p className="text-sm text-zinc-500">
              Focused Time
            </p>

            <p className="mt-2 font-mono text-2xl font-semibold">
              {summary.elapsed}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
            <p className="text-sm text-zinc-500">
              Checklist
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {checklistProgress}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
            <p className="text-sm text-zinc-500">
              Blocker Status
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {summary.blockers.trim()
                ? "Reported"
                : "Clear"}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <h2 className="text-lg font-semibold">
            Completed
          </h2>

          {summary.completedItems.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {summary.completedItems.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-lg border border-zinc-800 p-3"
                >
                  <span className="text-emerald-400">
                    ✓
                  </span>

                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-zinc-500">
              No checklist items were marked complete.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <h2 className="text-lg font-semibold">
            Remaining Work
          </h2>

          <p className="mt-4 text-zinc-400">
            {CHECKLIST_TOTAL -
              summary.completedItems.length}{" "}
            checklist{" "}
            {CHECKLIST_TOTAL -
              summary.completedItems.length ===
            1
              ? "item remains"
              : "items remain"}
            .
          </p>

          <p className="mt-3 text-sm text-zinc-500">
            Operator will eventually use this information
            to recommend the next highest-leverage action.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <h2 className="text-lg font-semibold">
            Quick Capture
          </h2>

          <p className="mt-4 whitespace-pre-wrap text-zinc-400">
            {summary.notes.trim() ||
              "No notes were captured."}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <h2 className="text-lg font-semibold">
            Blockers
          </h2>

          <p className="mt-4 whitespace-pre-wrap text-zinc-400">
            {summary.blockers.trim() ||
              "No blockers were reported."}
          </p>
        </div>
      </section>

      <section className="flex flex-wrap justify-end gap-3">
        <Link
          href="/focus"
          className="rounded-lg border border-zinc-700 px-5 py-3 font-medium text-zinc-300 transition hover:bg-zinc-800"
        >
          Start Another Session
        </Link>

        <Link
          href="/today"
          className="rounded-lg bg-white px-5 py-3 font-semibold text-zinc-950 transition hover:bg-zinc-200"
        >
          Continue to Today
        </Link>
      </section>
    </Page>
  );
}
