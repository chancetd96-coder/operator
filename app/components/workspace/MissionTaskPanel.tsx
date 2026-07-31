import type {
  MissionTask,
  TaskStatus,
} from "@/lib/types/mission";

const TASK_STATUSES: TaskStatus[] = [
  "Not Started",
  "In Progress",
  "Blocked",
  "Complete",
];

interface MissionTaskPanelProps {
  tasks: MissionTask[];
  onAddTask: () => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (
    taskId: string,
    changes: Partial<MissionTask>,
  ) => void;
}

function getStatusClasses(
  status: TaskStatus,
): string {
  switch (status) {
    case "Complete":
      return "border-emerald-300/20 bg-emerald-300/[0.04]";
    case "Blocked":
      return "border-red-300/25 bg-red-300/[0.05]";
    case "In Progress":
      return "border-cyan-300/20 bg-cyan-300/[0.04]";
    case "Not Started":
    default:
      return "border-white/10 bg-white/[0.04]";
  }
}

function getStatusLabelClasses(
  status: TaskStatus,
): string {
  switch (status) {
    case "Complete":
      return "text-emerald-300/80";
    case "Blocked":
      return "text-red-300/80";
    case "In Progress":
      return "text-cyan-300/80";
    case "Not Started":
    default:
      return "text-white/40";
  }
}

export default function MissionTaskPanel({
  tasks,
  onAddTask,
  onDeleteTask,
  onUpdateTask,
}: MissionTaskPanelProps) {
  const completedTaskCount = tasks.filter(
    (task) => task.status === "Complete",
  ).length;

  return (
    <section>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs tracking-[0.25em] text-white/40">
            EXECUTION
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Tasks
          </h2>

          <p className="mt-2 text-sm text-white/35">
            {completedTaskCount} of {tasks.length} complete
          </p>
        </div>

        <button
          type="button"
          onClick={onAddTask}
          className="inline-flex items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.08] px-4 py-2.5 text-sm font-medium text-cyan-200 transition hover:bg-cyan-300/[0.14]"
        >
          + Add Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.025] p-10 text-center">
          <p className="text-sm font-medium text-white/65">
            No tasks have been created.
          </p>

          <p className="mt-2 text-sm text-white/35">
            Add the first executable action for this mission.
          </p>

          <button
            type="button"
            onClick={onAddTask}
            className="mt-6 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/85"
          >
            Create First Task
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <article
              key={task.id}
              className={[
                "rounded-2xl border p-5 transition",
                getStatusClasses(task.status),
              ].join(" ")}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex min-w-0 flex-1 gap-3">
                  <input
                    type="checkbox"
                    aria-label={`Mark ${task.title} complete`}
                    checked={task.status === "Complete"}
                    onChange={(event) =>
                      onUpdateTask(task.id, {
                        status: event.target.checked
                          ? "Complete"
                          : "Not Started",
                        progress: event.target.checked
                          ? 100
                          : 0,
                      })
                    }
                    className="mt-1 h-5 w-5 shrink-0 accent-emerald-300"
                  />

                  <div className="min-w-0 flex-1">
                    <input
                      value={task.title}
                      onChange={(event) =>
                        onUpdateTask(task.id, {
                          title: event.target.value,
                        })
                      }
                      className={[
                        "w-full bg-transparent text-lg font-semibold outline-none",
                        task.status === "Complete"
                          ? "text-white/40 line-through"
                          : "text-white",
                      ].join(" ")}
                      placeholder="Task title"
                    />

                    <textarea
                      value={task.description}
                      onChange={(event) =>
                        onUpdateTask(task.id, {
                          description:
                            event.target.value,
                        })
                      }
                      rows={2}
                      placeholder="Add task details..."
                      className="mt-2 w-full resize-none bg-transparent text-sm leading-6 text-white/45 outline-none placeholder:text-white/20"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={task.status}
                    aria-label={`Status for ${task.title}`}
                    onChange={(event) =>
                      onUpdateTask(task.id, {
                        status: event.target
                          .value as TaskStatus,
                      })
                    }
                    className={[
                      "rounded-lg border border-white/10 bg-black px-3 py-2",
                      "text-sm outline-none",
                      getStatusLabelClasses(task.status),
                    ].join(" ")}
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

                  <button
                    type="button"
                    aria-label={`Delete ${task.title}`}
                    onClick={() => {
                      const shouldDelete =
                        window.confirm(
                          `Delete "${task.title}"?`,
                        );

                      if (shouldDelete) {
                        onDeleteTask(task.id);
                      }
                    }}
                    className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/35 transition hover:border-red-300/25 hover:bg-red-300/[0.06] hover:text-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <label className="text-xs tracking-[0.12em] text-white/40">
                  OWNER
                  <input
                    value={task.owner}
                    onChange={(event) =>
                      onUpdateTask(task.id, {
                        owner: event.target.value,
                      })
                    }
                    placeholder="Unassigned"
                    className="mt-2 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm tracking-normal text-white outline-none focus:border-cyan-300/30"
                  />
                </label>

                <label className="text-xs tracking-[0.12em] text-white/40">
                  DUE DATE
                  <input
                    type="date"
                    value={task.dueDate ?? ""}
                    onChange={(event) =>
                      onUpdateTask(task.id, {
                        dueDate:
                          event.target.value ||
                          null,
                      })
                    }
                    className="mt-2 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm tracking-normal text-white outline-none focus:border-cyan-300/30"
                  />
                </label>

                <label className="text-xs tracking-[0.12em] text-white/40">
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

                      onUpdateTask(task.id, {
                        progress,
                        status:
                          progress === 100
                            ? "Complete"
                            : progress > 0
                              ? "In Progress"
                              : "Not Started",
                      });
                    }}
                    className="mt-4 w-full accent-cyan-300"
                  />
                </label>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-cyan-300 transition-[width] duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, task.progress),
                    )}%`,
                  }}
                />
              </div>
<div className="mt-5 border-t border-white/10 pt-5">
  <label className="block text-xs tracking-[0.12em] text-white/40">
    TASK COMMENTS
    <textarea
      value={(task.comments ?? []).join("\n")}
     onChange={(event) =>
  onUpdateTask(task.id, {
    comments: event.target.value.split("\n"),
  })
}
      rows={3}
      placeholder="Add updates, instructions, or context..."
      className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm leading-6 tracking-normal text-white/70 outline-none placeholder:text-white/20 focus:border-cyan-300/30"
    />
    <span className="mt-2 block text-[11px] tracking-normal text-white/25">
      Enter each comment on a separate line.
    </span>
  </label>
</div>
  <div className="mt-5 border-t border-white/10 pt-5">
  <label className="block text-xs tracking-[0.12em] text-white/40">
    BLOCKERS
    <textarea
      value={(task.blockers ?? []).join("\n")}
      onChange={(event) =>
        onUpdateTask(task.id, {
          blockers: event.target.value.split("\n"),
        })
      }
      rows={3}
      placeholder="Add anything preventing this task from moving forward..."
      className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm leading-6 tracking-normal text-white/70 outline-none placeholder:text-white/20 focus:border-red-300/30"
    />
    <span className="mt-2 block text-[11px] tracking-normal text-white/25">
      Enter each blocker on a separate line.
    </span>
  </label>

  {(task.blockers ?? []).some(
    (blocker) => blocker.trim().length > 0,
  ) ? (
    <div className="mt-4 rounded-xl border border-red-300/20 bg-red-300/[0.05] p-4">
      <p className="text-xs font-medium tracking-[0.16em] text-red-200/70">
        ACTIVE BLOCKER
      </p>

      <p className="mt-2 text-sm text-white/45">
        This task contains an unresolved blocker.
      </p>
    </div>
  ) : null}
</div>
<div className="mt-5 border-t border-white/10 pt-5">
  <label className="block text-xs tracking-[0.12em] text-white/40">
    RISKS
    <textarea
      value={(task.risks ?? []).join("\n")}
      onChange={(event) =>
        onUpdateTask(task.id, {
          risks: event.target.value.split("\n"),
        })
      }
      rows={3}
      placeholder="Add risks that could delay, degrade, or prevent completion..."
      className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm leading-6 tracking-normal text-white/70 outline-none placeholder:text-white/20 focus:border-amber-300/30"
    />
    <span className="mt-2 block text-[11px] tracking-normal text-white/25">
      Enter each risk on a separate line.
    </span>
  </label>

  {(task.risks ?? []).some(
    (risk) => risk.trim().length > 0,
  ) ? (
    <div className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/[0.05] p-4">
      <p className="text-xs font-medium tracking-[0.16em] text-amber-200/70">
        ACTIVE RISK
      </p>

      <p className="mt-2 text-sm text-white/45">
        This task contains a risk that requires monitoring.
      </p>
    </div>
  ) : null}
</div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
