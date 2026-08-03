export default function BuiltForOperations() {
  const industries = [
    {
      title: "Defense",
      body: "Synchronize missions, resources, risks, and execution across every echelon.",
    },
    {
      title: "Emergency Management",
      body: "Coordinate agencies, timelines, and rapidly changing operational priorities.",
    },
    {
      title: "Corporate Operations",
      body: "Connect strategic intent to execution across programs and teams.",
    },
    {
      title: "Manufacturing",
      body: "Track production, dependencies, constraints, and operational health.",
    },
    {
      title: "Construction",
      body: "Maintain visibility across schedules, crews, vendors, and field decisions.",
    },
    {
      title: "Healthcare",
      body: "Coordinate people, resources, compliance, and patient operations.",
    },
    {
      title: "Energy",
      body: "Manage distributed operations, maintenance, outages, and response.",
    },
    {
      title: "Government",
      body: "Reduce reporting burden while improving visibility across organizations.",
    },
  ];

  return (
    <section
      id="operations"
      className="border-t border-white/5 px-8 py-32"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.35em] text-cyan-400">
          BUILT FOR MODERN OPERATIONS
        </p>

        <h2 className="mt-6 max-w-4xl text-5xl font-semibold leading-tight">
          One execution system.
          <br />
          Any operational environment.
        </h2>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-white/55">
          Every organization coordinating people, timelines,
          risks, meetings, and decisions faces the same
          execution problem. Operator provides one operational
          picture regardless of mission or industry.
        </p>

        <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {industries.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.03]"
            >
              <h3 className="text-xl font-semibold">
                {item.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/50">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}