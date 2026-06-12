import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useStore } from "../src/store/useStore";
import { useTheme } from "../src/theme";
import { onAuthChange } from "../src/services/auth";
import { initialSync } from "../src/services/sync";
import {
  setupNotificationChannels,
  requestNotificationPermission,
} from "../src/utils/notifications";

export default function RootLayout() {
  const theme = useTheme(useStore((s) => s.theme));
  const setUser = useStore((s) => s.setUser);
  const user = useStore((s) => s.user);

  useEffect(() => {
    setupNotificationChannels();
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    try {
      const unsub = onAuthChange((fbUser) => {
        setUser(fbUser);
      });
      return unsub;
    } catch {
      setUser(null);
      return () => {};
    }
  }, [setUser]);

  useEffect(() => {
    if (user) {
      initialSync();
    }
  }, [user?.uid]);

  return (
    <SafeAreaProvider>
      <StatusBar style={theme.bg === "#000" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.bg },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(paywall)" />
        <Stack.Screen
          name="habit/add"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="habit/templates"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="onboarding"
          options={{ animation: "fade" }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
