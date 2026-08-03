const executionStages = [
  {
    label: "Intent",
    position:
      "left-[5%] top-[60%] sm:left-[8%]",
  },
  {
    label: "Plan",
    position:
      "left-[27%] top-[31%]",
  },
  {
    label: "Synchronize",
    position:
      "left-[51%] top-[52%]",
  },
  {
    label: "Execute",
    position:
      "left-[73%] top-[22%]",
  },
  {
    label: "Decide",
    position:
      "right-[3%] top-[43%] sm:right-[5%]",
  },
];

export default function OperatorHeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto h-[310px] w-full max-w-6xl sm:h-[390px] lg:h-[470px]"
    >
      <div className="absolute inset-x-[5%] top-[42%] h-[42%] rounded-[50%] border border-white/[0.04] bg-white/[0.015] [transform:perspective(900px)_rotateX(63deg)_rotateZ(-5deg)]">
        <div className="absolute inset-[10%] rounded-[50%] border border-cyan-300/[0.05]" />
        <div className="absolute inset-[23%] rounded-[50%] border border-white/[0.04]" />
      </div>

      <svg
        viewBox="0 0 1200 420"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient
            id="operator-path-gradient"
            x1="0"
            x2="1"
          >
            <stop
              offset="0%"
              stopColor="rgb(103 232 249)"
              stopOpacity="0.25"
            />
            <stop
              offset="45%"
              stopColor="rgb(103 232 249)"
              stopOpacity="1"
            />
            <stop
              offset="100%"
              stopColor="rgb(165 243 252)"
              stopOpacity="0.3"
            />
          </linearGradient>

          <filter
            id="operator-path-glow"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feGaussianBlur
              stdDeviation="5"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d="M 40 278 C 170 310, 240 92, 390 140 C 520 180, 555 285, 710 218 C 835 164, 855 70, 1010 120 C 1100 150, 1130 206, 1170 186"
          fill="none"
          stroke="rgb(255 255 255 / 0.08)"
          strokeWidth="2"
        />

        <path
          d="M 40 278 C 170 310, 240 92, 390 140 C 520 180, 555 285, 710 218 C 835 164, 855 70, 1010 120 C 1100 150, 1130 206, 1170 186"
          fill="none"
          stroke="url(#operator-path-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#operator-path-glow)"
          className="operator-path"
        />

        <circle
          r="6"
          fill="rgb(165 243 252)"
          filter="url(#operator-path-glow)"
          className="operator-path-node"
        >
          <animateMotion
            dur="7s"
            repeatCount="indefinite"
            path="M 40 278 C 170 310, 240 92, 390 140 C 520 180, 555 285, 710 218 C 835 164, 855 70, 1010 120 C 1100 150, 1130 206, 1170 186"
          />
        </circle>
      </svg>

      {executionStages.map((stage, index) => (
        <div
          key={stage.label}
          className={`absolute ${stage.position}`}
        >
          <div className="relative">
            <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/5 blur-xl" />

            <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-cyan-200/45 bg-black shadow-[0_0_24px_rgba(103,232,249,0.25)]">
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-200" />
            </div>

            <div className="absolute left-1/2 top-7 -translate-x-1/2 whitespace-nowrap text-center">
              <p className="text-[9px] font-semibold tracking-[0.18em] text-cyan-200/55">
                0{index + 1}
              </p>

              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white/40 sm:text-xs">
                {stage.label}
              </p>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute left-[48%] top-[42%] hidden h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10 bg-cyan-300/[0.025] shadow-[0_0_80px_rgba(103,232,249,0.08)] sm:block">
        <div className="absolute inset-[18%] rounded-full border border-white/[0.05]" />
        <div className="absolute inset-[37%] rounded-full bg-cyan-200/15 blur-sm" />
      </div>
    </div>
  );
}