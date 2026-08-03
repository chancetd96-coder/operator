import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <section className="mx-auto w-full max-w-5xl">
        <p className="text-xs font-semibold tracking-[0.32em] text-cyan-300/70">
          OPERATOR
        </p>

        <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:text-8xl">
          From intent
          <br />
          to execution.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-white/50">
          Operator is the AI Chief of Staff for mission
          execution, continuously synchronizing missions,
          tasks, meetings, risks, timelines, and decisions
          into one operational picture.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/mission-control"
            className="rounded-full border border-cyan-300/30 bg-cyan-300 px-6 py-3 text-sm font-semibold text-black transition hover:bg-cyan-200"
          >
            Launch Mission Control
          </Link>

          <a
            href="mailto:contact@mortaise.ai?subject=Operator%20Demo"
            className="rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white/75 transition hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
          >
            Request a Briefing
          </a>
        </div>
      </section>
    </main>
  );
}