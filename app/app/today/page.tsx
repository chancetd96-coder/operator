import Page from "@/components/layout/Page";
import Hero from "@/components/operator/Hero";
import HighestLeverageCard from "@/components/operator/HighestLeverageCard";
import SituationGrid from "@/components/operator/SituationGrid";
import CommanderPanel from "@/components/operator/CommanderPanel";
import FooterStats from "@/components/operator/FooterStats";

const today = {
  greeting: "Good Morning",
  user: "Chance",
  confidence: 91,
  status: "ON TRACK",
  highestAction: "Finish Defense Unicorns Interview Prep",
  duration: "1h 20m",
  impact: "+7% Execution Confidence",

  commander: {
    situation: "Interview preparation remains the highest-value activity today.",
    assessment:
      "Completing your preparation before networking maximizes execution confidence.",
    coa: "Complete the interview prep block before noon.",
    confidence: "94%",
  },

  changes: [],
  decisions: [],
  risks: [],
  schedule: [],
};

export default function TodayPage() {
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
        changes={today.changes}
        decisions={today.decisions}
        risks={today.risks}
        schedule={today.schedule}
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
