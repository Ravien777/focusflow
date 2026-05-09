import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // ✅ Import the icon component
import { useStore } from "../../src/store/useStore";

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

export default function AddHabitScreen() {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const { addHabit } = useStore();
  const router = useRouter();

  const handleSave = () => {
    if (name.trim().length < 2)
      return Alert.alert(
        "Name too short",
        "Please enter at least 2 characters.",
      );
    addHabit({ name: name.trim(), icon, color });
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Habit Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Meditate 5 mins"
        placeholderTextColor="#666"
        value={name}
        onChangeText={setName}
        maxLength={30}
        autoFocus
      />

      <Text style={styles.label}>Icon</Text>
      <View style={styles.grid}>
        {ICONS.map((i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setIcon(i)}
            style={[styles.option, icon === i && styles.selected]}
            hitSlop={8}
            accessibilityLabel={`Select ${i} icon`}
            accessibilityRole="button"
          >
            {/* ✅ FIX: Use Ionicons component instead of Text */}
            <Ionicons
              name={i as any}
              size={24}
              color={icon === i ? "#fff" : "#aaa"}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Color</Text>
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

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}
        hitSlop={12}
      >
        <Text style={styles.saveText}>Create Habit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#000", paddingTop: 50 },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#111",
    color: "#fff",
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
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  selected: {
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#222",
  },
  colorBtn: { width: 40, height: 40, borderRadius: 20 },
  selectedColor: {
    transform: [{ scale: 1.15 }],
    borderWidth: 3,
    borderColor: "#fff",
  },
  saveBtn: {
    marginTop: 24,
    backgroundColor: "#3B82F6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
