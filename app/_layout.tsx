import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { setupNotificationChannels } from "../src/utils/notifications";
import { useEffect } from "react";

export default function RootLayout() {
  // ✅ Run once when app starts
  useEffect(() => {
    setupNotificationChannels();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#000" },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="habit/add" options={{ presentation: "modal" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
