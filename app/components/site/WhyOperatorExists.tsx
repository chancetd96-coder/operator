const failurePoints = [
  {
    label: "EMAIL",
    title: "A decision is buried.",
    detail:
      "Critical context disappears inside long threads and disconnected inboxes.",
  },
  {
    label: "MEETINGS",
    title: "Action items disappear.",
    detail:
      "Ownership becomes unclear as soon as the meeting ends.",
  },
  {
    label: "SPREADSHEETS",
    title: "Status becomes stale.",
    detail:
      "The operational picture is already outdated when leadership receives it.",
  },
  {
    label: "CHAT",
    title: "Context is lost.",
    detail:
      "Fast-moving updates remain separated from the mission they affect.",
  },
];

export default function WhyOperatorExists() {
  return (
    <section
      id="why-we-exist"
      className="relative border-t border-white/10 px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/[0.025] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-5xl">
          <p className="text-[11px] font-semibold tracking-[0.3em] text-cyan-300/60">
            WHY OPERATOR EXISTS
          </p>

          <h2 className="mt-6 text-4xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl">
            Plans rarely fail because of strategy.
            <br />
            They fail when execution fragments.
          </h2>

          <p className="mt-7 max-w-3xl text-base leading-8 text-white/45 sm:text-lg">
            Decisions, responsibilities, timelines, and risks
            separate across the tools organizations already use.
            Leaders spend their time rebuilding awareness instead
            of directing execution.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 sm:mt-20">
          {failurePoints.map((point) => (
            <article
              key={point.label}
              className="rounded-3xl border border-white/10 bg-white/[0.022] p-6 sm:p-7"
            >
              <p className="text-[10px] font-semibold tracking-[0.2em] text-white/25">
                {point.label}
              </p>

              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white/85">
                {point.title}
              </h3>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/40">
                {point.detail}
              </p>
            </article>
          ))}
        </div>

        <div className="relative mt-16 min-h-[360px] overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-cyan-300/[0.02] sm:mt-24">
          <svg
            viewBox="0 0 1000 420"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <linearGradient
                id="why-operator-line"
                x1="0"
                x2="1"
              >
                <stop
                  offset="0%"
                  stopColor="rgb(255 255 255)"
                  stopOpacity="0.05"
                />
                <stop
                  offset="55%"
                  stopColor="rgb(103 232 249)"
                  stopOpacity="0.55"
                />
                <stop
                  offset="100%"
                  stopColor="rgb(165 243 252)"
                  stopOpacity="0.12"
                />
              </linearGradient>
            </defs>

            <path
              d="M 80 72 C 260 90, 330 175, 500 210"
              fill="none"
              stroke="url(#why-operator-line)"
              strokeWidth="1.5"
            />

            <path
              d="M 80 348 C 260 330, 330 245, 500 210"
              fill="none"
              stroke="url(#why-operator-line)"
              strokeWidth="1.5"
            />

            <path
              d="M 920 72 C 740 90, 670 175, 500 210"
              fill="none"
              stroke="url(#why-operator-line)"
              strokeWidth="1.5"
            />

            <path
              d="M 920 348 C 740 330, 670 245, 500 210"
              fill="none"
              stroke="url(#why-operator-line)"
              strokeWidth="1.5"
            />
          </svg>

          <div className="absolute left-[6%] top-[12%] rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-white/40">
            Decision
          </div>

          <div className="absolute bottom-[12%] left-[6%] rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-white/40">
            Ownership
          </div>

          <div className="absolute right-[6%] top-[12%] rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-white/40">
            Timeline
          </div>

          <div className="absolute bottom-[12%] right-[6%] rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-white/40">
            Risk
          </div>

          <div className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-cyan-300/25 bg-[#050909] text-center shadow-[0_0_80px_rgba(103,232,249,0.1)]">
            <div className="h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_24px_rgba(165,243,252,0.55)]" />

            <p className="mt-4 text-[10px] font-semibold tracking-[0.22em] text-cyan-300/60">
              OPERATOR
            </p>

            <p className="mt-2 text-sm font-semibold text-white/85">
              One operational picture
            </p>
          </div>
        </div>

        <div className="mt-12 border-l border-cyan-300/30 pl-6">
          <p className="max-w-4xl text-xl leading-9 text-white/70 sm:text-2xl sm:leading-10">
            Operator exists so leaders never have to rebuild the
            operational picture from scratch.
          </p>
        </div>
      </div>
    </section>
  );
}