"use client";

import { useRouter } from "next/navigation";
import CaptureItem from "./CaptureItem";
import {
  appendCapturedUpdates,
  type CapturedUpdate,
} from "@/lib/capture-storage";
import type { InterpretedCaptureItem } from "@/lib/services/capture-interpreter";

type CapturePreviewProps = {
  items: InterpretedCaptureItem[];
};

function toCapturedUpdate(
  item: InterpretedCaptureItem,
): CapturedUpdate {
  const type =
    item.type === "task"
      ? "schedule"
      : item.type;

  return {
    id: item.id,
    type,
    title: item.title,
    detail: item.detail,
    createdAt: new Date().toISOString(),
  };
}

export default function CapturePreview({
  items,
}: CapturePreviewProps) {
  const router = useRouter();

  function approveAll() {
    appendCapturedUpdates(items.map(toCapturedUpdate));
    router.push("/today");
  }

  if (items.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center">
        <p className="text-zinc-500">
          Structured updates will appear here after processing.
        </p>
      </section>
    );
  }

  const unresolvedCount = items.filter(
    (item) => item.status === "needs-detail",
  ).length;

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            Proposed Updates
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Operator found {items.length}{" "}
            {items.length === 1 ? "action" : "actions"}
          </h2>

          {unresolvedCount > 0 ? (
            <p className="mt-2 text-sm text-amber-400">
              {unresolvedCount}{" "}
              {unresolvedCount === 1 ? "item needs" : "items need"} more detail.
            </p>
          ) : null}
        </div>

        <span className="rounded-full bg-violet-500/20 px-3 py-1 text-sm text-violet-300">
          Interpreter Preview
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <CaptureItem
            key={item.id}
            type={item.label}
            title={item.title}
            detail={item.detail}
            status={
              item.status === "needs-detail"
                ? "Needs detail"
                : "Ready"
            }
          />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/today")}
          className="rounded-lg border border-zinc-700 px-4 py-2 font-medium text-zinc-300 transition hover:bg-zinc-800"
        >
          Discard
        </button>

        <button
          type="button"
          disabled={unresolvedCount > 0}
          onClick={approveAll}
          className="rounded-lg bg-white px-4 py-2 font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Approve All
        </button>
      </div>
    </section>
  );
}