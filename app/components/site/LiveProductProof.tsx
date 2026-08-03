"use client";

import Link from "next/link";
import { useState } from "react";

type ProductView = {
  id: string;
  label: string;
  route: string;
  description: string;
};

const productViews: ProductView[] = [
  {
    id: "mission-control",
    label: "Mission Control",
    route: "/mission-control",
    description:
      "See missions, priorities, risk, progress, and recommended action in one operational picture.",
  },
  {
    id: "today",
    label: "Today",
    route: "/today",
    description:
      "See the work, meetings, and deadlines that require attention now.",
  },
  {
    id: "focus",
    label: "Focus",
    route: "/focus",
    description:
      "Reduce noise and isolate the highest-leverage action.",
  },
  {
    id: "capture",
    label: "Capture",
    route: "/capture",
    description:
      "Convert operational updates into structured information and execution.",
  },
];

export default function LiveProductProof() {
  const [activeView, setActiveView] = useState<ProductView>(
    productViews[0],
  );

  return (
    <section
      id="product-proof"
      className="relative border-t border-white/10 px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-cyan-300/[0.022] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1fr] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.3em] text-cyan-300/60">
              LIVE PRODUCT
            </p>

            <h2 className="mt-6 text-4xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl">
              The operational picture
              <br />
              is already working.
            </h2>
          </div>

          <div className="max-w-2xl lg:justify-self-end">
            <p className="text-base leading-8 text-white/45 sm:text-lg">
              Explore live Operator environments directly from
              the public experience. Each view is part of the
              working MVP—not a conceptual rendering.
            </p>

            <Link
              href={activeView.route}
              className="mt-7 inline-flex items-center gap-3 text-sm font-semibold text-cyan-200 transition hover:text-white"
            >
              Open {activeView.label}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-6 xl:grid-cols-[0.72fr_1.28fr] xl:gap-10 sm:mt-20">
          <div className="space-y-2">
            {productViews.map((view, index) => {
              const isActive = activeView.id === view.id;

              return (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => setActiveView(view)}
                  className={`w-full rounded-2xl border p-5 text-left transition duration-300 ${
                    isActive
                      ? "border-cyan-300/25 bg-cyan-300/[0.055]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`text-[10px] font-semibold tracking-[0.18em] ${
                        isActive
                          ? "text-cyan-300/65"
                          : "text-white/25"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span>
                      <span
                        className={`block text-lg font-semibold ${
                          isActive
                            ? "text-white"
                            : "text-white/55"
                        }`}
                      >
                        {view.label}
                      </span>

                      <span className="mt-2 block text-sm leading-6 text-white/35">
                        {view.description}
                      </span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#050707] shadow-[0_32px_100px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex gap-2">
                <span className="h-2 w-2 rounded-full bg-white/15" />
                <span className="h-2 w-2 rounded-full bg-white/10" />
                <span className="h-2 w-2 rounded-full bg-white/[0.06]" />
              </div>

              <p className="text-[9px] font-semibold tracking-[0.2em] text-white/25">
                OPERATOR / {activeView.label.toUpperCase()}
              </p>

              <span className="text-[9px] text-cyan-300/45">
                LIVE
              </span>
            </div>

            <div className="relative h-[620px] overflow-hidden bg-black">
              <iframe
                key={activeView.route}
                src={activeView.route}
                title={`${activeView.label} live preview`}
                loading="lazy"
                tabIndex={-1}
                className="h-full w-full border-0"
              />

              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.03]" />
            </div>
          </div>
        </div>

        <p className="mt-5 text-xs leading-6 text-white/25">
          Live previews may reflect the current demonstration
          data stored in Operator.
        </p>
      </div>
    </section>
  );
}