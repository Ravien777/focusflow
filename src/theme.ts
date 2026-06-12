import { useColorScheme } from "react-native";
import { useStore } from "./store/useStore";

export const themes = {
  dark: {
    bg: "#000",
    card: "#111",
    cardBorder: "#222",
    text: "#fff",
    textMuted: "#888",
    accent: "#3B82F6",
    iconBg: "rgba(255,255,255,0.05)",
    progressTrack: "#333",
    inputBg: "#111",
    tabBarBg: "#000",
    tabBarBorder: "#222",
    btnSecondaryBg: "#222",
    btnSecondaryText: "#AAA",
    danger: "#EF4444",
    success: "#10B981",
    warning: "#F59E0B",
  },
  light: {
    bg: "#F5F5F5",
    card: "#FFF",
    cardBorder: "#E5E5E5",
    text: "#111",
    textMuted: "#888",
    accent: "#3B82F6",
    iconBg: "rgba(0,0,0,0.05)",
    progressTrack: "#E5E5E5",
    inputBg: "#FFF",
    tabBarBg: "#FFF",
    tabBarBorder: "#E5E5E5",
    btnSecondaryBg: "#E5E5E5",
    btnSecondaryText: "#666",
    danger: "#EF4444",
    success: "#10B981",
    warning: "#F59E0B",
  },
};

export type ThemeKey = "system" | "light" | "dark";
export type ThemeColors = typeof themes.dark;

export function useTheme(themeKey: ThemeKey): ThemeColors {
  const systemScheme = useColorScheme();
  const resolved: "light" | "dark" =
    themeKey === "system"
      ? systemScheme === "light"
        ? "light"
        : "dark"
      : themeKey;
  const accentColor = useStore((s) => s.accentColor);
  return { ...themes[resolved], accent: accentColor };
}
