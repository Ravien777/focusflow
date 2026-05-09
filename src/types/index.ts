export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  createdAt: string;
  checkIns: Record<string, boolean>;
  streak: number;
  targetDays: number;
}

// ✅ Fixed: Added reminderSettings & its methods to the interface
export interface AppState {
  habits: Habit[];
  theme: "light" | "dark" | "high-contrast";
  reminderSettings: { enabled: boolean; hour: number; minute: number };
  addHabit: (
    habit: Omit<
      Habit,
      "id" | "createdAt" | "checkIns" | "streak" | "targetDays"
    >,
  ) => void;
  toggleCheckIn: (id: string, date: string) => void;
  deleteHabit: (id: string) => void;
  setTheme: (theme: AppState["theme"]) => void;
  seedHabits: () => void;
  updateReminderTime: (hour: number, minute: number) => void;
  toggleReminder: () => void;
}
