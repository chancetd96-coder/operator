import Card from "@/components/ui/Card";
import Metric from "@/components/ui/Metric";
import SectionTitle from "@/components/ui/SectionTitle";

type CommanderPanelProps = {
  situation: string;
  assessment: string;
  coa: string;
  confidence: string;
};

export default function CommanderPanel({
  situation,
  assessment,
  coa,
  confidence,
}: CommanderPanelProps) {
  return (
    <Card>
      <SectionTitle>Commander</SectionTitle>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <p className="text-sm text-zinc-500">Situation</p>
          <p className="mt-1 text-zinc-200">{situation}</p>
        </div>

        <div>
          <p className="text-sm text-zinc-500">Assessment</p>
          <p className="mt-1 text-zinc-200">{assessment}</p>
        </div>

        <div>
          <p className="text-sm text-zinc-500">Recommended COA</p>
          <p className="mt-1 text-zinc-200">{coa}</p>
        </div>

        <Metric label="Confidence" value={confidence} />
      </div>
    </Card>
  );
}
