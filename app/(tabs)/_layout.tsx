import { useEffect } from "react";
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStore } from "../../src/store/useStore";
import { useTheme } from "../../src/theme";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme(useStore((s) => s.theme));
  const hasOnboarded = useStore((s) => s.hasOnboarded);
  const isLoading = useStore((s) => s.isLoading);

  useEffect(() => {
    if (!isLoading && !hasOnboarded) {
      router.replace("/onboarding");
    }
  }, [hasOnboarded, isLoading]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBarBg,
          borderTopColor: theme.tabBarBorder,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600", marginBottom: 4 },
        tabBarIconStyle: { marginTop: 4 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Habits",
          tabBarIcon: ({ color }) => (
            <Ionicons name="checkmark-circle-outline" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: "Timer",
          tabBarIcon: ({ color }) => (
            <Ionicons name="timer-outline" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color }) => (
            <Ionicons name="stats-chart-outline" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
