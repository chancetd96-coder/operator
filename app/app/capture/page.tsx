"use client";

import { useState } from "react";
import CaptureInput from "@/components/capture/CaptureInput";
import CapturePreview from "@/components/capture/CapturePreview";
import Page from "@/components/layout/Page";

export default function CapturePage() {
  const [note, setNote] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  function processNote() {
    if (!note.trim()) return;
    setShowPreview(true);
  }

  return (
    <Page>
      <CaptureInput
        value={note}
        onChange={(value) => {
          setNote(value);
          setShowPreview(false);
        }}
        onProcess={processNote}
      />

      <CapturePreview visible={showPreview} />
    </Page>
  );
}
