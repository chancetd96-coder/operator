"use client";

import MissionTimeline from "@/components/MissionTimeline";
import type { Mission } from "@/types/mission";

type Props = {
  mission: Mission;
};

export default function TimelineTab({ mission }: Props) {
  return <MissionTimeline mission={mission} />;
}
