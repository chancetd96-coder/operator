import Link from "next/link";

import OperatorHeroVisual from "@/components/site/OperatorHeroVisual";
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

      <div id="operator-loop" />
      <div id="capabilities" />
      <div id="roadmap" />
    </main>
  );
}