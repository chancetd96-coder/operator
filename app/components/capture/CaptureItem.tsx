type CaptureItemProps = {
  type: string;
  title: string;
  detail: string;
  status?: string;
};

export default function CaptureItem({
  type,
  title,
  detail,
  status = "Ready",
}: CaptureItemProps) {
  return (
    <article className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-300">
            {type}
          </p>

          <h3 className="mt-2 font-semibold text-zinc-100">{title}</h3>

          <p className="mt-1 text-sm text-zinc-400">{detail}</p>
        </div>

        <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
          {status}
        </span>
      </div>
    </article>
  );
}
