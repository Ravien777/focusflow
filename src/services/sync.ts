import { useStore } from "../store/useStore";
import {
  uploadAllHabits,
  downloadAllHabits,
  uploadUserMeta,
  downloadUserMeta,
} from "./firestore";
import { Habit } from "../types";

let syncTimeout: ReturnType<typeof setTimeout> | null = null;
const SYNC_DEBOUNCE = 2000;

function mergeHabits(local: Habit[], remote: Habit[]): Habit[] {
  const merged: Habit[] = [];
  const localMap = new Map(local.map((h) => [h.id, h]));
  const remoteMap = new Map(remote.map((h) => [h.id, h]));

  const allIds = new Set([...localMap.keys(), ...remoteMap.keys()]);
  for (const id of allIds) {
    const lh = localMap.get(id);
    const rh = remoteMap.get(id);
    if (lh && !rh) {
      merged.push(lh);
    } else if (!lh && rh) {
      merged.push(rh);
    } else if (lh && rh) {
      merged.push(lh.lastModified >= rh.lastModified ? lh : rh);
    }
  }
  return merged;
}

async function pushToCloud() {
  const state = useStore.getState();
  if (!state.user) return;
  try {
    await uploadAllHabits(state.user.uid, state.habits);
    await uploadUserMeta(state.user.uid, {
      xp: state.xp,
      earnedBadges: state.earnedBadges,
    });
  } catch (e) {
    console.warn("Sync push failed:", e);
  }
}

async function pullFromCloud(): Promise<{
  habits: Habit[];
  xp: number;
  earnedBadges: string[];
} | null> {
  const state = useStore.getState();
  if (!state.user) return null;

  const [remoteHabits, remoteMeta] = await Promise.all([
    downloadAllHabits(state.user.uid),
    downloadUserMeta(state.user.uid),
  ]);

  const mergedHabits = mergeHabits(state.habits, remoteHabits);

  return {
    habits: mergedHabits,
    xp: Math.max(remoteMeta?.xp ?? 0, state.xp),
    earnedBadges: [
      ...new Set([
        ...state.earnedBadges,
        ...(remoteMeta?.earnedBadges ?? []),
      ]),
    ],
  };
}

export function debouncedSync() {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(async () => {
    try {
      await pushToCloud();
    } catch (e) {
      console.warn("Sync push failed:", e);
    }
  }, SYNC_DEBOUNCE);
}

export async function initialSync(): Promise<void> {
  const state = useStore.getState();
  if (!state.user) return;

  try {
    const remote = await pullFromCloud();
    if (remote) {
      if (
        remote.habits.length > 0 ||
        remote.xp > 0 ||
        remote.earnedBadges.length > 0
      ) {
        state.syncFromCloud(remote.habits, remote.xp, remote.earnedBadges);
      }
    }
    await pushToCloud();
  } catch (e) {
    console.warn("Initial sync failed:", e);
  }
}
