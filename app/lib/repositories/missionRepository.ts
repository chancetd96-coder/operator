import type { Mission } from "@/types/mission";

import {
  getMission,  
  getMissions,
  saveMissionToCloud,
  deleteMissionFromCloud,
} from "@/lib/services/missions";

import {
  loadMissions,
  saveMissions,
} from "@/lib/storage";

export const MissionRepository = {
  async getAll(): Promise<Mission[]> {
    try {
      const missions = await getMissions();

      saveMissions(missions);

      return missions;
    } catch (error) {
      console.warn(
        "Cloud unavailable. Falling back to local storage.",
        error,
      );

      return loadMissions();
    }
  },

async getById(id: number): Promise<Mission | null> {
  try {
    const cloudMission = await getMission(id);

    if (cloudMission) {
      const cachedMissions = loadMissions();

      const updatedCache = cachedMissions.some(
        (mission) => mission.id === cloudMission.id,
      )
        ? cachedMissions.map((mission) =>
            mission.id === cloudMission.id
              ? cloudMission
              : mission,
          )
        : [...cachedMissions, cloudMission];

      saveMissions(updatedCache);

      return cloudMission;
    }

    return (
      loadMissions().find((mission) => mission.id === id) ??
      null
    );
  } catch (error) {
    console.warn(
      "Unable to load mission from cloud. Using local cache.",
      error,
    );

    return (
      loadMissions().find((mission) => mission.id === id) ??
      null
    );
  }
},

  async save(mission: Mission): Promise<void> {
    await saveMissionToCloud(mission);

    const missions = loadMissions();

    const updatedMissions = missions.some(
      (storedMission) => storedMission.id === mission.id,
    )
      ? missions.map((storedMission) =>
          storedMission.id === mission.id
            ? mission
            : storedMission,
        )
      : [...missions, mission];

    saveMissions(updatedMissions);
  },

  async delete(id: number): Promise<void> {
    await deleteMissionFromCloud(id);

    const updatedMissions = loadMissions().filter(
      (mission) => mission.id !== id,
    );

    saveMissions(updatedMissions);
  },

  async sync(): Promise<Mission[]> {
    const cloudMissions = await getMissions();

    saveMissions(cloudMissions);

    return cloudMissions;
  },
};