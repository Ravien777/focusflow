import { Habit } from "../types";
import { useStore } from "../store/useStore";

export const FREE_HABIT_LIMIT = 5;

export function canAddHabit(): boolean {
  const state = useStore.getState();
  if (state.isPremium) return true;
  const activeCount = state.habits.filter((h) => !h.archived).length;
  return activeCount < FREE_HABIT_LIMIT;
}

export function isPremiumFeature(feature: string): boolean {
  const state = useStore.getState();
  if (state.isPremium) return true;
  return false;
}

export const PREMIUM_FEATURES = {
  sync: "Cloud Sync",
  customIntervals: "Custom Timer Intervals",
  notes: "Habit Notes & Journaling",
  templates: "Unlimited Templates",
  themes: "Custom Themes & Accents",
  advancedStats: "Advanced Analytics & CSV Export",
  streakFreeze: "Streak Freeze",
} as const;

export function isFeatureUnlocked(feature: keyof typeof PREMIUM_FEATURES): boolean {
  const state = useStore.getState();
  if (state.isPremium) return true;

  const freeFeatures: Partial<Record<keyof typeof PREMIUM_FEATURES, boolean>> = {
    templates: true,
  };

  return freeFeatures[feature] ?? false;
}
