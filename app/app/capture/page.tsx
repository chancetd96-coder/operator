"use client";

import { useState } from "react";
import CaptureInput from "@/components/capture/CaptureInput";
import CapturePreview from "@/components/capture/CapturePreview";
import Page from "@/components/layout/Page";
import { interpretNote } from "@/lib/interpreter/engine";
import { createDraftEvents } from "@/lib/repositories/operatorEventRepository";
import type { OperatorEvent } from "@/lib/types/operator-event";

export default function CapturePage() {
  const [note, setNote] = useState("");
  const [events, setEvents] = useState<OperatorEvent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function processNote() {
    if (!note.trim() || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      const interpretedEvents = interpretNote(note);
      const savedEvents = await createDraftEvents(interpretedEvents);

      setEvents(
        savedEvents.length > 0
          ? savedEvents
          : interpretedEvents,
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Operator could not process this capture.",
      );
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <Page>
      <CaptureInput
        value={note}
        onChange={(value) => {
          setNote(value);
          setEvents([]);
          setError(null);
        }}
        onProcess={processNote}
      />

      {isProcessing ? (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <p className="text-sm text-zinc-400">
            Operator is interpreting and saving this capture...
          </p>
        </section>
      ) : null}

      {error ? (
        <section className="rounded-2xl border border-red-900/60 bg-red-950/30 p-6">
          <p className="font-medium text-red-300">
            Capture failed
          </p>
          <p className="mt-2 text-sm text-red-200/80">
            {error}
          </p>
        </section>
      ) : null}

      <CapturePreview events={events} />
    </Page>
  );
}
