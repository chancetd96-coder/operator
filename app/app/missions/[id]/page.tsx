"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import MissionMemoryPanel from "@/components/MissionMemoryPanel";
import MissionTimelinePanel from "@/components/workspace/MissionTimelinePanel";
import MissionOverviewCard from "@/components/workspace/MissionOverviewCard";
import CommanderWorkspace from "@/components/workspace/CommanderWorkspace";
import MissionTaskPanel from "@/components/workspace/MissionTaskPanel";
import { MissionRepository } from "@/lib/repositories/missionRepository";
import { buildMissionTimeline } from "@/lib/timeline/buildMissionTimeline";
import { buildCommanderAssessment } from "@/lib/commander/buildCommanderAssessment";
import { saveSelectedMissionId } from "@/lib/storage";

import WorkspaceTabs, {
  type WorkspaceTab,
} from "@/components/workspace/WorkspaceTabs";

import type {
  Mission,
  MissionTask,
} from "@/lib/types/mission";

function calculateMissionProgress(
  tasks: MissionTask[],
): number {
  if (tasks.length === 0) return 0;

  const totalProgress = tasks.reduce(
    (total, task) => total + task.progress,
    0,
  );

  return Math.round(totalProgress / tasks.length);
}

async function persistMission(
  currentMission: Mission,
): Promise<void> {
  await MissionRepository.save(currentMission);

  saveSelectedMissionId(currentMission.id);

  window.dispatchEvent(
    new Event("operator:missions-updated"),
  );
}

export default function MissionWorkspacePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
const [activeTab, setActiveTab] =
  useState<WorkspaceTab>("overview");
  const [mission, setMission] = useState<Mission | null>(
    null,
  );
  const [saveStatus, setSaveStatus] = useState<
  "idle" | "saving" | "saved" | "error"
>("idle");

const [lastSavedAt, setLastSavedAt] =
  useState<Date | null>(null);

const hasLoadedMission = useRef(false);
const saveQueueRef = useRef<Promise<void>>(
  Promise.resolve(),
);
  const [hydrated, setHydrated] = useState(false);

useEffect(() => {
  let active = true;

  async function hydrateMission() {
    const missionId = params.id;

    if (!missionId) {
      if (active) {
        setMission(null);
        setHydrated(true);
      }

      return;
    }

    const storedMission =
      await MissionRepository.getById(missionId);

    if (!active) return;

    setMission(storedMission);

    if (storedMission) {
      hasLoadedMission.current = true;
      saveSelectedMissionId(storedMission.id);
    }

    setHydrated(true);
  }

  void hydrateMission();

  return () => {
    active = false;
  };
}, [params.id]);

useEffect(() => {
  if (!mission || !hasLoadedMission.current) {
    return;
  }

  let active = true;

  setSaveStatus("saving");

  const missionSnapshot = mission;

  const timeout = window.setTimeout(() => {
    const saveOperation = saveQueueRef.current
      .catch(() => undefined)
      .then(() => persistMission(missionSnapshot));

    saveQueueRef.current = saveOperation;

    void saveOperation
      .then(() => {
        if (!active) return;

        setSaveStatus("saved");
        setLastSavedAt(new Date());
      })
      .catch((error) => {
        console.error("Mission auto-save failed:", error);

        if (!active) return;

        setSaveStatus("error");
      });
  }, 650);

  return () => {
    active = false;
    window.clearTimeout(timeout);
  };
}, [mission]);


  const completedTaskCount = useMemo(() => {
    return (
      mission?.tasks.filter(
        (task) => task.status === "Complete",
      ).length ?? 0
    );
  }, [mission]);

  const timelineEvents = useMemo(() => {
    if (!mission) {
      return [];
    }

    return buildMissionTimeline(mission);
  }, [mission]);

  function updateMission(
    changes: Partial<Mission>,
  ): void {
    setMission((currentMission) => {
      if (!currentMission) return currentMission;

      return {
        ...currentMission,
        ...changes,
      };
    });

  }

  function updateTask(
    taskId: string,
    changes: Partial<MissionTask>,
  ): void {
    setMission((currentMission) => {
      if (!currentMission) return currentMission;

      const updatedTasks = currentMission.tasks.map(
        (task) => {
          if (task.id !== taskId) return task;

          const updatedTask: MissionTask = {
            ...task,
            ...changes,
          };

          if (changes.status === "Complete") {
            updatedTask.progress = 100;
          }

          if (changes.status === "Not Started") {
            updatedTask.progress = 0;
          }

          if (
            changes.status === "In Progress" &&
            updatedTask.progress === 0
          ) {
            updatedTask.progress = 25;
          }

          return updatedTask;
        },
      );

      return {
        ...currentMission,
        tasks: updatedTasks,
        progress: calculateMissionProgress(updatedTasks),
      };
    });

  }


  function addTask(): void {
    const newTask: MissionTask = {
      id: crypto.randomUUID(),
      title: "New Task",
      description: "",
      status: "Not Started",
      owner: mission?.owner ?? "",
      dueDate: null,
      progress: 0,
      comments: [],
      meetingIds: [],
      blockers: [],
      risks: [],
    };

    setMission((currentMission) => {
      if (!currentMission) {
        return currentMission;
      }

      const updatedTasks = [
        ...currentMission.tasks,
        newTask,
      ];

      return {
        ...currentMission,
        tasks: updatedTasks,
        progress:
          calculateMissionProgress(updatedTasks),
      };
    });
  }

  function deleteTask(taskId: string): void {
    setMission((currentMission) => {
      if (!currentMission) {
        return currentMission;
      }

      const updatedTasks =
        currentMission.tasks.filter(
          (task) => task.id !== taskId,
        );

      return {
        ...currentMission,
        tasks: updatedTasks,
        progress:
          calculateMissionProgress(updatedTasks),
      };
    });
  }

  if (!hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-sm tracking-[0.3em] text-white/40">
          LOADING MISSION
        </p>
      </main>
    );
  }

  if (!mission) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <div className="max-w-lg text-center">
          <p className="text-sm tracking-[0.3em] text-white/40">
            OPERATOR
          </p>

          <h1 className="mt-4 text-3xl font-semibold">
            Mission not found
          </h1>

          <p className="mt-3 text-white/50">
            This mission may have been deleted or belongs
            to another browser.
          </p>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-8 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium transition hover:bg-white/15"
          >
            Return to Mission Control
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-white/[0.03]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-sm text-white/50 transition hover:text-white"
          >
            ← Mission Control
          </button>

<div className="flex items-center gap-3">
  <span
    className={`text-xs tracking-[0.2em] ${
      saveStatus === "error"
        ? "text-red-300"
        : saveStatus === "saving"
          ? "text-cyan-300/70"
          : "text-emerald-300/70"
    }`}
  >
    {saveStatus === "saving" && "SAVING"}

    {saveStatus === "saved" &&
      `SAVED${
        lastSavedAt
          ? ` ${lastSavedAt.toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}`
          : ""
      }`}

    {saveStatus === "error" && "SAVE FAILED"}

    {saveStatus === "idle" && "AUTO-SAVE ACTIVE"}
  </span>

  <button
    type="button"
    onClick={() => {
      try {
        persistMission(mission);
        setSaveStatus("saved");
        setLastSavedAt(new Date());
      } catch (error) {
        console.error(
          "Mission save failed:",
          error,
        );
        setSaveStatus("error");
      }
    }}
    className="rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
  >
    Save now
  </button>
</div>        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 md:py-12">
        <MissionOverviewCard mission={mission} />

        <div className="mt-8">
          <WorkspaceTabs
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {activeTab === "overview" ? (
          <section className="mt-8 border-b border-white/10 pb-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <p className="text-sm tracking-[0.3em] text-cyan-300/70">
                MISSION WORKSPACE
              </p>

              <input
                value={mission.title}
                onChange={(event) =>
                  updateMission({
                    title: event.target.value,
                  })
                }
                className="mt-4 w-full bg-transparent text-4xl font-semibold tracking-tight outline-none placeholder:text-white/20 md:text-6xl"
              />

              <textarea
                value={mission.summary}
                onChange={(event) =>
                  updateMission({
                    summary: event.target.value,
                  })
                }
                rows={3}
                className="mt-5 w-full resize-none bg-transparent text-lg leading-8 text-white/55 outline-none"
                placeholder="Mission summary"
              />
            </div>

            <div className="min-w-64 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs tracking-[0.2em] text-white/40">
                  MISSION PROGRESS
                </span>

                <span className="text-2xl font-semibold">
                  {mission.progress}%
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-white transition-all"
                  style={{
                    width: `${mission.progress}%`,
                  }}
                />
              </div>
              <div className="mt-4 flex justify-between text-xs text-white/40">
                <span>
                  {completedTaskCount} complete
                </span>
                <span>
                  {mission.tasks.length} total
                </span>
              </div>
            </div>
          </div>
          </section>
        ) : null}

        {activeTab === "tasks" ? (
          <div className="mt-8 grid gap-8 xl:grid-cols-[1.5fr_0.8fr]">
          <MissionTaskPanel
            tasks={mission.tasks}
            onAddTask={addTask}
            onDeleteTask={deleteTask}
            onUpdateTask={updateTask}
          />

          <aside className="space-y-6">
            <section className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.04] p-5">
              <p className="text-xs tracking-[0.25em] text-cyan-300/70">
                OPERATOR RECOMMENDATION
              </p>

              <textarea
                value={mission.recommendation}
                onChange={(event) =>
                  updateMission({
                    recommendation:
                      event.target.value,
                  })
                }
                rows={5}
                className="mt-4 w-full resize-none bg-transparent text-sm leading-7 text-white/70 outline-none"
              />
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs tracking-[0.25em] text-white/40">
                MISSION DATA
              </p>

              <div className="mt-5 space-y-4">
                <label className="block text-xs text-white/40">
                  PRIORITY
                  <select
                    value={mission.priority ?? "Normal"}
                    onChange={(event) =>
                      updateMission({
                        priority: event.target
                          .value as Mission["priority"],
                      })
                    }
                    className="mt-2 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none"
                  >
                    <option value="Critical">
                      Critical
                    </option>
                    <option value="High">High</option>
                    <option value="Normal">
                      Normal
                    </option>
                    <option value="Low">Low</option>
                  </select>
                </label>

                <label className="block text-xs text-white/40">
                  OWNER
                  <input
                    value={mission.owner}
                    onChange={(event) =>
                      updateMission({
                        owner: event.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs tracking-[0.25em] text-white/40">
                RISKS
              </p>

              <div className="mt-4 space-y-3">
                {mission.risks.length === 0 && (
                  <p className="text-sm text-white/35">
                    No risks identified.
                  </p>
                )}

                {mission.risks.map((risk) => (
                  <div
                    key={risk.id}
                    className="rounded-xl border border-white/10 bg-black/30 p-4"
                  >
                    <p
                      className={
                        risk.resolved
                          ? "text-sm text-white/30 line-through"
                          : "text-sm text-white/70"
                      }
                    >
                      {risk.title}
                    </p>

                    <label className="mt-3 flex items-center gap-2 text-xs text-white/40">
                      <input
                        type="checkbox"
                        checked={risk.resolved}
                        onChange={(event) => {
                          const updatedRisks =
                            mission.risks.map(
                              (currentRisk) =>
                                currentRisk.id ===
                                risk.id
                                  ? {
                                      ...currentRisk,
                                      resolved:
                                        event.target
                                          .checked,
                                    }
                                  : currentRisk,
                            );

                          updateMission({
                            risks: updatedRisks,
                          });
                        }}
                      />

                      Resolved
                    </label>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs tracking-[0.25em] text-white/40">
                MEETINGS
              </p>

              <div className="mt-4 space-y-3">
                {mission.meetings.length === 0 && (
                  <p className="text-sm text-white/35">
                    No meetings scheduled.
                  </p>
                )}

                {mission.meetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="rounded-xl border border-white/10 bg-black/30 p-4"
                  >
                    <p className="text-sm text-white/70">
                      {meeting.title}
                    </p>

                    <p className="mt-2 text-xs text-white/35">
                      {meeting.date ??
                        "Date not scheduled"}
                      {meeting.time
                        ? ` at ${meeting.time}`
                        : ""}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
          </div>
        ) : null}

        {activeTab === "memory" ? (
          <div className="mt-8">
            <MissionMemoryPanel missionId={mission.id} />
          </div>
        ) : null}

        {activeTab === "timeline" ? (
          <div className="mt-8">
            <MissionTimelinePanel
              events={timelineEvents}
            />
          </div>
        ) : null}

        {activeTab === "documents" ? (
          <section className="mt-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.025] p-10 text-center">
            <p className="text-sm font-medium text-white/65">
              Documents workspace
            </p>

            <p className="mt-2 text-sm text-white/35">
              Mission documents and attachments are coming next.
            </p>
          </section>
        ) : null}

{activeTab === "commander" ? (
  <div className="mt-8">
    <CommanderWorkspace
      assessment={buildCommanderAssessment(mission)}
    />
  </div>
) : null}
      </div>
    </main>
  );
}