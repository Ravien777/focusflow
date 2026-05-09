export const getTodayStr = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const calculateStreak = (checkIns: Record<string, boolean>): number => {
  let streak = 0;
  const today = new Date();
  let current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;

  // Start counting from today if checked, else from yesterday
  if (!checkIns[todayKey]) current.setDate(current.getDate() - 1);

  while (true) {
    const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
    if (checkIns[key]) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
};