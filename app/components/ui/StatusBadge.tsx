type StatusTone = "healthy" | "warning" | "critical" | "neutral" | "ai";

type StatusBadgeProps = {
  children: string;
  tone?: StatusTone;
};

const toneClasses: Record<StatusTone, string> = {
  healthy: "bg-emerald-500/20 text-emerald-400",
  warning: "bg-amber-500/20 text-amber-400",
  critical: "bg-red-500/20 text-red-400",
  neutral: "bg-zinc-700/60 text-zinc-300",
  ai: "bg-violet-500/20 text-violet-300",
};

export default function StatusBadge({
  children,
  tone = "neutral",
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
