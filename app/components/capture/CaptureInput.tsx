type CaptureInputProps = {
  value: string;
  onChange: (value: string) => void;
  onProcess: () => void;
};

export default function CaptureInput({
  value,
  onChange,
  onProcess,
}: CaptureInputProps) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 md:p-8">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
        Executive Capture
      </p>

      <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
        What changed?
      </h1>

      <p className="mt-3 max-w-2xl text-zinc-400">
        Type meeting changes, follow-ups, decisions, risks, or anything else
        Operator should process.
      </p>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Meeting changed from 0800 to 0900 Monday. Call John tomorrow morning. Schedule time with my boss to review quarterly deliverables."
        className="mt-6 min-h-48 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
      />

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-sm text-zinc-500">
          Operator will show a review before making changes.
        </p>

        <button
          type="button"
          onClick={onProcess}
          disabled={!value.trim()}
          className="rounded-lg bg-white px-5 py-3 font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Process Note
        </button>
      </div>
    </section>
  );
}
