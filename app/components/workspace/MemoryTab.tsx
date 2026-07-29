"use client";

import MissionMemoryPanel from "@/components/MissionMemoryPanel";

type Props = {
  missionId: string;
};

export default function MemoryTab({ missionId }: Props) {
  return <MissionMemoryPanel missionId={missionId} />;
}
