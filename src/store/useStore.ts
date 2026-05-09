import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";
import { AppState, Habit } from "../types";
import { calculateStreak } from "../utils/dates";

const SEED_HABITS: Omit<
  Habit,
  "id" | "createdAt" | "checkIns" | "streak" | "targetDays"
>[] = [
  { name: "Drink Water", icon: "water-outline", color: "#3B82F6" },
  { name: "Read 10 Pages", icon: "book-outline", color: "#10B981" },
  { name: "10 Min Stretch", icon: "fitness-outline", color: "#F59E0B" },
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      habits: [],
      theme: "dark",
      reminderSettings: { enabled: false, hour: 9, minute: 0 },

      addHabit: ({ name, icon, color }) =>
        set((state) => ({
          habits: [
            ...state.habits,
            {
              id: randomUUID(),
              name,
              icon,
              color,
              createdAt: new Date().toISOString(),
              checkIns: {},
              streak: 0,
              targetDays: 7,
            },
          ],
        })),

      toggleCheckIn: (id, date) =>
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== id) return h;
            const newCheckIns = { ...h.checkIns };
            newCheckIns[date] = !newCheckIns[date];
            return {
              ...h,
              checkIns: newCheckIns,
              streak: calculateStreak(newCheckIns),
            };
          }),
        })),

      deleteHabit: (id) =>
        set((state) => ({ habits: state.habits.filter((h) => h.id !== id) })),
      setTheme: (theme) => set({ theme }),

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
          if (state.habits.length > 0) return state; // ✅ Prevents infinite loops
          return {
            habits: SEED_HABITS.map((h) => ({
              ...h,
              id: randomUUID(),
              createdAt: new Date().toISOString(),
              checkIns: {},
              streak: 0,
              targetDays: 7,
            })),
          };
        }),
    }),
    { name: "focusflow-store", storage: createJSONStorage(() => AsyncStorage) },
  ),
);
