import Card from "@/components/ui/Card";
import Metric from "@/components/ui/Metric";

const stats = [
  ["Active Campaigns", "1"],
  ["Open Tasks", "12"],
  ["Blocked", "1"],
  ["Organization Health", "91%"],
] as const;

export default function FooterStats() {
  return (
    <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map(([label, value]) => (
        <Card key={label} className="p-4">
          <Metric label={label} value={value} />
        </Card>
      ))}
    </section>
  );
}
