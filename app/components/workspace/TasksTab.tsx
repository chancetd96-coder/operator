"use client";

import type {
  MissionTask,
  TaskStatus,
} from "@/types/mission";

type Props = {
  tasks: MissionTask[];
  statuses: TaskStatus[];
  updateTask: (
    id: string,
    changes: Partial<MissionTask>,
  ) => void;
};

export default function TasksTab({
  tasks,
  statuses,
  updateTask,
}: Props) {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="rounded-xl border border-white/10 p-5"
        >
          <h3 className="font-medium">
            {task.title}
          </h3>

          <select
            className="mt-3 rounded bg-black px-3 py-2"
            value={task.status}
            onChange={(event) =>
              updateTask(task.id, {
                status: event.target.value as TaskStatus,
              })
            }
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
