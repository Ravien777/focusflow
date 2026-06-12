export interface CheckInValue {
  done: boolean;
  note?: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  createdAt: string;
  checkIns: Record<string, CheckInValue>;
  streak: number;
  targetDays: number;
  archived: boolean;
  scheduledDays: number[];
  focusedMinutes: number;
  frozenDays: string[];
  lastModified: number;
}

export interface UserInfo {
  uid: string;
  email: string;
  displayName: string;
}

export interface AppState {
  habits: Habit[];
  theme: "system" | "light" | "dark";
  hasOnboarded: boolean;
  xp: number;
  level: number;
  earnedBadges: string[];
  reminderSettings: { enabled: boolean; hour: number; minute: number };
  focusMinutes: number;
  breakMinutes: number;
  user: UserInfo | null;
  isPremium: boolean;
  accentColor: string;
  fontScale: number;
  isLoading: boolean;
  addHabit: (
    habit: Omit<
      Habit,
      "id" | "createdAt" | "checkIns" | "streak" | "targetDays" | "archived" | "scheduledDays" | "focusedMinutes" | "frozenDays" | "lastModified"
    > & { scheduledDays?: number[] },
  ) => void;
  toggleCheckIn: (id: string, date: string) => void;
  updateCheckInNote: (id: string, date: string, note: string) => void;
  addFocusedTime: (id: string, minutes: number) => void;
  archiveHabit: (id: string) => void;
  unarchiveHabit: (id: string) => void;
  deleteHabitPermanently: (id: string) => void;
  updateHabit: (id: string, updates: Partial<Omit<Habit, "id" | "createdAt">>) => void;
  setTheme: (theme: AppState["theme"]) => void;
  seedHabits: () => void;
  completeOnboarding: () => void;
  updateReminderTime: (hour: number, minute: number) => void;
  toggleReminder: () => void;
  setFocusMinutes: (minutes: number) => void;
  setBreakMinutes: (minutes: number) => void;
  awardXP: (amount: number) => void;
  checkAndAwardBadges: () => void;
  setUser: (user: UserInfo | null) => void;
  setPremium: (isPremium: boolean) => void;
  setAccentColor: (color: string) => void;
  setFontScale: (scale: number) => void;
  freezeDay: (habitId: string, date: string) => void;
  syncFromCloud: (habits: Habit[], xp: number, earnedBadges: string[]) => void;
  setLoading: (isLoading: boolean) => void;
}
