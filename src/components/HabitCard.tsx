import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useStore } from "../store/useStore";
import { Habit } from "../types";
import { getTodayStr } from "../utils/dates";
import { useTheme } from "../theme";
import { XP_PER_CHECKIN } from "../utils/gamification";
import { NoteModal } from "./NoteModal";

const DAY_ABBR = ["S", "M", "T", "W", "T", "F", "S"];

export const HabitCard = ({ habit }: { habit: Habit }) => {
  const toggleCheckIn = useStore((s) => s.toggleCheckIn);
  const archiveHabit = useStore((s) => s.archiveHabit);
  const freezeDay = useStore((s) => s.freezeDay);
  const isPremium = useStore((s) => s.isPremium);
  const router = useRouter();
  const theme = useTheme(useStore((s) => s.theme));

  const [showNoteModal, setShowNoteModal] = useState(false);

  const today = getTodayStr();
  const todayCheckIn = habit.checkIns[today];
  const isChecked = todayCheckIn?.done ?? false;
  const hasNote = !!todayCheckIn?.note;
  const isFrozen = habit.frozenDays.includes(today);
  const progress = Math.min(habit.streak / habit.targetDays, 1);

  const canFreeze =
    isPremium &&
    !isChecked &&
    !isFrozen &&
    habit.scheduledDays.includes(new Date().getDay());

  const handleArchive = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Archive Habit?",
      `"${habit.name}" will be hidden from your dashboard. You can restore it from Settings.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Archive",
          style: "destructive",
          onPress: () => {
            archiveHabit(habit.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleEdit = () => {
    router.push({
      pathname: "/habit/add",
      params: {
        id: habit.id,
        name: habit.name,
        icon: habit.icon,
        color: habit.color,
        scheduledDays: habit.scheduledDays.join(","),
      },
    });
  };

  const handleCheckIn = useCallback(() => {
    toggleCheckIn(habit.id, today);
    Haptics.selectionAsync();
  }, [habit.id, today, toggleCheckIn]);

  const handleNotePress = useCallback(() => {
    if (!isPremium) {
      router.push("/(paywall)");
      return;
    }
    setShowNoteModal(true);
  }, [isPremium, router]);

  const handleFreeze = () => {
    freezeDay(habit.id, today);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={[styles.card, { borderColor: habit.color, backgroundColor: theme.card }]}>
      <View style={styles.header}>
        <View
          style={[styles.iconWrap, { backgroundColor: `${habit.color}20` }]}
        >
          <Ionicons name={habit.icon as any} size={26} color={habit.color} />
        </View>

        <View style={styles.info}>
          <Text
            style={[styles.title, { color: isChecked ? habit.color : theme.text }]}
          >
            {habit.name}
          </Text>
          <Text style={[styles.streak, { color: theme.textMuted }]}>
            🔥 {habit.streak} day{habit.streak !== 1 ? "s" : ""}
          </Text>
          <Text style={[styles.xpText, { color: theme.textMuted }]}>
            +{XP_PER_CHECKIN} XP / check-in
          </Text>
        </View>

        <View style={styles.checkinGroup}>
          {isFrozen && (
            <View style={[styles.frozenBadge, { backgroundColor: `${theme.accent}20` }]}>
              <Ionicons name="snow" size={14} color={theme.accent} />
            </View>
          )}
          {isChecked && (
            <TouchableOpacity
              onPress={handleNotePress}
              style={[styles.noteBtn, { backgroundColor: theme.btnSecondaryBg }]}
              hitSlop={8}
              accessibilityLabel={`Note for ${habit.name}`}
              accessibilityRole="button"
            >
              <Ionicons
                name={hasNote ? "document-text" : "document-text-outline"}
                size={18}
                color={hasNote ? habit.color : theme.textMuted}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleCheckIn}
            style={[
              styles.checkBtn,
              { backgroundColor: isChecked ? habit.color : theme.btnSecondaryBg },
            ]}
            hitSlop={12}
            accessibilityLabel={
              isChecked ? `Uncheck ${habit.name}` : `Check in ${habit.name}`
            }
            accessibilityRole="button"
          >
            <Ionicons
              name={isChecked ? "checkmark" : "add"}
              size={22}
              color={isChecked ? "#fff" : habit.color}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress * 100}%`, backgroundColor: habit.color },
          ]}
        />
      </View>
      <Text style={[styles.progressText, { color: theme.textMuted }]}>
        {habit.streak}/{habit.targetDays} days
      </Text>

      <View style={styles.daysRow}>
        {DAY_ABBR.map((day, index) => {
          const active = habit.scheduledDays.includes(index);
          return (
            <View
              key={index}
              style={[
                styles.dayIndicator,
                {
                  backgroundColor: active ? `${habit.color}30` : "transparent",
                  borderColor: active ? habit.color : theme.cardBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  { color: active ? habit.color : theme.textMuted },
                ]}
              >
                {day}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={handleEdit}
          style={[styles.actionBtn, { backgroundColor: theme.btnSecondaryBg }]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={`Edit ${habit.name}`}
          accessibilityRole="button"
        >
          <Ionicons name="pencil-outline" size={16} color={theme.accent} />
        </TouchableOpacity>
        {canFreeze && (
          <TouchableOpacity
            onPress={handleFreeze}
            style={[styles.actionBtn, { backgroundColor: `${theme.accent}20` }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Freeze streak"
            accessibilityRole="button"
          >
            <Ionicons name="snow-outline" size={16} color={theme.accent} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleArchive}
          style={[styles.actionBtn, { backgroundColor: theme.btnSecondaryBg }]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={`Archive ${habit.name}`}
          accessibilityRole="button"
        >
          <Ionicons name="trash-outline" size={16} color={theme.danger} />
        </TouchableOpacity>
      </View>

      {showNoteModal && (
        <NoteModal
          habitId={habit.id}
          date={today}
          currentNote={todayCheckIn?.note ?? ""}
          onClose={() => setShowNoteModal(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  info: { flex: 1 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 2 },
  streak: { fontSize: 14 },
  xpText: { fontSize: 11, marginTop: 1 },
  checkinGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  frozenBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  noteBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#333",
    overflow: "hidden",
    marginBottom: 4,
  },
  progressFill: { height: "100%", borderRadius: 4 },
  progressText: { fontSize: 13, textAlign: "right" },
  daysRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: 8,
  },
  dayIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  dayText: {
    fontSize: 11,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
