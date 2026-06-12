export interface AccentOption {
  key: string;
  name: string;
  color: string;
  icon: string;
}

export const ACCENT_OPTIONS: AccentOption[] = [
  { key: "blue", name: "Blue", color: "#3B82F6", icon: "water-outline" },
  { key: "purple", name: "Purple", color: "#8B5CF6", icon: "diamond-outline" },
  { key: "pink", name: "Pink", color: "#EC4899", icon: "heart-outline" },
  { key: "red", name: "Red", color: "#EF4444", icon: "flame-outline" },
  { key: "orange", name: "Orange", color: "#F97316", icon: "sunny-outline" },
  { key: "green", name: "Green", color: "#10B981", icon: "leaf-outline" },
  { key: "teal", name: "Teal", color: "#14B8A6", icon: "compass-outline" },
];

export const DEFAULT_ACCENT = "#3B82F6";

export const FONT_SCALES = [0.85, 0.925, 1, 1.1, 1.25] as const;

export const FONT_SCALE_LABELS: Record<number, string> = {
  0.85: "Small",
  0.925: "Medium",
  1: "Default",
  1.1: "Large",
  1.25: "Extra Large",
};
