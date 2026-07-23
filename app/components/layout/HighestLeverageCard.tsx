import Card from "@/components/ui/Card";
import Metric from "@/components/ui/Metric";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SectionTitle from "@/components/ui/SectionTitle";

type HighestLeverageCardProps = {
  title: string;
  duration: string;
  impact: string;
};

export default function HighestLeverageCard({
  title,
  duration,
  impact,
}: HighestLeverageCardProps) {
  return (
    <Card>
      <SectionTitle>Today&apos;s Highest Leverage Action</SectionTitle>

      <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
        {title}
      </h2>

      <div className="mt-6 flex flex-wrap gap-8">
        <Metric label="Estimated Time" value={duration} />
        <Metric label="Expected Impact" value={impact} />
      </div>

      <PrimaryButton className="mt-8">Start Working</PrimaryButton>
    </Card>
  );
}
