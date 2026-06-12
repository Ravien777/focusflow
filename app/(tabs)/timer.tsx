import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  AppState,
  AppStateStatus,
  Alert,
} from "react-native";
import { useKeepAwake } from "expo-keep-awake";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useStore } from "../../src/store/useStore";
import { useTheme } from "../../src/theme";
import { HabitPicker } from "../../src/components/HabitPicker";
import { isFeatureUnlocked } from "../../src/utils/subscription";

export default function TimerScreen() {
  const focusMinutes = useStore((s) => s.focusMinutes);
  const breakMinutes = useStore((s) => s.breakMinutes);
  const addFocusedTime = useStore((s) => s.addFocusedTime);
  const isPremium = useStore((s) => s.isPremium);
  const theme = useTheme(useStore((s) => s.theme));
  const router = useRouter();

  const focusRef = useRef(focusMinutes);
  const breakRef = useRef(breakMinutes);
  focusRef.current = focusMinutes;
  breakRef.current = breakMinutes;

  const [timeLeft, setTimeLeft] = useState(
    isPremium ? focusMinutes * 60 : 25 * 60,
  );
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [sessions, setSessions] = useState(0);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [showHabitPicker, setShowHabitPicker] = useState(false);

  const selectedHabit = useStore(
    (s) => s.habits.find((h) => h.id === selectedHabitId) ?? null,
  );

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const habitIdRef = useRef(selectedHabitId);
  habitIdRef.current = selectedHabitId;

  const sessionStartTime = useRef<number | null>(null);

  useKeepAwake();

  useEffect(() => {
    if (isPremium) {
      setTimeLeft(focusMinutes * 60);
    }
  }, [focusMinutes, isPremium]);

  useEffect(() => {
    if (isRunning) {
      sessionStartTime.current = Date.now();
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (habitIdRef.current && sessionStartTime.current) {
        const elapsed = Math.round((Date.now() - sessionStartTime.current) / 60000);
        if (elapsed > 0) {
          addFocusedTime(habitIdRef.current, elapsed);
        }
      }
      sessionStartTime.current = null;

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
              setTimeLeft(breakRef.current * 60);
            } else {
              setMode("focus");
              setTimeLeft(isPremium ? focusRef.current * 60 : 25 * 60);
            }
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          },
        },
      ]);
    }
  }, [timeLeft, isRunning, mode, addFocusedTime, isPremium]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state: AppStateStatus) => {
      if (state === "background" && isRunning) {
        setIsRunning(false);
      }
    });
    return () => sub.remove();
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const toggleTimer = () => {
    if (!isRunning && mode === "focus" && !selectedHabitId) {
      setShowHabitPicker(true);
      return;
    }
    Haptics.selectionAsync();
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRunning(false);
    sessionStartTime.current = null;
    setMode("focus");
    setTimeLeft(isPremium ? focusRef.current * 60 : 25 * 60);
  };

  const handlePickHabit = useCallback((id: string | null) => {
    setSelectedHabitId(id);
    setShowHabitPicker(false);
    Haptics.selectionAsync();
    setIsRunning(true);
  }, []);

  const primaryColor = mode === "focus" ? theme.accent : theme.success;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.modeLabel, { color: primaryColor }]}>
        {mode === "focus" ? "🎯 FOCUS" : "☕ BREAK"}
      </Text>

      <Text style={[styles.timeText, { color: theme.text }]}>
        {formatTime(timeLeft)}
      </Text>
      <Text style={[styles.sessionText, { color: theme.textMuted }]}>
        Sessions completed: {sessions}
      </Text>

      {!isPremium && (
        <TouchableOpacity
          style={[styles.premiumBadge, { backgroundColor: `${theme.accent}15`, borderColor: theme.accent }]}
          onPress={() => router.push("/(paywall)")}
          activeOpacity={0.7}
        >
          <Ionicons name="diamond-outline" size={14} color={theme.accent} />
          <Text style={[styles.premiumBadgeText, { color: theme.accent }]}>
            Premium — Custom intervals & unlimited focus tracking
          </Text>
        </TouchableOpacity>
      )}

      {selectedHabit && (
        <View style={[styles.focusedHabitBadge, { backgroundColor: `${selectedHabit.color}20`, borderColor: selectedHabit.color }]}>
          <Ionicons name={selectedHabit.icon as any} size={16} color={selectedHabit.color} />
          <Text style={[styles.focusedHabitText, { color: selectedHabit.color }]}>
            Focusing on: {selectedHabit.name}
          </Text>
        </View>
      )}

      {mode === "focus" && !isRunning && !selectedHabitId && (
        <Text style={[styles.pickHint, { color: theme.textMuted }]}>
          Tap START to pick a habit
        </Text>
      )}

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: primaryColor }]}
          onPress={toggleTimer}
          activeOpacity={0.7}
          hitSlop={{ top: 20, bottom: 20, left: 30, right: 30 }}
          accessibilityLabel={isRunning ? "Pause timer" : "Start timer"}
          accessibilityRole="button"
        >
          <Text style={styles.btnText}>
            {isRunning ? "PAUSE" : "START"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btnSecondary,
            { backgroundColor: theme.btnSecondaryBg },
          ]}
          onPress={resetTimer}
          activeOpacity={0.7}
          hitSlop={{ top: 20, bottom: 20, left: 30, right: 30 }}
          accessibilityLabel="Reset timer"
          accessibilityRole="button"
        >
          <Text
            style={[styles.btnSecondaryText, { color: theme.btnSecondaryText }]}
          >
            RESET
          </Text>
        </TouchableOpacity>
      </View>

      {showHabitPicker && (
        <HabitPicker
          selectedId={selectedHabitId}
          onSelect={handlePickHabit}
          onClose={() => setShowHabitPicker(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontVariant: ["tabular-nums"],
    marginBottom: 8,
  },
  sessionText: {
    fontSize: 16,
    marginBottom: 16,
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  premiumBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  focusedHabitBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  focusedHabitText: {
    fontSize: 14,
    fontWeight: "600",
  },
  pickHint: {
    fontSize: 14,
    marginBottom: 16,
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
    justifyContent: "center",
    alignItems: "center",
  },
  btnSecondaryText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
