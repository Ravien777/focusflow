// ✅ PURE MOCK IMPLEMENTATION - Works in Expo Go
// When you switch to a dev build, we'll replace this with the real expo-notifications code

import { Alert } from "react-native";

// Mock: No-op for Android channels
export async function setupNotificationChannels() {
  console.log("🔔 [Mock] Notification channels setup skipped (Expo Go)");
}

// Mock: Auto-approve permissions
export async function requestNotificationPermission() {
  return true;
}

// Mock: Show alert instead of scheduling real notification
export async function scheduleDailyReminder(hour: number, minute: number) {
  const formattedTime = `${hour}:${String(minute).padStart(2, "0")}`;

  Alert.alert(
    "🔔 Mock Reminder Scheduled",
    `In a real build, FocusFlow would notify you daily at ${formattedTime}\n\n✅ Your reminder preferences are saved and will work automatically when you create a development build.`,
    [{ text: "Got it", style: "default" }],
  );
  return true;
}

// Mock: Show confirmation alert
export async function cancelAllReminders() {
  Alert.alert(
    "🗑️ Mock Reminder Cancelled",
    "Notifications disabled. This will work with real system notifications in a development build.",
    [{ text: "OK" }],
  );
}

// Helper for UI: Always true in mock mode
export const isLikelyMockMode = async (): Promise<boolean> => true;
