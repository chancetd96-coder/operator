"use client";

import { useRouter } from "next/navigation";
import {
  getMissionCount,
  getOverallProgress,
  getHighestPriorityMission,
  getCriticalMissions,
} from "@/lib/mission-engine";
import CommanderBrief from "@/components/CommanderBrief";
import { useEffect, useState } from "react";
import {
  loadMissions,
  loadSelectedMissionId,
  saveMissions,
  saveSelectedMissionId,
} from "@/lib/storage";


import type { Mission } from "@/types/mission";

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
  const storedMissions = loadMissions();
  const selectedId = loadSelectedMissionId();

  const selected =
    storedMissions.find((item) => item.id === selectedId) ??
    storedMissions[0] ??
    null;

  // This effect intentionally hydrates browser-only persisted state.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setMissions(storedMissions);
  setSelectedMission(selected);
  setHydrated(true);
}, []);

useEffect(() => {
  if (!hydrated) return;

  saveMissions(missions);
}, [missions, hydrated]);

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

    const newMission: Mission = {
  id: Date.now(),
  title: data.plan.title,
  prompt: mission,
  summary: data.plan.summary,
  assumptions: data.plan.assumptions,
  recommendation: data.plan.recommendation,
  status: "Built",
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
};

    setMissions((currentMissions) => [
      newMission,
      ...currentMissions,
    ]);

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
const criticalMissionCount = getCriticalMissions(missions).length;

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



          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">

            <p className="text-xs text-white/40">ACTIVE MISSIONS</p>

            <p className="mt-2 text-3xl font-semibold">{missions.length}</p>

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

                onClick={() => {
                  setSelectedMission(item);
                  router.push(`/missions/${item.id}`);
                 }}

                className={`w-full rounded-xl border p-4 text-left transition ${
                  selectedMission?.id === item.id
                    ? "border-white/30 bg-white/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                 }`}

              >

                <div className="text-sm font-semibold">{item.title}</div>

                <div className="mt-2 flex items-center justify-between text-xs text-white/40">
                  <div className="flex items-center gap-2">
                    <span>{item.status}</span>
                    <span>•</span>
                    <span>{item.priority ?? "Normal"}</span>
                  </div>

                  <span>{item.progress}%</span>
                </div>

              </button>

            ))}

          </div>

        </aside>



        <section className="p-6 md:p-10">

          <div className="mx-auto max-w-6xl">

            <div className="mb-8">

              <p className="text-sm tracking-[0.3em] text-white/40">

                AI CHIEF OF STAFF

              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">

                What mission are we executing?

              </h2>

              <p className="mt-4 max-w-2xl text-white/50">

                Operator turns goals into a live project dashboard: tasks,

                schedule, meetings, risks, and next actions.

              </p>

            </div>
<CommanderBrief missions={missions} />
<DailyBriefing
  missionCount={missionCount}
  priorityMission={priorityMission?.title ?? null}
  overallProgress={overallProgress}
  criticalMissionCount={criticalMissionCount}
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