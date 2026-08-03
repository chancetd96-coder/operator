const experienceAreas = [
  {
    number: "01",
    title: "Operational planning",
    description:
      "Built from experience translating senior-leader intent into executable plans across complex, time-sensitive operations.",
  },
  {
    number: "02",
    title: "Mission execution",
    description:
      "Informed by environments where priorities shift, risk compounds, and leaders must maintain awareness while execution continues.",
  },
  {
    number: "03",
    title: "Cross-functional coordination",
    description:
      "Designed around the reality of synchronizing teams, resources, meetings, decisions, and dependencies across organizational boundaries.",
  },
];

export default function OperationalExperience() {
  return (
    <section
      id="experience"
      className="relative border-t border-white/10 px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-12rem] top-1/4 h-[36rem] w-[36rem] rounded-full bg-cyan-300/[0.02] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.3em] text-cyan-300/60">
              DESIGNED FROM OPERATIONAL EXPERIENCE
            </p>

            <h2 className="mt-6 text-4xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl">
              Built around how
              <br />
              execution actually works.
            </h2>
          </div>

          <div className="max-w-2xl lg:justify-self-end">
            <p className="text-base leading-8 text-white/45 sm:text-lg">
              Operator was shaped by firsthand experience
              maintaining operational awareness, coordinating
              across functions, and helping leaders move from
              intent to action.
            </p>

            <p className="mt-5 text-sm leading-7 text-white/30">
              The product begins with the realities of execution,
              then applies software and AI to reduce the friction.
            </p>
          </div>
        </div>

        <div className="relative mt-16 sm:mt-20">
          <div
            aria-hidden="true"
            className="absolute left-5 right-5 top-8 hidden h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent lg:block"
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {experienceAreas.map((area) => (
              <article
                key={area.title}
                className="relative rounded-3xl border border-white/10 bg-white/[0.022] p-6 sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-cyan-300/60">
                    {area.number}
                  </span>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300/25 bg-[#050808]">
                    <span className="h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(165,243,252,0.4)]" />
                  </span>
                </div>

                <h3 className="mt-8 text-2xl font-semibold tracking-tight text-white/90">
                  {area.title}
                </h3>

                <p className="mt-5 text-sm leading-7 text-white/40">
                  {area.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-14 border-l border-cyan-300/30 pl-6">
          <p className="max-w-4xl text-xl leading-9 text-white/70 sm:text-2xl sm:leading-10">
            Operator does not begin with another dashboard. It
            begins with the operational problem leaders face
            every day: maintaining clarity while the mission
            continues to change.
          </p>
        </div>
      </div>
    </section>
  );
}