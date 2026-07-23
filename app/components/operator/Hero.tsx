import Card from "@/components/ui/Card";
import Metric from "@/components/ui/Metric";
import SectionTitle from "@/components/ui/SectionTitle";
import StatusBadge from "@/components/ui/StatusBadge";

type HeroProps = {
  greeting: string;
  user: string;
  confidence: number;
  status: string;
};

export default function Hero({
  greeting,
  user,
  confidence,
  status,
}: HeroProps) {
  return (
    <Card>
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <SectionTitle>Today</SectionTitle>

          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            {greeting}, {user}
          </h1>

          <p className="mt-3 max-w-2xl text-zinc-400">
            You&apos;re on track. Focus on your highest leverage action.
          </p>
        </div>

        <div className="md:text-right">
          <Metric
            label="Execution Confidence"
            value={`${confidence}%`}
          />

          <div className="mt-3">
            <StatusBadge tone="healthy">{status}</StatusBadge>
          </div>
        </div>
      </div>
    </Card>
  );
}
