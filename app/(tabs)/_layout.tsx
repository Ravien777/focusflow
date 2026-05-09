import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // ✅ Import this

export default function TabLayout() {
  // 1. Detect the system navigation height (0 on old phones, ~20-40 on new ones)
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopColor: "#222",
          // 2. Dynamically adjust height & padding to sit ABOVE system buttons
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          // Ensure the bar stays at the very bottom
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0, // Removes default Android shadow for flatter look
        },
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#888",
        // 3. Adjust label/icon positioning for the larger touch area
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
