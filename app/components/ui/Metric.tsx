type MetricProps = {
  label: string;
  value: string | number;
  detail?: string;
  className?: string;
};

export default function Metric({
  label,
  value,
  detail,
  className = "",
}: MetricProps) {
  return (
    <div className={className}>
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>

      {detail ? (
        <p className="mt-1 text-sm text-zinc-400">{detail}</p>
      ) : null}
    </div>
  );
}
