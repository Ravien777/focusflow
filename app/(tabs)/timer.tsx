import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  AppState,
  AppStateStatus,
  Alert,
} from "react-native";
import { useKeepAwake } from "expo-keep-awake"; // ✅ Modern Hook
import * as Haptics from "expo-haptics";

const FOCUS_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

export default function TimerScreen() {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [sessions, setSessions] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ✅ 1. Activate Keep Awake using the Hook
  // This keeps the screen on as long as this screen is visible (User is on the Timer tab)
  useKeepAwake();

  // ⏱️ 2. Start/Pause the countdown (Simplified without keep-awake logic)
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    // Cleanup when component unmounts or isRunning changes
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // 🎉 3. Handle timer completion
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      const isFocusMode = mode === "focus";
      const title = isFocusMode ? "🎉 Focus Done!" : "☕ Break Over!";
      const message = isFocusMode
        ? "Great work! Time for a short break."
        : "Ready to focus again?";

      Alert.alert(title, message, [
        {
          text: "OK",
          onPress: () => {
            if (isFocusMode) {
              setSessions((s) => s + 1);
              setMode("break");
              setTimeLeft(BREAK_TIME);
            } else {
              setMode("focus");
              setTimeLeft(FOCUS_TIME);
            }
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          },
        },
      ]);
    }
  }, [timeLeft, isRunning, mode]);

  // 📱 4. Pause automatically if app goes to background
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state: AppStateStatus) => {
      if (state === "background" && isRunning) {
        setIsRunning(false);
      }
    });
    return () => sub.remove();
  }, [isRunning]);

  // 🔢 Format seconds → MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // 👆 Button handlers
  const toggleTimer = () => {
    Haptics.selectionAsync();
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRunning(false);
    setMode("focus");
    setTimeLeft(FOCUS_TIME);
  };

  const primaryColor = mode === "focus" ? "#3B82F6" : "#10B981";

  return (
    <View style={styles.container}>
      <Text style={[styles.modeLabel, { color: primaryColor }]}>
        {mode === "focus" ? "🎯 FOCUS" : "☕ BREAK"}
      </Text>

      <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
      <Text style={styles.sessionText}>Sessions completed: {sessions}</Text>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: primaryColor }]}
          onPress={toggleTimer}
          activeOpacity={0.7}
          hitSlop={{ top: 20, bottom: 20, left: 30, right: 30 }}
          accessibilityLabel={isRunning ? "Pause timer" : "Start timer"}
          accessibilityRole="button"
        >
          <Text style={styles.btnText}>{isRunning ? "PAUSE" : "START"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={resetTimer}
          activeOpacity={0.7}
          hitSlop={{ top: 20, bottom: 20, left: 30, right: 30 }}
          accessibilityLabel="Reset timer"
          accessibilityRole="button"
        >
          <Text style={styles.btnSecondaryText}>RESET</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modeLabel: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 12,
  },
  timeText: {
    fontSize: 80,
    fontWeight: "900",
    color: "#FFFFFF",
    fontVariant: ["tabular-nums"],
    marginBottom: 8,
  },
  sessionText: {
    fontSize: 16,
    color: "#888",
    marginBottom: 40,
  },
  controls: {
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
  btn: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 1,
  },
  btnSecondary: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  btnSecondaryText: {
    color: "#AAA",
    fontSize: 18,
    fontWeight: "600",
  },
});
