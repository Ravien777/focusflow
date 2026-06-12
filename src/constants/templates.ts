export interface HabitTemplate {
  name: string;
  icon: string;
  color: string;
  scheduledDays: number[];
}

export interface TemplateSet {
  id: string;
  title: string;
  description: string;
  icon: string;
  habits: HabitTemplate[];
}

export const TEMPLATES: TemplateSet[] = [
  {
    id: "morning-routine",
    title: "Morning Routine",
    description: "Start your day right with these essential habits",
    icon: "sunny-outline",
    habits: [
      { name: "Wake Up Early", icon: "alarm-outline", color: "#F59E0B", scheduledDays: [0, 1, 2, 3, 4, 5, 6] },
      { name: "Meditate", icon: "leaf-outline", color: "#10B981", scheduledDays: [0, 1, 2, 3, 4, 5, 6] },
      { name: "Drink Water", icon: "water-outline", color: "#3B82F6", scheduledDays: [0, 1, 2, 3, 4, 5, 6] },
      { name: "Stretch", icon: "fitness-outline", color: "#8B5CF6", scheduledDays: [1, 2, 3, 4, 5] },
    ],
  },
  {
    id: "fitness",
    title: "Get Fit",
    description: "Build a stronger, healthier body",
    icon: "barbell-outline",
    habits: [
      { name: "Workout", icon: "barbell-outline", color: "#EF4444", scheduledDays: [1, 2, 3, 4, 5] },
      { name: "10k Steps", icon: "walk-outline", color: "#10B981", scheduledDays: [0, 1, 2, 3, 4, 5, 6] },
      { name: "Drink 8 Glasses Water", icon: "water-outline", color: "#3B82F6", scheduledDays: [0, 1, 2, 3, 4, 5, 6] },
      { name: "Sleep 8 Hours", icon: "bed-outline", color: "#8B5CF6", scheduledDays: [0, 1, 2, 3, 4, 5, 6] },
    ],
  },
  {
    id: "read-more",
    title: "Read More",
    description: "Cultivate a daily reading habit",
    icon: "book-outline",
    habits: [
      { name: "Read 10 Pages", icon: "book-outline", color: "#3B82F6", scheduledDays: [0, 1, 2, 3, 4, 5, 6] },
      { name: "Read 30 Mins", icon: "time-outline", color: "#8B5CF6", scheduledDays: [0, 1, 2, 3, 4, 5, 6] },
      { name: "Journal", icon: "document-text-outline", color: "#10B981", scheduledDays: [0, 1, 2, 3, 4, 5, 6] },
    ],
  },
  {
    id: "mental-health",
    title: "Mental Health",
    description: "Prioritize your mind and emotional wellbeing",
    icon: "heart-outline",
    habits: [
      { name: "Meditate", icon: "leaf-outline", color: "#10B981", scheduledDays: [0, 1, 2, 3, 4, 5, 6] },
      { name: "No Social Media", icon: "close-circle-outline", color: "#EF4444", scheduledDays: [1, 2, 3, 4, 5] },
      { name: "Gratitude Journal", icon: "heart-outline", color: "#F59E0B", scheduledDays: [0, 1, 2, 3, 4, 5, 6] },
      { name: "Walk Outside", icon: "walk-outline", color: "#3B82F6", scheduledDays: [0, 1, 2, 3, 4, 5, 6] },
    ],
  },
  {
    id: "productivity",
    title: "Deep Work",
    description: "Maximize your focus and get things done",
    icon: "rocket-outline",
    habits: [
      { name: "Plan the Day", icon: "list-outline", color: "#F59E0B", scheduledDays: [1, 2, 3, 4, 5] },
      { name: "Focus Session", icon: "timer-outline", color: "#3B82F6", scheduledDays: [1, 2, 3, 4, 5] },
      { name: "No Phone First Hour", icon: "phone-portrait-outline", color: "#EF4444", scheduledDays: [1, 2, 3, 4, 5] },
      { name: "Review & Reflect", icon: "eye-outline", color: "#10B981", scheduledDays: [1, 2, 3, 4, 5] },
    ],
  },
];
