const fragmentedInputs = [
  {
    label: "EMAIL",
    detail: "Updates",
    position: "left-[3%] top-[10%]",
  },
  {
    label: "CALENDAR",
    detail: "Meetings",
    position: "left-[1%] top-[43%]",
  },
  {
    label: "DOCUMENTS",
    detail: "Plans",
    position: "left-[10%] bottom-[8%]",
  },
  {
    label: "CHAT",
    detail: "Decisions",
    position: "right-[8%] top-[8%]",
  },
  {
    label: "SPREADSHEETS",
    detail: "Status",
    position: "right-[1%] top-[43%]",
  },
  {
    label: "BRIEFINGS",
    detail: "Awareness",
    position: "right-[8%] bottom-[8%]",
  },
];

export default function OperationalPictureVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto h-[430px] w-full max-w-5xl sm:h-[520px]"
    >
      <div className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04] [transform:translate(-50%,-50%)_perspective(900px)_rotateX(66deg)]" />

      <div className="absolute left-1/2 top-1/2 h-[48%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/[0.08] [transform:translate(-50%,-50%)_perspective(900px)_rotateX(66deg)]" />

      <svg
        viewBox="0 0 1000 520"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient
            id="convergence-line"
            x1="0"
            x2="1"
          >
            <stop
              offset="0%"
              stopColor="rgb(255 255 255)"
              stopOpacity="0.08"
            />
            <stop
              offset="55%"
              stopColor="rgb(103 232 249)"
              stopOpacity="0.65"
            />
            <stop
              offset="100%"
              stopColor="rgb(165 243 252)"
              stopOpacity="0.2"
            />
          </linearGradient>

          <filter
            id="convergence-glow"
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
          >
            <feGaussianBlur
              stdDeviation="4"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g
          fill="none"
          stroke="url(#convergence-line)"
          strokeWidth="1.5"
        >
          <path d="M 100 85 C 250 110, 320 190, 500 260" />
          <path d="M 65 255 C 245 255, 330 255, 500 260" />
          <path d="M 145 445 C 275 395, 350 320, 500 260" />

          <path d="M 900 85 C 750 110, 680 190, 500 260" />
          <path d="M 935 255 C 755 255, 670 255, 500 260" />
          <path d="M 855 445 C 725 395, 650 320, 500 260" />
        </g>

        <circle
          cx="500"
          cy="260"
          r="48"
          fill="rgb(103 232 249 / 0.025)"
          stroke="rgb(103 232 249 / 0.18)"
        />

        <circle
          cx="500"
          cy="260"
          r="22"
          fill="rgb(103 232 249 / 0.08)"
          stroke="rgb(165 243 252 / 0.35)"
          filter="url(#convergence-glow)"
        />

        <circle
          cx="500"
          cy="260"
          r="5"
          fill="rgb(165 243 252)"
          filter="url(#convergence-glow)"
        />
      </svg>

      {fragmentedInputs.map((input) => (
        <div
          key={input.label}
          className={`absolute ${input.position} w-28 rounded-xl border border-white/10 bg-black/45 px-3 py-3 backdrop-blur-md sm:w-36 sm:px-4`}
        >
          <p className="text-[9px] font-semibold tracking-[0.16em] text-white/30">
            {input.label}
          </p>

          <p className="mt-1 text-xs font-medium text-white/65 sm:text-sm">
            {input.detail}
          </p>
        </div>
      ))}

      <div className="absolute left-1/2 top-1/2 w-40 -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="text-[9px] font-semibold tracking-[0.2em] text-cyan-300/55">
          OPERATOR
        </p>

        <p className="mt-2 text-sm font-semibold text-white sm:text-base">
          One operational picture
        </p>
      </div>
    </div>
  );
}