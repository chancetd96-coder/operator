"use client";

import { useState } from "react";
import CaptureInput from "@/components/capture/CaptureInput";
import CapturePreview from "@/components/capture/CapturePreview";
import Page from "@/components/layout/Page";
import { interpretNote } from "@/lib/interpreter/engine";
import type { OperatorEvent } from "@/lib/types/operator-event";

export default function CapturePage() {
  const [note, setNote] = useState("");
  const [events, setEvents] = useState<OperatorEvent[]>([]);

  function processNote() {
    if (!note.trim()) return;
    setEvents(interpretNote(note));
  }

  return (
    <Page>
      <CaptureInput
        value={note}
        onChange={(value) => {
          setNote(value);
          setEvents([]);
        }}
        onProcess={processNote}
      />

      <CapturePreview events={events} />
    </Page>
  );
}
