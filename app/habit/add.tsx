import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "../../src/store/useStore";
import { useTheme } from "../../src/theme";

const ICONS = [
  "water-outline",
  "book-outline",
  "fitness-outline",
  "walk-outline",
  "bed-outline",
  "restaurant-outline",
];
const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
];
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function AddHabitScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    icon?: string;
    color?: string;
    scheduledDays?: string;
  }>();

  const isEditing = !!params.id;
  const [name, setName] = useState(params.name ?? "");
  const [icon, setIcon] = useState(
    ICONS.includes(params.icon ?? "") ? params.icon! : ICONS[0],
  );
  const [color, setColor] = useState(
    COLORS.includes(params.color ?? "") ? params.color! : COLORS[0],
  );
  const [scheduledDays, setScheduledDays] = useState<number[]>(
    params.scheduledDays
      ? params.scheduledDays.split(",").map(Number)
      : [0, 1, 2, 3, 4, 5, 6],
  );

  const { addHabit, updateHabit } = useStore();
  const router = useRouter();
  const theme = useTheme(useStore((s) => s.theme));

  const toggleDay = (day: number) => {
    setScheduledDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleSave = () => {
    if (name.trim().length < 2)
      return Alert.alert(
        "Name too short",
        "Please enter at least 2 characters.",
      );
    if (scheduledDays.length === 0)
      return Alert.alert(
        "No days selected",
        "Please select at least one day per week.",
      );

    if (isEditing) {
      updateHabit(params.id!, {
        name: name.trim(),
        icon,
        color,
        scheduledDays,
      });
    } else {
      addHabit({ name: name.trim(), icon, color, scheduledDays });
    }
    router.back();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.label, { color: theme.text }]}>Habit Name</Text>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: theme.inputBg, color: theme.text },
        ]}
        placeholder="e.g., Meditate 5 mins"
        placeholderTextColor={theme.textMuted}
        value={name}
        onChangeText={setName}
        maxLength={30}
        autoFocus
      />

      <Text style={[styles.label, { color: theme.text }]}>Icon</Text>
      <View style={styles.grid}>
        {ICONS.map((i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setIcon(i)}
            style={[
              styles.option,
              {
                backgroundColor: theme.iconBg,
                borderColor: icon === i ? theme.text : theme.cardBorder,
              },
            ]}
            hitSlop={8}
            accessibilityLabel={`Select ${i} icon`}
            accessibilityRole="button"
          >
            <Ionicons
              name={i as any}
              size={24}
              color={icon === i ? theme.text : theme.textMuted}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, { color: theme.text }]}>Color</Text>
      <View style={styles.grid}>
        {COLORS.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setColor(c)}
            style={[
              styles.colorBtn,
              { backgroundColor: c },
              color === c && styles.selectedColor,
            ]}
            hitSlop={8}
            accessibilityLabel={`Select ${c} color`}
            accessibilityRole="button"
          />
        ))}
      </View>

      <Text style={[styles.label, { color: theme.text }]}>Schedule</Text>
      <Text style={[styles.subLabel, { color: theme.textMuted }]}>
        Select which days this habit is active
      </Text>
      <View style={styles.daysRow}>
        {DAYS.map((day, index) => {
          const active = scheduledDays.includes(index);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => toggleDay(index)}
              style={[
                styles.dayBtn,
                {
                  backgroundColor: active ? color : theme.btnSecondaryBg,
                  borderColor: active ? color : theme.cardBorder,
                },
              ]}
              hitSlop={8}
              accessibilityLabel={`${active ? "Remove" : "Add"} ${day} schedule`}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.dayText,
                  { color: active ? "#fff" : theme.textMuted },
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.saveBtn, { backgroundColor: theme.accent }]}
        onPress={handleSave}
        hitSlop={12}
      >
        <Text style={styles.saveText}>
          {isEditing ? "Save Changes" : "Create Habit"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
  },
  subLabel: {
    fontSize: 13,
    marginBottom: 8,
  },
  input: {
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    minHeight: 48,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 8 },
  option: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  colorBtn: { width: 40, height: 40, borderRadius: 20 },
  selectedColor: {
    transform: [{ scale: 1.15 }],
    borderWidth: 3,
    borderColor: "#fff",
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  dayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "700",
  },
  saveBtn: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
