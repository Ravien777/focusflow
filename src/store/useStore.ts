import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";
import { AppState, Habit, CheckInValue } from "../types";
import { calculateStreak } from "../utils/dates";
import { calculateLevel, XP_PER_CHECKIN, checkNewBadges } from "../utils/gamification";

const SEED_HABITS: Omit<
  Habit,
  "id" | "createdAt" | "checkIns" | "streak" | "targetDays" | "archived" | "scheduledDays" | "focusedMinutes" | "frozenDays" | "lastModified"
>[] = [
  { name: "Drink Water", icon: "water-outline", color: "#3B82F6" },
  { name: "Read 10 Pages", icon: "book-outline", color: "#10B981" },
  { name: "10 Min Stretch", icon: "fitness-outline", color: "#F59E0B" },
];

const HABIT_DEFAULTS = {
  checkIns: {} as Record<string, CheckInValue>,
  streak: 0,
  targetDays: 7,
  archived: false,
  scheduledDays: [0, 1, 2, 3, 4, 5, 6],
  focusedMinutes: 0,
  frozenDays: [] as string[],
  lastModified: Date.now(),
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      habits: [],
      theme: "system",
      hasOnboarded: false,
      xp: 0,
      level: 1,
      earnedBadges: [],
      focusMinutes: 25,
      breakMinutes: 5,
      reminderSettings: { enabled: false, hour: 9, minute: 0 },
      user: null,
      isPremium: false,
      accentColor: "#3B82F6",
      fontScale: 1,
      isLoading: true,

      addHabit: ({ name, icon, color, scheduledDays }) =>
        set((state) => ({
          habits: [
            ...state.habits,
            {
              id: randomUUID(),
              name,
              icon,
              color,
              createdAt: new Date().toISOString(),
              ...HABIT_DEFAULTS,
              scheduledDays: scheduledDays ?? HABIT_DEFAULTS.scheduledDays,
              lastModified: Date.now(),
            },
          ],
        })),

      toggleCheckIn: (id, date) =>
        set((state) => {
          const habit = state.habits.find((h) => h.id === id);
          if (!habit) return state;
          const prev = habit.checkIns[date];
          const isCheckingIn = !prev?.done;

          const newCheckIns = { ...habit.checkIns };
          newCheckIns[date] = prev
            ? { done: !prev.done, note: prev.note }
            : { done: true };

          let xp = state.xp;
          let level = state.level;
          let earnedBadges = state.earnedBadges;

          if (isCheckingIn) {
            xp += XP_PER_CHECKIN;
            level = calculateLevel(xp);
            const newBadgeIds = checkNewBadges(
              state.habits.map((h) =>
                h.id === id
                  ? { ...h, checkIns: newCheckIns }
                  : h,
              ),
              xp,
              state.earnedBadges,
            );
            if (newBadgeIds.length > 0) {
              earnedBadges = [...state.earnedBadges, ...newBadgeIds];
            }
          }

          return {
            habits: state.habits.map((h) =>
              h.id === id
                ? {
                    ...h,
                    checkIns: newCheckIns,
                    streak: calculateStreak(newCheckIns, h.scheduledDays, h.frozenDays),
                    lastModified: Date.now(),
                  }
                : h,
            ),
            xp,
            level,
            earnedBadges,
          };
        }),

      updateCheckInNote: (id, date, note) =>
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== id) return h;
            const newCheckIns = { ...h.checkIns };
            const prev = newCheckIns[date];
            if (prev) {
              newCheckIns[date] = { ...prev, note };
            }
            return { ...h, checkIns: newCheckIns, lastModified: Date.now() };
          }),
        })),

      addFocusedTime: (id, minutes) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id
              ? { ...h, focusedMinutes: h.focusedMinutes + minutes, lastModified: Date.now() }
              : h,
          ),
        })),

      archiveHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, archived: true, lastModified: Date.now() } : h,
          ),
        })),

      unarchiveHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, archived: false, lastModified: Date.now() } : h,
          ),
        })),

      deleteHabitPermanently: (id) =>
        set((state) => ({ habits: state.habits.filter((h) => h.id !== id) })),

      updateHabit: (id, updates) =>
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== id) return h;
            const updated = { ...h, ...updates, lastModified: Date.now() };
            if (updates.scheduledDays) {
              updated.streak = calculateStreak(updated.checkIns, updated.scheduledDays, updated.frozenDays);
            }
            return updated;
          }),
        })),

      setTheme: (theme) => set({ theme }),

      completeOnboarding: () => set({ hasOnboarded: true }),

      setFocusMinutes: (minutes) => set({ focusMinutes: minutes }),
      setBreakMinutes: (minutes) => set({ breakMinutes: minutes }),

      awardXP: (amount) =>
        set((state) => {
          const newXp = state.xp + amount;
          return { xp: newXp, level: calculateLevel(newXp) };
        }),

      checkAndAwardBadges: () =>
        set((state) => {
          const newBadgeIds = checkNewBadges(
            state.habits,
            state.xp,
            state.earnedBadges,
          );
          if (newBadgeIds.length === 0) return state;
          return { earnedBadges: [...state.earnedBadges, ...newBadgeIds] };
        }),

      updateReminderTime: (hour, minute) =>
        set((state) => ({
          reminderSettings: { ...state.reminderSettings, hour, minute },
        })),

      toggleReminder: () =>
        set((state) => ({
          reminderSettings: {
            ...state.reminderSettings,
            enabled: !state.reminderSettings.enabled,
          },
        })),

      seedHabits: () =>
        set((state) => {
          if (state.habits.length > 0) return state;
          return {
            habits: SEED_HABITS.map((h) => ({
              ...h,
              id: randomUUID(),
              createdAt: new Date().toISOString(),
              ...HABIT_DEFAULTS,
            })),
          };
        }),

      setUser: (user) => set({ user, isLoading: false }),

      setPremium: (isPremium) => set({ isPremium }),

      setAccentColor: (accentColor) => set({ accentColor }),

      setFontScale: (fontScale) => set({ fontScale }),

      freezeDay: (habitId, date) =>
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== habitId) return h;
            if (h.frozenDays.includes(date)) return h;
            return {
              ...h,
              frozenDays: [...h.frozenDays, date],
              lastModified: Date.now(),
            };
          }),
        })),

      syncFromCloud: (habits, xp, earnedBadges) =>
        set((state) => ({
          habits: habits.length > 0 ? habits : state.habits,
          xp: Math.max(xp, state.xp),
          earnedBadges: [...new Set([...state.earnedBadges, ...earnedBadges])],
        })),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    { name: "focusflow-store", storage: createJSONStorage(() => AsyncStorage) },
  ),
);
