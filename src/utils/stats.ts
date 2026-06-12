import { Habit, CheckInValue } from "../types";

export interface WeeklyData {
  day: string;
  date: string;
  completed: number;
  total: number;
}

export interface HeatmapCell {
  date: string;
  count: number;
  dayOfWeek: number;
  weekOffset: number;
}

export interface TrendData {
  weekLabel: string;
  rate: number;
  count: number;
}

export function getCompletionRate(habit: Habit, days: number): number {
  const now = new Date();
  let checked = 0;
  let total = 0;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = dateToStr(d);
    const dayOfWeek = d.getDay();
    if (habit.scheduledDays.includes(dayOfWeek)) {
      total++;
      if (habit.checkIns[key]?.done) checked++;
    }
  }
  return total === 0 ? 0 : checked / total;
}

export function getLongestStreak(habit: Habit): number {
  if (Object.keys(habit.checkIns).length === 0) return 0;
  const sortedDates = Object.entries(habit.checkIns)
    .filter(([, v]) => v.done)
    .map(([k]) => k)
    .sort();
  if (sortedDates.length === 0) return 0;

  let maxStreak = 1;
  let currentStreak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1]);
    const curr = new Date(sortedDates[i]);
    const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (Math.round(diffDays) === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  return maxStreak;
}

export function getTotalCheckIns(habit: Habit): number {
  return Object.values(habit.checkIns).filter((v) => v.done).length;
}

export function getWeeklyData(habit: Habit): WeeklyData[] {
  const data: WeeklyData[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = dateToStr(d);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    data.push({
      day: dayNames[d.getDay()],
      date: key,
      completed: habit.checkIns[key]?.done ? 1 : 0,
      total: 1,
    });
  }
  return data;
}

export function getHeatmapData(habit: Habit): HeatmapCell[] {
  const cells: HeatmapCell[] = [];
  const now = new Date();
  const weeks = 12;
  const days = weeks * 7;

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = dateToStr(d);
    cells.push({
      date: key,
      count: habit.checkIns[key]?.done ? 1 : 0,
      dayOfWeek: d.getDay(),
      weekOffset: Math.floor(i / 7),
    });
  }
  return cells;
}

export function getAggregatedStats(habits: Habit[]) {
  const active = habits.filter((h) => !h.archived);
  const totalCheckIns = active.reduce((sum, h) => sum + getTotalCheckIns(h), 0);
  const avgCompletion =
    active.length === 0
      ? 0
      : active.reduce((sum, h) => sum + getCompletionRate(h, 7), 0) /
        active.length;
  const totalFocusedMinutes = active.reduce(
    (sum, h) => sum + (h.focusedMinutes || 0),
    0,
  );
  const bestStreak = active.reduce(
    (max, h) => Math.max(max, getLongestStreak(h)),
    0,
  );

  return { totalCheckIns, avgCompletion, totalFocusedMinutes, bestStreak };
}

export function getTrendData(habit: Habit): TrendData[] {
  const data: TrendData[] = [];
  const now = new Date();
  for (let w = 7; w >= 0; w--) {
    let count = 0;
    let total = 0;
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - w * 7 - 6);
    for (let d = 0; d < 7; d++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + d);
      const key = dateToStr(day);
      if (habit.scheduledDays.includes(day.getDay())) {
        total++;
        if (habit.checkIns[key]?.done) count++;
      }
    }
    const label = `W${Math.abs(w - 7)}`;
    data.push({
      weekLabel: label,
      rate: total > 0 ? count / total : 0,
      count,
    });
  }
  return data;
}

export function predictStreak(habit: Habit): number {
  const recent = getCompletionRate(habit, 30);
  if (recent === 0) return 0;
  const currentStreak = habit.streak;
  const predicted = Math.round(currentStreak + currentStreak * recent * 0.5);
  return Math.max(currentStreak, predicted);
}

export function generateCSV(habits: Habit[]): string {
  const rows: string[] = ["Habit,Date,Done,Note"];
  for (const h of habits.filter((h) => !h.archived)) {
    for (const [date, checkIn] of Object.entries(h.checkIns)) {
      rows.push(
        `"${h.name}",${date},${checkIn.done},"${(checkIn.note ?? "").replace(/"/g, '""')}"`,
      );
    }
  }
  return rows.join("\n");
}

function dateToStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
