import type { CapturedUpdate } from "@/lib/capture-storage";

type Props = {
  updates: CapturedUpdate[];
};

function formatRow(update: CapturedUpdate) {
  const text = `${update.title} ${update.detail}`.toLowerCase();

  if (text.includes("0900") || text.includes("9:00")) {
    return { time: "09:00", title: update.title };
  }

  if (text.includes("1000") || text.includes("10:00")) {
    return { time: "10:00", title: update.title };
  }

  if (text.includes("1100") || text.includes("11:00")) {
    return { time: "11:00", title: update.title };
  }

  if (text.includes("tomorrow")) {
    return { time: "Tomorrow", title: update.title };
  }

  return {
    time: "TBD",
    title: update.title,
  };
}

export default function TodayAgenda({
  updates,
}: Props) {
  const schedule = updates
    .filter((u) => u.type === "schedule")
    .map(formatRow)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
      <h2 className="mb-5 text-lg font-semibold">
        Today&apos;s Agenda
      </h2>

      {schedule.length === 0 ? (
        <p className="text-zinc-500">
          Nothing scheduled.
        </p>
      ) : (
        <div className="space-y-4">
          {schedule.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4"
            >
              <div className="w-20 rounded bg-zinc-800 px-2 py-1 text-center text-sm font-medium">
                {item.time}
              </div>

              <div className="flex-1 border-l border-zinc-700 pl-4">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
