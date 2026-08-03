"use client";

import { useRouter } from "next/navigation";
import {
  getMissionCount,
  getOverallProgress,
  getHighestPriorityMission,
} from "@/lib/mission-engine";
import CommanderBrief from "@/components/CommanderBrief";
import { useEffect, useState } from "react";
import {
  loadSelectedMissionId,
  saveSelectedMissionId,
} from "@/lib/storage";
import { generateCommanderBrief } from "@/lib/commander";
import { MissionRepository } from "@/lib/repositories/missionRepository";
import type { Mission } from "@/lib/types/mission";

import Panel from "@/components/panel";
import DailyBriefing from "@/components/DailyBriefing";
import MissionInput from "@/components/MissionInput";
export default function Home() {const router = useRouter();
  
 const [mission, setMission] = useState("");
 const [missions, setMissions] = useState<Mission[]>([]);
 const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [hydrated, setHydrated] = useState(false);

useEffect(() => {
  async function hydrate() {
    const cloudMissions = await MissionRepository.getAll();
    const selectedId = loadSelectedMissionId();

    const selected =
      cloudMissions.find((item) => item.id === selectedId) ??
      cloudMissions[0] ??
      null;

    setMissions(cloudMissions);
    setSelectedMission(selected);
    setHydrated(true);
  }

  void hydrate();
}, []);

useEffect(() => {
  if (!hydrated) return;

  saveSelectedMissionId(selectedMission?.id ?? null);
}, [selectedMission, hydrated]);


  async function buildPlan() {
  setLoading(true);
  setError("");

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mission }),
    });

    const data = await res.json();

    if (!res.ok) {
  throw new Error(
    data.details ||
      data.error ||
      "Something went wrong",
  );
}

    const now = new Date().toISOString();

      const newMission: Mission = {
  id: crypto.randomUUID(),
  title: data.plan.title,
        objective:
          data.plan.summary ||
          "Execute the generated mission plan.",
  prompt: mission,
  summary: data.plan.summary,
  assumptions: data.plan.assumptions,
  recommendation: data.plan.recommendation,
  status: "planning",
  priority: data.plan.priority ?? "Normal",
  owner: "Chance",
  progress: 0,

  tasks: data.plan.tasks.map((task: string) => ({
    id: crypto.randomUUID(),
    title: task,
    description: "",
    status: "Not Started",
    progress: 0,
    owner: "Chance",
    dueDate: null,
    scheduledDate: null,
    comments: [],
    risks: [],
    blockers: [],
    meetingIds: [],
  })),

  meetings: data.plan.meetings.map((meeting: string) => ({
    id: crypto.randomUUID(),
    title: meeting,
    date: null,
    time: null,
    notes: "",
    taskIds: [],
  })),

  risks: data.plan.risks.map((risk: string) => ({
    id: crypto.randomUUID(),
    title: risk,
    description: "",
    mitigation: "",
    taskIds: [],
    resolved: false,
  })),

  schedule: data.plan.schedule,
  resources: data.plan.resources,
  successMetrics: data.plan.successMetrics,
        createdAt: now,
        updatedAt: now,
        startedAt: now,
};
await MissionRepository.save(newMission);
const cloudMissions = await MissionRepository.getAll();

setMissions(cloudMissions);

    setSelectedMission(newMission);
    setMission("");
  } catch (error) {
    console.error(error);
    setError("Operator had a problem building your plan.");
  } finally {
    setLoading(false);
  }
}

const missionCount = getMissionCount(missions);
const overallProgress = getOverallProgress(missions);
const priorityMission = getHighestPriorityMission(missions);

const commanderBrief = generateCommanderBrief(missions);

const criticalMissionCount =
  commanderBrief.missionHealth.filter(
    (mission) => mission.status === "Critical",
  ).length;


const activeMission = selectedMission;

if (!hydrated) {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm tracking-[0.3em] text-white/40">
          INITIALIZING OPERATOR
        </p>
      </div>
    </main>
  );
}


  return (

    <main className="min-h-screen bg-black text-white">

      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[320px_1fr]">

        <aside className="border-r border-white/10 bg-white/[0.03] p-5">

          <div className="mb-8">

            <div className="text-sm font-semibold tracking-[0.3em] text-white/50">

              OPERATOR

            </div>

            <h1 className="mt-3 text-2xl font-semibold">Mission Control</h1>

          </div>



         <div className="mb-6 rounded-3xl border border-cyan-300/15 bg-gradient-to-br from-cyan-300/[0.05] to-transparent p-5">
  <p className="text-[11px] font-semibold tracking-[0.18em] text-cyan-300/70">
    ACTIVE MISSIONS
  </p>

  <p className="mt-2 text-4xl font-bold tabular-nums">
    {missions.length}
  </p>
</div>



          <div className="space-y-3">

            {missions.length === 0 && (

              <p className="text-sm text-white/40">

                No missions yet. Build your first mission.

              </p>

            )}



            {missions.map((item) => (

              <button
  key={item.id}
  type="button"
  onClick={() => {
    setSelectedMission(item);
    router.push(`/missions/${item.id}`);
  }}
  className={`group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200 ${
    selectedMission?.id === item.id
      ? "border-cyan-300/30 bg-cyan-300/[0.07] shadow-[0_0_24px_rgba(103,232,249,0.05)]"
      : "border-white/10 bg-white/[0.035] hover:-translate-y-0.5 hover:border-cyan-300/20 hover:bg-white/[0.07]"
  }`}
>
  <div
    className={`pointer-events-none absolute inset-y-0 left-0 w-0.5 bg-cyan-300 transition-opacity ${
      selectedMission?.id === item.id
        ? "opacity-80"
        : "opacity-0 group-hover:opacity-40"
    }`}
  />

  <div className="flex items-start justify-between gap-3">
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-white/90 transition-colors group-hover:text-cyan-100">
        {item.title}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45">
          {item.status}
        </span>

        <span className="text-[11px] font-medium text-white/35">
          {item.priority ?? "Normal"} priority
        </span>
      </div>
    </div>

    <span className="shrink-0 text-sm font-semibold tabular-nums text-white/65">
      {item.progress}%
    </span>
  </div>

  <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
    <div
      className="h-full rounded-full bg-cyan-300/70 transition-all duration-300"
      style={{
        width: `${Math.min(
          100,
          Math.max(0, item.progress),
        )}%`,
      }}
    />
  </div>
</button>

            ))}

          </div>

        </aside>



        <section className="p-6 md:p-10">

          <div className="mx-auto max-w-6xl">

           <div className="mb-8">
  <div className="flex items-center gap-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] text-lg">
      ⌘
    </div>

    <div>
      <p className="text-[11px] font-semibold tracking-[0.28em] text-cyan-300/70">
        OPERATOR
      </p>

      <h1 className="mt-1 text-2xl font-semibold tracking-tight">
        Mission Control
      </h1>
    </div>
  </div>
</div>
<CommanderBrief missions={missions} />
<DailyBriefing
              missionCount={missionCount}
              priorityMission={priorityMission?.title ?? null}
              overallProgress={overallProgress}
              criticalMissionCount={criticalMissionCount}
              blockedTaskCount={commanderBrief.blockedTaskCount}
              activeRiskCount={commanderBrief.activeRiskCount}
              recommendedTask={commanderBrief.recommendedTask?.task.title ?? null}
              executionStatus={commanderBrief.executionStatus}
              nextMeeting={
                commanderBrief.nextMeeting
                  ? {
                      title: commanderBrief.nextMeeting.meeting.title,
                      missionTitle: commanderBrief.nextMeeting.missionTitle,
                      scheduledAt: commanderBrief.nextMeeting.scheduledAt,
                      hasTime: Boolean(commanderBrief.nextMeeting.meeting.time),
                    }
                  : null
              }
            />

<MissionInput
  mission={mission}
  loading={loading}
  onMissionChange={setMission}
  onBuild={buildPlan}
/>


            {error && (

              <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">

                {error}

              </div>

            )}



            {activeMission && (

              <div className="mt-10 space-y-6">

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                    <div>

                      <p className="text-sm text-white/40">ACTIVE MISSION</p>

                      <h3 className="mt-1 text-3xl font-semibold">

                        {activeMission.title}

                      </h3>

                      <p className="mt-2 text-sm text-white/40">

                        Owner: {activeMission.owner}

                      </p>

                    </div>



                    <div className="rounded-xl border border-green-400/30 bg-green-400/10 px-4 py-3 text-green-300">

                      {activeMission.progress}% Complete

                    </div>

                  </div>

                </div>



                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                <Panel
                  title="Tasks"
                  items={activeMission.tasks.map((task) => task.title)}
                />

                <Panel
                  title="Schedule"
                  items={activeMission.schedule}
/>

<Panel
  title="Meetings"
  items={activeMission.meetings.map((meeting) => meeting.title)}
/>

<Panel
  title="Risks / Blockers"
  items={activeMission.risks.map((risk) => risk.title)}
/>
                </div>



                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

                  <h3 className="mb-4 text-2xl font-semibold">

                    Operator Recommendation

                  </h3>

                  <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-white/80">

                    {activeMission.recommendation}

                  </pre>

                </div>

              </div>

            )}

          </div>

        </section>

      </div>

    </main>

  );

}