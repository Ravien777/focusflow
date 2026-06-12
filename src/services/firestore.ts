import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  writeBatch,
  getDocs,
} from "firebase/firestore";
import { getFirebaseDb, isFirebaseAvailable } from "./firebase";

function guardDb() {
  if (!isFirebaseAvailable()) throw new Error("Firebase not configured");
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase not configured");
  return db;
}
import { Habit, CheckInValue } from "../types";

export async function uploadHabit(
  userId: string,
  habit: Habit,
): Promise<void> {
  const db = guardDb();
  const ref = doc(db, "users", userId, "habits", habit.id);
  await setDoc(ref, toFirestoreDoc(habit));
}

export async function downloadHabit(
  userId: string,
  habitId: string,
): Promise<Habit | null> {
  const db = guardDb();
  const ref = doc(db, "users", userId, "habits", habitId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return fromFirestoreDoc(snap.id, snap.data());
}

export async function uploadAllHabits(
  userId: string,
  habits: Habit[],
): Promise<void> {
  const db = guardDb();
  const batch = writeBatch(db);
  for (const habit of habits) {
    const ref = doc(db, "users", userId, "habits", habit.id);
    batch.set(ref, toFirestoreDoc(habit));
  }
  await batch.commit();
}

export async function downloadAllHabits(
  userId: string,
): Promise<Habit[]> {
  const db = guardDb();
  const snapshot = await getDocs(collection(db, "users", userId, "habits"));
  const habits: Habit[] = [];
  snapshot.forEach((d) => {
    habits.push(fromFirestoreDoc(d.id, d.data()));
  });
  return habits;
}

export async function deleteRemoteHabit(
  userId: string,
  habitId: string,
): Promise<void> {
  const db = guardDb();
  const ref = doc(db, "users", userId, "habits", habitId);
  await deleteDoc(ref);
}

export async function uploadUserMeta(
  userId: string,
  data: { xp: number; earnedBadges: string[] },
): Promise<void> {
  const db = guardDb();
  const ref = doc(db, "users", userId, "meta", "profile");
  await setDoc(ref, {
    xp: data.xp,
    earnedBadges: data.earnedBadges,
    lastModified: Date.now(),
  });
}

export async function downloadUserMeta(
  userId: string,
): Promise<{ xp: number; earnedBadges: string[] } | null> {
  const db = guardDb();
  const ref = doc(db, "users", userId, "meta", "profile");
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    xp: d.xp ?? 0,
    earnedBadges: d.earnedBadges ?? [],
  };
}

function toFirestoreDoc(habit: Habit): Record<string, unknown> {
  return {
    name: habit.name,
    icon: habit.icon,
    color: habit.color,
    createdAt: habit.createdAt,
    checkIns: habit.checkIns,
    targetDays: habit.targetDays,
    archived: habit.archived,
    scheduledDays: habit.scheduledDays,
    focusedMinutes: habit.focusedMinutes,
    frozenDays: habit.frozenDays,
    lastModified: habit.lastModified,
  };
}

function fromFirestoreDoc(id: string, data: Record<string, unknown>): Habit {
  const rawCheckIns = (data.checkIns as Record<string, unknown>) ?? {};
  const checkIns: Record<string, CheckInValue> = {};
  for (const [date, val] of Object.entries(rawCheckIns)) {
    const v = val as Record<string, unknown>;
    checkIns[date] = {
      done: Boolean(v.done),
      ...(v.note ? { note: String(v.note) } : {}),
    };
  }
  return {
    id,
    name: String(data.name ?? ""),
    icon: String(data.icon ?? ""),
    color: String(data.color ?? "#3B82F6"),
    createdAt: String(data.createdAt ?? new Date().toISOString()),
    checkIns,
    streak: 0,
    targetDays: Number(data.targetDays ?? 7),
    archived: Boolean(data.archived),
    scheduledDays: Array.isArray(data.scheduledDays)
      ? (data.scheduledDays as number[])
      : [0, 1, 2, 3, 4, 5, 6],
    focusedMinutes: Number(data.focusedMinutes ?? 0),
    frozenDays: Array.isArray(data.frozenDays)
      ? (data.frozenDays as string[])
      : [],
    lastModified: Number(data.lastModified ?? 0),
  };
}
