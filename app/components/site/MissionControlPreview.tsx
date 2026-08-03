
"use client";

import { useState } from "react";

type PreviewView =
  | "commander"
  | "timeline"
  | "capture"
  | "workspace";

const previewViews: {
  id: PreviewView;
  number: string;
  label: string;
  description: string;
}[] = [
  {
    id: "commander",
    number: "01",
    label: "Commander",
    description:
      "Identifies what requires command attention and recommends the next action.",
  },
  {
    id: "timeline",
    number: "02",
    label: "Timeline",
    description:
      "Synchronizes scheduled work, deadlines, meetings, and execution windows.",
  },
  {
    id: "capture",
    number: "03",
    label: "Capture",
    description:
      "Turns unstructured operational updates into structured execution.",
  },
  {
    id: "workspace",
    number: "04",
    label: "Workspace",
    description:
      "Maintains mission context across tasks, risks, meetings, memory, and documents.",
  },
];

function CommanderPreview() {
  return (
    <div className="space-y-4">
      <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
        {[
          ["MISSIONS", "4"],
          ["BLOCKED", "1"],
          ["RISKS", "3"],
          ["PROGRESS", "68%"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="bg-[#070a0a] px-4 py-4"
          >
            <p className="text-[9px] font-semibold tracking-[0.16em] text-white/28">
              {label}
            </p>

            <p className="mt-2 text-xl font-semibold tabular-nums text-white/85">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.035] p-5">
          <p className="text-[9px] font-semibold tracking-[0.18em] text-cyan-300/60">
            RECOMMENDED NEXT ACTION
          </p>

          <p className="mt-3 text-lg font-semibold">
            Confirm transportation support
          </p>

          <p className="mt-2 text-sm leading-6 text-white/40">
            Investor demonstration mission
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {[
              "Active blocker",
              "High priority",
              "Due tomorrow",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.05] px-3 py-1 text-[10px] text-cyan-100/70"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <p className="text-[9px] font-semibold tracking-[0.18em] text-white/30">
            MISSION HEALTH
          </p>

          <div className="mt-5 space-y-4">
            {[
              ["Investor Demo", "Critical", "78%"],
              ["Funding Package", "At Risk", "54%"],
              ["SkillBridge", "Healthy", "82%"],
            ].map(([mission, status, progress]) => (
              <div key={mission}>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-white/55">
                    {mission}
                  </span>

                  <span className="text-[10px] text-white/28">
                    {status}
                  </span>
                </div>

                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-cyan-300/65"
                    style={{ width: progress }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelinePreview() {
  const events = [
    {
      day: "TODAY",
      title: "Finalize demo narrative",
      type: "Task",
      position: "18%",
    },
    {
      day: "TOMORROW",
      title: "Technical review",
      type: "Meeting",
      position: "44%",
    },
    {
      day: "FRIDAY",
      title: "Investor rehearsal",
      type: "Deadline",
      position: "70%",
    },
    {
      day: "AUG 17",
      title: "Investor demonstration",
      type: "Decision",
      position: "92%",
    },
  ];

  return (
    <div className="relative min-h-[340px] overflow-hidden rounded-2xl border border-white/10 bg-black/25 p-5 sm:p-7">
      <div className="absolute bottom-16 left-8 right-8 h-px bg-white/10" />

      <div className="absolute bottom-16 left-8 right-8 h-px origin-left scale-x-[0.72] bg-cyan-300/60 shadow-[0_0_18px_rgba(103,232,249,0.2)]" />

      <div className="grid min-h-[260px] grid-cols-2 gap-4 sm:grid-cols-4">
        {events.map((event, index) => (
          <div
            key={event.title}
            className={`relative flex ${
              index % 2 === 0
                ? "items-start"
                : "items-center"
            }`}
          >
            <article className="w-full rounded-xl border border-white/10 bg-white/[0.035] p-4">
              <p className="text-[9px] font-semibold tracking-[0.16em] text-cyan-300/55">
                {event.day}
              </p>

              <p className="mt-2 text-sm font-medium leading-5 text-white/75">
                {event.title}
              </p>

              <p className="mt-3 text-[10px] text-white/30">
                {event.type}
              </p>
            </article>

            <div
              className="absolute bottom-[-3.05rem] left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border border-cyan-200/50 bg-[#050707]"
              style={{
                opacity:
                  Number.parseInt(event.position) <= 72
                    ? 1
                    : 0.5,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function CapturePreview() {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
        <p className="text-[9px] font-semibold tracking-[0.18em] text-white/30">
          OPERATIONAL UPDATE
        </p>

        <div className="mt-4 min-h-44 rounded-xl border border-white/10 bg-white/[0.025] p-4">
          <p className="text-sm leading-7 text-white/65">
            Logistics cannot confirm transportation until
            Friday. Add this as a blocker to the investor demo
            mission and follow up Monday.
          </p>

          <div className="mt-8 flex items-center justify-between">
            <span className="text-[10px] text-white/25">
              Natural language capture
            </span>

            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-3 py-1 text-[10px] text-cyan-100/70">
              PROCESS
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.025] p-5">
        <p className="text-[9px] font-semibold tracking-[0.18em] text-cyan-300/55">
          OPERATOR INTERPRETATION
        </p>

        <div className="mt-4 space-y-3">
          {[
            ["MISSION", "Investor demonstration"],
            ["TYPE", "Active blocker"],
            ["OWNER", "Logistics"],
            ["FOLLOW-UP", "Monday"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3"
            >
              <span className="text-[9px] font-semibold tracking-[0.14em] text-white/28">
                {label}
              </span>

              <span className="text-xs text-white/65">
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-3">
          <div className="flex-1 rounded-full border border-cyan-200/30 bg-cyan-200 px-4 py-2 text-center text-xs font-semibold text-black">
            Approve
          </div>

          <div className="flex-1 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-center text-xs text-white/45">
            Edit
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkspacePreview() {
  const tasks = [
    {
      title: "Finalize landing experience",
      status: "In Progress",
      progress: 72,
    },
    {
      title: "Rehearse investor demonstration",
      status: "Not Started",
      progress: 0,
    },
    {
      title: "Resolve transportation support",
      status: "Blocked",
      progress: 35,
    },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[0.68fr_1.32fr]">
      <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
        <p className="text-[9px] font-semibold tracking-[0.18em] text-white/28">
          MISSION WORKSPACE
        </p>

        <div className="mt-4 space-y-2">
          {[
            "Overview",
            "Tasks",
            "Timeline",
            "Memory",
            "Documents",
            "Commander",
          ].map((item, index) => (
            <div
              key={item}
              className={`rounded-xl border px-4 py-3 text-xs ${
                index === 1
                  ? "border-cyan-300/25 bg-cyan-300/[0.06] text-cyan-100"
                  : "border-transparent text-white/35"
              }`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.title}
            className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white/75">
                  {task.title}
                </p>

                <p className="mt-2 text-[10px] text-white/30">
                  {task.status}
                </p>
              </div>

              <span className="text-sm font-semibold tabular-nums text-white/45">
                {task.progress}%
              </span>
            </div>

            <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full ${
                  task.status === "Blocked"
                    ? "bg-red-300/65"
                    : "bg-cyan-300/65"
                }`}
                style={{
                  width: `${task.progress}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewContent({
  view,
}: {
  view: PreviewView;
}) {
  switch (view) {
    case "timeline":
      return <TimelinePreview />;

    case "capture":
      return <CapturePreview />;

    case "workspace":
      return <WorkspacePreview />;

    case "commander":
      return <CommanderPreview />;
  }
}

export default function MissionControlPreview() {
  const [activeView, setActiveView] =
    useState<PreviewView>("commander");

  return (
    <div className="grid gap-8 xl:grid-cols-[0.72fr_1.28fr] xl:gap-12">
      <div>
        <div className="space-y-2">
          {previewViews.map((view) => {
            const isActive = activeView === view.id;

            return (
              <button
                key={view.id}
                type="button"
                onClick={() => setActiveView(view.id)}
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
                    {view.number}
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
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#050707] shadow-[0_32px_100px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex gap-2">
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/10" />
            <span className="h-2 w-2 rounded-full bg-white/[0.06]" />
          </div>

          <p className="text-[9px] font-semibold tracking-[0.2em] text-white/25">
            OPERATOR / MISSION CONTROL
          </p>

          <span className="text-[9px] text-cyan-300/45">
            LIVE
          </span>
        </div>

        <div className="min-h-[470px] p-4 sm:p-6">
          <div
            key={activeView}
            className="animate-[preview-fade_350ms_ease-out]"
          >
            <PreviewContent view={activeView} />
          </div>
        </div>
      </div>
    </div>
  );
}