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
import { useTheme } from "../../src/theme";
import { HabitCard } from "../../src/components/HabitCard";
import { canAddHabit, FREE_HABIT_LIMIT } from "../../src/utils/subscription";

export default function HomeScreen() {
  const habits = useStore((state) => state.habits);
  const seedHabits = useStore((state) => state.seedHabits);
  const isPremium = useStore((state) => state.isPremium);
  const router = useRouter();
  const theme = useTheme(useStore((s) => s.theme));

  const hasSeeded = useRef(false);

  useEffect(() => {
    if (!hasSeeded.current) {
      seedHabits();
      hasSeeded.current = true;
    }
  }, [seedHabits]);

  const activeHabits = habits.filter((h) => !h.archived);
  const atLimit = !isPremium && activeHabits.length >= FREE_HABIT_LIMIT;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>FocusFlow</Text>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: theme.accent }]}
          onPress={() => {
            if (atLimit) {
              router.push("/(paywall)");
            } else {
              router.push("/habit/add");
            }
          }}
          hitSlop={12}
          accessibilityLabel="Add new habit"
          accessibilityRole="button"
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {!isPremium && (
        <View style={[styles.banner, { backgroundColor: `${theme.accent}15`, borderColor: theme.accent }]}>
          <Ionicons name="diamond-outline" size={16} color={theme.accent} />
          <Text style={[styles.bannerText, { color: theme.accent }]}>
            {activeHabits.length}/{FREE_HABIT_LIMIT} free habits used
          </Text>
          <TouchableOpacity onPress={() => router.push("/(paywall)")}>
            <Text style={[styles.bannerLink, { color: theme.accent }]}>
              Upgrade
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {activeHabits.map((h) => (
          <HabitCard key={h.id} habit={h} />
        ))}
        {activeHabits.length === 0 && (
          <Text style={[styles.empty, { color: theme.textMuted }]}>
            Tap + to add your first habit
          </Text>
        )}
        <TouchableOpacity
          style={styles.templatesLink}
          onPress={() => router.push("/habit/templates")}
          activeOpacity={0.7}
        >
          <Ionicons name="grid-outline" size={16} color={theme.accent} />
          <Text style={[styles.templatesLinkText, { color: theme.accent }]}>
            Browse Templates
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: "800" },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  bannerText: { flex: 1, fontSize: 13, fontWeight: "600" },
  bannerLink: { fontSize: 13, fontWeight: "700" },
  list: { paddingBottom: 100 },
  empty: { textAlign: "center", marginTop: 40, fontSize: 16 },
  templatesLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 24,
    paddingVertical: 12,
  },
  templatesLinkText: { fontSize: 15, fontWeight: "600" },
});
