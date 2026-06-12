import { Habit } from "../types";
import { getTotalCheckIns, getCompletionRate, getLongestStreak } from "./stats";

export const XP_PER_CHECKIN = 10;
export const XP_STREAK_BONUS = 50;

export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 50)) + 1;
}

export function xpForNextLevel(level: number): number {
  return level * level * 50;
}

export interface BadgeDef {
  id: string;
  name: string;
  icon: string;
  description: string;
  condition: (habits: Habit[], xp: number) => boolean;
}

export const BADGES: BadgeDef[] = [
  {
    id: "first_checkin",
    name: "First Step",
    icon: "footsteps-outline",
    description: "Complete your first check-in",
    condition: (_, xp) => xp >= XP_PER_CHECKIN,
  },
  {
    id: "week_streak",
    name: "Week Warrior",
    icon: "flame",
    description: "Reach a 7-day streak on any habit",
    condition: (habits) => habits.some((h) => getLongestStreak(h) >= 7),
  },
  {
    id: "month_streak",
    name: "Monthly Master",
    icon: "trophy-outline",
    description: "Reach a 30-day streak on any habit",
    condition: (habits) => habits.some((h) => getLongestStreak(h) >= 30),
  },
  {
    id: "centurion",
    name: "Centurion",
    icon: "shield-checkmark-outline",
    description: "Complete 100 total check-ins",
    condition: (habits) =>
      habits.reduce((s, h) => s + getTotalCheckIns(h), 0) >= 100,
  },
  {
    id: "perfect_week",
    name: "Perfect Week",
    icon: "calendar-outline",
    description: "Check in on all scheduled habits for 7 days",
    condition: (habits) => {
      const active = habits.filter((h) => !h.archived);
      if (active.length === 0) return false;
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = dateToStr(d);
        const dayOfWeek = d.getDay();
        for (const h of active) {
          if (h.scheduledDays.includes(dayOfWeek) && !h.checkIns[key]?.done) {
            return false;
          }
        }
      }
      return true;
    },
  },
  {
    id: "consistency",
    name: "Consistency King",
    icon: "diamond-outline",
    description: "Maintain 90%+ completion rate over 30 days",
    condition: (habits) => {
      const active = habits.filter((h) => !h.archived);
      if (active.length === 0) return false;
      return (
        active.reduce((sum, h) => sum + getCompletionRate(h, 30), 0) /
          active.length >=
        0.9
      );
    },
  },
  {
    id: "focus_master",
    name: "Focus Master",
    icon: "timer-outline",
    description: "Log 10+ hours of focused timer time",
    condition: (habits) =>
      habits.reduce((s, h) => s + (h.focusedMinutes || 0), 0) >= 600,
  },
  {
    id: "ten_streak",
    name: "Double Digits",
    icon: "trending-up-outline",
    description: "Reach a 10-day streak on any habit",
    condition: (habits) => habits.some((h) => getLongestStreak(h) >= 10),
  },
];

export function checkNewBadges(
  habits: Habit[],
  xp: number,
  currentBadges: string[],
): string[] {
  return BADGES.filter(
    (b) =>
      !currentBadges.includes(b.id) && b.condition(habits, xp),
  ).map((b) => b.id);
}

function dateToStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
