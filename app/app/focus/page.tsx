"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Page from "@/components/layout/Page";

function formatElapsed(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => value.toString().padStart(2, "0"))
    .join(":");
}

export default function FocusPage() {
  const [isRunning, setIsRunning] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [notes, setNotes] = useState("");
  const [blockers, setBlockers] = useState("");

  useEffect(() => {
    if (!isRunning) return;

    const interval = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning]);

  return (
    <Page>
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
          Active Focus Session
        </p>

        <h1 className="mt-3 text-3xl font-semibold">
          Finish Defense Unicorns Interview Prep
        </h1>

        <div className="mt-8">
          <p className="text-sm text-zinc-500">Elapsed Time</p>
          <p className="mt-2 font-mono text-5xl font-semibold">
            {formatElapsed(elapsedSeconds)}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setIsRunning((current) => !current)}
            className="rounded-lg bg-white px-4 py-2 font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            {isRunning ? "Pause" : "Resume"}
          </button>

          <Link
            href="/today"
            className="rounded-lg border border-zinc-700 px-4 py-2 font-medium text-zinc-300 transition hover:bg-zinc-800"
          >
            Exit Session
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <h2 className="text-lg font-semibold">Definition of Done</h2>

        <div className="mt-4 space-y-3">
          {[
            "Review company and role",
            "Practice interview stories",
            "Prepare questions",
            "Confirm compensation position",
          ].map((item) => (
            <label
              key={item}
              className="flex items-center gap-3 rounded-lg border border-zinc-800 p-3"
            >
              <input
                type="checkbox"
                className="h-4 w-4"
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <label
            htmlFor="focus-notes"
            className="text-lg font-semibold"
          >
            Quick Capture
          </label>

          <textarea
            id="focus-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Capture changes, decisions, tasks, or follow-ups..."
            className="mt-4 min-h-40 w-full rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-zinc-600"
          />
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <label
            htmlFor="focus-blockers"
            className="text-lg font-semibold"
          >
            Blockers
          </label>

          <textarea
            id="focus-blockers"
            value={blockers}
            onChange={(event) => setBlockers(event.target.value)}
            placeholder="What is slowing or stopping execution?"
            className="mt-4 min-h-40 w-full rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-zinc-600"
          />
        </div>
      </section>

      <section className="flex justify-end">
        <button
          type="button"
          className="rounded-lg bg-white px-5 py-3 font-semibold text-zinc-950 transition hover:bg-zinc-200"
        >
          Complete Session
        </button>
      </section>
    </Page>
  );
}
