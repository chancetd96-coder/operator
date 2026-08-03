"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navigationItems = [
  {
    label: "Mission",
    href: "#mission",
  },
  {
  label: "Execution Gap",
  href: "#execution-gap",
},
  {
    label: "Operator Loop",
    href: "#operator-loop",
  },
  {
    label: "Capabilities",
    href: "#capabilities",
  },
  {
    label: "Roadmap",
    href: "#roadmap",
  },
];

export default function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-5 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold tracking-[0.28em] text-white"
          >
            OPERATOR
          </Link>

          <button
            type="button"
            aria-label={
              menuOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={menuOpen}
            onClick={() =>
              setMenuOpen((current) => !current)
            }
            className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/30 backdrop-blur-xl transition hover:border-cyan-300/35 hover:bg-white/[0.06]"
          >
            <span className="flex w-5 flex-col gap-1.5">
              <span
                className={`h-px w-full bg-white transition-transform duration-300 ${
                  menuOpen
                    ? "translate-y-[3.5px] rotate-45"
                    : ""
                }`}
              />

              <span
                className={`h-px w-full bg-white transition-transform duration-300 ${
                  menuOpen
                    ? "-translate-y-[3.5px] -rotate-45"
                    : ""
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 transition duration-500 ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        />

        <nav
          aria-label="Public navigation"
          className={`absolute inset-y-0 right-0 flex w-full max-w-xl flex-col border-l border-white/10 bg-[#050707] px-8 pb-10 pt-28 shadow-2xl transition-transform duration-500 sm:px-12 ${
            menuOpen
              ? "translate-x-0"
              : "translate-x-full"
          }`}
        >
          <p className="text-[11px] font-semibold tracking-[0.28em] text-cyan-300/65">
            NAVIGATION
          </p>

          <div className="mt-10 space-y-2">
            {navigationItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="group flex items-center justify-between border-b border-white/10 py-5"
              >
                <span className="text-2xl font-medium tracking-tight text-white/75 transition group-hover:text-white sm:text-3xl">
                  {item.label}
                </span>

                <span className="text-xs tabular-nums text-white/25">
                 {String(index + 1).padStart(2, "0")}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-auto border-t border-white/10 pt-8">
            <Link
              href="/mission-control"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between rounded-2xl border border-cyan-300/25 bg-cyan-300/[0.07] px-5 py-4 transition hover:border-cyan-300/45 hover:bg-cyan-300/[0.11]"
            >
              <span>
                <span className="block text-[10px] font-semibold tracking-[0.2em] text-cyan-300/60">
                  PRODUCT
                </span>

                <span className="mt-1 block text-base font-semibold text-white">
                  Launch Mission Control
                </span>
              </span>

              <span className="text-xl text-cyan-200">
                →
              </span>
            </Link>

            <a
              href="mailto:contact@mortaise.ai?subject=Operator%20Briefing"
              className="mt-4 block text-sm text-white/40 transition hover:text-white/70"
            >
              Request a briefing
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}