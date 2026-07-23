import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";

type SituationGridProps = {
  changes: string[];
  decisions: string[];
  risks: string[];
  schedule: string[];
};

function SituationPanel({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: string[];
  emptyText: string;
}) {
  return (
    <Card>
      <SectionTitle>{title}</SectionTitle>

      {items.length > 0 ? (
        <ul className="mt-4 space-y-2 text-sm text-zinc-300">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-zinc-500">{emptyText}</p>
      )}
    </Card>
  );
}

export default function SituationGrid({
  changes,
  decisions,
  risks,
  schedule,
}: SituationGridProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <SituationPanel
        title="What Changed"
        items={changes}
        emptyText="No recent changes."
      />

      <SituationPanel
        title="Decisions Waiting"
        items={decisions}
        emptyText="No decisions waiting."
      />

      <SituationPanel
        title="Top Risks"
        items={risks}
        emptyText="No critical risks identified."
      />

      <SituationPanel
        title="Today"
        items={schedule}
        emptyText="No scheduled execution items."
      />
    </section>
  );
}
