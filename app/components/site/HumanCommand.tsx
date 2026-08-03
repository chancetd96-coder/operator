const roles = [
  {
    number: "01",
    title: "Operator",
    label: "Continuously analyzes",
    description:
      "Monitors missions, tasks, risks, meetings, timelines, dependencies, and changes across the operational picture.",
  },
  {
    number: "02",
    title: "Leader",
    label: "Exercises judgment",
    description:
      "Evaluates recommendations against intent, context, experience, authorities, and risk.",
  },
  {
    number: "03",
    title: "Organization",
    label: "Executes",
    description:
      "Acts through clear ownership, synchronized priorities, and an operational picture shared across the team.",
  },
];

export default function HumanCommand() {
  return (
    <section
      id="human-command"
      className="relative border-t border-white/10 px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[-10rem] top-1/4 h-[34rem] w-[34rem] rounded-full bg-cyan-300/[0.022] blur-[135px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.3em] text-cyan-300/60">
              HUMAN COMMAND
            </p>

            <h2 className="mt-6 text-4xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl">
              AI recommends.
              <br />
              People decide.
            </h2>
          </div>

          <p className="max-w-2xl text-base leading-8 text-white/45 sm:text-lg lg:justify-self-end">
            Operator increases the speed and clarity of
            decision-making without removing authority,
            accountability, or human judgment from the chain of
            command.
          </p>
        </div>

        <div className="relative mt-16 sm:mt-20">
          <div
            aria-hidden="true"
            className="absolute left-5 right-5 top-10 hidden h-px bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent lg:block"
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {roles.map((role) => (
              <article
                key={role.title}
                className="relative rounded-3xl border border-white/10 bg-white/[0.022] p-6 sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-cyan-300/60">
                    {role.number}
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300/25 bg-[#050808]">
                    <span className="h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(165,243,252,0.45)]" />
                  </span>
                </div>

                <h3 className="mt-8 text-2xl font-semibold tracking-tight">
                  {role.title}
                </h3>

                <p className="mt-2 text-sm font-medium text-cyan-200/65">
                  {role.label}
                </p>

                <p className="mt-5 text-sm leading-7 text-white/40">
                  {role.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-3">
          {[
            ["AUTHORITY", "Remains human."],
            ["RECOMMENDATION", "Becomes continuous."],
            ["EXECUTION", "Becomes synchronized."],
          ].map(([label, value]) => (
            <div
              key={label}
              className="bg-[#050808] px-5 py-5"
            >
              <p className="text-[9px] font-semibold tracking-[0.18em] text-cyan-300/55">
                {label}
              </p>

              <p className="mt-2 text-sm font-medium text-white/68">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}