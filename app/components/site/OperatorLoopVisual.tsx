const stages = [
  {
    number: "01",
    title: "Intent",
    description:
      "Define the objective, priorities, constraints, and desired end state.",
  },
  {
    number: "02",
    title: "Plan",
    description:
      "Translate intent into missions, tasks, timelines, meetings, and ownership.",
  },
  {
    number: "03",
    title: "Synchronize",
    description:
      "Connect people, dependencies, risks, resources, and decisions.",
  },
  {
    number: "04",
    title: "Execute",
    description:
      "Track progress, expose friction, and maintain a live operational picture.",
  },
  {
    number: "05",
    title: "Decide",
    description:
      "Surface what changed, what matters, and what requires command attention.",
  },
  {
    number: "06",
    title: "Learn",
    description:
      "Preserve decisions, context, outcomes, and lessons for the next cycle.",
  },
];

export default function OperatorLoopVisual() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-5 top-0 w-px bg-gradient-to-b from-cyan-300/0 via-cyan-300/40 to-cyan-300/0 lg:left-1/2"
      />

      <div className="space-y-5 lg:space-y-0">
        {stages.map((stage, index) => {
          const isLeft = index % 2 === 0;

          return (
            <div
              key={stage.title}
              className="relative grid min-h-40 grid-cols-[2.5rem_1fr] gap-5 lg:grid-cols-[1fr_5rem_1fr] lg:items-center"
            >
              <div
                className={
                  isLeft
                    ? "lg:col-start-1 lg:pr-10 lg:text-right"
                    : "lg:col-start-3 lg:pl-10"
                }
              >
                <article className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition duration-300 hover:border-cyan-300/20 hover:bg-white/[0.045] sm:p-6">
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-cyan-300/55">
                    {stage.number}
                  </p>

                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    {stage.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/42">
                    {stage.description}
                  </p>
                </article>
              </div>

              <div className="relative col-start-1 row-start-1 flex justify-center lg:col-start-2">
                <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/5 blur-xl" />

                <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/35 bg-[#050808] shadow-[0_0_28px_rgba(103,232,249,0.12)]">
                  <div className="h-2 w-2 rounded-full bg-cyan-200" />
                </div>
              </div>

              <div
                aria-hidden="true"
                className={`hidden lg:block ${
                  isLeft
                    ? "col-start-3"
                    : "col-start-1 row-start-1"
                }`}
              >
                <div
                  className={`h-px w-24 bg-gradient-to-r ${
                    isLeft
                      ? "from-cyan-300/20 to-transparent"
                      : "ml-auto from-transparent to-cyan-300/20"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex items-center gap-4 border-t border-white/10 pt-7 lg:ml-auto lg:max-w-[calc(50%-2.5rem)] lg:pl-10">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/[0.06] text-sm text-cyan-200">
          ↻
        </div>

        <p className="text-sm leading-6 text-white/40">
          Every decision updates the operational picture and
          informs the next cycle of command intent.
        </p>
      </div>
    </div>
  );
}