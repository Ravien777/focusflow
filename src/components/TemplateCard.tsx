import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme";
import { useStore } from "../store/useStore";
import { TemplateSet } from "../constants/templates";

interface TemplateCardProps {
  template: TemplateSet;
  onInstall: () => void;
}

export const TemplateCard = ({ template, onInstall }: TemplateCardProps) => {
  const theme = useTheme(useStore((s) => s.theme));

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: `${theme.accent}20` }]}>
          <Ionicons name={template.icon as any} size={28} color={theme.accent} />
        </View>
        <View style={styles.info}>
          <Text style={[styles.title, { color: theme.text }]}>{template.title}</Text>
          <Text style={[styles.desc, { color: theme.textMuted }]}>
            {template.description}
          </Text>
          <Text style={[styles.count, { color: theme.textMuted }]}>
            {template.habits.length} habits
          </Text>
        </View>
      </View>

      <View style={styles.habitList}>
        {template.habits.map((h, i) => (
          <View key={i} style={styles.habitRow}>
            <Ionicons name={h.icon as any} size={16} color={h.color} />
            <Text style={[styles.habitName, { color: theme.text }]}>{h.name}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.installBtn, { backgroundColor: theme.accent }]}
        onPress={onInstall}
        activeOpacity={0.8}
      >
        <Ionicons name="download-outline" size={18} color="#fff" />
        <Text style={styles.installText}>Install Template</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  info: { flex: 1 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 2 },
  desc: { fontSize: 14, marginBottom: 2 },
  count: { fontSize: 12, marginTop: 2 },
  habitList: {
    gap: 8,
    marginBottom: 16,
  },
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  habitName: { fontSize: 15, fontWeight: "500" },
  installBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    borderRadius: 12,
  },
  installText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
