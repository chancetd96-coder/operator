const levels = [
  {
    title: "Enterprise",
    subtitle: "Shared Operational Picture",
    metrics: [
      "Global priorities",
      "Resource conflicts",
      "Decision support",
    ],
  },
  {
    title: "Division / Wing",
    subtitle: "Operational synchronization",
    metrics: [
      "Mission health",
      "Execution",
      "Risk",
    ],
  },
  {
    title: "Brigade / Battalion",
    subtitle: "Mission ownership",
    metrics: [
      "Tasks",
      "Meetings",
      "Dependencies",
    ],
  },
  {
    title: "Team / Section",
    subtitle: "Daily execution",
    metrics: [
      "Focus",
      "Timeline",
      "Capture",
    ],
  },
  {
    title: "Individual",
    subtitle: "Operator",
    metrics: [
      "Next action",
      "Priority",
      "Execution",
    ],
  },
];

export default function OrganizationScale() {
  return (
    <div className="relative mx-auto max-w-md py-8">

      <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-cyan-300/0 via-cyan-300/40 to-cyan-300/0" />

      <div className="space-y-8">
        {levels.map((level) => (
          <div
            key={level.title}
            className="relative flex items-center justify-center"
          >
            <div className="absolute left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border border-cyan-300/40 bg-[#050707] shadow-[0_0_20px_rgba(103,232,249,.25)]">
              <div className="absolute inset-[3px] rounded-full bg-cyan-200" />
            </div>

            <div className="ml-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-300/20 hover:bg-white/[0.05]">
              <p className="text-lg font-semibold text-white">
                {level.title}
              </p>

              <p className="mt-1 text-sm text-white/45">
                {level.subtitle}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {level.metrics.map((metric) => (
                  <span
                    key={metric}
                    className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.05] px-3 py-1 text-[10px] text-cyan-100/70"
                  >
                    {metric}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}