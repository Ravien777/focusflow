import { useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "../../src/store/useStore";
import { useTheme } from "../../src/theme";
import { TEMPLATES, TemplateSet } from "../../src/constants/templates";
import { TemplateCard } from "../../src/components/TemplateCard";

export default function TemplatesScreen() {
  const addHabit = useStore((s) => s.addHabit);
  const habits = useStore((s) => s.habits);
  const router = useRouter();
  const theme = useTheme(useStore((s) => s.theme));

  const handleInstall = useCallback(
    (template: TemplateSet) => {
      const existingNames = new Set(habits.map((h) => h.name.toLowerCase()));
      const newHabits = template.habits.filter(
        (h) => !existingNames.has(h.name.toLowerCase()),
      );

      if (newHabits.length === 0) {
        Alert.alert("Already Installed", "You already have all these habits.");
        return;
      }

      newHabits.forEach((h) => addHabit(h));
      Alert.alert(
        "Template Installed!",
        `${newHabits.length} habit${newHabits.length !== 1 ? "s" : ""} added to your dashboard.`,
        [{ text: "OK", onPress: () => router.back() }],
      );
    },
    [addHabit, habits, router],
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={12}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>
          Habit Templates
        </Text>
      </View>
      <Text style={[styles.subtitle, { color: theme.textMuted }]}>
        Pick a template to get started quickly. Only new habits will be added.
      </Text>

      {TEMPLATES.map((t) => (
        <TemplateCard
          key={t.id}
          template={t}
          onInstall={() => handleInstall(t)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "800" },
  subtitle: { fontSize: 14, marginBottom: 20, lineHeight: 20 },
});
