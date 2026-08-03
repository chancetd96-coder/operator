import Link from "next/link";

import MissionControlPreview from "@/components/site/MissionControlPreview";
import OperatorLoopVisual from "@/components/site/OperatorLoopVisual";
import OperatorHeroVisual from "@/components/site/OperatorHeroVisual";
import OrganizationScale from "@/components/site/OrganizationScale";
import WhyOperatorExists from "@/components/site/WhyOperatorExists";
import HumanCommand from "@/components/site/HumanCommand";
import LiveProductProof from "@/components/site/LiveProductProof";
import Reveal from "@/components/site/Reveal";
import OperationalExperience from "@/components/site/OperationalExperience";
import BuiltForOperations from "@/components/operator/BuiltForOperations";
import OperationalPictureVisual from "@/components/site/OperationalPictureVisual";
import PublicHeader from "@/components/site/PublicHeader";

export default function LandingPage() {
  return (
    <main className="overflow-hidden bg-[#030505] text-white">
      <PublicHeader />

      <section
        id="mission"
        className="relative flex min-h-screen items-center px-5 pb-12 pt-28 sm:px-8 lg:px-12"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-15rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-cyan-300/[0.045] blur-[130px]" />

          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl">
          <div className="max-w-5xl">
            <p className="text-[11px] font-semibold tracking-[0.34em] text-cyan-300/65">
              AI CHIEF OF STAFF
            </p>

            <h1 className="mt-6 max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[-0.055em] sm:text-7xl lg:text-[7.5rem]">
              From intent
              <br />
              to execution.
            </h1>

            <div className="mt-8 flex max-w-4xl flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <p className="max-w-2xl text-base leading-7 text-white/48 sm:text-lg sm:leading-8">
                Operator continuously synchronizes missions,
                people, tasks, meetings, risks, timelines, and
                decisions into one operational picture.
              </p>

              <div className="flex shrink-0 flex-wrap gap-3">
                <Link
                  href="/mission-control"
                  className="rounded-full border border-cyan-200 bg-cyan-200 px-6 py-3 text-sm font-semibold text-black transition hover:border-white hover:bg-white"
                >
                  Launch Mission Control
                </Link>

                <a
                  href="mailto:contact@mortaise.ai?subject=Operator%20Briefing"
                  className="rounded-full border border-white/15 bg-white/[0.035] px-6 py-3 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:bg-white/[0.075] hover:text-white"
                >
                  Request a briefing
                </a>
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-0">
            <OperatorHeroVisual />
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/25">
            <span>Mission execution system</span>
            <span className="hidden sm:block">
              Scroll to enter the operational picture
            </span>
          </div>
        </div>
      </section>

      <section
  id="execution-gap"
  className="relative border-t border-white/10 px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
>
  <div className="pointer-events-none absolute inset-0">
    <div className="absolute left-0 top-1/3 h-96 w-96 rounded-full bg-cyan-300/[0.025] blur-[110px]" />
  </div>

  <div className="relative mx-auto max-w-7xl">
    <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
      <div className="max-w-xl">
        <p className="text-[11px] font-semibold tracking-[0.3em] text-cyan-300/60">
          THE EXECUTION GAP
        </p>

        <h2 className="mt-6 text-4xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl">
          Information is everywhere.
          <br />
          Execution is not.
        </h2>

        <p className="mt-7 text-base leading-8 text-white/45 sm:text-lg">
          Missions are managed across email, calendars,
          documents, spreadsheets, chats, and briefings.
          Each system contains part of the truth. None of
          them understands the operation as a whole.
        </p>

        <div className="mt-10 border-l border-cyan-300/30 pl-5">
          <p className="text-lg leading-8 text-white/75">
            Operator turns fragmented awareness into one
            continuously updated operational picture.
          </p>
        </div>
      </div>

      <OperationalPictureVisual />
    </div>
  </div>
</section>
<Reveal delay={80}>
  <WhyOperatorExists />
</Reveal>
<Reveal delay={140}>
  <HumanCommand />
</Reveal>
      <section
  id="operator-loop"
  className="relative border-t border-white/10 px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
>
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute right-[-12rem] top-1/4 h-[34rem] w-[34rem] rounded-full bg-cyan-300/[0.025] blur-[130px]" />
  </div>

  <div className="relative mx-auto max-w-7xl">
    <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
      <div className="lg:sticky lg:top-32 lg:self-start">
        <p className="text-[11px] font-semibold tracking-[0.3em] text-cyan-300/60">
          THE OPERATOR LOOP
        </p>

        <h2 className="mt-6 text-4xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl">
          Execution is not a sequence.
          <br />
          It is a continuous loop.
        </h2>

        <p className="mt-7 max-w-xl text-base leading-8 text-white/45 sm:text-lg">
          Operator maintains continuity from the moment intent
          is issued through planning, synchronization,
          execution, decision, and organizational learning.
        </p>

        <div className="mt-10 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.035] p-5">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-cyan-300/60">
            HUMAN IN COMMAND
          </p>

          <p className="mt-3 text-sm leading-6 text-white/55">
            Operator continuously monitors execution and
            recommends action. Leaders retain authority,
            judgment, and control.
          </p>
        </div>
      </div>

      <OperatorLoopVisual />
    </div>
  </div>
</section>
<section
  id="capabilities"
  className="relative border-t border-white/10 px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
>
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-cyan-300/[0.018] blur-[130px]" />
  </div>

  <div className="relative mx-auto max-w-7xl">
    <div className="grid gap-8 lg:grid-cols-[0.65fr_1fr] lg:items-end">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.3em] text-cyan-300/60">
          OPERATIONAL CAPABILITIES
        </p>

        <h2 className="mt-6 text-4xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl">
          One system.
          <br />
          Six reinforcing capabilities.
        </h2>
      </div>

      <p className="max-w-2xl text-base leading-8 text-white/45 sm:text-lg lg:justify-self-end">
        Operator is designed as a connected operating system.
        Each capability reduces cognitive load, strengthens
        the operational picture, and improves execution.
      </p>
    </div>

    <div className="mt-14 sm:mt-20">
      
    </div>
  </div>
</section>
<Reveal>
  <BuiltForOperations />
</Reveal>
<Reveal>
  <OperationalExperience />
</Reveal>
<section
  id="product"
  className="relative border-t border-white/10 px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
>
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute right-[-10rem] top-0 h-[38rem] w-[38rem] rounded-full bg-cyan-300/[0.025] blur-[140px]" />
  </div>

  <div className="relative mx-auto max-w-7xl">
    <div className="grid gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-end">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.3em] text-cyan-300/60">
          MISSION CONTROL
        </p>

        <h2 className="mt-6 text-4xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl">
          One operational picture.
          <br />
          One next action.
        </h2>
      </div>

      <div className="max-w-2xl lg:justify-self-end">
        <p className="text-base leading-8 text-white/45 sm:text-lg">
          Every mission, decision, meeting, dependency,
          risk, deadline, and task is synchronized into one
          command environment.
        </p>

        <Link
          href="/mission-control"
          className="mt-7 inline-flex items-center gap-3 text-sm font-semibold text-cyan-200 transition hover:text-white"
        >
          Launch the live product
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>

    <div className="mt-14 sm:mt-20">
      <MissionControlPreview />
    </div>
  </div>
  <Reveal>
  <LiveProductProof />
  </Reveal>
</section>
      <section
  id="scale"
  className="relative border-t border-white/10 px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
>
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute left-[-10rem] top-1/4 h-[34rem] w-[34rem] rounded-full bg-cyan-300/[0.02] blur-[130px]" />
  </div>

  <div className="relative mx-auto max-w-7xl">
    <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.3em] text-cyan-300/60">
          DESIGNED TO SCALE
        </p>

        <h2 className="mt-6 text-4xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl">
          One operational picture
          <br />
          at every echelon.
        </h2>

        <p className="mt-7 max-w-xl text-base leading-8 text-white/45 sm:text-lg">
          Operator begins as an execution system for an
          individual mission owner. As organizations adopt it,
          missions, risks, timelines, and decisions can roll
          upward while each team retains ownership of execution.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {[
            {
              title: "Mission ownership",
              description:
                "Execution stays with the team closest to the work.",
            },
            {
              title: "Automatic roll-up",
              description:
                "Leadership receives the operational picture without rebuilding status manually.",
            },
            {
              title: "Human command",
              description:
                "Operator recommends. People retain authority and decide.",
            },
          ].map((principle) => (
            <article
              key={principle.title}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
            >
              <h3 className="text-sm font-semibold text-white/80">
                {principle.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/40">
                {principle.description}
              </p>
            </article>
          ))}
        </div>
      </div>

      <OrganizationScale />
    </div>
  </div>
</section>

<section
  id="why-operator"
  className="relative border-t border-white/10 px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
>
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute right-[-12rem] top-1/3 h-[34rem] w-[34rem] rounded-full bg-cyan-300/[0.018] blur-[130px]" />
  </div>

  <div className="relative mx-auto max-w-7xl">
    <div className="max-w-4xl">
      <p className="text-[11px] font-semibold tracking-[0.3em] text-cyan-300/60">
        WHY OPERATOR
      </p>

      <h2 className="mt-6 text-4xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl">
        Most software helps you manage work.
        <br />
        Operator helps you execute it.
      </h2>
    </div>

    <div className="mt-14 overflow-hidden rounded-3xl border border-white/10 sm:mt-20">
      <div className="grid grid-cols-2 border-b border-white/10 bg-white/[0.025]">
        <div className="px-5 py-4 sm:px-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
            Traditional software
          </p>
        </div>

        <div className="border-l border-white/10 bg-cyan-300/[0.025] px-5 py-4 sm:px-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300/65">
            Operator
          </p>
        </div>
      </div>

      {[
        ["Stores information", "Maintains execution"],
        ["Shows dashboards", "Recommends action"],
        ["Tracks tasks", "Synchronizes missions"],
        ["Creates static plans", "Maintains a living operational picture"],
        ["Reports progress", "Drives progress"],
      ].map(([traditional, operator]) => (
        <div
          key={traditional}
          className="grid grid-cols-2 border-b border-white/10 last:border-b-0"
        >
          <div className="flex min-h-24 items-center bg-white/[0.012] px-5 py-5 sm:px-7">
            <p className="text-base leading-7 text-white/35 sm:text-lg">
              {traditional}
            </p>
          </div>

          <div className="flex min-h-24 items-center border-l border-white/10 bg-cyan-300/[0.018] px-5 py-5 sm:px-7">
            <p className="text-base font-medium leading-7 text-white/82 sm:text-lg">
              {operator}
            </p>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-20 grid gap-8 border-t border-cyan-300/20 pt-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
      <h3 className="text-4xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl">
        Execution never
        <br />
        stands still.
      </h3>

      <div className="max-w-2xl lg:justify-self-end">
        <p className="text-base leading-8 text-white/48 sm:text-lg">
          Operator continuously re-evaluates missions,
          priorities, meetings, dependencies, risks, and
          recommendations as new information arrives.
        </p>

        <p className="mt-6 text-sm leading-7 text-white/30">
          The operational picture changes with reality—not at
          the next status meeting.
        </p>
      </div>
    </div>
  </div>
</section>

<section
  id="roadmap"
  className="relative border-t border-white/10 px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
>
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-cyan-300/[0.02] blur-[140px]" />
  </div>

  <div className="relative mx-auto max-w-7xl">

    <div className="max-w-4xl">
      <p className="text-[11px] font-semibold tracking-[0.3em] text-cyan-300/60">
        PRODUCT VISION
      </p>

      <h2 className="mt-6 text-4xl font-semibold tracking-[-0.04em] leading-[0.98] sm:text-6xl">
        Building the operating system
        <br />
        for execution.
      </h2>

      <p className="mt-7 max-w-2xl text-lg leading-8 text-white/45">
        Operator is intentionally starting with execution.
        As the platform matures, every new capability builds
        on the same operational picture instead of creating
        another disconnected workflow.
      </p>
    </div>

    <div className="mt-20">

      <div className="relative">

        <div className="absolute left-0 right-0 top-7 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />

        <div className="grid gap-10 lg:grid-cols-5">

          {[
            {
              title: "Mission Control",
              status: "Today",
              body:
                "Execution, priorities, risks, meetings and timelines.",
            },
            {
              title: "Collaborative Teams",
              status: "Next",
              body:
                "Shared workspaces with synchronized execution.",
            },
            {
              title: "Command Roll-up",
              status: "Future",
              body:
                "Operational awareness across organizations.",
            },
            {
              title: "AI Coordination",
              status: "Future",
              body:
                "Continuous recommendations as missions evolve.",
            },
            {
              title: "Enterprise Operations",
              status: "Vision",
              body:
                "A common operating picture spanning entire organizations.",
            },
          ].map((step) => (
            <article
              key={step.title}
              className="relative"
            >
              <div className="mb-5 flex justify-center lg:justify-start">
                <div className="h-4 w-4 rounded-full border border-cyan-300/50 bg-[#050707] shadow-[0_0_18px_rgba(103,232,249,.35)]">
                  <div className="m-[3px] h-2 w-2 rounded-full bg-cyan-200" />
                </div>
              </div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300/55">
                {step.status}
              </p>

              <h3 className="mt-3 text-xl font-semibold">
                {step.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/40">
                {step.body}
              </p>
            </article>
          ))}

        </div>

      </div>

    </div>

  </div>
</section>
<section className="relative border-t border-white/10 px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/[0.035] blur-[140px]" />
  </div>

  <div className="relative mx-auto max-w-7xl">
    <div className="overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-cyan-300/[0.035] p-7 sm:p-10 lg:p-14">
      <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-4xl">
          <p className="text-[11px] font-semibold tracking-[0.3em] text-cyan-300/65">
            ENTER THE OPERATIONAL PICTURE
          </p>

          <h2 className="mt-6 text-4xl font-semibold leading-[0.96] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            Move from awareness
            <br />
            to action.
          </h2>

          <p className="mt-7 max-w-2xl text-base leading-8 text-white/48 sm:text-lg">
            Experience how Operator turns missions, tasks,
            meetings, risks, timelines, and decisions into one
            synchronized execution environment.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Link
            href="/mission-control"
            className="inline-flex items-center justify-center gap-3 rounded-full border border-cyan-200 bg-cyan-200 px-7 py-3.5 text-sm font-semibold text-black transition hover:border-white hover:bg-white"
          >
            Launch Mission Control
            <span aria-hidden="true">→</span>
          </Link>

          <a
            href="mailto:contact@mortaise.ai?subject=Operator%20Briefing"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.035] px-7 py-3.5 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:bg-white/[0.075] hover:text-white"
          >
            Request a briefing
          </a>
        </div>
      </div>

      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
        {[
          {
            label: "CLARITY",
            value: "Know what changed.",
          },
          {
            label: "PRIORITY",
            value: "Know what matters.",
          },
          {
            label: "EXECUTION",
            value: "Know what happens next.",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-[#050808] px-5 py-5"
          >
            <p className="text-[9px] font-semibold tracking-[0.18em] text-cyan-300/55">
              {item.label}
            </p>

            <p className="mt-2 text-sm font-medium text-white/68">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

<footer className="border-t border-white/10 px-5 py-10 sm:px-8 lg:px-12">
  <div className="mx-auto max-w-7xl">
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.6fr_0.6fr]">
      <div>
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.28em] text-white"
        >
          OPERATOR
        </Link>

        <p className="mt-4 max-w-md text-sm leading-7 text-white/35">
          AI Chief of Staff for mission execution. Built to
          reduce cognitive load, strengthen the operational
          picture, and improve execution.
        </p>

        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/20">
          A Mortaise product
        </p>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
          Product
        </p>

        <div className="mt-4 space-y-3 text-sm">
          <Link
            href="/mission-control"
            className="block text-white/45 transition hover:text-white"
          >
            Mission Control
          </Link>

          <Link
            href="/today"
            className="block text-white/45 transition hover:text-white"
          >
            Today
          </Link>

          <Link
            href="/focus"
            className="block text-white/45 transition hover:text-white"
          >
            Focus
          </Link>

          <Link
            href="/capture"
            className="block text-white/45 transition hover:text-white"
          >
            Capture
          </Link>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
          Company
        </p>

        <div className="mt-4 space-y-3 text-sm">
          <a
            href="#mission"
            className="block text-white/45 transition hover:text-white"
          >
            Mission
          </a>

          <a
            href="#why-operator"
            className="block text-white/45 transition hover:text-white"
          >
            Why Operator
          </a>

          <a
            href="#roadmap"
            className="block text-white/45 transition hover:text-white"
          >
            Product Vision
          </a>

          <a
            href="mailto:contact@mortaise.ai?subject=Operator%20Inquiry"
            className="block text-white/45 transition hover:text-white"
          >
            Contact
          </a>
        </div>
      </div>
    </div>

    <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-[10px] uppercase tracking-[0.16em] text-white/20 sm:flex-row sm:items-center sm:justify-between">
      <p>
        © 2026 Mortaise Investments LLC
      </p>

      <p>Human command. Machine-enabled clarity.</p>
    </div>
  </div>
</footer>
    </main>
  );
}