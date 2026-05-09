import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useStore } from "../store/useStore";
import { Habit } from "../types";
import { getTodayStr } from "../utils/dates";

export const HabitCard = ({ habit }: { habit: Habit }) => {
  const toggleCheckIn = useStore((s) => s.toggleCheckIn);
  const deleteHabit = useStore((s) => s.deleteHabit);

  const today = getTodayStr();
  const isChecked = !!habit.checkIns[today];
  const progress = Math.min(habit.streak / habit.targetDays, 1);

  const handleDelete = () => {
    // ✅ Haptic warning before deletion
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert(
      "Delete Habit?",
      `Are you sure you want to delete "${habit.name}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteHabit(habit.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={[styles.card, { borderColor: habit.color }]}>
      <View style={styles.header}>
        <View
          style={[styles.iconWrap, { backgroundColor: `${habit.color}20` }]}
        >
          <Ionicons name={habit.icon as any} size={26} color={habit.color} />
        </View>

        <View style={styles.info}>
          <Text
            style={[styles.title, { color: isChecked ? habit.color : "#fff" }]}
          >
            {habit.name}
          </Text>
          <Text style={styles.streak}>
            🔥 {habit.streak} day{habit.streak !== 1 ? "s" : ""}
          </Text>
        </View>

        {/* ✅ Check-in Button */}
        <TouchableOpacity
          onPress={() => {
            toggleCheckIn(habit.id, today);
            Haptics.selectionAsync();
          }}
          style={[
            styles.checkBtn,
            isChecked && { backgroundColor: habit.color },
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

      {/* ✅ Progress Bar */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress * 100}%`, backgroundColor: habit.color },
          ]}
        />
      </View>
      <Text style={styles.progressText}>
        {habit.streak}/{habit.targetDays} days
      </Text>

      {/* ✅ Delete Button - Bottom Right, Large & Clear */}
      <TouchableOpacity
        onPress={handleDelete}
        style={styles.deleteBtn}
        hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        accessibilityLabel={`Delete ${habit.name}`}
        accessibilityRole="button"
      >
        <Ionicons name="trash-outline" size={18} color="#EF4444" />
        <Text style={styles.deleteText}></Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: "#111",
    position: "relative", // For absolute positioning of delete button
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingRight: 10, // Space for delete button
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
  streak: { fontSize: 14, color: "#aaa" },
  checkBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#222",
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
  progressText: { fontSize: 13, color: "#888", textAlign: "right" },

  // ✅ Delete Button Styles - ADHD Friendly
  deleteBtn: {
    position: "static",
    width: 40,
    // top: 100,
    // left: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#EF444433",
  },
  deleteText: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "600",
  },
});
