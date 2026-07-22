"use client";

import { useMemo, useState } from "react";

import type { Mission } from "@/types/mission";

type TimelineView = "Timeline" | "Week" | "Month";

type TimelineItemType =
  | "Task"
  | "Meeting"
  | "Overdue";

type TimelineItem = {
  id: string;
  missionId: number;
  sourceId: string;
  type: TimelineItemType;
  title: string;
  description: string;
  date: string;
  time: string | null;
  status: string | null;
  progress: number | null;
};

type MissionTimelineProps = {
  mission: Mission;
};

function parseLocalDate(value: string): Date {
  const [year, month, day] = value
    .split("-")
    .map(Number);

  return new Date(year, month - 1, day);
}

function startOfToday(): Date {
  const now = new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
}

function isPastDate(value: string): boolean {
  return parseLocalDate(value) < startOfToday();
}

function formatDateHeading(value: string): string {
  const date = parseLocalDate(value);
  const today = startOfToday();

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.getTime() === today.getTime()) {
    return "Today";
  }

  if (date.getTime() === tomorrow.getTime()) {
    return "Tomorrow";
  }

  if (date.getTime() === yesterday.getTime()) {
    return "Yesterday";
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

function formatMonth(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(parseLocalDate(value));
}

function formatTime(value: string | null): string {
  if (!value) return "All day";

  const [hours, minutes] = value
    .split(":")
    .map(Number);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function buildTimelineItems(
  mission: Mission,
): TimelineItem[] {
  const taskItems: TimelineItem[] =
    mission.tasks
      .filter((task) => Boolean(task.dueDate))
      .map((task) => {
        const overdue =
          task.dueDate &&
          task.status !== "Complete" &&
          isPastDate(task.dueDate);

        return {
          id: `task-${task.id}`,
          missionId: mission.id,
          sourceId: task.id,
          type: overdue ? "Overdue" : "Task",
          title: task.title,
          description:
            task.description ||
            "No task description recorded.",
          date: task.dueDate as string,
          time: null,
          status: task.status,
          progress: task.progress,
        };
      });

  const meetingItems: TimelineItem[] =
    mission.meetings
      .filter((meeting) => Boolean(meeting.date))
      .map((meeting) => ({
        id: `meeting-${meeting.id}`,
        missionId: mission.id,
        sourceId: meeting.id,
        type: "Meeting",
        title: meeting.title,
        description: "Mission meeting.",
        date: meeting.date as string,
        time: meeting.time || null,
        status: null,
        progress: null,
      }));

  return [...taskItems, ...meetingItems].sort(
    (a, b) => {
      const dateComparison =
        parseLocalDate(a.date).getTime() -
        parseLocalDate(b.date).getTime();

      if (dateComparison !== 0) {
        return dateComparison;
      }

      if (!a.time && b.time) return 1;
      if (a.time && !b.time) return -1;

      return (a.time ?? "").localeCompare(
        b.time ?? "",
      );
    },
  );
}

function isWithinCurrentWeek(value: string): boolean {
  const date = parseLocalDate(value);
  const today = startOfToday();

  const weekStart = new Date(today);
  const day = weekStart.getDay();
  const offset = day === 0 ? -6 : 1 - day;

  weekStart.setDate(weekStart.getDate() + offset);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return date >= weekStart && date <= weekEnd;
}

function isWithinCurrentMonth(
  value: string,
): boolean {
  const date = parseLocalDate(value);
  const today = startOfToday();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth()
  );
}

export default function MissionTimeline({
  mission,
}: MissionTimelineProps) {
  const [view, setView] =
    useState<TimelineView>("Timeline");

  const allItems = useMemo(
    () => buildTimelineItems(mission),
    [mission],
  );

  const visibleItems = useMemo(() => {
    if (view === "Week") {
      return allItems.filter((item) =>
        isWithinCurrentWeek(item.date),
      );
    }

    if (view === "Month") {
      return allItems.filter((item) =>
        isWithinCurrentMonth(item.date),
      );
    }

    return allItems;
  }, [allItems, view]);

  const groupedItems = useMemo(() => {
    return visibleItems.reduce<
      Record<string, TimelineItem[]>
    >((groups, item) => {
      groups[item.date] ??= [];
      groups[item.date].push(item);

      return groups;
    }, {});
  }, [visibleItems]);

  const upcomingCount = allItems.filter(
    (item) =>
      parseLocalDate(item.date) >= startOfToday(),
  ).length;

  const overdueCount = allItems.filter(
    (item) => item.type === "Overdue",
  ).length;

  const nextScheduledItem = allItems.find(
    (item) =>
      parseLocalDate(item.date) >= startOfToday(),
  );

  return (
    <section className="relative mt-12 overflow-hidden rounded-3xl border border-cyan-300/15 bg-white/[0.025]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(103,232,249,0.08),transparent_35%)]" />

      <div className="relative border-b border-white/10 px-6 py-6 md:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs tracking-[0.3em] text-cyan-300/65">
              MISSION TIMELINE
            </p>

            <h2 className="mt-3 text-3xl font-semibold">
              Operational schedule
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
              Task deadlines and mission meetings are
              consolidated into one execution timeline.
            </p>
          </div>

          <div className="flex rounded-xl border border-white/10 bg-black/30 p-1">
            {(
              [
                "Timeline",
                "Week",
                "Month",
              ] as TimelineView[]
            ).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setView(option)}
                className={`rounded-lg px-4 py-2 text-xs tracking-[0.12em] transition ${
                  view === option
                    ? "bg-white/10 text-white"
                    : "text-white/35 hover:text-white/70"
                }`}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative grid gap-px bg-white/10 sm:grid-cols-3">
        <TimelineMetric
          label="Scheduled"
          value={allItems.length}
        />

        <TimelineMetric
          label="Upcoming"
          value={upcomingCount}
        />

        <TimelineMetric
          label="Overdue"
          value={overdueCount}
        />
      </div>

      <div className="relative px-6 py-8 md:px-8">
        {nextScheduledItem && (
          <div className="mb-8 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.035] p-5">
            <p className="text-xs tracking-[0.2em] text-cyan-300/60">
              NEXT SCHEDULED ACTION
            </p>

            <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium">
                  {nextScheduledItem.title}
                </p>

                <p className="mt-1 text-sm text-white/40">
                  {formatDateHeading(
                    nextScheduledItem.date,
                  )}
                  {" · "}
                  {formatTime(nextScheduledItem.time)}
                </p>
              </div>

              <TimelineBadge
                type={nextScheduledItem.type}
              />
            </div>
          </div>
        )}

        {visibleItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center">
            <p className="text-sm font-medium text-white/60">
              No scheduled activity in this view
            </p>

            <p className="mt-2 text-sm text-white/30">
              Assign due dates to tasks or dates to
              meetings to populate the timeline.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(groupedItems).map(
              ([date, items]) => (
                <section
                  key={date}
                  className="grid gap-5 md:grid-cols-[170px_1fr]"
                >
                  <div>
                    <p className="text-xs tracking-[0.2em] text-cyan-300/60">
                      {formatMonth(date)}
                    </p>

                    <h3 className="mt-2 text-lg font-semibold">
                      {formatDateHeading(date)}
                    </h3>

                    <p className="mt-1 text-sm text-white/30">
                      {items.length}{" "}
                      {items.length === 1
                        ? "event"
                        : "events"}
                    </p>
                  </div>

                  <div className="relative space-y-4 border-l border-white/10 pl-6">
                    <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full border border-cyan-200/50 bg-black" />

                    {items.map((item) => (
                      <TimelineCard
                        key={item.id}
                        item={item}
                      />
                    ))}
                  </div>
                </section>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function TimelineCard({
  item,
}: {
  item: TimelineItem;
}) {
  return (
    <article className="group rounded-2xl border border-white/10 bg-black/25 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/20 hover:bg-white/[0.045]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <TimelineBadge type={item.type} />

            <span className="text-xs text-white/30">
              {formatTime(item.time)}
            </span>
          </div>

          <h4 className="mt-3 text-base font-medium text-white/85">
            {item.title}
          </h4>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/35">
            {item.description}
          </p>
        </div>

        {item.progress !== null && (
          <span className="shrink-0 text-sm font-medium text-white/45">
            {item.progress}%
          </span>
        )}
      </div>

      {item.progress !== null && (
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-cyan-300 transition-all duration-500"
            style={{
              width: `${item.progress}%`,
            }}
          />
        </div>
      )}

      {item.status && (
        <p className="mt-3 text-xs tracking-[0.12em] text-white/25">
          STATUS: {item.status.toUpperCase()}
        </p>
      )}
    </article>
  );
}

function TimelineMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-black/45 px-6 py-5">
      <p className="text-xs tracking-[0.15em] text-white/30">
        {label.toUpperCase()}
      </p>

      <p className="mt-2 text-2xl font-semibold">
        {value}
      </p>
    </div>
  );
}

function TimelineBadge({
  type,
}: {
  type: TimelineItemType;
}) {
  const className =
    type === "Overdue"
      ? "border-red-300/20 bg-red-300/[0.07] text-red-200/70"
      : type === "Meeting"
        ? "border-violet-300/20 bg-violet-300/[0.07] text-violet-200/70"
        : "border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-200/70";

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] tracking-[0.15em] ${className}`}
    >
      {type.toUpperCase()}
    </span>
  );
}