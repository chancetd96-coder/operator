"use client";

import { useEffect, useState } from "react";
import Page from "@/components/layout/Page";
import Hero from "@/components/operator/Hero";
import HighestLeverageCard from "@/components/operator/HighestLeverageCard";
import SituationGrid from "@/components/operator/SituationGrid";
import CommanderPanel from "@/components/operator/CommanderPanel";
import FooterStats from "@/components/operator/FooterStats";
import { listEvents } from "@/lib/repositories/operatorEventRepository";
import type { OperatorEvent } from "@/lib/types/operator-event";

const today = {
  greeting: "Good Morning",
  user: "Chance",
  confidence: 91,
  status: "ON TRACK",
  highestAction: "Finish Defense Unicorns Interview Prep",
  duration: "1h 20m",
  impact: "+7% Execution Confidence",

  commander: {
    situation:
      "Interview preparation remains the highest-value activity today.",
    assessment:
      "Completing your preparation before networking maximizes execution confidence.",
    coa: "Complete the interview prep block before noon.",
    confidence: "94%",
  },
};

function displayEvent(event: OperatorEvent): string {
  const title =
    event.sourceText ||
    event.description ||
    event.title;

  const details: string[] = [];

  if (event.time?.raw) {
    details.push(event.time.raw);
  }

  if (event.people.length > 0) {
    details.push(
      event.people
        .map((person) => person.name)
        .join(", "),
    );
  }

  return details.length > 0
    ? `${title} — ${details.join(" • ")}`
    : title;
}

export default function TodayPage() {
  const [events, setEvents] = useState<OperatorEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadTodayEvents() {
      try {
        const approvedEvents = await listEvents([
          "approved",
          "committed",
        ]);

        if (isActive) {
          setEvents(approvedEvents);
        }
      } catch (caughtError) {
        if (isActive) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Operator could not load today's events.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadTodayEvents();

    return () => {
      isActive = false;
    };
  }, []);

  const changes = events
    .filter(
      (event) =>
        event.type === "meeting.update" ||
        event.type === "note.record",
    )
    .map(displayEvent);

  const decisions = events
    .filter(
      (event) => event.type === "decision.record",
    )
    .map(displayEvent);

  const risks = events
    .filter(
      (event) => event.type === "risk.create",
    )
    .map(displayEvent);

  const schedule = events
    .filter(
      (event) =>
        event.type === "meeting.create" ||
        event.type === "meeting.update" ||
        event.type === "task.create" ||
        event.type === "reminder.create",
    )
    .map(displayEvent);

  return (
    <Page>
      <Hero
        greeting={today.greeting}
        user={today.user}
        confidence={today.confidence}
        status={today.status}
      />

      <HighestLeverageCard
        title={today.highestAction}
        duration={today.duration}
        impact={today.impact}
      />

      {isLoading ? (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <p className="text-sm text-zinc-400">
            Operator is loading your approved events...
          </p>
        </section>
      ) : null}

      {error ? (
        <section className="rounded-2xl border border-red-900/60 bg-red-950/30 p-6">
          <p className="font-medium text-red-300">
            Today could not be loaded
          </p>

          <p className="mt-2 text-sm text-red-200/80">
            {error}
          </p>
        </section>
      ) : null}

      {!isLoading && !error ? (
        <SituationGrid
          changes={changes}
          decisions={decisions}
          risks={risks}
          schedule={schedule}
        />
      ) : null}

      <CommanderPanel
        situation={today.commander.situation}
        assessment={today.commander.assessment}
        coa={today.commander.coa}
        confidence={today.commander.confidence}
      />

      <FooterStats />
    </Page>
  );
}
