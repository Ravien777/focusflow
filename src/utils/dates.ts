const toDateStr = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const getTodayStr = (): string => toDateStr(new Date());

export const calculateStreak = (
  checkIns: Record<string, { done: boolean }>,
  scheduledDays: number[] = [0, 1, 2, 3, 4, 5, 6],
  frozenDays: string[] = [],
): number => {
  let streak = 0;
  const today = new Date();
  let current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayKey = toDateStr(current);

  const maxLookback = 365;
  let daysChecked = 0;

  if (!checkIns[todayKey]?.done && !frozenDays.includes(todayKey)) {
    current.setDate(current.getDate() - 1);
  }

  while (daysChecked < maxLookback) {
    const dayOfWeek = current.getDay();
    const isScheduled = scheduledDays.includes(dayOfWeek);
    const key = toDateStr(current);

    if (isScheduled) {
      if (checkIns[key]?.done || frozenDays.includes(key)) {
        streak++;
      } else {
        break;
      }
    }
    current.setDate(current.getDate() - 1);
    daysChecked++;
  }
  return streak;
};
