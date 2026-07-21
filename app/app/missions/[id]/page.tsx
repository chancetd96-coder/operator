"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  loadMissions,
  saveMissions,
  saveSelectedMissionId,
} from "@/lib/storage";

import type {
  Mission,
  MissionTask,
  TaskStatus,
} from "@/types/mission";

const TASK_STATUSES: TaskStatus[] = [
  "Not Started",
  "In Progress",
  "Blocked",
  "Complete",
];

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

export default function MissionWorkspacePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [mission, setMission] = useState<Mission | null>(
    null,
  );
  const [hydrated, setHydrated] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const missionId = Number(params.id);
    const missions = loadMissions();

    const storedMission =
      missions.find((item) => item.id === missionId) ??
      null;

    // Browser-persisted state is intentionally loaded here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMission(storedMission);
    setHydrated(true);

    if (storedMission) {
      saveSelectedMissionId(storedMission.id);
    }
  }, [params.id]);

  const completedTaskCount = useMemo(() => {
    return (
      mission?.tasks.filter(
        (task) => task.status === "Complete",
      ).length ?? 0
    );
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

    setSaved(false);
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

    setSaved(false);
  }

  function saveMission(): void {
    if (!mission) return;

    const missions = loadMissions();

    const updatedMissions = missions.map((item) =>
      item.id === mission.id ? mission : item,
    );

    saveMissions(updatedMissions);
    saveSelectedMissionId(mission.id);
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2000);
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
            {saved && (
              <span className="text-xs tracking-[0.2em] text-emerald-400">
                SAVED
              </span>
            )}

            <button
              type="button"
              onClick={saveMission}
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/85"
            >
              Save Mission
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 md:py-12">
        <section className="border-b border-white/10 pb-10">
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

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.5fr_0.8fr]">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs tracking-[0.25em] text-white/40">
                  EXECUTION
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  Tasks
                </h2>
              </div>

              <span className="text-sm text-white/40">
                {mission.tasks.length} tasks
              </span>
            </div>

            <div className="space-y-4">
              {mission.tasks.map((task) => (
                <article
                  key={task.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <input
                        value={task.title}
                        onChange={(event) =>
                          updateTask(task.id, {
                            title: event.target.value,
                          })
                        }
                        className="w-full bg-transparent text-lg font-semibold outline-none"
                      />

                      <textarea
                        value={task.description}
                        onChange={(event) =>
                          updateTask(task.id, {
                            description:
                              event.target.value,
                          })
                        }
                        rows={2}
                        placeholder="Add task details..."
                        className="mt-2 w-full resize-none bg-transparent text-sm leading-6 text-white/45 outline-none placeholder:text-white/20"
                      />
                    </div>

                    <select
                      value={task.status}
                      onChange={(event) =>
                        updateTask(task.id, {
                          status: event.target
                            .value as TaskStatus,
                        })
                      }
                      className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none"
                    >
                      {TASK_STATUSES.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <label className="text-xs text-white/40">
                      OWNER
                      <input
                        value={task.owner}
                        onChange={(event) =>
                          updateTask(task.id, {
                            owner: event.target.value,
                          })
                        }
                        className="mt-2 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none"
                      />
                    </label>

                    <label className="text-xs text-white/40">
                      DUE DATE
                      <input
                        type="date"
                        value={task.dueDate ?? ""}
                        onChange={(event) =>
                          updateTask(task.id, {
                            dueDate:
                              event.target.value ||
                              null,
                          })
                        }
                        className="mt-2 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none"
                      />
                    </label>

                    <label className="text-xs text-white/40">
                      PROGRESS: {task.progress}%
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={task.progress}
                        onChange={(event) => {
                          const progress = Number(
                            event.target.value,
                          );

                          updateTask(task.id, {
                            progress,
                            status:
                              progress === 100
                                ? "Complete"
                                : progress > 0
                                  ? "In Progress"
                                  : "Not Started",
                          });
                        }}
                        className="mt-4 w-full"
                      />
                    </label>
                  </div>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-cyan-300 transition-all"
                      style={{
                        width: `${task.progress}%`,
                      }}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>

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
      </div>
    </main>
  );
}