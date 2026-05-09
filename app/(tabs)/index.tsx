import { useEffect, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useStore } from "../../src/store/useStore";
import { HabitCard } from "../../src/components/HabitCard";

export default function HomeScreen() {
  const habits = useStore((state) => state.habits);
  const seedHabits = useStore((state) => state.seedHabits);
  const router = useRouter();

  // useRef survives re-renders without triggering them
  const hasSeeded = useRef(false);

  // Runs exactly once when the app opens
  useEffect(() => {
    if (!hasSeeded.current) {
      seedHabits();
      hasSeeded.current = true;
    }
  }, [seedHabits]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FocusFlow</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push("/habit/add")}
          hitSlop={12}
          accessibilityLabel="Add new habit"
          accessibilityRole="button"
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {habits.map((h) => (
          <HabitCard key={h.id} habit={h} />
        ))}
        {habits.length === 0 && (
          <Text style={styles.empty}>Tap + to add your first habit</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: "800", color: "#fff" },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },
  list: { paddingBottom: 100 },
  empty: { textAlign: "center", color: "#666", marginTop: 40, fontSize: 16 },
});
