const capabilities = [
  {
    number: "01",
    title: "Commander",
    category: "Decision support",
    description:
      "Continuously identifies friction, ranks priorities, and surfaces what requires command attention.",
    outcome:
      "Know what matters before the next meeting begins.",
    visual: "command",
  },
  {
    number: "02",
    title: "Mission Graph",
    category: "Operational relationships",
    description:
      "Maps the relationships between missions, people, tasks, meetings, risks, resources, and decisions.",
    outcome:
      "Understand not only what is happening, but why.",
    visual: "graph",
  },
  {
    number: "03",
    title: "Capture",
    category: "Information ingestion",
    description:
      "Transforms unstructured updates, notes, documents, and observations into structured execution.",
    outcome:
      "Turn new information into action without manual triage.",
    visual: "capture",
  },
  {
    number: "04",
    title: "Timeline",
    category: "Operational synchronization",
    description:
      "Connects scheduled work, deadlines, meetings, dependencies, and critical execution windows.",
    outcome:
      "See schedule drift before it becomes mission failure.",
    visual: "timeline",
  },
  {
    number: "05",
    title: "Focus",
    category: "Prioritized execution",
    description:
      "Reduces noise and directs attention toward the highest-leverage action available now.",
    outcome:
      "Execute the right work instead of managing more work.",
    visual: "focus",
  },
  {
    number: "06",
    title: "Memory",
    category: "Organizational knowledge",
    description:
      "Preserves decisions, rationale, context, outcomes, and lessons across every mission cycle.",
    outcome:
      "Ensure experience compounds instead of disappearing.",
    visual: "memory",
  },
] as const;

type CapabilityVisualProps = {
  type: (typeof capabilities)[number]["visual"];
};

function CapabilityVisual({
  type,
}: CapabilityVisualProps) {
  if (type === "command") {
    return (
      <div className="relative h-44 overflow-hidden rounded-2xl border border-white/[0.06] bg-black/30">
        <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.04] shadow-[0_0_55px_rgba(103,232,249,0.09)]" />
        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200 shadow-[0_0_24px_rgba(165,243,252,0.6)]" />

        {[
          "left-[18%] top-[22%]",
          "right-[16%] top-[26%]",
          "left-[20%] bottom-[20%]",
          "right-[18%] bottom-[18%]",
        ].map((position) => (
          <div
            key={position}
            className={`absolute ${position} h-2 w-2 rounded-full border border-white/20 bg-white/20`}
          />
        ))}

        <div className="absolute left-[19%] top-[25%] h-px w-[31%] origin-left rotate-[25deg] bg-gradient-to-r from-white/10 to-cyan-300/35" />
        <div className="absolute right-[18%] top-[29%] h-px w-[31%] origin-right -rotate-[23deg] bg-gradient-to-l from-white/10 to-cyan-300/35" />
        <div className="absolute bottom-[23%] left-[21%] h-px w-[30%] origin-left -rotate-[23deg] bg-gradient-to-r from-white/10 to-cyan-300/35" />
        <div className="absolute bottom-[21%] right-[19%] h-px w-[30%] origin-right rotate-[24deg] bg-gradient-to-l from-white/10 to-cyan-300/35" />
      </div>
    );
  }

  if (type === "graph") {
    return (
      <div className="relative h-44 overflow-hidden rounded-2xl border border-white/[0.06] bg-black/30">
        <div className="absolute inset-[12%] rounded-[50%] border border-white/[0.04] [transform:perspective(700px)_rotateX(62deg)]" />

        <svg
          viewBox="0 0 420 180"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <g
            stroke="rgb(103 232 249 / 0.24)"
            strokeWidth="1"
          >
            <line x1="72" y1="52" x2="205" y2="88" />
            <line x1="205" y1="88" x2="337" y2="42" />
            <line x1="205" y1="88" x2="330" y2="138" />
            <line x1="205" y1="88" x2="92" y2="138" />
            <line x1="72" y1="52" x2="92" y2="138" />
            <line x1="337" y1="42" x2="330" y2="138" />
          </g>

          {[
            [72, 52],
            [205, 88],
            [337, 42],
            [330, 138],
            [92, 138],
          ].map(([cx, cy], index) => (
            <g key={`${cx}-${cy}`}>
              <circle
                cx={cx}
                cy={cy}
                r={index === 1 ? 14 : 8}
                fill={
                  index === 1
                    ? "rgb(103 232 249 / 0.14)"
                    : "rgb(255 255 255 / 0.08)"
                }
                stroke={
                  index === 1
                    ? "rgb(165 243 252 / 0.55)"
                    : "rgb(255 255 255 / 0.2)"
                }
              />

              <circle
                cx={cx}
                cy={cy}
                r={index === 1 ? 3.5 : 2.5}
                fill={
                  index === 1
                    ? "rgb(165 243 252)"
                    : "rgb(255 255 255 / 0.45)"
                }
              />
            </g>
          ))}
        </svg>
      </div>
    );
  }

  if (type === "capture") {
    return (
      <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06] bg-black/30">
        <div className="absolute left-[9%] top-[22%] h-8 w-16 rounded-lg border border-white/10 bg-white/[0.04]" />
        <div className="absolute left-[13%] bottom-[20%] h-8 w-20 rounded-lg border border-white/10 bg-white/[0.04]" />
        <div className="absolute right-[10%] top-[18%] h-8 w-20 rounded-lg border border-white/10 bg-white/[0.04]" />
        <div className="absolute right-[14%] bottom-[18%] h-8 w-16 rounded-lg border border-white/10 bg-white/[0.04]" />

        <div className="absolute left-[24%] top-[32%] h-px w-[28%] rotate-[17deg] bg-gradient-to-r from-white/10 to-cyan-300/35" />
        <div className="absolute left-[25%] bottom-[33%] h-px w-[27%] -rotate-[18deg] bg-gradient-to-r from-white/10 to-cyan-300/35" />
        <div className="absolute right-[24%] top-[32%] h-px w-[27%] -rotate-[18deg] bg-gradient-to-l from-white/10 to-cyan-300/35" />
        <div className="absolute right-[24%] bottom-[32%] h-px w-[27%] rotate-[17deg] bg-gradient-to-l from-white/10 to-cyan-300/35" />

        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.05] shadow-[0_0_50px_rgba(103,232,249,0.08)]">
          <div className="h-8 w-8 rounded-lg border border-cyan-200/45 bg-cyan-200/10" />
        </div>
      </div>
    );
  }

  if (type === "timeline") {
    return (
      <div className="relative h-44 overflow-hidden rounded-2xl border border-white/[0.06] bg-black/30">
        <svg
          viewBox="0 0 420 180"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <path
            d="M 25 130 C 105 130, 110 48, 190 66 C 270 84, 282 118, 395 36"
            fill="none"
            stroke="rgb(255 255 255 / 0.08)"
            strokeWidth="2"
          />

          <path
            d="M 25 130 C 105 130, 110 48, 190 66 C 270 84, 282 118, 395 36"
            fill="none"
            stroke="rgb(103 232 249 / 0.6)"
            strokeWidth="2"
          />

          {[
            [26, 130],
            [126, 61],
            [235, 85],
            [394, 36],
          ].map(([cx, cy], index) => (
            <g key={`${cx}-${cy}`}>
              <circle
                cx={cx}
                cy={cy}
                r="7"
                fill="rgb(3 5 5)"
                stroke="rgb(103 232 249 / 0.55)"
              />

              <circle
                cx={cx}
                cy={cy}
                r="2.5"
                fill={
                  index === 3
                    ? "rgb(165 243 252)"
                    : "rgb(103 232 249 / 0.7)"
                }
              />
            </g>
          ))}
        </svg>

        <div className="absolute inset-x-5 bottom-4 flex justify-between text-[8px] font-semibold tracking-[0.16em] text-white/25">
          <span>NOW</span>
          <span>DECISION</span>
          <span>END STATE</span>
        </div>
      </div>
    );
  }

  if (type === "focus") {
    return (
      <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06] bg-black/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(103,232,249,0.1),transparent_32%)]" />

        {[
          "left-[10%] top-[18%]",
          "right-[12%] top-[22%]",
          "left-[17%] bottom-[20%]",
          "right-[18%] bottom-[16%]",
        ].map((position) => (
          <div
            key={position}
            className={`absolute ${position} h-9 w-20 rounded-lg border border-white/[0.06] bg-white/[0.02] opacity-35 blur-[0.4px]`}
          />
        ))}

        <div className="relative w-[58%] rounded-2xl border border-cyan-300/30 bg-cyan-300/[0.07] p-5 shadow-[0_0_55px_rgba(103,232,249,0.1)]">
          <p className="text-[8px] font-semibold tracking-[0.18em] text-cyan-300/55">
            HIGHEST LEVERAGE
          </p>

          <div className="mt-3 h-2 w-3/4 rounded-full bg-white/65" />
          <div className="mt-2 h-1.5 w-1/2 rounded-full bg-white/20" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-44 overflow-hidden rounded-2xl border border-white/[0.06] bg-black/30">
      <div className="absolute left-1/2 top-[18%] h-[72%] w-[72%] -translate-x-1/2 rounded-[50%] border border-white/[0.04] [transform:perspective(700px)_rotateX(62deg)]" />

      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.035]">
        <div className="absolute inset-[22%] rounded-full border border-white/10" />
        <div className="absolute inset-[42%] rounded-full bg-cyan-200 shadow-[0_0_22px_rgba(165,243,252,0.4)]" />
      </div>

      {[0, 1, 2].map((ring) => (
        <div
          key={ring}
          className="absolute left-1/2 top-1/2 rounded-full border border-white/[0.045]"
          style={{
            width: `${150 + ring * 52}px`,
            height: `${70 + ring * 24}px`,
            transform:
              "translate(-50%, -50%) rotate(-8deg)",
          }}
        />
      ))}
    </div>
  );
}

export default function OperatorCapabilities() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {capabilities.map((capability) => (
        <article
          key={capability.title}
          className="group rounded-3xl border border-white/10 bg-white/[0.022] p-4 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-white/[0.038] sm:p-5"
        >
          <CapabilityVisual type={capability.visual} />

          <div className="px-1 pb-2 pt-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-cyan-300/55">
                {capability.number}
              </p>

              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/25">
                {capability.category}
              </p>
            </div>

            <h3 className="mt-4 text-2xl font-semibold tracking-tight transition-colors group-hover:text-cyan-100">
              {capability.title}
            </h3>

            <p className="mt-4 text-sm leading-6 text-white/42">
              {capability.description}
            </p>

            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-sm leading-6 text-white/68">
                {capability.outcome}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}