"use client";

import { useState } from "react";
import CaptureInput from "@/components/capture/CaptureInput";
import CapturePreview from "@/components/capture/CapturePreview";
import Page from "@/components/layout/Page";
import {
  interpretCaptureNote,
  type InterpretedCaptureItem,
} from "@/lib/services/capture-interpreter";

export default function CapturePage() {
  const [note, setNote] = useState("");
  const [items, setItems] = useState<InterpretedCaptureItem[]>([]);

  function processNote() {
    if (!note.trim()) return;
    setItems(interpretCaptureNote(note));
  }

  return (
    <Page>
      <CaptureInput
        value={note}
        onChange={(value) => {
          setNote(value);
          setItems([]);
        }}
        onProcess={processNote}
      />

      <CapturePreview items={items} />
    </Page>
  );
}