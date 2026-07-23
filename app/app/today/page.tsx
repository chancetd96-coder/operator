"use client";

import { useEffect, useState } from "react";
import Page from "@/components/layout/Page";
import Hero from "@/components/operator/Hero";
import HighestLeverageCard from "@/components/operator/HighestLeverageCard";
import SituationGrid from "@/components/operator/SituationGrid";
import CommanderPanel from "@/components/operator/CommanderPanel";
import FooterStats from "@/components/operator/FooterStats";
import {
  loadCapturedUpdates,
  type CapturedUpdate,
} from "@/lib/capture-storage";

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

export default function TodayPage() {
  const [updates, setUpdates] = useState<CapturedUpdate[]>([]);

  useEffect(() => {
    setUpdates(loadCapturedUpdates());
  }, []);

  const changes = updates
    .filter((update) => update.type === "change")
    .map((update) =>
      update.detail
        ? `${update.title} — ${update.detail}`
        : update.title,
    );

  const decisions = updates
    .filter((update) => update.type === "decision")
    .map((update) =>
      update.detail
        ? `${update.title} — ${update.detail}`
        : update.title,
    );

  const risks = updates
    .filter((update) => update.type === "risk")
    .map((update) =>
      update.detail
        ? `${update.title} — ${update.detail}`
        : update.title,
    );

  const schedule = updates
    .filter((update) => update.type === "schedule")
    .map((update) =>
      update.detail
        ? `${update.title} — ${update.detail}`
        : update.title,
    );

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

      <SituationGrid
        changes={changes}
        decisions={decisions}
        risks={risks}
        schedule={schedule}
      />

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