import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "../../src/store/useStore";
import {
  scheduleDailyReminder,
  cancelAllReminders,
} from "../../src/utils/notifications";

export default function SettingsScreen() {
  const { reminderSettings, updateReminderTime, toggleReminder } = useStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleTimeChange = (
    type: "hour" | "minute",
    direction: "up" | "down",
  ) => {
    let newHour = reminderSettings.hour;
    let newMinute = reminderSettings.minute;

    if (type === "hour") {
      newHour =
        direction === "up" ? (newHour + 1) % 24 : (newHour - 1 + 24) % 24;
    } else {
      newMinute =
        direction === "up" ? (newMinute + 15) % 60 : (newMinute - 15 + 60) % 60;
    }
    updateReminderTime(newHour, newMinute);
  };

  const handleScheduleReminder = async () => {
    setIsUpdating(true);
    if (reminderSettings.enabled) {
      await scheduleDailyReminder(
        reminderSettings.hour,
        reminderSettings.minute,
      );
    } else {
      await cancelAllReminders();
    }
    setIsUpdating(false);
  };

  const handleTestNotification = async () => {
    await scheduleDailyReminder(
      new Date().getHours(),
      new Date().getMinutes() + 1,
    );
  };

  const formatTime = (h: number, m: number) => {
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 || 12;
    const displayM = String(m).padStart(2, "0");
    return `${displayH}:${displayM} ${period}`;
  };

  return (
    <View style={styles.container}>
      {/* ✅ Clear Mock Mode Banner */}
      <View style={styles.mockBanner}>
        <Ionicons name="information-circle-outline" size={16} color="#3B82F6" />
        <Text style={styles.mockText}>
          Test Mode • Using mock notifications (Expo Go)
        </Text>
      </View>

      <Text style={styles.title}>⚙️ Settings</Text>

      {/* Reminder Toggle Section */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Daily Check-In Reminder</Text>
          <Switch
            value={reminderSettings.enabled}
            onValueChange={toggleReminder}
            trackColor={{ false: "#333", true: "#3B82F6" }}
            thumbColor={reminderSettings.enabled ? "#fff" : "#888"}
            hitSlop={12}
          />
        </View>

        {reminderSettings.enabled && (
          <>
            <Text style={styles.subLabel}>
              Time: {formatTime(reminderSettings.hour, reminderSettings.minute)}
            </Text>
            <View style={styles.timeControl}>
              <Text style={styles.timeLabel}>Hour</Text>
              <View style={styles.timeButtons}>
                <TouchableOpacity
                  onPress={() => handleTimeChange("hour", "down")}
                  style={styles.timeBtn}
                >
                  <Text style={styles.timeBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.timeValue}>{reminderSettings.hour}</Text>
                <TouchableOpacity
                  onPress={() => handleTimeChange("hour", "up")}
                  style={styles.timeBtn}
                >
                  <Text style={styles.timeBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.timeControl}>
              <Text style={styles.timeLabel}>Minute</Text>
              <View style={styles.timeButtons}>
                <TouchableOpacity
                  onPress={() => handleTimeChange("minute", "down")}
                  style={styles.timeBtn}
                >
                  <Text style={styles.timeBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.timeValue}>
                  {String(reminderSettings.minute).padStart(2, "0")}
                </Text>
                <TouchableOpacity
                  onPress={() => handleTimeChange("minute", "up")}
                  style={styles.timeBtn}
                >
                  <Text style={styles.timeBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={handleScheduleReminder}
              disabled={isUpdating}
              activeOpacity={0.7}
            >
              <Text style={styles.applyBtnText}>
                {isUpdating ? "Updating..." : "Save Reminder Time"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={handleTestNotification}
        activeOpacity={0.7}
      >
        <Text style={styles.secondaryBtnText}>🔔 Send Test Notification</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20, paddingTop: 50 },
  mockBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    gap: 6,
  },
  mockText: { fontSize: 12, color: "#aaa", flex: 1 },
  title: { fontSize: 24, fontWeight: "800", color: "#fff", marginBottom: 20 },
  card: {
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#222",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: { fontSize: 18, color: "#fff", fontWeight: "600" },
  subLabel: {
    fontSize: 16,
    color: "#3B82F6",
    marginTop: 12,
    marginBottom: 8,
    fontWeight: "600",
  },
  timeControl: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  timeLabel: { fontSize: 16, color: "#aaa" },
  timeButtons: { flexDirection: "row", alignItems: "center", gap: 12 },
  timeBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  timeBtnText: { fontSize: 24, color: "#fff", fontWeight: "700" },
  timeValue: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
    minWidth: 40,
    textAlign: "center",
  },
  applyBtn: {
    marginTop: 16,
    backgroundColor: "#3B82F6",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  applyBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  secondaryBtn: {
    backgroundColor: "#222",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  secondaryBtnText: { color: "#aaa", fontSize: 16, fontWeight: "600" },
});
