import { Clock } from "lucide-react";

export interface TimelineEvent {
  id: string;
  type:
    | "mission"
    | "task"
    | "meeting"
    | "risk"
    | "decision"
    | "memory"
    | "status";

  title: string;
  description?: string;
  timestamp: string;
  actor?: string;
}

interface MissionTimelinePanelProps {
  events: TimelineEvent[];
}

const COLORS: Record<TimelineEvent["type"], string> = {
  mission: "bg-blue-400",
  task: "bg-cyan-400",
  meeting: "bg-violet-400",
  risk: "bg-red-400",
  decision: "bg-amber-400",
  memory: "bg-white",
  status: "bg-emerald-400",
};

export default function MissionTimelinePanel({
  events,
}: MissionTimelinePanelProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-6 flex items-center gap-3">
        <Clock className="h-5 w-5 text-cyan-300" />

        <div>
          <p className="text-xs tracking-[0.22em] text-white/40">
            OPERATIONAL HISTORY
          </p>

          <h2 className="text-2xl font-semibold text-white">
            Mission Timeline
          </h2>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 py-12 text-center">
          <p className="text-white/60 font-medium">
            No activity yet.
          </p>

          <p className="mt-2 text-sm text-white/35">
            Begin capturing work and Operator will automatically build your
            operational history.
          </p>
        </div>
      ) : (
        <div className="relative space-y-6 border-l border-white/10 pl-6">
          {events.map((event) => (
            <div key={event.id} className="relative">
              <div
                className={`absolute -left-[33px] mt-1 h-4 w-4 rounded-full ${COLORS[event.type]}`}
              />

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-white">
                      {event.title}
                    </h3>

                    {event.description && (
                      <p className="mt-2 text-sm text-white/50">
                        {event.description}
                      </p>
                    )}

                    {event.actor && (
                      <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/30">
                        {event.actor}
                      </p>
                    )}
                  </div>

                  <span className="text-xs text-white/35 whitespace-nowrap">
                    {event.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
