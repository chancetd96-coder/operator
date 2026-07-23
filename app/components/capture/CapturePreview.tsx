import CaptureItem from "./CaptureItem";

type CapturePreviewProps = {
  visible: boolean;
};

const previewItems = [
  {
    type: "Meeting Update",
    title: "Move Monday meeting",
    detail: "Change start time from 0800 to 0900.",
  },
  {
    type: "Task",
    title: "Call John at Defense Unicorns",
    detail: "Due tomorrow morning.",
  },
  {
    type: "Meeting Request",
    title: "Review quarterly deliverables with boss",
    detail: "Date and time require confirmation.",
    status: "Needs detail",
  },
];

export default function CapturePreview({
  visible,
}: CapturePreviewProps) {
  if (!visible) {
    return (
      <section className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center">
        <p className="text-zinc-500">
          Structured updates will appear here after processing.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            Proposed Updates
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Operator found 3 actions
          </h2>
        </div>

        <span className="rounded-full bg-violet-500/20 px-3 py-1 text-sm text-violet-300">
          AI Preview
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {previewItems.map((item) => (
          <CaptureItem key={`${item.type}-${item.title}`} {...item} />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          className="rounded-lg border border-zinc-700 px-4 py-2 font-medium text-zinc-300 transition hover:bg-zinc-800"
        >
          Discard
        </button>

        <button
          type="button"
          className="rounded-lg border border-zinc-700 px-4 py-2 font-medium text-zinc-300 transition hover:bg-zinc-800"
        >
          Edit
        </button>

        <button
          type="button"
          className="rounded-lg bg-white px-4 py-2 font-semibold text-zinc-950 transition hover:bg-zinc-200"
        >
          Approve All
        </button>
      </div>
    </section>
  );
}
